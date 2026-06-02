#!/bin/bash
set -e

echo "Starting production build..."

# 1. Build legacy frontend (CRA)
echo "Building frontend..."
cd frontend
if [ ! -d "node_modules" ]; then npm ci; fi
REACT_APP_BACKEND_URL="" npm run build
cd ..

# 2. Build Dashboard OS (Vite)
echo "Building kangqore-view..."
cd kangqore-view
if [ ! -d "node_modules" ]; then npm ci; fi
npm run build
cd ..

# 3. Build backend (TypeScript)
echo "Building backend..."
cd backend
if [ ! -d "node_modules" ]; then npm ci; fi
npm run build
cd ..

echo ""
echo "Build complete."
echo ""
echo "Docker Compose (recommended):"
echo "  docker compose up --build"
echo ""
echo "Bare-metal:"
echo "  Copy kangqore-view/dist/ to /var/www/kangqore-view/"
echo "  Copy nginx/kangqore.conf to /etc/nginx/conf.d/"
echo "  nginx -t && nginx -s reload"
echo "  cd backend && npm start"
