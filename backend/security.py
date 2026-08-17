"""
LEXASAFE FRANCE - MODULE DE SÉCURITÉ SOUVERAIN
Argon2id (passlib) • TOTP RFC 6238 (pyotp) • JWT (python-jose) • Filtrage IP WireGuard
"""

import ipaddress
import time
from typing import Any, Dict, Optional

import pyotp
from jose import JWTError, jwt
from passlib.hash import argon2 as _passlib_argon2

from config import settings

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1. HACHAGE ARGON2ID — OWASP 2026 / ANSSI RGS v2
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_argon2_hasher = _passlib_argon2.using(
    type="ID",          # Argon2id : résistant side-channel (Argon2i) + GPU (Argon2d)
    memory_cost=65536,  # 64 MiB — conforme OWASP, adapté VPS 4-8 Go
    time_cost=4,        # 4 itérations (relevé pour 2026)
    parallelism=4,      # 4 threads
    digest_size=32,     # 256 bits
    salt_len=16,        # 128 bits (CSPRNG via os.urandom)
)


def hash_password(password: str) -> str:
    """Hache un mot de passe via Argon2id (passlib). Aucun fallback autorisé."""
    return _argon2_hasher.hash(password)


def verify_password(stored_hash: str, candidate_password: str) -> bool:
    """
    Vérifie un mot de passe contre son hash Argon2id (format PHC ``$argon2id$...``).

    Résistant aux timing attacks : passlib délègue à argon2-cffi qui utilise
    une comparaison constant-time interne.
    Compatible avec les hash produits par argon2-cffi directement (même format PHC).
    """
    if not stored_hash or not stored_hash.startswith("$argon2"):
        return False
    try:
        return _argon2_hasher.verify(candidate_password, stored_hash)
    except Exception:
        return False


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2. TOTP RFC 6238 — via pyotp (bibliothèque auditée)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def generate_totp_secret_base32() -> str:
    """Génère un secret TOTP 160 bits, encodé Base32 RFC 4648 (Aegis / FreeOTP)."""
    return pyotp.random_base32(length=32)


def verify_totp_code(secret_b32: str, input_code: str, window: int = 1) -> bool:
    """
    Vérifie un code TOTP 6 chiffres avec tolérance ±1 intervalle de 30 secondes.

    Args:
        secret_b32: Secret TOTP encodé Base32 (stocké chiffré en BDD, déchiffré avant appel).
        input_code: Code saisi par l'utilisateur (6 chiffres).
        window: Nombre d'intervalles de tolérance (défaut: 1 = ±30s).

    Returns:
        True si le code est valide dans la fenêtre de tolérance.

    Sécurité:
        pyotp.TOTP.verify utilise hmac.compare_digest en interne (constant-time).
        Le rate limiting sur /verify-2fa (5 tentatives / 5 min) rend le brute-force
        des 10^6 combinaisons impraticable.
    """
    code = input_code.replace(" ", "").strip()
    if not code.isdigit() or len(code) != 6:
        return False
    try:
        totp = pyotp.TOTP(secret_b32)
        return totp.verify(code, valid_window=window)
    except Exception:
        return False


def build_otpauth_uri(email: str, secret_b32: str, issuer: str = "LexaSafe") -> str:
    """
    Construit l'URI otpauth:// pour enrollment QR Code (RFC 6238).

    Format strict: ``otpauth://totp/LexaSafe:{email}?secret={secret}&issuer=LexaSafe``
    Compatible Aegis, FreeOTP, Google Authenticator.
    """
    totp = pyotp.TOTP(secret_b32, issuer=issuer)
    return totp.provisioning_uri(name=email, issuer_name=issuer)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3. CONTRÔLE IP — WHITELIST VPN WIREGUARD & RIE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WIREGUARD_ADMIN_SUBNET = ipaddress.ip_network("10.88.0.0/24")
RIE_POLICE_SUBNET = ipaddress.ip_network("194.254.128.0/20")


def is_admin_vpn_authorized(client_ip: str) -> bool:
    """
    Vérifie si l'IP appartient au sous-réseau VPN WireGuard (10.88.0.0/24).

    SÉCURITÉ: le loopback (127.0.0.1) n'est PAS autorisé.
    Derrière un reverse proxy, ``request.client.host`` vaut ``127.0.0.1`` —
    autoriser le loopback accorderait l'accès admin à n'importe quel client.
    """
    try:
        ip = ipaddress.ip_address(client_ip)
        return ip in WIREGUARD_ADMIN_SUBNET
    except ValueError:
        return False


def is_rie_authorized(client_ip: str) -> bool:
    """
    Vérifie si la connexion émane du Réseau Interministériel de l'État (RIE).

    SÉCURITÉ: le loopback n'est PAS autorisé (même raison que ci-dessus).
    """
    try:
        ip = ipaddress.ip_address(client_ip)
        return ip in RIE_POLICE_SUBNET
    except ValueError:
        return False


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 4. VALIDATION MÉTIER — Email, Téléphone, SIREN
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FREE_EMAIL_DOMAINS = frozenset({
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.fr", "hotmail.com",
    "hotmail.fr", "outlook.com", "outlook.fr", "live.com", "live.fr",
    "icloud.com", "me.com", "protonmail.com", "proton.me", "mail.com",
    "aol.com", "yandex.com", "gmx.com", "gmx.fr", "free.fr", "laposte.net",
    "sfr.fr", "bbox.fr", "wanadoo.fr", "orange.fr",
})


def validate_opj_professional_email(email: str) -> bool:
    """Accepte les adresses @*.gouv.fr et rejette les fournisseurs grand public."""
    normalized = email.strip().lower()
    if "@" not in normalized:
        return False
    domain = normalized.rsplit("@", 1)[1]
    if domain in FREE_EMAIL_DOMAINS:
        return False
    return domain.endswith(".gouv.fr")


def validate_professional_email(email: str) -> bool:
    """Accepte toute adresse professionnelle et rejette les fournisseurs grand public."""
    normalized = email.strip().lower()
    if "@" not in normalized:
        return False
    domain = normalized.rsplit("@", 1)[1]
    if domain in FREE_EMAIL_DOMAINS:
        return False
    return "." in domain and len(domain) >= 4


def _luhn_valid(number: str) -> bool:
    """Contrôle de Luhn (utilisé pour SIREN/SIRET)."""
    total = 0
    for i, ch in enumerate(reversed(number)):
        d = ord(ch) - 48
        if d < 0 or d > 9:
            return False
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        total += d
    return total % 10 == 0


def validate_siren_siret(value: str) -> bool:
    """Valide un SIREN (9 chiffres) ou SIRET (14 chiffres) via l'algorithme de Luhn."""
    clean = "".join(c for c in value if c.isdigit())
    if len(clean) not in (9, 14):
        return False
    # Cas particulier légal : La Poste (SIREN 356000000) échoue au test de Luhn.
    if clean.startswith("356000000"):
        return True
    return _luhn_valid(clean)


def validate_phone_number_e164(phone: str) -> bool:
    """
    Vérifie la conformité E.164 française (+33) et rejette les numéros VoIP / virtuels.

    Préfixes acceptés: 01-07 (Fixe + Mobile). Préfixe 09 rejeté (VoIP non certifié).
    """
    clean = phone.replace(" ", "").replace("-", "").replace(".", "")
    if clean.startswith("0"):
        clean = "+33" + clean[1:]

    if not clean.startswith("+33") or len(clean) != 12:
        return False

    indicator = clean[3]
    if indicator in ("6", "7", "1", "2", "3", "4", "5"):
        return True

    return False


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 5. TOKENS JWT SIGNÉS — python-jose (HS256)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_JWT_ALGORITHM = "HS256"


def create_session_token(user_data: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
    """
    Génère un JWT signé HS256 via python-jose.

    Args:
        user_data: Claims personnalisés (sub, email, role).
        expires_in_seconds: Durée de validité (défaut: 24h).

    Returns:
        Token JWT signé en format compact JWS.
    """
    payload = {
        **user_data,
        "iat": int(time.time()),
        "exp": int(time.time()) + expires_in_seconds,
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=_JWT_ALGORITHM)


def verify_session_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Vérifie l'intégrité, la signature HMAC-SHA256 et l'expiration d'un JWT.

    python-jose vérifie automatiquement ``exp`` et rejette les tokens expirés.

    Returns:
        Payload décodé si le token est valide, None sinon.
    """
    try:
        payload: Dict[str, Any] = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[_JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None
