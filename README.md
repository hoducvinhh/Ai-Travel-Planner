# 🌍 AI Travel Planner - Hệ Thống Lập Kế Hoạch Du Lịch Thông Minh

> Đồ án tốt nghiệp sử dụng Machine Learning và Large Language Model để tạo lịch trình du lịch cá nhân hóa

## 📋 Tổng Quan

AI Travel Planner là hệ thống gợi ý du lịch thông minh kết hợp:
- **Machine Learning (LightFM)** - Hybrid Recommendation System (Collaborative + Content-Based Filtering)
- **Large Language Model (Gemini)** - Tự động tạo lịch trình theo ngày
- **RAG Chatbot** - Hỏi đáp về thông tin du lịch với pgvector
- **Interactive Map** - Leaflet với routing và visualization

## ✨ Tính Năng Chính

### 1. 🎯 Travel Planner
- Nhập điểm đến, ngân sách, số người, sở thích
- ML model gợi ý top 50 địa điểm phù hợp nhất
- LLM tự động tạo itinerary chi tiết theo từng ngày
- Bản đồ tương tác với markers và routing

### 2. 💬 Chatbot RAG
- Hỏi đáp thông tin du lịch Việt Nam
- RAG với BGE-M3 embeddings + pgvector
- Trích dẫn nguồn tự động
- Streaming response real-time

### 3. 📊 Personalization
- Event-sourcing architecture: track VIEW, LIKE, SAVE, RATE
- Time decay: interaction cũ giảm trọng số theo thời gian
- Cold start handling: fallback to content-based cho user mới
- Continuous learning: model học từ hành vi thực tế

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Trip Planner │  │  Trip Detail │  │  RAG Chatbot │       │
│  │   (Wizard)   │  │  (Map/List)  │  │  (Streaming) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────┐
│                   Backend (NestJS)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Trips Module │  │  Gemini LLM  │  │  RAG Module  │       │
│  └──────┬───────┘  └──────────────┘  └──────────────┘       │
│         │                                                     │
│  ┌──────┴─────────────────┐                                  │
│  │ Recommendation Module  │─────────────┐                    │
│  └────────────────────────┘             │ HTTP               │
└────────────────┬────────────────────────┴────────────────────┘
                 │                        │
        ┌────────┴────────┐      ┌───────┴──────────┐
        │   PostgreSQL    │      │  Python FastAPI  │
        │   + pgvector    │      │  LightFM Model   │
        │                 │      │  (ML Service)    │
        └─────────────────┘      └──────────────────┘
```

## 🧠 Machine Learning Pipeline

### 1. Data Collection (Event-Sourcing)
```
User Interaction → UserInteractionEvent table
                → Aggregated to UserPlacePreference
```

### 2. Feature Engineering
- **User Features**: Interaction history với time decay (λ=0.05)
- **Place Features**: Categories (multi-hot), price, popularity
- **Interaction Weighting**: VIEW=1, LIKE=5, SAVE=5, RATE=(r-3)*2

### 3. Model Architecture (LightFM)
- Hybrid: Collaborative Filtering + Content-Based
- Loss: WARP (Weighted Approximate-Rank Pairwise)
- User embeddings: 64 dims
- Item embeddings: 64 dims

### 4. Inference Pipeline
```
User Input
    ↓
Candidate Generation (SQL Filter by destination)
    ↓
ML Ranking (LightFM scores top 50 places)
    ↓
Business Rules (Budget, Diversity constraints)
    ↓
LLM Itinerary Generation (Gemini creates day-by-day plan)
    ↓
Frontend Display (Map + Timeline)
```

## 🎨 Frontend Stack

- **Framework**: Next.js 16 (App Router, Server/Client Components)
- **UI**: React 19, TailwindCSS 4
- **Map**: Leaflet với custom markers và routing
- **State**: React hooks (useState, useEffect)
- **API**: Fetch với environment variables

## 🔧 Backend Stack

- **Framework**: NestJS với TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 14 + pgvector extension
- **LLM**: Google Gemini API
- **Embeddings**: BGE-M3 (1024 dims) cho RAG
- **Architecture**: Module-based, Dependency Injection

## 🐍 ML Service Stack

- **API**: FastAPI
- **Model**: LightFM (hybrid recommendation)
- **Processing**: NumPy, Pandas, scikit-learn
- **Database**: SQLAlchemy với PostgreSQL

## 📂 Cấu Trúc Thư Mục

```
ai-travel-planner/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── chat/           # RAG chatbot module
│   │   ├── trips/          # Trip management + LLM
│   │   ├── recommendation/ # ML service integration
│   │   ├── interactions/   # User behavior tracking
│   │   └── prisma/         # Database schema
│   └── prisma/
│       └── schema.prisma
├── frontend/               # Next.js frontend
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx              # Landing page
│   │       ├── trips/
│   │       │   ├── page.tsx          # Trips list
│   │       │   ├── new/page.tsx      # Create trip wizard
│   │       │   └── [id]/
│   │       │       ├── page.tsx      # Trip detail
│   │       │       └── MapComponent.tsx
│   │       └── question-answer/      # RAG chatbot
│   └── public/
├── recommendation-service/ # Python ML service
│   ├── app/
│   │   ├── model.py               # LightFM training
│   │   ├── feature_engineering.py # Feature pipeline
│   │   └── main.py               # FastAPI endpoints
│   └── generate_mock_data.py     # Mock data generator
├── SETUP.md               # Setup instructions
└── README.md              # This file
```

## 🚀 Quick Start

Xem file [SETUP.md](./SETUP.md) để biết hướng dẫn chi tiết.

### TL;DR

```bash
# 1. Start PostgreSQL (Docker)
docker-compose up -d

# 2. Backend
cd backend
pnpm install
pnpm prisma migrate dev
pnpm run start:dev

# 3. Python ML Service
cd recommendation-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python generate_mock_data.py
uvicorn app.main:app --reload --port 8000

# 4. Frontend
cd frontend
pnpm install
pnpm run dev
```

Mở: `http://localhost:3001`

## 📊 Dataset

- **Places**: 200 địa điểm thực tế tại Việt Nam (Đà Lạt, Hà Nội, TP.HCM, Đà Nẵng, Nha Trang, Phú Quốc, Hội An, Huế, Sapa, Hạ Long)
- **Users**: 400 user profiles với diverse personas
- **Interactions**: 15,000+ interactions (VIEW, LIKE, SAVE, RATE) được simulate bằng rule-based logic

## 🎓 Đồ Án Tốt Nghiệp

**Mục tiêu nghiên cứu:**
- So sánh hiệu quả của Hybrid Recommendation (LightFM) vs Pure Collaborative/Content-Based
- Đánh giá impact của Time Decay trong travel domain
- Phân tích vai trò của LLM trong multi-constraint planning (budget, distance, time, diversity)

**Metrics đánh giá:**
- Precision@K, Recall@K cho recommendation
- User satisfaction survey cho generated itineraries
- Diversity score (entropy of categories)
- Budget constraint satisfaction rate

## 🔮 Future Work

- [ ] Authentication (JWT, OAuth)
- [ ] Real-time collaboration (WebSocket)
- [ ] Mobile app (React Native)
- [ ] A/B testing framework
- [ ] Model monitoring & retraining pipeline
- [ ] Multi-language support
- [ ] Integration với booking APIs

## 📝 License

MIT License - Free for academic use

## 👥 Contributors

Đồ án tốt nghiệp - AI Travel Planner
