# 📋 Tài Liệu Yêu Cầu Sản Phẩm (Product Requirements Document - PRD)
## Nền Tảng Lập Kế Hoạch Du Lịch & Trợ Lý AI Du Lịch Việt Nam (AI Travel Planner)

- **Tên dự án**: AI Travel Planner (Đồ Án Tốt Nghiệp)
- **Phiên bản**: 2.0.0
- **Trạng thái**: Hoàn thiện & Đang phát triển tích hợp
- **Chủ sở hữu**: Nhóm ĐATN - AI Travel Planner
- **Công nghệ cốt lõi**: Next.js 16, NestJS, FastAPI (Python), PostgreSQL 16 + pgvector, Xenova/bge-m3 ONNX Local, Google Gemini API, Docker Compose, pnpm

---

## 1. Bối Cảnh & Vấn Đề Thực Tế (Problem Statement & Context)

### 1.1 Những Khó Khăn Của Du Khách Khi Lên Kế Hoạch Du Lịch
1. **Lên lịch trình thủ công tốn nhiều thời gian và công sức**: Việc sắp xếp lịch trình 3 - 5 ngày sao cho tối ưu cung đường di chuyển, phù hợp với ngân sách gia đình/cá nhân và đáp ứng đúng sở thích (khám phá, nghỉ dưỡng, ẩm thực) đòi hỏi người dùng phải tra cứu hàng giờ trên nhiều website khác nhau.
2. **Thông tin du lịch phân tán và thiếu độ tin cậy**: Rất nhiều thông tin về giá vé, cách di chuyển qua các cung đèo dốc hiểm trở, hoặc địa điểm lưu trú trên mạng xã hội đã lỗi thời hoặc thiếu chính xác.
3. **Hiện tượng ảo giác (Hallucination) của các AI phổ thông**: Khi hỏi về thông tin các tỉnh thành nhỏ hoặc đặc sản địa phương tại Việt Nam, các mô hình ngôn ngữ lớn thường bịa đặt địa danh hoặc nhầm lẫn giữa các vùng miền.
4. **Thiếu tính cá nhân hóa trong đề xuất**: Các gợi ý tour truyền thống thường mang tính đại trà, không dựa trên hành vi, tương tác và phong cách du lịch thực tế của từng cá nhân.

### 1.2 Giải Pháp Của AI Travel Planner
Hệ thống **AI Travel Planner** giải quyết trọn vẹn các bài toán trên thông qua sự kết hợp của 3 trụ cột công nghệ:
- **Bộ máy Lập lịch trình Thông minh (Intelligent Multi-Day Trip Planner)**: Tự động phân bổ địa điểm tham quan theo từng ngày (sáng, trưa, tối), tính toán ngân sách dự kiến và tối ưu cung đường di chuyển dựa trên ràng buộc của người dùng.
- **Hệ thống Gợi ý Cá nhân hóa (Hybrid Recommendation Service)**: Sử dụng Machine Learning (Collaborative Filtering & Content-Based) kết hợp trọng số tương tác theo thời gian thực để xếp hạng và đề xuất địa điểm phù hợp nhất.
- **Trợ lý RAG Du lịch Việt Nam Chuyên sâu (Vietnam Tourism RAG AI)**: Hệ thống Retrieval-Augmented Generation với kho tri thức hơn **10.856 vector chunks** phủ sóng toàn bộ **63 tỉnh thành Việt Nam** và **10 nhóm chủ đề du lịch chuyên sâu**, nhúng vector cục bộ bằng **BAAI/bge-m3** (1024 chiều) và sinh câu trả lời mượt mà bằng **Google Gemini LLM** kèm trích dẫn nguồn minh bạch.

---

## 2. Mục Tiêu Sản Phẩm & Chỉ Số Đo Lường (Product Goals & KPIs)

| Mục tiêu | Mô tả | Chỉ số đo lường (KPI) |
| :--- | :--- | :--- |
| **Lập tour tự động thông minh** | Sinh lịch trình du lịch nhiều ngày hoàn chỉnh theo đúng ngân sách và sở thích | Thời gian tạo tour < 5 giây; độ hài lòng lịch trình > 90% |
| **Độ chính xác tri thức RAG** | Trả lời chính xác thông tin về địa danh, văn hóa, chi phí trên 63 tỉnh thành | Tỷ lệ trích dẫn chuẩn xác từ kho dữ liệu > 95% |
| **Tốc độ phản hồi tức thì** | Phản hồi streaming câu trả lời qua SSE | Thời gian hiển thị token đầu tiên < 1.2 giây |
| **Khả năng cá nhân hóa** | Đề xuất địa điểm bám sát lịch sử tương tác và hồ sơ cá nhân | Tỷ lệ nhấp và lưu địa điểm được đề xuất (CTR/Save rate) > 25% |
| **Trải nghiệm thẩm mỹ cao cấp** | Giao diện Dark Aesthetic sang trọng phong cách Emerald & Slate | Đạt chuẩn thiết kế hiện đại, responsive 100% trên thiết bị di động |

---

## 3. Chân Dung Người Dùng (User Personas)

### Persona 1: Bạn Trẻ Đam Mê Phượt & Trải Nghiệm (Explorer / Backpacker)
- **Nhu cầu**: Tìm kiếm các cung đường phượt liên tỉnh độc đáo (Tây Bắc, Đông Bắc, Tây Nguyên), mẹo vượt đèo an toàn, homestay bản địa, chi phí tiết kiệm.
- **Giải pháp**: Tab RAG "Tuyến Cung Đường Liên Tỉnh" & "Mẹo Bản Địa & Đèo Dốc" cung cấp lộ trình chi tiết từng ngày và lưu ý an toàn cụ thể.

### Persona 2: Người Lên Kế Hoạch Chuyến Đi Cho Gia Đình (Family Trip Organizer)
- **Nhu cầu**: Cần một lịch trình thư thả, an toàn, có các điểm phù hợp cho cả trẻ nhỏ và người lớn tuổi, dự toán chi phí chi tiết trước khi xuất phát.
- **Giải pháp**: Tính năng tạo Trip tự động lọc địa điểm có `activityLevel: low/medium`, tính tổng chi phí theo số lượng thành viên.

### Persona 3: Du Khách Tìm Kiếm Kỳ Nghỉ Nghỉ Dưỡng & Ẩm Thực (Foodie & Luxury)
- **Nhu cầu**: Khám phá các khu nghỉ dưỡng cao cấp, tắm khoáng onsen, glamping view đồi mây và các món ngon ẩm thực trứ danh.
- **Giải pháp**: Chủ đề RAG "Cẩm Nang Lưu Trú & Glamping" và danh mục địa điểm lọc theo thẻ `Food`, `Resort`, `Nature`.

---

## 4. Yêu Cầu Chức Năng Chi Tiết (Functional Requirements)

### FR1: Quản Lý Người Dùng & Hồ Sơ Cá Nhân (Auth & Profiles)
- **FR1.1**: Đăng ký và đăng nhập bảo mật bằng JWT và mã hóa mật khẩu bcrypt.
- **FR1.2**: Khởi tạo và cập nhật hồ sơ sở thích du lịch (`preferredStyles`: Thiên nhiên, Lịch sử, Văn hóa, Ẩm thực...) và mức ngân sách ưu tiên (`budgetLevel`: Tiết kiệm, Tiêu chuẩn, Cao cấp).

### FR2: Lập Kế Hoạch Chuyến Đi Tự Động (Trip & Itinerary Generator)
- **FR2.1**: Tiếp nhận các thông số chuyến đi: Điểm đến (tỉnh thành), ngày bắt đầu & kết thúc, ngân sách/người, số lượng người, danh mục sở thích.
- **FR2.2**: Tự động gọi sang Recommendation Service để lấy danh sách địa điểm phù hợp nhất.
- **FR2.3**: Ứng dụng Google Gemini LLM để xâu chuỗi các địa điểm thành lịch trình từng ngày (Buổi sáng, Buổi chiều, Buổi tối), ước lượng thời gian tham quan và phân bổ chi phí.
- **FR2.4**: Quản lý trạng thái chuyến đi: Dự thảo (`DRAFT`), Đã sinh lịch trình (`GENERATED`), Đã xác nhận (`CONFIRMED`), Hoàn thành (`COMPLETED`).

### FR3: Trợ Lý Hỏi Đáp Du Lịch RAG (Vietnam Tourism RAG AI)
- **FR3.1**: Hỏi đáp thông minh với kho dữ liệu **10.856+ vector chunks** phủ sóng 63 tỉnh thành.
- **FR3.2**: Tích hợp **10 Nhóm Chủ Đề Du Lịch Tuyển Chọn**:
  - *5 Nhóm Trụ Cột*: Văn hóa & Di sản, Thủ đô Hà Nội, Kỳ quan Thiên nhiên, Ẩm thực & Đặc sản, Biển đảo & Miền Trung.
  - *5 Nhóm Chuyên Sâu*: Tuyến Cung đường Liên tỉnh, Dự toán Chi phí & Giá vé, Du lịch theo Đối tượng & Phong cách, Cẩm nang Lưu trú & Glamping, Mẹo Bản địa & An toàn Đèo dốc.
- **FR3.3**: Quản lý phiên hội thoại (`ChatSession` & `ChatMessage`), hỗ trợ hỏi đáp đa lượt có trí nhớ ngữ cảnh (Multi-turn Memory).
- **FR3.4**: Truyền dữ liệu thời gian thực dạng SSE (Server-Sent Events) với hiệu ứng gõ chữ trực quan.
- **FR3.5**: Minh bạch thông tin với Accordion trích dẫn Top 5 nguồn tham chiếu và điểm số tương thích (`% Match`).

### FR4: Khám Phá Địa Điểm & Tương Tác Người Dùng (Places & Interactions)
- **FR4.1**: Danh mục hơn **520 địa điểm du lịch thực tế** tại Việt Nam kèm hình ảnh, mức giá tham khảo, tọa độ GPS, mức độ vận động và phân loại trong nhà/ngoài trời.
- **FR4.2**: Lọc địa điểm linh hoạt theo Tỉnh thành, Danh mục, Từ khóa và Độ phổ biến.
- **FR4.3**: Ghi nhận hành vi tương tác người dùng: Xem chi tiết (`VIEW_DETAIL`), Yêu thích (`LIKE`), Lưu lại (`SAVE`), Đánh giá (`RATE`), Chia sẻ (`SHARE`).
- **FR4.4**: Bình luận và chia sẻ cảm nhận thực tế trên từng địa điểm.

### FR5: Dịch Vụ Gợi Ý Học Máy (ML Recommendation Service)
- **FR5.1**: Thuật toán Matrix Factorization & Collaborative Filtering tính toán độ tương đồng giữa người dùng và địa điểm.
- **FR5.2**: Cơ chế giảm trừ theo thời gian (Time-decay Lambda factor) ưu tiên các tương tác gần nhất.
- **FR5.3**: Hỗ trợ endpoint huấn luyện lại mô hình định kỳ (`POST /recommendations/train`).

### FR6: Cộng Đồng & Mạng Xã Hội Du Lịch (Community)
- **FR6.1**: Bảng tin bài viết cộng đồng chia sẻ kinh nghiệm và cẩm nang du lịch.
- **FR6.2**: Tính năng tương tác: Thả tim bài viết, bình luận, lọc theo thẻ chủ đề (Tags).

---

## 5. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### NFR1: Hiệu Năng & Tốc Độ (Performance)
- Tìm kiếm vector tương đồng trong bảng 10.856 chunks: **< 10ms** nhờ chỉ mục HNSW vector cosine.
- Thời gian nhúng câu hỏi bằng mô hình Xenova/bge-m3 ONNX local: **< 180ms**.
- Thời gian sinh token phản hồi RAG đầu tiên: **< 1.2 giây**.

### NFR2: Độ Bền Vững & Triển Khai (Deployment & Reliability)
- Khởi chạy đồng bộ qua Docker Compose với 3 dịch vụ: `postgres` (pgvector:pg16), `recommendation-service` (FastAPI), `backend` (NestJS).
- Lưu trữ dữ liệu an toàn trên volume `pgdata`.

### NFR3: Chuẩn Mực Dữ Liệu Tập Trung (Data Integrity)
- Toàn bộ dữ liệu huấn luyện, dữ liệu mẫu, QA chunks và bản backup SQL 138MB được quy hoạch gọn gàng trong thư mục [`datasets/`](file:///z:/Learn_Programming/DATN%20-%20AI%20Travel%20Planner/datasets).

---

## 6. Lộ Trình Triển Khai Tiếp Theo (Future Roadmap)

1. **Tích Hợp Bản Đồ Tương Tác Đầy Đủ (Interactive Map View)**: Hiển thị cung đường du lịch nối giữa các địa điểm trong chuyến đi trên Mapbox/Google Maps.
2. **Xuất Lịch Trình Ra File PDF & Lịch Cá Nhân**: Hỗ trợ xuất lịch trình sang PDF hoặc đồng bộ vào Google Calendar.
3. **Mở Rộng Dữ Liệu Thời Tiết Thời Gian Thực (Live Weather API)**: Cảnh báo thời tiết mưa bão tự động khi người dùng chọn ngày du lịch.
