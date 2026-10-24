@echo off
REM Mobile Module - Code Generation Script for Windows
REM This script generates all Freezed models and fixes common issues

echo Starting code generation for Travel Planner Mobile...
echo.

REM Check if we're in the mobile directory
if not exist "pubspec.yaml" (
    echo Error: pubspec.yaml not found. Please run this script from the mobile directory.
    exit /b 1
)

echo Step 1: Getting dependencies...
call flutter pub get

if errorlevel 1 (
    echo Failed to get dependencies
    exit /b 1
)

echo Dependencies installed
echo.

echo Step 2: Cleaning previous build...
call flutter clean
call dart run build_runner clean

echo Clean complete
echo.

echo Step 3: Generating Freezed code...
call dart run build_runner build --delete-conflicting-outputs

if errorlevel 1 (
    echo Failed to generate code
    exit /b 1
)

echo Code generation complete
echo.

echo Step 4: Checking generated files...
set ALL_FOUND=1

if exist "lib\models\user.freezed.dart" (echo   OK user.freezed.dart) else (echo   MISSING user.freezed.dart & set ALL_FOUND=0)
if exist "lib\models\user.g.dart" (echo   OK user.g.dart) else (echo   MISSING user.g.dart & set ALL_FOUND=0)
if exist "lib\models\trip.freezed.dart" (echo   OK trip.freezed.dart) else (echo   MISSING trip.freezed.dart & set ALL_FOUND=0)
if exist "lib\models\trip.g.dart" (echo   OK trip.g.dart) else (echo   MISSING trip.g.dart & set ALL_FOUND=0)
if exist "lib\models\place.freezed.dart" (echo   OK place.freezed.dart) else (echo   MISSING place.freezed.dart & set ALL_FOUND=0)
if exist "lib\models\place.g.dart" (echo   OK place.g.dart) else (echo   MISSING place.g.dart & set ALL_FOUND=0)
if exist "lib\models\chat_message.freezed.dart" (echo   OK chat_message.freezed.dart) else (echo   MISSING chat_message.freezed.dart & set ALL_FOUND=0)
if exist "lib\models\chat_message.g.dart" (echo   OK chat_message.g.dart) else (echo   MISSING chat_message.g.dart & set ALL_FOUND=0)
if exist "lib\models\community_post.freezed.dart" (echo   OK community_post.freezed.dart) else (echo   MISSING community_post.freezed.dart & set ALL_FOUND=0)
if exist "lib\models\community_post.g.dart" (echo   OK community_post.g.dart) else (echo   MISSING community_post.g.dart & set ALL_FOUND=0)

echo.

if %ALL_FOUND%==1 (
    echo All generated files present
) else (
    echo Some generated files are missing
)

echo.
echo Step 5: Running analysis...
call flutter analyze --no-fatal-infos

echo.
echo Code generation complete!
echo.
echo Next steps:
echo 1. Run 'flutter run' to start the app
echo 2. Check for any remaining errors in your IDE
echo 3. Run 'flutter test' to verify tests pass
echo.

pause
