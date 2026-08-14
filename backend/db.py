"""
LEXASAFE FRANCE - ADAPTATEUR DE BASE DE DONNÉES HYBRIDE
Production : PostgreSQL 16 Managé (SecNumCloud OVHcloud) + Row-Level Security
Local : Moteur Autonome Auto-Initialisé (Zéro configuration requise)
"""

import asyncio
import json
import time
import uuid
from typing import Any, Dict, List, Optional
from config import settings

# Variable globale pour stocker le pool Postgres s'il est actif
pg_pool = None
is_postgres_active = False

# Structure de base de données locale autonome en mémoire
local_db: Dict[str, Dict[str, Any]] = {
    "organizations": {},
    "users": {},
    "requisitions": {},
    "audit_logs": {},
    "edr_events": {},
    "costs": {}
}


def seed_local_db():
    """Pré-remplit la base de données locale avec les organisations et comptes de démonstration."""
    # 1. Organisations
    org_cloudhost_id = "org-cloudhost-891402"
    org_paytech_id = "org-paytech-941028"
    
    local_db["organizations"][org_cloudhost_id] = {
        "id": org_cloudhost_id,
        "siren": "891402119",
        "company_name": "CloudHost France SAS",
        "legal_dpo_email": "dpo@cloudhost.fr",
        "contact_phone": "+33 1 40 12 34 56",
        "is_active": True,
        "plan": "Business (799 €/mois)",
        "created_at": "2026-01-15T08:00:00Z"
    }

    local_db["organizations"][org_paytech_id] = {
        "id": org_paytech_id,
        "siren": "941028331",
        "company_name": "PayTech France",
        "legal_dpo_email": "dpo.martin@paytech.fr",
        "contact_phone": "+33 6 88 12 49 01",
        "is_active": True,
        "plan": "Entreprise SecNumCloud (Sur Devis)",
        "created_at": "2026-02-01T09:30:00Z"
    }

    # 2. Utilisateurs
    local_db["users"]["officier.aurelien@interieur.gouv.fr"] = {
        "id": "usr-opj-001",
        "email": "officier.aurelien@interieur.gouv.fr",
        "name": "Capitaine Aurélien V.",
        "role": "opj_investigator",
        "service": "Police Nationale - DTPJ Marseille",
        "password": "SecuredPass2026!",
        "is_verified": True,
        "pki_serial": "AGENT-PN-2026-889104-FR",
        "otp_code": "894201"
    }

    local_db["users"]["dpo.martin@paytech.fr"] = {
        "id": "usr-dpo-002",
        "email": "dpo.martin@paytech.fr",
        "name": "Martin DUPUIS (Head of Legal & DPO)",
        "organization_id": org_paytech_id,
        "role": "dpo_enterprise",
        "password": "SecuredPass2026!",
        "is_verified": True,
        "otp_code": "894201"
    }

    local_db["users"]["admin.secops@lexasafe.fr"] = {
        "id": "usr-secops-000",
        "email": "admin.secops@lexasafe.fr",
        "name": "Alexandre (SecOps / Certifications)",
        "role": "super_admin",
        "password": "SecOpsMaster2026!",
        "is_verified": True,
        "otp_code": "894201"
    }

    # 3. Réquisitions
    local_db["requisitions"]["REQ-2026-99120"] = {
        "id": "REQ-2026-99120",
        "organization_id": org_cloudhost_id,
        "company": "CloudHost France SAS",
        "officer": "Cdt Aurélien V. (PJ Marseille)",
        "officer_email": "officier.aurelien@interieur.gouv.fr",
        "service": "Section Cybercriminalité",
        "legalBasis": "Art. 60-2 CPP (Données de Connexion)",
        "targetUser": "client_941028@proton.me",
        "status": "received",
        "statusText": "Scellé & Prêt au Téléchargement",
        "isUrgent": True,
        "urgency": "URGENCE e-Evidence (Reste 4h 18min)",
        "deadline_hours": 8,
        "created_at": "2026-08-14T09:12:00Z",
        "extractedData": {
            "userIP": "185.220.101.44:54219",
            "isp": "Orange SA (Plage Fixe)",
            "accountName": "Martin DUPUIS",
            "email": "cible.suspect92@proton.me",
            "phone": "+33 6 88 12 49 01",
            "timestamp": "Du 01/08/2026 00:00 au 14/08/2026 10:04 UTC",
            "sha256": "8f4b29c91d8a04ef7a32b9015c9e4210d7a6b29f0418c39e1a76f2b4c8e19a02",
            "zipName": "Requisition_99120_Donnees_Scellees_CloudHost.zip",
            "zipSize": "4.2 Mo"
        }
    }

    local_db["requisitions"]["REQ-2026-99118"] = {
        "id": "REQ-2026-99118",
        "organization_id": org_paytech_id,
        "company": "PayTech France",
        "officer": "Cpt Thomas B. (PJ Lyon)",
        "officer_email": "thomas.b@interieur.gouv.fr",
        "service": "Brigade Financière",
        "legalBasis": "Art. 60-1 CPP (Identification Bancaire)",
        "targetUser": "M. Jean-Marc V.",
        "status": "received",
        "statusText": "Scellé & Prêt au Téléchargement",
        "isUrgent": False,
        "urgency": "Délai Régulier (7 jours)",
        "created_at": "2026-08-14T08:30:00Z",
        "extractedData": {
            "userIP": "90.84.12.3:443",
            "isp": "Free SAS",
            "accountName": "M. Jean-Marc V.",
            "email": "client.lyon@free.fr",
            "phone": "+33 6 11 22 33 44",
            "timestamp": "Clôturé le 14/08/2026",
            "sha256": "c89320e819b5ff02a981cde288104fb99149182a4729104fae201948bcde8812",
            "zipName": "Requisition_99118_Identite_Bancaire_PayTech.zip",
            "zipSize": "2.1 Mo"
        }
    }


async def init_db():
    """Tente une connexion PostgreSQL (OVHcloud) ou active le mode autonome."""
    global pg_pool, is_postgres_active
    seed_local_db()
    
    if settings.database_url and not settings.use_sqlite_fallback:
        try:
            import asyncpg
            pg_pool = await asyncpg.create_pool(
                settings.database_url,
                min_size=2,
                max_size=10,
                timeout=3.0
            )
            is_postgres_active = True
            print("[DB] Connecté avec succès à PostgreSQL (SecNumCloud OVHcloud)")
            return
        except Exception as e:
            print(f"[DB] PostgreSQL distant non accessible ({e}) -> Mode Local Autonome Activé")
            is_postgres_active = False
    else:
        print("[DB] Mode Local Autonome Actif (Fast In-Memory / Zero Config)")
        is_postgres_active = False


async def close_db():
    global pg_pool
    if pg_pool:
        await pg_pool.close()
        print("[DB] Pool PostgreSQL fermé proprement")
