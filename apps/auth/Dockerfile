FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/auth/package.json ./apps/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/motion/package.json ./packages/motion/
COPY packages/ui/package.json ./packages/ui/
RUN npm ci --workspace=@lexasafe/auth

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=@lexasafe/auth

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/auth/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/auth/.next/static ./apps/auth/.next/static
USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/auth/server.js"]
