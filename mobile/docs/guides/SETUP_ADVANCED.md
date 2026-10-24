# Mobile App - Setup Instructions

## Prerequisites

- Flutter SDK 3.24.0 or higher
- Dart SDK 3.5.0 or higher
- Android Studio / Xcode (for mobile development)
- Backend API running at `http://localhost:3002`

## Installation Steps

### 1. Install Dependencies

```bash
cd mobile
flutter pub get
```

### 2. Generate Code

**IMPORTANT:** Run this before building the app to generate Freezed models:

```bash
dart run build_runner build --delete-conflicting-outputs
```

This generates:
- `user.freezed.dart` + `user.g.dart`
- `trip.freezed.dart` + `trip.g.dart`
- `place.freezed.dart` + `place.g.dart`
- `chat_message.freezed.dart` + `chat_message.g.dart`
- `community_post.freezed.dart` + `community_post.g.dart`

### 3. Add Missing Dependencies

Some features require additional packages. Add to `pubspec.yaml`:

```yaml
dependencies:
  # Existing dependencies...
  
  # Image picker for post creation
  image_picker: ^1.0.5
  
  # Local notifications for trip reminders
  flutter_local_notifications: ^16.3.0
  timezone: ^0.9.2
  
  # Shimmer loading effect
  shimmer: ^3.0.0
```

Then run:
```bash
flutter pub get
```

### 4. Configure Backend URL

The app is configured to use `http://localhost:3002` by default.

To change the backend URL, edit `lib/config/env.dart`:

```dart
class Env {
  static const String apiBaseUrl = 'http://your-api-url.com';
}
```

### 5. Run the App

```bash
# Run on Android emulator
flutter run

# Run on iOS simulator
flutter run

# Run on specific device
flutter devices  # List available devices
flutter run -d <device-id>
```

## Running Tests

### Unit Tests
```bash
flutter test test/utils/
flutter test test/services/
```

### Widget Tests
```bash
flutter test test/widgets/
flutter test test/screens/
```

### All Tests
```bash
flutter test
```

### Test Coverage
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

## Development Commands

### Clean Build
```bash
flutter clean
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run
```

### Format Code
```bash
dart format lib test
```

### Analyze Code
```bash
flutter analyze
```

### Check for Updates
```bash
flutter pub outdated
```

## Building for Release

### Android APK
```bash
flutter build apk --release
```

### Android App Bundle (for Play Store)
```bash
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## Project Structure

```
mobile/
├── lib/
│   ├── main.dart              # App entry point
│   ├── app.dart               # App configuration
│   ├── config/                # Theme, routes, constants
│   ├── models/                # Freezed data models
│   ├── screens/               # UI screens
│   ├── widgets/               # Reusable widgets
│   ├── services/              # API, storage, database
│   ├── repositories/          # Data layer
│   ├── providers/             # Riverpod state management
│   └── utils/                 # Validators, formatters
├── test/                      # Unit & widget tests
├── integration_test/          # Integration tests
├── android/                   # Android specific
├── ios/                       # iOS specific
└── pubspec.yaml              # Dependencies
```

## Common Issues & Solutions

### Issue: "Undefined class" errors after cloning

**Solution:** Run code generation:
```bash
dart run build_runner build --delete-conflicting-outputs
```

### Issue: "No device found"

**Solution:** Start an emulator or connect a physical device:
```bash
# List devices
flutter devices

# Start Android emulator
emulator -avd <emulator-name>
```

### Issue: Build fails with dependency conflicts

**Solution:** Clean and reinstall:
```bash
flutter clean
rm -rf pubspec.lock
flutter pub get
```

### Issue: iOS build fails

**Solution:** Update CocoaPods:
```bash
cd ios
pod install
cd ..
```

### Issue: Hot reload not working

**Solution:** Try hot restart:
```bash
# Press 'R' in terminal running flutter
# Or use: flutter run --hot
```

## Environment Setup

### Android

1. Install Android Studio
2. Install Android SDK (API level 33 or higher)
3. Create an Android Virtual Device (AVD)
4. Accept Android licenses:
   ```bash
   flutter doctor --android-licenses
   ```

### iOS (macOS only)

1. Install Xcode from App Store
2. Install Xcode Command Line Tools:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -runFirstLaunch
   ```
3. Open iOS Simulator:
   ```bash
   open -a Simulator
   ```

## Backend Requirements

The mobile app requires the following backend endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

### Trips
- `GET /trips` - List user trips
- `GET /trips/:id` - Get trip details
- `POST /trips` - Create new trip
- `PUT /trips/:id` - Update trip
- `DELETE /trips/:id` - Delete trip

### Places
- `GET /places` - List places with filters
- `GET /places/:id` - Get place details
- `POST /places/:id/interactions` - Track user interactions

### Chat
- `POST /api/chat` - Send chat message (SSE)

### Community
- `GET /community/posts` - List community posts
- `POST /community/posts` - Create post
- `GET /community/posts/:id/comments` - Get comments
- `POST /community/posts/:id/comments` - Add comment

## Next Steps

1. ✅ Install dependencies
2. ✅ Generate code
3. ✅ Start backend server
4. ✅ Run the app
5. 🔄 Test features
6. 🔄 Write tests
7. 🔄 Deploy to stores

## Support

For issues or questions:
- Check `IMPLEMENTATION_PROGRESS.md` for feature status
- Check `DEVELOPMENT_SUMMARY.md` for architecture details
- Check `FINAL_STATUS_REPORT.md` for complete overview

---

**Last Updated:** 2026-10-23  
**Flutter Version:** 3.24.0  
**Dart Version:** 3.5.0
