# Lệnh Bash cần chạy - Phase 1 Task 1.1

## Bước 1: Build code generation (Freezed)

```bash
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner/mobile
flutter pub run build_runner build --delete-conflicting-outputs
```

**Lệnh này sẽ:**
- Tạo file `user.freezed.dart` và `user.g.dart`
- Tạo file `auth_provider.freezed.dart`
- Sửa các lỗi "The name '_User' isn't a type"

## Bước 2: Chạy analyzer

```bash
flutter analyze
```

**Kỳ vọng:** 
- Có thể có một vài warnings về "Use 'package:' imports" (sẽ fix sau)
- Không có errors nghiêm trọng

## Bước 3: Test chạy app (nếu backend đã sẵn sàng)

```bash
flutter run --dart-define=API_URL=http://localhost:3002
```

**Lưu ý:** 
- Backend phải chạy ở `http://localhost:3002`
- Endpoint `POST /auth/login` phải sẵn sàng
- Màn hình login sẽ hiển thị với form đầy đủ

## Bước 4: Commit nếu mọi thứ OK

```bash
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner
git add mobile/
git status

git commit -m "mobile: implement login screen with authentication flow

Phase 1 Task 1.1 - Login Screen:
- Created User model with Freezed for immutability
- Implemented AuthRepository for login/logout operations
- Built AuthProvider with state management (Riverpod)
- Designed LoginScreen UI following mobile-ui-guidelines:
  * Coral primary button with rounded corners
  * Black/white icons (LucideIcons)
  * Email/password validation
  * Error display with retry
  * Loading states
- Setup routing with go_router (/login, /home)
- Integrated with backend API (POST /auth/login)
- Token storage with FlutterSecureStorage

Progress: Phase 1 Task 1.1 - 20/27 tasks (74%)
Files: +3 models, +1 repository, +1 provider, +1 screen

Next: Test with backend, then implement Register screen

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Tổng cộng: 4 lệnh cần chạy

1. `flutter pub run build_runner build` - Tạo code generation
2. `flutter analyze` - Kiểm tra lỗi
3. `flutter run --dart-define=API_URL=http://localhost:3002` - Test app (optional)
4. `git commit` - Commit code

**Lưu ý quan trọng:**
- Lệnh 1 PHẢI chạy trước khi test app (sẽ fix lỗi Freezed)
- Lệnh 3 chỉ chạy được nếu backend đã sẵn sàng
- Nếu lệnh 1 báo lỗi, chạy lại với flag `--delete-conflicting-outputs`
