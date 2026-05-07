@echo off
REM Kangqore Website - Quick Start Script for Windows
REM This script helps you get started quickly with local development

echo ================================================
echo Kangqore Website - Local Development Setup
echo ================================================
echo.

REM Check Node.js
echo Checking prerequisites...
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js found
    node --version
) else (
    echo [ERROR] Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python found
    python --version
) else (
    echo [ERROR] Python not found. Please install from https://python.org/
    pause
    exit /b 1
)

echo.
echo Setting up frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    where yarn >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        call yarn install
    ) else (
        call npm install
    )
) else (
    echo [OK] Frontend dependencies already installed
)

REM Check .env
if not exist ".env" (
    echo Creating frontend .env file...
    echo REACT_APP_BACKEND_URL=http://localhost:8001 > .env
    echo [OK] Created frontend/.env
) else (
    echo [OK] Frontend .env exists
)

cd ..

echo.
echo Setting up backend...
cd backend

if exist "requirements.txt" (
    echo Installing backend dependencies...
    python -m pip install -r requirements.txt
) else (
    echo [ERROR] requirements.txt not found
)

REM Check .env
if not exist ".env" (
    echo Creating backend .env file...
    echo MONGO_URL=mongodb://localhost:27017/kangqore > .env
    echo [OK] Created backend/.env
) else (
    echo [OK] Backend .env exists
)

cd ..

echo.
echo ================================================
echo Setup complete!
echo ================================================
echo.
echo Next steps:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend
echo    python server.py
echo.
echo 2. Start Frontend (Terminal 2):
echo    cd frontend
echo    yarn start   OR   npm start
echo.
echo 3. Open browser to: http://localhost:3000
echo.
echo For detailed instructions, see LOCAL_SETUP_GUIDE.md
echo.
echo Happy coding!
echo.
pause
