# API Integration Guide

## Base Configuration

### Environment Setup

Edit `lib/config/env.dart`:

```dart
class Env {
  // Development
  static const String apiBaseUrl = 'http://localhost:3002';
  
  // Production (update when deploying)
  // static const String apiBaseUrl = 'https://api.travelplanner.com';
  
  static const Duration requestTimeout = Duration(seconds: 30);
  static const Duration connectTimeout = Duration(seconds: 10);
}
```

## API Service

The app uses Dio for HTTP requests with automatic token handling and error interceptors.

### API Client Features

- ✅ Automatic authentication token injection
- ✅ Request/response logging
- ✅ Error handling and retry logic
- ✅ Timeout configuration
- ✅ Request cancellation support

### Usage Example

```dart
final response = await apiService.get('/trips');
final data = response.data;
```

## Authentication Endpoints

### Login
```dart
POST /auth/login

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Register
```dart
POST /auth/register

Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Get Profile
```dart
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

## Trips Endpoints

### List Trips
```dart
GET /trips
Authorization: Bearer <token>

Response:
[
  {
    "id": "trip_123",
    "destination": "Hà Nội",
    "startDate": "2024-03-15",
    "endDate": "2024-03-20",
    "budget": 5000000,
    "imageUrl": "https://example.com/hanoi.jpg",
    "travelersCount": 2,
    "preferences": ["culture", "food"],
    "description": "Trip to Hanoi"
  }
]
```

### Get Trip Details
```dart
GET /trips/:id
Authorization: Bearer <token>

Response:
{
  "id": "trip_123",
  "destination": "Hà Nội",
  "startDate": "2024-03-15",
  "endDate": "2024-03-20",
  "budget": 5000000,
  "imageUrl": "https://example.com/hanoi.jpg",
  "travelersCount": 2,
  "preferences": ["culture", "food"],
  "description": "Trip to Hanoi",
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "id": "place_1",
          "name": "Hồ Hoàn Kiếm",
          "time": "09:00"
        }
      ]
    }
  ]
}
```

### Create Trip
```dart
POST /trips
Authorization: Bearer <token>

Request:
{
  "destination": "Đà Nẵng",
  "startDate": "2024-04-01",
  "endDate": "2024-04-05",
  "budget": 3000000,
  "travelersCount": 2,
  "preferences": ["beach", "food"]
}

Response:
{
  "id": "trip_456",
  "destination": "Đà Nẵng",
  "startDate": "2024-04-01",
  "endDate": "2024-04-05",
  "budget": 3000000,
  "travelersCount": 2,
  "preferences": ["beach", "food"],
  "createdAt": "2024-03-01T10:00:00Z"
}
```

### Update Trip
```dart
PUT /trips/:id
Authorization: Bearer <token>

Request:
{
  "destination": "Đà Nẵng - Updated",
  "budget": 3500000
}

Response:
{
  "id": "trip_456",
  "destination": "Đà Nẵng - Updated",
  "budget": 3500000,
  "updatedAt": "2024-03-02T10:00:00Z"
}
```

### Delete Trip
```dart
DELETE /trips/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

## Places Endpoints

### List Places
```dart
GET /places?province=Hà Nội&category=restaurant&budgetLevel=medium
Authorization: Bearer <token>

Query Parameters:
- province: string (optional)
- category: string (optional) - restaurant, hotel, attraction, etc.
- budgetLevel: string (optional) - low, medium, high
- page: number (optional, default: 1)
- limit: number (optional, default: 20)

Response:
{
  "data": [
    {
      "id": "place_123",
      "name": "Hồ Hoàn Kiếm",
      "province": "Hà Nội",
      "latitude": 21.028511,
      "longitude": 105.804817,
      "category": "attraction",
      "description": "Beautiful lake in downtown Hanoi",
      "imageUrl": "https://example.com/hoan-kiem.jpg",
      "rating": 4.5,
      "reviewCount": 1234,
      "budgetLevel": "low",
      "district": "Hoàn Kiếm",
      "amenities": ["parking", "restroom"],
      "openingHours": "05:00 - 22:00",
      "phone": "+84-24-xxx-xxxx",
      "website": "https://example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Get Place Details
```dart
GET /places/:id
Authorization: Bearer <token>

Response:
{
  "id": "place_123",
  "name": "Hồ Hoàn Kiếm",
  "province": "Hà Nội",
  "latitude": 21.028511,
  "longitude": 105.804817,
  "category": "attraction",
  "description": "Beautiful lake in downtown Hanoi",
  "imageUrl": "https://example.com/hoan-kiem.jpg",
  "rating": 4.5,
  "reviewCount": 1234,
  "budgetLevel": "low",
  "amenities": ["parking", "restroom"],
  "reviews": [
    {
      "id": "review_1",
      "rating": 5,
      "comment": "Amazing place!",
      "userName": "John Doe",
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ]
}
```

### Track Interaction
```dart
POST /places/:id/interactions
Authorization: Bearer <token>

Request:
{
  "type": "VIEW" // or "LIKE", "SAVE", "RATE"
}

Response:
{
  "success": true
}
```

## Chat Endpoint

### Send Message (SSE Stream)
```dart
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json
Accept: text/event-stream

Request:
{
  "message": "Tell me about Hanoi",
  "sessionId": "session_123" // optional, for continuing conversation
}

Response (Server-Sent Events):
event: session_info
data: {"sessionId":"session_123"}

event: sources
data: [{"title":"Source 1","url":"https://example.com"}]

event: token
data: {"token":"Hello"}

event: token
data: {"token":" there!"}

event: done
data: {"message":"Complete response text"}
```

### SSE Implementation

The app uses the `stream_service.dart` to handle SSE:

```dart
final streamService = StreamService();

await for (final event in streamService.streamChat(
  message: 'Tell me about Hanoi',
  sessionId: currentSessionId,
  token: authToken,
)) {
  switch (event['type']) {
    case 'session_info':
      sessionId = event['data']['sessionId'];
      break;
    case 'sources':
      sources = event['data'];
      break;
    case 'token':
      accumulatedText += event['data']['token'];
      break;
    case 'done':
      finalMessage = event['data']['message'];
      break;
  }
}
```

## Community Endpoints

### List Posts
```dart
GET /community/posts?page=1&limit=20
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": "post_123",
      "userId": "user_123",
      "userName": "John Doe",
      "userAvatar": "https://example.com/avatar.jpg",
      "content": "Just visited Hanoi!",
      "imageUrls": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "likesCount": 42,
      "commentsCount": 5,
      "isLiked": false,
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Create Post
```dart
POST /community/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request:
{
  "content": "Amazing trip to Hanoi!",
  "images": [<File>, <File>] // max 6 images
}

Response:
{
  "id": "post_456",
  "content": "Amazing trip to Hanoi!",
  "imageUrls": [
    "https://example.com/uploaded1.jpg",
    "https://example.com/uploaded2.jpg"
  ],
  "createdAt": "2024-03-01T10:00:00Z"
}
```

### Get Comments
```dart
GET /community/posts/:postId/comments
Authorization: Bearer <token>

Response:
[
  {
    "id": "comment_123",
    "postId": "post_123",
    "userId": "user_456",
    "userName": "Jane Smith",
    "userAvatar": "https://example.com/avatar2.jpg",
    "content": "Great photos!",
    "likesCount": 3,
    "isLiked": false,
    "createdAt": "2024-03-01T11:00:00Z"
  }
]
```

### Add Comment
```dart
POST /community/posts/:postId/comments
Authorization: Bearer <token>

Request:
{
  "content": "Nice post!"
}

Response:
{
  "id": "comment_789",
  "content": "Nice post!",
  "createdAt": "2024-03-01T12:00:00Z"
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email"
    }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401) - Invalid or missing token
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid request data
- `SERVER_ERROR` (500) - Internal server error

### Error Handling in App

```dart
try {
  final response = await apiService.get('/trips');
  return response.data;
} on DioException catch (e) {
  if (e.response?.statusCode == 401) {
    // Handle unauthorized - logout user
    await authRepository.logout();
    throw Exception('Session expired');
  } else if (e.response?.statusCode == 404) {
    throw Exception('Trip not found');
  } else {
    throw Exception('Failed to load trips: ${e.message}');
  }
}
```

## Rate Limiting

The API implements rate limiting:
- **General endpoints:** 100 requests per minute
- **Chat endpoint:** 10 requests per minute
- **Upload endpoints:** 20 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Testing API Integration

### Mock Server Setup

For testing without backend:

```dart
// test/mocks/mock_api.dart
class MockApiService extends Mock implements ApiService {
  @override
  Future<Response> get(String path) async {
    if (path == '/trips') {
      return Response(
        data: [{'id': '1', 'destination': 'Hanoi'}],
        statusCode: 200,
        requestOptions: RequestOptions(path: path),
      );
    }
    throw Exception('Not mocked');
  }
}
```

### Integration Testing

```bash
# Start backend
cd backend
npm run dev

# Run integration tests
cd mobile
flutter test integration_test/
```

## API Versioning

Currently using API v1. Future versions will use URL versioning:

```
/v1/trips  (current)
/v2/trips  (future)
```

## Webhooks (Future)

The app will support webhooks for real-time updates:
- Trip status changes
- New comments on posts
- Booking confirmations

---

**Last Updated:** 2026-10-23  
**API Version:** v1  
**Base URL:** http://localhost:3002
