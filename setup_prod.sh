#!/bin/bash
# =============================================================================
# LexaSafe — bootstrap VPS Debian 12 (production)
# Usage : sudo bash setup_prod.sh
# Optionnel : SKIP_CERTBOT=1 EMAIL_CERTBOT=ops@example.fr sudo -E bash setup_prod.sh
# =============================================================================
set -euo pipefail

# --- Variables (surchargeables par l'environnement) --------------------------
DOMAIN="${DOMAIN:-lexasafe.fr}"
EMAIL_CERTBOT="${EMAIL_CERTBOT:-contact@lexasafe.fr}"
LEXA_ROOT="${LEXA_ROOT:-/opt/lexasafe}"
SKIP_CERTBOT="${SKIP_CERTBOT:-0}"

SECRETS_DIR="${LEXA_ROOT}/infra/secrets"
SSL_CERTS_DIR="${SECRETS_DIR}/ssl/certs"
SSL_PRIVATE_DIR="${SECRETS_DIR}/ssl/private"
LE_LIVE="/etc/letsencrypt/live/${DOMAIN}"

export DEBIAN_FRONTEND=noninteractive

echo "======================================================="
echo "  LexaSafe — initialisation infrastructure Debian 12"
echo "======================================================="

# Vérification root
if [ "${EUID}" -ne 0 ]; then
  echo "Erreur : lancer ce script en root (sudo bash setup_prod.sh)."
  exit 1
fi

# -----------------------------------------------------------------------------
# 1. Mise à jour du système
# -----------------------------------------------------------------------------
echo ""
echo "[1/8] apt update && apt upgrade"
apt-get update -y
apt-get upgrade -y

# -----------------------------------------------------------------------------
# 2. Paquets de base (pas de mot de passe en dur ici)
# -----------------------------------------------------------------------------
echo ""
echo "[2/8] Installation des paquets de base"
apt-get install -y \
  curl \
  git \
  ufw \
  fail2ban \
  wireguard \
  wireguard-tools \
  certbot \
  ca-certificates \
  gnupg \
  openssl \
  lsb-release

# Jail SSH fail2ban (si absente)
if [ ! -f /etc/fail2ban/jail.d/sshd.local ]; then
  cat > /etc/fail2ban/jail.d/sshd.local <<'EOF'
[sshd]
enabled = true
backend = systemd
EOF
fi
systemctl enable --now fail2ban >/dev/null 2>&1 || systemctl restart fail2ban || true

# -----------------------------------------------------------------------------
# 3. Docker Engine + plugin Compose (script officiel)
# -----------------------------------------------------------------------------
echo ""
echo "[3/8] Installation Docker CE (get.docker.com)"
if command -v docker >/dev/null 2>&1; then
  echo "Docker déjà présent : $(docker --version)"
else
  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sh /tmp/get-docker.sh
  rm -f /tmp/get-docker.sh
fi
systemctl enable --now docker

if ! docker compose version >/dev/null 2>&1; then
  echo "Avertissement : le plugin Docker Compose est introuvable. Vérifiez docker-compose-plugin."
fi

# -----------------------------------------------------------------------------
# 4. Pare-feu UFW (non interactif)
# -----------------------------------------------------------------------------
echo ""
echo "[4/8] Configuration UFW"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 51820/udp
ufw --force enable
echo "UFW actif (22/tcp, 80/tcp, 443/tcp, 51820/udp)."

# -----------------------------------------------------------------------------
# 5. Certificats Let's Encrypt (peut être ignoré)
# -----------------------------------------------------------------------------
liberer_port_80() {
  # certbot --standalone a besoin du port 80. Arrêter nginx hôte / proxy Docker s'ils écoutent.
  if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx 2>/dev/null; then
    echo "Arrêt de nginx hôte pour libérer :80..."
    systemctl stop nginx || true
  fi
  if command -v docker >/dev/null 2>&1; then
    ids="$(docker ps --filter publish=80 --format '{{.ID}}' 2>/dev/null || true)"
    if [ -n "${ids}" ]; then
      echo "Arrêt des conteneurs Docker qui publient :80..."
      # shellcheck disable=SC2086
      docker stop ${ids} || true
    fi
  fi
}

generer_certificats() {
  if [ "${SKIP_CERTBOT}" = "1" ]; then
    echo "SKIP_CERTBOT=1 : génération Let's Encrypt ignorée."
    return 0
  fi

  echo "Génération des certificats pour ${DOMAIN}, auth.${DOMAIN}, app.${DOMAIN}, api.${DOMAIN}"
  echo "Prérequis : les enregistrements DNS A/AAAA doivent pointer vers CE VPS."
  echo "Si nginx/Docker occupe déjà :80, il sera arrêté le temps du challenge standalone."

  liberer_port_80

  set +e
  certbot certonly --standalone \
    --agree-tos \
    --email "${EMAIL_CERTBOT}" \
    --non-interactive \
    --preferred-challenges http \
    -d "${DOMAIN}" \
    -d "auth.${DOMAIN}" \
    -d "app.${DOMAIN}" \
    -d "api.${DOMAIN}"
  local rc=$?
  set -e

  if [ "${rc}" -ne 0 ]; then
    echo "Erreur certbot (souvent DNS non pointé vers ce VPS, ou port 80 occupé)."
    echo "Les secrets applicatifs seront tout de même générés. Relancez plus tard :"
    echo "  SKIP_CERTBOT=0 sudo bash ${LEXA_ROOT}/setup_prod.sh"
    echo "  ou : certbot certonly --standalone --agree-tos --email \"${EMAIL_CERTBOT}\" --non-interactive \\"
    echo "       -d ${DOMAIN} -d auth.${DOMAIN} -d app.${DOMAIN} -d api.${DOMAIN}"
    return 0
  fi
  echo "Certificats Let's Encrypt générés dans ${LE_LIVE}"
}

echo ""
echo "[5/8] Certbot Let's Encrypt"
generer_certificats

# -----------------------------------------------------------------------------
# 6. Secrets applicatifs (ne jamais écraser un fichier existant)
# -----------------------------------------------------------------------------
echo ""
echo "[6/8] Génération des secrets (si absents)"
mkdir -p "${SSL_CERTS_DIR}" "${SSL_PRIVATE_DIR}"
chmod 700 "${SECRETS_DIR}"

generer_secret_si_absent() {
  local dest="$1"
  if [ -f "${dest}" ]; then
    echo "Conservé (déjà présent) : ${dest}"
    return 0
  fi
  openssl rand -base64 48 > "${dest}"
  chmod 600 "${dest}"
  echo "Créé : ${dest}"
}

generer_secret_si_absent "${SECRETS_DIR}/jwe_secret.txt"
generer_secret_si_absent "${SECRETS_DIR}/master_key.txt"
generer_secret_si_absent "${SECRETS_DIR}/db_encryption_key.txt"

# -----------------------------------------------------------------------------
# 7. Liens SSL attendus par nginx (volume ./secrets/ssl:/etc/ssl:ro)
# -----------------------------------------------------------------------------
echo ""
echo "[7/8] Liens symboliques certificats nginx"
BUNDLE_LINK="${SSL_CERTS_DIR}/lexasafe_bundle.crt"
KEY_LINK="${SSL_PRIVATE_DIR}/lexasafe.key"

if [ -f "${LE_LIVE}/fullchain.pem" ] && [ -f "${LE_LIVE}/privkey.pem" ]; then
  ln -sfn "${LE_LIVE}/fullchain.pem" "${BUNDLE_LINK}"
  ln -sfn "${LE_LIVE}/privkey.pem" "${KEY_LINK}"
  chmod 644 "${BUNDLE_LINK}" 2>/dev/null || true
  chmod 640 "${KEY_LINK}" 2>/dev/null || true
  chown root:root "${BUNDLE_LINK}" "${KEY_LINK}" 2>/dev/null || true
  echo "Liens SSL : ${BUNDLE_LINK} et ${KEY_LINK}"
else
  echo "Let's Encrypt introuvable (${LE_LIVE}). Liens SSL non créés."
  echo "Après un certbot réussi, recréez :"
  echo "  ln -sfn ${LE_LIVE}/fullchain.pem ${BUNDLE_LINK}"
  echo "  ln -sfn ${LE_LIVE}/privkey.pem ${KEY_LINK}"
fi

# -----------------------------------------------------------------------------
# 8. Suite opératoire
# -----------------------------------------------------------------------------
echo ""
echo "[8/8] Terminé"
echo "======================================================="
echo "Prochaines étapes :"
echo "  1. Copier/cloner le projet dans ${LEXA_ROOT} s'il est absent"
echo "     (ne pas écraser ${SECRETS_DIR})."
echo "  2. Créer ${LEXA_ROOT}/infra/.env avec POSTGRES_PASSWORD (fort, unique)."
echo "     Ne jamais committer ce fichier."
echo "  3. cd ${LEXA_ROOT}/infra && docker compose up -d --build"
echo "  4. Configurer WireGuard à part (écoute UDP 51820 déjà ouverte)."
echo "======================================================="
echo "Rappels :"
echo "  - DNS A/AAAA de ${DOMAIN} + auth/app/api doivent pointer vers ce VPS AVANT certbot."
echo "  - Pour ignorer certbot : SKIP_CERTBOT=1 sudo -E bash setup_prod.sh"
echo "======================================================="
