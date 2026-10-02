# MASTER PLAN: AI Travel Planner (Đồ Án Tốt Nghiệp)

## Ý Tưởng & Mục Tiêu (Goal Description)
Dự án **AI Travel Planner** tập trung sâu vào phần **Machine Learning (Recommendation System)** để tạo ra các gợi ý cá nhân hóa, kết hợp cùng **LLM** để xếp lịch trình. Hệ thống sử dụng các mô hình học máy (Collaborative Filtering / Hybrid Filtering) để dự đoán và gợi ý địa điểm dựa trên input trực tiếp và lịch sử hành vi (VIEW, LIKE, SAVE, RATE).

## Kiến Trúc Hệ Thống (Microservices)
Hệ thống chia làm 2 phần chính:
1. **Main Backend (NestJS / TypeScript):**
   - Đảm nhiệm APIs, Auth, quản lý Database (PostgreSQL/Prisma).
   - Business Logic, phân quyền, gọi Gemini API (LLM) để tổng hợp lịch trình.
2. **Recommendation Service (Python / FastAPI):**
   - Chuyên biệt cho xử lý ML. Sử dụng `LightFM` hoặc `XGBoost` để train mô hình Hybrid.
   - Cung cấp API (ví dụ: `POST /recommend`) nhận input từ NestJS và trả về danh sách `place_id` gợi ý.
3. **Frontend (Next.js/React):** Form nhập liệu, Timeline lịch trình, Bản đồ Leaflet + OSM (Click lấy tọa độ, hiển thị route).

---

## KIẾN TRÚC MACHINE LEARNING CHUYÊN SÂU

### 1. Xác Định Bài Toán Recommendation
**Mục tiêu của Model:**
Dự đoán **Interaction Probability (Xác suất tương tác)** hoặc **Engagement Score (Điểm hứng thú)** của một User đối với một Place trong bối cảnh một Trip cụ thể.

**Mathematical Formulation:**
Bài toán được định nghĩa dưới dạng một hàm Ranking (Pointwise hoặc Pairwise):
`Score = f(User_Vector, Trip_Context_Vector, Place_Vector)`

*   **Output chính xác:** Một giá trị liên tục $S \in [0, 1]$ biểu diễn độ phù hợp (Relevance Score) của Place đó đối với User trong Trip hiện tại.
*   Dựa vào $S$, hệ thống sẽ rank (sắp xếp) các địa điểm từ cao xuống thấp để lấy Top-K.

### 2. Thiết Kế Hybrid Recommendation
Để kết hợp Content-Based (CB) và Collaborative Filtering (CF), thay vì dùng Weighted Average thủ công ($S = \alpha \cdot CB + (1-\alpha) \cdot CF$), hệ thống sẽ sử dụng **LightFM** hoặc **XGBoost**.

**Giải pháp đề xuất: Thuật toán LightFM (Factorization Machines)**
LightFM rất xuất sắc vì nó nhúng (embed) cả User Features và Item Features vào không gian tiềm ẩn (Latent space) để tính toán CF.
*   **Khi User/Item cũ (nhiều tương tác):** LightFM tự động dựa nhiều vào CF (ma trận tương tác).
*   **Khi User/Item mới (ít tương tác):** LightFM tự động fallback về CB dựa trên metadata (Features).
*   *Cách chọn $\alpha$:* Mô hình tự học trọng số này qua quá trình huấn luyện (Gradient Descent), không cần fix cứng.

**Feature sử dụng:**
*   **CB:** Place categories, price level, location tags.
*   **CF:** Bảng ma trận `UserPlacePreference` (tổng hợp từ like, save, view).

### 3. Giải Quyết Cold Start
*   **Training-data Cold Start:** Giải quyết bằng Synthetic Data Pipeline.
*   **Runtime Cold Start (User mới sử dụng app):** Khi User mới đăng nhập/nhập form, hệ thống chỉ có `Trip Context` và `Explicit Preferences`. Model LightFM tự động chuyển sang trạng thái Pure Content-Based. Ta vector hóa input của form và tính độ tương đồng với Place Feature Vectors. Bổ sung thêm trọng số **Popularity**.
*   **Transition (Warm-up):** Khi user bắt đầu thao tác (VIEW, LIKE, SAVE), các sự kiện thô này lập tức được đưa vào cache. Ở lần Recommend tiếp theo, hệ thống tính lại User Feature Vector để đưa ra gợi ý cá nhân hóa hơn.

### 4. Thiết Kế Synthetic Data Pipeline (Tránh Leakage)
Không dùng LLM để sinh trực tiếp bảng tương tác, vì model ML sẽ chỉ học lại rule nông cạn của LLM. LLM chỉ đóng vai trò sinh *Profile*, còn *Hành vi* do Simulator quyết định.

1.  **Crawl Data:** Lấy thông tin khoảng 150-200 Địa điểm THẬT (Tên, Category, Giá). Có thể nhờ LLM sinh tự động các địa điểm nổi tiếng có thật.
2.  **LLM Sinh User Profiles:** Prompt LLM tạo ra khoảng **300 - 400 User ảo** chia thành các Segments rõ ràng (Nature Lover, Budget Backpacker, Luxury Family...). *Data sinh ra chỉ gồm: UserID, Persona, Explicit Preferences, Budget.*
3.  **Rule-based Simulator (Python script):**
    *   Tạo hàm xác suất: Nếu User là "Nature Lover" và Place có tag "Mountain", xác suất `p(Like) = 0.8`.
    *   **Thêm Noise:** Cấp 15% cơ hội User like một địa điểm không liên quan (khám phá ngẫu nhiên), 10% cơ hội dislike địa điểm đúng sở thích (nhiễu).
    *   Simulator chạy và sinh ra hàng ngàn logs `UserInteractionEvent`.
4.  **Train/Test Split:** Đảm bảo chia tập theo Time-based hoặc User-based tĩnh để không bị Leakage.

### 5. Thiết Kế Interaction Event Data & Schema
Mô hình học máy cần chuỗi sự kiện theo thời gian, không phải trạng thái bị đè. (Xem phần Schema ở cuối tài liệu).

### 6. Interaction Weighting & Time Decay
**Behavior to Preference Signal:**
*   `VIEW_DETAIL` = 1 (Implicit, Weak Positive)
*   `SHARE` = 3 (Implicit, Medium Positive)
*   `LIKE` / `SAVE` = 5 (Explicit, Strong Positive)
*   `REMOVE_SAVE` = -2 (Negative)
*   `RATE`: Normalize theo công thức: `(rating - 3) * 2` (VD: 5 sao = +4, 1 sao = -4).

**Time Decay Formula (Exponential Decay):**
$W_{final} = W_{base} \cdot e^{-\lambda \cdot \Delta t}$
(Trong đó $\Delta t$ là số ngày tính từ lúc tương tác, $\lambda$ là hệ số phân rã, ví dụ $\lambda = 0.05$).

### 7. Thiết Kế User Features
User Feature Vector là sự kết hợp của:
1.  **Explicit Preferences:** Những gì user tick lúc đăng ký hoặc điền form (Static).
2.  **Implicit Learned Preferences:** Trung bình cộng các Feature Vectors của những Places mà User đã LIKE/SAVE trong 30 ngày qua (Dynamic).
Ví dụ: `[nature_score, history_score, adventure_score, food_score, budget_level_encoded, is_family_encoded, activity_level]`

### 8. Thiết Kế Place Features
*   **Bắt buộc (Core):** `Categories` (Multi-hot encoding), `Normalized_Price` (đưa về thang 0-1), `Popularity_Index` (Tổng số lượt save/like).
*   **Nên có (Contextual):** `Indoor_Outdoor`, `Activity_Level`.
*   **Bỏ qua (Dùng cho Business Rule):** `Opening_Hours`, `Address_Text`.

### 9. Feature Engineering Pipeline
1.  **Data Cleaning:** Lọc các địa điểm thiếu tọa độ.
2.  **Categorical Encoding:** Dùng Multi-hot cho `Categories`.
3.  **Normalization:** Min-Max Scaler cho giá tiền và số lượt review.
4.  **Aggregation:** Tính `aggregatedScore` cho mỗi cặp User-Place bằng công thức Weighting.

### 10. Trip Context
*   **Schema `TripContext` (Pass via Memory/API):** `[budget_per_person, days, group_size, month_of_year]`.
*   **Tích hợp:** Ở khâu Inference, ta mix `TripContext` vào `UserFeature`. Nếu `group_size > 5`, ta đẩy trọng số `family_friendly` lên cao.

### 11. Geospatial Features
Khoảng cách địa lý (Distance) **KHÔNG NÊN** đưa thẳng vào làm feature huấn luyện ML. Geospatial chỉ nên áp dụng ở 2 layer:
1.  **Candidate Generation:** Filter bỏ 100% các địa điểm không nằm trong (hoặc cách quá xa) `destination`.
2.  **LLM Routing / Business Rules:** Thuật toán (hoặc Gemini) sẽ nhận vĩ độ/kinh độ tự động phân cụm (Clustering) nhóm các điểm gần nhau vào cùng 1 ngày.

### 12. Candidate Generation và Ranking (The Funnel)
*   **Stage 1 - Retrieval (Lọc thô):** Input "Đi Đà Lạt". Lọc từ DB (SQL query) ra 300 địa điểm thuộc Đà Lạt.
*   **Stage 2 - ML Ranking (Chấm điểm):** Đưa 300 địa điểm + User Context vào Python FastAPI service. Mô hình LightFM dự đoán `Relevance Score`. Lấy Top 50.
*   **Stage 3 - LLM/Heuristic Generation:** Trả Top 50 về NestJS. NestJS đưa vào LLM xếp lịch (tối đa lấy 15-20 điểm xếp vào 3 ngày).

### 13. Business Rule Filtering
Nằm ở **Stage 2.5** (Sau ML, Trước khi đưa cho LLM):
*   ML Score chỉ đo lường "Độ thích". Business Rule đo lường "Tính khả thi".
*   **Rule 1 - Budget Constraints:** Cắt bỏ các điểm có vé vào cổng vượt quá 30% ngân sách 1 ngày.
*   **Rule 2 - Diversity:** Tránh việc Top K trả về toàn Quán Cafe. Phạt điểm (penalty) nếu trùng lặp thể loại quá nhiều.

### 14. Baseline Models (Cho báo cáo Đồ Án)
*   **Baseline 1 (Non-personalized):** `Most Popular`.
*   **Baseline 2 (Pure Content-Based):** `Cosine Similarity`.
*   **Model Đề Xuất (Hybrid):** LightFM huấn luyện trên Interaction Log + User/Place Metadata.

---

## KẾ HOẠCH TRIỂN KHAI CHI TIẾT (ACTION PLAN)

**Giai đoạn 1: Database & Sinh Dữ Liệu**
- Thiết lập Prisma Schema (Các bảng Event-Sourcing).
- Viết script tạo Mock Data (150-200 Địa điểm bằng LLM, 300-400 User + Interactions bằng LLM và Simulator).

**Giai đoạn 2: Python ML Service**
- Dựng FastAPI, đọc dữ liệu từ Database.
- Xây dựng mô hình LightFM, train trên Mock Data. Expose API `/recommend`.

**Giai đoạn 3: Tích hợp NestJS & Gemini LLM**
- API nhận request từ Frontend -> Lọc thô DB -> Gọi Python lấy Top-K -> Gọi Gemini xếp lịch JSON.

**Giai đoạn 4: Frontend (UI & Leaflet Map)**
- CMS Admin: Map click lấy tọa độ.
- End-User: Render timeline lịch trình, vẽ route trên bản đồ.

---

## THIẾT KẾ CƠ SỞ DỮ LIỆU DỰ KIẾN (Schema Draft)

```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  name            String?
  preferredStyles String[] 
  budgetLevel     String?
  createdAt       DateTime @default(now())
}

model Place {
  id              String   @id @default(uuid())
  name            String
  description     String   @db.Text
  categories      String[]
  latitude        Float
  longitude       Float
  province        String?
  priceEstimate   Int
  createdAt       DateTime @default(now())
}

// Bảng lưu log tương tác thô (Append-only) phục vụ ML Simulator
model UserInteractionEvent {
  id              String   @id @default(uuid())
  userId          String
  placeId         String
  sessionId       String?  
  eventType       String   // VIEW_DETAIL, LIKE, SAVE, RATE, SHARE, REMOVE_SAVE
  ratingValue     Float?
  createdAt       DateTime @default(now())

  @@index([userId, placeId])
  @@index([createdAt])
}

// Bảng Aggregation (Được Job chạy nền tổng hợp từ bảng Event)
model UserPlacePreference {
  userId          String
  placeId         String
  aggregatedScore Float    // Điểm tính theo trọng số (Weighting) + Decay
  lastInteraction DateTime
  
  @@id([userId, placeId])
}
```
