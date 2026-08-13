import secrets
import redis.asyncio as aioredis
from config import settings

_redis: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if not _redis:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis


async def rate_limit(key: str, limit: int, window: int) -> bool:
    """Returns True if allowed, False if rate limited."""
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
    r = await get_redis()
    await r.setex(f"phone_otp:{phone}", ttl, otp)


async def verify_phone_otp(phone: str, otp: str) -> bool:
    r = await get_redis()
    stored = await r.get(f"phone_otp:{phone}")
    if stored and secrets.compare_digest(stored, otp):
        await r.delete(f"phone_otp:{phone}")
        return True
    return False


async def generate_phone_otp(phone: str) -> str:
    otp = f"{secrets.randbelow(900000) + 100000:06d}"
    await store_phone_otp(phone, otp)
    return otp
