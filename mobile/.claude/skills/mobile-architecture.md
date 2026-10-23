---
skill: mobile-architecture
description: Architecture patterns for Flutter mobile app - state management, API client, navigation, folder structure
triggerWords: [architecture, structure, provider, repository, service, navigation, routing, state]
---

# Mobile App Architecture Guidelines

**READ THIS BEFORE implementing any feature in the mobile app.**

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Screens (UI)                                          │  │
│  │  - LoginScreen, HomeScreen, TripDetailScreen, etc.    │  │
│  │  - ConsumerWidget (Riverpod)                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                            ↕                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Providers (State Management - Riverpod)              │  │
│  │  - authProvider, tripsProvider, placesProvider        │  │
│  │  - StateNotifierProvider, FutureProvider, etc.        │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Repositories (Data abstraction)                       │  │
│  │  - AuthRepository, TripsRepository, PlacesRepository   │  │
│  │  - Handle caching, error handling, data transformation│  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Services (External communication)                     │  │
│  │  - ApiService (Dio HTTP client)                       │  │
│  │  - StorageService (SharedPreferences, SecureStorage)  │  │
│  │  - StreamService (SSE for chat)                       │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                  Backend API (NestJS)
```

## Folder Structure

```
mobile/lib/
├── main.dart                          # App entry point
├── app.dart                           # Root widget, routing setup
│
├── screens/                           # UI Screens (Presentation)
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── home/
│   │   └── home_screen.dart
│   ├── trips/
│   │   ├── trips_list_screen.dart
│   │   ├── trip_detail_screen.dart
│   │   └── create_trip_screen.dart
│   └── places/
│       └── place_detail_screen.dart
│
├── widgets/                           # Reusable widgets
│   ├── common/
│   │   ├── custom_button.dart
│   │   ├── custom_input.dart
│   │   └── loading_indicator.dart
│   ├── trip/
│   │   └── trip_card.dart
│   └── place/
│       └── place_card.dart
│
├── providers/                         # State Management (Riverpod)
│   ├── auth_provider.dart
│   ├── trips_provider.dart
│   ├── places_provider.dart
│   └── chat_provider.dart
│
├── repositories/                      # Business Logic
│   ├── auth_repository.dart
│   ├── trips_repository.dart
│   └── places_repository.dart
│
├── services/                          # Data Layer
│   ├── api_service.dart               # Dio HTTP client
│   ├── storage_service.dart           # Local storage
│   └── stream_service.dart            # SSE streaming
│
├── models/                            # Data models
│   ├── user.dart
│   ├── trip.dart
│   ├── place.dart
│   └── api_response.dart
│
├── config/                            # Configuration
│   ├── routes.dart                    # go_router setup
│   ├── theme.dart                     # App theme
│   └── env.dart                       # Environment variables
│
└── utils/                             # Utilities
    ├── constants.dart
    ├── validators.dart
    └── formatters.dart
```

## State Management (Riverpod)

### Provider Types

```dart
// 1. Provider - Immutable, never changes
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

// 2. StateProvider - Simple mutable state
final counterProvider = StateProvider<int>((ref) => 0);

// 3. FutureProvider - Async data (one-time fetch)
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTrips();
});

// 4. StateNotifierProvider - Complex state with logic
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});

// 5. StreamProvider - Streaming data (SSE, WebSocket)
final chatStreamProvider = StreamProvider.family<ChatEvent, String>((ref, sessionId) {
  final service = ref.watch(streamServiceProvider);
  return service.chatStream(sessionId);
});
```

### Provider Pattern Example

```dart
// lib/providers/trips_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../repositories/trips_repository.dart';

// Repository provider
final tripsRepositoryProvider = Provider<TripsRepository>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return TripsRepository(apiService);
});

// Trips list provider
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTrips();
});

// Single trip provider (with parameter)
final tripProvider = FutureProvider.family<Trip, String>((ref, tripId) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTripById(tripId);
});

// Create trip action (no return value, triggers refresh)
final createTripProvider = Provider<Future<void> Function(CreateTripDto)>((ref) {
  return (dto) async {
    final repository = ref.watch(tripsRepositoryProvider);
    await repository.createTrip(dto);
    ref.invalidate(tripsProvider);  // Refresh trips list
  };
});
```

### Using Providers in Widgets

```dart
// lib/screens/trips/trips_list_screen.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

class TripsListScreen extends ConsumerWidget {
  const TripsListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripsAsync = ref.watch(tripsProvider);
    
    return Scaffold(
      appBar: AppBar(title: Text('Chuyến đi của tôi')),
      body: tripsAsync.when(
        loading: () => Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Lỗi: $error')),
        data: (trips) {
          if (trips.isEmpty) {
            return EmptyTripsWidget();
          }
          return ListView.builder(
            itemCount: trips.length,
            itemBuilder: (context, index) => TripCard(trip: trips[index]),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(LucideIcons.plus),
        onPressed: () => context.push('/trips/create'),
      ),
    );
  }
}
```

## Repository Pattern

```dart
// lib/repositories/trips_repository.dart
import '../models/trip.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class TripsRepository {
  final ApiService _api;
  final StorageService _storage;
  
  TripsRepository(this._api, this._storage);
  
  // Fetch trips with caching
  Future<List<Trip>> getTrips() async {
    try {
      // Try API first
      final response = await _api.get<List>('/trips');
      final trips = response.map((json) => Trip.fromJson(json)).toList();
      
      // Cache for offline
      await _storage.saveTrips(trips);
      
      return trips;
    } catch (e) {
      // Fallback to cache on error
      final cachedTrips = await _storage.getTrips();
      if (cachedTrips != null) {
        return cachedTrips;
      }
      rethrow;
    }
  }
  
  Future<Trip> getTripById(String id) async {
    final response = await _api.get<Map<String, dynamic>>('/trips/$id');
    return Trip.fromJson(response);
  }
  
  Future<Trip> createTrip(CreateTripDto dto) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/trips',
      data: dto.toJson(),
    );
    return Trip.fromJson(response);
  }
  
  Future<void> deleteTrip(String id) async {
    await _api.delete('/trips/$id');
  }
}
```

## API Service (Dio)

```dart
// lib/services/api_service.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/env.dart';

class ApiService {
  static const String baseUrl = Env.apiUrl;
  
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
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Attach JWT token
        final token = await _storage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        // Handle 401 Unauthorized
        if (error.response?.statusCode == 401) {
          await _storage.delete(key: 'auth_token');
          // TODO: Navigate to login screen
        }
        return handler.next(error);
      },
    ));
  }
  
  Future<T> get<T>(String path, {Map<String, dynamic>? queryParams}) async {
    final response = await _dio.get(path, queryParameters: queryParams);
    return response.data as T;
  }
  
  Future<T> post<T>(String path, {dynamic data}) async {
    final response = await _dio.post(path, data: data);
    return response.data as T;
  }
  
  Future<T> put<T>(String path, {dynamic data}) async {
    final response = await _dio.put(path, data: data);
    return response.data as T;
  }
  
  Future<void> delete(String path) async {
    await _dio.delete(path);
  }
}
```

## Navigation (go_router)

```dart
// lib/config/routes.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/auth/login_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/trips/trip_detail_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/trips/:id',
      builder: (context, state) {
        final tripId = state.pathParameters['id']!;
        return TripDetailScreen(tripId: tripId);
      },
    ),
    GoRoute(
      path: '/trips/create',
      builder: (context, state) => const CreateTripScreen(),
    ),
  ],
  redirect: (context, state) {
    // Auth guard logic here
    final isLoggedIn = false; // Check from provider
    final isLoginRoute = state.matchedLocation == '/login';
    
    if (!isLoggedIn && !isLoginRoute) {
      return '/login';
    }
    return null;
  },
);

// Usage in widgets
context.push('/trips/$tripId');
context.go('/login');
context.pop();
```

## Data Models

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
    required DateTime startDate,
    required DateTime endDate,
    required double budgetPerPerson,
    required int numberOfPeople,
    List<Place>? places,
  }) = _Trip;
  
  factory Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);
}

// Generate with: flutter pub run build_runner build
```

## Error Handling

```dart
// lib/utils/error_handler.dart
import 'package:dio/dio.dart';

class ErrorHandler {
  static String getErrorMessage(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.receiveTimeout:
          return 'Kết nối timeout. Vui lòng thử lại.';
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          if (statusCode == 401) {
            return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          } else if (statusCode == 404) {
            return 'Không tìm thấy dữ liệu.';
          } else if (statusCode == 500) {
            return 'Lỗi server. Vui lòng thử lại sau.';
          }
          return error.response?.data['message'] ?? 'Đã có lỗi xảy ra.';
        default:
          return 'Không thể kết nối. Kiểm tra kết nối mạng.';
      }
    }
    return error.toString();
  }
}

// Usage in repository
try {
  final trips = await _api.get('/trips');
  return trips;
} catch (e) {
  final message = ErrorHandler.getErrorMessage(e);
  throw Exception(message);
}
```

## Environment Configuration

```dart
// lib/config/env.dart
class Env {
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3002',
  );
  
  static const bool isDevelopment = String.fromEnvironment('ENV') != 'production';
}

// Run with: flutter run --dart-define=API_URL=https://api.example.com
```

## Architecture Rules

### ✅ DO:

```dart
// 1. Screens only consume providers, no business logic
class HomeScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trips = ref.watch(tripsProvider);
    return trips.when(...);  // ✅ Good
  }
}

// 2. Business logic in repositories
class TripsRepository {
  Future<List<Trip>> getTrips() async {
    // ✅ Caching, error handling, data transformation here
  }
}

// 3. Providers connect screens to repositories
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTrips();  // ✅ Good
});

// 4. API service is dumb - just HTTP calls
class ApiService {
  Future<T> get<T>(String path) async {
    return await _dio.get(path);  // ✅ Good - no business logic
  }
}
```

### ❌ DON'T:

```dart
// 1. NO business logic in screens
class HomeScreen extends StatefulWidget {
  void _loadTrips() async {
    final response = await http.get('/trips');  // ❌ NO - use provider
    final trips = parseTrips(response);         // ❌ NO - use repository
  }
}

// 2. NO API calls in providers
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final response = await http.get('/trips');  // ❌ NO - use repository
  return parseTrips(response);
});

// 3. NO UI logic in repositories
class TripsRepository {
  void showErrorDialog(String message) {  // ❌ NO - repository shouldn't know about UI
    showDialog(...);
  }
}

// 4. NO direct API calls from widgets
class HomeScreen extends ConsumerWidget {
  void _deleteTrip(String id) {
    await http.delete('/trips/$id');  // ❌ NO - use provider/repository
  }
}
```

## Testing Pattern

```dart
// test/repositories/trips_repository_test.dart
void main() {
  late TripsRepository repository;
  late MockApiService mockApi;
  
  setUp(() {
    mockApi = MockApiService();
    repository = TripsRepository(mockApi);
  });
  
  test('getTrips returns list of trips', () async {
    // Arrange
    when(mockApi.get<List>('/trips')).thenAnswer(
      (_) async => [{'id': '1', 'destination': 'Da Nang'}],
    );
    
    // Act
    final trips = await repository.getTrips();
    
    // Assert
    expect(trips.length, 1);
    expect(trips[0].destination, 'Da Nang');
  });
}
```

## Quick Checklist

Before implementing a feature:

- [ ] Screen only uses ConsumerWidget + ref.watch()
- [ ] Business logic is in Repository
- [ ] Repository uses ApiService for HTTP
- [ ] Provider connects Screen to Repository
- [ ] Models use Freezed for immutability
- [ ] Error handling in Repository, not Screen
- [ ] No direct HTTP calls in Screens/Providers
- [ ] Navigation uses go_router (context.push/go/pop)
- [ ] Environment variables in Env class

## Common Patterns

### Loading + Error + Data

```dart
// Standard pattern for FutureProvider
final dataAsync = ref.watch(someProvider);

return dataAsync.when(
  loading: () => Center(child: CircularProgressIndicator()),
  error: (error, stack) => ErrorWidget(message: error.toString()),
  data: (data) => DataWidget(data: data),
);
```

### Refresh Data

```dart
// Invalidate provider to trigger refresh
ref.invalidate(tripsProvider);

// Or use RefreshIndicator
RefreshIndicator(
  onRefresh: () async {
    ref.invalidate(tripsProvider);
    await ref.read(tripsProvider.future);  // Wait for refresh
  },
  child: ListView(...),
)
```

### Pass Parameters to Provider

```dart
// Use .family for parameterized providers
final tripProvider = FutureProvider.family<Trip, String>((ref, tripId) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTripById(tripId);
});

// Usage
final trip = ref.watch(tripProvider('trip-123'));
```
