#!/bin/bash

# Mobile App Setup Script
# Run this script to initialize the Flutter project

set -e

echo "🚀 Initializing Flutter Mobile App..."

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first."
    echo "Visit: https://flutter.dev/docs/get-started/install"
    exit 1
fi

echo "✅ Flutter found: $(flutter --version | head -1)"

# Create Flutter project structure
echo "📦 Creating Flutter project..."
flutter create . --project-name travel_planner --org com.travelplanner --platforms android,ios

# Install dependencies
echo "📥 Installing dependencies..."
flutter pub get

# Run code generation for freezed/json_serializable (will be used later)
echo "🔧 Setting up code generation..."
flutter pub run build_runner build --delete-conflicting-outputs

# Verify installation
echo "🔍 Running Flutter doctor..."
flutter doctor

# Run analyzer
echo "🧪 Running analyzer..."
flutter analyze

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the backend: cd ../backend && npm run start:dev"
echo "2. Run the app: flutter run --dart-define=API_URL=http://localhost:3002"
echo ""
echo "📝 For more info, see SETUP.md"
