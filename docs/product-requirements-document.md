# Product Requirements Document (PRD)
## Hệ Thống Chatbot Hỏi Đáp Du Lịch Việt Nam (RAG AI Travel Planner)

- **Tên sản phẩm**: Vietnam Tourism RAG AI Assistant (Cố Vấn Du Lịch Việt Nam AI)
- **Phiên bản**: 1.0.0
- **Trạng thái**: Đã phê duyệt & Đang triển khai
- **Chủ sở hữu**: DATN - AI Travel Planner Team
- **Công nghệ cốt lõi**: NestJS, Next.js, Prisma, PostgreSQL + pgvector, BAAI/bge-m3, Google Gemini API, pnpm

---

## 1. Bối Cảnh & Động Lực (Context & Problem Statement)

### 1.1 Vấn đề thực tế
Việt Nam là quốc gia có tiềm năng du lịch khổng lồ với 63 tỉnh thành, hàng nghìn danh lam thắng cảnh, bề dày lịch sử ngàn năm và nền ẩm thực phong phú. Tuy nhiên:
- **Thông tin phân tán và thiếu kiểm chứng**: Người dùng thường phải tìm kiếm qua nhiều trang blog, diễn đàn hoặc mạng xã hội với thông tin không đồng nhất.
- **Hiện tượng "ảo giác" (Hallucination) của LLM**: Các mô hình ngôn ngữ lớn phổ thông khi được hỏi về các chi tiết cụ thể của địa danh, di tích lịch sử hoặc ẩm thực đặc sản Việt Nam thường bịa đặt dữ liệu hoặc nhầm lẫn giữa các địa phương.
- **Thiếu tính minh bạch và nguồn tham chiếu**: Người dùng không biết câu trả lời của AI dựa trên cơ sở tài liệu nào, dẫn đến sự nghi ngờ về độ chính xác.

### 1.2 Giải pháp đề xuất
Xây dựng một hệ thống hỏi đáp du lịch thông minh ứng dụng mô hình **RAG (Retrieval-Augmented Generation)**:
- Nạp toàn bộ dữ liệu chuẩn chuyên sâu từ tập dataset du lịch Việt Nam (`train_vietnam_tourism.json` và `valid_vietnam_tourism.json`).
- Nhúng ngữ cảnh và câu hỏi bằng mô hình ngôn ngữ tiếng Việt đa ngôn ngữ xuất sắc **BAAI/bge-m3** (chạy cục bộ 100% offline, bảo mật và tốc độ cao).
- Lưu trữ và truy vấn tương đồng bằng **PostgreSQL + pgvector** với chỉ mục HNSW cho thời gian phản hồi dưới 10ms.
- Sử dụng **Google Gemini API** để tổng hợp câu trả lời tự nhiên, chính xác, bám sát tài liệu và stream từng từ về giao diện người dùng.
- Hiển thị trực quan danh sách các **Nguồn trích dẫn (Citations)** kèm điểm số tương đồng (% Match).

---

## 2. Mục Tiêu Sản Phẩm (Product Goals & Objectives)

| Mục tiêu | Mô tả | Chỉ số đo lường (KPI) |
| :--- | :--- | :--- |
| **Độ chính xác cao** | Trả lời bám sát 100% nội dung từ kho dữ liệu du lịch đã nạp | Tỷ lệ trích dẫn chính xác > 95% |
| **Tốc độ phản hồi** | Thời gian vector search và stream phản hồi nhanh | Thời gian trả về token đầu tiên < 1.5s |
| **Trải nghiệm minh bạch** | Người dùng xem được nguồn gốc tài liệu và điểm tương thích | 100% câu trả lời có nút xem nguồn trích dẫn |
| **Kiến trúc đồng nhất** | 100% TypeScript từ backend tới frontend, không phụ thuộc Python | Toàn bộ dự án chạy bằng `pnpm` |

---

## 3. Đối Tượng Người Dùng (Target Audience & Personas)

### Persona 1: Khách Du Lịch Trong Nước & Quốc Tế
- **Nhu cầu**: Muốn tìm hiểu nhanh về các địa điểm tham quan tại Hà Nội, Vịnh Hạ Long, Đà Nẵng, Hội An, ẩm thực đường phố, nét văn hóa đặc sắc.
- **Điểm nghẽn**: Sợ bị chỉ dẫn sai, muốn câu trả lời súc tích, đáng tin cậy.

### Persona 2: Người Lên Kế Hoạch Du Lịch (Travel Planner)
- **Nhu cầu**: Cần thông tin nền tảng, bối cảnh lịch sử và đặc trưng vùng miền để thiết kế lịch trình tour.
- **Điểm nghẽn**: Cần xác minh nguồn tư liệu để đảm bảo thông tin giới thiệu cho du khách là chuẩn xác.

---

## 4. Yêu Cầu Chức Năng (Functional Requirements)

### FR1: Quản Lý & Nạp Tri Thức Du Lịch (Knowledge Ingestion Pipeline)
- **FR1.1**: Hệ thống đọc tự động cả 2 file trong thư mục `datasets/`: `train_vietnam_tourism.json` và `valid_vietnam_tourism.json`.
- **FR1.2**: Cơ chế phân chia chunk thông minh thành 2 loại:
  - **Type 1 (`context`)**: Chunk bài viết chuyên sâu dạng `{title, context}` (1,386 bài viết).
  - **Type 2 (`qa`)**: Chunk cặp hỏi đáp thực tế dạng `{question, answers}` (~8,850 cặp QA deduplicated).
- **FR1.3**: Nhúng toàn bộ các chunk thành vector 1024 chiều bằng mô hình `BAAI/bge-m3` local và lưu trữ vào PostgreSQL pgvector thông qua Prisma ORM.

### FR2: Truy Vấn RAG & Vector Similarity Search
- **FR2.1**: Nhận câu hỏi tự nhiên từ người dùng bằng tiếng Việt.
- **FR2.2**: Chuyển đổi câu hỏi thành vector 1024 chiều bằng `EmbeddingService`.
- **FR2.3**: Thực hiện tìm kiếm Cosine Similarity trên bảng `tourism_chunks` sử dụng chỉ mục HNSW (`embedding <=> query_vector`).
- **FR2.4**: Lọc và lấy top 4 - 6 chunks có độ khớp cao nhất, bao gồm cả ngữ cảnh bài viết và các cặp hỏi đáp tương tự.

### FR3: Sinh Câu Trả Lời Thông Minh với Google Gemini
- **FR3.1**: Tự động ghép nối các tài liệu liên quan vào System Prompt kỹ thuật đóng vai trò "Cố Vấn Du Lịch Việt Nam AI".
- **FR3.2**: Yêu cầu AI chỉ trả lời dựa trên thông tin được cung cấp, phong cách lịch sự, truyền cảm hứng và không bịa đặt.
- **FR3.3**: Trả về phản hồi dạng Server-Sent Events (SSE) theo cơ chế streaming từng từ về frontend.

### FR4: Giao Diện Người Dùng Route `/question-answer` (Next.js)
- **FR4.1**: Tự động điều hướng từ trang chủ `/` sang route trọng tâm `/question-answer`.
- **FR4.2**: Thanh hiển thị trạng thái hệ thống thời gian thực (kết nối PostgreSQL, số lượng chunk đã index).
- **FR4.3**: Bộ thẻ câu hỏi gợi ý nhanh (Quick Suggestions) thuộc nhiều chủ đề: Văn hóa, Hà Nội, Hạ Long, Miền Trung.
- **FR4.4**: Khung hiển thị tin nhắn hội thoại với giao diện chat cao cấp, hỗ trợ cuộn tự động.
- **FR4.5**: Accordion trích dẫn nguồn (Sources & Citations) nằm ngay dưới mỗi phản hồi của AI:
  - Hiển thị tiêu đề địa danh/chủ đề.
  - Huy hiệu phân loại (`Ngữ cảnh bài viết` hoặc `Hỏi - Đáp gốc`).
  - Điểm số tương thích (`% Match`).
  - Đoạn trích dẫn nguyên văn được AI sử dụng làm căn cứ.
- **FR4.6**: Ô nhập liệu thông minh hỗ trợ phím tắt (`Enter` để gửi, `Shift + Enter` để xuống dòng) và nút xóa lịch sử trò chuyện.

---

## 5. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### NFR1: Hiệu Năng & Độ Trễ (Performance & Latency)
- Thời gian tìm kiếm vector tương đồng trong pgvector với 10,236 bản ghi: **< 10ms** nhờ chỉ mục HNSW.
- Thời gian tạo vector nhúng câu hỏi với BGE-M3 local (q8): **< 200ms**.
- Thời gian hiển thị token phản hồi đầu tiên: **< 1.5 giây**.

### NFR2: Độ Sẵn Sàng & Tính Bền Vững (Reliability & Persistence)
- Cơ sở dữ liệu chạy trong Docker với persistent volume `pgdata`, bảo toàn dữ liệu khi khởi động lại.
- Cơ chế kiểm tra sức khỏe hệ thống (Health Check) tự động thăm dò cổng backend `http://localhost:3001/api/chat/status`.

### NFR3: Khả Năng Bảo Trì & Kiến Trúc (Maintainability)
- 100% ngôn ngữ TypeScript xuyên suốt toàn dự án.
- Phân tách module rõ ràng: Ingestion, Database/Prisma, Embedding, Gemini, RAG, Chat.
- Quản lý gói đồng nhất qua `pnpm`.

### NFR4: Trải Nghiệm Người Dùng (UX & Usability)
- Thiết kế hiện đại chuẩn thẩm mỹ du lịch: Màu xanh lục bảo (Emerald) kết hợp xanh ngọc (Teal) và Slate dark mode.
- Phản hồi tức thì qua animation gõ chữ (typing stream) và hiệu ứng hover mượt mà.

---

## 6. Lộ Trình Phát Triển Tương Lai (Future Enhancements)

1. **Lập Lịch Trình Tự Động (Multi-Day Itinerary Planner)**: Cho phép người dùng nhập số ngày và ngân sách, agent tự động lên tour chi tiết.
2. **Tìm Kiếm Bản Đồ (Map Integration)**: Hiển thị vị trí trực tiếp trên bản đồ tương tác khi nhắc đến các địa danh.
3. **Mở Rộng Dữ Liệu**: Tích hợp thêm dataset về khách sạn, nhà hàng, vé tham quan và phương tiện di chuyển.
