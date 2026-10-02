# 🚀 Hướng Dẫn Chạy Dự Án AI Travel Planner

## Yêu Cầu Hệ Thống

- Node.js 18+ và pnpm
- Python 3.11 (cho ML service)
- PostgreSQL 14+ (đang chạy trong Docker)
- Git Bash hoặc terminal tương tự

## Cấu Trúc Dự Án

```
.
├── backend/          # NestJS API server
├── frontend/         # Next.js 16 + React 19 UI
└── recommendation-service/  # Python FastAPI ML service
```

## Bước 1: Chuẩn Bị Database

PostgreSQL đã chạy trong Docker tại port 5432 với database `travel_planner`.

### Migration Database

```bash
cd backend
pnpm prisma migrate dev
```

### Generate Mock Data (400 users, 200 places, 15000 interactions)

```bash
cd recommendation-service
python generate_mock_data.py
```

## Bước 2: Khởi Động Backend (NestJS)

```bash
cd backend
pnpm install
pnpm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### API Endpoints:

- `POST /trips` - Tạo trip mới
- `GET /trips?userId=xxx` - Lấy danh sách trips
- `GET /trips/:id` - Lấy chi tiết trip
- `POST /recommendation/recommendations` - Gọi ML service
- `POST /chat/stream` - RAG chatbot

## Bước 3: Khởi Động Python ML Service

```bash
cd recommendation-service

# Tạo virtual environment (Python 3.11)
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

ML Service sẽ chạy tại: `http://localhost:8000`

### API Endpoints:

- `POST /recommend` - Lấy recommendations từ LightFM model
- `POST /train` - Train lại model

## Bước 4: Khởi Động Frontend (Next.js)

```bash
cd frontend
pnpm install
pnpm run dev
```

Frontend sẽ chạy tại: `http://localhost:3001`

⚠️ **LÚU Ý:** Nếu frontend báo lỗi kết nối, kiểm tra:
- File `.env.local` có `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Backend đang chạy tại đúng port 3000

## Kiểm Tra Hệ Thống

### Test Backend API:

```bash
curl http://localhost:3000/trips?userId=demo-user-id
```

### Test ML Service:

```bash
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "destination": "Da Lat",
    "budgetPerPerson": 5000000,
    "days": 3,
    "groupSize": 2,
    "monthOfYear": 10,
    "explicitPreferences": ["nature", "food"]
  }'
```

### Test Frontend:

1. Mở browser: `http://localhost:3001`
2. Click "Lập Kế Hoạch Du Lịch"
3. Điền form 3 bước
4. Submit và xem itinerary được generate

## Luồng Hoạt Động

```
User (Frontend)
    ↓
NestJS Backend (Port 3000)
    ↓
Python ML Service (Port 8000) → LightFM Model
    ↓
NestJS Backend → Gemini LLM
    ↓
PostgreSQL Database
    ↓
Frontend (Hiển thị kết quả + Leaflet Map)
```

## Troubleshooting

### Lỗi "Cannot connect to database"
- Kiểm tra PostgreSQL đang chạy: `docker ps`
- Kiểm tra DATABASE_URL trong `backend/.env`

### Lỗi "Module not found: leaflet"
- Chạy `pnpm install` trong thư mục frontend
- Restart dev server

### Lỗi "localhost:3001 cho biết..."
- Đảm bảo backend đang chạy tại port 3000
- Kiểm tra file `frontend/.env.local` có đúng API URL

### Python ML service lỗi
- Đảm bảo dùng Python 3.11 (không phải 3.14)
- Activate virtual environment trước khi chạy
- LightFM yêu cầu build tools: `pip install wheel setuptools`

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/travel_planner"
PORT=3000
GEMINI_API_KEY=your_key_here
RECOMMENDATION_SERVICE_URL=http://localhost:8000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS 4, Leaflet
- **Backend:** NestJS, Prisma, PostgreSQL, pgvector
- **ML Service:** Python FastAPI, LightFM, NumPy, Pandas
- **LLM:** Google Gemini API
- **Embeddings:** BGE-M3 (cho RAG chatbot)

## Liên Hệ

Đồ án tốt nghiệp - AI Travel Planner
