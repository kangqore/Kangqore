# ─── Stage 1: Build dashboard-os ─────────────────────────────────────────────
FROM node:20-alpine AS os-builder
WORKDIR /app/dashboard-os
COPY dashboard-os/package*.json ./
RUN npm ci
COPY dashboard-os ./
RUN npm run build

# ─── Stage 2: Nginx serving ───────────────────────────────────────────────────
FROM nginx:1.25-alpine

# dashboard-os dist → location Nginx will serve /assets/, /os/, /portal/ from
COPY --from=os-builder /app/dashboard-os/dist /var/www/dashboard-os

# Replace default Nginx config with ours
COPY nginx/kangqore.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
