#!/bin/bash

echo "🚀 Starting System Repair..."

# 1. Start Docker Services
echo "📦 Attempting to start Docker containers..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
elif docker compose version &> /dev/null; then
    docker compose up -d
else
    echo "❌ Error: Docker is not installed or not in your PATH."
    echo "Please start Docker Desktop manually."
    exit 1
fi

# 2. Wait for Database
echo "⏳ Waiting 10 seconds for Database to initialize..."
sleep 10

# 3. Reset Admin Credentials
echo "🔑 Resetting Admin Credentials..."
cd backend
npx ts-node src/scripts/reset-admin.ts

echo "✅ Done! You can now login with:"
echo "   Email: admin@kangqore.com"
echo "   Password: KangqoreAdmin2024!"
