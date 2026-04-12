FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ARG DATABASE_URL=file:./data/dev.db
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json /app/package-lock.json ./

RUN npm install --omit=dev && \
    npx prisma generate && \
    mkdir -p /app/data && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 5000

ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "mkdir -p /app/data && touch /app/data/dev.db && export DATABASE_URL='file:./data/dev.db' && npx prisma db push --accept-data-loss && node server.js"]
