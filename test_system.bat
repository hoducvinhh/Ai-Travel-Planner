@echo off
REM AI Travel Planner - System Test Script (Windows)
REM This script tests all major components of the system

echo Testing AI Travel Planner System...
echo.

set PASSED=0
set FAILED=0

REM Test 1: PostgreSQL
echo 1. Testing PostgreSQL...
docker ps | findstr travel_planner_postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] PostgreSQL container is running
    set /a PASSED+=1
) else (
    echo [FAIL] PostgreSQL container is not running
    set /a FAILED+=1
)
echo.

REM Test 2: Recommendation Service
echo 2. Testing Recommendation Service...
curl -s -o nul -w "%%{http_code}" http://localhost:8000/health > temp_response.txt
set /p RESPONSE=<temp_response.txt
del temp_response.txt
if "%RESPONSE%"=="200" (
    echo [PASS] Recommendation service health check (HTTP %RESPONSE%)
    set /a PASSED+=1
) else (
    echo [FAIL] Recommendation service health check (HTTP %RESPONSE%)
    set /a FAILED+=1
)
echo.

REM Test 3: Backend Service
echo 3. Testing Backend Service...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/recommendations/health > temp_response.txt
set /p RESPONSE=<temp_response.txt
del temp_response.txt
if "%RESPONSE%"=="200" (
    echo [PASS] Backend recommendation health (HTTP %RESPONSE%)
    set /a PASSED+=1
) else (
    echo [FAIL] Backend recommendation health (HTTP %RESPONSE%)
    set /a FAILED+=1
)
echo.

REM Test 4: Mock data check
echo 4. Checking test data...
if exist "recommendation-service\mock_users.json" (
    echo [PASS] Mock data files found
    set /a PASSED+=1
) else (
    echo [WARN] Mock data not found. Run generate_mock_data.py first
)
echo.

REM Summary
echo ========================================
echo Test Results
echo ========================================
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.

if %FAILED% equ 0 (
    echo All tests passed!
    echo.
    echo Your AI Travel Planner is ready to use!
    echo.
    echo Next steps:
    echo 1. Import docs\postman_collection.json into Postman
    echo 2. Start building the frontend
    echo 3. Add more places to the database
) else (
    echo Some tests failed
    echo.
    echo Troubleshooting:
    echo 1. Make sure all services are running: docker-compose ps
    echo 2. Check if mock data is loaded
    echo 3. Check if model is trained: curl http://localhost:8000/health
    echo 4. Check logs: docker-compose logs
)

pause
