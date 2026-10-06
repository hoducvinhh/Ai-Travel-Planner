# AI Travel Planner - Recommendation Service

Python-based FastAPI service for ML-powered travel recommendations using LightFM hybrid filtering.

## Features

- **Hybrid Recommendation System**: Combines Collaborative Filtering and Content-Based filtering using LightFM
- **Feature Engineering**: Time decay, interaction weighting, and contextual features
- **Cold Start Handling**: Falls back to content-based recommendations for new users
- **Business Rules**: Budget constraints and diversity penalties

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/travel_planner
HOST=0.0.0.0
PORT=8000
LAMBDA_DECAY=0.05
TOP_K=50
```

### 3. Generate Mock Data

```bash
python generate_mock_data.py
```

This generates (saved in `datasets/`):
- `datasets/mock_users.json` - 400 synthetic users with diverse personas
- `datasets/mock_places.json` - 200+ places across Vietnam
- `datasets/mock_interactions.json` - 15,000 simulated user interactions

### 4. Load Data into Database

Make sure PostgreSQL is running and the database schema is migrated, then:

```bash
python load_mock_data.py
```

### 5. Train the Model

```bash
# Start the service
uvicorn app.main:app --reload

# In another terminal, trigger training
curl -X POST http://localhost:8000/train
```

### 6. Test Recommendations

```bash
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_ID_HERE",
    "destination": "Lam Dong",
    "budget_per_person": 5000000,
    "days": 3,
    "group_size": 2,
    "month_of_year": 10,
    "explicit_preferences": ["Nature", "Adventure"]
  }'
```

## API Endpoints

### `POST /recommend`

Generate recommendations for a user's trip.

**Request Body:**
```json
{
  "user_id": "string",
  "destination": "string",
  "budget_per_person": 5000000,
  "days": 3,
  "group_size": 2,
  "month_of_year": 10,
  "explicit_preferences": ["Nature", "Adventure"]
}
```

**Response:**
```json
{
  "place_ids": ["uuid1", "uuid2", ...],
  "scores": [0.95, 0.87, ...]
}
```

### `POST /train`

Trigger model training (should be called periodically or after significant data updates).

### `GET /health`

Health check endpoint.

## Architecture

```
┌─────────────────┐
│   NestJS API    │
│  (Main Backend) │
└────────┬────────┘
         │ HTTP Request
         ▼
┌─────────────────────────┐
│  Recommendation Service │
│     (FastAPI/Python)    │
├─────────────────────────┤
│  • Feature Engineering  │
│  • LightFM Model        │
│  • Business Rules       │
└────────┬────────────────┘
         │ SQL Query
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

## Model Details

### LightFM Hybrid Filtering

- **Loss Function**: WARP (Weighted Approximate-Rank Pairwise)
- **Components**: 64 latent factors
- **Features Used**:
  - User: Preferred styles, budget level
  - Place: Categories, price bucket, popularity bucket
  - Context: Trip budget, group size, travel month

### Interaction Weighting

| Event Type | Base Weight |
|------------|-------------|
| VIEW_DETAIL | 1.0 |
| SHARE | 3.0 |
| LIKE | 5.0 |
| SAVE | 5.0 |
| REMOVE_SAVE | -2.0 |
| RATE | (rating - 3) × 2 |

### Time Decay

Exponential decay: `W_final = W_base × e^(-λ × days)`

Default λ = 0.05

## Docker Deployment

```bash
docker build -t ai-travel-planner-recommendation .
docker run -p 8000:8000 --env-file .env ai-travel-planner-recommendation
```

## Development

### Project Structure

```
recommendation-service/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── schemas.py           # Pydantic models
│   ├── model.py             # LightFM recommendation model
│   └── feature_engineering.py  # Feature processing
├── generate_mock_data.py    # Data generation script
├── load_mock_data.py        # Database loading script
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Next Steps

1. Integrate with NestJS backend
2. Add user authentication
3. Implement recommendation caching
4. Add A/B testing framework
5. Monitor model performance metrics
