# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN NHANH

## Cách Nhanh Nhất (3 Bước)

### 1. Chạy Setup Tự Động
```bash
auto_setup.bat
```

**Script này sẽ:**
- ✅ Cài đặt tất cả dependencies (Node.js + Python)
- ✅ Tạo file .env
- ✅ Khởi động PostgreSQL
- ✅ Chạy database migration
- ✅ Sinh và load mock data

⚠️ **QUAN TRỌNG:** Khi script yêu cầu, hãy:
1. Mở `backend\.env`
2. Thêm Gemini API key của bạn:
   ```
   GEMINI_API_KEY=AIza...
   ```
3. Lấy key tại: https://ai.google.dev/
4. Nhấn Enter để tiếp tục

### 2. Start Tất Cả Services
```bash
start_services.bat
```

**Script này sẽ mở 2 terminal:**
- Terminal 1: Recommendation Service (port 8000)
- Terminal 2: Backend Service (port 3000)

Và tự động train model ML.

### 3. Test Hệ Thống
```bash
test_system.bat
```

---

## Nếu Gặp Lỗi

### Lỗi: "Docker is not running"
```bash
# Mở Docker Desktop và đợi khởi động
# Sau đó chạy lại auto_setup.bat
```

### Lỗi: "Port already in use"
```bash
# Tìm và kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Lỗi: "pip: command not found"
```bash
# Cài Python từ: https://www.python.org/downloads/
# Nhớ check "Add Python to PATH"
```

### Lỗi: "npm: command not found"
```bash
# Cài Node.js từ: https://nodejs.org/
```

---

## Test API Thủ Công

### 1. Check Health
```bash
curl http://localhost:8000/health
curl http://localhost:3000/recommendations/health
```

### 2. Tạo Trip Mẫu

Lấy user ID từ mock data:
```bash
cd recommendation-service
python -c "import json; print(json.load(open('mock_users.json'))[0]['id'])"
```

Tạo trip (thay USER_ID):
```bash
curl -X POST http://localhost:3000/trips ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"USER_ID\",\"destination\":\"Lam Dong\",\"startDate\":\"2026-11-01T00:00:00.000Z\",\"endDate\":\"2026-11-04T00:00:00.000Z\",\"budgetPerPerson\":5000000,\"groupSize\":2,\"preferences\":[\"Nature\",\"Adventure\"]}"
```

---

## Import Postman Collection

1. Mở Postman
2. File → Import
3. Chọn: `docs/postman_collection.json`
4. Set biến:
   - `baseUrl` = `http://localhost:3000`
   - `userId` = lấy từ mock_users.json
   - `placeId` = lấy từ mock_places.json

---

## Tóm Tắt

```bash
# 1. Setup (chỉ chạy 1 lần)
auto_setup.bat

# 2. Start services (mỗi lần code)
start_services.bat

# 3. Test
test_system.bat
```

**Xong! Hệ thống sẵn sàng tại:**
- 🐍 Recommendation API: http://localhost:8000/docs
- 🟢 Backend API: http://localhost:3000
- 🐘 PostgreSQL: localhost:5432

---

## Dừng Services

Đóng 2 terminal windows, hoặc:
```bash
# Dừng tất cả containers
docker-compose down
```

---

## Next Steps

1. ✅ Test tất cả endpoints bằng Postman
2. ✅ Xem dữ liệu trong PostgreSQL
3. ✅ Bắt đầu code frontend (Next.js)
4. ✅ Đọc `IMPLEMENTATION_SUMMARY.md` để hiểu flow
5. ✅ Đọc `CHECKLIST.md` để track progress

**Chúc may mắn! 🎉**
