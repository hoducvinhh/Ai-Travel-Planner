import sys
import os
os.environ.setdefault("DATABASE_URL", "postgresql://localhost:5432/travel_rag")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.model import RecommendationModel

def test_multi_attribute_cold_start():
    model = RecommendationModel()
    
    # 2 địa điểm ứng viên như trong ví dụ minh họa của Kế hoạch:
    # KDL Thung Lũng Vàng: Nature, Relax, Photography, vé 70.000đ, pop 85
    # Quán Bar & Pub đêm: Food, Nightlife, Bar, giá 200.000đ, pop 95
    candidates = ['place_A_thung_lung_vang', 'place_B_quan_bar']
    candidate_pop = {
        'place_A_thung_lung_vang': 85.0,
        'place_B_quan_bar': 95.0,
    }
    candidate_details = {
        'place_A_thung_lung_vang': {
            'name': 'Khu du lịch Thung Lũng Vàng',
            'categories': ['nature', 'relax', 'photography'],
            'price_estimate': 70000,
            'popularity': 85.0,
        },
        'place_B_quan_bar': {
            'name': 'Quán Bar Acoustic & Pub đêm',
            'categories': ['food', 'nightlife', 'bar'],
            'price_estimate': 200000,
            'popularity': 95.0,
        },
    }

    # Người dùng Nam: Onboarding chọn culture, food, photography
    onboard_styles = ['culture', 'food', 'photography']
    # Chuyến này đi cùng Gia đình chọn: nature, relax
    trip_prefs = ['nature', 'relax']
    daily_budget = 500000
    companion_type = 'family'

    results = model._cold_start_recommend(
        candidate_place_ids=candidates,
        candidate_popularity=candidate_pop,
        candidate_details=candidate_details,
        trip_preferences=trip_prefs,
        user_onboard_styles=onboard_styles,
        daily_budget=daily_budget,
        companion_type=companion_type,
    )

    print("Test Results:", results)
    top_place, top_score = results[0]
    second_place, second_score = results[1]

    # Kiểm tra Thung Lũng Vàng xếp Top 1
    assert top_place == 'place_A_thung_lung_vang', f"Expected place_A to be top 1, got {top_place}"
    assert top_score > second_score, f"Place A ({top_score}) should score higher than Place B ({second_score})"
    assert top_score >= 0.85, f"Place A should have high score >= 0.85, got {top_score}"
    assert second_score < 0.60, f"Place B (Bar with family) should have low score < 0.60, got {second_score}"
    print(" PASSED: Multi-attribute cold-start recommendation test matches lecturer feedback plan!")

def test_jaccard_diversity_between_distinct_users():
    """
    Kiểm thử mục 5.A.2 trong Plan:
    So sánh gợi ý giữa 2 người dùng mới với 2 phong cách khác nhau (Ẩm thực vs Nghỉ dưỡng)
    đảm bảo Jaccard similarity giữa 2 danh sách gợi ý < 0.40.
    """
    model = RecommendationModel()

    # Tạo tập hợp 12 địa điểm ứng viên (6 điểm ẩm thực / nightlife, 6 điểm resort / biển / relax)
    candidates = []
    candidate_pop = {}
    candidate_details = {}

    for i in range(1, 7):
        pid = f"food_place_{i}"
        candidates.append(pid)
        candidate_pop[pid] = 70.0 + i * 2
        candidate_details[pid] = {
            'name': f'Quán Ăn & Chợ Đêm {i}',
            'categories': ['food', 'nightlife', 'street food'],
            'price_estimate': 100000 + i * 20000,
            'popularity': 70.0 + i * 2,
        }

    for i in range(1, 7):
        pid = f"relax_place_{i}"
        candidates.append(pid)
        candidate_pop[pid] = 70.0 + i * 2
        candidate_details[pid] = {
            'name': f'Khu Nghỉ Dưỡng & Spa {i}',
            'categories': ['relax', 'beach', 'resort', 'nature'],
            'price_estimate': 300000 + i * 50000,
            'popularity': 70.0 + i * 2,
        }

    # User 1: Ẩm thực & Đi cùng bạn bè
    user1_res = model._cold_start_recommend(
        candidate_place_ids=candidates,
        candidate_popularity=candidate_pop,
        candidate_details=candidate_details,
        trip_preferences=['food', 'nightlife'],
        user_onboard_styles=['food', 'nightlife', 'shopping'],
        daily_budget=500000,
        companion_type='friends',
    )
    top_user1 = set([p[0] for p in user1_res[:5]])

    # User 2: Nghỉ dưỡng biển & Đi cùng gia đình
    user2_res = model._cold_start_recommend(
        candidate_place_ids=candidates,
        candidate_popularity=candidate_pop,
        candidate_details=candidate_details,
        trip_preferences=['relax', 'beach'],
        user_onboard_styles=['relax', 'beach', 'nature'],
        daily_budget=1500000,
        companion_type='family',
    )
    top_user2 = set([p[0] for p in user2_res[:5]])

    # Tính Jaccard similarity
    intersection = top_user1.intersection(top_user2)
    union = top_user1.union(top_user2)
    jaccard_similarity = len(intersection) / len(union) if union else 0.0

    print(f"Top 5 User 1 (Ẩm thực): {top_user1}")
    print(f"Top 5 User 2 (Nghỉ dưỡng): {top_user2}")
    print(f"Jaccard Similarity: {jaccard_similarity:.3f}")

    assert jaccard_similarity < 0.40, f"Expected Jaccard similarity < 0.40, got {jaccard_similarity:.3f}"
    print(f" PASSED: Jaccard similarity test passed ({jaccard_similarity:.3f} < 0.40). Personalization diversity verified!")

if __name__ == '__main__':
    test_multi_attribute_cold_start()
    test_jaccard_diversity_between_distinct_users()
