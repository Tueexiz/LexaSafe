import os
import tempfile
from typing import Self

from pydantic import model_validator
from pydantic_settings import BaseSettings


def _read_docker_secret(env_file_var: str) -> str | None:
    """
    Lit un secret depuis un fichier Docker Secrets (``/run/secrets/...``).

    La variable d'environnement ``env_file_var`` (ex: ``JWE_SECRET_KEY_FILE``)
    contient le chemin du fichier secret monté par Docker Compose.
    """
    file_path = os.getenv(env_file_var)
    if file_path and os.path.isfile(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            value = f.read().strip()
            if value:
                return value
    return None


class Settings(BaseSettings):
    app_env: str = os.getenv("APP_ENV", "development")
    app_name: str = "LexaSafe France - API Souveraine"
    app_version: str = "1.0.0"

    # Base de données (PostgreSQL SecNumCloud, fallback local en dev)
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://lexa_user:secret_change_me_in_prod@localhost:5432/lexasafe_db",
    )
    use_sqlite_fallback: bool = True

    # ── Clés cryptographiques ────────────────────────────────────────────────
    # Priorité: Docker Secret (fichier) > Variable d'env > Valeur par défaut dev
    # Les valeurs par défaut contiennent "DO-NOT-USE" pour déclencher le garde-fou prod.
    jwt_secret_key: str = (
        _read_docker_secret("JWT_SECRET_KEY_FILE")
        or os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-DO-NOT-USE-IN-PROD")
    )
    jwe_secret_key: str = (
        _read_docker_secret("JWE_SECRET_KEY_FILE")
        or os.getenv("JWE_SECRET_KEY", "dev-jwe-secret-DO-NOT-USE-IN-PROD")
    )
    app_master_key: str = (
        _read_docker_secret("APP_MASTER_KEY_FILE")
        or os.getenv("APP_MASTER_KEY", "dev-master-key-DO-NOT-USE-IN-PROD")
    )
    db_encryption_key: str = (
        _read_docker_secret("DB_ENCRYPTION_KEY_FILE")
        or os.getenv("DB_ENCRYPTION_KEY", "dev-db-key-DO-NOT-USE-IN-PROD")
    )

    # SMTP Souverain OVHcloud
    smtp_host: str = os.getenv("SMTP_HOST", "ssl0.ovh.net")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from: str = os.getenv("SMTP_FROM", "noreply@lexasafe.fr")

    # Sécurité CORS — origines strictes, pas de wildcard
    cors_origins: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:8000",
    )
    rate_limit_per_minute: int = 120

    # Cache / Rate-limit (Redis, pas de fallback en prod)
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Répertoires de stockage
    upload_dir: str = os.getenv(
        "UPLOAD_DIR",
        os.path.join(tempfile.gettempdir(), "lexasafe_uploads"),
    )
    downloads_dir: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "assets",
        "downloads",
    )

    @model_validator(mode="after")
    def _enforce_production_secrets(self) -> Self:
        """
        Garde-fou critique : refuse de démarrer en production si les clés
        cryptographiques utilisent des valeurs par défaut non sécurisées.
        """
        if self.app_env.strip().lower() in ("production", "prod"):
            _forbidden_markers = ("dev-", "DO-NOT-USE", "change_me", "secret_change")
            for field_name in (
                "jwt_secret_key",
                "jwe_secret_key",
                "app_master_key",
                "db_encryption_key",
            ):
                value = getattr(self, field_name)
                if any(marker in value for marker in _forbidden_markers):
                    raise ValueError(
                        f"FATAL : la clé '{field_name}' utilise une valeur par défaut. "
                        f"Configurez-la via Docker Secret ou variable d'environnement "
                        f"avant de démarrer en production."
                    )
            # Désactiver le fallback SQLite en production
            self.use_sqlite_fallback = False
        return self

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()


def is_production() -> bool:
    """Retourne True si l'environnement est production."""
    return settings.app_env.strip().lower() in {"production", "prod"}


# Ensure directories exist
os.makedirs(settings.upload_dir, exist_ok=True)
os.makedirs(settings.downloads_dir, exist_ok=True)
