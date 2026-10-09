# 🚀 Mobile Development - Quick Reference Card

**READ THIS FIRST before any code change in mobile/**

---

## ⚡ Before You Start

```bash
# 1. MANDATORY: Load these 3 skills
Skill("mobile-ui-guidelines")
Skill("mobile-architecture")
Skill("mobile-development-rules")

# 2. Verify you're in mobile context
pwd  # Should be in mobile/ or project root
```

---

## 🔒 Golden Rules (NEVER BREAK)

### 1. Scope
```
✅ ONLY modify: mobile/**/*
❌ NEVER touch: backend/, frontend/, ml-service/, database/
```

### 2. UI (Design System)
```dart
// ✅ DO
AppColors.primary              // Coral #FF6B6B
LucideIcons.heart              // Black/white icons only
BorderRadius.circular(AppRadius.md)  // 12dp rounded

// ❌ DON'T
Color(0xFFFF6B6B)              // No raw hex
Icons.favorite                 // No Material Icons
BorderRadius.zero              // No sharp corners
```

### 3. Architecture
```
Screen → Provider → Repository → Service → Backend API

✅ Follow this flow
❌ Don't skip layers or mix concerns
```

### 4. Backend
```
✅ Call API: apiService.get('/trips')
❌ Modify: backend/src/trips/trips.controller.ts
```

---

## 📝 Code Patterns

### Creating a Feature

```dart
// 1. Screen (UI only)
class TripDetailScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trip = ref.watch(tripProvider(tripId));
    return trip.when(
      data: (trip) => TripContent(trip),
      loading: () => CircularProgressIndicator(),
      error: (e, _) => ErrorWidget(e.toString()),
    );
  }
}

// 2. Provider (State)
final tripProvider = FutureProvider.family<Trip, String>((ref, id) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTripById(id);
});

// 3. Repository (Business Logic)
class TripsRepository {
  Future<Trip> getTripById(String id) async {
    final data = await _api.get<Map>('/trips/$id');
    return Trip.fromJson(data);
  }
}

// 4. Service (API calls)
class ApiService {
  Future<T> get<T>(String path) => _dio.get(path).then((r) => r.data);
}
```

### UI Component Template

```dart
Container(
  decoration: BoxDecoration(
    color: AppColors.surface,                    // White
    borderRadius: BorderRadius.circular(AppRadius.lg),  // 16dp rounded
    border: Border.all(color: AppColors.border),
  ),
  child: Column(
    children: [
      Icon(LucideIcons.mapPin, color: AppColors.textPrimary),  // Black
      Text('Title', style: AppTextStyles.headlineMedium),
      ElevatedButton.icon(
        icon: Icon(LucideIcons.plus, color: Colors.white),  // White on button
        label: Text('Action'),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,  // Coral
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),  // 12dp
          ),
        ),
        onPressed: () {},
      ),
    ],
  ),
)
```

---

## ✅ Pre-Commit Checklist

```bash
# Run these before EVERY commit
cd mobile

# 1. Linting (must pass)
flutter analyze
# Output: "No issues found!"

# 2. Tests (must pass)
flutter test
# Output: "All tests passed!"

# 3. Build (must succeed)
flutter build apk --debug

# 4. Scope check (must be empty)
cd ..
git diff --cached --name-only | grep -v "^mobile/"
# No output = good

# 5. Commit with correct prefix
git add mobile/
git commit -m "mobile: clear description here"
```

Or run the automated script:
```bash
./mobile/scripts/pre-commit-check.sh
```

---

## 🐛 Common Mistakes & Fixes

| Mistake | Fix |
|---------|-----|
| `import '../../backend/...'` | ❌ Duplicate types in `mobile/lib/models/` |
| `Color(0xFFFF6B6B)` | ❌ Use `AppColors.primary` |
| `Icons.favorite` | ❌ Use `LucideIcons.heart` |
| `BorderRadius.zero` | ❌ Use `BorderRadius.circular(AppRadius.md)` |
| Business logic in Screen | ❌ Move to Repository |
| API call in Provider | ❌ Delegate to Repository |
| Backend endpoint missing | ✅ Create issue with `backend-needed` label |

---

## 🆘 Quick Troubleshooting

### "Backend endpoint doesn't exist"
```markdown
1. Create issue: .github/ISSUE_TEMPLATE/backend-integration.md
2. Label: backend-needed
3. Implement workaround in mobile (mock data, cache, etc.)
4. Wait for backend team
```

### "Build fails"
```bash
flutter clean
flutter pub get
flutter run
```

### "Tests fail"
```bash
# Run specific test
flutter test test/path/to/test_file.dart

# Check mock setup
# Verify repository logic
```

### "Can't modify file outside mobile/"
```
❌ You're trying to edit backend/frontend/ml-service
✅ Only mobile/ is allowed
✅ Create issue for backend team instead
```

---

## 📚 Full Documentation

- **Skills:** `.claude/skills/*.md`
- **Rules:** `CLAUDE.md`
- **Quick Ref:** `SKILLS_SUMMARY.md`
- **Architecture:** `.claude/skills/mobile-architecture.md`
- **UI Guidelines:** `.claude/skills/mobile-ui-guidelines.md`

---

## 🎯 Current Task Workflow

```
1. ✅ Load 3 skills (if not loaded)
2. ✅ Read existing code (if modifying)
3. ✅ Implement following patterns above
4. ✅ Use design system (AppColors, LucideIcons, AppRadius)
5. ✅ Test (analyze + test + build)
6. ✅ Verify scope (only mobile/)
7. ✅ Commit (mobile: prefix)
```

**If ANY step fails, STOP and fix before continuing.**

---

**Last Updated:** 2026-10-09  
**Version:** 1.0.0

**Remember:** Load skills first, stay in scope, follow patterns, test before commit! 🚀
