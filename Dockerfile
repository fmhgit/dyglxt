FROM node:20-alpine AS base

FROM base AS builder
# Add build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci

COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy source for running with tsx
COPY --from=builder /app/backend/src ./backend/src
COPY --from=builder /app/backend/tsconfig.json ./backend/

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npx", "tsx", "backend/src/index.node.ts"]
