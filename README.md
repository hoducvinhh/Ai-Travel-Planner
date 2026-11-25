# 🌍 AI Travel Planner — Hệ Thống Lập Kế Hoạch Du Lịch Thông Minh

> **Đồ án tốt nghiệp**: Nền tảng lập kế hoạch du lịch Việt Nam cá nhân hóa kết hợp **Hybrid Machine Learning (LightFM)**, **Large Language Model (Google Gemini)**, **RAG Chatbot (`pgvector` + BGE-M3)**, **Tối ưu lộ trình (TSP + OFS 5 chiều)** và **Mạng xã hội & Nhắn tin 1-1 thời gian thực** trên cả **Web** và **Mobile (Flutter)**.

---

## 📋 Tổng Quan Hệ Thống

**AI Travel Planner** là hệ thống đa nền tảng giúp người dùng khám phá địa điểm Việt Nam, tạo lịch trình du lịch thông minh theo ngày, tra cứu thông tin du lịch bằng trợ lý AI, ghép đôi bạn đồng hành (Travel Buddy) và trò chuyện trực tiếp.

Hệ thống gồm **4 thành phần chính**:

| Thành phần | Công nghệ cốt lõi | Cổng mặc định | Vai trò |
| --- | --- | --- | --- |
| **`web/`** | Next.js 16 (App Router), React 19, TailwindCSS 4, Leaflet, Socket.IO Client | `3001` | Ứng dụng Web cho người dùng cuối & trang quản trị Admin (`/admin`) |
| **`mobile/`** | Flutter, Riverpod, GoRouter, Dio, `flutter_map`, `socket_io_client`, `sqflite` | — | Ứng dụng di động Android/iOS **chỉ dành cho người dùng cuối** (giao diện Ocean Teal `#0D9488`) |
| **`backend/`** | NestJS 12, Prisma 6, PostgreSQL + `pgvector`, JWT, Socket.IO, `@google/genai`, Swagger | `3002` | REST API, WebSocket Gateway (`/socket.io`), RAG pipeline, Trip Optimizer & LLM |
| **`recommendation-service/`** | Python FastAPI, LightFM (`lightfm 1.17`), SQLAlchemy, NumPy, Pandas, scikit-learn | `8000` | Microservice gợi ý địa điểm Hybrid (Collaborative + Content-Based + Time Decay) |

---

## ✨ Tính Năng Chính

### 1. 🔐 Xác thực & Onboarding Cá Nhân Hóa
- Đăng ký / Đăng nhập JWT (`/auth/login`, `/auth/register`, `/auth/profile`), hỗ trợ đăng nhập sinh trắc học trên Mobile (`local_auth`).
- **Onboarding 3 bước**: Khảo sát phong cách du lịch (chọn ≥ 3 sở thích), đối tượng đồng hành (`solo`, `couple`, `family`, `friends`) và mức ngân sách (`budget`, `standard`, `luxury`) để giải quyết bài toán *Cold Start*.

### 2. 🎯 Lập Lịch Trình AI Thông Minh (Smart Trip Planner)
- **Tạo lịch trình nhiều bước**: Hỗ trợ **Tour liên tỉnh** (chọn nhiều tỉnh thành), **Smart Pre-fill** tự điền theo hồ sơ cá nhân.
- **Pipeline ML + LLM**:
  1. Lọc ứng viên từ PostgreSQL theo điểm đến.
  2. **LightFM Recommendation Service** xếp hạng Top 50 địa điểm phù hợp nhất (kết hợp tương tác có trọng số `VIEW`, `LIKE`, `SAVE`, `RATE` với hàm suy giảm thời gian `LAMBDA_DECAY=0.05`).
  3. **Google Gemini** sinh lịch trình chi tiết theo ngày và chia **3 buổi/ngày** (Sáng / Chiều / Tối).
- **Tối ưu lộ trình (`RouteOptimizerService`)**: Sắp xếp lại thứ tự điểm tham quan trong ngày (`POST /trips/:id/optimize`) kèm thống kê quãng đường tiết kiệm (`TripOptimizationStats`).
- **Đánh giá tính khả thi 5 chiều (`FeasibilityValidatorService` — OFS)**: Chấm điểm Địa lý (`geo`), Thời gian (`time`), Ngân sách (`budget`), Sở thích (`preference`), Đa dạng (`diversity`) kèm cảnh báo và gợi ý cải thiện.
- **1-Click Clone (`POST /trips/:id/clone`)**: Nhân bản lịch trình từ bài chia sẻ của cộng đồng.

### 3. 🧭 Khám Phá Địa Điểm, Thời Tiết & Chỉ Đường
- Hỗ trợ **11 tỉnh/thành trọng điểm**, **10 danh mục** và **5 chế độ sắp xếp** (`popularity`, `rating`, `price_asc`, `price_desc`, `newest`) với phân trang chuẩn `{ items, pagination }`.
- Tương tác xã hội đầy đủ: Thích (Like), Lưu Wishlist (Save), Đánh giá 1–5★ / Gỡ đánh giá, Bình luận, Chia sẻ lên Cộng đồng.
- **Thời tiết & Chỉ đường thực tế**:
  - Thời tiết theo tọa độ địa điểm từ **Open-Meteo API** (`PlaceWeatherPill`).
  - Tính tuyến đường và thời gian di chuyển bằng **OSRM API** (kèm fallback Haversine) cho **Xe máy / Ô tô / Đi bộ** trên bản đồ tương tác (`Leaflet` trên Web, `flutter_map` trên Mobile).

### 4. 💬 Chatbot Du Lịch RAG (Streaming SSE)
- Hỏi đáp thông tin du lịch Việt Nam theo thời gian thực qua Server-Sent Events (`POST /api/chat`).
- Embeddings **BGE-M3** (`@huggingface/transformers`) lưu trên **PostgreSQL + `pgvector`** (`TourismChunk`, >10.800 chunks).
- Tự động trích dẫn nguồn tài liệu và lưu lịch sử phiên chat (`ChatSession`, `ChatMessage`).

### 5. 🤝 Cộng Đồng, Travel Buddy & Nhắn Tin 1-1 Real-time
- **Cộng đồng (`community/`)**: Đăng bài kèm tối đa nhiều ảnh upload (`POST /upload/image`), gắn thẻ hashtag, đính kèm lịch trình để người khác clone, thích và bình luận.
- **Travel Buddy AI (`GET /community/travel-buddies`)**: Gợi ý bạn đồng hành theo độ tương đồng phong cách và ngân sách.
- **Nhắn tin 1-1 Real-time (`messages/` + Socket.IO)**: Danh sách hội thoại, badge số tin chưa đọc, trạng thái đang nhập (`typing`), đồng bộ tin nhắn tức thời.

### 6. 🛠️ Trang Quản Trị Admin (Chỉ có trên Web `/admin`)
- Quản lý người dùng, địa điểm, bài đăng cộng đồng và phản hồi tri thức RAG (`KnowledgeFeedback`). *(Ứng dụng Mobile không tích hợp các màn hình Admin).*

---

## 🏗️ Kiến Trúc Tổng Thể

```text
┌───────────────────────────┐     ┌──────────────────────────────────┐
│   Web (Next.js 16 :3001)  │     │  Mobile (Flutter Android / iOS)  │
│   User UI + /admin        │     │  User-only (Ocean Teal Theme)    │
└─────────────┬─────────────┘     └────────────────┬─────────────────┘
              │ REST / SSE / Socket.IO             │
              └──────────────────┬─────────────────┘
                                 ▼
              ┌──────────────────────────────────────┐
              │       Backend (NestJS 12 :3002)      │
              │  Auth • Places • Trips • Optimizer   │
              │  RAG Chat (SSE) • Community • Upload │
              │  Socket.IO Gateway • Swagger (/docs) │
              └──────────┬───────────────┬───────────┘
                         │ Prisma        │ HTTP
                         ▼               ▼
         ┌──────────────────────┐  ┌─────────────────────────────────┐
         │ PostgreSQL 16        │  │ Recommendation Service (:8000)  │
         │ + pgvector           │  │ FastAPI + LightFM Hybrid Model  │
         └──────────────────────┘  └─────────────────────────────────┘
```

---

## 📂 Cấu Trúc Thư Mục

```text
DATN - AI Travel Planner/
├── backend/                     # NestJS 12 REST + WebSocket + RAG + Optimizer API
│   ├── prisma/                  # schema.prisma (16 models), seed & enrich scripts
│   └── src/
│       ├── auth/                # JWT Auth & Passport
│       ├── chat/                # RAG Chatbot SSE + ChatSession
│       ├── comments/            # Place & Community comments
│       ├── community/           # Posts, Likes, Travel Buddy matching
│       ├── embedding/           # BGE-M3 vector embeddings
│       ├── gemini/              # Google Gemini LLM client
│       ├── ingestion/           # Seed scripts (21 provinces, advanced topics, chunks)
│       ├── interactions/        # Event-sourcing (VIEW, LIKE, SAVE, RATE, SHARE)
│       ├── messages/            # 1-1 Direct Messaging + Socket.IO Gateway
│       ├── places/              # Places catalog, filtering, search, pagination
│       ├── rag/                 # Vector retrieval & KnowledgeFeedback
│       ├── recommendation/      # Bridge tới Python FastAPI ML Service
│       ├── trips/               # Trip planning + optimizer/ (TSP & 5D OFS)
│       ├── upload/              # Image upload (/uploads static serving)
│       └── users/               # User profile & onboarding preferences
├── web/                         # Next.js 16 + React 19 + TailwindCSS 4 (Port 3001)
│   └── src/app/                 # community, places, trips, messages, question-answer, profile, admin
├── mobile/                      # Flutter Mobile App (User-only, Riverpod + GoRouter)
│   ├── lib/                     # config, models, providers, repositories, screens, services, utils, widgets
│   ├── test/                    # Unit, widget & integration tests
│   └── docs/                    # Guides & development reports
├── recommendation-service/      # FastAPI + LightFM ML Service (Port 8000)
│   └── app/                     # config.py, database.py, feature_engineering.py, main.py, model.py, schemas.py
├── datasets/                    # Dữ liệu mẫu, QA 21 tỉnh, 5 chủ đề nâng cao & tourism_chunks_data.sql
├── docs/                        # API.md, architecture.md, design-system.md, postman_collection.json, PRD
└── docker-compose.yml           # Postgres (pgvector:pg16, host port 5433), Recommendation (:8000), Backend (:3002)
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Cách 1: Khởi chạy Database & Services nền với Docker Compose

File `docker-compose.yml` cung cấp PostgreSQL 16 (`pgvector`, ánh xạ cổng `5433:5432`), `recommendation-service` (`8000`) và `backend` (`3002`).

1. Tạo file `backend/.env` dựa trên `backend/.env.example`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/travel_rag"
   RECOMMENDATION_SERVICE_URL="http://localhost:8000"
   GEMINI_API_KEY="your_gemini_api_key_here"
   GEMINI_MODEL=gemini-3.5-flash-lite
   GEMINI_FALLBACK_MODEL=gemini-3.1-flash-lite
   PORT=3002
   NODE_ENV=development
   CORS_ORIGIN="http://localhost:3001"
   ```
   *(Lưu ý: khi chạy `backend` bên trong Docker Compose, `DATABASE_URL` và `RECOMMENDATION_SERVICE_URL` được truyền qua service name `postgres:5432` và `recommendation-service:8000`.)*

2. Khởi chạy containers:
   ```bash
   docker-compose up -d
   ```

### Cách 2: Chạy thủ công từng service để phát triển

#### 1. PostgreSQL (`pgvector`)
```bash
docker-compose up -d postgres
```

#### 2. Backend (NestJS — cổng `3002`)
```bash
cd backend
pnpm install
pnpm prisma migrate dev
pnpm run start:dev
```
- Swagger API Docs: `http://localhost:3002/docs` (hoặc `http://localhost:3002/api/docs`)
- Các script nạp dữ liệu tùy chọn trong `backend/package.json`:
  - `pnpm seed:admin` — seed dữ liệu cơ bản / admin
  - `pnpm seed:provinces` — nạp 420 cặp QA cho 21 tỉnh thành
  - `pnpm seed:topics` — nạp 200 cặp QA cho 5 chủ đề chuyên sâu
  - `pnpm ingest` — chạy ingestion pipeline

#### 3. Recommendation Service (FastAPI + LightFM — cổng `8000`)
```bash
cd recommendation-service
python -m venv venv
# Windows: venv\Scripts\activate  |  Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 4. Web App (Next.js 16 — cổng `3001`)
```bash
cd web
pnpm install
pnpm run dev
```
Truy cập: `http://localhost:3001`

#### 5. Mobile App (Flutter)
Xem chi tiết tại [mobile/README.md](./mobile/README.md).
```bash
cd mobile
flutter pub get
flutter run --dart-define=API_URL=http://localhost:3002
```
*(Nếu chạy trên Android Emulator kết nối localhost máy host, dùng `--dart-define=API_URL=http://10.0.2.2:3002`.)*

---

## 📊 Bộ Dữ Liệu (`datasets/`)

Xem chi tiết tại [datasets/README.md](./datasets/README.md):
- **`tourism_chunks_data.sql`**: Hơn 10.800 vector chunks tri thức du lịch trong `pgvector`.
- **`mock_users.json` / `mock_places.json` / `mock_interactions.json`**: 400 người dùng mẫu, 520 địa điểm Việt Nam (kèm tọa độ GPS, danh mục, giá ước tính) và ~7.500 tương tác.
- **`qa_21_provinces.json`**: 420 cặp QA du lịch tiếng Việt cho 21 tỉnh thành (Bắc, Trung & Tây Nguyên, Nam).
- **`qa_advanced_topics.json`**: 200 cặp QA thuộc 5 chủ đề (tuyến liên tỉnh, dự toán chi phí, phong cách/đối tượng, lưu trú/glamping, mẹo bản địa & an toàn).
- **`train_vietnam_tourism.json` & `valid_vietnam_tourism.json`**: Tập huấn luyện và kiểm thử QA du lịch Việt Nam.

---

## 🧪 Kiểm Thử & Chất Lượng Mã Nguồn

| Module | Lệnh kiểm tra |
| --- | --- |
| **Backend** | `cd backend && pnpm lint && pnpm test` (Vitest) |
| **Web** | `cd web && pnpm lint && pnpm build` |
| **Mobile** | `cd mobile && flutter analyze && flutter test && flutter build apk --debug` |

---

## 📚 Tài Liệu Tham Khảo Nội Bộ

- [docs/architecture.md](./docs/architecture.md) — Kiến trúc hệ thống
- [docs/API.md](./docs/API.md) & [docs/postman_collection.json](./docs/postman_collection.json) — Đặc tả API
- [docs/design-system.md](./docs/design-system.md) — Hệ thống thiết kế UI
- [docs/product-requirements-document.md](./docs/product-requirements-document.md) — Tài liệu yêu cầu sản phẩm (PRD)
- [mobile/README.md](./mobile/README.md) — Tài liệu chi tiết ứng dụng Mobile Flutter
