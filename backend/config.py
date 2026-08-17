import os
import tempfile
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = os.getenv("APP_ENV", "development")
    app_name: str = "LexaSafe France - API Souveraine"
    app_version: str = "1.0.0"
    
    # Base de données (PostgreSQL pour OVHcloud SecNumCloud, fallback local automatique)
    database_url: str = os.getenv("DATABASE_URL", "postgresql://lexa_user:secret_change_me_in_prod@localhost:5432/lexasafe_db")
    use_sqlite_fallback: bool = True
    
    # Clés cryptographiques de session et chiffrement (AES-256 / JWE)
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "lexasafe-super-secret-production-key-2026-secnumcloud")
    jwe_secret_key: str = os.getenv("JWE_SECRET_KEY", "dev-jwe-secret-change-in-production-32b")
    app_master_key: str = os.getenv("APP_MASTER_KEY", "dev-master-key-change-in-production-32")
    db_encryption_key: str = os.getenv("DB_ENCRYPTION_KEY", "dev-db-encryption-key-change-prod")
    
    # SMTP Souverain OVHcloud
    smtp_host: str = os.getenv("SMTP_HOST", "ssl0.ovh.net")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from: str = os.getenv("SMTP_FROM", "noreply@lexasafe.fr")
    
    # Sécurité CORS & IP
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080,http://localhost:3000,https://relationship-similar-sought-cure.trycloudflare.com,*")
    rate_limit_per_minute: int = 120

    # Cache / rate-limit (Redis avec fallback in-memory automatique en dev)
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Répertoires de stockage
    upload_dir: str = os.getenv("UPLOAD_DIR", os.path.join(tempfile.gettempdir(), "lexasafe_uploads"))
    downloads_dir: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "downloads")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()


def is_production() -> bool:
    return settings.app_env.strip().lower() in {"production", "prod"}

# Ensure directories exist
os.makedirs(settings.upload_dir, exist_ok=True)
os.makedirs(settings.downloads_dir, exist_ok=True)
