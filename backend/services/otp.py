import time
import secrets
from services.redis_client import get_redis, _mem_kv

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
