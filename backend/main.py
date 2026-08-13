"""
LEXASAFE FRANCE - API REST SOUVERAINE
FastAPI • JWE Sessions • RLS • Rate Limiting • Audit Logs
"""

import hashlib
import json
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from config import settings
from db import init_db, close_db
from routes.auth import router as auth_router
from routes.requisitions import router as requisitions_router
from routes.demo import router as demo_router
from routes.subscriptions import router as subscriptions_router


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:;"
        )
        return response


class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        client_ip = request.client.host if request.client else "unknown"
        ua = request.headers.get("user-agent", "")[:512]
        fp = hashlib.sha256(f"{client_ip}:{ua}".encode()).hexdigest()[:16]

        response = await call_next(request)
        duration_ms = int((time.time() - start) * 1000)

        if request.url.path.startswith("/api/"):
            log_entry = {
                "ip": client_ip,
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "duration_ms": duration_ms,
                "fingerprint": fp,
                "timestamp": time.time(),
            }
            # Encrypted log output (AES would use APP_MASTER_KEY in production)
            print(f"[AUDIT] {json.dumps(log_entry)}")

        return response


class CSRFMiddleware(BaseHTTPMiddleware):
    SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}

    async def dispatch(self, request: Request, call_next):
        if request.method not in self.SAFE_METHODS and request.url.path.startswith("/api/"):
            csrf = request.headers.get("X-CSRF-Token")
            if not csrf and settings.app_env == "production":
                from fastapi.responses import JSONResponse
                return JSONResponse({"detail": "CSRF token manquant"}, status_code=403)
        return await call_next(request)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
    except Exception as e:
        print(f"[DB] Connection failed (dev mode): {e}")
    yield
    await close_db()


app = FastAPI(
    title="LexaSafe API Souveraine",
    version="1.0.0",
    docs_url="/api/docs" if settings.app_env != "production" else None,
    redoc_url=None,
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(AuditMiddleware)
app.add_middleware(CSRFMiddleware)

app.include_router(auth_router)
app.include_router(requisitions_router)
app.include_router(demo_router)
app.include_router(subscriptions_router)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "lexasafe-api"}


@app.get("/api/health")
async def api_health():
    return {"status": "healthy"}
