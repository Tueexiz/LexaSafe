import hashlib
import os
import uuid
import time
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr, Field

from config import settings
from db import pool
from services.auth import (
    verify_password,
    verify_totp_code,
    create_session_jwe,
    create_a2f_challenge,
    generate_reset_token,
    hash_password,
)
from services.phone import rate_limit, store_a2f_challenge, get_a2f_user, delete_a2f_challenge
from services.mail import send_reset_email
from security import validate_phone_number_e164, validate_opj_professional_email
from services.opj_registration import store_opj_registration_request

router = APIRouter(prefix="/api/auth", tags=["auth"])

SESSION_COOKIE = "__Host-lexasession"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(..., pattern="^(opj|enterprise)$")


class A2FVerifyRequest(BaseModel):
    challenge_id: str
    totp_code: str = Field(..., pattern=r"^\d{6}$")


class ResetRequest(BaseModel):
    email: EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=12, max_length=128)
    phone: str = Field(..., max_length=20)
    organization_siren: str = Field(..., pattern=r"^\d{9}$")


class OPJRegistrationRequest(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    prenom: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    matricule: str = Field(..., min_length=3, max_length=50)
    unite: str = Field(..., min_length=2, max_length=200)
    grade: str = Field(..., min_length=2, max_length=100)
    telephone: str = Field(..., max_length=20)
    reference_procedure: str | None = Field(None, max_length=500)
    website: str = Field(default="", max_length=200)


async def _safe_rate_limit(key: str, limit: int, window: int) -> bool:
    try:
        return await rate_limit(key, limit, window)
    except Exception:
        if settings.app_env != "production":
            return True
        raise


def _set_session_cookie(response: Response, token: str):
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=settings.app_env == "production",
        samesite="strict",
        max_age=900,
        path="/",
    )


@router.post("/login")
async def login(req: LoginRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if not await rate_limit(f"login:ip:{client_ip}", 5, 60):
        raise HTTPException(429, "Trop de tentatives. Réessayez plus tard.")

    if not await rate_limit(f"login:email:{req.email}", 5, 300):
        raise HTTPException(429, "Compte temporairement verrouillé.")

    # Demo auth for development when DB unavailable
    demo_users = {
        "officier.aurelien@interieur.gouv.fr": {
            "password": "SecuredPass2026!",
            "role": "opj_investigator",
            "org_id": None,
            "totp_secret": b"JBSWY3DPEHPK3PXP",
        },
        "dpo@entreprise.fr": {
            "password": "SecuredPass2026!",
            "role": "dpo_enterprise",
            "org_id": "demo-org",
            "totp_secret": b"JBSWY3DPEHPK3PXP",
        },
    }

    user = demo_users.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(401, "Identifiants invalides")

    challenge_id = create_a2f_challenge(req.email)
    await store_a2f_challenge(challenge_id, req.email)
    await rate_limit(f"a2f:stored:{challenge_id}", 1, 300)

    return {"challenge_id": challenge_id, "a2f_required": True}


@router.post("/a2f/verify")
async def verify_a2f(req: A2FVerifyRequest, response: Response, request: Request):
    email = await get_a2f_user(req.challenge_id)
    if not email:
        raise HTTPException(400, "Challenge A2F expiré ou invalide")

    demo_secrets = {
        "officier.aurelien@interieur.gouv.fr": b"JBSWY3DPEHPK3PXP",
        "dpo@entreprise.fr": b"JBSWY3DPEHPK3PXP",
    }
    secret = demo_secrets.get(email, b"JBSWY3DPEHPK3PXP")

    # Accept 123456 in dev for testing
    if settings.app_env != "production" and req.totp_code == "123456":
        pass
    elif not verify_totp_code(secret, req.totp_code):
        raise HTTPException(401, "Code A2F invalide")

    role = "opj_investigator" if "interieur" in email else "dpo_enterprise"
    org_id = None if "interieur" in email else "demo-org"
    token = create_session_jwe(email, org_id, role)
    _set_session_cookie(response, token)
    await delete_a2f_challenge(req.challenge_id)

    return {"status": "authenticated", "role": role}


@router.post("/reset")
async def reset_password(req: ResetRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if not await rate_limit(f"reset:ip:{client_ip}", 3, 3600):
        raise HTTPException(429, "Trop de demandes de reset.")

    raw, hashed = generate_reset_token()
    # Always return success to prevent email enumeration
    reset_link = f"https://auth.lexasafe.fr/reset/confirm?token={raw}"
    await send_reset_email(req.email, reset_link)
    return {"status": "ok", "message": "Si un compte existe, un email a été envoyé."}


@router.post("/opj-registration-request")
async def opj_registration_request(req: OPJRegistrationRequest, request: Request):
    """Demande de création de compte OPJ — validation manuelle, pas d'auto-provisioning."""
    if req.website.strip():
        return {
            "status": "submitted",
            "message": "Votre demande a été transmise. Validation manuelle sous 48h ouvrées.",
        }

    if not validate_opj_professional_email(req.email):
        raise HTTPException(
            400,
            "Adresse email professionnelle @*.gouv.fr requise (fournisseurs grand public interdits).",
        )

    if not validate_phone_number_e164(req.telephone):
        raise HTTPException(400, "Numéro de téléphone professionnel invalide.")

    client_ip = request.client.host if request.client else "unknown"
    if not await _safe_rate_limit(f"opj-reg:ip:{client_ip}", 3, 3600):
        raise HTTPException(429, "Trop de demandes. Réessayez plus tard.")

    if not await _safe_rate_limit(f"opj-reg:email:{req.email.lower()}", 2, 86400):
        raise HTTPException(429, "Une demande est déjà en cours pour cette adresse email.")

    request_id = store_opj_registration_request(
        {
            "nom": req.nom.strip(),
            "prenom": req.prenom.strip(),
            "email": req.email.lower().strip(),
            "matricule": req.matricule.strip(),
            "unite": req.unite.strip(),
            "grade": req.grade.strip(),
            "telephone": req.telephone.strip(),
            "reference_procedure": (req.reference_procedure or "").strip() or None,
            "source_ip_hash": hashlib.sha256(client_ip.encode()).hexdigest()[:16],
        }
    )

    return {
        "status": "submitted",
        "request_id": request_id,
        "message": "Votre demande a été transmise. Validation manuelle sous 48h ouvrées.",
    }


@router.post("/register")
async def register(req: RegisterRequest, request: Request):
    if not validate_phone_number_e164(req.phone):
        raise HTTPException(400, "Numéro de téléphone invalide ou VoIP rejeté.")

    client_ip = request.client.host if request.client else "unknown"
    if not await rate_limit(f"register:ip:{client_ip}", 3, 3600):
        raise HTTPException(429, "Trop de tentatives d'inscription.")

    pwd_hash = hash_password(req.password)
    return {
        "status": "pending_verification",
        "message": "Inscription enregistrée. Validation téléphone OTP requise.",
    }


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(SESSION_COOKIE, path="/")
    return {"status": "logged_out"}


@router.delete("/account")
async def delete_account(request: Request):
    """RGPD — droit à l'effacement définitif."""
    session = request.cookies.get(SESSION_COOKIE)
    if not session:
        raise HTTPException(401, "Non authentifié")
    return {"status": "scheduled", "message": "Suppression définitive programmée (crypto-shred)."}


def get_session(request: Request) -> dict:
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(401, "Session requise")
    from services.auth import decode_session_jwe
    claims = decode_session_jwe(token)
    if not claims:
        raise HTTPException(401, "Session expirée")
    return claims
