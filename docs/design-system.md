# 🎨 Quy Chuẩn Hệ Thống Thiết Kế (Design System Specification)
## Nền Tảng AI Travel Planner (Vietnam Tourism AI Travel Planner)

Tài liệu quy chuẩn thiết kế giao diện người dùng (Design System) toàn diện cho nền tảng **AI Travel Planner**, đảm bảo tính thẩm mỹ cao cấp (Rich & Premium Dark Aesthetics), nhất quán về phong cách thương hiệu và tối ưu hóa trải nghiệm tương tác trên mọi thiết bị.

---

## 1. Triết Lý Thiết Kế (Design Philosophy)

1. **Hơi Thở Thiên Nhiên & Di Sản Việt Nam (Nature & Heritage)**: Lấy cảm hứng từ vẻ đẹp bất tận của đất nước hình chữ S: Sắc xanh lục bảo của núi rừng Tây Bắc, màu xanh ngọc bích của Vịnh Hạ Long, và ánh vàng ấm áp của phố cổ Hội An.
2. **Thẩm Mỹ Tối Sang Trọng (Luxury Deep Dark & Glassmorphism)**: Tận dụng tông nền tối sâu thẳm (`Slate 950`) làm nền tảng, kết hợp các lớp kính mờ đổ sương (`Backdrop Blur`) và viền phát sáng nhạt (`Emerald Glow Borders`), tạo cảm giác chiều sâu không gian và bảo vệ thị lực.
3. **Tương Tác Sống Động (Alive, Dynamic & Responsive)**: Mọi thao tác người dùng (di chuột, chọn tab, mở trích dẫn, gõ phím) đều có phản hồi chuyển động vi mô (micro-interactions) tinh tế, đem lại trải nghiệm cao cấp vượt trội so với các ứng dụng du lịch truyền thống.

---

## 2. Bảng Màu Chuẩn (Color Tokens & Palette)

Hệ thống màu được đồng bộ hóa thông qua các biến CSS và tiện ích Tailwind CSS:

### 2.1 Màu Chủ Đạo Thương Hiệu (Primary Brand Colors)
- **Emerald 500 (`#10b981`)**: Màu xanh lục bảo đại diện cho sự tươi mới, năng lượng du lịch xanh.
- **Emerald 600 (`#059669`)**: Dùng cho nút bấm hành động chính (Primary CTA), bong bóng chat người dùng.
- **Emerald 400 (`#34d399`)**: Dùng cho điểm nhấn văn bản, icon nổi bật và viền sáng khi hover.
- **Emerald 900/40 (`rgba(6, 78, 59, 0.4)`)**: Dùng cho đường viền tinh tế của header, card và thanh nhập liệu.

### 2.2 Màu Phụ Trợ & Điểm Nhấn (Accents & Secondary)
- **Teal 400 (`#2dd4bf`)**: Phối hợp cùng Emerald tạo dải gradient thương hiệu `from-emerald-500 to-teal-400`.
- **Cyan 300 (`#67e8f9`)**: Điểm sáng cuối của text gradient trên tiêu đề ứng dụng.
- **Amber 400 (`#fbbf24`)**: Dùng cho đánh giá sao (Ratings), danh mục cảnh báo nhẹ, icon chi phí ngân sách.
- **Indigo 400 (`#818cf8`)**: Dùng cho huy hiệu cặp Hỏi - Đáp gốc (`QA Chunk`).
- **Rose 500 (`#f43f5e`)**: Dùng cho nút yêu thích (Like/Heart button), hủy chuyến hoặc xóa dữ liệu.

### 2.3 Bề Mặt Nền Tối & Màu Chữ (Dark Surfaces & Typography)
- **Slate 950 (`#020617`)**: Nền ứng dụng chính (App Background).
- **Slate 900 (`#0f172a`)**: Nền của các khối Card, khung tin nhắn bot, ô nhập liệu và modal.
- **Slate 800 (`#1e293b`)**: Đường kẻ phân cách (Dividers), viền trạng thái mặc định của card.
- **Slate 100 (`#f1f5f9`)**: Màu chữ chính (Primary Text), đảm bảo độ tương phản cao đạt chuẩn WCAG AA.
- **Slate 400 (`#94a3b8`)**: Màu chữ phụ (Secondary Subtext, Timestamp, Metadata).

---

## 3. Hệ Thống Kiểu Chữ (Typography Hierarchy)

Sử dụng bộ font không chân hiện đại (**Geist Sans / Inter**) với khả năng hiển thị tiếng Việt tối ưu:

| Kiểu Chữ (Level) | Kích Thước (Size) | Độ Đậm (Weight) | Chiều Cao Dòng (Line Height) | Ứng Dụng Trong Giao Diện |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `1.875rem - 2.25rem` (30 - 36px) | ExtraBold (`800`) | `1.2` | Tiêu đề chào mừng trang chủ & trang Chat RAG |
| **Section Header** | `1.25rem - 1.5rem` (20 - 24px) | Bold (`700`) | `1.3` | Tiêu đề danh mục, tiêu đề lịch trình chuyến đi |
| **Card Title** | `1.0rem - 1.125rem` (16 - 18px) | SemiBold (`600`) | `1.4` | Tên địa điểm, tiêu đề bài viết cộng đồng |
| **Body Message** | `0.875rem` (14px) | Regular (`400`) | `1.6` | Nội dung tin nhắn chat, mô tả địa điểm |
| **Caption / Citation** | `0.75rem` (12px) | Regular / Medium | `1.5` | Đoạn trích dẫn nguồn, thời gian, tác giả |
| **Badge / Tag** | `0.6875rem` (11px) | SemiBold (`600`) | `1.2` | Huy hiệu tỉnh thành, nhãn match %, chip chủ đề |

---

## 4. Đặc Tả Thành Phần Giao Diện Cốt Lõi (Core UI Components)

### 4.1 Thanh Điều Hướng Chung (Top Navigation Bar)
- **Vị trí**: `sticky top-0 z-50`, nền kính mờ `backdrop-blur-md bg-slate-950/80` với viền dưới `border-b border-emerald-900/30`.
- **Thành phần**:
  - Logo thương hiệu phát sáng kết hợp biểu tượng La Bàn (`Compass`).
  - Menu điều hướng: *Khám phá Địa Điểm (`/places`)*, *Lập Lịch Trình (`/trips`)*, *Trợ Lý RAG AI (`/question-answer`)*, *Cộng Đồng (`/community`)*.
  - Khối trạng thái hệ thống (Database status badge hiển thị số lượng `10,856 chunks`).
  - Khu vực tài khoản: Nút Đăng nhập/Đăng ký hoặc Avatar người dùng kèm Dropdown Menu cá nhân.

---

### 4.2 Giao Diện Trợ Lý Hỏi Đáp RAG Du Lịch (`/question-answer`)

#### A. Thanh 10 Chủ Đề Du Lịch Tuyển Chọn (Topics Carousel & Pills)
- **Trình bày**: Thanh cuộn ngang mượt mà (Horizontal Scrollable Pills) với các nút chủ đề bo tròn:
  - 5 Chủ đề cẩm nang chuyên sâu: *Tuyến Liên Tỉnh*, *Chi Phí & Vé*, *Phong Cách & Đối Tượng*, *Cẩm Nang Lưu Trú*, *Mẹo An Toàn & Đèo Dốc*.
  - 5 Trụ cột tri thức: *Văn Hóa*, *Hà Nội*, *Thiên Nhiên*, *Ẩm Thực*, *Biển Đảo*.
- **Huy hiệu nổi bật**: Đi kèm các badge nhỏ bắt mắt (`Mới`, `Hot`, `100% Phủ Sóng`).
- **Nút mở Modal Tổng Hợp (`[📚 10 Chủ Đề RAG]`):** Mở hộp thoại toàn màn hình giúp tra cứu và click chọn câu hỏi mẫu bất cứ lúc nào.

#### B. Khung Gợi Ý Câu Hỏi Nhanh (Quick Suggestions Grid)
- Hiển thị 6 thẻ câu hỏi mẫu thực tế ứng với chủ đề đang chọn.
- Người dùng chỉ cần click vào thẻ câu hỏi, tin nhắn sẽ tự động gửi vào luồng chat để AI trả lời ngay lập tức.

#### C. Khung Tin Nhắn Hội Thoại (Chat Bubbles)
- **Tin nhắn người dùng**: Nền `bg-emerald-600 text-white`, bo góc mềm mại, căn phải.
- **Tin nhắn Trợ lý AI**: Nền `bg-slate-900/90 border border-slate-800`, căn trái, avatar tia sáng `Sparkles`. Hỗ trợ định dạng Markdown, danh sách gạch đầu dòng và bảng biểu rõ ràng.

#### D. Bảng Trích Dẫn Nguồn Minh Bạch (Sources & Citations Accordion)
- Nằm ngay dưới mỗi câu trả lời của AI:
  - Huy hiệu phân loại: `Hỏi - Đáp gốc` (Indigo badge) hoặc `Ngữ cảnh bài viết` (Emerald badge).
  - Điểm số tương thích cao nhất (`95.8% Match`).
  - Danh sách trích dẫn nguyên văn câu hỏi/bài viết từ cơ sở dữ liệu làm căn cứ.

#### E. Khung Nhập Liệu Nổi (Floating Input Bar)
- Cố định ở đáy màn hình, tự động co giãn (`min-h-[44px] max-h-32`), phím tắt `Enter` để gửi, `Shift + Enter` để xuống dòng.
- Nút gửi đổi trạng thái xoay tròn khi đang chờ phản hồi từ mô hình.

---

### 4.3 Giao Diện Lập Lịch Trình Chuyến Đi (`/trips`)

#### A. Hộp Thoại Tạo Chuyến Đi Thông Minh (Trip Wizard Modal)
- Chọn điểm đến có autocomplete gợi ý tỉnh thành.
- Chọn khoảng ngày bằng lịch tương tác, hiển thị tự động số ngày đêm.
- Slider chọn ngân sách dự kiến trên đầu người (VND).
- Bộ chọn thẻ sở thích (Tags): *Thiên nhiên, Khám phá, Ẩm thực, Di sản, Check-in, Nghỉ dưỡng*.

#### B. Dòng Thời Gian Lịch Trình (Itinerary Timeline View)
- Phân tách theo từng ngày: *Ngày 1*, *Ngày 2*, *Ngày 3*.
- Mỗi ngày chia thành 3 ca trải nghiệm: *Buổi Sáng*, *Buổi Chiều*, *Buổi Tối*.
- Thẻ địa điểm chứa ảnh thu nhỏ, thời gian tham quan dự tính (VD: `2 giờ`), khoảng cách di chuyển và mức giá vé ước tính.
- Khối tóm tắt tài chính (Budget Summary Widget) so sánh ngân sách người dùng đặt ra và tổng chi phí lịch trình dự toán.

---

### 4.4 Thẻ Địa Điểm Du Lịch (Place Discovery Cards)

- **Hình ảnh**: Tỷ lệ 16:9 chất lượng cao, bo góc `rounded-2xl`, hiệu ứng zoom nhẹ khi hover (`group-hover:scale-105 transition-all`).
- **Huy hiệu thông tin**:
  - Tỉnh thành (Location pin).
  - Mức giá (`Miễn phí` hoặc hiển thị giá VND rõ ràng).
  - Mức độ vận động (`Nhẹ nhàng`, `Vừa phải`, `Thử thách`).
- **Nút tương tác nhanh**: Nút Thích (Trái tim hồng) và Nút Lưu vào bộ sưu tập (Bookmark).

---

## 5. Chuyển Động Vi Mô & Hoạt Họa (Motion & Micro-interactions)

- **Hiệu Ứng Gõ Chữ Thời Gian Thực (Streaming Typing)**: Từng token chữ hiển thị tuần tự tạo cảm giác AI đang suy nghĩ và trao đổi chân thực.
- **Tự Động Cuộn Mượt (Smooth Auto-scroll)**: Khung chat nhẹ nhàng cuộn theo từng từ ngữ được sinh ra.
- **Card Hover Elevation**: Khi rê chuột, các thẻ địa điểm và thẻ câu hỏi nhấc nhẹ lên 2px (`-translate-y-0.5`) kèm ánh hào quang ngọc lục bảo mờ (`shadow-emerald-500/10`).
- **Pulsing Status Dots**: Chấm trạng thái kết nối database phát nhịp xanh êm dịu báo hiệu máy chủ hoạt động tốt.

---

## 6. Đáp Ứng Đa Thiết Bị (Responsive Breakpoints)

- **Mobile (< 640px)**: 
  - Header thu gọn menu vào nút hamburger drawer.
  - Tab chủ đề RAG cuộn vuốt cảm ứng trơn tru.
  - Tin nhắn chiếm 94% chiều rộng màn hình.
- **Tablet (640px - 1024px)**:
  - Lưới hiển thị địa điểm 2 cột cân xứng.
  - Lịch trình tour bố cục timeline 1 cột thoáng đãng.
- **Desktop (>= 1024px)**:
  - Bố cục lưới địa điểm 3 - 4 cột.
  - Màn hình chat RAG căn giữa `max-w-5xl` tối ưu hóa góc nhìn.
  - Lịch trình tour hỗ trợ chế độ xem song song Lịch trình & Bản đồ tương tác.
