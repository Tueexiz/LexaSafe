from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

from security import validate_phone_number_e164
from services.phone import rate_limit, generate_phone_otp
from services.mail import send_phone_otp

router = APIRouter(prefix="/api/demo", tags=["demo"])


class DemoRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255)
    siren: str = Field(..., pattern=r"^\d{9}$")
    email: EmailStr
    phone: str = Field(..., max_length=20)
    message: str = Field(default="", max_length=2000)


@router.post("/request")
async def demo_request(req: DemoRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if not await rate_limit(f"demo:ip:{client_ip}", 3, 3600):
        raise HTTPException(429, "Trop de demandes. Réessayez dans 1 heure.")

    if not validate_phone_number_e164(req.phone):
        raise HTTPException(400, "Numéro de téléphone invalide. Mobile certifié requis (pas de VoIP).")

    otp = await generate_phone_otp(req.phone)
    await send_phone_otp(req.email, req.phone, otp)

    return {
        "status": "received",
        "message": "Demande enregistrée. Un code de validation téléphone a été envoyé.",
        "reference": f"demo-{req.siren[:4]}",
    }
