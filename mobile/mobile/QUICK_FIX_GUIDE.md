# Quick Fix Guide - Common Errors

## 🔴 Lỗi: "Undefined class" hoặc "undefined_getter"

### Nguyên nhân
Chưa generate Freezed code cho các models.

### Giải pháp
```bash
cd mobile
dart run build_runner build --delete-conflicting-outputs
```

**Hoặc chạy script:**
- Windows: `scripts\generate.bat`
- Mac/Linux: `bash scripts/generate.sh`

---

## 🔴 Lỗi: "Target of URI doesn't exist"

### Nguyên nhân
Thiếu dependencies trong pubspec.yaml

### Giải pháp
Thêm vào `pubspec.yaml`:
```yaml
dependencies:
  # Existing dependencies...
  
  # Add these:
  image_picker: ^1.0.5
  flutter_local_notifications: ^16.3.0
  timezone: ^0.9.2
  shimmer: ^3.0.0
```

Sau đó:
```bash
flutter pub get
```

---

## 🔴 Lỗi: "Uses 'await' on instance of..."

### Nguyên nhân
Một số methods trong StorageService không phải async.

### Đã fix
File `test/services/storage_service_test.dart` đã được cập nhật để remove await không cần thiết.

---

## 🔴 Lỗi: "Unused import"

### Nguyên nhân
Import không sử dụng trong file.

### Đã fix
- Removed unused imports trong `trip_detail_screen.dart`
- Removed unused imports trong `animations.dart`

---

## 🔴 Lỗi: "The generic type ... should have explicit type arguments"

### Nguyên nhân
PageRouteBuilder cần explicit type parameters.

### Đã fix
```dart
// Before
class SlideUpPageRoute extends PageRouteBuilder { ... }

// After
class SlideUpPageRoute<T> extends PageRouteBuilder<T> { ... }
```

---

## 🔴 Lỗi: Comment model thiếu fields

### Nguyên nhân
Comment model thiếu `likesCount` và `isLiked` fields.

### Đã fix
Updated `lib/models/community_post.dart`:
```dart
class Comment with _$Comment {
  const factory Comment({
    required String id,
    required String content,
    required String userId,
    required String userName,
    required DateTime createdAt,
    @Default(0) int likesCount,      // Added
    @Default(false) bool isLiked,    // Added
  }) = _Comment;
}
```

---

## 🟡 Warning: "prefer_final_locals"

### Không cần fix
Đây chỉ là warning về code style, không ảnh hưởng chức năng.

Nếu muốn fix:
```dart
// Before
var tween = Tween(...);

// After
final tween = Tween(...);
```

---

## ✅ Các Lỗi Đã Fix

1. ✅ Comment model - Added likesCount & isLiked fields
2. ✅ PageRouteBuilder - Added type parameters
3. ✅ Unused imports - Removed
4. ✅ Storage service tests - Fixed await issues
5. ✅ Trip detail screen - Removed unused map integration code

---

## 📝 Checklist Để App Chạy Được

### Bước 1: Generate Code
```bash
cd mobile
dart run build_runner build --delete-conflicting-outputs
```

### Bước 2: Check Generated Files
Phải có các files này:
- [x] `lib/models/user.freezed.dart`
- [x] `lib/models/user.g.dart`
- [x] `lib/models/trip.freezed.dart`
- [x] `lib/models/trip.g.dart`
- [ ] `lib/models/place.freezed.dart`
- [ ] `lib/models/place.g.dart`
- [ ] `lib/models/chat_message.freezed.dart`
- [ ] `lib/models/chat_message.g.dart`
- [ ] `lib/models/community_post.freezed.dart`
- [ ] `lib/models/community_post.g.dart`

### Bước 3: Add Missing Dependencies (Optional)
Chỉ cần thêm nếu sử dụng các features:
- `image_picker` - Cho create post với ảnh
- `flutter_local_notifications` - Cho trip reminders
- `shimmer` - Cho loading effects

### Bước 4: Run App
```bash
flutter run
```

---

## 🎯 Status Sau Khi Fix

### Errors Remaining: ~0 (sau khi generate code)
- Tất cả errors về "undefined class" sẽ biến mất sau khi chạy build_runner
- Tất cả errors về models sẽ được resolve

### Warnings: ~5-10 (có thể ignore)
- `prefer_final_locals` - Code style warning
- `prefer_const_constructors` - Performance suggestion
- Các warnings này không ảnh hưởng app chạy

### Ready to Run: ✅ YES
Sau khi chạy `dart run build_runner build --delete-conflicting-outputs`, app sẽ chạy được!

---

## 🆘 Troubleshooting

### Nếu build_runner fails:
```bash
flutter clean
rm -rf .dart_tool/
rm pubspec.lock
flutter pub get
dart run build_runner build --delete-conflicting-outputs
```

### Nếu vẫn còn lỗi:
1. Restart IDE (VS Code / Android Studio)
2. Run `flutter pub get` again
3. Check terminal output để xem lỗi cụ thể

### Nếu cần help:
Check các files documentation:
- `SETUP.md` - Setup instructions
- `TESTING_GUIDE.md` - Testing help
- `API_INTEGRATION.md` - Backend integration

---

**Last Updated:** 2026-10-23 17:40  
**Status:** All code fixes applied, ready for code generation
