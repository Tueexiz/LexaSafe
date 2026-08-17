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
  lsb-release \
  unattended-upgrades \
  apt-listchanges

# Configuration des mises à jour automatiques de sécurité
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

cat > /etc/apt/apt.conf.d/50unattended-upgrades <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
};
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF
systemctl enable --now unattended-upgrades

# Hardening Réseau (Sysctl)
cat > /etc/sysctl.d/99-lexasafe-hardening.conf << 'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.icmp_echo_ignore_all = 1
EOF
sysctl -p /etc/sysctl.d/99-lexasafe-hardening.conf

# Jail SSH et Nginx fail2ban
cat > /etc/fail2ban/jail.d/lexasafe.local <<'EOF'
[sshd]
enabled = true
backend = systemd

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
EOF

systemctl enable --now fail2ban >/dev/null 2>&1 || systemctl restart fail2ban || true

# Durcissement SSH (désactiver authentification par mot de passe si clé déployée)
if [ -f /root/.ssh/authorized_keys ] && [ -s /root/.ssh/authorized_keys ]; then
  sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
  sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
  systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true
  echo "SSH durci : authentification par mot de passe désactivée (clé SSH détectée)."
fi

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

# Limitation des logs Docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

# -----------------------------------------------------------------------------
# 4. Pare-feu UFW (non interactif)
# -----------------------------------------------------------------------------
echo ""
echo "[4/8] Configuration UFW"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH public / local'
ufw allow from 10.88.0.0/24 to any port 22 proto tcp comment 'SSH via WireGuard'
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 51820/udp
ufw --force enable
echo "UFW actif (22/tcp VPN-only, 80/tcp, 443/tcp, 51820/udp)."

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

  # Deploy hook pour le renouvellement automatique
  mkdir -p /etc/letsencrypt/renewal-hooks/deploy
  cat > /etc/letsencrypt/renewal-hooks/deploy/lexasafe.sh <<HOOK
#!/bin/bash
set -euo pipefail
cp -L /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${SSL_CERTS_DIR}/lexasafe_bundle.crt
cp -L /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${SSL_PRIVATE_DIR}/lexasafe.key
chmod 644 ${SSL_CERTS_DIR}/lexasafe_bundle.crt
chmod 640 ${SSL_PRIVATE_DIR}/lexasafe.key
chown root:root ${SSL_CERTS_DIR}/lexasafe_bundle.crt ${SSL_PRIVATE_DIR}/lexasafe.key
docker exec lexasafe_proxy nginx -s reload 2>/dev/null || true
echo "[CERTBOT-HOOK] Certificats copiés et Nginx rechargé."
HOOK
  chmod 700 /etc/letsencrypt/renewal-hooks/deploy/lexasafe.sh
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
  # Validation : le fichier doit contenir au moins 64 caractères
  if [ "$(wc -c < "${dest}")" -lt 64 ]; then
    echo "ERREUR CRITIQUE : secret trop court dans ${dest}. Régénérez manuellement."
    exit 1
  fi
  echo "Créé : ${dest}"
}

generer_secret_si_absent "${SECRETS_DIR}/jwe_secret.txt"
generer_secret_si_absent "${SECRETS_DIR}/master_key.txt"
generer_secret_si_absent "${SECRETS_DIR}/db_encryption_key.txt"

# -----------------------------------------------------------------------------
# 7. Certificats SSL copiés pour nginx (volume ./secrets/ssl:/etc/ssl:ro)
# -----------------------------------------------------------------------------
echo ""
echo "[7/8] Copie des certificats nginx"
BUNDLE_DEST="${SSL_CERTS_DIR}/lexasafe_bundle.crt"
KEY_DEST="${SSL_PRIVATE_DIR}/lexasafe.key"

if [ -f "${LE_LIVE}/fullchain.pem" ] && [ -f "${LE_LIVE}/privkey.pem" ]; then
  cp -L "${LE_LIVE}/fullchain.pem" "${BUNDLE_DEST}"
  cp -L "${LE_LIVE}/privkey.pem" "${KEY_DEST}"
  chmod 644 "${BUNDLE_DEST}"
  chmod 640 "${KEY_DEST}"
  chown root:root "${BUNDLE_DEST}" "${KEY_DEST}"
  echo "Certificats SSL copiés : ${BUNDLE_DEST} et ${KEY_DEST}"
else
  echo "Let's Encrypt introuvable (${LE_LIVE}). Certificats SSL non copiés."
  echo "Après un certbot réussi, copiez manuellement :"
  echo "  cp -L ${LE_LIVE}/fullchain.pem ${BUNDLE_DEST}"
  echo "  cp -L ${LE_LIVE}/privkey.pem ${KEY_DEST}"
fi

# -----------------------------------------------------------------------------
# 8. Fichier .env automatique (si absent)
# -----------------------------------------------------------------------------
echo ""
echo "[8/9] Génération du fichier .env"
ENV_FILE="${LEXA_ROOT}/infra/.env"
if [ -f "${ENV_FILE}" ]; then
  echo "Fichier .env conservé (déjà présent)."
else
  mkdir -p "${LEXA_ROOT}/infra"
  RANDOM_PG_PASS=$(openssl rand -hex 16)
  cat > "${ENV_FILE}" <<EOF
POSTGRES_PASSWORD=${RANDOM_PG_PASS}
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_USER=contact@lexasafe.fr
SMTP_PASSWORD=change_me
SMTP_FROM=noreply@lexasafe.fr
EOF
  chmod 600 "${ENV_FILE}"
  echo "Fichier ${ENV_FILE} créé avec un POSTGRES_PASSWORD sécurisé."
fi

# -----------------------------------------------------------------------------
# 9. Suite opératoire
# -----------------------------------------------------------------------------
echo ""
echo "[9/9] Terminé"
echo "======================================================="
echo "Infrastructure Debian 12 préparée avec succès."
echo "Prochaines étapes (automatisées via MenuLinux) :"
echo "  1. Uploader le code source."
echo "  2. Lancer les conteneurs."
echo "======================================================="
echo "Rappels :"
echo "  - DNS A/AAAA de ${DOMAIN} + auth/app/api doivent pointer vers ce VPS AVANT certbot."
echo "  - Pour ignorer certbot : SKIP_CERTBOT=1 sudo -E bash setup_prod.sh"
echo "======================================================="
