# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
# Build with relative API path
ENV REACT_APP_BACKEND_URL=""
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend ./
RUN npm run build
# Prune dev dependencies for production
RUN npm prune --production

# Stage 3: Production Runner
FROM node:20-alpine
WORKDIR /app

# Install production dependencies only
COPY backend/package*.json ./
RUN npm install --only=production

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Environment
ENV NODE_ENV=production
ENV PORT=5050

EXPOSE 5050

CMD ["node", "dist/index.js"]
