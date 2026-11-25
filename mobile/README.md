# AI Travel Planner — Mobile App (Flutter)

Ứng dụng di động Flutter (Android & iOS) cho hệ thống **AI Travel Planner**, được thiết kế **chỉ dành cho người dùng cuối** (không bao gồm chức năng quản trị Admin).

---

## 📚 Tài Liệu Liên Quan

- **[CLAUDE.md](CLAUDE.md)** — Quy tắc phát triển và ranh giới phạm vi cho module `mobile/`
- **[TASKS.md](TASKS.md)** — Danh sách theo dõi công việc
- **[mobile-tech-stack.md](mobile-tech-stack.md)** — Quyết định công nghệ Flutter
- **Thư mục tài liệu & báo cáo (`docs/`)**: xem [docs/](docs/)

---

## 🎯 Tổng Quan & Công Nghệ

- **Framework**: Flutter (`sdk: >=3.5.0 <4.0.0`) / Dart 3
- **State Management**: `flutter_riverpod` (`^2.5.1`)
- **Navigation**: `go_router` (`^14.2.7`) với `StatefulShellRoute.indexedStack` (5 tab chính)
- **Networking**: `dio` (`^5.4.3+1`), `http` (`^1.2.2` cho SSE streaming), `socket_io_client` (`^3.0.2` cho chat 1-1 real-time)
- **Maps & Location**: `flutter_map` (`^7.0.2`), `latlong2` (`^0.9.1`), `geolocator` (`^12.0.0`)
- **Local & Secure Storage**: `sqflite`, `flutter_secure_storage`, `shared_preferences`, `local_auth`
- **UI & Media**: `lucide_icons_flutter`, `cached_network_image`, `image_picker`, `flutter_markdown`, `url_launcher`

---

## 📱 Các Tính Năng Đã Triển Khai

### 1. Xác thực & Onboarding
- Đăng nhập / Đăng ký JWT, tự động đăng xuất khi token hết hạn (`onUnauthorized` stream).
- Đăng nhập sinh trắc học (vân tay / Face ID) cấu hình tại tab **Cài đặt** trong Hồ sơ.
- **Onboarding 3 bước (`/onboarding`)**: Chọn ≥ 3 phong cách du lịch, bạn đồng hành và ngân sách ưa thích.

### 2. Trang Chủ (`HomeScreen`) & Shell 5 Tab
- Bottom Navigation Bar 5 tab: **Trang chủ**, **Khám phá**, **Lịch trình**, **Cộng đồng**, **Hồ sơ**.
- Tìm kiếm nhanh địa điểm, 6 chip điểm đến nổi bật, lối tắt tính năng, danh sách chuyến đi gần đây, truy cập nhanh **Hỏi đáp AI** và **Tin nhắn 1-1** kèm badge số tin chưa đọc.

### 3. Khám Phá Địa Điểm (`PlacesScreen` & `PlaceDetailScreen`)
- Bộ lọc **11 tỉnh/thành phố**, **10 danh mục**, **5 tùy chọn sắp xếp** (`popularity`, `rating`, `price_asc`, `price_desc`, `newest`) và phân trang (`{ items, pagination }`).
- Thao tác Like (optimistic), Save / Wishlist, Đánh giá 1–5★ / Gỡ đánh giá, Bình luận, Chia sẻ bài đăng lên Cộng đồng.
- **Weather Pill (`WeatherService`)**: Hiển thị thời tiết hiện tại từ **Open-Meteo API** (có cache).
- **Chỉ đường (`PlaceDirectionsSheet` + `RoutingService`)**: Bản đồ tuyến đường **OSRM API** (fallback Haversine) cho **Xe máy / Ô tô / Đi bộ** và mở Google Maps ngoài qua `url_launcher`.

### 4. Lập Lịch Trình Thông Minh (`CreateTripScreen`, `TripsListScreen`, `TripDetailScreen`)
- **Wizard tạo chuyến đi**: Hỗ trợ **Tour liên tỉnh** nhiều điểm đến và **Smart Pre-fill** từ hồ sơ người dùng.
- **Chi tiết lịch trình**: Nhóm hoạt động theo **3 buổi/ngày** (Sáng / Chiều / Tối), lọc bản đồ theo ngày và buổi.
- **Tối ưu lộ trình (`POST /trips/:id/optimize`)**: Sắp xếp lại lộ trình hợp lý kèm thống kê quãng đường tiết kiệm.
- **Thẻ đánh giá khả thi 5 chiều (`TripFeasibilityCard`)**: Hiển thị Overall Feasibility Score (OFS) theo 5 tiêu chí (`geo`, `time`, `budget`, `preference`, `diversity`), cảnh báo và gợi ý.

### 5. Cộng Đồng, Travel Buddy & Tin Nhắn 1-1
- **Cộng đồng (`CommunityScreen` & `CreatePostScreen`)**: Xem bài viết theo tag/tìm kiếm, upload nhiều ảnh (`POST /upload/image`), đính kèm lịch trình, **1-Click Clone** (`POST /trips/:id/clone`), bình luận & thích bài viết.
- **Travel Buddy**: Gợi ý bạn đồng hành phù hợp kèm nút mở chat 1-1 trực tiếp.
- **Tin nhắn 1-1 (`ConversationsScreen`, `DirectChatScreen`, `SocketService`)**: Đồng bộ tin nhắn thời gian thực qua Socket.IO, typing indicator, đánh dấu đã đọc.

### 6. Hỏi Đáp AI (`ChatScreen`) & Hồ Sơ 6 Tab (`ProfileScreen`)
- **AI RAG Chat**: Trò chuyện streaming SSE (`POST /api/chat`), render Markdown và trích dẫn nguồn.
- **Hồ sơ 6 tab**: Quản lý chuyến đi, địa điểm đã thích, wishlist đã lưu, địa điểm đã chia sẻ, bài viết cộng đồng và cài đặt hồ sơ / sinh trắc học.

---

## 🏗️ Kiến Trúc Thư Mục

```text
mobile/lib/
├── config/          # colors.dart, theme.dart, text_styles.dart, routes.dart, provinces.dart, env.dart
├── models/          # Freezed + json_serializable (user, place, trip, community_post, chat_message, direct_message)
├── providers/       # Riverpod providers & notifiers (auth, places, trips, create_trip, community, chat, messages, user_profile, biometric)
├── repositories/    # Business logic & DTO mapping (auth, places, trips, community, chat, messages)
├── services/        # api_service, stream_service, socket_service, weather_service, routing_service, storage_service, biometric_service, database_service
├── screens/         # main, onboarding, home, auth, places, trips, community, messages, chat, search, profile
├── utils/           # constants.dart (API endpoints), formatters, validators
└── widgets/         # Reusable widgets (place/, trip/, community/, chat/, map/, common/)
```

**Luồng dữ liệu chuẩn:** `Screen -> Provider -> Repository -> Service -> Backend API`

---

## 🎨 Hệ Thống Thiết Kế (Ocean Teal / Emerald Travel)

### Bảng màu (`lib/config/colors.dart`)

```dart
AppColors.primary            // Teal #0D9488       — Nút CTA chính, tab đang chọn, route map
AppColors.secondary          // Lagoon #14B8A6     — Điểm nhấn phụ, banner gợi ý, pin vị trí
AppColors.accent             // Sand Gold #F59E0B  — Đánh giá sao, Wishlist/Bookmark, AI highlight
AppColors.likeRed            // Coral #FF6B6B      — Chỉ dùng cho nút Like (tim)
AppColors.notificationBadge  // Coral #FF6B6B      — Badge đếm tin nhắn / thông báo chưa đọc
AppColors.background         // Slate Off-white #F8FAFC
AppColors.surface            // White #FFFFFF
AppColors.textPrimary        // Slate 900 #0F172A
AppColors.border             // Slate 200 #E2E8F0
```

### Bo góc & Icons
- Icons dùng `lucide_icons_flutter`.
- Bo góc (`AppRadius`): `sm` (`8dp`), `md` (`12dp`), `lg` (`16dp`), `xl` (`20dp`), `full` (`999dp`).

---

## 🚀 Cài Đặt, Chạy & Kiểm Thử

### Chạy ứng dụng

```bash
cd mobile
flutter pub get

# Tạo mã Freezed / json_serializable (khi sửa models hoặc auth_provider)
dart run build_runner build --delete-conflicting-outputs

# Chạy trên máy thật / iOS simulator (Backend port 3002)
flutter run --dart-define=API_URL=http://localhost:3002

# Chạy trên Android Emulator kết nối localhost máy host
flutter run --dart-define=API_URL=http://10.0.2.2:3002
```

### Kiểm tra chất lượng & Build

```bash
cd mobile
flutter analyze
flutter test
flutter build apk --debug
```
