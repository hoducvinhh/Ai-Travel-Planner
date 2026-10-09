# Mobile Development - Claude Rules

This file configures Claude's behavior when working on the mobile app.

## 🚨 MANDATORY: Load Skills Before ANY Code Changes

**CRITICAL: Before making ANY code changes in mobile/, you MUST load these skills:**

```
1. Skill("mobile-ui-guidelines")      - For ANY UI work
2. Skill("mobile-architecture")       - For ANY feature implementation
3. Skill("mobile-development-rules")  - For ANY code changes
```

**How to verify skills are loaded:**
- Check if you have context about AppColors, LucideIcons, AppRadius
- Check if you know the Screen → Provider → Repository → Service pattern
- Check if you understand scope constraints (mobile/ only)

**If you don't remember these, STOP and load the skills first.**

## Scope Constraints

**CRITICAL: Mobile team works ONLY in `mobile/` folder.**

```
✅ Allowed to modify:
- mobile/**/*

❌ Forbidden to modify without explicit permission:
- backend/**/*
- frontend/**/*
- ml-service/**/*
- database/**/*
- docker-compose.yml
- .github/workflows/* (except mobile-specific workflows)
- Root package.json, tsconfig.json, .env
```

## When You See These Patterns, STOP:

### Pattern 1: Importing from other services
```dart
// ❌ This is FORBIDDEN
import '../../backend/src/types/trip.dto.ts';
import '../../frontend/src/lib/api.ts';
```
**Action:** Duplicate the type/interface in `mobile/lib/models/` instead.

### Pattern 2: Modifying backend code
```typescript
// ❌ This is FORBIDDEN
// backend/src/trips/trips.controller.ts
@Post()
async create() { ... }
```
**Action:** Create an issue with label `backend-needed` and request backend team to implement.

### Pattern 3: Direct database access
```dart
// ❌ This is FORBIDDEN
final conn = await PostgreSQLConnection.connect(...);
```
**Action:** Use backend API endpoints only. Request new endpoints if needed.

### Pattern 4: Modifying CI/CD
```yaml
# ❌ This is FORBIDDEN (unless mobile-specific)
# .github/workflows/deploy.yml
jobs:
  deploy-backend: ...
```
**Action:** Only create/modify `.github/workflows/mobile-*.yml` files.

## Backend Integration Rules

### Consume API, Don't Modify Backend

```dart
// ✅ CORRECT - Calling existing endpoint
final response = await apiService.get('/trips');

// ❌ WRONG - Modifying backend controller
// Don't edit backend/src/trips/trips.controller.ts
```

### When Backend Endpoint is Missing

**Step 1:** Create issue with template:
```markdown
Title: [Backend] Need GET /trips/:id/weather endpoint
Labels: backend-needed, enhancement

## Use Case
Mobile app trip detail screen needs weather forecast data

## Proposed Endpoint
GET /trips/:id/weather

## Expected Response
{
  "tripId": "123",
  "forecast": [
    { "date": "2026-10-15", "temp": 28, "condition": "sunny" }
  ]
}

## Priority
Medium - workaround: showing static placeholder for now
```

**Step 2:** Implement workaround in mobile (if possible):
```dart
// Temporary until backend implements
final weather = await _getWeatherMock(tripId);
```

**Step 3:** Wait for backend team to implement, then integrate.

## Required Skills

Load these skills before implementing features:

1. **mobile-ui-guidelines** - Before ANY UI work
   - Colors, icons, components, avoiding AI slop
   - Trigger: UI, design, button, card, icon, color

2. **mobile-architecture** - Before feature implementation
   - State management, navigation, folder structure
   - Trigger: provider, repository, service, architecture

3. **mobile-development-rules** - Before ANY code changes
   - Scope constraints, backend integration, git workflow
   - Trigger: backend, API, commit, modify, permission

## Code Quality Gates

Before committing, ALL these must pass:

```bash
# 1. Linter
flutter analyze
# Output: "No issues found!"

# 2. Tests
flutter test
# Output: "All tests passed!"

# 3. Build
flutter build apk --debug
# Output: "✓ Built build/app/outputs/flutter-apk/app-debug.apk"

# 4. Scope check
git diff --name-only origin/main | grep -v "^mobile/"
# Output: (empty) - no files outside mobile/
```

If ANY of these fail, do NOT commit.

## Commit Message Format

```bash
# ✅ CORRECT
git commit -m "mobile: implement login screen with biometric auth"
git commit -m "mobile: fix trip card image caching issue"
git commit -m "mobile: add offline support with sqflite"

# ❌ WRONG
git commit -m "implement login"              # Missing "mobile:" prefix
git commit -m "feat: add login"              # Wrong prefix
git commit -m "fix bug"                      # Too vague
```

## UI Implementation Rules

### Colors - Use Constants Only

```dart
// ✅ CORRECT
color: AppColors.primary              // Coral #FF6B6B
color: AppColors.textPrimary          // Black #1A1A1A

// ❌ WRONG
color: Color(0xFFFF6B6B)              // Magic hex
color: Colors.red                     // Generic color
```

### Icons - Black/White Only, Lucide Package

```dart
// ✅ CORRECT
Icon(LucideIcons.heart, color: AppColors.textPrimary)      // Black on light
Icon(LucideIcons.plus, color: Colors.white)                // White on button

// ❌ WRONG
Icon(Icons.favorite)                                        // Material Icons
Icon(LucideIcons.heart, color: Colors.red)                 // Colored icon
```

### Rounded Corners - Required on All Components

```dart
// ✅ CORRECT
borderRadius: BorderRadius.circular(AppRadius.md)          // 12dp
borderRadius: BorderRadius.circular(AppRadius.lg)          // 16dp

// ❌ WRONG
borderRadius: BorderRadius.zero                            // No sharp corners!
borderRadius: BorderRadius.circular(24)                    // Too rounded (24dp+)
```

## Architecture Patterns

### Screens → Providers → Repositories → Services

```dart
// ✅ CORRECT FLOW

// 1. Screen (UI only)
class HomeScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trips = ref.watch(tripsProvider);  // Get data from provider
    return trips.when(...);
  }
}

// 2. Provider (State management)
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTrips();  // Delegate to repository
});

// 3. Repository (Business logic)
class TripsRepository {
  Future<List<Trip>> getTrips() async {
    final response = await _api.get('/trips');  // Use service
    return response.map((json) => Trip.fromJson(json)).toList();
  }
}

// 4. Service (API calls)
class ApiService {
  Future<T> get<T>(String path) async {
    return await _dio.get(path);  // HTTP only, no business logic
  }
}
```

### ❌ ANTI-PATTERN - Don't Skip Layers

```dart
// ❌ WRONG - Screen calling API directly
class HomeScreen extends StatefulWidget {
  void _loadTrips() async {
    final response = await http.get('/trips');  // NO! Use provider
  }
}

// ❌ WRONG - Provider with business logic
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final response = await http.get('/trips');
  // NO! This logic belongs in repository
  final trips = parseTrips(response);
  final cached = await saveToCache(trips);
  return trips;
});
```

## Error Handling

### Repository Level

```dart
// ✅ CORRECT - Handle errors in repository
class TripsRepository {
  Future<List<Trip>> getTrips() async {
    try {
      final response = await _api.get<List>('/trips');
      return response.map((json) => Trip.fromJson(json)).toList();
    } on DioException catch (e) {
      // Transform to domain error
      throw RepositoryException(ErrorHandler.getErrorMessage(e));
    }
  }
}
```

### Screen Level

```dart
// ✅ CORRECT - Display errors in UI
final tripsAsync = ref.watch(tripsProvider);

return tripsAsync.when(
  loading: () => CircularProgressIndicator(),
  error: (error, stack) => ErrorWidget(message: error.toString()),
  data: (trips) => TripsList(trips: trips),
);
```

## File Naming Conventions

```
✅ CORRECT:
mobile/lib/screens/trips/trip_detail_screen.dart
mobile/lib/widgets/trip/trip_card.dart
mobile/lib/providers/trips_provider.dart
mobile/lib/repositories/trips_repository.dart
mobile/lib/services/api_service.dart
mobile/lib/models/trip.dart

❌ WRONG:
mobile/lib/screens/TripDetailScreen.dart          # Use snake_case
mobile/lib/widgets/TripCard.dart
mobile/lib/providers/trips.dart                   # Missing _provider suffix
mobile/lib/TripRepository.dart                    # Wrong location
```

## Testing Requirements

### Minimum Coverage

- **Repositories**: 80%+ (business logic is critical)
- **Services**: 70%+ (API integration must be tested)
- **Providers**: Optional (complex to test with Riverpod)
- **Widgets**: Optional (too time-consuming for MVP)

### Test Pattern

```dart
// test/repositories/trips_repository_test.dart
void main() {
  late TripsRepository repository;
  late MockApiService mockApi;
  
  setUp(() {
    mockApi = MockApiService();
    repository = TripsRepository(mockApi);
  });
  
  test('getTrips returns list when API succeeds', () async {
    // Arrange
    when(mockApi.get<List>('/trips')).thenAnswer(
      (_) async => [{'id': '1', 'destination': 'Da Nang'}],
    );
    
    // Act
    final trips = await repository.getTrips();
    
    // Assert
    expect(trips.length, 1);
    expect(trips[0].destination, 'Da Nang');
  });
}
```

## Pre-Commit Checklist

Run this mental checklist before EVERY commit:

1. ✓ Only mobile/ files modified?
2. ✓ No backend/frontend/ml-service changes?
3. ✓ `flutter analyze` passes?
4. ✓ `flutter test` passes?
5. ✓ Used AppColors constants (no raw hex)?
6. ✓ Used LucideIcons (no Material Icons)?
7. ✓ All components have rounded corners?
8. ✓ Commit message starts with "mobile:"?
9. ✓ Branch name starts with "mobile/"?
10. ✓ Tested on emulator/device?

## When Agent Should Ask for Help

**Stop and ask user when:**

1. Backend endpoint is missing and no workaround exists
2. Need to modify files outside mobile/
3. Uncertain whether a pattern violates architecture rules
4. Security-sensitive code (authentication, storage, API keys)
5. Major architectural decisions (choosing between approaches)

**Don't ask about:**

1. UI layout decisions (follow mobile-ui-guidelines)
2. Code style (follow Flutter/Dart conventions)
3. File organization (follow mobile-architecture)
4. Colors/icons (use AppColors and LucideIcons)

## Quick Command Reference

```bash
# Start development
cd mobile
flutter pub get
flutter run --dart-define=API_URL=http://localhost:3002

# Quality checks
flutter analyze        # Must show "No issues found!"
flutter test          # Must show "All tests passed!"

# Build
flutter build apk --debug

# Git workflow (from project root)
git checkout -b mobile/feature-name
git add mobile/
git status             # Verify only mobile/ files
git commit -m "mobile: clear description"
git push origin mobile/feature-name

# Verify scope compliance
git diff --name-only origin/main | grep -v "^mobile/"
# Should be empty (no output)
```

## Common Violations to Watch For

### 1. Cross-Service Imports
```dart
import '../../backend/src/types/user.dto.ts';  // ❌ FORBIDDEN
import '../../frontend/src/lib/api.ts';         // ❌ FORBIDDEN
```

### 2. Hardcoded Values
```dart
final apiUrl = 'http://localhost:3002';        // ❌ Use Env.apiUrl
color: Color(0xFFFF6B6B)                       // ❌ Use AppColors.primary
```

### 3. Wrong Icon Package
```dart
Icon(Icons.favorite)                           // ❌ Use LucideIcons.heart
Icon(Icons.home)                               // ❌ Use LucideIcons.home
```

### 4. No Rounded Corners
```dart
borderRadius: BorderRadius.zero                // ❌ Use AppRadius.md/lg
shape: RoundedRectangleBorder()               // ❌ Must specify borderRadius
```

### 5. Business Logic in Screens
```dart
class HomeScreen extends StatefulWidget {
  void _loadTrips() async {
    final trips = await http.get('/trips');    // ❌ Use provider
  }
}
```

## Summary

**When working on mobile app:**

1. **FIRST: Load skills** - mobile-ui-guidelines, mobile-architecture, mobile-development-rules
2. **Stay in scope**: Only modify mobile/
3. **Follow architecture**: Screen → Provider → Repository → Service
4. **Use design system**: AppColors, LucideIcons, AppRadius
5. **Quality gates**: flutter analyze + flutter test + flutter build must pass
6. **Git discipline**: mobile/ prefix in branch/commit, only mobile/ files staged
7. **Backend integration**: Consume API only, never modify backend code

**Workflow for every task:**
```
Step 1: Load 3 skills (if not already loaded)
Step 2: Read relevant code (if modifying existing)
Step 3: Implement following architecture + design system
Step 4: Test (analyze + test + build)
Step 5: Verify scope (only mobile/ files)
Step 6: Commit with mobile: prefix
```

**Before ANY code change, ask yourself:**
- [ ] Have I loaded all 3 skills? (ui-guidelines, architecture, development-rules)
- [ ] Am I only modifying mobile/ files?
- [ ] Am I using AppColors (not raw hex)?
- [ ] Am I using LucideIcons (not Material Icons)?
- [ ] Do all components have rounded corners?
- [ ] Am I following Screen → Provider → Repository → Service pattern?

If answer to ANY of these is NO, STOP and fix it first.

**Remember:** Mobile team owns `mobile/` folder exclusively. Everything else requires permission or is forbidden.
