from __future__ import annotations
import numpy as np
import pickle
import os
try:
    from lightfm import LightFM  # type: ignore
    from lightfm.data import Dataset  # type: ignore
except ImportError:
    LightFM = None
    Dataset = None

from typing import List, Dict, Tuple, Optional, Any
from datetime import datetime
from sqlalchemy.orm import Session
from app.feature_engineering import FeatureEngineering

class RecommendationModel:
    """LightFM-based hybrid recommendation model"""

    def __init__(self, model_path: str = None):
        self.model = None
        self.dataset = None
        self.feature_engineer = FeatureEngineering()
        self.all_categories = []
        self.user_id_mapping = {}
        self.place_id_mapping = {}
        self.reverse_place_mapping = {}
        self.model_path = model_path or "models/lightfm_model.pkl"

    def prepare_dataset(self, users: List[Dict], places: List[Dict],
                       interactions: List[Dict]) -> Any:
        """Prepare LightFM dataset with features"""
        if Dataset is None:
            raise RuntimeError(
                "LightFM is not installed. Please run the service inside Docker (python:3.11) or install LightFM dependencies."
            )

        # Extract unique categories
        self.all_categories = list(set(
            cat for place in places for cat in place['categories']
        ))

        # Create place features
        place_features = []
        for place in places:
            for cat in place['categories']:
                place_features.append(f"category:{cat}")
            price_bucket = self._get_price_bucket(place['price_estimate'])
            place_features.append(f"price:{price_bucket}")
            popularity_bucket = self._get_popularity_bucket(place['popularity_score'])
            place_features.append(f"popularity:{popularity_bucket}")

        place_features = list(set(place_features))

        # Create user features
        user_features = []
        for user in users:
            for pref in user.get('preferred_styles', []):
                user_features.append(f"preference:{pref}")
            if user.get('budget_level'):
                user_features.append(f"budget_level:{user['budget_level']}")

        user_features = list(set(user_features))

        # Initialize dataset
        dataset = Dataset()

        # Build user and item mappings
        user_ids = [u['id'] for u in users]
        place_ids = [p['id'] for p in places]

        dataset.fit(
            users=user_ids,
            items=place_ids,
            user_features=user_features,
            item_features=place_features
        )

        # Build interactions matrix
        interactions_list = []
        for inter in interactions:
            weight = self.feature_engineer.get_interaction_weight(
                inter['event_type'],
                inter.get('rating_value')
            )
            # Apply time decay
            days_ago = (datetime.utcnow() - inter['created_at']).total_seconds() / 86400.0
            decayed_weight = self.feature_engineer.apply_time_decay(weight, days_ago)

            if decayed_weight != 0:
                interactions_list.append((inter['user_id'], inter['place_id'], decayed_weight))

        interactions_matrix, weights = dataset.build_interactions(interactions_list)

        # Build user features matrix
        user_features_tuples = []
        for user in users:
            user_id = user['id']
            features = []
            for pref in user.get('preferred_styles', []):
                features.append(f"preference:{pref}")
            if user.get('budget_level'):
                features.append(f"budget_level:{user['budget_level']}")
            user_features_tuples.append((user_id, features))

        user_features_matrix = dataset.build_user_features(user_features_tuples)

        # Build item features matrix
        item_features_tuples = []
        for place in places:
            place_id = place['id']
            features = []
            for cat in place['categories']:
                features.append(f"category:{cat}")
            price_bucket = self._get_price_bucket(place['price_estimate'])
            features.append(f"price:{price_bucket}")
            popularity_bucket = self._get_popularity_bucket(place['popularity_score'])
            features.append(f"popularity:{popularity_bucket}")
            item_features_tuples.append((place_id, features))

        item_features_matrix = dataset.build_item_features(item_features_tuples)

        self.dataset = dataset
        return interactions_matrix, weights, user_features_matrix, item_features_matrix

    def train(self, interactions_matrix, weights, user_features_matrix,
              item_features_matrix, epochs: int = 30):
        """Train LightFM model"""
        if LightFM is None:
            raise RuntimeError(
                "LightFM is not installed. Please run the service inside Docker (python:3.11) or install LightFM dependencies."
            )

        self.model = LightFM(
            loss='warp',
            no_components=64,
            learning_rate=0.05,
            item_alpha=0.0001,
            user_alpha=0.0001
        )

        self.model.fit(
            interactions_matrix,
            user_features=user_features_matrix,
            item_features=item_features_matrix,
            sample_weight=weights,
            epochs=epochs,
            num_threads=4,
            verbose=True
        )

        # Build mappings
        self.user_id_mapping = self.dataset.mapping()[0]
        self.place_id_mapping = self.dataset.mapping()[2]
        self.reverse_place_mapping = {v: k for k, v in self.place_id_mapping.items()}

    def predict(self, user_id: str, candidate_place_ids: List[str],
                user_features: np.ndarray = None,
                candidate_popularity: Dict[str, float] = None,
                candidate_details: Dict[str, dict] = None,
                trip_preferences: List[str] = None,
                user_onboard_styles: List[str] = None,
                daily_budget: float = 0.0,
                companion_type: str = None) -> List[Tuple[str, float]]:
        """Predict scores for candidate places with cold-start fallback"""
        if self.model is None:
            return self._cold_start_recommend(
                candidate_place_ids, user_features, candidate_popularity,
                candidate_details, trip_preferences, user_onboard_styles,
                daily_budget, companion_type
            )

        # Handle cold start (new user)
        if user_id not in self.user_id_mapping:
            return self._cold_start_recommend(
                candidate_place_ids, user_features, candidate_popularity,
                candidate_details, trip_preferences, user_onboard_styles,
                daily_budget, companion_type
            )

        user_idx = self.user_id_mapping[user_id]

        # Filter candidates that exist in training data
        valid_candidates = [
            pid for pid in candidate_place_ids
            if pid in self.place_id_mapping
        ]

        if not valid_candidates:
            return self._cold_start_recommend(
                candidate_place_ids, user_features, candidate_popularity,
                candidate_details, trip_preferences, user_onboard_styles,
                daily_budget, companion_type
            )

        place_indices = [self.place_id_mapping[pid] for pid in valid_candidates]

        # Predict scores
        raw_scores = self.model.predict(
            user_ids=user_idx,
            item_ids=np.array(place_indices)
        )

        # Normalize raw model scores to [0.2, 0.9]
        min_s = float(np.min(raw_scores))
        max_s = float(np.max(raw_scores))
        score_range = max_s - min_s

        results = []
        for pid, raw in zip(valid_candidates, raw_scores):
            if score_range > 0:
                norm_score = 0.2 + 0.7 * float((raw - min_s) / score_range)
            else:
                norm_score = 0.5
            results.append((pid, norm_score))

        # Include any candidate places not seen during model training
        unseen_candidates = [pid for pid in candidate_place_ids if pid not in self.place_id_mapping]
        if unseen_candidates:
            unseen_results = self._cold_start_recommend(
                unseen_candidates, user_features, candidate_popularity,
                candidate_details, trip_preferences, user_onboard_styles,
                daily_budget, companion_type
            )
            results.extend(unseen_results)

        # Sort by score descending
        results.sort(key=lambda x: x[1], reverse=True)
        return results

    def _cold_start_recommend(self, candidate_place_ids: List[str],
                             user_features: np.ndarray = None,
                             candidate_popularity: Dict[str, float] = None,
                             candidate_details: Dict[str, dict] = None,
                             trip_preferences: List[str] = None,
                             user_onboard_styles: List[str] = None,
                             daily_budget: float = 0.0,
                             companion_type: str = None) -> List[Tuple[str, float]]:
        """
        Multi-Attribute Content-Based Personalization Engine for Cold-Start.
        Công thức kết hợp đa thuộc tính:
        u_final = 0.75 * t_trip + 0.25 * u_onboard
        Score(p_j) = 0.50 * S_content[j] + 0.25 * Fit_budget + 0.15 * Fit_group + 0.10 * NormPop
        """
        if not candidate_place_ids:
            return []

        # 1. Dung hợp Vector nhu cầu chuyến đi (75%) và gu tài khoản Onboarding (25%)
        alpha = 0.75
        trip_prefs = [p.lower().strip() for p in (trip_preferences or []) if p.strip()]
        onboard_prefs = [
            s.lower().strip().replace('companion:', '')
            for s in (user_onboard_styles or [])
            if s.strip() and not s.startswith('companion:')
        ]

        pref_weights: Dict[str, float] = {}
        if trip_prefs and onboard_prefs:
            for p in trip_prefs:
                pref_weights[p] = pref_weights.get(p, 0.0) + alpha
            for s in onboard_prefs:
                pref_weights[s] = pref_weights.get(s, 0.0) + (1.0 - alpha)
        elif trip_prefs:
            for p in trip_prefs:
                pref_weights[p] = 1.0
        elif onboard_prefs:
            for s in onboard_prefs:
                pref_weights[s] = 1.0

        # Chuẩn bị độ phổ biến chuẩn hóa
        candidate_popularity = candidate_popularity or {}
        pop_values = [candidate_popularity.get(pid, 0.0) for pid in candidate_place_ids]
        max_pop = max(pop_values) if pop_values else 1.0
        min_pop = min(pop_values) if pop_values else 0.0
        range_pop = max_pop - min_pop if (max_pop - min_pop) > 0 else 1.0

        scores = []
        for place_id in candidate_place_ids:
            details = (candidate_details or {}).get(place_id, {})
            cats = [c.lower() for c in details.get('categories', [])]
            place_name = (details.get('name') or '').lower()
            price = details.get('price_estimate', 0) or 0
            pop = candidate_popularity.get(place_id, 0.0)

            # A. Điểm sở thích (50%)
            if pref_weights:
                match_sum = 0.0
                for kw, w in pref_weights.items():
                    if any(kw in c or c in kw for c in cats) or (kw in place_name):
                        match_sum += w
                s_content = min(1.0, match_sum)
            else:
                s_content = 0.5

            # B. Điểm ngân sách (25%)
            if daily_budget > 0:
                if price <= daily_budget * 0.6:
                    fit_budget = 1.0
                elif price <= daily_budget:
                    fit_budget = 0.9
                elif price <= daily_budget * 1.3:
                    fit_budget = 0.6
                else:
                    fit_budget = 0.3
            else:
                fit_budget = 0.85

            # C. Điểm nhóm đi (15%)
            is_nightlife = any(c in ['nightlife', 'bar', 'pub', 'club', 'chợ đêm'] for c in cats)
            is_nature_relax = any(c in ['nature', 'relax', 'park', 'beach', 'resort', 'spa'] for c in cats)

            comp = (companion_type or 'friends').lower()
            if comp == 'family':
                if is_nightlife:
                    fit_group = 0.10  # Phạt nặng quán bar/nightlife
                elif is_nature_relax:
                    fit_group = 1.00
                else:
                    fit_group = 0.75
            elif comp == 'couple':
                if is_nature_relax or any(c in ['photography', 'food', 'cafe', 'scenic'] for c in cats):
                    fit_group = 1.00
                else:
                    fit_group = 0.80
            elif comp == 'friends':
                if is_nightlife or any(c in ['adventure', 'food', 'shopping', 'entertainment'] for c in cats):
                    fit_group = 1.00
                else:
                    fit_group = 0.80
            elif comp == 'solo':
                if any(c in ['culture', 'historical', 'adventure', 'photography', 'cafe', 'nature'] for c in cats):
                    fit_group = 1.00
                else:
                    fit_group = 0.85
            else:
                fit_group = 0.80

            # D. Độ phổ biến chuẩn hóa (10%)
            norm_pop = float((pop - min_pop) / range_pop)

            # CÔNG THỨC: Score = 0.50 * S_content + 0.25 * Fit_budget + 0.15 * Fit_group + 0.10 * NormPop
            final_score = 0.50 * s_content + 0.25 * fit_budget + 0.15 * fit_group + 0.10 * norm_pop
            scores.append((place_id, round(final_score, 4)))

        # Sắp xếp giảm dần theo điểm
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores

    def save_model(self):
        """Save trained model to disk"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)

        model_data = {
            'model': self.model,
            'dataset': self.dataset,
            'all_categories': self.all_categories,
            'user_id_mapping': self.user_id_mapping,
            'place_id_mapping': self.place_id_mapping,
            'reverse_place_mapping': self.reverse_place_mapping
        }

        with open(self.model_path, 'wb') as f:
            pickle.dump(model_data, f)

    def load_model(self):
        """Load trained model from disk"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found: {self.model_path}")

        with open(self.model_path, 'rb') as f:
            model_data = pickle.load(f)

        self.model = model_data['model']
        self.dataset = model_data['dataset']
        self.all_categories = model_data['all_categories']
        self.user_id_mapping = model_data['user_id_mapping']
        self.place_id_mapping = model_data['place_id_mapping']
        self.reverse_place_mapping = model_data['reverse_place_mapping']

    @staticmethod
    def _get_price_bucket(price: int) -> str:
        """Bucket prices into categories"""
        if price < 50000:
            return "very_low"
        elif price < 200000:
            return "low"
        elif price < 500000:
            return "medium"
        elif price < 1000000:
            return "high"
        else:
            return "very_high"

    @staticmethod
    def _get_popularity_bucket(popularity: float) -> str:
        """Bucket popularity into categories"""
        if popularity < 10:
            return "niche"
        elif popularity < 50:
            return "moderate"
        elif popularity < 200:
            return "popular"
        else:
            return "very_popular"
