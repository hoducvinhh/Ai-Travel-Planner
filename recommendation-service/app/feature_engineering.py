import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from app.config import settings

class FeatureEngineering:
    """Feature engineering for users and places"""

    EVENT_WEIGHTS = {
        'VIEW_DETAIL': 1.0,
        'SHARE': 3.0,
        'LIKE': 5.0,
        'SAVE': 5.0,
        'REMOVE_SAVE': -2.0,
    }

    @staticmethod
    def calculate_rating_weight(rating: float) -> float:
        """Convert rating (1-5) to weight (-4 to +4)"""
        return (rating - 3) * 2

    @staticmethod
    def apply_time_decay(weight: float, days_ago: float, lambda_decay: float = None) -> float:
        """Apply exponential time decay to weight"""
        if lambda_decay is None:
            lambda_decay = settings.lambda_decay
        return weight * np.exp(-lambda_decay * days_ago)

    @staticmethod
    def get_interaction_weight(event_type: str, rating_value: float = None) -> float:
        """Get base weight for interaction event"""
        if event_type == 'RATE' and rating_value is not None:
            return FeatureEngineering.calculate_rating_weight(rating_value)
        return FeatureEngineering.EVENT_WEIGHTS.get(event_type, 0.0)

    @staticmethod
    def compute_aggregated_score(interactions: List[Dict], current_time: datetime = None) -> float:
        """Compute aggregated preference score with time decay"""
        if current_time is None:
            current_time = datetime.utcnow()

        total_score = 0.0
        for interaction in interactions:
            created_at = interaction['created_at']
            days_ago = (current_time - created_at).total_seconds() / 86400.0

            base_weight = FeatureEngineering.get_interaction_weight(
                interaction['event_type'],
                interaction.get('rating_value')
            )

            decayed_weight = FeatureEngineering.apply_time_decay(base_weight, days_ago)
            total_score += decayed_weight

        return total_score

    @staticmethod
    def normalize_categories(categories: List[str], all_categories: List[str]) -> np.ndarray:
        """Multi-hot encoding for categories"""
        vector = np.zeros(len(all_categories))
        for i, cat in enumerate(all_categories):
            if cat in categories:
                vector[i] = 1.0
        return vector

    @staticmethod
    def normalize_price(price: int, min_price: int = 0, max_price: int = 1000000) -> float:
        """Min-max normalization for price"""
        if max_price == min_price:
            return 0.0
        return (price - min_price) / (max_price - min_price)

    @staticmethod
    def build_place_feature_vector(place: Dict, all_categories: List[str],
                                   price_stats: Tuple[int, int]) -> np.ndarray:
        """Build feature vector for a place"""
        category_vector = FeatureEngineering.normalize_categories(
            place['categories'], all_categories
        )

        normalized_price = FeatureEngineering.normalize_price(
            place['price_estimate'], price_stats[0], price_stats[1]
        )

        # Normalize popularity (log scale)
        normalized_popularity = np.log1p(place['popularity_score']) / 10.0

        # Combine features
        feature_vector = np.concatenate([
            category_vector,
            [normalized_price],
            [normalized_popularity]
        ])

        return feature_vector

    @staticmethod
    def build_user_feature_vector(user_preferences: List[str],
                                  implicit_preferences: Dict[str, float],
                                  all_categories: List[str]) -> np.ndarray:
        """Build feature vector for a user"""
        # Explicit preferences (from form/profile)
        explicit_vector = FeatureEngineering.normalize_categories(
            user_preferences, all_categories
        )

        # Implicit preferences (learned from interactions)
        implicit_vector = np.zeros(len(all_categories))
        for i, cat in enumerate(all_categories):
            implicit_vector[i] = implicit_preferences.get(cat, 0.0)

        # Combine (weighted average)
        combined_vector = 0.3 * explicit_vector + 0.7 * implicit_vector

        return combined_vector

    @staticmethod
    def enhance_with_trip_context(user_vector: np.ndarray, trip_context: Dict) -> np.ndarray:
        """Add trip context features to user vector"""
        # Normalize budget (log scale)
        budget_feature = np.log1p(trip_context['budget_per_person']) / 20.0

        # Normalize group size
        group_size_feature = min(trip_context['group_size'] / 10.0, 1.0)

        # Month as cyclical feature (sin/cos encoding)
        month = trip_context['month_of_year']
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)

        context_vector = np.array([
            budget_feature,
            group_size_feature,
            month_sin,
            month_cos
        ])

        return np.concatenate([user_vector, context_vector])
