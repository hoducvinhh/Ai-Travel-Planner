# Kế Hoạch Phát Triển Mobile App - AI Travel Planner

## Context

Dự án AI Travel Planner hiện tại đang có:
- **Frontend**: Next.js 16 (React 19, TailwindCSS 4) chạy trên web
- **Backend**: NestJS với REST API đầy đủ (auth, trips, places, recommendations, chat)
- **ML Service**: Python FastAPI với LightFM model
- **Database**: PostgreSQL + pgvector
- **Features**: Trip planning, ML recommendations, RAG chatbot, interactive maps, community posts

Mục tiêu là xây dựng ứng dụng di động (iOS/Android) **cho end users** để mở rộng phạm vi tiếp cận người dùng, tận dụng hoàn toàn backend và ML infrastructure hiện có. **Mobile app chỉ focus vào user features, không bao gồm admin functions** (admin sẽ tiếp tục sử dụng web interface).

## 🚨 Mobile Development Constraints

**CRITICAL: Scope Boundaries**

Mobile development team chỉ được phép làm việc trong `mobile/` folder:

```
✅ ALLOWED (Mobile team có toàn quyền):
mobile/                    # Flutter app code
├── lib/                   # Dart source code
├── android/               # Android native config
├── ios/                   # iOS native config
├── assets/                # Static assets (images, fonts)
├── test/                  # Mobile app tests
├── pubspec.yaml           # Flutter dependencies
├── .env.example           # Mobile environment variables
└── *.md                   # Mobile documentation

❌ FORBIDDEN (Không được động đến):
backend/                   # NestJS backend code
frontend/                  # Next.js web app
ml-service/                # Python ML service
database/                  # Database migrations
docker-compose.yml         # Infrastructure config
.github/workflows/         # CI/CD pipelines (ngoại trừ mobile-specific workflows)
```

**Communication Protocol:**
- **Backend API**: Consume existing endpoints only, không modify backend code
- **Bug reports**: Tạo issue với label `backend-needed` hoặc `frontend-needed`
- **New endpoints**: Request via ticket, chờ backend team implement
- **Database**: Không được access trực tiếp, chỉ qua backend API
- **Shared resources**: Nếu cần thay đổi infrastructure (Docker, CI/CD), thảo luận với team lead trước

**Approval Required For:**
- Thêm dependencies vào root `package.json` (nếu dùng monorepo)
- Thay đổi `.env` files ngoài `mobile/`
- Modify CI/CD workflows (trừ khi tạo workflow riêng cho mobile trong `.github/workflows/mobile-*.yml`)
- Deploy scripts ảnh hưởng đến services khác

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

**Solution: flutter_map + Google Maps Tiles** (Consistent với web, không cần API key)

- **Library**: `flutter_map: ^7.0.2` + `latlong2: ^0.9.0`
- **Tile Provider**: Google Maps tiles (giống web, miễn phí)
  ```dart
  // GIỐNG WEB - Không cần API key!
  urlTemplate: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
  subdomains: ['0', '1', '2', '3']
  ```
- **Features**:
  - Display place markers với Sunset theme category colors
  - Custom numbered markers (gradient emerald giống web)
  - Polyline routes với dashed line style
  - Current location tracking với `geolocator` package
  - Marker clustering với `flutter_map_marker_cluster`
  
**Geocoding & Search** (miễn phí, giống web):
- Primary: Photon API (`https://photon.komoot.io/api/`)
- Fallback: Nominatim OSM (`https://nominatim.openstreetmap.org/`)
- Local: Search trong database `/places`

**Routing** (miễn phí):
- OSRM API: `https://router.project-osrm.org/route/v1/driving/`
- Polyline decoding cho route visualization

**Map Styles** (user có thể switch):
- Google Maps Streets (default)
- Google Satellite Hybrid (`lyrs=y`)
- OpenStreetMap France (optional)

**Why flutter_map + Google Tiles:**
- ✅ 100% consistent với web (Leaflet dùng Google tiles)
- ✅ Miễn phí hoàn toàn, không cần API key
- ✅ Category colors từ Sunset theme (colorful hơn web)
- ✅ Performance tốt, cache tiles tự động
- ✅ Proven solution (web đang chạy ổn định)

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

**FINAL DECISION: Server-Sent Events (SSE) với `http` package** ✅

- **Chat Screen**: 
  - Stream chat: `POST /api/chat` with SSE (Server-Sent Events)
  - Message bubbles (user vs AI) với ListView
  - Citation links trong responses với flutter_markdown
  - Typing indicator
  
- **Implementation**:
  ```dart
  // Use http package for SSE streaming (matches web)
  final request = http.Request('POST', Uri.parse('$apiUrl/api/chat'));
  request.headers['Content-Type'] = 'application/json';
  request.headers['Authorization'] = 'Bearer $token';
  request.body = json.encode({
    'message': userMessage,
    'sessionId': currentSessionId,
  });
  
  final response = await request.send();
  final stream = response.stream.transform(utf8.decoder);
  
  String buffer = '';
  await for (String chunk in stream) {
    buffer += chunk;
    final lines = buffer.split('\n\n');
    buffer = lines.last;
    
    for (final line in lines.take(lines.length - 1)) {
      if (line.startsWith('data: ')) {
        final event = json.decode(line.substring(6));
        
        if (event['type'] == 'session_info') {
          // New session created
        } else if (event['type'] == 'sources') {
          // Update sources
        } else if (event['type'] == 'token') {
          // Append token to message
        } else if (event['type'] == 'done') {
          // Stream complete
        }
      }
    }
  }
  ```

**Rationale:**
- ✅ **Matches web exactly** - Web dùng `fetch` với `ReadableStream` cho SSE
- ✅ **Backend already supports SSE** - Endpoint `/api/chat` returns SSE stream
- ✅ **Simpler than WebSocket** - Unidirectional (server→client), no handshake needed
- ✅ **Standard HTTP** - Works over existing HTTP infrastructure
- ✅ **Event types**: `session_info`, `sources`, `token`, `done`, `error`

#### 2.3 Offline Support

**FINAL DECISION: sqflite (SQLite)** ✅

- **Strategy**:
  - Cache trips locally với **sqflite** (SQLite database)
  - Sync khi online (optimistic updates)
  - Offline indicator UI
  
- **Packages**: 
  - `sqflite: ^2.3.0` (SQL database for Flutter)
  - `connectivity_plus: ^5.0.0` (detect online/offline)
  - `cached_network_image: ^3.3.0` (cache images)

**Rationale:**
- ✅ **SQL standard** - familiar syntax, powerful queries
- ✅ **Relational data** - trips có relationships với places, users
- ✅ **Proven & stable** - sqflite is the standard SQL solution for Flutter
- ✅ **Better for complex queries** - JOIN, WHERE, ORDER BY support
- ✅ **Migration support** - schema versioning built-in
- ❌ Hive: NoSQL không phù hợp với relational data structure của backend

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

**FINAL DECISION: Riverpod** ✅

```yaml
  flutter_riverpod: ^2.5.0          # Production choice
  hooks_riverpod: ^2.5.0            # Optional: for hooks support
```

**Rationale:**
- ✅ **Modern & reactive** - compile-safe providers, no BuildContext needed
- ✅ **Best DX** - auto-disposal, dev tools, less boilerplate than BLoC
- ✅ **Performance** - fine-grained reactivity, only rebuilds what changed
- ✅ **Growing ecosystem** - strong community, maintained by Flutter team member
- ✅ **Learning curve** - similar concepts to React hooks, easier than BLoC
- ❌ BLoC: more verbose, event-driven adds complexity for simple cases
- ❌ Provider: older API, Riverpod is its successor with better features

**Implementation Pattern:**
```dart
// Example: Auth state với Riverpod
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});

// Usage in widgets
class HomeScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    // ...
  }
}
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
  flutter_map: ^7.0.2               # Leaflet-like maps (giống web)
  latlong2: ^0.9.0                  # Coordinate handling
  flutter_map_marker_cluster: ^1.3.0  # Marker clustering
  
  geolocator: ^11.0.0               # Location services
  http: ^1.2.0                      # For geocoding APIs (Photon, Nominatim)
```

### Storage & Cache
```yaml
  shared_preferences: ^2.2.0        # Key-value storage (như AsyncStorage)
  flutter_secure_storage: ^9.0.0    # Encrypted storage for JWT
  sqflite: ^2.3.0                   # SQL database for offline support (FINAL CHOICE)
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
  http: ^1.2.0                      # SSE với StreamedResponse (FINAL CHOICE)
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

## Map Integration Details

### Implementation với flutter_map

```dart
// lib/widgets/trip_map.dart
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class TripMap extends StatelessWidget {
  final List<Place> places;
  final Function(Place)? onPlaceTap;

  const TripMap({required this.places, this.onPlaceTap});

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      options: MapOptions(
        initialCenter: LatLng(places[0].latitude, places[0].longitude),
        initialZoom: 13,
        minZoom: 5,
        maxZoom: 20,
      ),
      children: [
        // Google Maps tiles (GIỐNG WEB - no API key needed!)
        TileLayer(
          urlTemplate: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: const ['0', '1', '2', '3'],
          maxZoom: 20,
          userAgentPackageName: 'com.example.ai_travel_planner',
        ),
        
        // Numbered markers với gradient (giống web)
        MarkerLayer(
          markers: places.asMap().entries.map((entry) {
            int index = entry.key;
            Place place = entry.value;
            
            return Marker(
              point: LatLng(place.latitude, place.longitude),
              width: 36,
              height: 36,
              child: GestureDetector(
                onTap: () => onPlaceTap?.call(place),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF10B981), Color(0xFF14B8A6)],
                    ),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 4,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      '${index + 1}',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        
        // Route polyline (dashed line)
        PolylineLayer(
          polylines: [
            Polyline(
              points: places.map((p) => LatLng(p.latitude, p.longitude)).toList(),
              color: Color(0xFF10B981),
              strokeWidth: 4,
              dashArray: [10, 10],
            ),
          ],
        ),
      ],
    );
  }
}
```

### Geocoding Search (Photon + Nominatim)

```dart
// lib/services/geocoding_service.dart
class GeocodingService {
  // Primary: Photon API (fast, reliable)
  Future<List<SearchResult>> searchPhoton(String query) async {
    final url = 'https://photon.komoot.io/api/?q=${Uri.encodeComponent(query)}&limit=6';
    final response = await http.get(Uri.parse(url));
    final data = json.decode(response.body);
    
    return (data['features'] as List).map((f) {
      final coords = f['geometry']['coordinates']; // [lng, lat]
      final props = f['properties'];
      return SearchResult(
        name: props['name'] ?? query,
        lat: coords[1],
        lng: coords[0],
        province: props['city'] ?? props['state'] ?? '',
        district: props['district'] ?? '',
      );
    }).toList();
  }
  
  // Fallback: Nominatim
  Future<List<SearchResult>> searchNominatim(String query) async {
    final url = 'https://nominatim.openstreetmap.org/search?'
        'format=json&q=${Uri.encodeComponent(query)}&countrycodes=vn&limit=5';
    final response = await http.get(
      Uri.parse(url),
      headers: {'Accept-Language': 'vi,en;q=0.9'},
    );
    final data = json.decode(response.body);
    
    return (data as List).map((item) {
      return SearchResult(
        name: item['display_name'].split(',')[0],
        lat: double.parse(item['lat']),
        lng: double.parse(item['lon']),
        province: item['address']?['state'] ?? '',
        district: item['address']?['suburb'] ?? '',
      );
    }).toList();
  }
}
```

### Category Markers với Sunset Colors

```dart
// lib/widgets/place_marker.dart
Marker createCategoryMarker(Place place) {
  return Marker(
    point: LatLng(place.latitude, place.longitude),
    width: 40,
    height: 40,
    child: Container(
      decoration: BoxDecoration(
        color: getCategoryColor(place.category),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2)),
        ],
      ),
      child: Icon(
        getCategoryIcon(place.category),
        color: Colors.white,
        size: 20,
      ),
    ),
  );
}

Color getCategoryColor(String category) {
  switch (category) {
    case 'beach': return Color(0xFF4ECDC4);     // Turquoise
    case 'mountain': return Color(0xFF95E1D3);  // Mint green
    case 'culture': return Color(0xFFFFAA85);   // Peach
    case 'food': return Color(0xFFFFA500);      // Orange
    case 'nature': return Color(0xFF7DCE82);    // Green
    case 'city': return Color(0xFF9C88FF);      // Purple
    default: return Color(0xFFFF6B6B);          // Coral
  }
}
```

---

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

### Design Principles

**Core Principles cho Mobile App:**
1. **Dễ nhìn, dễ dùng** - Minimalist, clean interface với hierarchy rõ ràng
2. **Thân thiện với người dùng** - Intuitive navigation, familiar patterns
3. **Phù hợp với đề tài du lịch** - Màu sắc warm, inviting, liên tưởng đến vacation
4. **Rounded corners** - Tất cả components đều bo góc tròn (soft, friendly feel)
5. **Icon consistency** - Sử dụng icons trắng/đen với style thống nhất

### Design System

Tái sử dụng design tokens từ web nhưng enhance cho mobile:
- **Colors**: Sunset theme với neutral base (xem chi tiết dưới)
- **Typography**: System fonts (SF Pro iOS, Roboto Android) cho native feel
- **Spacing**: 4.0 base unit (8, 12, 16, 24, 32, 48)
- **Border Radius**: Toàn bộ components đều có rounded corners
  - Small (8dp): Badges, chips, tags
  - Medium (12dp): Buttons, input fields
  - Large (16dp): Cards, containers
  - Extra Large (20dp): Modals, bottom sheets
  - Full rounded (999dp): Avatar, pills, floating buttons

### Icon System

**FINAL DECISION: Lucide Icons (Black & White)** ✅

```yaml
dependencies:
  lucide_icons_flutter: ^1.1.0   # Matches web (frontend uses lucide-react)
```

**Icon Guidelines:**
- ✅ **Primary color: White on colored backgrounds** (buttons, app bar)
- ✅ **Primary color: Black/Gray on light backgrounds** (cards, inputs)
- ✅ **Consistent stroke width**: 2dp (lucide default)
- ✅ **Size scale**: 20dp (small), 24dp (default), 28dp (large), 32dp (extra large)
- ✅ **States**: Default (black #1A1A1A), Disabled (gray #9CA3AF), Active (colored)

**Icon Usage Examples:**
```dart
// Bottom navigation icons (active state có màu)
Icon(LucideIcons.home, color: isActive ? AppColors.primary : AppColors.textSecondary)
Icon(LucideIcons.mapPin, color: isActive ? AppColors.primary : AppColors.textSecondary)
Icon(LucideIcons.users, color: isActive ? AppColors.primary : AppColors.textSecondary)
Icon(LucideIcons.user, color: isActive ? AppColors.primary : AppColors.textSecondary)

// Action buttons (white trên background màu)
Icon(LucideIcons.heart, color: Colors.white)      // On coral button
Icon(LucideIcons.bookmark, color: Colors.white)   // On golden button

// List items (black/gray trên white background)
Icon(LucideIcons.calendar, color: AppColors.textSecondary, size: 20)
Icon(LucideIcons.dollarSign, color: AppColors.textSecondary, size: 20)
```

### Flutter Theme Setup

```dart
// lib/config/theme.dart
import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class AppTheme {
  // Base colors (neutral, clean)
  static const Color background = Color(0xFFFAFAFA);      // Very light gray
  static const Color surface = Color(0xFFFFFFFF);         // Pure white
  static const Color textPrimary = Color(0xFF1A1A1A);     // Near-black
  static const Color textSecondary = Color(0xFF6B7280);   // Gray-600
  static const Color border = Color(0xFFE5E7EB);          // Gray-200
  static const Color divider = Color(0xFFF3F4F6);         // Gray-100
  
  // Primary: Warm coral (travel, vacation vibes)
  static const Color primary = Color(0xFFFF6B6B);         // Coral
  static const Color primaryLight = Color(0xFFFF8787);    
  static const Color primaryDark = Color(0xFFE85555);     
  static const Color primarySurface = Color(0xFFFFE8E8);  // Tinted background
  
  // Secondary: Turquoise (beach, ocean)
  static const Color secondary = Color(0xFF4ECDC4);       // Turquoise
  static const Color secondaryLight = Color(0xFF7DD9D1);  
  static const Color secondaryDark = Color(0xFF3BA89F);   
  static const Color secondarySurface = Color(0xFFE0F7F5);
  
  // Accent: Golden (sunset, premium)
  static const Color accent = Color(0xFFFFA500);          
  static const Color accentLight = Color(0xFFFFB733);     
  static const Color accentSurface = Color(0xFFFFF4E0);   
  
  // Semantic colors
  static const Color success = Color(0xFF10B981);         // Emerald
  static const Color warning = Color(0xFFFBBF24);         // Amber
  static const Color error = Color(0xFFEF4444);           // Red
  static const Color info = Color(0xFF3B82F6);            // Blue
  
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    
    colorScheme: ColorScheme.fromSeed(
      seedColor: primary,
      brightness: Brightness.light,
      surface: surface,
      background: background,
    ),
    
    scaffoldBackgroundColor: background,
    
    // Typography (system fonts)
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 32, 
        fontWeight: FontWeight.w700, 
        color: textPrimary,
        height: 1.2,
        letterSpacing: -0.5,
      ),
      displayMedium: TextStyle(
        fontSize: 24, 
        fontWeight: FontWeight.w700, 
        color: textPrimary,
        height: 1.3,
        letterSpacing: -0.3,
      ),
      headlineMedium: TextStyle(
        fontSize: 20, 
        fontWeight: FontWeight.w600, 
        color: textPrimary,
        height: 1.4,
      ),
      bodyLarge: TextStyle(
        fontSize: 16, 
        fontWeight: FontWeight.w400, 
        color: textPrimary,
        height: 1.6,
      ),
      bodyMedium: TextStyle(
        fontSize: 14, 
        fontWeight: FontWeight.w400, 
        color: textSecondary,
        height: 1.5,
      ),
      labelLarge: TextStyle(
        fontSize: 14, 
        fontWeight: FontWeight.w600, 
        color: textPrimary,
        letterSpacing: 0.1,
      ),
    ),
    
    // Rounded corners for ALL components
    cardTheme: CardTheme(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: border, width: 1),
      ),
      color: surface,
    ),
    
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 0,
        backgroundColor: primary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      ),
    ),
    
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: primary, width: 1.5),
        foregroundColor: primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      ),
    ),
    
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: primary, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: surface,
      selectedItemColor: primary,
      unselectedItemColor: textSecondary,
      type: BottomNavigationBarType.fixed,
      elevation: 0,
    ),
    
    appBarTheme: AppBarTheme(
      backgroundColor: surface,
      foregroundColor: textPrimary,
      elevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: textPrimary),
    ),
  );
}
```

### Color Application Strategy

**Phân bổ màu sắc hợp lý theo đề tài du lịch:**

1. **Primary Coral (#FF6B6B)** - Warm, inviting, vacation feeling
   - Call-to-action buttons (Tạo chuyến đi, Đặt ngay)
   - Active states (selected bottom nav, focused inputs)
   - Like/favorite actions
   - Loading indicators

2. **Secondary Turquoise (#4ECDC4)** - Fresh, beach/ocean association
   - Category badge: Beach destinations
   - Secondary actions
   - Success messages
   - Map markers cho địa điểm biển

3. **Accent Golden (#FFA500)** - Sunset, premium, rewarding
   - Rating stars
   - Bookmark/save actions
   - Premium features highlight
   - Category badge: Food/restaurant

4. **Neutral Base (White/Black/Gray)** - Clean, readable
   - Text content (black #1A1A1A on white)
   - Icons (black/gray trên light background)
   - Cards, surfaces (white #FFFFFF)
   - Background (very light gray #FAFAFA)
   - Borders (light gray #E5E7EB)

5. **Category-Specific Colors** - Visual distinction
   ```dart
   static const Map<String, Color> categoryColors = {
     'beach': Color(0xFF4ECDC4),      // Turquoise - Biển
     'mountain': Color(0xFF95E1D3),   // Mint - Núi
     'culture': Color(0xFFFFAA85),    // Peach - Văn hóa
     'food': Color(0xFFFFA500),       // Orange - Ẩm thực
     'nature': Color(0xFF7DCE82),     // Green - Thiên nhiên
     'city': Color(0xFF9C88FF),       // Purple - Đô thị
   };
   ```

**Color Usage Rules:**
- ❌ Không dùng quá 2-3 màu trong cùng 1 screen
- ✅ Background luôn neutral (white/light gray)
- ✅ Text luôn high contrast (black on light, white on dark)
- ✅ Colored elements phải có mục đích (call-to-action, category, status)
- ✅ Icons default là black/gray, chỉ dùng màu cho active states

### Mobile-Specific Patterns

1. **Bottom Navigation Bar**: 
   - 4 tabs: Home, Trips, Community, Profile
   - Icons: lucide_icons với consistent stroke
   - Active state: Coral color + bold text
   - Rounded top corners (borderRadius: 20dp top only)

2. **Pull-to-Refresh**: 
   - RefreshIndicator với coral color
   - Haptic feedback on trigger

3. **Swipe Gestures**: 
   - Dismissible widget cho swipe-to-delete
   - Background reveal với red color + trash icon

4. **Cards with Rounded Corners**:
   ```dart
   Container(
     decoration: BoxDecoration(
       color: Colors.white,
       borderRadius: BorderRadius.circular(16),
       boxShadow: [
         BoxShadow(
           color: Colors.black.withOpacity(0.04),
           blurRadius: 8,
           offset: Offset(0, 2),
         ),
       ],
     ),
     // ...
   )
   ```

5. **Buttons với Rounded Corners**:
   - Primary: Coral background, white text/icon, 12dp radius
   - Secondary: Coral border + text, white background, 12dp radius
   - Icon buttons: Circular (full rounded)

6. **Input Fields với Rounded Corners**:
   - Border radius: 12dp
   - Focused state: Coral border (2dp width)
   - Prefix/suffix icons: Gray, 20dp size

### Accessibility

- **Color Contrast**: WCAG AA standard minimum
  - Text on background: 4.5:1 ratio
  - Large text (18pt+): 3:1 ratio
  - Icons: 3:1 ratio
- **Touch Targets**: Minimum 48x48 logical pixels
- **Semantics**: Screen reader labels cho tất cả interactive elements
- **Dark Mode**: Defer to Phase 2 (start with light mode only)
- **Font Scaling**: Support dynamic type (user font size preferences)

## Backend Changes Required

**⚠️ IMPORTANT: Mobile Development Scope**

**Backend Integration Approach: READ-ONLY từ Mobile Team Perspective**

Mobile app sẽ:
- ✅ **Consume existing backend APIs** - Sử dụng tất cả endpoints hiện có
- ✅ **Test API integration** - Kiểm tra kết nối và data flow
- ✅ **Report issues** - Nếu phát hiện bug hoặc thiếu endpoint, báo cáo cho backend team
- ❌ **KHÔNG tự ý modify backend code** - Không được sửa NestJS, database schema, hoặc bất kỳ code nào ngoài folder `mobile/`

### Backend API Dependencies (Current State)

Mobile app phụ thuộc vào các endpoints sau (ĐÃ TỒN TẠI):

**Authentication:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration (role: USER only)
- `GET /auth/profile` - Get current user profile

**Trips:**
- `GET /trips` - List all trips
- `GET /trips/:id` - Get trip details
- `POST /trips` - Create new trip

**Places:**
- `GET /places` - Browse places (with filters: province, category, budget)
- `GET /places/:id` - Get place details

**Recommendations:**
- `POST /recommendations` - Get ML-based recommendations

**Chat (RAG):**
- `POST /api/chat` - SSE streaming chat (Server-Sent Events)

**Community:**
- `GET /community/posts` - Get community feed
- `POST /community/posts` - Create new post
- `POST /community/posts/:id/comments` - Add comment

**Interactions (ML tracking):**
- `POST /interactions` - Track user interactions (VIEW, LIKE, SAVE, RATE)

### Optional Backend Enhancements (Không bắt buộc - Backend team quyết định)

**Nếu backend team muốn enhance cho mobile experience:**

1. **Image Upload** (cho community posts từ mobile):
   - Add endpoint: `POST /uploads` (S3 hoặc local storage)
   - Alternative: Mobile tự resize image với `image` package → upload base64 qua existing endpoints

2. **Rate Limiting** (protect API khỏi abuse):
   - Implement `@nestjs/throttler`
   - Suggest limit: 100 requests/minute per user

3. **API Versioning** (tương lai khi mobile app cần backward compatibility):
   - Add header: `API-Version: v1`
   - Cho phép mobile app cũ hoạt động khi backend update

**⚠️ CHÚ Ý:** Mobile team sẽ KHÔNG tự implement các enhancements này. Nếu cần, mobile team sẽ:
1. Tạo issue/ticket mô tả requirement
2. Thảo luận với backend team
3. Chờ backend team implement
4. Test integration sau khi backend deploy

### Backend Communication Protocol

**Khi phát hiện vấn đề:**
- ❌ **KHÔNG tự sửa backend code**
- ✅ Document issue rõ ràng (endpoint, request, response, expected vs actual)
- ✅ Tạo ticket với label `backend-needed`
- ✅ Implement workaround tạm thời trong mobile nếu có thể
- ✅ Chờ backend team review và fix

**Khi cần endpoint mới:**
- ❌ **KHÔNG tự thêm route vào NestJS**
- ✅ Viết API spec rõ ràng (method, path, request body, response format)
- ✅ Giải thích use case và tại sao cần
- ✅ Thảo luận với backend team trước khi code
- ✅ Backend team implement → Mobile team integrate

### Testing Backend Integration

Mobile team chịu trách nhiệm:
- ✅ Test API calls từ mobile app (Postman/Insomnia for manual testing)
- ✅ Handle API errors gracefully (network errors, 4xx, 5xx)
- ✅ Mock API responses cho unit tests (không call backend thật trong tests)
- ✅ Report performance issues (slow responses, timeouts)

Mobile team KHÔNG:
- ❌ Debug backend code khi có lỗi server-side
- ❌ Modify database schema
- ❌ Change API response structure
- ❌ Deploy backend changes

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

**FINAL TIMELINE: 7-8 weeks (1 developer)** ✅

| Phase | Duration | Start | Deliverables |
|-------|----------|-------|--------------|
| **Setup & Infra** | 3-4 days | Week 1 | Flutter project init, API client setup, navigation structure, Sunset theme config |
| **Phase 1: Core** | 2 weeks | Week 1-2 | Auth (login/register/profile), Trip list/detail/create, flutter_map integration |
| **Phase 2: Enhanced** | 2 weeks | Week 3-4 | Places discovery (browse/search/detail), RAG chat với SSE streaming, Offline Hive cache |
| **Phase 3: Social** | 2 weeks | Week 5-6 | Community feed/posts/comments, Local notifications, Polish UI/UX with Coral theme |
| **Testing & Debug** | 1 week | Week 7 | Fix bugs, performance optimization, test trên real devices (Android + iOS) |
| **App Store Prep** | 3-4 days | Week 8 | Screenshots, descriptions, privacy policy, Google Play submission |
| **Total** | **7-8 weeks** | Oct-Dec 2026 | Full-featured Flutter mobile app (user-facing only) |

**Learning Curve (if needed):**
- **Dart basics**: 3-5 ngày (syntax, null safety, async/await) - Dart tương tự TypeScript/JavaScript
- **Flutter fundamentals**: Included in Week 1 setup phase
- **Resources**: [dart.dev/guides](https://dart.dev/guides), [flutter.dev/docs](https://flutter.dev/docs)

**Scope:**
- ✅ **Included**: All user-facing features (auth, trips, places, chat, community, maps)
- ❌ **Excluded**: Admin features (place management, user management, content moderation) - admin stays on web interface

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

---

# UI/UX Design System cho Mobile App

## Context

Mobile app cần thiết kế giao diện:
- ✅ **Dễ nhìn, dễ dùng** - Clean, minimalist với visual hierarchy rõ ràng
- ✅ **Thân thiện với người dùng** - Intuitive navigation, familiar patterns, low learning curve
- ✅ **Icons trắng đen** - Consistent black/white icon system, không dùng colored icons
- ✅ **Màu sắc hợp lý** - Color palette phù hợp với đề tài du lịch (warm, inviting, vacation vibes)
- ✅ **Components bo góc tròn** - Tất cả elements đều rounded corners (soft, friendly, modern feel)

## Đề Xuất Color Palette

### **Sunset Travel Theme** (Warm, Inviting, Travel-Focused) 🌅

Theme lấy cảm hứng từ du lịch Việt Nam - biển xanh, hoàng hôn ấm áp, thiên nhiên tươi mát.

```dart
class AppColors {
  // ============ NEUTRAL BASE (Clean & Readable) ============
  // Background & Surface
  static const Color background = Color(0xFFFAFAFA);      // Very light gray (main background)
  static const Color surface = Color(0xFFFFFFFF);         // Pure white (cards, modals)
  static const Color surfaceTint = Color(0xFFF5F5F5);     // Light gray (subtle sections)
  
  // Text
  static const Color textPrimary = Color(0xFF1A1A1A);     // Near-black (headings, body)
  static const Color textSecondary = Color(0xFF6B7280);   // Gray-600 (descriptions, labels)
  static const Color textTertiary = Color(0xFF9CA3AF);    // Gray-400 (placeholders, disabled)
  
  // Borders & Dividers
  static const Color border = Color(0xFFE5E7EB);          // Gray-200 (input borders, card borders)
  static const Color divider = Color(0xFFF3F4F6);         // Gray-100 (list dividers, subtle lines)
  
  // ============ BRAND COLORS (Travel Theme) ============
  // Primary: Warm Coral (Vacation, Beach, Relaxing)
  static const Color primary = Color(0xFFFF6B6B);         // Vibrant coral
  static const Color primaryLight = Color(0xFFFF8787);    // Lighter coral (hover states)
  static const Color primaryDark = Color(0xFFE85555);     // Darker coral (pressed states)
  static const Color primarySurface = Color(0xFFFFE8E8);  // Very light coral (backgrounds, badges)
  
  // Secondary: Turquoise (Ocean, Fresh, Peaceful)
  static const Color secondary = Color(0xFF4ECDC4);       // Turquoise
  static const Color secondaryLight = Color(0xFF7DD9D1);  
  static const Color secondaryDark = Color(0xFF3BA89F);   
  static const Color secondarySurface = Color(0xFFE0F7F5); // Light turquoise tint
  
  // Accent: Golden (Sunset, Premium, Rewarding)
  static const Color accent = Color(0xFFFFA500);          // Golden orange
  static const Color accentLight = Color(0xFFFFB733);     
  static const Color accentSurface = Color(0xFFFFF4E0);   // Light cream
  
  // ============ CATEGORY COLORS (Visual Distinction) ============
  static const Color categoryBeach = Color(0xFF4ECDC4);   // Turquoise - Biển
  static const Color categoryMountain = Color(0xFF95E1D3); // Mint green - Núi
  static const Color categoryCulture = Color(0xFFFFAA85); // Peach - Văn hóa
  static const Color categoryFood = Color(0xFFFFA500);    // Orange - Ẩm thực
  static const Color categoryNature = Color(0xFF7DCE82);  // Green - Thiên nhiên
  static const Color categoryCity = Color(0xFF9C88FF);    // Purple - Đô thị
  
  // ============ SEMANTIC COLORS (Status) ============
  static const Color success = Color(0xFF10B981);         // Emerald green
  static const Color successSurface = Color(0xFFD1FAE5);  
  static const Color warning = Color(0xFFFBBF24);         // Amber
  static const Color warningSurface = Color(0xFFFEF3C7);  
  static const Color error = Color(0xFFEF4444);           // Red
  static const Color errorSurface = Color(0xFFFEE2E2);    
  static const Color info = Color(0xFF3B82F6);            // Blue
  static const Color infoSurface = Color(0xFFDBEAFE);     
  
  // ============ INTERACTIVE COLORS ============
  static const Color likeRed = Color(0xFFFF6B6B);         // Coral (matches primary)
  static const Color bookmarkGold = Color(0xFFFFA500);    // Golden
  static const Color rating = Color(0xFFFFA500);          // Golden star
  
  // Helper method
  static Color getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'beach': return categoryBeach;
      case 'mountain': return categoryMountain;
      case 'culture': return categoryCulture;
      case 'food': return categoryFood;
      case 'nature': return categoryNature;
      case 'city': return categoryCity;
      default: return primary;
    }
  }
}
```

**Rationale - Tại sao chọn màu này:**
- **Coral (#FF6B6B)**: Ấm áp, gợi cảm giác vacation/beach/relaxing, không quá chói
- **Turquoise (#4ECDC4)**: Màu biển trong xanh, fresh, peaceful - phù hợp với 80% du lịch VN liên quan biển
- **Golden (#FFA500)**: Màu hoàng hôn, premium feel, rewarding (ratings, bookmarks)
- **Neutral base**: White/black/gray giữ app clean, readable, professional
- **Category colors**: Giúp user phân biệt nhanh loại địa điểm (biển=turquoise, núi=mint, ẩm thực=orange, v.v.)

**Color Usage Guidelines:**
```
✅ DO:
- Background chính: #FAFAFA (neutral light gray)
- Cards/surfaces: #FFFFFF (pure white)
- Text: #1A1A1A on light backgrounds (high contrast)
- Primary actions: Coral gradient buttons với white text/icons
- Icons: Black (#1A1A1A) hoặc Gray (#6B7280) trên light backgrounds
- Icons: White (#FFFFFF) trên colored buttons/backgrounds
- Active states: Coral color cho selected items
- Category badges: Respective colors (beach=turquoise, food=orange, etc.)

❌ DON'T:
- Dùng quá 2-3 màu trong cùng 1 screen (overwhelming)
- Colored icons trên light backgrounds (chỉ dùng black/white/gray)
- Low contrast text (đảm bảo WCAG AA: 4.5:1 ratio minimum)
- Colored backgrounds cho toàn bộ screen (chỉ dùng cho accents)
```

## Icon System

### **Lucide Icons - Black & White Only** ✅

```yaml
# pubspec.yaml
dependencies:
  lucide_icons_flutter: ^1.1.0   # Matches web (lucide-react)
```

**Icon Design Specs:**
- ✅ **Stroke width**: 2dp (lucide default, consistent across all icons)
- ✅ **Colors**: Black (#1A1A1A), Gray (#6B7280), hoặc White (#FFFFFF) only
- ✅ **Sizes**: 20dp (small), 24dp (default), 28dp (medium), 32dp (large)
- ❌ **NO colored icons** - Chỉ dùng màu cho backgrounds/badges xung quanh icon

**Icon Color Usage:**

```dart
// 1. Icons trên light backgrounds (cards, screens) → BLACK or GRAY
Icon(LucideIcons.mapPin, color: AppColors.textPrimary, size: 24)    // Black
Icon(LucideIcons.calendar, color: AppColors.textSecondary, size: 20) // Gray (less important)

// 2. Icons trên colored backgrounds (buttons) → WHITE
ElevatedButton.icon(
  icon: Icon(LucideIcons.plus, color: Colors.white),   // White on coral button
  label: Text('Tạo chuyến đi'),
  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
)

// 3. Bottom navigation → GRAY (inactive) / CORAL (active state only)
BottomNavigationBarItem(
  icon: Icon(LucideIcons.home, color: AppColors.textSecondary),  // Gray when inactive
  activeIcon: Icon(LucideIcons.home, color: AppColors.primary),  // Coral when active
  label: 'Trang chủ',
)

// 4. Interactive icons (like, bookmark) → Color changes on interaction
Icon(
  isLiked ? LucideIcons.heart : LucideIcons.heartOff,
  color: isLiked ? AppColors.likeRed : AppColors.textSecondary,  // Red when liked, gray when not
  size: 24,
)
```

**Common Icons:**
```dart
// Navigation
LucideIcons.home, LucideIcons.mapPin, LucideIcons.users, LucideIcons.user

// Actions
LucideIcons.plus, LucideIcons.search, LucideIcons.filter, LucideIcons.moreVertical

// Interactions
LucideIcons.heart, LucideIcons.bookmark, LucideIcons.share2, LucideIcons.messageCircle

// Info
LucideIcons.calendar, LucideIcons.clock, LucideIcons.dollarSign, LucideIcons.star

// Navigation/Controls
LucideIcons.chevronRight, LucideIcons.chevronLeft, LucideIcons.x, LucideIcons.check
```

## Typography System

### Font Family: **System Fonts (Native Feel)** ✅

```dart
class AppFonts {
  static const String ios = 'SF Pro Display';     // iOS default
  static const String android = 'Roboto';         // Android default
  
  static String get system => Platform.isIOS ? ios : android;
}
```

**Rationale:**
- ✅ Zero loading time (no font download)
- ✅ Native feel (users familiar with system fonts)
- ✅ Better performance (smaller bundle size)
- ✅ Accessibility (support dynamic type/font scaling)

### Text Styles

```dart
class AppTextStyles {
  // ============ DISPLAY (Headings) ============
  static const TextStyle displayLarge = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.w700,  // Bold
    height: 1.2,
    letterSpacing: -0.5,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle displayMedium = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w700,
    height: 1.3,
    letterSpacing: -0.3,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle headlineMedium = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,  // Semibold
    height: 1.4,
    color: AppColors.textPrimary,
  );
  
  // ============ BODY TEXT ============
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w400,  // Regular
    height: 1.6,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSecondary,
  );
  
  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.4,
    color: AppColors.textTertiary,
  );
  
  // ============ LABELS & BUTTONS ============
  static const TextStyle labelLarge = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,  // Semibold
    letterSpacing: 0.1,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle labelMedium = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    color: AppColors.textSecondary,
  );
}
```

## Spacing & Layout

### Spacing Scale (4px base unit)

```dart
class AppSpacing {
  static const double xxs = 2.0;   // Minimal gap
  static const double xs = 4.0;    // Very tight spacing
  static const double sm = 8.0;    // Tight spacing
  static const double md = 12.0;   // Default spacing
  static const double lg = 16.0;   // Comfortable spacing
  static const double xl = 24.0;   // Generous spacing
  static const double xxl = 32.0;  // Large gaps
  static const double xxxl = 48.0; // Extra large gaps
}
```

### Border Radius (Rounded Corners - All Components)

```dart
class AppRadius {
  static const double sm = 8.0;    // Badges, chips, tags
  static const double md = 12.0;   // Buttons, input fields
  static const double lg = 16.0;   // Cards, containers
  static const double xl = 20.0;   // Modals, bottom sheets
  static const double xxl = 24.0;  // Large cards
  static const double full = 999.0; // Fully rounded (avatar, pills, FAB)
}
```

**Usage Examples:**
```dart
// Card - Large radius
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(AppRadius.lg),  // 16dp
    color: AppColors.surface,
  ),
)

// Button - Medium radius
ElevatedButton(
  style: ElevatedButton.styleFrom(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),  // 12dp
    ),
  ),
)

// Input field - Medium radius
TextField(
  decoration: InputDecoration(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),  // 12dp
    ),
  ),
)

// Badge - Small radius
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(AppRadius.sm),  // 8dp
    color: AppColors.categoryBeach,
  ),
)

// Avatar - Full rounded
CircleAvatar(
  radius: 20,  // Automatically fully rounded
)
```

## Component Design

### ⚠️ Avoiding "AI Slop" UI

**"AI Slop" là gì?** Generic, soulless UI không có character, trông giống hàng nghìn app AI-generated khác:
- ❌ Glass morphism everywhere (blur effects không cần thiết)
- ❌ Gradient overload (gradients ở mọi nơi)
- ❌ Over-rounded corners (quá tròn trông như bubble gum)
- ❌ Generic placeholder images (abstract shapes, pastel blobs)
- ❌ Empty states với emoji lớn + generic text "Nothing here yet! 🎉"
- ❌ Unnecessary animations (fade/scale/rotate mọi thứ)

**Cách tránh "AI Slop" trong Travel App:**

```
✅ DO - Purposeful, Travel-Specific Design:
1. Real travel photography (actual Vietnam destinations, not stock photos)
2. Purposeful color usage (coral cho actions, turquoise cho beach categories)
3. Balanced rounded corners (12-16dp, not 24dp+ everywhere)
4. Meaningful empty states ("Chưa có chuyến đi nào. Bắt đầu khám phá!" với destination suggestions)
5. Subtle animations chỉ cho feedback (like button bounce, pull-to-refresh)
6. Clear information hierarchy (text sizes, weights, spacing có mục đích)
7. Functional white space (không cố nhồi nhét quá nhiều elements)

❌ DON'T - Generic AI Slop:
1. Abstract geometric patterns làm background
2. Gradients trên mọi card/button/surface
3. Glass morphism/frosted glass effects không cần thiết
4. Over-animated (mọi thứ fade in/scale/bounce)
5. Generic illustrations (cartoon characters, abstract shapes)
6. Emoji abuse (3-4 emojis trong 1 câu text)
7. Rounded corners quá mức (24dp+ everywhere = looks childish)
```

### Button Styles (Purposeful, Not Flashy)

```dart
// ============ PRIMARY BUTTON ============
// Solid coral, white text/icon, subtle shadow
ElevatedButton(
  style: ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,        // Coral
    foregroundColor: Colors.white,
    elevation: 0,                              // No shadow (flat design)
    shadowColor: Colors.transparent,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12), // Medium rounded, not excessive
    ),
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
  ),
  child: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(LucideIcons.plus, size: 20, color: Colors.white),  // White icon
      SizedBox(width: 8),
      Text('Tạo chuyến đi', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
    ],
  ),
)

// ============ SECONDARY BUTTON ============
// Outline style, coral border, no background
OutlinedButton(
  style: OutlinedButton.styleFrom(
    foregroundColor: AppColors.primary,
    side: BorderSide(color: AppColors.primary, width: 1.5),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
  ),
  child: Text('Xem thêm'),
)

// ============ TEXT BUTTON (Minimal) ============
TextButton(
  style: TextButton.styleFrom(
    foregroundColor: AppColors.primary,
    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  ),
  child: Text('Bỏ qua'),
)

// ============ ICON BUTTON (Circle, not square) ============
IconButton(
  icon: Icon(LucideIcons.heart, color: AppColors.textSecondary),
  onPressed: () {},
  style: IconButton.styleFrom(
    shape: CircleBorder(),  // Fully rounded (appropriate for icon buttons)
  ),
)
```

### Card Design (Clean, Not Cluttered)

```dart
// ============ PLACE CARD - Clean Travel Focus ============
Container(
  decoration: BoxDecoration(
    color: AppColors.surface,
    borderRadius: BorderRadius.circular(16),  // Large radius for cards
    border: Border.all(color: AppColors.border, width: 1),
    // NO shadow (flat design) or very subtle shadow
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.04),  // Very subtle
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // Image with category badge overlay
      Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
            child: CachedNetworkImage(
              imageUrl: place.imageUrl,
              height: 180,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          // Category badge - small, subtle
          Positioned(
            top: 12,
            left: 12,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.getCategoryColor(place.category),
                borderRadius: BorderRadius.circular(8),  // Small radius
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(getCategoryIcon(place.category), size: 14, color: Colors.white),
                  SizedBox(width: 4),
                  Text(
                    place.category,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      
      // Content area - well-spaced
      Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title
            Text(
              place.name,
              style: AppTextStyles.headlineMedium,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 8),
            
            // Location
            Row(
              children: [
                Icon(LucideIcons.mapPin, size: 16, color: AppColors.textSecondary),
                SizedBox(width: 4),
                Expanded(
                  child: Text(
                    '${place.district}, ${place.province}',
                    style: AppTextStyles.bodyMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            
            // Meta info row
            Row(
              children: [
                // Rating
                Icon(LucideIcons.star, size: 16, color: AppColors.rating),
                SizedBox(width: 4),
                Text('${place.rating}', style: AppTextStyles.labelMedium),
                SizedBox(width: 4),
                Text('(${place.reviewCount})', style: AppTextStyles.bodySmall),
                
                SizedBox(width: 16),
                
                // Budget
                Icon(LucideIcons.dollarSign, size: 16, color: AppColors.textSecondary),
                Text(getBudgetLabel(place.budgetLevel), style: AppTextStyles.bodyMedium),
                
                Spacer(),
                
                // Like button (subtle, no badge)
                IconButton(
                  icon: Icon(
                    place.isLiked ? LucideIcons.heart : LucideIcons.heartOff,
                    size: 20,
                    color: place.isLiked ? AppColors.likeRed : AppColors.textSecondary,
                  ),
                  onPressed: () {},
                  constraints: BoxConstraints(),
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
          ],
        ),
      ),
    ],
  ),
)
```

### Input Fields (Functional, Not Decorative)

```dart
// ============ TEXT INPUT - Clean & Functional ============
TextField(
  decoration: InputDecoration(
    labelText: 'Điểm đến',
    hintText: 'Ví dụ: Đà Nẵng, Phú Quốc',
    
    // Prefix icon (gray on light background)
    prefixIcon: Icon(LucideIcons.mapPin, size: 20, color: AppColors.textSecondary),
    
    // Border styling
    filled: true,
    fillColor: AppColors.surface,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),  // Medium rounded
      borderSide: BorderSide(color: AppColors.border, width: 1),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: AppColors.border, width: 1),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: AppColors.primary, width: 2),  // Coral when focused
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: AppColors.error, width: 1),
    ),
    
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
  ),
)
```

### Empty States (Meaningful, Not Generic)

```dart
// ❌ BAD - Generic AI Slop
Column(
  children: [
    Text('🎉', style: TextStyle(fontSize: 64)),  // Giant emoji
    SizedBox(height: 16),
    Text('Nothing here yet!'),                  // Generic message
    Text('Start exploring'),                     // Vague CTA
  ],
)

// ✅ GOOD - Travel-Specific, Helpful
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    // Simple, relevant icon (not giant emoji)
    Icon(LucideIcons.mapPin, size: 48, color: AppColors.textTertiary),
    SizedBox(height: 16),
    
    // Clear, specific message
    Text(
      'Chưa có chuyến đi nào',
      style: AppTextStyles.headlineMedium,
    ),
    SizedBox(height: 8),
    Text(
      'Bắt đầu lên kế hoạch cho chuyến du lịch đầu tiên của bạn',
      style: AppTextStyles.bodyMedium,
      textAlign: TextAlign.center,
    ),
    SizedBox(height: 24),
    
    // Clear action
    ElevatedButton.icon(
      icon: Icon(LucideIcons.plus, size: 20),
      label: Text('Tạo chuyến đi mới'),
      onPressed: () {},
    ),
    
    SizedBox(height: 16),
    
    // Helpful suggestions (optional)
    Text('Gợi ý điểm đến:', style: AppTextStyles.labelMedium),
    SizedBox(height: 8),
    Wrap(
      spacing: 8,
      children: ['Đà Nẵng', 'Phú Quốc', 'Hạ Long'].map((dest) =>
        Chip(
          label: Text(dest),
          onPressed: () {},
        ),
      ).toList(),
    ),
  ],
)
```

### Bottom Navigation Bar (Clean Icons, Clear Labels)

```dart
// ============ BOTTOM NAV - Simple & Functional ============
BottomNavigationBar(
  type: BottomNavigationBarType.fixed,
  backgroundColor: AppColors.surface,
  selectedItemColor: AppColors.primary,      // Coral when selected
  unselectedItemColor: AppColors.textSecondary,  // Gray when not selected
  selectedFontSize: 12,
  unselectedFontSize: 12,
  showUnselectedLabels: true,
  elevation: 0,  // Flat, with top border instead
  
  items: [
    BottomNavigationBarItem(
      icon: Icon(LucideIcons.home, size: 24),
      activeIcon: Icon(LucideIcons.home, size: 24),  // Same icon, just color changes
      label: 'Trang chủ',
    ),
    BottomNavigationBarItem(
      icon: Icon(LucideIcons.mapPin, size: 24),
      activeIcon: Icon(LucideIcons.mapPin, size: 24),
      label: 'Chuyến đi',
    ),
    BottomNavigationBarItem(
      icon: Icon(LucideIcons.users, size: 24),
      activeIcon: Icon(LucideIcons.users, size: 24),
      label: 'Cộng đồng',
    ),
    BottomNavigationBarItem(
      icon: Icon(LucideIcons.user, size: 24),
      activeIcon: Icon(LucideIcons.user, size: 24),
      label: 'Tài khoản',
    ),
  ],
  currentIndex: _currentIndex,
  onTap: (index) => setState(() => _currentIndex = index),
)
```

### Loading States (Simple, Not Distracting)

```dart
// ❌ BAD - Distracting skeleton loaders everywhere
Shimmer.fromColors(
  baseColor: Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: ComplexShimmerLayout(),  // Shimmer on everything
)

// ✅ GOOD - Simple, unobtrusive loading
// For list items
CircularProgressIndicator(
  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
  strokeWidth: 2,
)

// For pull-to-refresh
RefreshIndicator(
  color: AppColors.primary,
  onRefresh: () async {},
  child: ListView(...),
)

// For initial screen load (optional shimmer, but simple)
ListView.separated(
  itemCount: 3,
  separatorBuilder: (_, __) => SizedBox(height: 16),
  itemBuilder: (_, __) => Container(
    height: 200,
    decoration: BoxDecoration(
      color: AppColors.surfaceTint,  // Simple gray placeholder
      borderRadius: BorderRadius.circular(16),
    ),
  ),
)
```

### Animations & Microinteractions (Subtle, Purposeful Only)

```dart
class AppDurations {
  static const Duration fast = Duration(milliseconds: 150);    // Quick feedback
  static const Duration normal = Duration(milliseconds: 250);  // Default transitions
  static const Duration slow = Duration(milliseconds: 350);    // Emphasis animations
}
```

**Animation Guidelines - Avoid Over-Animation:**

```dart
// ✅ GOOD - Subtle, purposeful animations

// 1. Like button bounce (feedback only)
void _onLikeTap() {
  setState(() => isLiked = !isLiked);
  HapticFeedback.lightImpact();  // Haptic feedback
  
  // Simple scale animation
  _controller.forward().then((_) => _controller.reverse());
}

AnimatedScale(
  scale: isAnimating ? 1.2 : 1.0,
  duration: AppDurations.fast,
  child: Icon(isLiked ? LucideIcons.heart : LucideIcons.heartOff),
)

// 2. Page transitions (simple slide)
PageRouteBuilder(
  transitionDuration: AppDurations.normal,
  pageBuilder: (context, animation, secondaryAnimation) => NextScreen(),
  transitionsBuilder: (context, animation, secondaryAnimation, child) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: Offset(1.0, 0.0),  // Slide from right
        end: Offset.zero,
      ).animate(animation),
      child: child,
    );
  },
)

// 3. Pull-to-refresh (built-in, no custom animation needed)
RefreshIndicator(
  color: AppColors.primary,
  onRefresh: _handleRefresh,
  child: ListView(...),
)

// ❌ BAD - Unnecessary animations
// Don't animate everything on screen load
AnimatedOpacity(opacity: _visible ? 1.0 : 0.0, child: EveryWidget())  // NO
AnimatedContainer(duration: Duration(seconds: 1), ...)  // Too slow
Hero(tag: 'random-element', child: NormalWidget())  // Hero everywhere is distracting
```

**What NOT to animate:**
- ❌ Text appearing (just show it)
- ❌ List items staggered fade-in (distracting on scroll)
- ❌ Every button hover/press (subtle opacity change is enough)
- ❌ Page transitions longer than 250ms (feels sluggish)
- ❌ Loading spinners with custom animations (use standard CircularProgressIndicator)

### Screen Examples (Clean Layouts, Not Cluttered)

#### Home Screen - Travel-Focused, Not Generic

```dart
// ✅ GOOD HOME SCREEN LAYOUT
Scaffold(
  backgroundColor: AppColors.background,
  body: SafeArea(
    child: CustomScrollView(
      slivers: [
        // App bar - simple, functional
        SliverAppBar(
          backgroundColor: AppColors.background,
          elevation: 0,
          floating: true,
          title: Row(
            children: [
              Text('AI Travel', style: AppTextStyles.headlineMedium),
              SizedBox(width: 8),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primarySurface,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Beta',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          actions: [
            IconButton(
              icon: Icon(LucideIcons.bell, color: AppColors.textPrimary),
              onPressed: () {},
            ),
          ],
        ),
        
        // Greeting section - simple, not over-designed
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Xin chào, ${user.firstName} 👋',
                  style: AppTextStyles.displayMedium,
                ),
                SizedBox(height: 8),
                Text(
                  'Khám phá điểm đến mới cho chuyến đi tiếp theo',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
        
        // Search bar - functional, not decorative
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Tìm kiếm địa điểm, chuyến đi...',
                prefixIcon: Icon(LucideIcons.search, size: 20),
                suffixIcon: IconButton(
                  icon: Icon(LucideIcons.sliders, size: 20),
                  onPressed: () {},
                ),
              ),
              onTap: () => Navigator.push(context, SearchScreen()),
            ),
          ),
        ),
        
        // Section: Dành cho bạn
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.fromLTRB(16, 24, 16, 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Dành cho bạn', style: AppTextStyles.headlineMedium),
                TextButton(
                  child: Text('Xem tất cả'),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ),
        
        // Horizontal scroll - recommended places
        SliverToBoxAdapter(
          child: SizedBox(
            height: 280,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.symmetric(horizontal: 16),
              itemCount: recommendedPlaces.length,
              separatorBuilder: (_, __) => SizedBox(width: 16),
              itemBuilder: (context, index) {
                final place = recommendedPlaces[index];
                return PlaceCard(place: place, width: 200);
              },
            ),
          ),
        ),
        
        // Section: Danh mục phổ biến
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.fromLTRB(16, 24, 16, 16),
            child: Text('Danh mục phổ biến', style: AppTextStyles.headlineMedium),
          ),
        ),
        
        // Category grid - simple, clear
        SliverPadding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          sliver: SliverGrid(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.5,
            ),
            delegate: SliverChildListDelegate([
              CategoryCard(category: 'beach', label: 'Biển', icon: LucideIcons.waves),
              CategoryCard(category: 'mountain', label: 'Núi', icon: LucideIcons.mountain),
              CategoryCard(category: 'culture', label: 'Văn hóa', icon: LucideIcons.landmark),
              CategoryCard(category: 'food', label: 'Ẩm thực', icon: LucideIcons.utensils),
            ]),
          ),
        ),
        
        SliverToBoxAdapter(child: SizedBox(height: 24)),
      ],
    ),
  ),
)

// Category Card - clean, not over-designed
Widget CategoryCard({
  required String category,
  required String label,
  required IconData icon,
}) {
  return InkWell(
    onTap: () {},
    borderRadius: BorderRadius.circular(12),
    child: Container(
      decoration: BoxDecoration(
        color: AppColors.getCategoryColor(category).withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.getCategoryColor(category).withOpacity(0.3),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 32,
            color: AppColors.getCategoryColor(category),
          ),
          SizedBox(height: 8),
          Text(
            label,
            style: AppTextStyles.labelLarge.copyWith(
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    ),
  );
}
```

### Design System Summary

**Key Principles to Avoid "AI Slop":**

1. **Purpose over decoration**
   - Every color, animation, rounded corner has a reason
   - Not "this looks cool" but "this helps user understand/complete action"

2. **Content-first design**
   - Real travel photos, not abstract illustrations
   - Clear text hierarchy, not decorative typography
   - Functional layouts, not trendy grid experiments

3. **Subtle over flashy**
   - Flat design with minimal shadows (0-4% opacity)
   - Animations only for feedback/transitions (150-250ms)
   - Rounded corners balanced (8-16dp), not excessive (24dp+)

4. **Consistent system**
   - Black/white/gray icons only (colored backgrounds OK)
   - Coral for primary actions, Turquoise/Golden for accents
   - System fonts for native feel and performance

5. **Travel-specific, not generic**
   - Empty states with destination suggestions
   - Category colors match actual categories (beach=turquoise, food=orange)
   - Weather, ratings, budget info always visible
   - Map-centric features (location is core to travel)

**Anti-Patterns to Avoid:**
```
❌ Glass morphism everywhere
❌ Gradient backgrounds on all cards
❌ Giant emojis (64px+) as primary UI elements
❌ Abstract blob illustrations
❌ Staggered fade-in animations on every scroll
❌ Over-rounded corners (24dp+ on everything)
❌ Colored icons on light backgrounds (use black/gray)
❌ Empty white space filled with decorative elements
❌ Generic motivational text ("Let's go!", "You got this!")
❌ Unnecessary loading animations (spinners with custom animations)
```

**Flutter Packages for Clean UI:**
```yaml
dependencies:
  # Icons - black/white system
  lucide_icons_flutter: ^1.1.0
  
  # Images - caching, not decorative placeholders
  cached_network_image: ^3.3.0
  
  # Animations - use sparingly
  flutter_animate: ^4.5.0          # For purposeful animations only
  
  # Loading - simple shimmer if needed
  shimmer: ^3.0.0                  # Use minimally, prefer CircularProgressIndicator
```

---

## Next Steps

1. **User Approval**: Review plan này, xác nhận chọn Flutter và Sunset Theme
2. **Environment Setup**: 
   - Cài đặt Flutter SDK: [flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
   - Android Studio (cho Android development + emulator)
   - Xcode (nếu develop cho iOS, chỉ có trên Mac)
   - VS Code hoặc Android Studio với Flutter/Dart plugins
3. **Learning Phase** (nếu chưa biết Dart):
   - Dart basics: [dart.dev/guides/language/language-tour](https://dart.dev/guides/language/language-tour)
   - Flutter fundamentals: [flutter.dev/docs/get-started/codelab](https://flutter.dev/docs/get-started/codelab)
   - Estimate: 3-5 ngày
4. **Repository Structure**: 
   - ⚠️ **Work exclusively in `mobile/` folder**
   - Không tạo files/folders ngoài `mobile/` directory
   - Nếu cần shared utilities (constants, types), duplicate vào `mobile/lib/utils/` thay vì reference từ `frontend/` hoặc `backend/`
5. **Kickoff Sprint 1**: 
   - Init Flutter project: `cd mobile && flutter create .` (trong folder mobile hiện có)
   - Setup theme configuration với Sunset colors
   - Setup API client với Dio (pointing to existing backend)
   - Implement authentication flow
   - **Test backend integration** - verify endpoints work as expected, report any issues

## Mobile Development Workflow

### Daily Development
```bash
# Chỉ làm việc trong mobile folder
cd mobile/

# Install dependencies
flutter pub get

# Run on emulator/device
flutter run

# Hot reload (trong terminal đang chạy app)
# Press 'r' for hot reload
# Press 'R' for hot restart

# Build for testing
flutter build apk --debug         # Android debug build
flutter build ios --debug         # iOS debug build (Mac only)
```

### Git Workflow
```bash
# Create feature branch (mobile-specific)
git checkout -b mobile/feature-auth

# Only stage files in mobile/ folder
git add mobile/

# Commit (prefix with "mobile:")
git commit -m "mobile: implement login screen with biometric auth"

# Before PR, verify no changes outside mobile/
git status
# Should only show files under mobile/

# Push and create PR
git push origin mobile/feature-auth
```

### Testing Backend Integration
```bash
# Set backend API URL for local testing
export API_URL=http://localhost:3002

# Run app pointing to local backend
flutter run --dart-define=API_URL=http://localhost:3002

# Or use .env file (inside mobile/)
# mobile/.env:
# API_URL=http://localhost:3002
```

### Reporting Issues to Backend Team
```markdown
<!-- Template for backend-related issues -->
**Issue Type**: Backend Integration

**Endpoint**: POST /auth/login

**Expected Behavior**: 
Login with valid credentials should return JWT token

**Actual Behavior**:
Returns 500 Internal Server Error

**Request**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

**Mobile App Version**: v0.1.0-dev
**Backend Endpoint**: http://localhost:3002
**Testing Date**: 2026-10-09

**Action Needed**: Backend team to investigate and fix
**Workaround**: Using mock auth for now in mobile app
```

### Code Review Checklist (Mobile Team)

Before submitting PR, verify:
- [ ] All changes are within `mobile/` folder only
- [ ] No imports from `../backend/` or `../frontend/`
- [ ] API calls use environment variables for backend URL
- [ ] Error handling for network failures implemented
- [ ] No hardcoded secrets (API keys, passwords)
- [ ] Tests pass: `flutter test`
- [ ] Linting passes: `flutter analyze`
- [ ] Build succeeds: `flutter build apk --debug`
- [ ] Tested on at least one Android emulator
- [ ] PR title prefixed with "mobile:"

## Final Decisions Summary

### ✅ All Key Decisions Made - Ready to Start Implementation

**Technology Stack:**
1. **Framework**: **Flutter 3.24+ with Dart 3.5+** ✅
2. **Target Platforms**: **Android + iOS (cả hai)** ✅
   - Flutter cross-platform advantage → build cả 2 từ đầu
   - Test trên Android emulator trước (dễ hơn), iOS sau
   - Deploy: Android first (Google Play $25 one-time), iOS later (nếu có Apple Developer account)

**UI/UX:**
3. **Color Theme**: **Sunset Gradient Theme (Coral + Turquoise)** ✅
   - Primary: Coral #FF6B6B
   - Secondary: Turquoise #4ECDC4
   - Accent: Golden #FFA500
   - Category colors: 6 màu phân biệt rõ ràng (Beach, Mountain, Culture, Food, Nature, City)

4. **Font**: **System Fonts (SF Pro iOS / Roboto Android)** ✅
   - Zero loading time, better performance
   - Native feel, accessibility support

5. **Design Approach**: **Reuse web design patterns, adapt to mobile** ✅
   - Bottom navigation thay navbar
   - Native gestures (pull-to-refresh, swipe)
   - Touch-friendly (48dp minimum targets)
   - Material Design 3 + Cupertino widgets

**Architecture:**
6. **State Management**: **Riverpod 2.5+** ✅
   - Modern, reactive, compile-safe providers
   - Best DX, auto-disposal, fine-grained reactivity

7. **API Client**: **Dio 5.4+ with interceptors** ✅
   - JWT auto-attach, error handling
   - Retrofit for type-safe endpoints

8. **Navigation**: **go_router 14.2+** ✅
   - Declarative routing, deep linking support

**Features Implementation:**
9. **Map Solution**: **flutter_map 7.0+ + Google Maps Tiles** ✅
   - Miễn phí, không cần API key
   - 100% consistent với web (Leaflet equivalent)
   - Category-colored markers với Sunset theme

10. **Chat Implementation**: **Server-Sent Events (SSE) với http package** ✅
    - Match web frontend implementation (ReadableStream + SSE)
    - Unidirectional streaming (server→client)
    - Event types: session_info, sources, token, done, error

11. **Offline Storage**: **sqflite 2.3+ (SQLite)** ✅
    - SQL standard, relational data support
    - Powerful queries (JOIN, WHERE, ORDER BY)
    - Migration support for schema versioning

12. **Image Caching**: **cached_network_image 3.3+** ✅
    - Auto-cache, placeholder support

**Scope:**
13. **User Role**: **End users only (no admin features)** ✅
    - Mobile app chỉ cho USER role
    - Admin functions stay on web

14. **Dark Mode**: **Defer to Phase 2** ✅
    - Start with light mode only
    - Add dark mode later if users request

**Timeline:**
15. **Development Duration**: **7-8 weeks (Oct-Dec 2026)** ✅
    - Phase 1 (2 weeks): Auth, Trips, Maps
    - Phase 2 (2 weeks): Places, Chat, Offline
    - Phase 3 (2 weeks): Community, Notifications, Polish
    - Testing (1 week): Bug fixes, optimization
    - App Store Prep (3-4 days): Submission

**Status: Plan Complete - No Remaining Undecided Options** 🎉

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
