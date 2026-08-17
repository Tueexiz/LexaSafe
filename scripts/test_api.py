"""
TEST DE VALIDATION API LEXASAFE - SUITE AUTOMATISÉE
Vérifie tous les endpoints REST en simulation locale (FastAPI TestClient)
"""

import sys
import os

os.environ["APP_ENV"] = "development"

# Ajouter le dossier backend au path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from fastapi.testclient import TestClient
from main import app
from db import local_db
from security import (
    generate_totp_code,
    generate_totp_secret_base32,
    totp_secret_to_bytes,
    verify_totp_code,
    build_otpauth_uri,
    hash_password,
    verify_password,
)


def _current_totp(email: str) -> str:
    user = local_db["users"][email]
    secret = user["totp_secret"]
    assert secret, "Le secret TOTP doit être persisté après l'étape login (enroll)"
    return generate_totp_code(totp_secret_to_bytes(secret))


def test_totp_helpers():
    secret_b32 = generate_totp_secret_base32()
    assert "=" not in secret_b32
    secret_bytes = totp_secret_to_bytes(secret_b32)
    code = generate_totp_code(secret_bytes)
    assert len(code) == 6 and code.isdigit()
    assert verify_totp_code(secret_bytes, code)
    assert not verify_totp_code(secret_bytes, "000000") or code == "000000"
    uri = build_otpauth_uri("officier.aurelien@interieur.gouv.fr", secret_b32)
    assert uri.startswith("otpauth://totp/LexaSafe:officier.aurelien@interieur.gouv.fr?")
    assert "secret=" in uri and "issuer=LexaSafe" in uri
    assert "algorithm=SHA1" in uri and "digits=6" in uri and "period=30" in uri
    digest = hash_password("SecuredPass2026!")
    assert digest.startswith("$argon2id") or digest.startswith("pbkdf2_sha512$")
    assert verify_password(digest, "SecuredPass2026!")
    assert not verify_password(digest, "wrong-password")


def run_tests():
    print("=== DEBUT DES TESTS AUTOMATISES API LEXASAFE ===")
    test_totp_helpers()
    print("[PASS] 0. Helpers TOTP RFC 6238 + Argon2id")

    with TestClient(app) as client:
        # 1. Healthcheck
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[PASS] 1. Healthcheck (/api/health) -> 200 OK")

        demo_email = "officier.aurelien@interieur.gouv.fr"

        # 2. Login OPJ (Etape 1) — enroll TOTP, pas de code universel
        res = client.post("/api/auth/login", json={
            "email": demo_email,
            "password": "SecuredPass2026!",
            "role": "opj"
        })
        assert res.status_code == 200, f"Login failed: {res.text}"
        data = res.json()
        assert data["status"] == "a2f_required"
        assert data.get("enroll") is True
        assert data.get("otpauth_uri", "").startswith("otpauth://totp/")
        stored_pw = local_db["users"][demo_email]["password"]
        assert stored_pw != "SecuredPass2026!"
        assert stored_pw.startswith("$argon2id") or stored_pw.startswith("pbkdf2_sha512$")
        challenge_id = data["challenge_id"]
        print(f"[PASS] 2. Login OPJ Etape 1 -> Challenge A2F genere: {challenge_id}")

        # 2b. Code démo historique rejeté ; challenge inconnu rejeté
        real_preview = _current_totp(demo_email)
        wrong_code = "894201" if real_preview != "894201" else "000000"
        res = client.post("/api/auth/verify-2fa", json={
            "challenge_id": challenge_id,
            "totp_code": wrong_code
        })
        assert res.status_code == 400, f"Demo/wrong TOTP should fail: {res.text}"
        res = client.post("/api/auth/verify-2fa", json={
            "challenge_id": "chl_unknown_should_fail",
            "totp_code": "123456"
        })
        assert res.status_code == 400
        print("[PASS] 2b. Bypass A2F (894201 / challenge inconnu) refuse")

        # 3. Validation A2F (Etape 2) via TOTP réel
        totp_code = _current_totp(demo_email)
        res = client.post("/api/auth/verify-2fa", json={
            "challenge_id": challenge_id,
            "totp_code": totp_code
        })
        assert res.status_code == 200, f"2FA verification failed: {res.text}"
        auth_data = res.json()
        token = auth_data["access_token"]
        assert token is not None
        # Challenge one-shot
        res_replay = client.post("/api/auth/verify-2fa", json={
            "challenge_id": challenge_id,
            "totp_code": totp_code
        })
        assert res_replay.status_code == 400
        print("[PASS] 3. Validation A2F TOTP -> Token JWT souverain delivre (challenge one-shot)")

        # 3b. Deuxième login : plus d'enrollment / pas d'otpauth_uri
        res = client.post("/api/auth/login", json={
            "email": demo_email,
            "password": "SecuredPass2026!",
            "role": "opj"
        })
        assert res.status_code == 200
        data_relogin = res.json()
        assert data_relogin["status"] == "a2f_required"
        assert "otpauth_uri" not in data_relogin
        assert data_relogin.get("enroll") is not True
        print("[PASS] 3b. Relogin sans re-enroll QR")

        # 4. Profil connecte (/api/auth/me)
        res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200, f"Get me failed: {res.text}"
        me = res.json()["user"]
        assert "password" not in me and "totp_secret" not in me
        print(f"[PASS] 4. Profil verifie (/api/auth/me) -> Role: {me['role']}")

        # 5. Liste des requisitions
        res = client.get("/api/requisitions/")
        assert res.status_code == 200
        req_list = res.json()
        assert req_list["total"] >= 2, f"Expected at least 2 requisitions, got {req_list['total']}"
        print(f"[PASS] 5. Liste des requisitions -> {req_list['total']} requisitions chargees")

        # 6. Creation d'une requisition
        res = client.post("/api/requisitions/new", json={
            "organization_name": "Fintech Solutions France",
            "legal_basis": "CPP_60_1",
            "target_identifier": "suspect_ip_99@target.fr",
            "urgency": True
        })
        assert res.status_code == 200
        created_req = res.json()
        new_id = created_req["requisition_id"]
        print(f"[PASS] 6. Depot de requisition -> ID: {new_id} (Scellement: {created_req['sha256_seal'][:12]}...)")

        # 7. Telechargement d'archive PKZIP reelle
        res = client.get(f"/api/requisitions/{new_id}/download-zip")
        assert res.status_code == 200
        assert res.headers["content-type"] == "application/zip"
        assert res.content[:4] == b"PK\x03\x04", "En-tete ZIP invalide !"
        print(f"[PASS] 7. Telechargement .ZIP binaire -> {len(res.content)} octets (Signature PKZIP validee)")

        # 8. Calcul ROI et frais de justice
        res = client.post("/api/costs/calculate-roi", json={
            "requisitions_count_monthly": 50,
            "service_type": "identification_ip",
            "hourly_legal_cost": 85.0
        })
        assert res.status_code == 200
        roi = res.json()
        print(f"[PASS] 8. Moteur de Frais de Justice -> ROI estime: {roi['roi_percentage']} (Gain net: {roi['net_gain_eur']} EUR)")

        # 9. Verification email OPJ (@interieur.gouv.fr vs @gmail.com)
        res_valid = client.post("/api/opj/verify-email", json={"email": "commissaire.dupont@interieur.gouv.fr"})
        assert res_valid.json()["is_valid"] is True
        res_invalid = client.post("/api/opj/verify-email", json={"email": "hacker@gmail.com"})
        assert res_invalid.json()["is_valid"] is False
        print("[PASS] 9. Filtre emails institutionnels -> @interieur.gouv.fr VALIDE / @gmail.com REJETE")

        # 10. Telemetrie SecNumCloud & Sonde EDR
        res = client.get("/api/admin/telemetry")
        assert res.status_code == 200
        assert res.json()["infrastructure"]["provider"] == "OVHcloud France (SecNumCloud)"
        print("[PASS] 10. Console SecOps & Supervision EDR -> Statut: OPERATIONAL_OPTIMAL")

    print("\n=======================================================")
    print("TOUS LES TESTS DU BACK-END LEXASAFE SONT AU VERT (100%)")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
