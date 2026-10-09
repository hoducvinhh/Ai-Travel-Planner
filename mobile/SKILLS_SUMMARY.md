# Mobile Development - Skills & Rules Summary

This document provides a quick reference to all skills, rules, and guidelines for mobile development.

## 📁 Files Created

### Core Rules & Documentation

1. **`CLAUDE.md`** - Main rules file for Claude agents
   - Scope constraints (mobile/ only)
   - Backend integration protocol
   - Code quality gates
   - Commit/branch naming conventions

2. **`README.md`** - Project overview and quick start guide
   - Setup instructions
   - Architecture overview
   - Design system summary
   - Development workflow

3. **`plan-mobile.md`** - Complete development plan
   - Technology stack decisions
   - Phase-by-phase timeline
   - UI/UX design system
   - Backend integration strategy

### Skills (`.claude/skills/`)

4. **`mobile-ui-guidelines.md`** - UI/UX design rules
   - Color system (AppColors)
   - Icon system (LucideIcons - black/white only)
   - Component templates
   - Anti-patterns (avoiding AI slop)
   - Rounded corners requirements
   
5. **`mobile-architecture.md`** - Architecture patterns
   - Folder structure
   - State management (Riverpod)
   - Repository pattern
   - API service (Dio)
   - Navigation (go_router)
   - Error handling

6. **`mobile-development-rules.md`** - Development constraints
   - Scope boundaries (mobile/ only)
   - Backend integration rules
   - Git workflow
   - Code quality standards
   - Security rules
   - Pre-commit checklist

### Configuration

7. **`.claude/settings.json`** - Claude configuration
   - File access rules
   - Allowed bash commands
   - Auto-load skills
   - Pre-commit checks
   - Guidelines and warnings

8. **`.gitignore`** - Git ignore patterns
   - Flutter/Dart artifacts
   - Generated files
   - Sensitive data
   - IDE files

### Templates

9. **`.github/PULL_REQUEST_TEMPLATE.md`** - PR checklist
   - Code quality checks
   - Scope compliance
   - UI/UX standards
   - Testing evidence

10. **`.github/ISSUE_TEMPLATE/backend-integration.md`** - Backend issue template
    - Missing endpoint requests
    - Backend bug reports
    - Workaround documentation

11. **`.github/ISSUE_TEMPLATE/bug-report.md`** - Mobile bug report template
    - Reproduction steps
    - Environment details
    - Error logs

12. **`.github/ISSUE_TEMPLATE/feature-request.md`** - Feature request template
    - Use case description
    - Technical considerations
    - Backend dependencies

## 🎯 Quick Reference

### When to Load Which Skill

**Before ANY UI work:**
```
Load: mobile-ui-guidelines
```

**Before implementing features:**
```
Load: mobile-architecture
```

**Before making ANY changes:**
```
Load: mobile-development-rules
```

### Most Important Rules

#### 1. Scope Constraints
```
✅ ONLY modify: mobile/
❌ NEVER touch: backend/, frontend/, ml-service/, database/
```

#### 2. UI Standards
```
✅ Colors: AppColors.primary, AppColors.textPrimary, etc.
❌ Colors: Color(0xFFFF6B6B), Colors.red, etc.

✅ Icons: LucideIcons.heart (black/white/gray only)
❌ Icons: Icons.favorite, colored icons

✅ Rounded: BorderRadius.circular(AppRadius.md)
❌ Rounded: BorderRadius.zero, BorderRadius.circular(32)
```

#### 3. Architecture
```
Screen → Provider → Repository → Service → Backend API

✅ DO: Follow the flow
❌ DON'T: Skip layers, put logic in wrong place
```

#### 4. Backend Integration
```
✅ DO: Call API endpoints
❌ DON'T: Modify backend code

If endpoint missing:
1. Create issue (backend-needed label)
2. Implement workaround in mobile
3. Wait for backend team
```

#### 5. Git Workflow
```
Branch:  mobile/feature-name
Commit:  mobile: clear description
Stage:   git add mobile/
```

## 🚦 Pre-Commit Checklist

**Every single commit MUST pass these:**

```bash
# 1. Linting
flutter analyze
# Must output: "No issues found!"

# 2. Tests
flutter test
# Must output: "All tests passed!"

# 3. Build
flutter build apk --debug
# Must succeed

# 4. Scope check
git diff --cached --name-only | grep -v "^mobile/"
# Must be empty (no output)

# 5. Commit message check
git log -1 --pretty=%B | grep "^mobile:"
# Must match
```

## 📋 Common Patterns

### Creating a Feature

```bash
# 1. Load skills
# Read: mobile-ui-guidelines, mobile-architecture, mobile-development-rules

# 2. Create branch
git checkout -b mobile/feature-trip-weather

# 3. Implement following architecture:
# - Screen: lib/screens/trips/widgets/trip_weather_widget.dart
# - Provider: lib/providers/weather_provider.dart
# - Repository: lib/repositories/weather_repository.dart
# - Service: (use existing ApiService)

# 4. Use design system:
# - Colors: AppColors.*
# - Icons: LucideIcons.*
# - Rounded: AppRadius.*

# 5. Test
flutter analyze
flutter test
flutter build apk --debug

# 6. Commit
git add mobile/
git commit -m "mobile: add weather forecast widget to trip detail"

# 7. Push and create PR
git push origin mobile/feature-trip-weather
```

### Requesting Backend Endpoint

```markdown
# Create issue using backend-integration template

Title: [Backend] GET /trips/:id/weather

Use Case: Trip detail screen needs 7-day weather forecast

Proposed Endpoint: GET /trips/:id/weather
Response: { forecast: [{date, temp, condition}] }

Workaround: Using OpenWeatherMap API directly from mobile for now
```

### Fixing UI Issue

```dart
// ❌ BEFORE (wrong)
Container(
  decoration: BoxDecoration(
    color: Color(0xFFFF0000),  // Hardcoded
    borderRadius: BorderRadius.zero,  // Sharp corners
  ),
  child: Icon(Icons.favorite, color: Colors.red),  // Material icon, colored
)

// ✅ AFTER (correct)
Container(
  decoration: BoxDecoration(
    color: AppColors.primary,  // Design system
    borderRadius: BorderRadius.circular(AppRadius.md),  // Rounded
  ),
  child: Icon(
    LucideIcons.heart,  // Lucide icon
    color: Colors.white,  // White on colored background
  ),
)
```

## 🔍 Troubleshooting

### "Permission denied" when trying to modify backend file

**Problem:** Trying to edit `backend/src/**/*`  
**Solution:** Don't edit backend. Create issue with `backend-needed` label.

### "Wrong icon package" warning

**Problem:** Using `Icons.*` from Material  
**Solution:** Use `LucideIcons.*` instead

### "Hardcoded color" warning

**Problem:** Using `Color(0xFF...)` or `Colors.*`  
**Solution:** Use `AppColors.*` constants

### "No rounded corners" warning

**Problem:** `BorderRadius.zero` or missing borderRadius  
**Solution:** Use `BorderRadius.circular(AppRadius.md/lg)`

### Build fails after git pull

**Problem:** Dependencies changed  
**Solution:**
```bash
flutter clean
flutter pub get
flutter run
```

## 📚 Learning Path

### Day 1: Setup & Rules
1. Read `CLAUDE.md`
2. Read `mobile-development-rules` skill
3. Setup Flutter environment
4. Run `flutter doctor`

### Day 2: Architecture
1. Read `mobile-architecture` skill
2. Study folder structure
3. Understand Screen → Provider → Repository → Service flow
4. Read example code in plan

### Day 3: UI/UX
1. Read `mobile-ui-guidelines` skill
2. Study design system (AppColors, LucideIcons, AppRadius)
3. Review anti-patterns (AI slop)
4. Practice creating components

### Day 4+: Implementation
1. Load all three skills before coding
2. Follow architecture patterns
3. Use design system
4. Test before committing
5. Only touch mobile/ files

## 🎓 Best Practices

### DO ✅

- Load skills before implementing features
- Follow Screen → Provider → Repository → Service architecture
- Use AppColors, LucideIcons, AppRadius constants
- Rounded corners on ALL components (8-16dp)
- Black/white/gray icons only (colored backgrounds OK)
- Test on emulator before committing
- Create issues for backend needs
- Only modify mobile/ files

### DON'T ❌

- Skip loading skills
- Put business logic in screens
- Use hardcoded colors/Material icons
- Sharp corners (borderRadius: 0)
- Colored icons on light backgrounds
- Modify backend/frontend code
- Commit without testing
- Use AI slop patterns (glass morphism, gradient overload, giant emojis)

## 📞 Getting Help

### For UI Questions
→ Re-read `mobile-ui-guidelines` skill

### For Architecture Questions
→ Re-read `mobile-architecture` skill

### For Scope/Permission Questions
→ Re-read `mobile-development-rules` skill

### For Backend Issues
→ Create issue using `backend-integration` template

### For Bugs
→ Create issue using `bug-report` template

### For New Features
→ Create issue using `feature-request` template

## 🔄 Continuous Improvement

This skills/rules system will evolve. When you discover:

- New anti-patterns → Add to `mobile-ui-guidelines`
- Better architecture patterns → Add to `mobile-architecture`
- Common mistakes → Add to `mobile-development-rules`
- New constraints → Update `CLAUDE.md`

**Update these files so future agents benefit from lessons learned.**

---

**Last Updated:** 2026-10-09  
**Version:** 1.0.0  
**Status:** Ready for implementation
