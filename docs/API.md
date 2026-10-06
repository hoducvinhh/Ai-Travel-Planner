# 📖 Tài Liệu API (API Documentation) - AI Travel Planner

Hệ thống backend cung cấp RESTful API và luồng dữ liệu thời gian thực (Server-Sent Events) phục vụ toàn bộ các tính năng của nền tảng **AI Travel Planner**.

---

## 🌐 Cổng Dịch Vụ (Base URLs)

| Dịch vụ | Môi trường Local | Công nghệ | Mô tả |
| :--- | :--- | :--- | :--- |
| **Backend API Gateway** | `http://localhost:3002` | NestJS | Quản lý dữ liệu chính, xác thực, chuyến đi, RAG chat |
| **Frontend Web** | `http://localhost:3000` | Next.js 16 | Giao diện người dùng web application |
| **Recommendation Service** | `http://localhost:8000` | FastAPI (Python) | Dịch vụ tính toán và đề xuất địa điểm bằng ML |

---

## 🔐 Xác Thực (Authentication & Authorization)

Hệ thống sử dụng **JSON Web Token (JWT)** với tiêu chuẩn RFC 7519.
- Token được gửi kèm trong Header của mỗi yêu cầu:
  ```http
  Authorization: Bearer <jwt_access_token>
  ```
- **Phân quyền người dùng (Role-Based Access Control)**:
  - `USER`: Khách hàng thông thường (tạo chuyến đi, hỏi đáp RAG, tương tác, bình luận, đăng bài).
  - `ADMIN`: Quản trị viên (quản lý địa điểm, người dùng, cập nhật trạng thái hệ thống).

---

## 1. 🔑 Auth API (`/auth`)

### 1.1 Đăng ký tài khoản
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123@",
    "name": "Nguyễn Văn A"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "role": "USER"
    },
    "accessToken": "jwt_token_string"
  }
  ```

### 1.2 Đăng nhập
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123@"
  }
  ```
- **Response**: `200 OK` (Trả về thông tin user và accessToken).

### 1.3 Lấy thông tin cá nhân hiện tại
- **Endpoint**: `GET /auth/profile`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## 2. 💬 Chatbot & RAG Q&A API (`/api/chat`)

### 2.1 Gửi tin nhắn hỏi đáp RAG (Hỗ trợ SSE Streaming)
- **Endpoint**: `POST /api/chat`
- **Header**: `Authorization: Bearer <token>` *(tùy chọn - nếu có sẽ tự liên kết với tài khoản user)*
- **Header SSE**: `Accept: text/event-stream`
- **Body**:
  ```json
  {
    "message": "Chi phí du lịch Măng Đen 3 ngày 2 đêm tự túc hết bao nhiêu?",
    "sessionId": "session-uuid" 
  }
  ```
- **Luồng dữ liệu phản hồi (SSE Events)**:
  - `event: session`: Trả về `{"sessionId": "uuid"}`.
  - `event: sources`: Trả về danh sách Top chunks tham chiếu từ pgvector:
    ```json
    {
      "sources": [
        {
          "id": "qa_cost_03",
          "title": "Dự toán chi phí Măng Đen 3N2Đ",
          "chunkType": "qa",
          "similarity": 0.942,
          "content": "...",
          "metadata": { "province": "Kon Tum", "topic": "Dự toán chi phí" }
        }
      ]
    }
    ```
  - `event: token`: Từng từ/token sinh ra từ Google Gemini LLM (`{"token": "Chi "}`).
  - `event: done`: `{"done": true}` khi hoàn tất.

### 2.2 Quản lý phiên hội thoại (Chat Sessions)
- **`GET /api/chat/sessions`**: Lấy danh sách phiên hội thoại của user hoặc khách (hỗ trợ query `?guest_ids=id1,id2`).
- **`POST /api/chat/sessions`**: Tạo phiên hội thoại mới (`{"title": "Kế hoạch đi Tây Bắc"}`).
- **`GET /api/chat/sessions/:id`**: Xem chi tiết phiên kèm toàn bộ lịch sử tin nhắn và nguồn trích dẫn.
- **`PATCH /api/chat/sessions/:id`**: Đổi tên tiêu đề phiên hội thoại (`{"title": "Tiêu đề mới"}`).
- **`DELETE /api/chat/sessions/:id`**: Xóa phiên hội thoại.

### 2.3 Kiểm tra trạng thái kho tri thức RAG
- **Endpoint**: `GET /api/chat/status`
- **Response**: `200 OK`
  ```json
  {
    "status": "online",
    "database": {
      "connected": true,
      "totalChunks": 10856,
      "breakdown": [
        { "type": "context", "count": 1386 },
        { "type": "qa", "count": 9470 }
      ]
    },
    "services": {
      "bgeM3Local": true,
      "geminiConfigured": true
    }
  }
  ```

---

## 3. 🗺️ Trips & Itinerary API (`/trips`)

### 3.1 Tạo chuyến đi & Lập lịch trình tự động bằng AI
- **Endpoint**: `POST /trips`
- **Header**: `Authorization: Bearer <token>`
- **Description**: Gọi hệ thống Recommendation Service để đề xuất địa điểm tối ưu, sau đó kết hợp Google Gemini LLM để thiết kế lịch trình chi tiết theo từng ngày (sáng/trưa/tối) bám sát ngân sách.
- **Body**:
  ```json
  {
    "destination": "Lâm Đồng",
    "startDate": "2026-11-01T00:00:00.000Z",
    "endDate": "2026-11-04T00:00:00.000Z",
    "budgetPerPerson": 5000000,
    "groupSize": 2,
    "preferences": ["Nature", "Adventure", "Photography"]
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "trip-uuid",
    "destination": "Lâm Đồng",
    "startDate": "2026-11-01T00:00:00.000Z",
    "endDate": "2026-11-04T00:00:00.000Z",
    "budgetPerPerson": 5000000,
    "groupSize": 2,
    "status": "GENERATED",
    "itinerary": {
      "summary": "Chuyến đi 4 ngày 3 đêm khám phá Đà Lạt mộng mơ",
      "totalEstimatedCost": 4200000,
      "days": [
        {
          "dayNumber": 1,
          "date": "2026-11-01",
          "notes": "Tham quan trung tâm thành phố và ngắm hoàng hôn Hồ Xuân Hương",
          "places": [
            {
              "placeId": "place-uuid-1",
              "name": "Hồ Xuân Hương",
              "estimatedTime": "2 giờ",
              "orderInDay": 1,
              "priceEstimate": 0,
              "latitude": 11.9404,
              "longitude": 108.4380
            }
          ]
        }
      ]
    }
  }
  ```

### 3.2 Lấy danh sách chuyến đi của người dùng
- **Endpoint**: `GET /trips`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (Danh sách các chuyến đi đã tạo).

### 3.3 Xem chi tiết chuyến đi
- **Endpoint**: `GET /trips/:id`
- **Header**: `Authorization: Bearer <token>`

### 3.4 Cập nhật trạng thái chuyến đi
- **Endpoint**: `PATCH /trips/:id/status`
- **Header**: `Authorization: Bearer <token>` *(ADMIN hoặc Chủ chuyến đi)*
- **Body**: `{"status": "CONFIRMED"}` (Giá trị: `DRAFT`, `GENERATED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).

### 3.5 Xóa chuyến đi
- **Endpoint**: `DELETE /trips/:id`
- **Header**: `Authorization: Bearer <token>`

---

## 4. 📍 Places API (`/places`)

### 4.1 Danh sách địa điểm du lịch (Lọc, Tìm kiếm, Phân trang)
- **Endpoint**: `GET /places`
- **Query Parameters**:
  - `page`: Trang hiện tại (mặc định: 1)
  - `limit`: Số lượng/trang (mặc định: 20)
  - `province`: Lọc theo tỉnh thành (ví dụ: `Hà Nội`, `Đà Nẵng`, `Lâm Đồng`)
  - `category`: Lọc theo danh mục (`Nature`, `Historical`, `Food`, `Culture`...)
  - `search`: Tìm theo từ khóa tên hoặc mô tả
  - `sortBy`: Sắp xếp theo `popularity` hoặc `price`
- **Response**: `200 OK` kèm tổng số bản ghi và thông tin phân trang.

### 4.2 Lấy danh sách các tỉnh thành
- **Endpoint**: `GET /places/provinces`
- **Response**: `200 OK` danh sách các tỉnh thành cùng số lượng địa điểm tương ứng.

### 4.3 Xem chi tiết một địa điểm
- **Endpoint**: `GET /places/:id?userId={userId}`
- **Response**: `200 OK` (Thông tin chi tiết, tọa độ GPS, mức giá, ảnh, đánh giá trung bình, trạng thái user đã Like/Save).

### 4.4 Thao tác Quản trị (Admin Only)
- `POST /places`: Tạo địa điểm mới.
- `PATCH /places/:id`: Cập nhật thông tin địa điểm.
- `DELETE /places/:id`: Xóa địa điểm.

---

## 5. 🎯 Recommendations API (`/recommendations`)

Cổng giao tiếp giữa Backend NestJS và Recommendation Microservice (Python/FastAPI):

### 5.1 Lấy danh sách địa điểm đề xuất bằng ML
- **Endpoint**: `POST /recommendations`
- **Body**:
  ```json
  {
    "userId": "user-uuid",
    "destination": "Lâm Đồng",
    "budgetPerPerson": 5000000,
    "days": 3,
    "groupSize": 2,
    "explicitPreferences": ["Nature", "Photography"]
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "placeIds": ["uuid-1", "uuid-2", "uuid-3"],
    "scores": [0.95, 0.88, 0.82]
  }
  ```

### 5.2 Huấn luyện lại mô hình đề xuất
- **Endpoint**: `POST /recommendations/train`
- **Response**: `200 OK` (`{"status": "success", "message": "Model trained successfully"}`)

### 5.3 Kiểm tra sức khỏe dịch vụ đề xuất
- **Endpoint**: `GET /recommendations/health`
- **Response**: `200 OK` (`{"status": "healthy", "modelStatus": "loaded"}`)

---

## 6. 👆 Interactions API (`/interactions`)

Ghi nhận hành vi người dùng để nạp vào mô hình đề xuất Machine Learning:

### 6.1 Ghi nhận sự kiện tương tác
- **Endpoint**: `POST /interactions`
- **Body**:
  ```json
  {
    "userId": "user-uuid",
    "placeId": "place-uuid",
    "eventType": "LIKE",
    "sessionId": "session-uuid",
    "ratingValue": 5.0
  }
  ```
- **Loại sự kiện & Trọng số**:
  - `VIEW_DETAIL` (weight: 1.0)
  - `LIKE` (weight: 5.0)
  - `SAVE` (weight: 5.0)
  - `REMOVE_SAVE` (weight: -2.0)
  - `RATE` (weight: công thức điểm đánh giá)
  - `SHARE` (weight: 3.0)

### 6.2 Tra cứu tương tác
- **`GET /interactions/user/:userId/saved`**: Danh sách địa điểm đã lưu.
- **`GET /interactions/user/:userId/liked`**: Danh sách địa điểm đã thích.
- **`GET /interactions/place/:placeId/ratings`**: Thống kê đánh giá của một địa điểm.
- **`GET /interactions/user/:userId/stats`**: Thống kê số lượng từng loại hành động của user.

---

## 7. 💬 Comments & Community API

### 7.1 Bình luận địa điểm (`/places/:placeId/comments`)
- **`GET /places/:placeId/comments`**: Xem danh sách bình luận của địa điểm.
- **`POST /places/:placeId/comments`**: Thêm bình luận (`{"content": "Cảnh rất đẹp, nên đi vào sáng sớm"}`).
- **`DELETE /comments/:id`**: Xóa bình luận của chính mình.

### 7.2 Bài viết cộng đồng (`/community/posts`)
- **`GET /community/posts`**: Xem bảng tin bài viết cộng đồng (lọc theo `tag`, `search`, phân trang).
- **`POST /community/posts`**: Đăng bài viết chia sẻ kinh nghiệm (`{"title": "...", "content": "...", "tags": ["Đà Lạt", "Review"]}`).
- **`POST /community/posts/:id/like`**: Thả tim/bỏ thả tim bài viết.
- **`GET /community/posts/:id/comments`**: Xem bình luận trên bài viết.
- **`POST /community/posts/:id/comments`**: Bình luận bài viết.

---

## 8. 👤 Users API (`/users`)

- **`GET /users/:id/profile`**: Xem hồ sơ người dùng (phong cách yêu thích, ngân sách ưu tiên, số chuyến đi, số địa điểm đã lưu).
- **`PATCH /users/:id/profile`**: Cập nhật hồ sơ (`preferredStyles`, `budgetLevel`, `name`).
- **`GET /users`** *(Admin)*: Danh sách toàn bộ tài khoản có phân trang và tìm kiếm.
