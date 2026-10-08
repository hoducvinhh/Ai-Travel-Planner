# Tổng Hợp Công Nghệ Mobile App - AI Travel Planner

## Core Framework

### Flutter & Dart

- **Flutter**: `3.24.0+` - UI framework
- **Dart**: `3.5.0+` - Programming language
- **Material Design 3** - Design system (built-in)
- **Cupertino widgets** - iOS-style components (built-in)

---

## UI & Animations

### Animation & Visual Effects

- `flutter_animate: ^4.5.0` - Declarative animations
- `shimmer: ^3.0.0` - Skeleton loading effects
- `lottie: ^3.1.0` - Lottie animations

### Icons & Images

- `lucide_icons_flutter: ^1.1.0` - Icon library (matches web)
- `cached_network_image: ^3.3.0` - Image caching with placeholder

---

## Navigation & Routing

- `go_router: ^14.2.0` - Declarative routing, deep linking

---

## State Management

### Production Choice ✅

- `flutter_riverpod: ^2.5.0` - Reactive state management
- `hooks_riverpod: ^2.5.0` - Optional hooks support

**Why Riverpod:**

- Modern, reactive, compile-safe
- Auto-disposal, dev tools
- Fine-grained reactivity
- Best DX (Developer Experience)

---

## Networking & API

### HTTP Client

- `dio: ^5.4.0` - HTTP client (like axios)
- `retrofit: ^4.0.0` - Type-safe API client generator
- `http: ^1.2.0` - For SSE streaming chat & geocoding APIs

### Server-Sent Events (SSE)

- `http: ^1.2.0` - SSE streaming for RAG chatbot ✅

**Chat Implementation:**

```dart
// SSE streaming matches web (ReadableStream)
final request = http.Request('POST', Uri.parse('$apiUrl/api/chat'));
request.headers['Content-Type'] = 'application/json';
request.body = json.encode({'message': query, 'sessionId': sessionId});

final response = await request.send();
final stream = response.stream.transform(utf8.decoder);

await for (String chunk in stream) {
  // Parse SSE events: data: {...}
  if (chunk.startsWith('data: ')) {
    final event = json.decode(chunk.substring(6));
    // Handle: session_info, sources, token, done, error
  }
}
```

### Serialization

- `json_annotation: ^4.8.0` - JSON serialization annotations
- `freezed: ^2.4.0` - Immutable models, unions, copyWith

---

## Maps & Location

### Map Display

- `flutter_map: ^7.0.2` - Leaflet-like maps (matches web) ✅
- `latlong2: ^0.9.0` - Coordinate handling
- `flutter_map_marker_cluster: ^1.3.0` - Marker clustering

**Tile Provider:** Google Maps tiles (free, no API key)

```
https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}
```

### Location Services

- `geolocator: ^11.0.0` - GPS, current location tracking

### Geocoding (Free APIs)

- **Primary:** Photon API (`https://photon.komoot.io/api/`)
- **Fallback:** Nominatim OSM (`https://nominatim.openstreetmap.org/`)
- **Local:** Search trong database `/places`

### Routing (Free)

- **OSRM API:** `https://router.project-osrm.org/route/v1/driving/`

---

## Storage & Cache

### Local Storage

- `shared_preferences: ^2.2.0` - Key-value storage (like AsyncStorage)
- `flutter_secure_storage: ^9.0.0` - Encrypted storage for JWT tokens

### Offline Database

- `sqflite: ^2.3.0` - SQLite database for offline support ✅

**Why SQLite:**

- Relational data (trips → places → users)
- Powerful queries (JOIN, WHERE, ORDER BY)
- Migration support
- SQL standard

### Network State

- `connectivity_plus: ^5.0.0` - Detect online/offline status

---

## Authentication & Security

- `local_auth: ^2.2.0` - Biometric authentication (Face ID/Touch ID)
- `flutter_secure_storage: ^9.0.0` - Encrypted JWT storage

**Auth Strategy:**

- JWT tokens in secure storage
- Biometric quick login
- Dio interceptors for auto-attach tokens

---

## Media & Camera

- `image_picker: ^1.0.0` - Pick images from gallery/camera
- `camera: ^0.10.0` - Direct camera access

**Use Cases:**

- Community posts with images
- Profile picture upload

---

## Notifications

- `flutter_local_notifications: ^17.0.0` - Local notifications only
- `timezone: ^0.9.0` - Timezone handling for scheduled notifications

**Use Cases:**

- Trip reminders (1 day before departure)
- Weather alerts
- Community interactions

**Note:** No push notifications server-side, all local scheduling

---

## Chat & Markdown

- `flutter_markdown: ^0.6.0` - Markdown rendering for chat responses
- `web_socket_channel: ^2.4.0` - WebSocket for streaming chat ✅

**Chat Implementation:**

- RAG chatbot with streaming responses
- Citation links in markdown
- Message bubbles (user vs AI)
- Typing indicators

---

## Utilities

### Internationalization & Formatting

- `intl: ^0.19.0` - Date/number formatting, i18n support

### Platform Integration

- `url_launcher: ^6.2.0` - Open URLs, maps, phone calls
- `share_plus: ^7.2.0` - Share content to other apps
- `package_info_plus: ^5.0.0` - App version info

---

## Development Tools (dev_dependencies)

### Testing

- `flutter_test` (SDK) - Widget & unit testing

### Linting & Analysis

- `flutter_lints: ^3.0.0` - Linter rules (Dart best practices)

### Code Generation

- `build_runner: ^2.4.0` - Code generation runner
- `json_serializable: ^6.7.0` - JSON serialization codegen
- `freezed_annotation: ^2.4.0` - Freezed codegen annotations
- `retrofit_generator: ^8.0.0` - Retrofit API client codegen

---

## Backend Integration

### NestJS Backend (No Changes Needed)

- **Base URL:** `http://localhost:3002` (development)
- **Auth:** JWT Bearer tokens
- **Endpoints:**
  - `POST /auth/login`, `/auth/register`
  - `GET /auth/profile`
  - `POST /trips`, `GET /trips`, `GET /trips/:id`
  - `GET /places`, `GET /places/:id`
  - `POST /recommendations`
  - `WebSocket /chat` (streaming)
  - `GET /community/posts`, `POST /community/posts`

### ML Service (Python FastAPI)

- **LightFM Model** - Collaborative + Content-Based Filtering
- **Recommendations API** - Personalized place suggestions

### Database

- **PostgreSQL** - Main database
- **pgvector** - Vector embeddings for RAG

---

## Design System

### Color Theme: Sunset Gradient ✅

**Primary Colors:**

- Coral: `#FF6B6B` (buttons, active states)
- Turquoise: `#4ECDC4` (secondary actions)
- Golden: `#FFA500` (accents, ratings)

**Category Colors:**

- Beach 🏖️: `#4ECDC4` (Turquoise)
- Mountain ⛰️: `#95E1D3` (Mint Green)
- Culture 🏛️: `#FFAA85` (Peach)
- Food 🍜: `#FFA500` (Orange)
- Nature 🌳: `#7DCE82` (Green)
- City 🏙️: `#9C88FF` (Purple)

**Base Colors:**

- Background: `#FAFAFA`
- Surface: `#FFFFFF`
- Text Primary: `#1A1A1A`
- Text Secondary: `#6B7280`
- Border: `#E5E7EB`

### Typography

**System Fonts (Final Choice):** ✅

- **iOS:** SF Pro Display
- **Android:** Roboto

**Why System Fonts:**

- Zero loading time
- Native feel
- Better performance
- Accessibility support

### Spacing & Layout

- **Base unit:** 4px
- **Border radius:** 8-20px (rounded, modern)
- **Touch targets:** 48x48dp minimum (Material Design)

---

## Platform-Specific

### iOS

- Cupertino widgets for native feel
- SF Pro Display font
- Swipe gestures
- Face ID / Touch ID biometric

### Android

- Material Design 3 components
- Roboto font
- Pull-to-refresh
- Fingerprint biometric

---

## CI/CD (Optional)

### GitHub Actions

```yaml
- Flutter SDK: 3.24.0
- flutter pub get
- flutter analyze
- flutter test
- flutter build apk --release
- flutter build appbundle --release
```

### Alternative Tools

- **Codemagic** - CI/CD for Flutter (free tier)
- **Fastlane** - Automate screenshots, beta deployment

---

## Architecture Pattern

### Clean Architecture Layers

```
Presentation (UI)
    ↓
Providers (State Management - Riverpod)
    ↓
Repositories (Data Layer Abstraction)
    ↓
Services (API, Local Storage)
    ↓
Models (Data Classes)
```

### Key Patterns

- **Repository Pattern** - Abstract data sources
- **Provider Pattern** - Riverpod state management
- **Singleton Services** - API client, storage
- **DTO Pattern** - Data Transfer Objects for API

---

## Performance Optimizations

### Built-in

- **Image Caching:** `cached_network_image`
- **Map Tile Caching:** flutter_map auto-cache
- **Lazy Loading:** ListView.builder for lists
- **Optimistic Updates:** Local-first, sync later

### Best Practices

- Use `const` constructors where possible
- Avoid rebuilds with Riverpod selectors
- Compress images before upload
- Paginate large lists

---

## Security Best Practices

### Implemented

- ✅ JWT in `flutter_secure_storage` (encrypted)
- ✅ HTTPS for all API calls
- ✅ No hardcoded secrets (environment variables)
- ✅ Biometric authentication
- ✅ Certificate pinning (optional, via Dio)

### Data Privacy

- No tracking SDKs
- User data stays on user's device (offline cache)
- Server-side data follows GDPR (backend responsibility)

---

## Testing Strategy

### Unit Tests

- Models: fromJson/toJson serialization
- Repositories: Mock API responses with mockito
- Utils: Validators, formatters

### Widget Tests

- Button interactions
- Form validation
- Navigation flows

### Integration Tests (Optional)

- Login → Create Trip → View Trip
- Places search → View details → Save favorite

---

## Estimated Bundle Size

- **Android APK:** ~15-20 MB (release build)
- **iOS IPA:** ~18-25 MB (release build)
- **With assets:** +5-10 MB (images, fonts if custom)

---

## Development Timeline

**Total:** 7-8 weeks (1 developer)

| Phase       | Duration | Key Technologies Used                                 |
| ----------- | -------- | ----------------------------------------------------- |
| **Setup**   | 3-4 days | Flutter, Dio, go_router, Riverpod, Sunset theme       |
| **Phase 1** | 2 weeks  | flutter_map, geolocator, sqflite, JWT auth            |
| **Phase 2** | 2 weeks  | web_socket_channel, flutter_markdown, Photon API      |
| **Phase 3** | 2 weeks  | image_picker, flutter_local_notifications, share_plus |
| **Testing** | 1 week   | flutter_test, manual testing on devices               |
| **Deploy**  | 3-4 days | Google Play Console, App Store Connect                |

---

## Learning Resources

### Official Docs

- Flutter: https://flutter.dev/docs
- Dart: https://dart.dev/guides
- Riverpod: https://riverpod.dev
- Material Design 3: https://m3.material.io

### Packages

- Pub.dev: https://pub.dev (package repository)

### Community

- Flutter Discord
- r/FlutterDev Reddit
- Stack Overflow (flutter tag)

---

## Summary

**Total Dependencies:** 31 packages (26 production + 5 dev)

**Key Technology Decisions:**

- ✅ **Framework:** Flutter 3.24+ with Dart 3.5+
- ✅ **State:** Riverpod (modern, reactive)
- ✅ **Maps:** flutter_map + Google tiles (free)
- ✅ **Chat:** WebSocket (matches web)
- ✅ **Storage:** sqflite (relational data)
- ✅ **Theme:** Sunset Gradient (Coral + Turquoise)
- ✅ **Fonts:** System fonts (SF Pro / Roboto)

**Ready for Sprint 1 Implementation** 🚀
