# syntax=docker/dockerfile:1.7

# 1) Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./
COPY prisma ./prisma          
RUN npm ci --omit=dev --ignore-scripts

# 2) Builder
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma Client 생성 (DB 접속 불필요)
RUN npx prisma generate
# Next.js 빌드
RUN npm run build

# 3) Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV PRISMA_CLIENT_ENGINE_TYPE=library   
RUN apk add --no-cache libc6-compat openssl

# 런타임에 필요한 산출물만 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Prisma Client 보장
RUN npx prisma generate

# 컨테이너 시작 시:
# 1) migrate deploy 시도
# 2) 실패하면(db에 마이그 없거나 초기상태) db push로 스키마 반영
# 3) 그래도 실패하면 앱만 띄워서 NotReady 방지 (원인 파악 동안 서비스 가동 유지)  # [ADD] echo 후 계속
CMD sh -c "npx prisma migrate deploy || npx prisma db push || echo '[warn] prisma init skipped'; npm run start -- -p ${PORT}"
