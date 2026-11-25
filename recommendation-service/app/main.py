from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
import unicodedata

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

PREFERENCE_KEYWORDS = {
    'nature': {'nature', 'thiên nhiên', 'lake', 'mountain', 'waterfall', 'park', 'forest', 'đồi', 'thác', 'hồ', 'vườn', 'scenic'},
    'beach': {'beach', 'biển', 'island', 'đảo', 'sea', 'coastal', 'bãi biển'},
    'culture': {'culture', 'văn hóa', 'temple', 'pagoda', 'chùa', 'đền', 'museum', 'bảo tàng', 'heritage', 'monument', 'di tích'},
    'food': {'food', 'ẩm thực', 'restaurant', 'quán', 'ăn uống', 'cuisine', 'street food', 'cafe', 'coffee', 'cà phê', 'culinary'},
    'adventure': {'adventure', 'phiêu lưu', 'hiking', 'trekking', 'climbing', 'leo núi', 'sport', 'cave', 'hang động'},
    'photography': {'photography', 'chụp ảnh', 'check-in', 'scenic', 'viewpoint', 'instagram', 'view'},
    'shopping': {'shopping', 'mua sắm', 'market', 'chợ', 'mall', 'souvenir'},
    'relax': {'relax', 'thư giãn', 'resort', 'spa', 'lake', 'park', 'peaceful', 'nghỉ dưỡng'},
    'nightlife': {'nightlife', 'bar', 'pub', 'club', 'night market', 'chợ đêm'},
    'historical': {'historical', 'lịch sử', 'history', 'di tích', 'monument', 'museum', 'palace', 'dinh', 'citadel'},
}

PROVINCE_ALIAS_MAP = {
    "ha noi": "Hanoi",
    "hanoi": "Hanoi",
    "ho chi minh": "Ho Chi Minh",
    "tp ho chi minh": "Ho Chi Minh",
    "tp. ho chi minh": "Ho Chi Minh",
    "tphcm": "Ho Chi Minh",
    "sai gon": "Ho Chi Minh",
    "saigon": "Ho Chi Minh",
    "da nang": "Da Nang",
    "danang": "Da Nang",
    "ninh binh": "Ninh Binh",
    "ninhbinh": "Ninh Binh",
    "lam dong": "Lam Dong",
    "da lat": "Lam Dong",
    "dalat": "Lam Dong",
    "lao cai": "Lao Cai",
    "sa pa": "Lao Cai",
    "sapa": "Lao Cai",
    "khanh hoa": "Khanh Hoa",
    "nha trang": "Khanh Hoa",
    "quang nam": "Quang Nam",
    "hoi an": "Quang Nam",
    "thua thien hue": "Thua Thien Hue",
    "hue": "Thua Thien Hue",
    "kien giang": "Kien Giang",
    "phu quoc": "Kien Giang",
    "quang ninh": "Quang Ninh",
    "ha long": "Quang Ninh",
}

def _normalize_dest_name(name: str) -> str:
    """Normalize destination name, removing diacritics and matching aliases to database province names"""
    if not name:
        return name
    n = name.strip()
    n_decomposed = unicodedata.normalize('NFD', n)
    n_clean = ''.join(c for c in n_decomposed if unicodedata.category(c) != 'Mn')
    n_clean = n_clean.replace('đ', 'd').replace('Đ', 'D').lower().strip()
    return PROVINCE_ALIAS_MAP.get(n_clean, n)

def _normalize_categories(categories_val) -> List[str]:
    """Normalize place categories from database formats"""
    if not categories_val:
        return []
    if isinstance(categories_val, list):
        return [str(c).strip().lower() for c in categories_val if str(c).strip()]
    if isinstance(categories_val, str):
        cleaned = categories_val.strip('{}[]"')
        return [c.strip().lower() for c in cleaned.split(',') if c.strip()]
    return []

def _calculate_preference_match(place_categories: List[str], preferences: List[str]) -> int:
    """Calculate how many explicit user preferences match the place categories"""
    if not preferences or not place_categories:
        return 0

    match_count = 0
    norm_cats = set(place_categories)

    for pref in preferences:
        pref_clean = pref.lower().strip()
        matched = False
        for cat in norm_cats:
            if pref_clean in cat or cat in pref_clean:
                matched = True
                break

        if not matched and pref_clean in PREFERENCE_KEYWORDS:
            keywords = PREFERENCE_KEYWORDS[pref_clean]
            for cat in norm_cats:
                if any(kw in cat for kw in keywords):
                    matched = True
                    break

        if matched:
            match_count += 1

    return match_count

@app.post("/recommend", response_model=RecommendationResponse)
async def recommend_places(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Generate place recommendations for a user's trip

    The recommendation flow:
    1. Filter places by destination
    2. Rank using ML model (LightFM) or popularity cold-start fallback
    3. Boost scores using explicit user preferences
    4. Filter by budget constraint (with soft penalty)
    5. Apply diversity penalty to avoid category clustering
    6. Return top K place_ids with scores
    """
    try:
        from sqlalchemy import text

        if recommendation_model.model is None:
            logger.warning("Recommendation model not pre-trained yet. Using cold-start popularity ranking.")

        # Step 1: Parse destinations (support multi-province tour planning)
        dest_list = [_normalize_dest_name(d) for d in request.destination.split(',') if d.strip()]
        if not dest_list:
            dest_list = [_normalize_dest_name(request.destination.strip())]

        candidates = []
        seen_candidate_ids = set()

        if len(dest_list) > 1:
            quota_per_dest = max(50, 400 // len(dest_list))
            for dest in dest_list:
                query_dest = text("""
                    SELECT id, name, categories, price_estimate, popularity_score,
                           latitude, longitude, province
                    FROM places
                    WHERE province ILIKE :dest_pattern OR district ILIKE :dest_pattern
                    ORDER BY popularity_score DESC
                    LIMIT :quota
                """)
                rows = db.execute(query_dest, {
                    "dest_pattern": f"%{dest}%",
                    "quota": quota_per_dest,
                }).fetchall()

                for row in rows:
                    if row[0] not in seen_candidate_ids:
                        seen_candidate_ids.add(row[0])
                        candidates.append(row)
        else:
            dest = dest_list[0]
            query = text("""
                SELECT id, name, categories, price_estimate, popularity_score,
                       latitude, longitude, province
                FROM places
                WHERE province = :destination
                LIMIT 300
            """)
            result = db.execute(query, {"destination": dest})
            candidates = result.fetchall()

            # If exact province match is empty, try case-insensitive partial match
            if not candidates:
                query_broad = text("""
                    SELECT id, name, categories, price_estimate, popularity_score,
                           latitude, longitude, province
                    FROM places
                    WHERE province ILIKE :dest_pattern OR district ILIKE :dest_pattern
                    LIMIT 300
                """)
                result = db.execute(query_broad, {"dest_pattern": f"%{dest}%"})
                candidates = result.fetchall()

        if not candidates:
            logger.warning(f"No candidate places found in database for destination: {request.destination}")
            return RecommendationResponse(place_ids=[], scores=[])

        candidate_place_ids = [row[0] for row in candidates]
        candidate_popularity = {row[0]: float(row[4] or 0.0) for row in candidates}
        candidate_details = {
            row[0]: {
                'name': row[1],
                'categories': _normalize_categories(row[2]),
                'price_estimate': row[3] or 0,
                'popularity': float(row[4] or 0.0),
            }
            for row in candidates
        }

        daily_budget = request.budget_per_person / max(1, request.days)

        # Step 2: Get predictions from model (handles warm users & cold start with multi-attribute personalization)
        predictions = recommendation_model.predict(
            user_id=request.user_id,
            candidate_place_ids=candidate_place_ids,
            candidate_popularity=candidate_popularity,
            candidate_details=candidate_details,
            trip_preferences=request.explicit_preferences,
            user_onboard_styles=request.user_preferred_styles,
            daily_budget=daily_budget,
            companion_type=request.companion_type,
        )

        # Step 3: Boost scores using explicit preferences for warm users (collaborative filtering)
        is_warm_user = (recommendation_model.model is not None and 
                        request.user_id in getattr(recommendation_model, 'user_id_mapping', {}))
        if is_warm_user and request.explicit_preferences:
            boosted_predictions = []
            for place_id, score in predictions:
                place = next((c for c in candidates if c[0] == place_id), None)
                if place:
                    cats = _normalize_categories(place[2])
                    match_count = _calculate_preference_match(cats, request.explicit_preferences)
                    boosted_score = score * (1.0 + 0.25 * match_count)
                    boosted_predictions.append((place_id, boosted_score))
                else:
                    boosted_predictions.append((place_id, score))
            predictions = boosted_predictions
            predictions.sort(key=lambda x: x[1], reverse=True)

        # Step 4: Apply business rules (realistic budget filtering)
        filtered_predictions = []
        daily_budget = request.budget_per_person / max(1, request.days)

        for place_id, score in predictions:
            place = next((c for c in candidates if c[0] == place_id), None)
            if not place:
                continue
            price = place[3] or 0

            # Single attraction within 80% daily budget: keep at full score
            if daily_budget <= 0 or price <= daily_budget * 0.8:
                filtered_predictions.append((place_id, score))
            # Slightly high price (80% - 120% daily budget): apply soft penalty
            elif price <= daily_budget * 1.2:
                filtered_predictions.append((place_id, score * 0.8))

        # Safety fallback: if budget filter was overly restrictive, fallback to all predictions
        if len(filtered_predictions) < 10 and len(predictions) > 0:
            logger.warning(
                f"Budget filter left only {len(filtered_predictions)} places for daily budget {daily_budget:,.0f} VND. Falling back to all predictions."
            )
            filtered_predictions = list(predictions)

        # Step 5: Apply diversity penalty (avoid category clustering)
        diverse_predictions = _apply_diversity_penalty(
            filtered_predictions, candidates
        )

        # Step 6: Multi-province fair representation in Top K (interleaved round-robin)
        if len(dest_list) > 1:
            place_to_dest = {}
            for c in candidates:
                p_prov = (c[7] or '').lower() if len(c) > 7 and c[7] else ''
                matched_dest = dest_list[0]
                for d in dest_list:
                    if d.lower() in p_prov:
                        matched_dest = d
                        break
                place_to_dest[c[0]] = matched_dest

            per_dest_preds = {d: [] for d in dest_list}
            for pid, score in diverse_predictions:
                d_key = place_to_dest.get(pid, dest_list[0])
                per_dest_preds[d_key].append((pid, score))

            quota = max(20, settings.top_k // len(dest_list))
            top_k_selected = []
            selected_ids = set()

            # Interleave round-robin across destinations so that any prefix slice
            # contains a balanced distribution from every selected destination
            for idx in range(quota):
                for d in dest_list:
                    if idx < len(per_dest_preds[d]):
                        item = per_dest_preds[d][idx]
                        if item[0] not in selected_ids:
                            top_k_selected.append(item)
                            selected_ids.add(item[0])

            # Fill any remaining slots to reach top_k
            for item in diverse_predictions:
                if len(top_k_selected) >= settings.top_k:
                    break
                if item[0] not in selected_ids:
                    top_k_selected.append(item)
                    selected_ids.add(item[0])

            top_k = top_k_selected
        else:
            top_k = diverse_predictions[:settings.top_k]

        place_ids = [p[0] for p in top_k]
        scores = [float(p[1]) for p in top_k]

        logger.info(f"Generated {len(place_ids)} recommendations for user {request.user_id} in {request.destination}")

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

        norm_cats = _normalize_categories(place[2])

        # Calculate penalty based on category saturation
        penalty = 0.0
        for cat in norm_cats:
            count = category_counts.get(cat, 0)
            penalty += count * 0.1  # 10% penalty per duplicate

        adjusted_score = score * (1.0 - min(penalty, 0.5))  # Max 50% penalty
        diverse_results.append((place_id, adjusted_score))

        # Update category counts
        for cat in norm_cats:
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
