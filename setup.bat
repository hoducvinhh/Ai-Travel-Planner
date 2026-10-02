@echo off
REM AI Travel Planner Setup Script for Windows

echo Setting up AI Travel Planner...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo Docker is running

REM Start PostgreSQL
echo Starting PostgreSQL...
docker-compose up -d postgres

REM Wait for PostgreSQL to be ready
echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

REM Setup Backend
echo Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)

echo Installing dependencies...
call npm install

echo Running database migrations...
call npx prisma migrate dev --name init

echo Generating Prisma client...
call npx prisma generate

cd ..

REM Setup Recommendation Service
echo Setting up Recommendation Service...
cd recommendation-service

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)

echo Installing Python dependencies...
pip install -r requirements.txt

echo Generating mock data...
python generate_mock_data.py

echo Loading mock data into database...
python load_mock_data.py

cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Add your GEMINI_API_KEY to backend\.env
echo 2. Start the recommendation service:
echo    cd recommendation-service
echo    uvicorn app.main:app --reload
echo.
echo 3. In another terminal, train the model:
echo    curl -X POST http://localhost:8000/train
echo.
echo 4. In another terminal, start the backend:
echo    cd backend
echo    npm run start:dev
echo.
echo 5. Access the API at http://localhost:3000
echo.

pause
