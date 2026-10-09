# Lệnh Bash cần chạy - Task 1.2 Register Screen

## Task 1.2 ĐÃ HOÀN THÀNH!

### Files đã tạo/cập nhật:
1. ✅ `lib/screens/auth/register_screen.dart` - UI register screen
2. ✅ `lib/repositories/auth_repository.dart` - Thêm method `register()`
3. ✅ `lib/providers/auth_provider.dart` - Thêm method `register()` trong AuthNotifier
4. ✅ `lib/config/routes.dart` - Thêm route `/register`

### Features:
- ✅ Form đăng ký: name, email, password, confirm password
- ✅ Validation đầy đủ (email, password strength, password match)
- ✅ Password requirements hint (8 chars, uppercase, number)
- ✅ Show/hide password toggle
- ✅ Loading state
- ✅ Error display
- ✅ Navigation giữa Login ↔ Register
- ✅ Auto-login sau khi register thành công
- ✅ Design theo mobile-ui-guidelines (Coral button, rounded corners, LucideIcons)

---

## Lệnh cần chạy (giống Task 1.1):

### 1. Build Freezed code (nếu chưa chạy)
```bash
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner/mobile
flutter pub run build_runner build --delete-conflicting-outputs
```

### 2. Run analyzer
```bash
flutter analyze
```

### 3. Test app
```bash
flutter run --dart-define=API_URL=http://localhost:3002
```

**Test flow:**
1. Mở app → Màn hình Login
2. Click "Đăng ký ngay" → Màn hình Register
3. Điền form: name, email, password, confirm password
4. Click "Đăng ký" → Gọi API `POST /auth/register`
5. Nếu thành công → Auto login → Navigate to Home
6. Test validation:
   - Email sai format → Show error
   - Password < 8 chars → Show error
   - Password không có uppercase → Show error
   - Confirm password không khớp → Show error

### 4. Commit
```bash
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner
git add mobile/
git status

git commit -m "mobile: implement register screen with full validation

Phase 1 Task 1.2 complete (14/17 tasks - 82%)
- Created RegisterScreen with complete form validation
- Added register() method to AuthRepository and AuthProvider
- Implemented password strength validation (8 chars, uppercase, number)
- Password confirmation validation
- Password requirements hint UI
- Auto-login after successful registration
- Error handling for duplicate email
- Navigation between Login ↔ Register screens

Features:
- Name, email, password, confirm password fields
- Real-time validation with inline errors
- Show/hide password toggle for both fields
- Loading states during registration
- Error display with retry
- Design follows mobile-ui-guidelines (Coral, rounded, LucideIcons)

Progress: Task 1.2 complete → Ready for Task 1.3 (Profile Screen)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Progress Update:

**Task 1.1 (Login):** 20/27 tasks (74%)  
**Task 1.2 (Register):** 14/17 tasks (82%)  
**Total Phase 1 so far:** 34/44 tasks (77%)

**Next Task:** 1.3 - Profile Screen (Biometric Auth + Logout)
