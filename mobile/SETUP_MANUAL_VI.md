# HƯỚNG DẪN SETUP THỦ CÔNG

Do classifier tạm thời không khả dụng, bạn cần chạy các lệnh sau **thủ công**:

## Bước 1: Khởi tạo Flutter project

```bash
cd mobile
flutter create . --project-name travel_planner --org com.travelplanner --platforms android,ios
```

Lệnh này sẽ tạo:
- `android/` folder (native Android code)
- `ios/` folder (native iOS code)  
- `test/` folder
- Các file còn lại (pubspec.lock, etc.)

**Quan trọng:** Lệnh này SẼ GHI ĐÈ một số file đã tạo (main.dart, pubspec.yaml). Đó là bình thường.

---

## Bước 2: Cài đặt dependencies

```bash
flutter pub get
```

Lệnh này sẽ tải tất cả packages trong `pubspec.yaml`:
- flutter_riverpod, dio, go_router
- lucide_icons_flutter, cached_network_image
- sqflite, flutter_secure_storage
- Và tất cả dependencies khác

---

## Bước 3: Kiểm tra setup

```bash
flutter doctor
```

Xác nhận:
- ✅ Flutter SDK installed
- ✅ Android toolchain (nếu test Android)
- ✅ Xcode (nếu test iOS - Mac only)

---

## Bước 4: Chạy analyzer

```bash
flutter analyze
```

**Kỳ vọng:** Một số warnings về unused imports là bình thường (vì chưa implement đầy đủ).

---

## Bước 5: Test chạy app

```bash
flutter run --dart-define=API_URL=http://localhost:3002
```

**Lưu ý:** Backend phải đang chạy tại `http://localhost:3002`

App sẽ hiển thị:
- AppBar với title "AI Travel Planner"
- Icon travel_explore (màu coral)
- Text "Welcome to AI Travel Planner"
- Text "Setup in progress..."

---

## Bước 6: Commit code

```bash
# Từ project root (không phải mobile/)
cd ..
git add mobile/
git status  # Kiểm tra chỉ có mobile/ files

# Commit
git commit -m "mobile: phase 0 setup complete - project structure and configuration

- Created Flutter project structure and configuration files
- Implemented design system (colors, typography, theme, spacing)
- Setup core services (API client, storage, validators)
- Created reusable common widgets (button, loading, error)
- Configured linter and environment variables
- Ready for Phase 1 implementation

Phase 0 Progress: 25/32 tasks complete (78%)
Pending: Flutter project initialization and first run

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Nếu gặp lỗi:

### Lỗi: "Flutter command not found"
```bash
# Kiểm tra Flutter đã cài chưa
which flutter

# Nếu chưa có, cài Flutter SDK:
# https://flutter.dev/docs/get-started/install
```

### Lỗi: Dependencies conflicts
```bash
# Xóa cache và cài lại
flutter clean
flutter pub cache clean
flutter pub get
```

### Lỗi: Android licenses
```bash
flutter doctor --android-licenses
# Chọn 'y' cho tất cả
```

---

## Sau khi setup xong:

✅ **Phase 0 hoàn thành!**

Bạn có thể:
1. Chạy `flutter run` để xem app
2. Bắt đầu Phase 1: Authentication (Login/Register screens)
3. Check file `TASKS.md` để xem task tiếp theo

---

**Tổng kết Phase 0:**
- 25 files đã tạo sẵn
- Design system đã setup (colors, theme, typography)
- Architecture pattern sẵn sàng (Screen → Provider → Repository → Service)
- Utilities sẵn sàng (validators, formatters, error handling)

**Thời gian setup:** ~5-10 phút

**Next:** Phase 1 - Authentication & Trip Management
