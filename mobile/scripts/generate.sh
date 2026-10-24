#!/bin/bash

# Mobile Module - Code Generation Script
# This script generates all Freezed models and fixes common issues

echo "🚀 Starting code generation for Travel Planner Mobile..."
echo ""

# Check if we're in the mobile directory
if [ ! -f "pubspec.yaml" ]; then
    echo "❌ Error: pubspec.yaml not found. Please run this script from the mobile directory."
    exit 1
fi

echo "📦 Step 1: Getting dependencies..."
flutter pub get

if [ $? -ne 0 ]; then
    echo "❌ Failed to get dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🔨 Step 2: Cleaning previous build..."
flutter clean
dart run build_runner clean

echo "✅ Clean complete"
echo ""

echo "⚙️ Step 3: Generating Freezed code..."
dart run build_runner build --delete-conflicting-outputs

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate code"
    exit 1
fi

echo "✅ Code generation complete"
echo ""

echo "🔍 Step 4: Checking generated files..."
GENERATED_FILES=(
    "lib/models/user.freezed.dart"
    "lib/models/user.g.dart"
    "lib/models/trip.freezed.dart"
    "lib/models/trip.g.dart"
    "lib/models/place.freezed.dart"
    "lib/models/place.g.dart"
    "lib/models/chat_message.freezed.dart"
    "lib/models/chat_message.g.dart"
    "lib/models/community_post.freezed.dart"
    "lib/models/community_post.g.dart"
)

ALL_FOUND=true
for file in "${GENERATED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (missing)"
        ALL_FOUND=false
    fi
done

echo ""

if [ "$ALL_FOUND" = true ]; then
    echo "✅ All generated files present"
else
    echo "⚠️ Some generated files are missing"
fi

echo ""
echo "📊 Step 5: Running analysis..."
flutter analyze --no-fatal-infos

echo ""
echo "✨ Code generation complete!"
echo ""
echo "Next steps:"
echo "1. Run 'flutter run' to start the app"
echo "2. Check for any remaining errors in your IDE"
echo "3. Run 'flutter test' to verify tests pass"
echo ""
