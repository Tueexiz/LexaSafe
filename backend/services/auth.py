import os
import time
import uuid
import hashlib
import secrets
from typing import Optional

from authlib.jose import JsonWebEncryption
from config import settings
from security import hash_password, verify_password, verify_totp_code, validate_phone_number_e164

JWE = JsonWebEncryption()
JWE_ALG = {"alg": "dir", "enc": "A256GCM"}


def _jwe_key() -> bytes:
    return hashlib.sha256(settings.jwe_secret_key.encode()).digest()


def create_session_jwe(user_id: str, org_id: str | None, role: str) -> str:
    payload = {
        "sub": user_id,
        "org": org_id or "",
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + 900,
        "jti": str(uuid.uuid4()),
    }
    return JWE.serialize_compact(JWE_ALG, payload, _jwe_key())


def decode_session_jwe(token: str) -> Optional[dict]:
    try:
        data = JWE.deserialize_compact(token, _jwe_key())
        claims = data["payload"]
        if claims.get("exp", 0) < time.time():
            return None
        return claims
    except Exception:
        return None


def create_a2f_challenge(user_id: str) -> str:
    return str(uuid.uuid4())


def generate_reset_token() -> tuple[str, str]:
    raw = secrets.token_urlsafe(32)
    hashed = hashlib.sha256(raw.encode()).hexdigest()
    return raw, hashed


def verify_reset_token(raw: str, stored_hash: str) -> bool:
    return secrets.compare_digest(hashlib.sha256(raw.encode()).hexdigest(), stored_hash)


__all__ = [
    "hash_password",
    "verify_password",
    "verify_totp_code",
    "validate_phone_number_e164",
    "create_session_jwe",
    "decode_session_jwe",
    "create_a2f_challenge",
    "generate_reset_token",
    "verify_reset_token",
]
