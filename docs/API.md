# API Documentation - AI Travel Planner

## Base URL
```
http://localhost:3000
```

## Authentication
Currently not implemented. Will be added in Phase 2.

---

## Trips API

### Create Trip & Generate Itinerary

**Endpoint:** `POST /trips`

**Description:** Creates a new trip and generates a personalized itinerary using ML recommendations and LLM planning.

**Request Body:**
```json
{
  "userId": "uuid",
  "destination": "Lam Dong",
  "startDate": "2026-11-01T00:00:00.000Z",
  "endDate": "2026-11-04T00:00:00.000Z",
  "budgetPerPerson": 5000000,
  "groupSize": 2,
  "preferences": ["Nature", "Adventure", "Photography"]
}
```

**Response:** `201 Created`
```json
{
  "id": "trip-uuid",
  "userId": "user-uuid",
  "destination": "Lam Dong",
  "startDate": "2026-11-01T00:00:00.000Z",
  "endDate": "2026-11-04T00:00:00.000Z",
  "budgetPerPerson": 5000000,
  "groupSize": 2,
  "status": "GENERATED",
  "itinerary": {
    "days": [
      {
        "dayNumber": 1,
        "date": "Day 1",
        "places": [
          {
            "placeId": "place-uuid",
            "name": "Hồ Xuân Hương",
            "description": "Beautiful lake in the heart of Da Lat",
            "categories": ["Nature", "Lake", "Scenic"],
            "estimatedTime": "2 hours",
            "orderInDay": 1,
            "latitude": 11.9404,
            "longitude": 108.4380,
            "priceEstimate": 0
          }
        ],
        "notes": "Start your day with scenic views"
      }
    ],
    "summary": "3-day nature and adventure trip in Da Lat",
    "totalEstimatedCost": 1500000
  },
  "createdAt": "2026-10-02T07:44:11.147Z",
  "updatedAt": "2026-10-02T07:44:11.147Z"
}
```

### Get Trip by ID

**Endpoint:** `GET /trips/:id`

**Response:** `200 OK`
```json
{
  "id": "trip-uuid",
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "destination": "Lam Dong",
  "startDate": "2026-11-01T00:00:00.000Z",
  "endDate": "2026-11-04T00:00:00.000Z",
  "budgetPerPerson": 5000000,
  "groupSize": 2,
  "status": "GENERATED",
  "itinerary": { /* ... */ },
  "places": [
    {
      "id": "trip-place-uuid",
      "tripId": "trip-uuid",
      "placeId": "place-uuid",
      "dayNumber": 1,
      "orderInDay": 1,
      "notes": "Beautiful lake",
      "place": { /* place details */ }
    }
  ],
  "createdAt": "2026-10-02T07:44:11.147Z",
  "updatedAt": "2026-10-02T07:44:11.147Z"
}
```

### Get User Trips

**Endpoint:** `GET /trips?userId={userId}`

**Query Parameters:**
- `userId` (required): User UUID

**Response:** `200 OK`
```json
[
  {
    "id": "trip-uuid",
    "destination": "Lam Dong",
    "startDate": "2026-11-01T00:00:00.000Z",
    "endDate": "2026-11-04T00:00:00.000Z",
    "status": "GENERATED",
    "places": [ /* ... */ ]
  }
]
```

### Update Trip Status

**Endpoint:** `PATCH /trips/:id/status`

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Status Values:**
- `DRAFT` - Initial state
- `GENERATED` - Itinerary generated
- `CONFIRMED` - User confirmed
- `COMPLETED` - Trip finished
- `CANCELLED` - Cancelled

**Response:** `200 OK`

### Delete Trip

**Endpoint:** `DELETE /trips/:id`

**Response:** `204 No Content`

---

## Interactions API

### Track User Interaction

**Endpoint:** `POST /interactions`

**Description:** Track user interactions with places for ML training.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "placeId": "place-uuid",
  "eventType": "LIKE",
  "sessionId": "session-uuid",
  "ratingValue": 4.5
}
```

**Event Types:**
- `VIEW_DETAIL` - User viewed place details (weight: 1.0)
- `LIKE` - User liked the place (weight: 5.0)
- `SAVE` - User saved for later (weight: 5.0)
- `REMOVE_SAVE` - User removed from saved (weight: -2.0)
- `RATE` - User rated the place (weight: (rating-3)*2)
- `SHARE` - User shared the place (weight: 3.0)

**Response:** `201 Created`
```json
{
  "id": "interaction-uuid",
  "userId": "user-uuid",
  "placeId": "place-uuid",
  "eventType": "LIKE",
  "sessionId": "session-uuid",
  "ratingValue": null,
  "createdAt": "2026-10-02T07:44:11.147Z"
}
```

### Get User Interactions

**Endpoint:** `GET /interactions/user/:userId`

**Query Parameters:**
- `placeId` (optional): Filter by specific place

**Response:** `200 OK`
```json
[
  {
    "id": "interaction-uuid",
    "userId": "user-uuid",
    "placeId": "place-uuid",
    "eventType": "LIKE",
    "createdAt": "2026-10-02T07:44:11.147Z",
    "place": {
      "id": "place-uuid",
      "name": "Hồ Xuân Hương",
      "categories": ["Nature", "Lake"]
    }
  }
]
```

### Get User Saved Places

**Endpoint:** `GET /interactions/user/:userId/saved`

**Response:** `200 OK`
```json
[
  {
    "id": "place-uuid",
    "name": "Hồ Xuân Hương",
    "description": "Beautiful lake",
    "categories": ["Nature", "Lake"],
    "latitude": 11.9404,
    "longitude": 108.4380,
    "priceEstimate": 0,
    "popularityScore": 150.5
  }
]
```

### Get User Liked Places

**Endpoint:** `GET /interactions/user/:userId/liked`

**Response:** Same format as saved places

### Get Place Ratings

**Endpoint:** `GET /interactions/place/:placeId/ratings`

**Response:** `200 OK`
```json
{
  "averageRating": 4.3,
  "totalRatings": 25,
  "ratings": [
    {
      "ratingValue": 5.0,
      "userId": "user-uuid",
      "createdAt": "2026-10-02T07:44:11.147Z"
    }
  ]
}
```

### Get Place Interactions

**Endpoint:** `GET /interactions/place/:placeId`

**Response:** `200 OK`
```json
[
  {
    "id": "interaction-uuid",
    "userId": "user-uuid",
    "placeId": "place-uuid",
    "eventType": "VIEW_DETAIL",
    "createdAt": "2026-10-02T07:44:11.147Z",
    "user": {
      "id": "user-uuid",
      "name": "John Doe"
    }
  }
]
```

### Get User Interaction Stats

**Endpoint:** `GET /interactions/user/:userId/stats`

**Response:** `200 OK`
```json
{
  "VIEW_DETAIL": 45,
  "LIKE": 12,
  "SAVE": 8,
  "RATE": 5,
  "SHARE": 3
}
```

---

## Recommendations API

### Get Recommendations

**Endpoint:** `POST /recommendations`

**Description:** Get ML-powered place recommendations for a trip.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "destination": "Lam Dong",
  "budgetPerPerson": 5000000,
  "days": 3,
  "groupSize": 2,
  "monthOfYear": 11,
  "explicitPreferences": ["Nature", "Adventure"]
}
```

**Response:** `200 OK`
```json
{
  "placeIds": [
    "place-uuid-1",
    "place-uuid-2",
    "place-uuid-3"
  ],
  "scores": [
    0.95,
    0.87,
    0.82
  ]
}
```

### Train Recommendation Model

**Endpoint:** `POST /recommendations/train`

**Description:** Trigger ML model training. Should be called periodically or after significant data updates.

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Model trained successfully",
  "stats": {
    "users": 400,
    "places": 200,
    "interactions": 15000
  }
}
```

### Check Recommendation Service Health

**Endpoint:** `GET /recommendations/health`

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "modelStatus": "loaded"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Trip with ID xxx not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

### 503 Service Unavailable
```json
{
  "statusCode": 503,
  "message": "Recommendation model not loaded. Please train the model first.",
  "error": "Service Unavailable"
}
```

---

## Rate Limits

Currently not implemented. Will be added in production.

---

## Webhooks

Currently not implemented. Future feature for real-time updates.

---

## Testing Examples

### Complete Flow Example

```bash
# 1. Track some interactions
curl -X POST http://localhost:3000/interactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "placeId": "place-456",
    "eventType": "VIEW_DETAIL"
  }'

curl -X POST http://localhost:3000/interactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "placeId": "place-456",
    "eventType": "LIKE"
  }'

# 2. Create a trip
curl -X POST http://localhost:3000/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "destination": "Lam Dong",
    "startDate": "2026-11-01",
    "endDate": "2026-11-04",
    "budgetPerPerson": 5000000,
    "groupSize": 2,
    "preferences": ["Nature", "Adventure"]
  }'

# 3. Get user's saved places
curl http://localhost:3000/interactions/user/user-123/saved

# 4. Get user's trips
curl http://localhost:3000/trips?userId=user-123
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are used for all IDs
- Budget amounts are in VND (Vietnamese Dong)
- Coordinates use decimal degrees format
- The recommendation system requires at least 100 interactions to produce good results
