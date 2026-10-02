@echo off
echo ========================================
echo AI Travel Planner - Auto Setup Script
echo ========================================
echo.

REM Step 1: Install Backend Dependencies
echo [1/8] Installing backend dependencies...
cd backend
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo SUCCESS: Backend dependencies installed
echo.

REM Step 2: Setup Environment
echo [2/8] Setting up environment files...
if not exist .env (
    copy .env.example .env
    echo IMPORTANT: Please edit backend\.env and add your GEMINI_API_KEY
    echo Press any key after you've added the API key...
    pause
)
echo.

REM Step 3: Start PostgreSQL
echo [3/8] Starting PostgreSQL...
cd ..
docker-compose up -d postgres
if %errorlevel% neq 0 (
    echo ERROR: Failed to start PostgreSQL
    echo Make sure Docker is running
    pause
    exit /b 1
)
echo Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak
echo.

REM Step 4: Run Database Migration
echo [4/8] Running database migration...
cd backend
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo WARNING: Migration might have already run
)
call npx prisma generate
echo.

REM Step 5: Setup Python Environment
echo [5/8] Setting up Python recommendation service...
cd ..\recommendation-service
if not exist .env (
    copy .env.example .env
)
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo.

REM Step 6: Generate Mock Data
echo [6/8] Generating mock data...
python generate_mock_data.py
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate mock data
    pause
    exit /b 1
)
echo.

REM Step 7: Load Mock Data
echo [7/8] Loading mock data into database...
python load_mock_data.py
if %errorlevel% neq 0 (
    echo ERROR: Failed to load mock data
    pause
    exit /b 1
)
echo.

REM Step 8: Instructions for starting services
echo [8/8] Setup Complete!
echo.
echo ========================================
echo Next Steps - Start Services:
echo ========================================
echo.
echo STEP A: Start Recommendation Service
echo   Open a new terminal and run:
echo   cd recommendation-service
echo   uvicorn app.main:app --reload
echo.
echo STEP B: Train Model (after Step A is running)
echo   Open another terminal and run:
echo   curl -X POST http://localhost:8000/train
echo   (Wait 2-3 minutes for training to complete)
echo.
echo STEP C: Start Backend (after Step B completes)
echo   Open another terminal and run:
echo   cd backend
echo   npm run start:dev
echo.
echo STEP D: Test the system
echo   curl http://localhost:3000/recommendations/health
echo.
echo ========================================
echo Or run these automated scripts:
echo ========================================
echo   start_services.bat   - Start all services automatically
echo   test_system.bat      - Test the system
echo ========================================

cd ..
pause
