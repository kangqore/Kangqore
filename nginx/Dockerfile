# ─── Stage 1: Build frontend (Kangqore OS) ───────────────────────────────────
FROM node:20-alpine AS os-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# ─── Stage 2: Nginx serving ───────────────────────────────────────────────────
FROM nginx:1.25-alpine

# frontend/build → served under /kangqore-view/* by nginx
COPY --from=os-builder /app/frontend/build /var/www/kangqore-view

# Replace default Nginx config with ours
COPY nginx/kangqore.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
