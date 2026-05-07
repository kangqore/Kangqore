#!/bin/bash

# Kangqore Website - Quick Start Script
# This script helps you get started quickly with local development

echo "🚀 Kangqore Website - Local Development Setup"
echo "=============================================="
echo ""

# Check Node.js
echo "📦 Checking prerequisites..."
if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    echo "✅ Python found: $(python3 --version)"
elif command -v python &> /dev/null; then
    echo "✅ Python found: $(python --version)"
else
    echo "❌ Python not found. Please install from https://python.org/"
    exit 1
fi

echo ""
echo "🔧 Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    if command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
else
    echo "✅ Frontend dependencies already installed"
fi

# Check .env
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
    echo "✅ Created frontend/.env"
else
    echo "✅ Frontend .env exists"
fi

cd ..

echo ""
echo "🐍 Setting up backend..."
cd backend
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found"
else
    echo "Installing backend dependencies..."
    if command -v pip3 &> /dev/null; then
        pip3 install -r requirements.txt
    else
        pip install -r requirements.txt
    fi
fi

# Check .env
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    echo "MONGO_URL=mongodb://localhost:27017/kangqore" > .env
    echo "✅ Created backend/.env"
else
    echo "✅ Backend .env exists"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   python3 server.py"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   yarn start"
echo ""
echo "3. Open browser to: http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see LOCAL_SETUP_GUIDE.md"
echo ""
echo "🎉 Happy coding!"
