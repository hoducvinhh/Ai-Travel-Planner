from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database import get_db
from app.schemas import RecommendationRequest, RecommendationResponse
from app.model import RecommendationModel
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Travel Planner - Recommendation Service")

# Global model instance
recommendation_model = RecommendationModel()

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    try:
        recommendation_model.load_model()
        logger.info("Model loaded successfully")
    except FileNotFoundError:
        logger.warning("No pre-trained model found. Model needs to be trained first.")
    except Exception as e:
        logger.error(f"Error loading model: {e}")

@app.get("/")
async def root():
    return {"message": "AI Travel Planner Recommendation Service", "status": "running"}

@app.get("/health")
async def health_check():
    model_status = "loaded" if recommendation_model.model is not None else "not_loaded"
    return {
        "status": "healthy",
        "model_status": model_status
    }

@app.post("/recommend", response_model=RecommendationResponse)
async def recommend_places(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Generate place recommendations for a user's trip

    The recommendation flow:
    1. Filter places by destination (done by NestJS before calling this)
    2. Rank using ML model (LightFM hybrid filtering)
    3. Return top K place_ids with scores
    """
    try:
        if recommendation_model.model is None:
            raise HTTPException(
                status_code=503,
                detail="Recommendation model not loaded. Please train the model first."
            )

        # Get candidate places from request or query database
        # In production, NestJS will pass filtered candidate_place_ids
        # For now, we'll query from database
        from sqlalchemy import text

        query = text("""
            SELECT id, name, categories, price_estimate, popularity_score,
                   latitude, longitude
            FROM places
            WHERE province = :destination
            LIMIT 300
        """)

        result = db.execute(query, {"destination": request.destination})
        candidates = result.fetchall()

        if not candidates:
            return RecommendationResponse(place_ids=[], scores=[])

        candidate_place_ids = [row[0] for row in candidates]

        # Get predictions from model
        predictions = recommendation_model.predict(
            user_id=request.user_id,
            candidate_place_ids=candidate_place_ids
        )

        # Apply business rules (budget filtering)
        filtered_predictions = []
        daily_budget = request.budget_per_person / request.days

        for place_id, score in predictions:
            # Get place details
            place = next((c for c in candidates if c[0] == place_id), None)
            if place and place[3] <= daily_budget * 0.3:  # price_estimate <= 30% daily budget
                filtered_predictions.append((place_id, score))

        # Apply diversity penalty (avoid too many same categories)
        diverse_predictions = _apply_diversity_penalty(
            filtered_predictions, candidates
        )

        # Get top K
        top_k = diverse_predictions[:settings.top_k]

        place_ids = [p[0] for p in top_k]
        scores = [float(p[1]) for p in top_k]

        logger.info(f"Generated {len(place_ids)} recommendations for user {request.user_id}")

        return RecommendationResponse(
            place_ids=place_ids,
            scores=scores
        )

    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def _apply_diversity_penalty(predictions: List[tuple], candidates: List) -> List[tuple]:
    """Apply penalty to avoid category clustering"""
    category_counts = {}
    diverse_results = []

    for place_id, score in predictions:
        place = next((c for c in candidates if c[0] == place_id), None)
        if not place:
            continue

        categories = place[2]  # categories column

        # Calculate penalty based on category saturation
        penalty = 0.0
        for cat in categories:
            count = category_counts.get(cat, 0)
            penalty += count * 0.1  # 10% penalty per duplicate

        adjusted_score = score * (1 - min(penalty, 0.5))  # Max 50% penalty
        diverse_results.append((place_id, adjusted_score))

        # Update category counts
        for cat in categories:
            category_counts[cat] = category_counts.get(cat, 0) + 1

    # Re-sort by adjusted scores
    diverse_results.sort(key=lambda x: x[1], reverse=True)
    return diverse_results

@app.post("/train")
async def train_model(db: Session = Depends(get_db)):
    """
    Train the recommendation model
    This endpoint should be called periodically or triggered by data updates
    """
    try:
        logger.info("Starting model training...")

        from sqlalchemy import text

        # Fetch users
        users_query = text("SELECT id, email, preferred_styles, budget_level FROM users")
        users_result = db.execute(users_query)
        users = [
            {
                'id': row[0],
                'email': row[1],
                'preferred_styles': row[2] or [],
                'budget_level': row[3]
            }
            for row in users_result
        ]

        # Fetch places
        places_query = text("""
            SELECT id, name, categories, price_estimate, popularity_score,
                   latitude, longitude
            FROM places
        """)
        places_result = db.execute(places_query)
        places = [
            {
                'id': row[0],
                'name': row[1],
                'categories': row[2] or [],
                'price_estimate': row[3],
                'popularity_score': row[4],
                'latitude': row[5],
                'longitude': row[6]
            }
            for row in places_result
        ]

        # Fetch interactions
        interactions_query = text("""
            SELECT user_id, place_id, event_type, rating_value, created_at
            FROM user_interaction_events
            ORDER BY created_at DESC
        """)
        interactions_result = db.execute(interactions_query)
        interactions = [
            {
                'user_id': row[0],
                'place_id': row[1],
                'event_type': row[2],
                'rating_value': row[3],
                'created_at': row[4]
            }
            for row in interactions_result
        ]

        if not users or not places or not interactions:
            raise HTTPException(
                status_code=400,
                detail="Insufficient data for training. Need users, places, and interactions."
            )

        logger.info(f"Training with {len(users)} users, {len(places)} places, {len(interactions)} interactions")

        # Prepare dataset
        interactions_matrix, weights, user_features, item_features = \
            recommendation_model.prepare_dataset(users, places, interactions)

        # Train model
        recommendation_model.train(
            interactions_matrix, weights, user_features, item_features, epochs=30
        )

        # Save model
        recommendation_model.save_model()

        logger.info("Model training completed and saved")

        return {
            "status": "success",
            "message": "Model trained successfully",
            "stats": {
                "users": len(users),
                "places": len(places),
                "interactions": len(interactions)
            }
        }

    except Exception as e:
        logger.error(f"Error training model: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
