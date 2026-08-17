import json
import secrets
import time
from typing import Any

import redis.asyncio as aioredis
from config import is_production, settings

_redis: aioredis.Redis | None = None
_redis_down_until: float = 0.0

# Fallback in-memory (dev local sans Redis) — évite tout crash si Redis absent.
_mem_counters: dict[str, tuple[int, float]] = {}
_mem_kv: dict[str, tuple[str, float]] = {}


class RedisUnavailableError(Exception):
    """Redis injoignable — fail-closed en production."""


A2F_CHALLENGE_PREFIX = "a2f_challenge:"
A2F_CHALLENGE_TTL = 300


def _mark_redis_down() -> None:
    global _redis_down_until
    if not is_production():
        _redis_down_until = time.time() + 30


def _dev_memory_only() -> bool:
    return (not is_production()) and time.time() < _redis_down_until


async def get_redis() -> aioredis.Redis:
    global _redis
    if not _redis:
        _redis = aioredis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
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
    if _dev_memory_only():
        return _mem_rate_limit(key, limit, window)
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
        _mark_redis_down()
        return _mem_rate_limit(key, limit, window)


def _mem_get(key: str) -> str | None:
    entry = _mem_kv.get(key)
    if not entry:
        return None
    value, expires_at = entry
    if time.time() > expires_at:
        _mem_kv.pop(key, None)
        return None
    return value


async def store_a2f_challenge(
    challenge_id: str,
    payload: dict[str, Any],
    ttl: int = A2F_CHALLENGE_TTL,
) -> None:
    """Stocke le challenge A2F : Redis obligatoire en prod, mémoire TTL en dev."""
    key = f"{A2F_CHALLENGE_PREFIX}{challenge_id}"
    raw = json.dumps(payload)
    if _dev_memory_only():
        _mem_kv[key] = (raw, time.time() + ttl)
        return
    try:
        r = await get_redis()
        await r.setex(key, ttl, raw)
    except Exception as exc:
        if is_production():
            raise RedisUnavailableError("Redis indisponible") from exc
        _mark_redis_down()
        _mem_kv[key] = (raw, time.time() + ttl)


async def get_a2f_challenge(challenge_id: str) -> dict[str, Any] | None:
    key = f"{A2F_CHALLENGE_PREFIX}{challenge_id}"
    raw: str | None
    if _dev_memory_only():
        raw = _mem_get(key)
    else:
        try:
            r = await get_redis()
            raw = await r.get(key)
        except Exception as exc:
            if is_production():
                raise RedisUnavailableError("Redis indisponible") from exc
            _mark_redis_down()
            raw = _mem_get(key)
    if not raw:
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    return data if isinstance(data, dict) else None


async def delete_a2f_challenge(challenge_id: str) -> None:
    key = f"{A2F_CHALLENGE_PREFIX}{challenge_id}"
    if _dev_memory_only():
        _mem_kv.pop(key, None)
        return
    try:
        r = await get_redis()
        await r.delete(key)
    except Exception as exc:
        if is_production():
            raise RedisUnavailableError("Redis indisponible") from exc
        _mark_redis_down()
        _mem_kv.pop(key, None)


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
