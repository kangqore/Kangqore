#!/bin/bash
echo "🚀 Starting Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please open Docker Desktop and try again."
  exit 1
fi

# Start only the database container
echo "📦 Spinning up PostgreSQL container..."
docker compose up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "✅ Database is online at localhost:5432"
echo "👉 You can now run the pending commands."
