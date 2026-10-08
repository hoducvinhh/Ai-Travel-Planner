# Kế Hoạch Phát Triển Mobile App - AI Travel Planner

## Context

Dự án AI Travel Planner hiện tại đang có:
- **Frontend**: Next.js 16 (React 19, TailwindCSS 4) chạy trên web
- **Backend**: NestJS với REST API đầy đủ (auth, trips, places, recommendations, chat)
- **ML Service**: Python FastAPI với LightFM model
- **Database**: PostgreSQL + pgvector
- **Features**: Trip planning, ML recommendations, RAG chatbot, interactive maps, community posts

Mục tiêu là xây dựng ứng dụng di động (iOS/Android) **cho end users** để mở rộng phạm vi tiếp cận người dùng, tận dụng hoàn toàn backend và ML infrastructure hiện có. **Mobile app chỉ focus vào user features, không bao gồm admin functions** (admin sẽ tiếp tục sử dụng web interface).

## Công Nghệ Đề Xuất

### Flutter

**Lý do chọn:**
- **Performance tuyệt vời**: Compile thành native code (ARM), 60fps animations mượt mà
- **Single codebase**: iOS + Android từ cùng một codebase Dart
- **Rich UI framework**: Material Design 3 + Cupertino widgets built-in, custom animations dễ dàng
- **Hot reload**: Instant UI updates trong development
- **Strong typing**: Dart language với null safety, DX tốt với IDE support (VS Code, Android Studio)
- **Ecosystem mature**: Pub.dev có 40,000+ packages (http, maps, state management, etc.)
- **Deployment dễ dàng**: Flutter build tools tích hợp sẵn
- **UI consistency**: Flutter render UI riêng (Skia engine) → consistent cross-platform

**Considerations:**
- Dart syntax tương tự TypeScript/JavaScript, learning curve ngắn (~3-5 ngày)
- Tái sử dụng được business logic và data models từ web (convert sang Dart)
- Bundle size ~15-20MB cho release build

## Kiến Trúc Mobile App

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (Flutter)                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Navigation Layer (go_router)                          │  │
│  │  - Bottom Navigation: Home, Trips, Community, Profile  │  │
│  │  - Named Routes: /trip/create, /trip/:id, /place/:id   │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌─────────────┬─────────────┬─────────────┬──────────────┐ │
│  │ Auth Screens│ Trip Screens│ Map Views   │ Chat/RAG UI  │ │
│  │ - Login     │ - List      │ - Google    │ - Streaming  │ │
│  │ - Register  │ - Create    │   Maps/     │ - Citations  │ │
│  │ - Profile   │ - Details   │   Mapbox    │ - Markdown   │ │
│  └─────────────┴─────────────┴─────────────┴──────────────┘ │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  State Management (Riverpod / BLoC)                    │  │
│  │  - AuthProvider: JWT token, user state                 │  │
│  │  - TripsProvider: Trips list, cache                    │  │
│  │  - PlacesProvider: Places data                         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Data Layer (Repositories + Services)                  │  │
│  │  - ApiService (dio): HTTP client với interceptors      │  │
│  │  - LocalStorage (shared_preferences, hive)             │  │
│  │  - StreamService: SSE/WebSocket cho chat               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS REST API
┌──────────────────────┴──────────────────────────────────────┐
│              Backend (NestJS) - KHÔNG THAY ĐỔI              │
│  Endpoints hiện có:                                          │
│  - POST /auth/login, /auth/register                         │
│  - GET /auth/profile                                         │
│  - POST /trips, GET /trips, GET /trips/:id                  │
│  - GET /places, GET /places/:id                             │
│  - POST /recommendations                                     │
│  - POST /chat/message (streaming)                           │
│  - GET /community/posts, POST /community/posts              │
└─────────────────────────────────────────────────────────────┘
```

## Cấu Trúc Thư Mục Mobile

```
mobile/                              # Thư mục gốc Flutter app (tạo mới)
├── pubspec.yaml                     # Dependencies (như package.json)
├── analysis_options.yaml            # Linter rules
├── .env.example                     # Environment variables template
├── android/                         # Android native config
│   └── app/
│       └── build.gradle             # Android build config
├── ios/                             # iOS native config
│   └── Runner/
│       └── Info.plist               # iOS config
├── lib/                             # Main Dart code
│   ├── main.dart                    # App entry point
│   ├── app.dart                     # Root widget, routing setup
│   ├── screens/                     # Screen widgets
│   │   ├── auth/
│   │   │   ├── login_screen.dart
│   │   │   └── register_screen.dart
│   │   ├── home/
│   │   │   └── home_screen.dart
│   │   ├── trips/
│   │   │   ├── trips_list_screen.dart
│   │   │   ├── trip_detail_screen.dart
│   │   │   └── create_trip_screen.dart
│   │   ├── places/
│   │   │   ├── places_screen.dart
│   │   │   └── place_detail_screen.dart
│   │   ├── community/
│   │   │   └── community_screen.dart
│   │   ├── chat/
│   │   │   └── chat_screen.dart
│   │   └── profile/
│   │       └── profile_screen.dart
│   ├── widgets/                     # Reusable widgets
│   │   ├── trip_card.dart
│   │   ├── place_card.dart
│   │   ├── custom_button.dart
│   │   ├── custom_input.dart
│   │   ├── map_view.dart
│   │   └── loading_indicator.dart
│   ├── providers/                   # State management (Riverpod)
│   │   ├── auth_provider.dart
│   │   ├── trips_provider.dart
│   │   ├── places_provider.dart
│   │   └── chat_provider.dart
│   ├── models/                      # Data models
│   │   ├── user.dart
│   │   ├── trip.dart
│   │   ├── place.dart
│   │   └── community_post.dart
│   ├── services/                    # API & business logic
│   │   ├── api_service.dart         # HTTP client (dio)
│   │   ├── auth_service.dart
│   │   ├── storage_service.dart     # Local storage
│   │   └── stream_service.dart      # SSE/WebSocket
│   ├── repositories/                # Data layer abstraction
│   │   ├── auth_repository.dart
│   │   ├── trips_repository.dart
│   │   └── places_repository.dart
│   ├── utils/                       # Utilities
│   │   ├── constants.dart
│   │   ├── formatters.dart
│   │   ├── validators.dart
│   │   └── extensions.dart
│   └── config/                      # App config
│       ├── routes.dart              # Route definitions
│       ├── theme.dart               # App theme
│       └── env.dart                 # Environment variables
├── assets/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
└── test/                            # Unit & widget tests
    ├── widget_test.dart
    └── unit_test.dart
```

## Tính Năng Ưu Tiên (MVP)

### Phase 1: Core Features (Sprint 1-2, 2 tuần)

#### 1.1 Authentication
- **Screens**: Login, Register, Profile (user profile chỉnh sửa preferences)
- **API Integration**: 
  - `POST /auth/login` → Lưu JWT vào SharedPreferences/SecureStorage
  - `POST /auth/register` (chỉ register với role USER)
  - `GET /auth/profile`
- **Widgets**: 
  - Form inputs với validation (TextFormField)
  - Error handling (SnackBar)
  - Loading states (CircularProgressIndicator)
- **Native Features**: 
  - Biometric authentication (Face ID/Touch ID) cho login nhanh (sử dụng `local_auth` package)
- **Note**: Không có admin authentication, mobile app chỉ cho end users

#### 1.2 Trip Management
- **Trip List Screen**:
  - Fetch trips: `GET /trips`
  - Hiển thị danh sách với pull-to-refresh
  - Skeleton loading
- **Trip Detail Screen**:
  - Fetch single trip: `GET /trips/:id`
  - Hiển thị itinerary theo ngày
  - Map view với markers cho các địa điểm
  - Weather forecast cho mỗi địa điểm
- **Create Trip Wizard**:
  - Multi-step form (destination, dates, budget, preferences)
  - Submit: `POST /trips`
  - Progress indicator
  - Form persistence (save draft locally)

#### 1.3 Map Integration
- **Library**: `google_maps_flutter` (Google Maps native) hoặc `mapbox_gl` (Mapbox rich features)
- **Features**:
  - Display place markers
  - Custom marker icons theo category
  - Clustering khi zoom out
  - Directions/routing giữa các địa điểm
  - Current location tracking với `geolocator` package

### Phase 2: Enhanced Features (Sprint 3-4, 2 tuần)

#### 2.1 Places Discovery
- **Browse Places**: `GET /places?province=...&category=...`
- **Place Detail**: `GET /places/:id`
- **Features**:
  - Filter by province, category, budget
  - Search functionality
  - Image gallery
  - Save favorite places
  - Track interactions cho ML model: `POST /interactions` (VIEW, LIKE, SAVE, RATE)
- **Note**: Không có admin functions (create/edit/delete places), chỉ view và interact

#### 2.2 RAG Chatbot
- **Chat Screen**: 
  - Stream chat: `POST /chat/message` with SSE (Server-Sent Events)
  - Message bubbles (user vs AI) với ListView
  - Citation links trong responses với flutter_markdown
  - Typing indicator
- **Challenges**:
  - Streaming response handling: use `http` package với StreamedResponse hoặc `web_socket_channel`

#### 2.3 Offline Support
- **Strategy**:
  - Cache trips locally với Hive (NoSQL database) hoặc sqflite (SQLite)
  - Sync khi online (optimistic updates)
  - Offline indicator UI
- **Packages**: `hive`, `connectivity_plus` (detect online/offline), `cached_network_image` (cache images)

### Phase 3: Social & Advanced (Sprint 5-6, 2 tuần)

#### 3.1 Community Features
- **Screens**: 
  - Community feed: `GET /community/posts` (view all users' posts)
  - Create post: `POST /community/posts` (users share their trips)
  - Comments: `POST /community/posts/:id/comments`
- **Features**:
  - Image upload (use `image_picker` package)
  - Like/share posts
  - Comment on posts
  - View other users' shared trips
- **Note**: Không có admin moderation features trong mobile app, chỉ có user interactions

#### 3.2 Push Notifications
- **Use Case**:
  - Trip reminders (1 ngày trước khi khởi hành)
  - Weather alerts
  - Community interactions (likes, comments)
- **Implementation**: 
  - Local notifications only (`flutter_local_notifications` package)
  - Schedule notifications locally khi user tạo trip
  - Không cần backend changes cho push tokens

#### 3.3 Personalization
- **Features**:
  - Preferences settings (budget level, travel styles)
  - Interaction tracking (VIEW, LIKE, SAVE, RATE)
  - Personalized recommendations based on ML model

## Dependencies Chính

### Core
```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Dart version: >=3.5.0 <4.0.0
```

### UI & Animations
```yaml
  # Material Design 3 (built-in)
  flutter_animate: ^4.5.0           # Easy animations
  shimmer: ^3.0.0                   # Skeleton loading
  lottie: ^3.1.0                    # Lottie animations
```

### Navigation & Routing
```yaml
  go_router: ^14.2.0                # Declarative routing
```

### State Management
```yaml
  flutter_riverpod: ^2.5.0          # Recommended: reactive, simple
  # OR
  flutter_bloc: ^8.1.0              # Alternative: event-driven pattern
  # OR
  provider: ^6.1.0                  # Alternative: simple, built by Flutter team
```

### Networking & API
```yaml
  dio: ^5.4.0                       # HTTP client (như axios)
  retrofit: ^4.0.0                  # Type-safe API client generator
  json_annotation: ^4.8.0           # JSON serialization
  freezed: ^2.4.0                   # Immutable models, unions
```

### Maps
```yaml
  google_maps_flutter: ^2.5.0       # Google Maps native
  # OR
  mapbox_gl: ^0.16.0                # Mapbox (richer features)
  
  geolocator: ^11.0.0               # Location services
  geocoding: ^3.0.0                 # Address <-> coordinates
```

### Storage & Cache
```yaml
  shared_preferences: ^2.2.0        # Key-value storage (như AsyncStorage)
  flutter_secure_storage: ^9.0.0    # Encrypted storage for JWT
  hive: ^2.2.0                      # NoSQL database (offline support)
  hive_flutter: ^1.1.0
  cached_network_image: ^3.3.0      # Image caching
```

### Auth & Security
```yaml
  local_auth: ^2.2.0                # Biometric auth (Face ID/Touch ID)
```

### Media & Camera
```yaml
  image_picker: ^1.0.0              # Pick images from gallery/camera
  camera: ^0.10.0                   # Camera access
```

### Notifications
```yaml
  flutter_local_notifications: ^17.0.0  # Local notifications only
  timezone: ^0.9.0                      # Timezone handling for scheduled notifications
```

### Chat & Markdown
```yaml
  flutter_markdown: ^0.6.0          # Markdown rendering cho chat
  web_socket_channel: ^2.4.0        # WebSocket cho streaming chat
  # OR
  http: ^1.2.0                      # SSE với StreamedResponse
```

### Utilities
```yaml
  intl: ^0.19.0                     # Date/number formatting, i18n
  connectivity_plus: ^5.0.0         # Network connectivity check
  url_launcher: ^6.2.0              # Open URLs, maps, phone
  share_plus: ^7.2.0                # Share content
  package_info_plus: ^5.0.0         # App version info
```

### Dev Dependencies
```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  
  flutter_lints: ^3.0.0             # Linter rules
  build_runner: ^2.4.0              # Code generation
  json_serializable: ^6.7.0         # JSON serialization codegen
  freezed_annotation: ^2.4.0
  retrofit_generator: ^8.0.0
```

## API Integration Strategy

### 1. API Client Setup

Sử dụng Dio với interceptors (tương tự axios pattern từ web):

```dart
// lib/services/api_service.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3002',
  );
  
  final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  ApiService() : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: {'Content-Type': 'application/json'},
  )) {
    _setupInterceptors();
  }
  
  void _setupInterceptors() {
    // Request interceptor: attach JWT
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        // Handle 401: logout
        if (error.response?.statusCode == 401) {
          await _storage.delete(key: 'auth_token');
          // Navigate to login screen
        }
        return handler.next(error);
      },
    ));
  }
  
  // Generic methods
  Future<T> get<T>(String path, {Map<String, dynamic>? queryParams}) async {
    final response = await _dio.get(path, queryParameters: queryParams);
    return response.data;
  }
  
  Future<T> post<T>(String path, {dynamic data}) async {
    final response = await _dio.post(path, data: data);
    return response.data;
  }
}
```

### 2. Repository Pattern

```dart
// lib/repositories/trips_repository.dart
import '../models/trip.dart';
import '../services/api_service.dart';

class TripsRepository {
  final ApiService _api;
  
  TripsRepository(this._api);
  
  Future<List<Trip>> getTrips() async {
    final data = await _api.get<List>('/trips');
    return data.map((json) => Trip.fromJson(json)).toList();
  }
  
  Future<Trip> getTripById(String id) async {
    final data = await _api.get<Map<String, dynamic>>('/trips/$id');
    return Trip.fromJson(data);
  }
  
  Future<Trip> createTrip(CreateTripDto dto) async {
    final data = await _api.post<Map<String, dynamic>>('/trips', data: dto.toJson());
    return Trip.fromJson(data);
  }
}
```

### 3. State Management với Riverpod

```dart
// lib/providers/trips_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../repositories/trips_repository.dart';

// Provider for repository
final tripsRepositoryProvider = Provider((ref) {
  final api = ref.watch(apiServiceProvider);
  return TripsRepository(api);
});

// Provider for trips list
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTrips();
});

// Provider for single trip
final tripProvider = FutureProvider.family<Trip, String>((ref, id) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTripById(id);
});
```

### 4. Environment Variables

```dart
// lib/config/env.dart
class Env {
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3002',
  );
  
  static const String googleMapsApiKey = String.fromEnvironment(
    'GOOGLE_MAPS_API_KEY',
    defaultValue: '',
  );
}
```

Build với env vars:
```bash
flutter run --dart-define=API_URL=https://api.travel-planner.com
flutter build apk --dart-define=API_URL=https://api.travel-planner.com
```

## UI/UX Considerations

### Design System

Tái sử dụng design tokens từ web:
- **Colors**: Neutral palette (F9F9F8 background, 262626 text)
- **Typography**: Custom fonts hoặc system fonts (SF Pro iOS, Roboto Android)
- **Spacing**: 4.0 base unit (matches Tailwind, use SizedBox/Padding)
- **Components**: Rebuild từ `frontend/src/components/ui/*` với Flutter widgets

### Flutter Theme Setup

```dart
// lib/config/theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static const Color background = Color(0xFFF9F9F8);
  static const Color textPrimary = Color(0xFF262626);
  static const Color textSecondary = Color(0xFF737373);
  static const Color accent = Color(0xFF3B82F6);
  
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: accent,
      brightness: Brightness.light,
      surface: background,
    ),
    scaffoldBackgroundColor: background,
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: textPrimary),
      bodyLarge: TextStyle(fontSize: 16, color: textPrimary),
      bodyMedium: TextStyle(fontSize: 14, color: textSecondary),
    ),
  );
  
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: accent,
      brightness: Brightness.dark,
    ),
  );
}
```

### Mobile-Specific Patterns

1. **Bottom Navigation Bar**: Thay vì navbar trên web (BottomNavigationBar widget)
2. **Pull-to-Refresh**: Cho lists (RefreshIndicator widget)
3. **Swipe Gestures**: Dismissible widget cho swipe to delete
4. **Native Pickers**: showDatePicker, showModalBottomSheet cho filters
5. **Haptic Feedback**: HapticFeedback.lightImpact() cho actions quan trọng

### Accessibility

- **Semantics**: Wrap widgets với Semantics() cho screen readers
- **Color Contrast**: WCAG AA standard (tương tự web)
- **Touch Targets**: Minimum 48x48 logical pixels (Material Design)
- **Dark Mode**: ThemeMode.system để theo system preference

## Backend Changes Required

**TL;DR: Backend KHÔNG CẦN sửa gì**, tất cả endpoints đã sẵn sàng cho mobile app.

### Optional Enhancements (Không bắt buộc)

1. **Image Upload** (cho community posts từ mobile):
   - Add endpoint: `POST /uploads` (S3 hoặc local storage)
   - Hoặc client-side: resize image với Flutter's `image` package → upload base64

2. **Rate Limiting** (protect API khỏi abuse):
   - Dùng `@nestjs/throttler`
   - Limit: 100 requests/minute per user

3. **API Versioning** (tương lai khi mobile app cần maintain backward compatibility):
   - Add header: `API-Version: v1`
   - Cho phép mobile app cũ hoạt động khi backend update

## Testing Strategy

### Unit Tests
- Widgets: Flutter widget testing framework
- Models: Test serialization/deserialization (fromJson/toJson)
- Repositories: Mock API responses với mockito
- Utils: Test formatters, validators

```dart
// test/widget_test.dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Login button test', (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    expect(find.text('Login'), findsOneWidget);
    await tester.tap(find.text('Login'));
    await tester.pump();
  });
}
```

### Integration Tests
- API integration: Mock Dio responses
- Navigation: Test route transitions với go_router

### E2E Tests (Optional)
- **Integration tests** trong Flutter (chạy trên simulator/emulator)
- Test flows: Login → Create Trip → View Trip Detail

### Manual Testing
- **iOS**: Xcode Simulator (iPhone 15 Pro, iOS 17+)
- **Android**: Android Emulator (Pixel 7, Android 13+)
- **Physical devices**: TestFlight (iOS) / Internal testing (Android)

## Deployment Strategy

### Development
- **Hot Reload**: `flutter run` với hot reload (R key) và hot restart (Shift+R)
- **Local development**: Connect phone via USB hoặc use emulator/simulator

### Staging
- **Build APK/IPA locally**: 
  ```bash
  flutter build apk --release
  flutter build ios --release
  ```
- **TestFlight** (iOS) / **Internal Testing Track** (Google Play)

### Production

#### iOS App Store
- **Requirements**: 
  - Apple Developer Account ($99/year)
  - Mac with Xcode
  - Certificates & Provisioning Profiles
- **Build & Submit**:
  ```bash
  flutter build ios --release
  # Open Xcode, archive, upload to App Store Connect
  ```
- **Review time**: 1-3 ngày
- **App Store Optimization**: Screenshots (6.5" + 5.5"), description, keywords

#### Google Play Store
- **Requirements**:
  - Google Play Developer Account ($25 one-time)
  - Signing key (keystore)
- **Build & Submit**:
  ```bash
  flutter build appbundle --release
  # Upload .aab file to Google Play Console
  ```
- **Review time**: vài giờ - 1 ngày
- **Open/closed testing**: Beta testing trước khi production

### CI/CD (Optional)

```yaml
# .github/workflows/flutter-ci.yml
name: Flutter CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: subosito/flutter-action@v2
      with:
        flutter-version: '3.24.0'
    
    - run: flutter pub get
    - run: flutter analyze
    - run: flutter test
    - run: flutter build apk --release
    - run: flutter build appbundle --release
```

### Codemagic / Fastlane (Alternative)
- **Codemagic**: CI/CD platform chuyên cho Flutter (free tier available)
- **Fastlane**: Automate screenshots, beta deployment, app store submission

## Timeline Estimate

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Setup & Infra** | 3-4 days | Flutter project init, API client setup, navigation structure, theme |
| **Phase 1** | 2 weeks | Auth (login/register/profile), Trip list/detail/create, Map integration |
| **Phase 2** | 2 weeks | Places discovery (browse/search/detail), RAG chat với streaming, Offline support |
| **Phase 3** | 2 weeks | Community feed/posts/comments, Local notifications, Polish UI/UX |
| **Testing & Debug** | 1 week | Fix bugs, performance optimization, test trên real devices |
| **App Store Prep** | 3-4 days | Screenshots, descriptions, privacy policy, submission |
| **Total** | **7-8 weeks** | Full-featured Flutter mobile app (user-facing only) |

**Note về learning curve:**
- Nếu chưa biết Dart: Thêm 3-5 ngày để học basics (syntax, null safety, async/await)
- Dart tương tự TypeScript/JavaScript → learning curve ngắn
- Resources: [dart.dev/guides](https://dart.dev/guides), [flutter.dev/docs](https://flutter.dev/docs)

**Scope exclusions:**
- Không có admin features (place management, user management, content moderation)
- Admin functions tiếp tục sử dụng web interface

## Success Metrics

### Technical KPIs
- App load time < 2s
- API response time < 500ms (p95)
- Crash-free rate > 99.5%
- ANR (Application Not Responding) rate < 0.1%

### Business KPIs
- Mobile DAU (Daily Active Users)
- Trip creation rate from mobile vs web
- Retention: Day 1, Day 7, Day 30
- App Store rating > 4.0

## Risks & Mitigations

### Risk 1: Map Performance
- **Issue**: Rendering nhiều markers lag trên low-end devices
- **Mitigation**: Clustering, lazy loading markers, optimize marker icons

### Risk 2: Streaming Chat trên Mobile
- **Issue**: SSE (Server-Sent Events) support trên Flutter cần custom implementation
- **Mitigation**: Use `http` package với StreamedResponse hoặc WebSocket với `web_socket_channel`, test kỹ trên iOS/Android

### Risk 3: Offline-First Complexity
- **Issue**: Sync conflicts khi user edit trip offline
- **Mitigation**: Start simple (read-only offline), defer write sync to Phase 3

### Risk 4: App Store Rejection
- **Issue**: iOS App Store có review guidelines nghiêm ngặt
- **Mitigation**: Review guidelines trước khi submit, prepare detailed test account

## Appendix: Code Reuse from Web

### Shared Concepts (Adapt to Dart)

| Web File | Mobile Equivalent | Notes |
|----------|-------------------|-------|
| `frontend/src/lib/api.ts` | `lib/services/api_service.dart` | Pattern tương tự: interceptors, error handling |
| `frontend/src/types/index.ts` | `lib/models/*.dart` | Convert TypeScript interfaces → Dart classes với fromJson/toJson |
| Web form validation logic | `lib/utils/validators.dart` | Port validation rules sang Dart |
| Constants (provinces, categories) | `lib/utils/constants.dart` | 100% reuse data |

### Example: TypeScript → Dart Conversion

**Web (TypeScript):**
```typescript
// frontend/src/types/index.ts
interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerPerson: number;
}
```

**Mobile (Dart):**
```dart
// lib/models/trip.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'trip.freezed.dart';
part 'trip.g.dart';

@freezed
class Trip with _$Trip {
  const factory Trip({
    required String id,
    required String destination,
    required String startDate,
    required String endDate,
    required double budgetPerPerson,
  }) = _Trip;
  
  factory Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);
}
```

### Non-Reusable (Rebuild from Scratch)

- **UI Components**: Web dùng React + HTML, mobile dùng Flutter widgets
- **Styling**: Web dùng TailwindCSS, mobile dùng Flutter Theme + custom widgets
- **Routing**: Web dùng Next.js App Router, mobile dùng go_router
- **Map**: Web dùng Leaflet (DOM-based), mobile dùng google_maps_flutter (native)
- **Animations**: Web dùng CSS/Framer Motion, mobile dùng Flutter animations (AnimatedContainer, flutter_animate)

---

## Next Steps

1. **User Approval**: Review plan này, xác nhận chọn Flutter
2. **Environment Setup**: 
   - Cài đặt Flutter SDK: [flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
   - Android Studio (cho Android development + emulator)
   - Xcode (nếu develop cho iOS, chỉ có trên Mac)
   - VS Code hoặc Android Studio với Flutter/Dart plugins
3. **Learning Phase** (nếu chưa biết Dart):
   - Dart basics: [dart.dev/guides/language/language-tour](https://dart.dev/guides/language/language-tour)
   - Flutter fundamentals: [flutter.dev/docs/get-started/codelab](https://flutter.dev/docs/get-started/codelab)
   - Estimate: 3-5 ngày
4. **Repository Structure**: Tạo folder `mobile/` trong monorepo hoặc separate repo
5. **Kickoff Sprint 1**: 
   - Init Flutter project: `flutter create mobile`
   - Setup API client với Dio
   - Implement authentication flow

## Questions to Clarify

1. **Target Platforms**: iOS only, Android only, hay cả hai?
   - **Recommendation**: Start với Android (dễ test hơn, không cần Mac), add iOS sau
2. **Budget**: Có ngân sách cho Apple Developer ($99/year) + Google Play ($25 one-time) accounts không?
3. **Timeline**: Có deadline cứng không? (ví dụ: demo cho đồ án vào tháng 12/2026)
4. **Resources**: Có bao nhiêu developers làm mobile? (1 person có thể làm được trong 7-8 weeks với Flutter)
5. **Design**: Có design mockups sẵn hay tự design trong lúc code?
   - **Recommendation**: Reuse web design, adapt cho mobile (bottom nav, cards, etc.)
6. **Dart Experience**: Team có ai đã biết Dart/Flutter chưa?
   - Nếu chưa: allocate thêm 3-5 ngày học
   - Nếu rồi: có thể bắt đầu ngay
7. **User Roles**: Xác nhận rằng mobile app chỉ cho end users (role USER), không có admin access?

## Learning Resources

### Dart Language
- [Dart Language Tour](https://dart.dev/guides/language/language-tour) - Syntax, types, null safety
- [Effective Dart](https://dart.dev/guides/language/effective-dart) - Best practices
- [Dart Cheatsheet](https://dart.dev/codelabs/dart-cheatsheet) - Quick reference

### Flutter Framework
- [Flutter Documentation](https://flutter.dev/docs) - Official docs
- [Widget Catalog](https://flutter.dev/docs/development/ui/widgets) - All built-in widgets
- [Flutter Cookbook](https://flutter.dev/docs/cookbook) - Common patterns
- [Flutter YouTube Channel](https://www.youtube.com/c/flutterdev) - Official tutorials

### State Management
- [Riverpod Documentation](https://riverpod.dev/) - Recommended state management
- [BLoC Documentation](https://bloclibrary.dev/) - Alternative pattern

### API Integration
- [Dio Documentation](https://pub.dev/packages/dio) - HTTP client
- [Retrofit](https://pub.dev/packages/retrofit) - Type-safe REST client

---

**Plan prepared for:** AI Travel Planner Mobile App (Flutter)  
**Date:** 2026-10-08  
**Estimated effort:** 7-8 weeks (1 developer)  
**Technology stack:** Flutter 3.24+, Dart 3.5+, Material Design 3
