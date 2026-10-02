# Design System Specification
## Cố Vấn Du Lịch Việt Nam AI (Vietnam Tourism AI Travel Planner)

Tài liệu quy chuẩn thiết kế giao diện người dùng (Design System) cho hệ thống Chatbot RAG Du lịch Việt Nam, đảm bảo tính thẩm mỹ cao cấp, nhất quán về phong cách và tối ưu trải nghiệm tương tác.

---

## 1. Triết Lý Thiết Kế (Design Philosophy)

Giao diện được xây dựng dựa trên 3 nguyên tắc cốt lõi:
1. **Hơi Thở Du Lịch Việt Nam (Heritage & Nature)**: Sử dụng các gam màu lấy cảm hứng từ thiên nhiên non nước hùng vĩ (xanh lục bảo của rừng núi Tây Bắc, xanh ngọc bích của Vịnh Hạ Long và vàng ấm của đèn lồng phố cổ Hội An).
2. **Hiện Đại & Sang Trọng (Modern Dark Aesthetic)**: Nền tối sâu lắng (Deep Slate) kết hợp kỹ thuật Glassmorphism (lớp kính mờ phủ sương) giúp làm nổi bật nội dung văn bản và các thẻ trích dẫn tri thức.
3. **Sống Động & Tương Tác Tức Thì (Alive & Responsive)**: Mọi hành động tương tác (gửi tin nhắn, mở nguồn trích dẫn, bấm câu hỏi gợi ý) đều đi kèm các hiệu ứng chuyển động vi mô (micro-interactions) tinh tế.

---

## 2. Bảng Màu Chuẩn (Color Tokens & Palette)

Hệ thống màu sắc được cấu hình thông qua Tailwind CSS và CSS Variables:

### 2.1 Màu Chủ Đạo (Primary Colors)
- **Emerald 500 (`#10b981`)**: Màu xanh lục bảo đại diện cho thiên nhiên, sức sống và sự tươi mới của du lịch Việt Nam.
- **Emerald 600 (`#059669`)**: Sử dụng cho bong bóng tin nhắn người dùng và nút tương tác chính.
- **Emerald 400 (`#34d399`)**: Sử dụng cho các điểm nhấn text, icon và viền phát sáng (glow border).
- **Emerald 900/40 (`rgba(6, 78, 59, 0.4)`)**: Sử dụng cho đường viền tinh tế của header và thanh nhập liệu.

### 2.2 Màu Phụ Trợ (Secondary & Accent Colors)
- **Teal 400 (`#2dd4bf`)**: Kết hợp cùng Emerald tạo dải gradient tuyệt đẹp trên logo và thanh tiêu đề.
- **Cyan 300 (`#67e8f9`)**: Điểm sáng cuối của text gradient thương hiệu.
- **Amber 400 (`#fbbf24`)**: Dùng cho icon gợi ý và trạng thái cảnh báo nhẹ (icon ngôi sao lấp lánh).
- **Indigo 400 (`#818cf8`)**: Dùng làm huy hiệu định danh cho các cặp `Hỏi - Đáp gốc`.

### 2.3 Màu Nền & Trung Tính (Neutrals & Dark Surfaces)
- **Slate 950 (`#020617`)**: Nền tối sâu thẳm, tạo không gian đọc tập trung và bảo vệ mắt.
- **Slate 900 (`#0f172a`)**: Nền thẻ tin nhắn của bot, ô nhập liệu và các card gợi ý.
- **Slate 800 (`#1e293b`)**: Đường phân cách (divider) và viền các thành phần UI.
- **Slate 100 (`#f1f5f9`)**: Màu chữ chính (Primary Text) đảm bảo độ tương phản đạt chuẩn WCAG AA.
- **Slate 400 (`#94a3b8`)**: Màu chữ phụ (Secondary / Subtext / Metadata).

---

## 3. Hệ Thống Kiểu Chữ (Typography Hierarchy)

Hệ thống sử dụng bộ font sans-serif hiện đại (**Geist Sans** kết hợp hệ thống font hệ thống tối ưu tiếng Việt):

| Thành phần | Font Size | Font Weight | Line Height | Ứng dụng |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `1.75rem - 2.25rem` (28 - 36px) | ExtraBold (`800`) | `1.2` | Tiêu đề chào mừng trang rỗng |
| **App Title** | `1.0rem - 1.125rem` (16 - 18px) | Bold (`700`) | `1.3` | Tên hệ thống trên thanh Header |
| **Section Title** | `0.875rem` (14px) | SemiBold (`600`) | `1.4` | Tiêu đề tài liệu trong trích dẫn |
| **Body Message** | `0.875rem` (14px) | Regular (`400`) | `1.6` | Nội dung tin nhắn hỏi đáp |
| **Citation Text** | `0.75rem` (12px) | Regular / Italic | `1.5` | Đoạn văn trích dẫn từ dataset |
| **Badge / Caption**| `0.6875rem` (11px) | Medium (`500`) | `1.2` | Huy hiệu chunk type, match % |
| **Kbd Shortcut** | `0.625rem` (10px) | Medium (`500`) | `1.0` | Gợi ý phím tắt `Enter`, `Shift` |

---

## 4. Đặc Tả Thành Phần Giao Diện (Components Specification)

### 4.1 Header Bar (Thanh Điều Hướng & Trạng Thái)
- **Cấu trúc**: Vị trí `sticky top-0`, nền kính mờ `backdrop-blur-md bg-slate-950/80` cùng viền `border-b border-emerald-900/40`.
- **Thương hiệu**:
  - Logo hình khối góc bo `rounded-xl`, màu gradient `from-emerald-600 to-teal-400` với biểu tượng La bàn (`Compass`) phát sáng nhịp nhàng.
  - Tên hệ thống gradient đa sắc `from-emerald-300 via-teal-200 to-cyan-300`.
  - Huy hiệu công nghệ `RAG BGE-M3`.
- **Chỉ báo trạng thái CSDL (Status Indicator)**:
  - Hiển thị số lượng chunk đã index trong pgvector (ví dụ: `10,236 chunks`).
  - Chấm tròn xanh phát xung nhịp (`animate-ping`) khi kết nối thành công.

### 4.2 Thẻ Câu Hỏi Gợi Ý Nhanh (Quick Suggestion Cards)
- **Trình bày**: Grid 2 cột trên màn hình lớn, 1 cột trên điện thoại di động.
- **Phong cách**:
  - Nền `bg-slate-900/60`, viền `border-slate-800`.
  - Hiệu ứng tương tác: `hover:border-emerald-500/40`, `hover:-translate-y-0.5`, đổ bóng `hover:shadow-emerald-500/10`.
  - Nhãn phân loại chữ in hoa nhỏ gọn: `VĂN HÓA & CON NGƯỜI`, `THỦ ĐÔ HÀ NỘI`, `KỲ QUAN THIÊN NHIÊN`, `DI SẢN & ẨM THỰC`.
  - Hành động: Bấm vào thẻ sẽ lập tức gửi câu hỏi vào luồng hội thoại.

### 4.3 Khung Tin Nhắn Hội Thoại (Chat Message Bubbles)
- **Tin nhắn người dùng (User Bubble)**:
  - Căn phải (`justify-end`).
  - Nền màu ngọc lục bảo `bg-emerald-600`, chữ trắng, bo góc `rounded-2xl rounded-tr-none`.
- **Tin nhắn AI (Assistant Card)**:
  - Căn trái (`justify-start`).
  - Đi kèm Avatar biểu tượng lấp lánh (`Sparkles`).
  - Nền `bg-slate-900/90`, viền `border-slate-800/90`, chữ `text-slate-100`, bo góc `rounded-2xl rounded-tl-none`.
  - Trạng thái đang tải (Loading): Hiển thị icon xoay tròn `Loader2` cùng dòng chữ trạng thái nghiêng.

### 4.4 Bảng Trích Dẫn Nguồn (Source Citations Accordion)
- **Nút mở rộng (Accordion Toggle)**:
  - Hiển thị số lượng tài liệu tham chiếu (ví dụ: `Nguồn tham chiếu (5 tài liệu)`).
  - Hiển thị điểm số tương thích cao nhất (`• Độ khớp cao nhất: 96.4%`).
  - Icon mũi tên xoay `ChevronDown` / `ChevronUp`.
- **Thẻ chi tiết nguồn (Citation Item Card)**:
  - Nền `bg-slate-950/70`, viền `border-slate-800`.
  - Tiêu đề bài viết kèm icon địa danh `MapPin`.
  - Huy hiệu phân loại:
    - `Ngữ cảnh bài viết`: Badge màu xanh ngọc lục bảo (`bg-emerald-500/10 text-emerald-400`).
    - `Hỏi - Đáp gốc`: Badge màu tím chàm (`bg-indigo-500/10 text-indigo-400`).
  - Huy hiệu điểm số: Badge đen xám với chữ xanh lục bảo nổi bật (`94.2% match`).
  - Đoạn trích dẫn nguyên văn trong ngoặc kép với nền thụt lề riêng biệt.

### 4.5 Khung Nhập Liệu Nổi (Floating Input Bar)
- **Vị trí**: Nằm cố định ở đáy màn hình (`sticky bottom-3`), cách đáy 12px.
- **Phong cách Glassmorphism**:
  - Nền `bg-slate-900/90 backdrop-blur-xl border border-emerald-900/40`.
  - Khi focus: Viền sáng `focus-within:border-emerald-500/70` và hào quang `ring-2 ring-emerald-500/20`.
- **Textarea**: Tự động co giãn theo nội dung, giới hạn chiều cao tối đa `max-h-32`.
- **Nút gửi (Submit Button)**:
  - Nút bo tròn màu gradient `from-emerald-500 to-teal-500`.
  - Trạng thái vô hiệu hóa (Disabled): Mờ 40% khi chưa nhập text hoặc đang stream.
  - Hiển thị spinner xoay tròn khi đang xử lý câu trả lời.

---

## 5. Chuyển Động Vi Mô & Hoạt Họa (Motion & Micro-interactions)

- **Streaming Typing Effect**: Ký tự và từ ngữ xuất hiện liên tục tạo cảm giác người tư vấn đang suy nghĩ và trả lời trong thời gian thực.
- **Smooth Auto-scroll**: Tự động trượt nhẹ nhàng xuống vị trí tin nhắn mới nhất mỗi khi token được thêm vào.
- **Subtle Pulse**: Biểu tượng la bàn và chỉ báo kết nối CSDL có hiệu ứng nhấp nháy êm dịu, thông báo hệ thống đang hoạt động ổn định.
- **Card Hover Elevation**: Thẻ gợi ý nhấc nhẹ lên 2px (`-translate-y-0.5`) kết hợp viền sáng khi rê chuột.

---

## 6. Đáp Ứng Đa Thiết Bị (Responsive Breakpoints)

- **Mobile (< 640px)**:
  - Header thu gọn phần mô tả dài, chỉ giữ lại logo, tên và huy hiệu CSDL.
  - Thẻ gợi ý hiển thị 1 cột duy nhất dễ bấm bằng một ngón tay.
  - Chiều rộng tin nhắn phủ 92% màn hình.
- **Tablet & Desktop (>= 768px - 1024px)**:
  - Chiều rộng container chính tối đa `max-w-5xl`.
  - Thẻ gợi ý dàn đều 2 cột cân xứng.
  - Bảng trích dẫn hiển thị rõ ràng cả tiêu đề và điểm số match song song.
