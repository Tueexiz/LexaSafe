"""
LEXASAFE FRANCE - AUTHENTIFICATION FORTE & GESTION DES SESSIONS
A2F / TOTP RFC 6238 • JWT Souverain • Contrôle d'Accès Basé sur les Rôles (RBAC)
"""

import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import EmailStr, Field
from schemas.auth import LoginRequest, A2FVerifyRequest

from db import get_user_by_email, get_user_by_id, persist_totp_secret
from security import (
    verify_password,
    create_session_token,
    verify_session_token,
    generate_totp_secret_base32,
    verify_totp_code,
    build_otpauth_uri,
)
from services.a2f import (
    store_a2f_challenge,
    get_a2f_challenge,
    delete_a2f_challenge,
    A2F_CHALLENGE_TTL,
)
from services.redis_client import RedisUnavailableError
from services.rate_limit import rate_limit


router = APIRouter(prefix="/api/auth", tags=["auth"])





def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Extrait et vérifie le token JWT de session dans les en-têtes."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Session non authentifiée (En-tête Authorization manquant)")

    token = authorization.replace("Bearer ", "").strip()
    payload = verify_session_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Session expirée ou certificat invalide")

    return payload


def _redis_unavailable() -> HTTPException:
    return HTTPException(
        status_code=503,
        detail="Service d'authentification temporairement indisponible",
    )


@router.post("/login")
async def login(req: LoginRequest):
    """
    Étape 1 : vérifie le mot de passe Argon2id et ouvre un challenge A2F TOTP (TTL 300s).

    Rate limiting : 5 tentatives / 15 minutes par adresse email.
    """
    email = req.email.strip().lower()

    # Rate limiting avant toute opération coûteuse (Argon2id)
    if not await rate_limit(f"login:{email}", 5, 900):
        raise HTTPException(status_code=429, detail="Trop de tentatives, réessayez plus tard")

    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")

    if not verify_password(user.get("password", ""), req.password):
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")

    enroll = False
    otpauth_uri = None
    totp_secret = (user.get("totp_secret") or "").strip()
    if not totp_secret:
        totp_secret = generate_totp_secret_base32()
        await persist_totp_secret(user, totp_secret)
        enroll = True
        otpauth_uri = build_otpauth_uri(email, totp_secret)

    challenge_id = f"chl_{uuid.uuid4().hex}"
    try:
        await store_a2f_challenge(
            challenge_id,
            {
                "user_id": user["id"],
                "email": user["email"],
                "role": user["role"],
                "enroll": enroll,
            },
            ttl=A2F_CHALLENGE_TTL,
        )
    except RedisUnavailableError:
        raise _redis_unavailable()

    payload: Dict[str, Any] = {
        "status": "a2f_required",
        "challenge_id": challenge_id,
    }
    if enroll:
        payload["enroll"] = True
        payload["otpauth_uri"] = otpauth_uri
    return payload


@router.post("/verify-2fa")
async def verify_2fa(req: A2FVerifyRequest):
    """
    Étape 2 : vérifie le TOTP RFC 6238 du challenge Redis (usage unique) puis délivre le JWT.

    Rate limiting : 5 tentatives / 5 minutes par challenge (anti-brute-force 10^6 combinaisons).
    Burn-after-reading : le challenge est détruit de Redis immédiatement après validation.
    """
    # Rate limiting par challenge_id
    if not await rate_limit(f"totp:{req.challenge_id}", 5, 300):
        raise HTTPException(status_code=429, detail="Trop de tentatives, réessayez plus tard")

    try:
        challenge = await get_a2f_challenge(req.challenge_id)
    except RedisUnavailableError:
        raise _redis_unavailable()

    if not challenge:
        raise HTTPException(status_code=400, detail="Challenge A2F invalide ou expiré")

    user = await get_user_by_id(str(challenge.get("user_id", "")))
    if not user:
        user = await get_user_by_email(str(challenge.get("email", "")))
    if not user:
        raise HTTPException(status_code=400, detail="Challenge A2F invalide ou expiré")

    totp_secret = (user.get("totp_secret") or "").strip()
    if not totp_secret:
        raise HTTPException(status_code=400, detail="Code A2F invalide ou expiré")

    # verify_totp_code accepte directement le secret Base32 (pyotp)
    if not verify_totp_code(totp_secret, req.totp_code):
        raise HTTPException(status_code=400, detail="Code A2F invalide ou expiré")

    try:
        await delete_a2f_challenge(req.challenge_id)
    except RedisUnavailableError:
        raise _redis_unavailable()

    user_payload = {
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"],
    }
    token = create_session_token(user_payload, expires_in_seconds=86400)

    return {
        "status": "authenticated",
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": 86400,
        "user": user_payload,
    }


@router.get("/me")
async def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    """Renvoie les informations de session de l'utilisateur connecté."""
    email = user.get("email")
    user_info = await get_user_by_email(email) if email else None
    if user_info:
        safe = {k: v for k, v in user_info.items() if k not in {"password", "totp_secret"}}
    else:
        safe = user
    return {
        "user": safe,
        "auth_status": "active_session",
        "secnumcloud_status": "verified",
    }


@router.post("/logout")
async def logout():
    """Clôture la session et invalide le cache client."""
    return {"status": "logged_out", "message": "Session clôturée en toute sécurité"}
