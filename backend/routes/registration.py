"""
LEXASAFE FRANCE - INSCRIPTIONS SOUVERAINES (ENTREPRISE & OPJ)
Contrôles anti-fraude + revue manuelle administrateur avant activation du compte.
"""

import uuid
from typing import Optional, Literal, Dict, Any

from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel, EmailStr, Field

from db import local_db
from security import (
    validate_opj_professional_email,
    validate_professional_email,
    validate_phone_number_e164,
    validate_siren_siret,
    verify_session_token,
    is_admin_vpn_authorized,
    hash_password,
)
from services.phone import rate_limit
from services.registration_store import (
    create_request,
    get_request,
    list_requests,
    update_status,
)

router = APIRouter(prefix="/api/registration", tags=["registration"])


# ---------------------------------------------------------------------------
# Modèles
# ---------------------------------------------------------------------------
class OPJRegistration(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    prenom: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    matricule: str = Field(..., min_length=3, max_length=50)
    unite: str = Field(..., min_length=2, max_length=200)
    grade: str = Field(..., min_length=2, max_length=100)
    telephone: str = Field(..., max_length=20)
    reference_procedure: str = Field(default="", max_length=500)
    website: str = Field(default="", max_length=0)  # honeypot : doit rester vide


class EntrepriseRegistration(BaseModel):
    secteur: Literal["prive", "public"]
    entite: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    telephone: str = Field(..., max_length=20)
    contact_nom: str = Field(..., min_length=2, max_length=150)
    contact_fonction: str = Field(..., min_length=2, max_length=150)
    besoin: str = Field(default="", max_length=2000)
    website: str = Field(default="", max_length=0)  # honeypot

    # Secteur privé
    siren: Optional[str] = Field(default=None, max_length=20)
    forme_juridique: Optional[str] = Field(default=None, max_length=100)
    rcs: Optional[str] = Field(default=None, max_length=100)
    volume: Optional[str] = Field(default=None, max_length=100)

    # Secteur public
    type_organisme: Optional[str] = Field(default=None, max_length=100)
    rattachement: Optional[str] = Field(default=None, max_length=255)
    siret: Optional[str] = Field(default=None, max_length=20)
    referent_rgpd: Optional[str] = Field(default=None, max_length=150)
    acte_designation: Optional[str] = Field(default=None, max_length=255)


class AdminReview(BaseModel):
    note: str = Field(default="", max_length=1000)


# ---------------------------------------------------------------------------
# Sécurité admin
# ---------------------------------------------------------------------------
def require_admin(request: Request, authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Autorise la revue si :
    - la requête provient du VPN admin / loopback (dev local), OU
    - un token de session super_admin valide est fourni.
    """
    client_ip = request.client.host if request.client else ""
    if is_admin_vpn_authorized(client_ip):
        return {"admin": "vpn_or_loopback", "ip": client_ip}
    if authorization:
        payload = verify_session_token(authorization.replace("Bearer ", "").strip())
        if payload and payload.get("role") == "super_admin":
            return payload
    raise HTTPException(status_code=403, detail="Accès administrateur requis")


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


# ---------------------------------------------------------------------------
# Inscription OPJ
# ---------------------------------------------------------------------------
@router.post("/opj")
async def register_opj(req: OPJRegistration, request: Request):
    if req.website:
        raise HTTPException(status_code=400, detail="Requête invalide.")

    ip = _client_ip(request)
    if not await rate_limit(f"reg:opj:ip:{ip}", 5, 3600):
        raise HTTPException(status_code=429, detail="Trop de demandes. Réessayez dans 1 heure.")

    if not validate_opj_professional_email(req.email):
        raise HTTPException(
            status_code=400,
            detail="Email professionnel invalide. Une adresse @*.gouv.fr est requise.",
        )
    if not validate_phone_number_e164(req.telephone):
        raise HTTPException(
            status_code=400,
            detail="Numéro de téléphone invalide. Mobile/fixe certifié requis (pas de VoIP).",
        )

    payload = req.model_dump(exclude={"website"})
    request_id = create_request("opj", payload)

    return {
        "status": "pending_review",
        "reference": f"OPJ-{request_id[:8].upper()}",
        "message": "Demande transmise. Validation manuelle par un administrateur sous 48h ouvrées.",
    }


# ---------------------------------------------------------------------------
# Inscription Entreprise (privé / public)
# ---------------------------------------------------------------------------
@router.post("/entreprise")
async def register_entreprise(req: EntrepriseRegistration, request: Request):
    if req.website:
        raise HTTPException(status_code=400, detail="Requête invalide.")

    ip = _client_ip(request)
    if not await rate_limit(f"reg:ent:ip:{ip}", 5, 3600):
        raise HTTPException(status_code=429, detail="Trop de demandes. Réessayez dans 1 heure.")

    if not validate_professional_email(req.email):
        raise HTTPException(
            status_code=400,
            detail="Email professionnel requis (les adresses grand public sont refusées).",
        )
    if not validate_phone_number_e164(req.telephone):
        raise HTTPException(
            status_code=400,
            detail="Numéro de téléphone invalide. Ligne professionnelle certifiée requise (pas de VoIP).",
        )

    if req.secteur == "prive":
        if not req.siren or not validate_siren_siret(req.siren):
            raise HTTPException(status_code=400, detail="SIREN/SIRET invalide (contrôle Luhn échoué).")
        req_type = "entreprise_prive"
    else:
        if not req.siret or not validate_siren_siret(req.siret):
            raise HTTPException(status_code=400, detail="SIRET de l'entité publique invalide (contrôle Luhn échoué).")
        if not req.referent_rgpd or not req.acte_designation:
            raise HTTPException(
                status_code=400,
                detail="Le référent RGPD désigné et la référence de l'acte de désignation sont obligatoires.",
            )
        req_type = "entreprise_public"

    payload = req.model_dump(exclude={"website"})
    request_id = create_request(req_type, payload)

    return {
        "status": "pending_review",
        "reference": f"ENT-{request_id[:8].upper()}",
        "message": "Demande de devis / d'accès transmise. Notre équipe revient vers vous sous 48h ouvrées.",
    }


# ---------------------------------------------------------------------------
# Revue administrateur
# ---------------------------------------------------------------------------
def _provision_account(record: Dict[str, Any]) -> Dict[str, Any]:
    """Crée le compte correspondant à une demande approuvée (base locale)."""
    payload = record.get("payload", {})
    email = str(payload.get("email", "")).strip().lower()

    if record["type"] == "opj":
        user_id = f"usr-opj-{uuid.uuid4().hex[:6]}"
        local_db["users"][email] = {
            "id": user_id,
            "email": email,
            "name": f"{payload.get('grade', '')} {payload.get('prenom', '')} {payload.get('nom', '')}".strip(),
            "role": "opj_investigator",
            "service": payload.get("unite", ""),
            "matricule": payload.get("matricule", ""),
            "password": hash_password("SecuredPass2026!"),
            "is_verified": True,
            "totp_secret": "",
        }
        return {"user_id": user_id, "email": email, "role": "opj_investigator"}

    # Entreprise (privé ou public)
    org_id = f"org-{uuid.uuid4().hex[:8]}"
    local_db["organizations"][org_id] = {
        "id": org_id,
        "siren": payload.get("siren") or payload.get("siret") or "",
        "company_name": payload.get("entite", ""),
        "legal_dpo_email": email,
        "contact_phone": payload.get("telephone", ""),
        "sector": "public" if record["type"] == "entreprise_public" else "prive",
        "is_active": True,
        "plan": "En cours de qualification (Devis)",
    }
    user_id = f"usr-dpo-{uuid.uuid4().hex[:6]}"
    local_db["users"][email] = {
        "id": user_id,
        "email": email,
        "name": f"{payload.get('contact_nom', '')} ({payload.get('contact_fonction', '')})".strip(),
        "organization_id": org_id,
        "role": "dpo_enterprise",
        "password": hash_password("SecuredPass2026!"),
        "is_verified": True,
        "totp_secret": "",
    }
    return {"user_id": user_id, "email": email, "organization_id": org_id, "role": "dpo_enterprise"}


@router.get("/admin/pending")
async def admin_pending(request: Request, authorization: Optional[str] = Header(None)):
    require_admin(request, authorization)
    pending = list_requests(status="pending_review")
    return {"count": len(pending), "requests": pending}


@router.get("/admin/all")
async def admin_all(request: Request, authorization: Optional[str] = Header(None)):
    require_admin(request, authorization)
    every = list_requests()
    return {"count": len(every), "requests": every}


@router.post("/admin/{request_id}/approve")
async def admin_approve(
    request_id: str,
    body: AdminReview,
    request: Request,
    authorization: Optional[str] = Header(None),
):
    admin = require_admin(request, authorization)
    record = get_request(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Demande introuvable.")
    if record.get("status") != "pending_review":
        raise HTTPException(status_code=409, detail=f"Demande déjà traitée ({record.get('status')}).")

    account = _provision_account(record)
    reviewer = admin.get("email") or admin.get("admin", "admin")
    update_status(request_id, "approved", reviewer=reviewer, note=body.note)

    return {"status": "approved", "account": account}


@router.post("/admin/{request_id}/reject")
async def admin_reject(
    request_id: str,
    body: AdminReview,
    request: Request,
    authorization: Optional[str] = Header(None),
):
    admin = require_admin(request, authorization)
    record = get_request(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Demande introuvable.")
    if record.get("status") != "pending_review":
        raise HTTPException(status_code=409, detail=f"Demande déjà traitée ({record.get('status')}).")

    reviewer = admin.get("email") or admin.get("admin", "admin")
    update_status(request_id, "rejected", reviewer=reviewer, note=body.note)
    return {"status": "rejected"}
