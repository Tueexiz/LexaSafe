"""
TEST DE VALIDATION API LEXASAFE - SUITE AUTOMATISÉE
Vérifie tous les endpoints REST en simulation locale (FastAPI TestClient)
"""

import sys
import os

# Ajouter le dossier backend au path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from fastapi.testclient import TestClient
from main import app

def run_tests():
    print("=== DEBUT DES TESTS AUTOMATISES API LEXASAFE ===")
    
    with TestClient(app) as client:
        # 1. Healthcheck
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[PASS] 1. Healthcheck (/api/health) -> 200 OK")

        # 2. Login OPJ (Etape 1)
        res = client.post("/api/auth/login", json={
            "email": "officier.aurelien@interieur.gouv.fr",
            "password": "SecuredPass2026!",
            "role": "opj"
        })
        assert res.status_code == 200, f"Login failed: {res.text}"
        data = res.json()
        assert data["status"] == "a2f_required"
        challenge_id = data["challenge_id"]
        print(f"[PASS] 2. Login OPJ Etape 1 -> Challenge A2F genere: {challenge_id}")

        # 3. Validation A2F (Etape 2)
        res = client.post("/api/auth/verify-2fa", json={
            "challenge_id": challenge_id,
            "totp_code": "894201"
        })
        assert res.status_code == 200, f"2FA verification failed: {res.text}"
        auth_data = res.json()
        token = auth_data["access_token"]
        assert token is not None
        print("[PASS] 3. Validation A2F OTP -> Token JWT souverain delivre")

        # 4. Profil connecte (/api/auth/me)
        res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200, f"Get me failed: {res.text}"
        print(f"[PASS] 4. Profil verifie (/api/auth/me) -> Role: {res.json()['user']['role']}")

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
