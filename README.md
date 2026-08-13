# LexaSafe — Architecture Next.js 15 + FastAPI Souverain

Monorepo Turborepo pour la plateforme LexaSafe (OVHcloud SecNumCloud).

## Structure

```
apps/web/        → lexasafe.fr (landing, demo, FAQ)
apps/auth/       → auth.lexasafe.fr (login, A2F, reset)
apps/dashboard/  → app.lexasafe.fr (dashboards, checklist QA)
packages/ui/     → Design system partagé
packages/motion/ → Presets Framer Motion
backend/         → FastAPI API souveraine
infra/           → Docker Compose + Nginx production
```

## Démarrage local

```bash
# Installer les dépendances
npm install

# Lancer les 3 apps Next.js
npm run dev

# Backend FastAPI (terminal séparé)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## URLs locales

| Service | URL |
|---------|-----|
| Landing | http://localhost:3000 |
| Auth | http://localhost:3001 |
| Dashboard | http://localhost:3002 |
| API | http://localhost:8000 |

## Production (OVHcloud SecNumCloud)

```bash
cd infra
cp ../.env.example .env  # Configurer secrets
docker compose up -d
```

## Comptes démo

- OPJ: `officier.aurelien@interieur.gouv.fr` / `SecuredPass2026!` — A2F: `123456`
- DPO: `dpo@entreprise.fr` / `SecuredPass2026!` — A2F: `123456`

## Checklist QA

Accessible sur http://localhost:3002/admin/checklist (VPN requis en production).
