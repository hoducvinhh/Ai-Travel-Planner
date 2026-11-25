from pydantic import BaseModel
from typing import List, Optional

class RecommendationRequest(BaseModel):
    user_id: str
    destination: str
    budget_per_person: int
    days: int
    group_size: int
    month_of_year: int
    explicit_preferences: Optional[List[str]] = []
    user_preferred_styles: Optional[List[str]] = []
    budget_level: Optional[str] = None
    companion_type: Optional[str] = None

class RecommendationResponse(BaseModel):
    place_ids: List[str]
    scores: List[float]

class PlaceFeature(BaseModel):
    place_id: str
    name: str
    categories: List[str]
    price_estimate: int
    popularity_score: float
    latitude: float
    longitude: float
