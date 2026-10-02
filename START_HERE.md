# 🎯 CHẠY DỰ ÁN NGAY - 1 LỆNH DUY NHẤT

## 🚀 Cách Nhanh Nhất (Git Bash)

```bash
cd "Z:\Learn_Programming\DATN - AI Travel Planner"
chmod +x install.sh
./install.sh
```

## 🚀 Cách Nhanh Nhất (Windows CMD)

```cmd
cd "Z:\Learn_Programming\DATN - AI Travel Planner"
install.bat
```

---

## ✅ Script Sẽ Làm Gì?

1. ✅ Kiểm tra Node.js, pnpm, Python, Docker
2. ✅ Cài tất cả dependencies (backend + Python)
3. ✅ Tạo file .env
4. ✅ Khởi động PostgreSQL
5. ✅ Chạy database migration
6. ✅ **Sinh 400 users + 200 places + 15,000 interactions**
7. ✅ **Load tất cả mock data vào database**

---

## 📝 Chuẩn Bị Trước Khi Chạy

### 1. Lấy Gemini API Key (MIỄN PHÍ)

1. Truy cập: https://ai.google.dev/
2. Đăng nhập Google
3. Click "Get API Key"
4. Copy key

### 2. Cài Đặt Prerequisites

**Nếu chưa có:**

- Node.js: https://nodejs.org/ (LTS version)
- Python: https://www.python.org/downloads/ (3.11+)
- Docker Desktop: https://www.docker.com/products/docker-desktop

---

## 🎬 Sau Khi Chạy install.sh/install.bat

Script sẽ dừng và bảo bạn thêm API key vào `backend/.env`:

```env
GEMINI_API_KEY=AIza...your_key_here
```

Sau đó nhấn Enter để tiếp tục.

---

## 🖥️ Start Services (3 Terminals)

### Terminal 1: Recommendation Service

```bash
cd recommendation-service
uvicorn app.main:app --reload
```

**Đợi thấy:** `Application startup complete`

---

### Terminal 2: Train Model (Đợi 10 giây sau Terminal 1)

```bash
curl -X POST http://localhost:8000/train
```

**Đợi 2-3 phút** để training hoàn tất. Bạn sẽ thấy:
```json
{
  "status": "success",
  "message": "Model trained successfully",
  "stats": {
    "users": 400,
    "places": 200,
    "interactions": 15000
  }
}
```

---

### Terminal 3: Backend (Sau khi training xong)

```bash
cd backend
pnpm run start:dev
```

**Đợi thấy:** `Nest application successfully started`

---

## ✅ Kiểm Tra Hệ Thống

```bash
# Check recommendation service
curl http://localhost:8000/health

# Check backend
curl http://localhost:3000/recommendations/health

# Mở browser
# http://localhost:8000/docs - Swagger API docs
```

---

## 🧪 Test Tạo Trip Đầu Tiên

### 1. Lấy User ID

```bash
cd recommendation-service
python -c "import json; print(json.load(open('mock_users.json'))[0]['id'])"
```

Ví dụ output: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### 2. Tạo Trip

```bash
curl -X POST http://localhost:3000/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "PASTE_USER_ID_HERE",
    "destination": "Lam Dong",
    "startDate": "2026-11-01T00:00:00.000Z",
    "endDate": "2026-11-04T00:00:00.000Z",
    "budgetPerPerson": 5000000,
    "groupSize": 2,
    "preferences": ["Nature", "Adventure"]
  }'
```

Bạn sẽ nhận được **lịch trình 3 ngày đầy đủ** với các địa điểm được ML gợi ý!

---

## 📦 Import Postman Collection

1. Mở Postman
2. File → Import
3. Chọn: `docs/postman_collection.json`
4. Set environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `userId`: Copy từ mock_users.json
   - `placeId`: Copy từ mock_places.json

---

## 🔧 Xử Lý Lỗi

### "Port already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### "Docker not running"

Mở Docker Desktop và đợi nó khởi động xong.

### "pnpm not found"

```bash
npm install -g pnpm
```

### Training fails

```bash
# Kiểm tra recommendation service
curl http://localhost:8000/health

# Nếu not ready, restart
cd recommendation-service
uvicorn app.main:app --reload
```

---

## 📊 Kiểm Tra Database

Kết nối PostgreSQL:
- Host: `localhost`
- Port: `5432`
- Database: `travel_planner`
- User: `postgres`
- Password: `postgres`

```bash
# Xem số lượng records
docker exec -it travel_planner_postgres psql -U postgres -d travel_planner -c "SELECT COUNT(*) FROM users;"
docker exec -it travel_planner_postgres psql -U postgres -d travel_planner -c "SELECT COUNT(*) FROM places;"
docker exec -it travel_planner_postgres psql -U postgres -d travel_planner -c "SELECT COUNT(*) FROM user_interaction_events;"
```

Kết quả mong đợi:
- Users: 400
- Places: 200
- Interactions: 15000

---

## 🎯 Tóm Tắt

```bash
# Bước 1: Cài đặt (1 lần duy nhất)
./install.sh     # hoặc install.bat

# Bước 2: Start services (3 terminals)
# Terminal 1
cd recommendation-service && uvicorn app.main:app --reload

# Terminal 2 (đợi 10s)
curl -X POST http://localhost:8000/train

# Terminal 3 (đợi training xong)
cd backend && pnpm run start:dev

# Bước 3: Enjoy!
# API: http://localhost:3000
# Docs: http://localhost:8000/docs
```

---

## 📚 Tài Liệu

- **IMPLEMENTATION_SUMMARY.md** - Hiểu toàn bộ hệ thống
- **docs/API.md** - Tài liệu API chi tiết
- **CHECKLIST.md** - Track tiến độ thesis
- **PNPM_GUIDE.md** - Hướng dẫn pnpm chi tiết

---

## 🎉 Xong!

Hệ thống đã sẵn sàng! Giờ bạn có thể:

1. ✅ Test các API endpoint
2. ✅ Xem mock data trong database
3. ✅ Bắt đầu code frontend (Next.js)
4. ✅ Thêm features mới
5. ✅ Viết thesis

**Good luck with your thesis! 🚀**
