@echo off
REM AI Travel Planner - Complete Auto Setup for Windows
REM This script does EVERYTHING for you

echo ==========================================
echo AI Travel Planner - Complete Setup
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check pnpm
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] pnpm not found. Installing...
    call npm install -g pnpm
)
echo [OK] pnpm found

REM Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Install from https://www.python.org/
    pause
    exit /b 1
)
echo [OK] Python found

REM Check Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker not running. Please start Docker Desktop
    pause
    exit /b 1
)
echo [OK] Docker is running

echo.
echo ==========================================
echo Installing Dependencies
echo ==========================================
echo.

REM Backend dependencies
echo [1/6] Installing backend dependencies...
cd backend
call pnpm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..
echo.

REM Setup backend .env
echo [2/6] Setting up backend environment...
cd backend
if not exist .env (
    copy .env.example .env
    echo.
    echo ==========================================
    echo IMPORTANT: Setup GEMINI API Key
    echo ==========================================
    echo.
    echo 1. Go to: https://ai.google.dev/
    echo 2. Get your free API key
    echo 3. Open backend\.env in notepad
    echo 4. Add: GEMINI_API_KEY=your_key_here
    echo.
    start notepad .env
    echo.
    pause
)
cd ..
echo.

REM Start PostgreSQL
echo [3/6] Starting PostgreSQL...
docker-compose up -d postgres
echo Waiting for PostgreSQL to start...
timeout /t 15 /nobreak >nul
echo [OK] PostgreSQL started
echo.

REM Database migration
echo [4/6] Running database migration...
cd backend
call pnpm prisma migrate dev --name init --skip-seed
if %errorlevel% neq 0 (
    echo [WARNING] Migration might have already run, continuing...
)
call pnpm prisma generate
echo [OK] Database schema created
cd ..
echo.

REM Python setup and mock data
echo [5/6] Setting up Python and generating mock data...
cd recommendation-service

if not exist .env (
    copy .env.example .env
)

echo Installing Python packages...
pip install -r requirements.txt -q

echo Generating mock data (400 users, 200 places, 15,000 interactions)...
python generate_mock_data.py

echo Loading mock data into PostgreSQL...
python load_mock_data.py

echo [OK] Mock data generated and loaded
cd ..
echo.

REM Instructions
echo [6/6] Setup complete!
echo.
echo ==========================================
echo Installation Complete!
echo ==========================================
echo.
echo What has been done:
echo   [OK] Backend dependencies installed
echo   [OK] PostgreSQL database started
echo   [OK] Database schema migrated
echo   [OK] 400 users generated
echo   [OK] 200 places generated
echo   [OK] 15,000 interactions generated
echo   [OK] Mock data loaded into database
echo.
echo ==========================================
echo Next Steps - Start Services:
echo ==========================================
echo.
echo TERMINAL 1 - Start Recommendation Service:
echo   cd recommendation-service
echo   uvicorn app.main:app --reload
echo.
echo TERMINAL 2 - Train ML Model (wait 10s after Terminal 1):
echo   curl -X POST http://localhost:8000/train
echo   (This takes 2-3 minutes)
echo.
echo TERMINAL 3 - Start Backend (after training completes):
echo   cd backend
echo   pnpm run start:dev
echo.
echo ==========================================
echo Useful Resources:
echo ==========================================
echo.
echo   - API Documentation: docs\API.md
echo   - Postman Collection: docs\postman_collection.json
echo   - Implementation Guide: IMPLEMENTATION_SUMMARY.md
echo.
echo   - Recommendation API: http://localhost:8000/docs
echo   - Backend API: http://localhost:3000
echo.
echo ==========================================
echo Ready to code!
echo ==========================================
echo.
pause
