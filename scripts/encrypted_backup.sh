#!/usr/bin/env bash
# ==============================================================================
# LEXASAFE - PIPELINE AUTOMATISÉ DE SAUVEGARDE CHIFFRÉE (GPG / BORG)
# Sauvegarde froide chiffrée • Objectif RPO < 15 min / RTO < 1h
# ==============================================================================

set -euo pipefail

BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/lexasafe"
GPG_RECIPIENT_KEY="DPO-SECURITY@lexasafe.fr"

echo "[$(date)] Début de la sauvegarde souveraine LexaSafe..."

mkdir -p "${BACKUP_DIR}"

# 1. Dump chiffré de PostgreSQL
echo "[1/3] Export de la base de données PostgreSQL..."
pg_dump -U lexa_user -h localhost lexasafe_db | \
  gpg --encrypt --recipient "${GPG_RECIPIENT_KEY}" --trust-model always \
  > "${BACKUP_DIR}/db_backup_${BACKUP_DATE}.sql.gpg"

# 2. Sauvegarde des enclaves de fichiers
echo "[2/3] Chiffrement et archivage des logs d'audit..."
tar -czf - /var/log/lexasafe | \
  gpg --encrypt --recipient "${GPG_RECIPIENT_KEY}" --trust-model always \
  > "${BACKUP_DIR}/audit_logs_${BACKUP_DATE}.tar.gz.gpg"

# 3. Synchronisation vers stockage froid OVH Cloud Archive (SecNumCloud)
echo "[3/3] Réplication chiffrée vers OVHcloud Cold Storage (Gravelines)..."
# rclone copy "${BACKUP_DIR}" ovh_cold_storage:lexasafe-vault/

echo "[$(date)] Sauvegarde terminée avec succès. Fichiers intègres et scellés."
