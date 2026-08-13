import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "postgresql://lexa_user:secret_change_me_in_prod@localhost:5432/lexasafe_db"
    redis_url: str = "redis://localhost:6379/0"
    jwe_secret_key: str = "dev-jwe-secret-change-in-production-32b"
    app_master_key: str = "dev-master-key-change-in-production-32"
    db_encryption_key: str = "dev-db-encryption-key-change-prod"
    smtp_host: str = "ssl0.ovh.net"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@lexasafe.fr"
    cors_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"
    clamav_host: str = "clamav"
    clamav_port: int = 3310
    upload_dir: str = "/tmp/lexasafe_uploads"

    class Config:
        env_file = ".env"


settings = Settings()

# Ensure upload dir exists
os.makedirs(settings.upload_dir, exist_ok=True)
