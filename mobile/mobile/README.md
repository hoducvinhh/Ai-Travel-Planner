# README - Travel Planner Mobile App

<div align="center">

# 🌏 Travel Planner Mobile

**Flutter-based mobile application for AI-powered travel planning**

[![Flutter](https://img.shields.io/badge/Flutter-3.24.0-blue)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.5.0-blue)](https://dart.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#features) • [Screenshots](#screenshots) • [Setup](#setup) • [Documentation](#documentation)

</div>

---

## 📱 About

Travel Planner is a modern mobile application that helps users plan their trips with AI assistance. Built with Flutter, it features a beautiful Material Design 3 UI with the "Sunset Theme" (Coral + Turquoise).

### Key Highlights

- 🤖 **AI Chatbot** - Get travel recommendations via RAG-powered chatbot
- 🗺️ **Interactive Maps** - View trips and places on beautiful maps
- 📱 **Offline First** - Works without internet with SQLite caching
- 🎨 **Beautiful UI** - Material Design 3 with custom Sunset theme
- 🔔 **Smart Notifications** - Get reminded about upcoming trips
- 👥 **Social Features** - Share experiences with the community

---

## ✨ Features

### 🔐 Authentication
- Email/password login & registration
- Biometric authentication support
- Secure token storage

### 🗓️ Trip Planning
- 4-step trip creation wizard
- Smart destination suggestions
- Budget and preferences tracking
- Visual itinerary with maps

### 📍 Places Discovery
- Browse places with advanced filters
- Search by name, category, or location
- View detailed place information
- Save favorites for later

### 💬 AI Chatbot
- Real-time streaming responses
- Travel recommendations based on your preferences
- Source citations for recommendations
- Contextual conversation history

### 👥 Community
- Share trip photos and experiences
- Like, comment, and share posts
- Multi-image posts (up to 6 images)
- Engage with other travelers

### 📴 Offline Support
- SQLite local database
- Automatic data syncing
- Works without internet connection

---

## 📸 Screenshots

> Screenshots will be added after app is built

---

## 🚀 Quick Start

### Prerequisites

- Flutter SDK 3.24.0+
- Dart SDK 3.5.0+
- Android Studio / Xcode
- Backend API running at `http://localhost:3002`

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd mobile

# 2. Install dependencies
flutter pub get

# 3. Generate code (REQUIRED)
dart run build_runner build --delete-conflicting-outputs

# 4. Run the app
flutter run
```

**Windows users:** Run `scripts\generate.bat`  
**Mac/Linux users:** Run `bash scripts/generate.sh`

---

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup instructions
- **[QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md)** - Fix common errors
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - How to write tests
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Backend API reference
- **[DEVELOPMENT_SUMMARY.md](DEVELOPMENT_SUMMARY.md)** - Architecture overview
- **[COMPLETION_REPORT.md](COMPLETION_REPORT.md)** - Final status report

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Screens (UI Layer)            │
├─────────────────────────────────────────┤
│     Providers (State Management)        │
│           (Riverpod)                    │
├─────────────────────────────────────────┤
│      Repositories (Data Layer)          │
├─────────────────────────────────────────┤
│    Services (API, Storage, Database)    │
└─────────────────────────────────────────┘
```

### Tech Stack

- **Framework:** Flutter 3.24.0
- **State Management:** Riverpod
- **Navigation:** go_router
- **API Client:** Dio
- **Local Database:** SQLite (sqflite)
- **Secure Storage:** flutter_secure_storage
- **Code Generation:** Freezed, build_runner
- **Maps:** flutter_map with Google Maps tiles

---

## 🎨 Design System

### Sunset Theme

- **Primary (Coral):** `#FF6B6B`
- **Secondary (Turquoise):** `#4ECDC4`
- **Accent (Golden):** `#FFA500`

### Typography

- **iOS:** SF Pro Display
- **Android:** Roboto

### Spacing

Based on 4px grid system:
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- XXL: 48px

---

## 📁 Project Structure

```
mobile/
├── lib/
│   ├── main.dart                 # App entry point
│   ├── app.dart                  # App configuration
│   ├── config/                   # Theme, colors, routes
│   ├── models/                   # Freezed data models
│   ├── screens/                  # UI screens
│   │   ├── auth/
│   │   ├── trips/
│   │   ├── places/
│   │   ├── chat/
│   │   ├── community/
│   │   └── profile/
│   ├── widgets/                  # Reusable widgets
│   │   ├── common/
│   │   ├── trip/
│   │   ├── place/
│   │   ├── chat/
│   │   ├── community/
│   │   └── map/
│   ├── services/                 # API, storage, database
│   ├── repositories/             # Data layer
│   ├── providers/                # Riverpod providers
│   └── utils/                    # Helpers, validators
├── test/                         # Tests
├── scripts/                      # Build scripts
├── docs/                         # Documentation
└── pubspec.yaml                  # Dependencies
```

---

## 🧪 Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run specific test file
flutter test test/utils/validators_test.dart
```

**Test Coverage:** ~20% (9 test files)  
**Target:** 80%+

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing instructions.

---

## 🔧 Development

### Code Generation

When you modify Freezed models, regenerate code:

```bash
dart run build_runner build --delete-conflicting-outputs
```

### Format Code

```bash
dart format lib test
```

### Analyze Code

```bash
flutter analyze
```

---

## 📦 Build for Release

### Android

```bash
# APK
flutter build apk --release

# App Bundle (for Play Store)
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

---

## 🌍 Localization

Currently supports:
- ✅ Vietnamese (default)
- ⏳ English (coming soon)

---

## 🐛 Known Issues

1. **Freezed Code Generation Required:** Must run `build_runner` before first run
2. **Missing Dependencies:** Some optional features need manual dependency addition
3. **Backend Integration:** Some endpoints need actual backend implementation

See [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md) for solutions.

---

## 📊 Project Stats

- **Total Files:** 76 Dart files + 9 tests
- **Lines of Code:** ~15,000+
- **Screens:** 13
- **Widgets:** 22
- **Models:** 5
- **Services:** 6
- **Repositories:** 4
- **Providers:** 7

---

## 🗺️ Roadmap

### Current Version: 1.0.0-beta

- ✅ Core features complete
- ✅ UI/UX polished
- ⏳ Testing in progress
- ⏳ App store preparation

### Future Plans

- [ ] Dark mode
- [ ] Multi-language support
- [ ] Booking integration
- [ ] Payment integration
- [ ] Social login (Google, Facebook)
- [ ] Push notifications
- [ ] In-app chat with travelers

---

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

---

## 📄 License

Copyright © 2024 Travel Planner Team. All rights reserved.

---

## 👥 Team

- **Developer:** Claude (Kiro AI Assistant)
- **Project:** DATN - AI Travel Planner
- **Institution:** [Your Institution]

---

## 📞 Support

For support, please check:
1. [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md) - Common errors
2. [SETUP.md](SETUP.md) - Setup instructions
3. [Documentation](#documentation) - Full docs

---

## 🎓 Learning Resources

- [Flutter Documentation](https://docs.flutter.dev)
- [Riverpod Documentation](https://riverpod.dev)
- [Material Design 3](https://m3.material.io)

---

<div align="center">

**Built with ❤️ using Flutter**

[⬆ Back to Top](#-travel-planner-mobile)

</div>
