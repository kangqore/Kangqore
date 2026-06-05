# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
ENV REACT_APP_BACKEND_URL=""
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
RUN apk add --no-cache make gcc g++ python3
COPY backend/package*.json ./
RUN npm ci --ignore-scripts
COPY backend ./
RUN npm run build
RUN npm prune --production

# Stage 3: Production Runner
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --only=production --ignore-scripts
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=frontend-builder /app/frontend/build ./frontend/build
ENV NODE_ENV=production
ENV PORT=5050
EXPOSE 5050
CMD ["node", "dist/index.js"]
