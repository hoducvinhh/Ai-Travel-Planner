# 🚀 HƯỚNG DẪN CHẠY CHO PNPM + GIT BASH

## Cách 1: Chạy Script Tự Động

```bash
cd "Z:\Learn_Programming\DATN - AI Travel Planner"

# Cho phép chạy script
chmod +x setup_pnpm.sh

# Chạy setup
./setup_pnpm.sh
```

## Cách 2: Chạy Từng Lệnh Thủ Công

### Bước 1: Cài Backend Dependencies
```bash
cd backend
pnpm install
cd ..
```

### Bước 2: Setup Environment
```bash
cd backend
cp .env.example .env

# Mở và thêm GEMINI_API_KEY
code .env
# Hoặc: notepad .env
```

Thêm vào file:
```env
GEMINI_API_KEY=your_actual_key_here
```

Lấy key tại: https://ai.google.dev/

### Bước 3: Start PostgreSQL
```bash
cd ..
docker-compose up -d postgres

# Đợi database khởi động
sleep 10
```

### Bước 4: Chạy Migration
```bash
cd backend
pnpm prisma migrate dev --name init
pnpm prisma generate
cd ..
```

### Bước 5: Cài Python Dependencies
```bash
cd recommendation-service
pip install -r requirements.txt
cp .env.example .env
```

### Bước 6: Generate Mock Data
```bash
python generate_mock_data.py
python load_mock_data.py
cd ..
```

---

## Start Services (3 Terminals)

### Terminal 1: Recommendation Service
```bash
cd recommendation-service
uvicorn app.main:app --reload
```

### Terminal 2: Train Model (đợi Terminal 1 chạy xong)
```bash
# Đợi ~10 giây sau khi Terminal 1 start
sleep 10

# Train model
curl -X POST http://localhost:8000/train

# Đợi training hoàn tất (~2-3 phút)
```

### Terminal 3: Backend (đợi training xong)
```bash
cd backend
pnpm run start:dev
```

---

## Kiểm Tra

```bash
# Check recommendation service
curl http://localhost:8000/health

# Check backend
curl http://localhost:3000/recommendations/health

# Xem API docs
# Mở browser: http://localhost:8000/docs
```

---

## Test Thử Tạo Trip

### 1. Lấy User ID
```bash
cd recommendation-service
python -c "import json; print(json.load(open('mock_users.json'))[0]['id'])"
```

Copy user ID, ví dụ: `abc123-456-789`

### 2. Tạo Trip
```bash
curl -X POST http://localhost:3000/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123-456-789",
    "destination": "Lam Dong",
    "startDate": "2026-11-01T00:00:00.000Z",
    "endDate": "2026-11-04T00:00:00.000Z",
    "budgetPerPerson": 5000000,
    "groupSize": 2,
    "preferences": ["Nature", "Adventure"]
  }'
```

Nếu thành công, bạn sẽ nhận được JSON với itinerary!

---

## Xử Lý Lỗi

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "python: command not found"
Cài Python từ: https://www.python.org/downloads/

### "docker: command not found"
Cài Docker Desktop: https://www.docker.com/products/docker-desktop

### "Port already in use"
```bash
# Tìm process
netstat -ano | findstr :3000

# Kill process (thay PID)
taskkill //PID <PID> //F
```

---

## Tóm Tắt Commands Nhanh

```bash
# 1. Setup (1 lần)
./setup_pnpm.sh

# 2. Start services (mỗi lần code)
# Terminal 1
cd recommendation-service && uvicorn app.main:app --reload

# Terminal 2 (sau 10s)
curl -X POST http://localhost:8000/train

# Terminal 3 (sau khi train xong)
cd backend && pnpm run start:dev

# 3. Test
curl http://localhost:3000/recommendations/health
```

---

## Import Postman

1. Mở Postman
2. File → Import → `docs/postman_collection.json`
3. Set variables:
   - `baseUrl`: `http://localhost:3000`
   - `userId`: lấy từ mock_users.json
   - `placeId`: lấy từ mock_places.json

---

Bây giờ bạn có thể bắt đầu! Chạy lệnh nào bạn muốn tôi giúp? 🚀
