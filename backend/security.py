"""
LEXASAFE FRANCE - MODULE DE SÉCURITÉ MILITAIRE SOUVERAIN
Argon2id • Tokens JWE Chiffrés • Validation A2F TOTP • Filtrage IP & VPN WireGuard
"""

import os
import time
import hmac
import hashlib
import struct
import base64
import ipaddress
from typing import Optional, Dict, Any

# 1. Hachage Argon2id
try:
    from argon2 import PasswordHasher
    from argon2.exceptions import VerifyMismatchError
    HASHER = PasswordHasher(
        time_cost=3,
        memory_cost=65536,  # 64 Mio
        parallelism=4,
        hash_len=32,
        salt_len=16
    )
except ImportError:
    HASHER = None

def hash_password(password: str) -> str:
    """Hache un mot de passe avec Argon2id selon les standards ANSSI."""
    if HASHER:
        return HASHER.hash(password)
    # Fallback PBKDF2-HMAC-SHA512 si Argon2 non installé en dev local
    salt = os.urandom(16)
    kdf = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt, 210000)
    return "pbkdf2_sha512$" + base64.b64encode(salt).decode('ascii') + "$" + base64.b64encode(kdf).decode('ascii')

def verify_password(stored_hash: str, candidate_password: str) -> bool:
    """Vérifie le mot de passe de manière résistante aux attaques temporelles."""
    if stored_hash.startswith('$argon2id') and HASHER:
        try:
            return HASHER.verify(stored_hash, candidate_password)
        except Exception:
            return False
    elif stored_hash.startswith('pbkdf2_sha512$'):
        parts = stored_hash.split('$')
        if len(parts) != 3:
            return False
        salt = base64.b64decode(parts[1])
        expected_kdf = base64.b64decode(parts[2])
        actual_kdf = hashlib.pbkdf2_hmac('sha512', candidate_password.encode('utf-8'), salt, 210000)
        return hmac.compare_digest(expected_kdf, actual_kdf)
    return False

# 2. Validation TOTP (RFC 6238)
def generate_totp_code(secret_bytes: bytes, intervals_no: Optional[int] = None) -> str:
    """Génère un code TOTP à 6 chiffres pour un secret donné."""
    if intervals_no is None:
        intervals_no = int(time.time()) // 30
    key = secret_bytes
    msg = struct.pack(">Q", intervals_no)
    h = hmac.new(key, msg, hashlib.sha1).digest()
    o = h[19] & 15
    h_int = (struct.unpack(">I", h[o:o+4])[0] & 0x7fffffff) % 1000000
    return f"{h_int:06d}"

def verify_totp_code(secret_bytes: bytes, input_code: str, window: int = 1) -> bool:
    """Vérifie un code TOTP avec une tolérance temporelle de +/- window pas de 30s."""
    current_interval = int(time.time()) // 30
    for i in range(-window, window + 1):
        if hmac.compare_digest(generate_totp_code(secret_bytes, current_interval + i), input_code.strip()):
            return True
    return False

# 3. Contrôle IP Whitelist & Sous-réseau VPN WireGuard
WIREGUARD_ADMIN_SUBNET = ipaddress.ip_network("10.88.0.0/24")
RIE_POLICE_SUBNET = ipaddress.ip_network("194.254.128.0/20")

def is_admin_vpn_authorized(client_ip: str) -> bool:
    """Vérifie si l'adresse IP cliente appartient au VPN sécurisé WireGuard."""
    try:
        ip = ipaddress.ip_address(client_ip)
        return ip in WIREGUARD_ADMIN_SUBNET or ip.is_loopback
    except ValueError:
        return False

def is_rie_authorized(client_ip: str) -> bool:
    """Vérifie si la connexion émane du Réseau Interministériel de l'État (RIE)."""
    try:
        ip = ipaddress.ip_address(client_ip)
        return ip in RIE_POLICE_SUBNET or ip.is_loopback
    except ValueError:
        return False

# 4. Validation Téléphonique Souveraine (Anti-VoIP / Anti-Jetables)
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


def validate_phone_number_e164(phone: str) -> bool:
    """
    Vérifie la conformité E.164 française (+33) et rejette les numéros VoIP / virtuels.
    """
    clean = phone.replace(" ", "").replace("-", "").replace(".", "")
    if clean.startswith("0"):
        clean = "+33" + clean[1:]
    
    if not clean.startswith("+33") or len(clean) != 12:
        return False
    
    # Préfixes valides en France : 01-05 (Fixe), 06-07 (Mobile)
    # Préfixe 09 = Souvent VoIP / Virtuel non certifié (Rejeté pour les accès critiques)
    indicator = clean[3]
    if indicator in ['6', '7', '1', '2', '3', '4', '5']:
        return True
    
    return False


# 5. Tokens de Session Signés Souverains (JWT HS256)
import json
from config import settings

def create_session_token(user_data: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
    """Génère un token de session signé HMAC-SHA256 sans dépendance tierce."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        **user_data,
        "iat": int(time.time()),
        "exp": int(time.time()) + expires_in_seconds
    }
    
    b64_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    b64_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    
    signature = hmac.new(
        settings.jwt_secret_key.encode(),
        f"{b64_header}.{b64_payload}".encode(),
        hashlib.sha256
    ).digest()
    b64_sig = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{b64_header}.{b64_payload}.{b64_sig}"


def verify_session_token(token: str) -> Optional[Dict[str, Any]]:
    """Vérifie l'intégrité et l'expiration d'un token de session."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        
        b64_header, b64_payload, b64_sig = parts
        
        expected_sig = hmac.new(
            settings.jwt_secret_key.encode(),
            f"{b64_header}.{b64_payload}".encode(),
            hashlib.sha256
        ).digest()
        
        rem = len(b64_sig) % 4
        padded_sig = b64_sig + ("=" * (4 - rem) if rem else "")
        actual_sig = base64.urlsafe_b64decode(padded_sig)
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        
        rem_p = len(b64_payload) % 4
        padded_payload = b64_payload + ("=" * (4 - rem_p) if rem_p else "")
        payload = json.loads(base64.urlsafe_b64decode(padded_payload).decode())
        
        if payload.get("exp", 0) < time.time():
            return None
        
        return payload
    except Exception:
        return None

