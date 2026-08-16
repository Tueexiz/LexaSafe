"""
LEXASAFE FRANCE - STOCKAGE DES DEMANDES D'INSCRIPTION (OPJ & ENTREPRISE)
Persistance fichier JSON en attente de validation manuelle par un administrateur.
Workflow de statut : pending_review -> approved | rejected
"""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

# TODO: migrer vers PostgreSQL (table registration_requests) lorsque la DB est connectée.
STORAGE_DIR = Path(__file__).resolve().parent.parent / "data" / "registration_requests"

VALID_TYPES = {"opj", "entreprise_prive", "entreprise_public"}


def _ensure_storage_dir() -> Path:
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    return STORAGE_DIR


def _path(request_id: str) -> Path:
    return _ensure_storage_dir() / f"{request_id}.json"


def create_request(req_type: str, payload: dict) -> str:
    """Persiste une demande d'inscription en attente de validation manuelle."""
    request_id = str(uuid.uuid4())
    record = {
        "id": request_id,
        "type": req_type,
        "status": "pending_review",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "payload": payload,
    }
    _path(request_id).write_text(
        json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return request_id


def get_request(request_id: str) -> dict | None:
    filepath = _path(request_id)
    if not filepath.exists():
        return None
    try:
        return json.loads(filepath.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def list_requests(status: str | None = None) -> list[dict]:
    """Liste les demandes, éventuellement filtrées par statut (admin)."""
    results: list[dict] = []
    for filepath in sorted(_ensure_storage_dir().glob("*.json"), reverse=True):
        try:
            data = json.loads(filepath.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        if status is None or data.get("status") == status:
            results.append(data)
    return results


def update_status(
    request_id: str,
    status: str,
    reviewer: str | None = None,
    note: str | None = None,
) -> dict | None:
    """Met à jour le statut d'une demande (approved / rejected)."""
    data = get_request(request_id)
    if not data:
        return None
    data["status"] = status
    data["reviewed_at"] = datetime.now(timezone.utc).isoformat()
    if reviewer:
        data["reviewer"] = reviewer
    if note:
        data["review_note"] = note
    _path(request_id).write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return data
