#!/usr/bin/env bash
# LEXASAFE FRANCE - SCRIPT DE DURCISSEMENT ET DEPLOIEMENT DEBIAN 12
# Conformité ANSSI (SecNumCloud) - Zero Trust Architecture

set -euo pipefail
IFS=$'\n\t'

echo "============================================================"
echo "🛡️  INITIALISATION DE LA PRODUCTION LEXASAFE SUR DEBIAN 12 🛡️"
echo "============================================================"

# Vérification des privilèges
if [[ "$EUID" -ne 0 ]]; then
  echo "❌ Ce script doit être exécuté en tant que root."
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

# 1. Mise à jour complète du système
echo "[1/7] Mise à jour du système..."
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
    curl \
    wget \
    gnupg \
    apt-transport-https \
    ca-certificates \
    lsb-release \
    ufw \
    fail2ban \
    unattended-upgrades \
    apparmor-utils \
    auditd

# 2. Hardening Réseau (Sysctl)
echo "[2/7] Configuration TCP/IP (Sysctl) - ANSSI..."
cat > /etc/sysctl.d/99-lexasafe-hardening.conf << 'EOF'
# Protection contre le spoofing et SYN floods
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2

# Désactivation des redirections ICMP
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Prévention du IP Spoofing
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Ignore ICMP Echo requests (Ping)
net.ipv4.icmp_echo_ignore_all = 1

# Désactivation IPv6 (Si non utilisé)
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
EOF
sysctl -p /etc/sysctl.d/99-lexasafe-hardening.conf

# 3. Hardening SSH
echo "[3/7] Sécurisation du service SSH..."
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#*PermitEmptyPasswords.*/PermitEmptyPasswords no/' /etc/ssh/sshd_config
sed -i 's/^#*X11Forwarding.*/X11Forwarding no/' /etc/ssh/sshd_config
systemctl restart sshd

# 4. Pare-feu (UFW)
echo "[4/7] Configuration du pare-feu (UFW) Default Deny..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow http
ufw allow https
ufw --force enable

# 5. Fail2Ban
echo "[5/7] Configuration Fail2Ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
port = http,https
logpath = /var/log/nginx/access.log
EOF
systemctl restart fail2ban
systemctl enable fail2ban

# 6. Installation Docker et Docker Compose V2
echo "[6/7] Installation sécurisée de Docker..."
if ! command -v docker &> /dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

# Limitation des logs Docker pour prévenir l'épuisement du disque
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  },
  "userns-remap": "default",
  "no-new-privileges": true
}
EOF
systemctl restart docker

# 7. Unattended Upgrades (Sécurité Automatique)
echo "[7/7] Configuration des mises à jour de sécurité automatiques..."
echo 'APT::Periodic::Update-Package-Lists "1";' > /etc/apt/apt.conf.d/20auto-upgrades
echo 'APT::Periodic::Unattended-Upgrade "1";' >> /etc/apt/apt.conf.d/20auto-upgrades

echo "============================================================"
echo "✅ SERVEUR DEBIAN 12 SÉCURISÉ ET PRÊT POUR LA PRODUCTION"
echo "👉 Placez vos secrets dans le fichier .env et lancez :"
echo "   docker compose -f infra/docker-compose.yml up -d --build"
echo "============================================================"
