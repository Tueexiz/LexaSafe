export type ChecklistStatus = "pending" | "validated" | "tested";

export interface ChecklistItem {
  id: string;
  phase: string;
  label: string;
  status: ChecklistStatus;
  updatedAt?: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Phase 1
  { id: "p1-1", phase: "Phase 1 — Front-End & UX", label: "Fond animé réactif souris/scroll", status: "pending" },
  { id: "p1-2", phase: "Phase 1 — Front-End & UX", label: "Glassmorphism cards lisibles (contraste ≥ 4.5:1)", status: "pending" },
  { id: "p1-3", phase: "Phase 1 — Front-End & UX", label: "CTA Demander une démo visible above-the-fold", status: "pending" },
  { id: "p1-4", phase: "Phase 1 — Front-End & UX", label: "Framer Motion fade-up sur sections", status: "pending" },
  { id: "p1-5", phase: "Phase 1 — Front-End & UX", label: "Login séparé auth.lexasafe.fr", status: "pending" },
  { id: "p1-6", phase: "Phase 1 — Front-End & UX", label: "404 custom animée", status: "pending" },
  { id: "p1-7", phase: "Phase 1 — Front-End & UX", label: "FAQ accordion dynamique + schema.org", status: "pending" },
  { id: "p1-8", phase: "Phase 1 — Front-End & UX", label: "sitemap.xml complet", status: "pending" },
  { id: "p1-9", phase: "Phase 1 — Front-End & UX", label: "robots.txt ASCII art", status: "pending" },
  { id: "p1-10", phase: "Phase 1 — Front-End & UX", label: "Fonts self-hosted woff2 (0 Google Fonts)", status: "pending" },
  // Phase 2
  { id: "p2-1", phase: "Phase 2 — Back-End", label: "A2F TOTP obligatoire à l'inscription", status: "pending" },
  { id: "p2-2", phase: "Phase 2 — Back-End", label: "Whitelist IP par organisation", status: "pending" },
  { id: "p2-3", phase: "Phase 2 — Back-End", label: "Admin accessible uniquement via VPN WireGuard", status: "pending" },
  { id: "p2-4", phase: "Phase 2 — Back-End", label: "SMTP souverain fonctionnel", status: "pending" },
  { id: "p2-5", phase: "Phase 2 — Back-End", label: "Validation téléphone anti-VoIP", status: "pending" },
  { id: "p2-6", phase: "Phase 2 — Back-End", label: "Abonnements annuels lissés mensuellement", status: "pending" },
  { id: "p2-7", phase: "Phase 2 — Back-End", label: "Notifications renouvellement J-30/J-7/J-1", status: "pending" },
  // Phase 3
  { id: "p3-1", phase: "Phase 3 — Cybersécurité", label: "Argon2id sur tous les mots de passe", status: "pending" },
  { id: "p3-2", phase: "Phase 3 — Cybersécurité", label: "JWE session chiffré (A256GCM)", status: "pending" },
  { id: "p3-3", phase: "Phase 3 — Cybersécurité", label: "Reset password usage unique TTL 15min", status: "pending" },
  { id: "p3-4", phase: "Phase 3 — Cybersécurité", label: "Zéro UUID exposé en front (public_hash only)", status: "pending" },
  { id: "p3-5", phase: "Phase 3 — Cybersécurité", label: "RLS PostgreSQL actif et testé", status: "pending" },
  { id: "p3-6", phase: "Phase 3 — Cybersécurité", label: "Clés DB séparées de Master Key", status: "pending" },
  { id: "p3-7", phase: "Phase 3 — Cybersécurité", label: "HSTS preload actif", status: "pending" },
  { id: "p3-8", phase: "Phase 3 — Cybersécurité", label: "CSRF protection totale", status: "pending" },
  { id: "p3-9", phase: "Phase 3 — Cybersécurité", label: "XSS : CSP sans unsafe-inline scripts", status: "pending" },
  { id: "p3-10", phase: "Phase 3 — Cybersécurité", label: "Upload : scan ClamAV + renommage UUID", status: "pending" },
  { id: "p3-11", phase: "Phase 3 — Cybersécurité", label: "Antibot sur tous les formulaires", status: "pending" },
  { id: "p3-12", phase: "Phase 3 — Cybersécurité", label: "Rate-limit IP + compte exponentiel", status: "pending" },
  { id: "p3-13", phase: "Phase 3 — Cybersécurité", label: "Audit logs chiffrés avec hash chain", status: "pending" },
  { id: "p3-14", phase: "Phase 3 — Cybersécurité", label: "Backups chiffrés automatisés", status: "pending" },
  { id: "p3-15", phase: "Phase 3 — Cybersécurité", label: "RGPD : droit suppression définitive", status: "pending" },
  // Phase 4
  { id: "p4-1", phase: "Phase 4 — QA", label: "Lighthouse ≥ 95 sur pages publiques", status: "pending" },
  { id: "p4-2", phase: "Phase 4 — QA", label: "Responsive mobile/tablette validé", status: "pending" },
  { id: "p4-3", phase: "Phase 4 — QA", label: "États hover/focus sur tous interactifs", status: "pending" },
  { id: "p4-4", phase: "Phase 4 — QA", label: "OWASP ZAP : 0 alertes High/Critical", status: "pending" },
  { id: "p4-5", phase: "Phase 4 — QA", label: "Test IDOR : 0 faille", status: "pending" },
  { id: "p4-6", phase: "Phase 4 — QA", label: "Test brute-force : lockout fonctionnel", status: "pending" },
];
