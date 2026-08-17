import json
import time
from typing import Any
from config import is_production
from services.redis_client import get_redis, _dev_memory_only, _mark_redis_down, _mem_kv, RedisUnavailableError

A2F_CHALLENGE_PREFIX = "a2f_challenge:"
A2F_CHALLENGE_TTL = 300

def _mem_get(key: str) -> str | None:
    entry = _mem_kv.get(key)
    if not entry:
        return None
    value, expires_at = entry
    if time.time() > expires_at:
        _mem_kv.pop(key, None)
        return None
    return value

async def store_a2f_challenge(challenge_id: str, payload: dict[str, Any], ttl: int = A2F_CHALLENGE_TTL) -> None:
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
