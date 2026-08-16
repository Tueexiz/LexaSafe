import secrets
import time
import redis.asyncio as aioredis
from config import settings

_redis: aioredis.Redis | None = None

# Fallback in-memory (dev local sans Redis) — évite tout crash si Redis absent.
_mem_counters: dict[str, tuple[int, float]] = {}
_mem_kv: dict[str, tuple[str, float]] = {}


async def get_redis() -> aioredis.Redis:
    global _redis
    if not _redis:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis


def _mem_rate_limit(key: str, limit: int, window: int) -> bool:
    now = time.time()
    count, reset_at = _mem_counters.get(key, (0, now + window))
    if now > reset_at:
        count, reset_at = 0, now + window
    count += 1
    _mem_counters[key] = (count, reset_at)
    return count <= limit


async def rate_limit(key: str, limit: int, window: int) -> bool:
    """Returns True if allowed, False if rate limited. Bascule en mémoire si Redis indisponible."""
    try:
        r = await get_redis()
        current = await r.incr(key)
        if current == 1:
            await r.expire(key, window)
        if current > limit:
            overflow = current - limit
            backoff = window * (2 ** min(overflow, 5))
            await r.expire(key, backoff)
            return False
        return True
    except Exception:
        return _mem_rate_limit(key, limit, window)


async def store_a2f_challenge(challenge_id: str, user_id: str, ttl: int = 300):
    r = await get_redis()
    await r.setex(f"a2f:{challenge_id}", ttl, user_id)


async def get_a2f_user(challenge_id: str) -> str | None:
    r = await get_redis()
    return await r.get(f"a2f:{challenge_id}")


async def delete_a2f_challenge(challenge_id: str):
    r = await get_redis()
    await r.delete(f"a2f:{challenge_id}")


async def store_phone_otp(phone: str, otp: str, ttl: int = 300):
    try:
        r = await get_redis()
        await r.setex(f"phone_otp:{phone}", ttl, otp)
    except Exception:
        _mem_kv[f"phone_otp:{phone}"] = (otp, time.time() + ttl)


async def verify_phone_otp(phone: str, otp: str) -> bool:
    try:
        r = await get_redis()
        stored = await r.get(f"phone_otp:{phone}")
        if stored and secrets.compare_digest(stored, otp):
            await r.delete(f"phone_otp:{phone}")
            return True
        return False
    except Exception:
        entry = _mem_kv.get(f"phone_otp:{phone}")
        if not entry:
            return False
        value, expires_at = entry
        if time.time() > expires_at:
            _mem_kv.pop(f"phone_otp:{phone}", None)
            return False
        if secrets.compare_digest(value, otp):
            _mem_kv.pop(f"phone_otp:{phone}", None)
            return True
        return False


async def generate_phone_otp(phone: str) -> str:
    otp = f"{secrets.randbelow(900000) + 100000:06d}"
    await store_phone_otp(phone, otp)
    return otp
