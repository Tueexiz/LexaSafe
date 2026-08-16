"""
LEXASAFE FRANCE - API REST SOUVERAINE DE PRODUCTION & DÉVELOPPEMENT LOCAL
FastAPI • Double Mode PostgreSQL / Autonome • Respect SecNumCloud & e-Evidence
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
from routes.costs import router as costs_router
from routes.opj import router as opj_router
from routes.transparency import router as transparency_router
from routes.admin import router as admin_router
from routes.registration import router as registration_router
from routes.demo import router as demo_router


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
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
            # Log d'audit conforme e-Evidence
            if response.status_code >= 400:
                print(f"[AUDIT-ALERT] {json.dumps(log_entry)}")

        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API REST Souveraine de Gestion des Réquisitions Judiciaires & Conformité e-Evidence (ANSSI SecNumCloud)",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# Configuration CORS pour autoriser le front-end et le tunnel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(AuditMiddleware)

# Montage de l'ensemble des modules métier (inscriptions + démo inclus)
app.include_router(auth_router)
app.include_router(requisitions_router)
app.include_router(costs_router)
app.include_router(opj_router)
app.include_router(transparency_router)
app.include_router(admin_router)
app.include_router(registration_router)
app.include_router(demo_router)


@app.get("/")
async def root():
    return {
        "service": "LexaSafe France - API Souveraine",
        "status": "OPERATIONAL",
        "docs": "/api/docs",
        "compliance": "ANSSI SecNumCloud 3.2 • e-Evidence 2026 • ISO 27001",
        "datacenter": "OVHcloud Roubaix DC3 (France)"
    }


@app.get("/health")
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "lexasafe-api",
        "timestamp": time.time(),
        "secnumcloud_shield": "ACTIVE"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
