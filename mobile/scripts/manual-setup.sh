#!/bin/bash
# Mobile App - Manual Setup Commands
# Run these commands manually when Flutter classifier is available

set -e

echo "=========================================="
echo "Mobile App Setup - Manual Commands"
echo "=========================================="
echo ""

# Step 1: Initialize Flutter project
echo "Step 1: Initialize Flutter project"
echo "Command: flutter create . --project-name travel_planner --org com.travelplanner --platforms android,ios"
echo ""
read -p "Press Enter after running the above command..."

# Step 2: Install dependencies
echo ""
echo "Step 2: Install dependencies"
echo "Command: flutter pub get"
echo ""
read -p "Press Enter after running the above command..."

# Step 3: Verify setup
echo ""
echo "Step 3: Verify setup"
echo "Command: flutter doctor"
echo ""
read -p "Press Enter after running the above command..."

# Step 4: Run analyzer
echo ""
echo "Step 4: Run analyzer"
echo "Command: flutter analyze"
echo ""
read -p "Press Enter after running the above command..."

# Step 5: Git commit
echo ""
echo "Step 5: Git commit (from project root)"
echo "Commands:"
echo "  git add mobile/"
echo "  git status"
echo '  git commit -m "mobile: phase 0 setup complete - project structure and configuration"'
echo ""
read -p "Press Enter after committing..."

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next: Run the app with:"
echo "  flutter run --dart-define=API_URL=http://localhost:3002"
