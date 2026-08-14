# Guide de Déploiement Souverain : OVHcloud SecNumCloud

Ce document détaille la procédure de déploiement en production de **LexaSafe** sur l'infrastructure souveraine **OVHcloud SecNumCloud** (qualification ANSSI).

---

## 🏛️ 1. Prérequis d'Infrastructure OVHcloud

1. **Région / Datacenter** : Roubaix (RBX) ou Gravelines (GRA) — Zone de confiance SecNumCloud.
2. **Réseau Isolé** : vRack privé OVHcloud avec sous-réseau étanche `10.88.0.0/24`.
3. **Base de Données** : Managed Database for PostgreSQL 16 avec chiffrement au repos AES-256 et réplication synchrone multi-zones.
4. **Stockage d'Objets** : OVHcloud High Performance Object Storage S3 (chiffrement SSE-C côté client avec clés éphémères).
5. **Certificats SSL/TLS** : Certificat qualifié eIDAS / RGS** délivré par une autorité de certification reconnue par l'ANSSI.

---

## 🚀 2. Variables d'Environnement de Production (`.env.production`)

```ini
APP_ENV=production
APP_NAME="LexaSafe France - Production Souveraine"
DATABASE_URL="postgresql://lexa_prod_user:MOT_DE_PASSE_HSM@postgres.internal.vrack:5432/lexasafe_prod?sslmode=verify-full"
REDIS_URL="redis://redis.internal.vrack:6379/0"
JWT_SECRET_KEY="GENERER_UNE_CLE_ALEATOIRE_256_BITS_VIA_HSM"
APP_MASTER_KEY="GENERER_CLE_MASTER_AES256_KMS"
SMTP_HOST="ssl0.ovh.net"
SMTP_PORT=587
SMTP_USER="notifications@lexasafe.fr"
SMTP_PASSWORD="SECRET_SMTP_OVH"
CORS_ORIGINS="https://lexasafe.fr,https://app.lexasafe.fr,https://api.lexasafe.fr"
```

---

## 🐳 3. Déploiement via Docker Compose

```bash
# 1. Cloner le dépôt sur le serveur d'application durci (Debian 12 SecNumCloud)
git clone https://github.com/lexasafe/lexasafe-core.git /opt/lexasafe
cd /opt/lexasafe/infra

# 2. Initialiser le schéma de base de données PostgreSQL 16 avec RLS
psql $DATABASE_URL -f ../sql/schema.sql

# 3. Lancer la stack complète
docker compose -f docker-compose.yml up -d --build

# 4. Vérifier la conformité et la santé de l'API
curl -f https://api.lexasafe.fr/api/health
```

---

## 🔒 4. Conformité & Contrôle ANSSI

* **Row Level Security (RLS)** : Activé sur toutes les tables sensibles pour garantir une isolation mathématique entre organisations.
* **Architecture Zéro-Knowledge** : Les fichiers déposés sont chiffrés sur le poste client avant transit et scellés sous horodatage qualifié RFC 3161.
* **Audit e-Evidence 2026** : Journalisation infalsifiable en chaîne de hachage SHA-256 dans la table `audit_logs`.
