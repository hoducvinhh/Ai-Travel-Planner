"""
Data generation script for AI Travel Planner

This script generates synthetic data for training the recommendation model:
1. Real place data (scraped or LLM-generated based on real locations)
2. Synthetic user profiles (LLM-generated with diverse personas)
3. Rule-based interaction simulation (to avoid learning LLM bias)
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict
import numpy as np

# Seed for reproducibility
random.seed(42)
np.random.seed(42)

# Vietnamese tourism places (real locations)
VIETNAM_PLACES = [
    # Da Lat
    {"name": "Hồ Xuân Hương", "province": "Lam Dong", "categories": ["Nature", "Lake", "Scenic"], "price": 0, "lat": 11.9404, "lon": 108.4380},
    {"name": "Thác Datanla", "province": "Lam Dong", "categories": ["Nature", "Waterfall", "Adventure"], "price": 50000, "lat": 11.9094, "lon": 108.4583},
    {"name": "Đồi Chè Cầu Đất", "province": "Lam Dong", "categories": ["Nature", "Tea Plantation", "Photography"], "price": 30000, "lat": 11.9738, "lon": 108.4194},
    {"name": "Thiền Viện Trúc Lâm", "province": "Lam Dong", "categories": ["Religious", "Temple", "Culture"], "price": 0, "lat": 11.9683, "lon": 108.4511},
    {"name": "Ga Đà Lạt", "province": "Lam Dong", "categories": ["Historical", "Architecture", "Photo Spot"], "price": 0, "lat": 11.9404, "lon": 108.4419},
    {"name": "Crazy House", "province": "Lam Dong", "categories": ["Architecture", "Art", "Unique"], "price": 50000, "lat": 11.9475, "lon": 108.4222},
    {"name": "Valley of Love", "province": "Lam Dong", "categories": ["Nature", "Garden", "Romantic"], "price": 40000, "lat": 11.9658, "lon": 108.4142},
    {"name": "Cà phê Mê Linh", "province": "Lam Dong", "categories": ["Cafe", "View", "Coffee"], "price": 50000, "lat": 11.9404, "lon": 108.4419},

    # Hanoi
    {"name": "Hồ Hoàn Kiếm", "province": "Hanoi", "categories": ["Lake", "Historical", "Cultural"], "price": 0, "lat": 21.0285, "lon": 105.8542},
    {"name": "Văn Miếu Quốc Tử Giám", "province": "Hanoi", "categories": ["Historical", "Temple", "Education"], "price": 30000, "lat": 21.0277, "lon": 105.8355},
    {"name": "Chợ Đồng Xuân", "province": "Hanoi", "categories": ["Market", "Shopping", "Local"], "price": 0, "lat": 21.0367, "lon": 105.8481},
    {"name": "Bảo Tàng Hồ Chí Minh", "province": "Hanoi", "categories": ["Museum", "Historical", "Culture"], "price": 25000, "lat": 21.0364, "lon": 105.8345},
    {"name": "Phố Cổ Hà Nội", "province": "Hanoi", "categories": ["Shopping", "Food", "Culture"], "price": 0, "lat": 21.0333, "lon": 105.8500},

    # Ho Chi Minh
    {"name": "Dinh Độc Lập", "province": "Ho Chi Minh", "categories": ["Historical", "Museum", "Architecture"], "price": 40000, "lat": 10.7769, "lon": 106.6955},
    {"name": "Chợ Bến Thành", "province": "Ho Chi Minh", "categories": ["Market", "Shopping", "Food"], "price": 0, "lat": 10.7720, "lon": 106.6981},
    {"name": "Nhà Thờ Đức Bà", "province": "Ho Chi Minh", "categories": ["Religious", "Architecture", "Historical"], "price": 0, "lat": 10.7797, "lon": 106.6990},
    {"name": "Bảo Tàng Chứng Tích Chiến Tranh", "province": "Ho Chi Minh", "categories": ["Museum", "Historical", "Education"], "price": 40000, "lat": 10.7794, "lon": 106.6918},
    {"name": "Phố Đi Bộ Nguyễn Huệ", "province": "Ho Chi Minh", "categories": ["Entertainment", "Walking", "Urban"], "price": 0, "lat": 10.7741, "lon": 106.7021},
]

# User personas for diversity
USER_PERSONAS = [
    {
        "type": "Nature Lover",
        "preferred_styles": ["Nature", "Scenic", "Photography", "Hiking"],
        "budget_level": "medium",
        "preferences": {
            "Nature": 0.9, "Waterfall": 0.8, "Mountain": 0.85, "Lake": 0.8,
            "Temple": 0.3, "Shopping": 0.2, "Museum": 0.4
        }
    },
    {
        "type": "Budget Backpacker",
        "preferred_styles": ["Local", "Street Food", "Culture", "Free Activities"],
        "budget_level": "low",
        "preferences": {
            "Market": 0.9, "Food": 0.9, "Free Activities": 0.9, "Local": 0.85,
            "Luxury": 0.1, "Expensive": 0.2
        }
    },
    {
        "type": "Luxury Traveler",
        "preferred_styles": ["Fine Dining", "Spa", "Luxury", "Comfort"],
        "budget_level": "high",
        "preferences": {
            "Luxury": 0.9, "Fine Dining": 0.85, "Spa": 0.8, "Comfort": 0.9,
            "Budget": 0.1, "Backpacking": 0.1
        }
    },
    {
        "type": "Cultural Explorer",
        "preferred_styles": ["Historical", "Museum", "Temple", "Culture"],
        "budget_level": "medium",
        "preferences": {
            "Historical": 0.9, "Museum": 0.85, "Temple": 0.9, "Culture": 0.9,
            "Shopping": 0.3, "Nature": 0.5
        }
    },
    {
        "type": "Family Traveler",
        "preferred_styles": ["Family-Friendly", "Safe", "Educational", "Fun"],
        "budget_level": "medium",
        "preferences": {
            "Family-Friendly": 0.9, "Educational": 0.8, "Safe": 0.9, "Park": 0.7,
            "Nightlife": 0.1, "Adventure": 0.4
        }
    },
    {
        "type": "Adventure Seeker",
        "preferred_styles": ["Adventure", "Extreme", "Outdoor", "Sports"],
        "budget_level": "medium",
        "preferences": {
            "Adventure": 0.9, "Extreme": 0.8, "Outdoor": 0.85, "Sports": 0.8,
            "Relaxing": 0.2, "Museum": 0.3
        }
    },
    {
        "type": "Food Enthusiast",
        "preferred_styles": ["Food", "Restaurant", "Local Cuisine", "Street Food"],
        "budget_level": "medium",
        "preferences": {
            "Food": 0.95, "Restaurant": 0.9, "Local Cuisine": 0.9, "Market": 0.85,
            "Historical": 0.4, "Nature": 0.3
        }
    },
]

def generate_users(num_users: int = 400) -> List[Dict]:
    """Generate synthetic user profiles"""
    users = []

    for i in range(num_users):
        # Randomly select persona
        persona = random.choice(USER_PERSONAS)

        user = {
            "id": str(uuid.uuid4()),
            "email": f"user{i}@example.com",
            "name": f"User {i}",
            "password": "hashed_password_here",
            "preferred_styles": persona["preferred_styles"],
            "budget_level": persona["budget_level"],
            "persona_type": persona["type"],
            "persona_preferences": persona["preferences"]
        }
        users.append(user)

    return users

def simulate_interactions(users: List[Dict], places: List[Dict],
                         num_interactions: int = 10000) -> List[Dict]:
    """
    Rule-based interaction simulator (NOT LLM-generated)
    This avoids the model learning LLM bias
    """
    interactions = []
    event_types = ['VIEW_DETAIL', 'LIKE', 'SAVE', 'RATE', 'SHARE']

    for _ in range(num_interactions):
        user = random.choice(users)
        place = random.choice(places)

        # Calculate affinity score based on user persona and place categories
        affinity = calculate_affinity(user, place)

        # Add noise (15% random exploration)
        if random.random() < 0.15:
            affinity = random.uniform(0.3, 0.7)

        # Decide if user interacts based on affinity
        if random.random() < affinity:
            event_type = random.choices(
                event_types,
                weights=[0.5, 0.2, 0.15, 0.1, 0.05]  # VIEW most common
            )[0]

            interaction = {
                "id": str(uuid.uuid4()),
                "user_id": user["id"],
                "place_id": place["id"],
                "session_id": str(uuid.uuid4()),
                "event_type": event_type,
                "rating_value": None,
                "created_at": generate_random_date()
            }

            # Add rating value if RATE event
            if event_type == "RATE":
                # Higher affinity = higher rating (with noise)
                base_rating = affinity * 5
                noise = random.gauss(0, 0.5)
                rating = max(1, min(5, base_rating + noise))
                interaction["rating_value"] = round(rating, 1)

            interactions.append(interaction)

    return interactions

def calculate_affinity(user: Dict, place: Dict) -> float:
    """Calculate user-place affinity based on persona preferences"""
    persona_prefs = user["persona_preferences"]
    place_categories = place["categories"]

    # Calculate average preference score for place categories
    scores = []
    for category in place_categories:
        score = persona_prefs.get(category, 0.5)  # Default 0.5 if not in preferences
        scores.append(score)

    if scores:
        base_affinity = sum(scores) / len(scores)
    else:
        base_affinity = 0.5

    # Budget consideration
    user_budget_level = user["budget_level"]
    place_price = place["price"]

    if user_budget_level == "low" and place_price > 100000:
        base_affinity *= 0.5
    elif user_budget_level == "high" and place_price < 50000:
        base_affinity *= 0.7

    return base_affinity

def generate_random_date(days_back: int = 90) -> datetime:
    """Generate random datetime within last N days"""
    days_ago = random.randint(0, days_back)
    hours_ago = random.randint(0, 23)
    minutes_ago = random.randint(0, 59)

    date = datetime.utcnow() - timedelta(
        days=days_ago,
        hours=hours_ago,
        minutes=minutes_ago
    )
    return date

def expand_places_with_llm_style(base_places: List[Dict], target_count: int = 200) -> List[Dict]:
    """
    Expand place list to target count
    In production, use LLM to generate more real places
    For now, we'll create variations
    """
    places = []

    for place in base_places:
        place_with_id = place.copy()
        place_with_id["id"] = str(uuid.uuid4())
        place_with_id["description"] = f"A beautiful {place['name']} in {place['province']}"
        place_with_id["price_estimate"] = place["price"]
        place_with_id["popularity_score"] = random.uniform(5, 200)
        place_with_id["indoor_outdoor"] = "outdoor" if any(c in place["categories"] for c in ["Nature", "Lake", "Mountain"]) else "both"
        place_with_id["activity_level"] = random.choice(["low", "medium", "high"])
        place_with_id["latitude"] = place["lat"]
        place_with_id["longitude"] = place["lon"]
        places.append(place_with_id)

    # If mock_places.json already exists with curated places, load from it to keep real places
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    datasets_dir = os.path.join(os.path.dirname(current_dir), 'datasets')
    places_file = os.path.join(datasets_dir, 'mock_places.json') if os.path.exists(os.path.join(datasets_dir, 'mock_places.json')) else 'mock_places.json'
    if os.path.exists(places_file):
        with open(places_file, 'r', encoding='utf-8') as f:
            existing = json.load(f)
            if len(existing) >= target_count and not any("Branch" in p.get("name", "") for p in existing):
                return existing[:target_count]

    # Otherwise generate variations with non-negative prices and meaningful names
    counter = 1
    while len(places) < target_count:
        base = random.choice(base_places)
        variation = base.copy()
        variation["id"] = str(uuid.uuid4())
        variation["name"] = f"{base['name']} Khu {counter}"
        variation["description"] = f"Khu du lịch trải nghiệm tại {base['name']}, {base['province']}"
        variation["price_estimate"] = max(0, base["price"] + random.randint(-10000, 10000))
        variation["popularity_score"] = random.uniform(5, 200)
        variation["indoor_outdoor"] = "outdoor" if any(c in base["categories"] for c in ["Nature", "Lake", "Mountain"]) else "both"
        variation["activity_level"] = random.choice(["low", "medium", "high"])
        variation["latitude"] = base["lat"] + random.uniform(-0.02, 0.02)
        variation["longitude"] = base["lon"] + random.uniform(-0.02, 0.02)
        places.append(variation)
        counter += 1

    return places

def main():
    print("Generating synthetic data for AI Travel Planner...")

    # Generate places
    print("Generating places...")
    places = expand_places_with_llm_style(VIETNAM_PLACES, target_count=200)

    # Generate users
    print("Generating users...")
    users = generate_users(num_users=400)

    # Simulate interactions
    print("Simulating interactions...")
    interactions = simulate_interactions(users, places, num_interactions=15000)

    # Save to JSON files
    print("Saving data...")

    current_dir = os.path.dirname(os.path.abspath(__file__))
    datasets_dir = os.path.join(os.path.dirname(current_dir), 'datasets')
    out_dir = datasets_dir if os.path.exists(datasets_dir) else current_dir

    users_file = os.path.join(out_dir, 'mock_users.json')
    places_file = os.path.join(out_dir, 'mock_places.json')
    interactions_file = os.path.join(out_dir, 'mock_interactions.json')

    with open(users_file, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2, default=str)

    with open(places_file, 'w', encoding='utf-8') as f:
        json.dump(places, f, ensure_ascii=False, indent=2, default=str)

    with open(interactions_file, 'w', encoding='utf-8') as f:
        json.dump(interactions, f, ensure_ascii=False, indent=2, default=str)

    print(f"✅ Generated:")
    print(f"   - {len(users)} users")
    print(f"   - {len(places)} places")
    print(f"   - {len(interactions)} interactions")
    print(f"\nFiles saved to {out_dir}:")
    print("   - mock_users.json")
    print("   - mock_places.json")
    print("   - mock_interactions.json")

if __name__ == "__main__":
    main()
