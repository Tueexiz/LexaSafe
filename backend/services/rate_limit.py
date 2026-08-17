import time
from services.redis_client import get_redis, _dev_memory_only, _mark_redis_down, _mem_counters

def _mem_rate_limit(key: str, limit: int, window: int) -> bool:
    now = time.time()
    count, reset_at = _mem_counters.get(key, (0, now + window))
    if now > reset_at:
        count, reset_at = 0, now + window
    count += 1
    _mem_counters[key] = (count, reset_at)
    return count <= limit

async def rate_limit(key: str, limit: int, window: int) -> bool:
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
