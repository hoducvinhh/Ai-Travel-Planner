# 📁 Thư mục Dữ liệu (Datasets)

Thư mục này tập trung toàn bộ các tệp dữ liệu mẫu, dữ liệu huấn luyện, tri thức RAG và dữ liệu seed cho toàn bộ dự án **AI Travel Planner**.

---

## 🗂️ Danh mục Dữ liệu

### 1. 덤 Cơ sở dữ liệu Du lịch (SQL Dump)
- **`tourism_chunks_data.sql`**: Bản dump hoàn chỉnh của bảng `tourism_chunks` trong PostgreSQL (pgvector). Chứa hơn 10.800 vector chunks tri thức du lịch phủ sóng khắp các tỉnh thành Việt Nam.

### 2. 📚 Dữ liệu Huấn luyện & Đánh giá RAG (Original QA & Context)
- **`train_vietnam_tourism.json`**: Dữ liệu huấn luyện RAG / QA du lịch Việt Nam (định dạng SQuAD-like).
- **`valid_vietnam_tourism.json`**: Dữ liệu kiểm thử / đánh giá RAG du lịch Việt Nam.

### 3. 🗺️ Dữ liệu RAG 21 Tỉnh thành Bổ sung (420 Cặp QA)
Dữ liệu QA du lịch chuẩn xác 100% bằng tiếng Việt cho 21 tỉnh thành (mỗi tỉnh 20 cặp QA):
- **`qa_21_provinces.json`**: File tổng hợp đầy đủ 420 cặp QA của cả 3 miền.
- **`qa_data_northern.json`**: 180 cặp QA cho 9 tỉnh miền Bắc *(Bắc Giang, Bắc Ninh, Hà Nam, Hưng Yên, Lai Châu, Lạng Sơn, Nam Định, Thái Nguyên, Vĩnh Phúc)*.
- **`qa_data_central_highlands.json`**: 120 cặp QA cho 6 tỉnh miền Trung & Tây Nguyên *(Hà Tĩnh, Quảng Ngãi, Thanh Hóa, Đắk Nông, Gia Lai, Kon Tum)*.
- **`qa_data_southern.json`**: 120 cặp QA cho 6 tỉnh miền Nam *(Bạc Liêu, Bình Phước, Cà Mau, Đồng Tháp, Hậu Giang, Long An)*.

> **Cách chạy nạp vào DB:** Chạy lệnh `pnpm seed:provinces` từ thư mục `backend/` (sử dụng script `backend/src/ingestion/seed_21_provinces.ts`).

### 4. 🧭 Dữ liệu 5 Chủ đề Du lịch Chuyên sâu (200 Cặp QA)
Dữ liệu cẩm nang chuyên sâu, mỗi chủ đề 40 câu hỏi - đáp:
- **`qa_advanced_topics.json`**: File tổng hợp 200 cặp QA thuộc 5 chủ đề.
- **`qa_advanced_topics_part1.json`**: Gồm Chủ đề 1 (Tuyến cung đường liên tỉnh) và Chủ đề 2 (Dự toán chi phí & Bảng giá vé).
- **`qa_advanced_topics_part2.json`**: Gồm Chủ đề 3 (Theo phong cách & đối tượng), Chủ đề 4 (Lưu trú, nghỉ dưỡng & Glamping) và Chủ đề 5 (Mẹo bản địa & An toàn).

> **Cách chạy nạp vào DB:** Chạy lệnh `pnpm seed:topics` từ thư mục `backend/` (sử dụng script `backend/src/ingestion/seed_advanced_topics.ts`).

### 5. 🤖 Dữ liệu Mẫu Hệ thống Gợi ý (Recommendation Service Mock Data)
Dữ liệu tổng hợp phục vụ huấn luyện và kiểm thử thuật toán gợi ý (Collaborative Filtering / Hybrid):
- **`mock_users.json`**: 400 người dùng mẫu với đa dạng hồ sơ sở thích (Nature lover, Budget backpacker, Luxury, Family, Foodie...).
- **`mock_places.json`**: 520 địa điểm du lịch thực tế tại Việt Nam kèm tọa độ GPS, mức giá, danh mục, độ phổ biến.
- **`mock_interactions.json`**: ~7.500 lượt tương tác người dùng - địa điểm (view, click, like, bookmark, rating).

> **Cách nạp vào DB:** Chạy lệnh `python load_mock_data.py` từ thư mục `recommendation-service/`.
> **Cách sinh dữ liệu mới:** Chạy lệnh `python generate_mock_data.py` từ thư mục `recommendation-service/`.
