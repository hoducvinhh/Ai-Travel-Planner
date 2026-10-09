# 🚀 QUICK START - Các lệnh cần chạy

## Copy toàn bộ block này vào terminal:

```bash
# Navigate to mobile folder
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner/mobile

# 1. Create Flutter project (nếu chưa có android/ios folders)
flutter create . --project-name travel_planner --org com.travelplanner --platforms android,ios

# 2. Install dependencies
flutter pub get

# 3. Generate Freezed code (BẮT BUỘC - sửa lỗi)
flutter pub run build_runner build --delete-conflicting-outputs

# 4. Check for errors
flutter analyze

# 5. Run app (nếu có backend)
flutter run --dart-define=API_URL=http://localhost:3002

# 6. Commit (quay về project root)
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner
git add mobile/
git status

# Commit Phase 0
git commit -m "mobile: phase 0 setup complete - project structure and configuration

Phase 0: 48/62 tasks (77%)
- Configuration, design system, core services
- Reusable widgets, documentation

Co-Authored-By: Claude Code <noreply@anthropic.com>"

# Commit Authentication
git commit -m "mobile: implement authentication - login and register screens

Phase 1 Tasks 1.1-1.2: 34/44 tasks (77%)
- Login + Register screens with validation
- Token storage, error handling, navigation
- Follows mobile-ui-guidelines

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Hoặc chạy từng lệnh một:

### Lệnh 1: Create Flutter project
```bash
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner/mobile
flutter create . --project-name travel_planner --org com.travelplanner --platforms android,ios
```

### Lệnh 2: Install dependencies
```bash
flutter pub get
```

### Lệnh 3: Generate code (BẮT BUỘC)
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### Lệnh 4: Check errors
```bash
flutter analyze
```

### Lệnh 5: Run app
```bash
flutter run --dart-define=API_URL=http://localhost:3002
```

### Lệnh 6-8: Commit
```bash
cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner
git add mobile/
git status
# Rồi commit như trên
```

---

**Tổng: 8 lệnh**
**Thời gian: ~5-10 phút**
**Status: Ready to run!**
