# LEXASAFE FRANCE - DOCKERFILE SECURISE (Next.js Standalone)
# Image optimisée (Distroless/Alpine) et multi-stage.

FROM node:20-alpine AS base

# 1. Étape d'installation des dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/config/package.json ./packages/config/
COPY packages/motion/package.json ./packages/motion/
RUN npm ci

# 2. Étape de Build (Turborepo)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Optionnel: on passe les variables d'environnement de build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx turbo run build --filter=web...

# 3. Étape de Production (Runner)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Création d'un utilisateur non-root pour la sécurité (Zero Trust)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copie stricte des assets nécessaires (standalone mode)
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Lancement sécurisé
CMD ["node", "apps/web/server.js"]
