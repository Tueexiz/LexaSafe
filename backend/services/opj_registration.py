import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from config import settings

# TODO: migrer vers PostgreSQL (table opj_registration_requests) lorsque la DB est connectée.
STORAGE_DIR = Path(__file__).resolve().parent.parent / "data" / "opj_registration_requests"


def _ensure_storage_dir() -> Path:
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    return STORAGE_DIR


def store_opj_registration_request(payload: dict) -> str:
    """Persiste une demande OPJ en attente de validation manuelle."""
    request_id = str(uuid.uuid4())
    record = {
        "id": request_id,
        "status": "pending_review",
        "created_at": datetime.now(timezone.utc).isoformat(),
        **payload,
    }
    storage_dir = _ensure_storage_dir()
    filepath = storage_dir / f"{request_id}.json"
    filepath.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    return request_id


def list_pending_requests() -> list[dict]:
    """Liste les demandes en attente (admin / dev)."""
    storage_dir = _ensure_storage_dir()
    requests: list[dict] = []
    for filepath in sorted(storage_dir.glob("*.json"), reverse=True):
        try:
            data = json.loads(filepath.read_text(encoding="utf-8"))
            if data.get("status") == "pending_review":
                requests.append(data)
        except (json.JSONDecodeError, OSError):
            continue
    return requests
