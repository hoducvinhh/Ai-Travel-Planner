"""
Script to load mock data into PostgreSQL database
"""

import json
import sys
import os
from datetime import datetime
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost:5432/travel_planner')

def load_json_file(filename: str):
    """Load JSON file"""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_users(engine, users):
    """Load users into database"""
    with engine.connect() as conn:
        for user in users:
            query = text("""
                INSERT INTO users (id, email, name, password, preferred_styles, budget_level, created_at, updated_at)
                VALUES (:id, :email, :name, :password, :preferred_styles, :budget_level, :created_at, :updated_at)
                ON CONFLICT (id) DO NOTHING
            """)

            conn.execute(query, {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'password': user['password'],
                'preferred_styles': user['preferred_styles'],
                'budget_level': user['budget_level'],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })

        conn.commit()

    print(f"✅ Loaded {len(users)} users")

def load_places(engine, places):
    """Load places into database"""
    with engine.connect() as conn:
        for place in places:
            query = text("""
                INSERT INTO places (
                    id, name, description, categories, latitude, longitude,
                    province, price_estimate, popularity_score, indoor_outdoor,
                    activity_level, created_at, updated_at
                )
                VALUES (
                    :id, :name, :description, :categories, :latitude, :longitude,
                    :province, :price_estimate, :popularity_score, :indoor_outdoor,
                    :activity_level, :created_at, :updated_at
                )
                ON CONFLICT (id) DO NOTHING
            """)

            conn.execute(query, {
                'id': place['id'],
                'name': place['name'],
                'description': place['description'],
                'categories': place['categories'],
                'latitude': place['latitude'],
                'longitude': place['longitude'],
                'province': place['province'],
                'price_estimate': place['price_estimate'],
                'popularity_score': place['popularity_score'],
                'indoor_outdoor': place['indoor_outdoor'],
                'activity_level': place['activity_level'],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })

        conn.commit()

    print(f"✅ Loaded {len(places)} places")

def load_interactions(engine, interactions):
    """Load interactions into database"""
    with engine.connect() as conn:
        for interaction in interactions:
            query = text("""
                INSERT INTO user_interaction_events (
                    id, user_id, place_id, session_id, event_type, rating_value, created_at
                )
                VALUES (
                    :id, :user_id, :place_id, :session_id, :event_type, :rating_value, :created_at
                )
                ON CONFLICT (id) DO NOTHING
            """)

            created_at = interaction['created_at']
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))

            conn.execute(query, {
                'id': interaction['id'],
                'user_id': interaction['user_id'],
                'place_id': interaction['place_id'],
                'session_id': interaction['session_id'],
                'event_type': interaction['event_type'],
                'rating_value': interaction['rating_value'],
                'created_at': created_at
            })

        conn.commit()

    print(f"✅ Loaded {len(interactions)} interactions")

def main():
    try:
        print("Loading mock data into database...")
        print(f"Database: {DATABASE_URL}\n")

        # Create engine
        engine = create_engine(DATABASE_URL)

        # Load JSON files
        print("Reading JSON files...")
        users = load_json_file('mock_users.json')
        places = load_json_file('mock_places.json')
        interactions = load_json_file('mock_interactions.json')

        # Load into database
        print("\nInserting data into database...")
        load_users(engine, users)
        load_places(engine, places)
        load_interactions(engine, interactions)

        print("\n✅ All data loaded successfully!")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
