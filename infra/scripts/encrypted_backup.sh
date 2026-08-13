#!/bin/bash
# LEXASAFE — Backup chiffré PostgreSQL (OVH Object Storage)
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/lexasafe_${TIMESTAMP}.sql.gz"
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-changeme}"

echo "[BACKUP] Starting encrypted backup at $TIMESTAMP"

pg_dump -h db -U lexa_user lexasafe_db | gzip > "$BACKUP_FILE"

if command -v openssl &>/dev/null; then
  openssl enc -aes-256-gcm -salt -pbkdf2 -in "$BACKUP_FILE" -out "${BACKUP_FILE}.enc" -pass env:BACKUP_ENCRYPTION_KEY
  rm "$BACKUP_FILE"
  echo "[BACKUP] Encrypted backup saved: ${BACKUP_FILE}.enc"
else
  echo "[BACKUP] Plain backup saved: $BACKUP_FILE (openssl not available)"
fi

# Retention: delete backups older than 90 days
find "$BACKUP_DIR" -name "lexasafe_*.enc" -mtime +90 -delete 2>/dev/null || true

echo "[BACKUP] Complete"
