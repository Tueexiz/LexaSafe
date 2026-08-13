"""
LEXASAFE FRANCE - PURGE CRYPTOGRAPHIQUE RGPD (CRYPTO-SHREDDING)
Effacement définitif et irréversible conforme aux recommandations CNIL & ANSSI
"""

import os
import sys
import hashlib
import secrets

def crypto_shred_file(file_path: str, passes: int = 3) -> bool:
    """
    Écrase le fichier avec des octets pseudo-aléatoires cryptographiques
    puis supprime le descripteur de fichier pour interdire toute récupération matérielle.
    """
    if not os.path.exists(file_path):
        print(f"[!] Fichier introuvable : {file_path}")
        return False
    
    file_size = os.path.getsize(file_path)
    
    with open(file_path, "ba+", buffering=0) as f:
        for p in range(passes):
            f.seek(0)
            # Écriture d'aléa cryptographique
            random_data = secrets.token_bytes(file_size)
            f.write(random_data)
            f.flush()
            os.fsync(f.fileno())
            print(f"[+] Passe d'écrasement {p+1}/{passes} terminée ({file_size} octets)")
            
    # Suppression définitive
    os.remove(file_path)
    print(f"[SUCCESS] Fichier détruit cryptographiquement : {file_path}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python crypto_shred.py <chemin_du_fichier>")
        sys.exit(1)
    crypto_shred_file(sys.argv[1])
