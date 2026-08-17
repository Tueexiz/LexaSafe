import json
import time
from typing import Any
import redis.asyncio as aioredis
from config import is_production, settings

_redis: aioredis.Redis | None = None
_redis_down_until: float = 0.0
_mem_counters: dict[str, tuple[int, float]] = {}
_mem_kv: dict[str, tuple[str, float]] = {}

class RedisUnavailableError(Exception):
    pass

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
