#!/bin/bash

# Mobile Development Pre-Commit Verification Script
# Run this before committing to ensure all rules are followed

set -e

echo "🔍 Mobile Development Pre-Commit Verification"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check if we're in mobile directory
if [ ! -d "mobile" ]; then
  echo -e "${RED}❌ Error: Not in project root (mobile/ directory not found)${NC}"
  exit 1
fi

cd mobile

echo "📋 Checking Flutter environment..."
if ! command -v flutter &> /dev/null; then
  echo -e "${RED}❌ Flutter not installed${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Flutter installed${NC}"
echo ""

# 1. Scope Check
echo "🔒 1. Scope Compliance Check"
echo "----------------------------"
cd ..
STAGED_FILES=$(git diff --cached --name-only)
NON_MOBILE_FILES=$(echo "$STAGED_FILES" | grep -v "^mobile/" || true)

if [ -n "$NON_MOBILE_FILES" ]; then
  echo -e "${RED}❌ CRITICAL: Files outside mobile/ are staged!${NC}"
  echo ""
  echo "Forbidden files:"
  echo "$NON_MOBILE_FILES"
  echo ""
  echo "Only mobile/ files are allowed. Run:"
  echo "  git restore --staged <file>"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ Only mobile/ files staged${NC}"
fi
cd mobile
echo ""

# 2. Linting
echo "🔍 2. Flutter Analysis (Linting)"
echo "--------------------------------"
flutter analyze > /tmp/flutter_analyze.log 2>&1
if [ $? -eq 0 ]; then
  if grep -q "No issues found" /tmp/flutter_analyze.log; then
    echo -e "${GREEN}✓ No linting issues${NC}"
  else
    echo -e "${YELLOW}⚠ Analysis passed but check output${NC}"
    cat /tmp/flutter_analyze.log
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}❌ Flutter analyze failed${NC}"
  cat /tmp/flutter_analyze.log
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 3. Tests
echo "🧪 3. Running Tests"
echo "-------------------"
if [ -d "test" ] && [ "$(ls -A test/*.dart 2>/dev/null)" ]; then
  flutter test > /tmp/flutter_test.log 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed${NC}"
  else
    echo -e "${RED}❌ Tests failed${NC}"
    cat /tmp/flutter_test.log
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${YELLOW}⚠ No tests found (test/ is empty)${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 4. Build Check
echo "🔨 4. Build Verification"
echo "------------------------"
echo "Building Android debug APK..."
flutter build apk --debug > /tmp/flutter_build.log 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build succeeded${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  cat /tmp/flutter_build.log
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 5. Code Pattern Checks
echo "📝 5. Code Pattern Verification"
echo "--------------------------------"

# Check for hardcoded colors
HARDCODED_COLORS=$(git diff --cached | grep -E "Color\(0x[0-9A-Fa-f]{8}\)" || true)
if [ -n "$HARDCODED_COLORS" ]; then
  echo -e "${YELLOW}⚠ Hardcoded colors detected (use AppColors constants)${NC}"
  echo "$HARDCODED_COLORS"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ No hardcoded colors${NC}"
fi

# Check for Material Icons
MATERIAL_ICONS=$(git diff --cached | grep -E "Icons\." || true)
if [ -n "$MATERIAL_ICONS" ]; then
  echo -e "${YELLOW}⚠ Material Icons detected (use LucideIcons)${NC}"
  echo "$MATERIAL_ICONS"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ No Material Icons${NC}"
fi

# Check for sharp corners
SHARP_CORNERS=$(git diff --cached | grep -E "BorderRadius\.zero" || true)
if [ -n "$SHARP_CORNERS" ]; then
  echo -e "${YELLOW}⚠ Sharp corners detected (use AppRadius constants)${NC}"
  echo "$SHARP_CORNERS"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ No sharp corners${NC}"
fi

echo ""

# 6. Git Commit Message Check
echo "💬 6. Commit Message Check"
echo "--------------------------"
cd ..
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
if [[ $BRANCH_NAME == mobile/* ]]; then
  echo -e "${GREEN}✓ Branch name starts with 'mobile/'${NC}"
else
  echo -e "${YELLOW}⚠ Branch should start with 'mobile/' (current: $BRANCH_NAME)${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check last commit message (if amending)
LAST_COMMIT_MSG=$(git log -1 --pretty=%B 2>/dev/null || echo "")
if [ -n "$LAST_COMMIT_MSG" ]; then
  if [[ $LAST_COMMIT_MSG == mobile:* ]]; then
    echo -e "${GREEN}✓ Last commit message has 'mobile:' prefix${NC}"
  else
    echo -e "${YELLOW}⚠ Commit message should start with 'mobile:'${NC}"
    echo "  Current: $LAST_COMMIT_MSG"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
cd mobile
echo ""

# 7. Security Check
echo "🔒 7. Security Verification"
echo "---------------------------"
SECRETS=$(git diff --cached | grep -iE "(api[_-]?key|secret|password|token)" || true)
if [ -n "$SECRETS" ]; then
  echo -e "${RED}⚠ Potential secrets detected in staged files${NC}"
  echo "$SECRETS"
  echo ""
  echo "Verify these are not actual secrets!"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ No obvious secrets detected${NC}"
fi
echo ""

# Summary
echo "=============================================="
echo "📊 Verification Summary"
echo "=============================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Safe to commit.${NC}"
  echo ""
  echo "Suggested commit command:"
  echo "  git commit -m \"mobile: [your description]\""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  echo ""
  echo "Warnings can be ignored if you're sure they're intentional."
  echo "Review warnings above before committing."
  echo ""
  echo "To commit anyway:"
  echo "  git commit -m \"mobile: [your description]\""
  exit 0
else
  echo -e "${RED}❌ $ERRORS error(s) found${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  fi
  echo ""
  echo "Fix errors before committing!"
  exit 1
fi
