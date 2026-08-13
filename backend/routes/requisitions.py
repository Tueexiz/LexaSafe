import hashlib
import time
import uuid
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Depends
from pydantic import BaseModel, Field

from api import RequisitionSubmitRequest, process_secure_requisition
from routes.auth import get_session
from services.phone import rate_limit

router = APIRouter(prefix="/api/requisitions", tags=["requisitions"])


class RequisitionListResponse(BaseModel):
    items: list[dict]


@router.get("")
async def list_requisitions(request: Request, session: dict = Depends(get_session)):
    # Return demo data — public_hash only, never internal UUID
    return {
        "items": [
            {
                "public_hash": hashlib.sha256(b"demo-req-1").hexdigest(),
                "status": "sealed",
                "legal_basis": "E_EVIDENCE_2026",
                "urgency_deadline": (datetime.now(timezone.utc) + timedelta(hours=8)).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "public_hash": hashlib.sha256(b"demo-req-2").hexdigest(),
                "status": "processing",
                "legal_basis": "CPP_60_1",
                "urgency_deadline": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
            },
        ]
    }


@router.post("")
async def submit_requisition(
    req: RequisitionSubmitRequest,
    request: Request,
    session: dict = Depends(get_session),
):
    client_ip = request.client.host if request.client else "unknown"
    if not await rate_limit(f"req:ip:{client_ip}", 10, 60):
        raise HTTPException(429, "Rate limit dépassé")

    payload = f"{req.opj_matricule}:{req.organization_siren}:{req.target_identifier}".encode()
    result = process_secure_requisition(req, payload)
    return {
        "public_hash": result.public_hash,
        "sha256_seal": result.sha256_seal,
        "status": result.status,
        "urgency_deadline": result.urgency_deadline,
        "status_message": result.status_message,
    }


@router.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    session: dict = Depends(get_session),
):
    from services.upload import scan_and_store
    client_ip = request.client.host if request.client else "unknown"
    if not await rate_limit(f"upload:ip:{client_ip}", 5, 300):
        raise HTTPException(429, "Trop d'uploads")

    if file.size and file.size > 50 * 1024 * 1024:
        raise HTTPException(413, "Fichier trop volumineux (max 50 Mo)")

    content = await file.read()
    result = await scan_and_store(content, file.filename or "upload")
    if not result["clean"]:
        raise HTTPException(400, "Fichier rejeté par le scan antivirus")

    return {"stored_path": result["path"], "public_ref": result["public_ref"]}
