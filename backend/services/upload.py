import os
import uuid
import hashlib
from config import settings

ALLOWED_EXTENSIONS = {".pdf", ".zip", ".xml", ".json", ".txt", ".gpg"}


async def scan_and_store(content: bytes, original_filename: str) -> dict:
    ext = os.path.splitext(original_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return {"clean": False, "path": None, "public_ref": None}

    clean = await _clamav_scan(content)

    file_uuid = str(uuid.uuid4())
    safe_name = f"{file_uuid}{ext}"
    dest = os.path.join(settings.upload_dir, safe_name)

    with open(dest, "wb") as f:
        f.write(content)

    public_ref = hashlib.sha256(content).hexdigest()

    return {"clean": clean, "path": dest, "public_ref": public_ref}


async def _clamav_scan(content: bytes) -> bool:
    try:
        import clamd
        cd = clamd.ClamdNetworkHost(settings.clamav_host, settings.clamav_port)
        result = cd.instream(content)
        status = result.get("stream", ["OK"])[0]
        return status == "OK"
    except Exception:
        # If ClamAV unavailable in dev, allow with warning
        if settings.app_env == "development":
            print("[CLAMAV] Scanner unavailable — dev mode passthrough")
            return True
        return False
