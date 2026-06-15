# Stage 1: Build Frontend (Vite)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install --legacy-peer-deps --ignore-scripts
COPY frontend ./
RUN npm run build

# Stage 2: Production Runner — tsx runs TypeScript directly, no compile step needed
# node:20-slim (Debian) used here — Alpine lacks libssl.so.1.1 which Prisma requires
FROM node:20-slim
WORKDIR /app/backend
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY backend/package*.json ./
RUN npm install --ignore-scripts
COPY backend/prisma   ./prisma
RUN npx prisma generate
COPY backend/src      ./src
COPY backend/tsconfig.json ./
COPY --from=frontend-builder /app/frontend/build /app/frontend/build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "tsx", "src/index.ts"]
