-- ==============================================================================
-- LEXASAFE FRANCE - SCHÉMA DE BASE DE DONNÉES SOUVERAINE POSTGRESQL 16+
-- Conformité SecNumCloud • Row Level Security (RLS) • Zéro IDOR • UUIDv4
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ORGANISATIONS (Entreprises B2B, Opérateurs Telco, Fintech, Hébergeurs)
-- ------------------------------------------------------------------------------
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siren VARCHAR(9) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    legal_dpo_email VARCHAR(255) NOT NULL,
    contact_phone_e164 VARCHAR(20) NOT NULL,
    ip_whitelist CIDR[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ABONNEMENTS SAAS & FACTURATION (Annuel lissé mensuellement)
-- ------------------------------------------------------------------------------
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('standard_saas', 'enterprise_dedicated', 'custom_onprem')),
    annual_price_cents BIGINT NOT NULL, -- Ex: 1200000 = 12 000 € HT / an
    monthly_equivalent_cents BIGINT NOT NULL, -- Ex: 100000 = 1 000 € HT / mois
    billing_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (billing_status IN ('active', 'past_due', 'canceled', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    renewal_reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. UTILISATEURS & AUTHENTIFICATION FORTE (A2F / PKI RIE)
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Hash Argon2id
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'dpo_enterprise', 'legal_officer', 'opj_investigator')),
    is_a2f_enabled BOOLEAN DEFAULT TRUE,
    totp_secret_encrypted BYTEA, -- Secret TOTP chiffré par App Master Key
    pki_certificate_serial VARCHAR(128), -- Carte Agent OPJ
    phone_e164 VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    is_vpn_required BOOLEAN DEFAULT FALSE,
    last_login_ip INET,
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. RÉQUISITIONS JUDICIAIRES (Architecture Zéro-Knowledge E2EE)
-- ------------------------------------------------------------------------------
CREATE TABLE requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 pour référence publique sans IDOR
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    opj_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    legal_basis VARCHAR(100) NOT NULL CHECK (legal_basis IN ('CPP_60_1', 'CPP_60_2', 'E_EVIDENCE_2026', 'URGENCE_8H')),
    encrypted_payload_path VARCHAR(512) NOT NULL, -- Stockage S3 OVHcloud chiffré
    aes_encrypted_envelope BYTEA NOT NULL, -- Clé AES chiffrée avec la clé publique de l'OPJ
    sha256_seal VARCHAR(64) NOT NULL, -- Empreinte probatoire eIDAS
    urgency_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'verified', 'processing', 'sealed', 'delivered', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 5. JOURNAL D'AUDIT INFALSIFIABLE (Loi e-Evidence & CNIL)
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_id UUID REFERENCES requisitions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    ip_address INET NOT NULL,
    user_agent VARCHAR(512),
    details_encrypted BYTEA, -- Métadonnées sensibles chiffrées
    hash_chain VARCHAR(64) NOT NULL, -- Blockchain/Chaine de hachage SHA-256
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. ÉVÉNEMENTS DE SÉCURITÉ & TÉLÉMÉTRIE EDR
-- ------------------------------------------------------------------------------
CREATE TABLE edr_security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    ja3_fingerprint VARCHAR(64),
    packet_count INTEGER DEFAULT 0,
    payload_size_bytes BIGINT DEFAULT 0,
    threat_level VARCHAR(50) NOT NULL CHECK (threat_level IN ('info', 'warning', 'high', 'critical')),
    action_taken VARCHAR(50) NOT NULL CHECK (action_taken IN ('allow', 'challenge_a2f', 'quarantine', 'block_ip', 'report_pharos')),
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- POLITIQUES ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Politique : Une organisation ne peut lire que ses propres réquisitions
CREATE POLICY org_requisition_isolation ON requisitions
    FOR ALL
    USING (organization_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- Index pour performances et intégrité
CREATE INDEX idx_requisitions_org ON requisitions(organization_id);
CREATE INDEX idx_requisitions_hash ON requisitions(public_hash);
CREATE INDEX idx_audit_logs_req ON audit_logs(requisition_id);
CREATE INDEX idx_edr_events_ip ON edr_security_events(ip_address);
