@echo off
echo ========================================
echo Starting All Services
echo ========================================
echo.

REM Check if setup was done
if not exist "backend\node_modules" (
    echo ERROR: Please run auto_setup.bat first
    pause
    exit /b 1
)

REM Start Recommendation Service in background
echo [1/3] Starting Recommendation Service...
start "Recommendation Service" cmd /k "cd recommendation-service && uvicorn app.main:app --reload"
echo Waiting for service to start...
timeout /t 10 /nobreak
echo.

REM Train Model
echo [2/3] Training ML Model...
echo This will take 2-3 minutes, please wait...
curl -X POST http://localhost:8000/train
if %errorlevel% neq 0 (
    echo WARNING: Training failed, service might not be ready yet
    echo You can manually train later with: curl -X POST http://localhost:8000/train
)
echo.

REM Start Backend
echo [3/3] Starting Backend Service...
start "Backend Service" cmd /k "cd backend && pnpm run start:dev"
echo.

echo ========================================
echo All Services Started!
echo ========================================
echo.
echo Recommendation Service: http://localhost:8000
echo Backend API: http://localhost:3000
echo.
echo Test with: test_system.bat
echo View API docs: http://localhost:8000/docs
echo.
echo Press any key to keep terminals open...
pause
