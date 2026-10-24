# AI Travel Planner - Mobile App

Flutter mobile application for AI Travel Planner - iOS and Android end-user experience.

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Rules for AI agents (auto-loaded)
- **[TASKS.md](TASKS.md)** - 471 tasks breakdown with checkboxes
- **[mobile-tech-stack.md](mobile-tech-stack.md)** - Technology decisions
- **Guides & Specifications** (in docs/guides/):
  - [SETUP.md](docs/guides/SETUP.md) & [SETUP_ADVANCED.md](docs/guides/SETUP_ADVANCED.md)
  - [API_INTEGRATION.md](docs/guides/API_INTEGRATION.md)
  - [TESTING_GUIDE.md](docs/guides/TESTING_GUIDE.md) & [QUICK_FIX_GUIDE.md](docs/guides/QUICK_FIX_GUIDE.md)
  - [STRUCTURE.md](docs/guides/STRUCTURE.md)
  - [FEATURE_SHOWCASE.md](docs/guides/FEATURE_SHOWCASE.md)
- **Progress Reports** (in docs/reports/):
  - [COMPLETION_REPORT.md](docs/reports/COMPLETION_REPORT.md)
  - [FINAL_STATUS_REPORT.md](docs/reports/FINAL_STATUS_REPORT.md)
  - [DEVELOPMENT_SUMMARY.md](docs/reports/DEVELOPMENT_SUMMARY.md)
  - [IMPLEMENTATION_PROGRESS.md](docs/reports/IMPLEMENTATION_PROGRESS.md)
- **Skills** (in `.claude/skills/`):
  - `mobile-ui-guidelines.md` - UI/UX design rules
  - `mobile-architecture.md` - Architecture patterns
  - `mobile-development-rules.md` - Development constraints

## 🎯 Project Overview

**Platform:** Flutter 3.24+ (iOS & Android)  
**Language:** Dart 3.5+  
**State Management:** Riverpod 2.5+  
**Target Users:** End users only (no admin features)

## 📱 Features

### Phase 1 (MVP - Weeks 1-2)
- ✅ Authentication (Login, Register, Biometric)
- ✅ Trip Management (List, Create, Detail)
- ✅ Map Integration (flutter_map + Google tiles)

### Phase 2 (Enhanced - Weeks 3-4)
- ✅ Places Discovery (Browse, Search, Filters)
- ✅ RAG Chatbot (SSE streaming)
- ✅ Offline Support (SQLite caching)

### Phase 3 (Social - Weeks 5-6)
- ✅ Community (Feed, Posts, Comments)
- ✅ Local Notifications
- ✅ UI Polish (Sunset theme)

## 🚀 Quick Start

### Prerequisites

```bash
# Install Flutter SDK 3.24+
# https://flutter.dev/docs/get-started/install

# Verify installation
flutter doctor

# Install dependencies
flutter pub get
```

### Run Development

```bash
# Run on Android emulator/device
flutter run --dart-define=API_URL=http://localhost:3002

# Run on iOS simulator (Mac only)
flutter run --dart-define=API_URL=http://localhost:3002

# Hot reload: Press 'r' in terminal
# Hot restart: Press 'R' in terminal
```

### Build

```bash
# Android debug
flutter build apk --debug

# Android release
flutter build apk --release

# iOS debug (Mac only)
flutter build ios --debug

# iOS release (Mac only)
flutter build ios --release
```

## 🏗️ Architecture

```
lib/
├── screens/          # UI Screens (Presentation Layer)
├── widgets/          # Reusable Widgets
├── providers/        # State Management (Riverpod)
├── repositories/     # Business Logic
├── services/         # Data Layer (API, Storage)
├── models/           # Data Models
├── config/           # App Configuration
└── utils/            # Utilities
```

**Pattern:** Screen → Provider → Repository → Service → Backend API

## 🎨 Design System

### Colors (Sunset Travel Theme)

```dart
AppColors.primary       // Coral #FF6B6B (CTA buttons)
AppColors.secondary     // Turquoise #4ECDC4 (Beach category)
AppColors.accent        // Golden #FFA500 (Ratings, bookmarks)
AppColors.textPrimary   // Black #1A1A1A (Main text)
AppColors.background    // Light Gray #FAFAFA (Screen background)
```

### Icons (Black/White Only)

```dart
// Package: lucide_icons_flutter
Icon(LucideIcons.heart, color: AppColors.textPrimary)  // Black on light
Icon(LucideIcons.plus, color: Colors.white)            // White on button
```

### Rounded Corners (All Components)

```dart
AppRadius.sm   // 8dp  - Badges, chips
AppRadius.md   // 12dp - Buttons, inputs
AppRadius.lg   // 16dp - Cards
AppRadius.xl   // 20dp - Modals
AppRadius.full // 999dp - Avatars, icon buttons
```

## 📋 Development Rules

### ✅ Allowed (Mobile Team)

- Modify any files in `mobile/` folder
- Call backend API endpoints
- Create issues for backend bugs/features
- Test locally against backend

### ❌ Forbidden (Without Permission)

- Modify `backend/`, `frontend/`, `ml-service/`
- Change database schema
- Edit root `package.json`, `docker-compose.yml`
- Modify CI/CD workflows (except mobile-specific)

### Backend Integration

**Consume API, don't modify backend:**

```dart
// ✅ CORRECT - Call existing endpoint
final trips = await apiService.get('/trips');

// ❌ WRONG - Don't edit backend code
// backend/src/trips/trips.controller.ts
```

**When endpoint is missing:**
1. Create issue with label `backend-needed`
2. Implement workaround in mobile (if possible)
3. Wait for backend team to implement

## 🧪 Testing

### Run Tests

```bash
# All tests
flutter test

# With coverage
flutter test --coverage

# Specific file
flutter test test/repositories/trips_repository_test.dart
```

### Linting

```bash
# Run analyzer
flutter analyze

# Fix auto-fixable issues
dart fix --apply
```

## 📝 Git Workflow

### Branch Naming

```bash
git checkout -b mobile/feature-login-screen
git checkout -b mobile/fix-trip-card-layout
```

### Commit Messages

```bash
git commit -m "mobile: implement login screen with biometric auth"
git commit -m "mobile: fix trip card image caching"
```

### Pre-Commit Checklist

- [ ] `flutter analyze` passes (0 issues)
- [ ] `flutter test` passes (all green)
- [ ] Only mobile/ files staged
- [ ] Commit message starts with "mobile:"
- [ ] Branch name starts with "mobile/"

## 🔧 Configuration

### Environment Variables

```bash
# Development
flutter run --dart-define=API_URL=http://localhost:3002

# Staging
flutter run --dart-define=API_URL=https://api-staging.example.com

# Production
flutter build apk --release --dart-define=API_URL=https://api.example.com
```

### Backend API Endpoints

```
Base URL: http://localhost:3002 (local)

Auth:
- POST /auth/login
- POST /auth/register
- GET /auth/profile

Trips:
- GET /trips
- POST /trips
- GET /trips/:id

Places:
- GET /places
- GET /places/:id

Chat:
- POST /api/chat (SSE streaming)

Community:
- GET /community/posts
- POST /community/posts
```

## 📚 Documentation

- [Mobile Plan](./plan-mobile.md) - Full development plan
- [Tech Stack](./mobile-tech-stack.md) - Technologies used
- [CLAUDE.md](./CLAUDE.md) - Claude agent rules

### Skills (in `.claude/skills/`)

- `mobile-ui-guidelines.md` - UI/UX design rules
- `mobile-architecture.md` - Architecture patterns
- `mobile-development-rules.md` - Development constraints

## 🐛 Troubleshooting

### Flutter Doctor Issues

```bash
flutter doctor

# Fix Android licenses
flutter doctor --android-licenses

# Fix iOS setup (Mac only)
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Build Issues

```bash
# Clean build
flutter clean
flutter pub get

# Clear cache
flutter pub cache clean
```

### Hot Reload Not Working

```bash
# Stop app and restart
flutter run
# Press 'R' for hot restart
```

## 📦 Dependencies

### Core
- `flutter_riverpod: ^2.5.0` - State management
- `dio: ^5.4.0` - HTTP client
- `go_router: ^14.2.0` - Navigation

### UI
- `lucide_icons_flutter: ^1.1.0` - Icons
- `cached_network_image: ^3.3.0` - Image caching
- `flutter_animate: ^4.5.0` - Animations

### Maps
- `flutter_map: ^7.0.2` - Map widget
- `latlong2: ^0.9.0` - Coordinates
- `geolocator: ^11.0.0` - Location services

### Storage
- `sqflite: ^2.3.0` - Local database
- `flutter_secure_storage: ^9.0.0` - Secure storage
- `shared_preferences: ^2.2.0` - Key-value storage

### Chat
- `http: ^1.2.0` - SSE streaming
- `flutter_markdown: ^0.6.0` - Markdown rendering

See `pubspec.yaml` for full list.

## 📊 Project Status

**Current Phase:** Setup & Planning  
**Sprint:** Pre-Sprint  
**Progress:** 0% (Plan complete, implementation starts next)

**Timeline:**
- Setup: Week 1 (current)
- Phase 1 (Core): Weeks 1-2
- Phase 2 (Enhanced): Weeks 3-4
- Phase 3 (Social): Weeks 5-6
- Testing: Week 7
- App Store Prep: Week 8

## 🤝 Contributing

### For Mobile Team

1. Read `CLAUDE.md` before coding
2. Load skills before implementing features
3. Follow architecture patterns
4. Use design system (AppColors, LucideIcons, AppRadius)
5. Run quality checks before committing
6. Only modify files in `mobile/`

### For Backend Team

When mobile team creates issue with `backend-needed`:
1. Review issue for endpoint requirements
2. Implement in backend repo
3. Deploy to staging
4. Notify mobile team when ready
5. Mobile team integrates and tests

## 📞 Contact

**Mobile Team Lead:** [Your Name]  
**Backend Team Lead:** [Backend Lead]  
**Project Manager:** [PM Name]

---

**Built with ❤️ using Flutter**
