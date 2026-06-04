# ─── Stage 1: Build kangqore-view ────────────────────────────────────────────
FROM node:20-alpine AS os-builder
WORKDIR /app/kangqore-view
COPY kangqore-view/package*.json ./
RUN npm ci
COPY kangqore-view ./
RUN npm run build

# ─── Stage 2: Nginx serving ───────────────────────────────────────────────────
FROM nginx:1.25-alpine

# kangqore-view dist → location Nginx will serve /assets/, /os/, /portal/ from
COPY --from=os-builder /app/kangqore-view/dist /var/www/kangqore-view

# Replace default Nginx config with ours
COPY nginx/kangqore.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
