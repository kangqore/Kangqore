#!/bin/bash
set -e

echo "🚀 Starting Production Build..."

# 1. Build Frontend
echo "📦 Building Frontend..."
cd frontend
# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    npm ci
fi
# Build with relative API path
REACT_APP_BACKEND_URL="" npm run build
cd ..

# 2. Build Backend
echo "⚙️ Building Backend..."
cd backend
# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    npm ci
fi
# Compile TypeScript
npm run build
cd ..

echo "✅ Build Complete!"
echo "To starting production server:"
echo "cd backend && npm start"
