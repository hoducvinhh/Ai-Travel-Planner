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

Web app hiện tại chỉ có màu trắng đen (#F9F9F8 background, #1A1A1A text). Mobile app nên có thêm màu sắc để tạo cảm giác sống động, trẻ trung và phân biệt rõ các features.

## Đề Xuất Color Palette

### **Sunset Gradient Theme** (Recommended - Warm & Inviting) 🌅

Theme này lấy cảm hứng từ hoàng hôn biển Việt Nam - ấm áp, thân thiện, phù hợp với du lịch.

```dart
class AppColors {
  // Base Colors (giữ từ web)
  static const Color background = Color(0xFFFAFAFA);      // Very light gray
  static const Color surface = Color(0xFFFFFFFF);         // Pure white cards
  static const Color textPrimary = Color(0xFF1A1A1A);     // Near-black text
  static const Color textSecondary = Color(0xFF6B7280);   // Gray-600
  
  // Primary Brand Color - Coral Orange (màu san hô)
  static const Color primary = Color(0xFFFF6B6B);         // Vibrant coral
  static const Color primaryLight = Color(0xFFFF8787);    // Lighter coral
  static const Color primaryDark = Color(0xFFE85555);     // Darker coral
  static const Color primarySurface = Color(0xFFFFE8E8);  // Very light coral background
  
  // Secondary Color - Turquoise Blue (màu biển)
  static const Color secondary = Color(0xFF4ECDC4);       // Turquoise
  static const Color secondaryLight = Color(0xFF7DD9D1);  // Light turquoise
  static const Color secondaryDark = Color(0xFF3BA89F);   // Dark turquoise
  static const Color secondarySurface = Color(0xFFE0F7F5); // Very light turquoise
  
  // Accent Color - Golden Yellow (màu vàng hoàng hôn)
  static const Color accent = Color(0xFFFFA500);          // Golden orange
  static const Color accentLight = Color(0xFFFFB733);     
  static const Color accentSurface = Color(0xFFFFF4E0);   // Light cream
  
  // Category Colors (phân biệt loại địa điểm)
  static const Color categoryBeach = Color(0xFF4ECDC4);   // Turquoise - Biển
  static const Color categoryMountain = Color(0xFF95E1D3); // Mint green - Núi
  static const Color categoryCulture = Color(0xFFFFAA85); // Peach - Văn hóa
  static const Color categoryFood = Color(0xFFFFA500);    // Orange - Ẩm thực
  static const Color categoryNature = Color(0xFF7DCE82);  // Green - Thiên nhiên
  static const Color categoryCity = Color(0xFF9C88FF);    // Purple - Đô thị
  
  // Semantic Colors
  static const Color success = Color(0xFF4ADE80);         // Green
  static const Color warning = Color(0xFFFBBF24);         // Amber
  static const Color error = Color(0xFFEF4444);           // Red
  static const Color info = Color(0xFF60A5FA);            // Blue
  
  // Interactive Colors
  static const Color likeRed = Color(0xFFFF6B6B);         // Coral (matches primary)
  static const Color bookmarkGold = Color(0xFFFFA500);    // Golden
  static const Color rating = Color(0xFFFFA500);          // Golden star
  
  // UI Element Colors
  static const Color border = Color(0xFFE5E7EB);          
  static const Color divider = Color(0xFFF3F4F6);         
}
```

**Rationale:**
- **Coral (#FF6B6B)**: Màu san hô ấm áp, gợi cảm giác vacation, beach, relaxing
- **Turquoise (#4ECDC4)**: Màu biển trong xanh, fresh, peaceful
- **Golden (#FFA500)**: Màu hoàng hôn, premium, rewarding (cho rating, bookmark)
- Kết hợp tạo cảm giác tropical paradise, phù hợp với du lịch Việt Nam (biển, vịnh, đảo)
- Màu sắc nổi bật nhưng không quá chói, vẫn professional

### Category Badge Color System
```
Biển     🏖️  → Turquoise (#4ECDC4)
Núi      ⛰️  → Mint Green (#95E1D3)
Văn hóa  🏛️  → Peach (#FFAA85)
Ẩm thực  🍜  → Orange (#FFA500)
Thiên nhiên 🌳 → Green (#7DCE82)
Đô thị   🏙️  → Purple (#9C88FF)
```

### Alternative Color Options

#### Option 2: **Ocean Blue Theme** (Modern & Trustworthy) 🌊
- Primary: Sky blue (#0EA5E9)
- Secondary: Teal (#14B8A6)
- Accent: Orange (#FF9800)
- Professional, đáng tin cậy cho booking/payment

#### Option 3: **Green Nature Theme** (Eco-Friendly & Fresh) 🌿
- Primary: Emerald (#10B981)
- Secondary: Lime (#84CC16)
- Accent: Amber (#F59E0B)
- Phù hợp với trend du lịch xanh

## Typography System

### Font Family

**FINAL DECISION: System Fonts** ✅

```dart
class AppFonts {
  static const String primaryFont = 'SF Pro Display';  // iOS default
  static const String secondaryFont = 'Roboto';        // Android default
  
  static String get systemFont => Platform.isIOS ? primaryFont : secondaryFont;
}
```

**Rationale:**
- ✅ **Zero loading time** - no font download delay
- ✅ **Native feel** - users familiar with system fonts
- ✅ **Better performance** - smaller app bundle size (no embedded fonts)
- ✅ **Accessibility** - system fonts support dynamic type/font scaling
- ❌ Custom fonts (Inter/Manrope) would add 200-400KB and slight load delay

**Note:** Nếu sau này muốn custom font để match web 100%, có thể thêm `google_fonts: ^6.1.0` package.

### Text Styles
```dart
class AppTextStyles {
  // Display (Headings)
  static const TextStyle displayLarge = TextStyle(
    fontSize: 32, fontWeight: FontWeight.w700, height: 1.2, letterSpacing: -0.5,
  );
  static const TextStyle displayMedium = TextStyle(
    fontSize: 24, fontWeight: FontWeight.w700, height: 1.3, letterSpacing: -0.3,
  );
  
  // Body Text
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16, fontWeight: FontWeight.w400, height: 1.6,
  );
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14, fontWeight: FontWeight.w400, height: 1.5,
  );
  
  // Labels & Buttons
  static const TextStyle labelLarge = TextStyle(
    fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.1,
  );
}
```

## Spacing & Layout

### Spacing Scale (4px base unit)
```dart
class AppSpacing {
  static const double xs = 4.0;    static const double sm = 8.0;
  static const double md = 12.0;   static const double lg = 16.0;
  static const double xl = 24.0;   static const double xxl = 32.0;
  static const double xxxl = 48.0;
}
```

### Border Radius
```dart
class AppRadius {
  static const double sm = 8.0;    // Badges, chips
  static const double md = 12.0;   // Buttons, inputs
  static const double lg = 16.0;   // Cards
  static const double xl = 20.0;   // Modals, bottom sheets
  static const double full = 999.0; // Fully rounded pills
}
```

## Component Design

### Button Styles
```
Primary Button (Coral gradient):
┌─────────────────────┐
│   Tạo chuyến đi     │  ← White text on Coral gradient (#FF6B6B → #FF8787)
└─────────────────────┘

Secondary Button (Outline):
┌─────────────────────┐
│   Xem thêm          │  ← Coral border & text, white bg
└─────────────────────┘
```

### Place Card Example
```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │     [Beach Photo]           │ │
│ │  ┌────┐         [☀️ 28°C]  │ │
│ │  │🏖️  │                    │ │  ← Category badge (Turquoise)
│ │  │Biển│                    │ │
│ │  └────┘                    │ │
│ └─────────────────────────────┘ │
│ Bãi Trường Beach               │  ← Title
│ Phú Quốc, Kiên Giang           │  ← Location
│ ⭐ 4.8 (245)  💰💰  🏖️        │  ← Rating (Golden)
│ [❤️ Thích] [🔖 Save] [➡️ More]│  ← Coral & Golden buttons
└─────────────────────────────────┘
```

### Home Screen Mockup
```
┌─────────────────────────────────┐
│ [Avatar] AI Travel 🌅 [🔔]     │  ← Coral notification badge
├─────────────────────────────────┤
│  ╔═══════════════════════════╗  │
│  ║ Gradient Background       ║  │  ← Sunset gradient (coral→cream→turquoise)
│  ║ Chào buổi sáng, Vinh 👋   ║  │
│  ║ Khám phá điểm đến mới     ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│  🎯 Dành cho bạn               │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ IMG  │ │ IMG  │ │ IMG  │   │  ← Horizontal scrolling cards
│  │ Hạ   │ │ Đà   │ │ Phú  │   │
│  │ Long │ │ Lạt  │ │ Quốc │   │
│  │ ⭐4.8│ │ ⭐4.9│ │ ⭐4.7│   │  ← Golden stars
│  │ ❤️128│ │ ❤️256│ │ ❤️512│   │  ← Coral hearts
│  └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────┘
│ [🏠] [📅] [👥] [👤]            │  ← Bottom nav (Coral active state)
└─────────────────────────────────┘
```

## Animations & Microinteractions

```dart
class AppDurations {
  static const Duration fast = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 250);
  static const Duration slow = Duration(milliseconds: 350);
}
```

**Like Animation:**
- Scale: 0.8 → 1.2 → 1.0 (bounce)
- Color: gray → Coral red
- Icon: Outline → Filled
- Duration: 350ms

**Pull-to-Refresh:**
- iOS spinner: Coral color
- Android spinner: Turquoise color
- Threshold: 80dp

## Design System Summary

**Why Sunset Theme:**
1. **Emotional Connection**: Coral + Turquoise = beach vacation vibes (80% du lịch VN liên quan biển)
2. **Differentiation**: Khác biệt rõ so với web (web = đen trắng, mobile = colorful)
3. **Category Clarity**: 6 category colors giúp user phân biệt nhanh loại địa điểm
4. **Gender-Neutral**: Không quá feminine (pink) hay masculine (blue), balanced
5. **Instagram-Worthy**: Màu sắc photogenic, user muốn chụp screenshot share

**Implementation:**
- Primary buttons: Coral gradient
- Category badges: Respective colors (biển=turquoise, núi=mint, etc.)
- Bottom nav active: Coral
- Like button: Coral
- Bookmark button: Golden
- Loading indicators: Coral

**Flutter Packages:**
```yaml
dependencies:
  flutter_animate: ^4.5.0           # Animations
  shimmer: ^3.0.0                   # Loading skeletons
  cached_network_image: ^3.3.0      # Image caching
  lucide_icons_flutter: ^1.1.0      # Icon library (matches web)
```

Xem chi tiết đầy đủ về design system tại file riêng: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

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
4. **Repository Structure**: Tạo folder `mobile/` trong monorepo hoặc separate repo
5. **Kickoff Sprint 1**: 
   - Init Flutter project: `flutter create mobile`
   - Setup theme configuration với Sunset colors
   - Setup API client với Dio
   - Implement authentication flow

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
