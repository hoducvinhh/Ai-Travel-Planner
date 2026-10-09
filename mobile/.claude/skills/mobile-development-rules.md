---
skill: mobile-development-rules
description: Core development rules for mobile app - scope constraints, backend integration, git workflow, code quality
triggerWords: [backend, API, folder, scope, commit, push, permission, modify]
---

# Mobile Development Rules

**CRITICAL: Read this before making ANY code changes in the mobile project.**

## 🚨 Scope Constraints (STRICTLY ENFORCED)

### ✅ ALLOWED - Full permissions within:

```
mobile/                              # You have FULL control here
├── lib/                             # Dart source code
│   ├── screens/
│   ├── widgets/
│   ├── providers/
│   ├── repositories/
│   ├── services/
│   ├── models/
│   ├── config/
│   └── utils/
├── android/                         # Android native config
├── ios/                             # iOS native config
├── assets/                          # Images, fonts, etc.
├── test/                            # Mobile app tests
├── pubspec.yaml                     # Flutter dependencies
├── analysis_options.yaml            # Linter config
├── .env.example                     # Environment template
├── .gitignore                       # Mobile-specific gitignore
├── README.md                        # Mobile documentation
├── .claude/                         # Mobile-specific Claude config
│   ├── skills/
│   └── settings.json
└── *.md                             # Documentation files
```

### ❌ FORBIDDEN - DO NOT TOUCH:

```
backend/                             # NestJS backend code
├── src/
├── *.ts
└── package.json

frontend/                            # Next.js web app
├── src/
├── app/
└── package.json

ml-service/                          # Python ML service
├── *.py
└── requirements.txt

database/                            # Database migrations
├── migrations/
└── schema.sql

docker-compose.yml                   # Infrastructure
.github/workflows/                   # CI/CD (except mobile-*.yml)
.env                                 # Root environment (use mobile/.env)
package.json                         # Root dependencies
tsconfig.json                        # TypeScript config
```

### 🔒 Consequences of Violation

**If you modify forbidden files:**
- ❌ PR will be REJECTED immediately
- ❌ Changes will be REVERTED
- ❌ Must re-implement in correct location (mobile/)

**Example violations:**
```dart
// ❌ WRONG - Importing from backend
import '../../backend/src/types/trip.dto.ts';  // NO!

// ✅ CORRECT - Duplicate in mobile
import '../models/trip.dart';  // YES - copy DTO structure to mobile/lib/models/
```

## Backend Integration Rules

### Principle: CONSUME, DON'T MODIFY

Mobile team treats backend as **read-only external service**.

### ✅ ALLOWED Backend Interactions:

1. **Call existing endpoints**
   ```dart
   // ✅ Good - using existing endpoint
   final response = await apiService.get('/trips');
   ```

2. **Test API locally**
   ```bash
   # ✅ Good - testing against local backend
   flutter run --dart-define=API_URL=http://localhost:3002
   ```

3. **Report bugs via issue**
   ```markdown
   Title: [Backend] POST /trips returns 500 on valid input
   Label: backend-needed
   Body: [detailed issue template]
   ```

4. **Request new endpoints via ticket**
   ```markdown
   Title: [Backend] Need endpoint to get trip weather forecast
   Label: backend-needed, enhancement
   Body: 
   - Use case: Mobile app trip detail screen needs weather data
   - Proposed endpoint: GET /trips/:id/weather
   - Expected response: { forecast: [...] }
   ```

### ❌ FORBIDDEN Backend Interactions:

```typescript
// ❌ NEVER DO THIS - Modifying backend code
// backend/src/trips/trips.controller.ts
@Get(':id')
async findOne(@Param('id') id: string) {
  // Don't add features here from mobile team
}

// ❌ NEVER DO THIS - Changing database schema
// backend/src/migrations/xxx_add_column.ts
export class AddColumn1234567890 {
  // Don't create migrations from mobile team
}
```

### When You Need Backend Changes:

**Step 1: Create issue with template**
```markdown
## Issue Type
Backend Integration

## Endpoint
POST /trips

## Expected Behavior
Should accept trip data and return created trip with ID

## Actual Behavior
Returns 500 Internal Server Error

## Request
```json
{
  "destination": "Da Nang",
  "startDate": "2026-10-15",
  "endDate": "2026-10-20"
}
```

## Response
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Mobile Context
- Testing from: Flutter app v0.1.0
- API URL: http://localhost:3002
- Tested on: 2026-10-09

## Action Needed
Backend team to investigate and fix

## Workaround
Using mock data in mobile app for now
```

**Step 2: Implement workaround in mobile** (if possible)
```dart
// Temporary workaround while waiting for backend fix
try {
  final trip = await repository.createTrip(dto);
  return trip;
} catch (e) {
  // Workaround: save locally, sync later
  await storage.saveDraftTrip(dto);
  return Trip.fromDto(dto, id: 'temp-${DateTime.now().millisecondsSinceEpoch}');
}
```

**Step 3: Wait for backend team** - Do NOT fix backend yourself

## Git Workflow Rules

### Branch Naming

```bash
# ✅ CORRECT - Prefix with "mobile/"
git checkout -b mobile/feature-login-screen
git checkout -b mobile/fix-trip-card-layout
git checkout -b mobile/refactor-api-service

# ❌ WRONG - No prefix or wrong prefix
git checkout -b feature-login       # NO
git checkout -b frontend/login      # NO - this is mobile
```

### Commit Messages

```bash
# ✅ CORRECT - Prefix with "mobile:"
git commit -m "mobile: implement login screen with biometric auth"
git commit -m "mobile: fix trip card image loading"
git commit -m "mobile: add offline caching with sqflite"

# ❌ WRONG - No prefix or unclear
git commit -m "add login"                    # NO - too vague
git commit -m "fix bug"                      # NO - what bug?
git commit -m "feat: implement login"        # NO - wrong prefix
```

### Staging Files

```bash
# ✅ CORRECT - Only stage mobile/ files
git add mobile/
git add mobile/lib/screens/login_screen.dart
git add mobile/pubspec.yaml

# ❌ WRONG - Staging files outside mobile/
git add .                           # NO - might include backend files
git add backend/src/trips/          # NO - never touch backend
```

### Pre-commit Checklist

**Before `git commit`, verify:**

```bash
# 1. Check what's staged
git status

# Should ONLY show files under mobile/
# mobile/lib/...
# mobile/pubspec.yaml
# etc.

# If you see backend/, frontend/, or other folders:
git restore --staged backend/       # Unstage them
git restore --staged frontend/
```

**Automated check script:**
```bash
# mobile/scripts/pre-commit-check.sh
#!/bin/bash
if git diff --cached --name-only | grep -v "^mobile/"; then
  echo "❌ Error: Files outside mobile/ are staged"
  echo "Only mobile/ files are allowed"
  exit 1
fi
echo "✅ Only mobile/ files staged"
```

## Code Quality Rules

### Flutter/Dart Standards

```dart
// ✅ CORRECT

// 1. Const constructors where possible
const SizedBox(height: 16)
const Text('Hello')
const Icon(LucideIcons.home)

// 2. Named parameters for widgets
MyWidget(
  title: 'Trip Details',
  onTap: () {},
  backgroundColor: AppColors.primary,
)

// 3. Descriptive variable names
final List<Trip> upcomingTrips = [...];  // ✅ Good
final destinations = [...];               // ❌ Vague - destinations of what?

// 4. Use AppColors constants
color: AppColors.primary                  // ✅ Good
color: Color(0xFFFF6B6B)                 // ❌ Magic hex - use constant

// 5. LucideIcons only
Icon(LucideIcons.heart)                  // ✅ Good
Icon(Icons.favorite)                     // ❌ Wrong - use Lucide
```

### File Organization

```dart
// lib/screens/trips/trip_detail_screen.dart

// ✅ CORRECT ORDER
// 1. Imports (grouped)
import 'package:flutter/material.dart';           // Flutter
import 'package:flutter_riverpod/flutter_riverpod.dart';  // Packages
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../config/theme.dart';                 // Internal (relative)
import '../../models/trip.dart';
import '../../providers/trips_provider.dart';
import '../../widgets/trip/trip_card.dart';

// 2. Widget class
class TripDetailScreen extends ConsumerWidget {
  const TripDetailScreen({
    Key? key,
    required this.tripId,
  }) : super(key: key);
  
  final String tripId;
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Implementation
  }
}

// 3. Private helper widgets (if needed)
class _TripDetailSection extends StatelessWidget {
  // ...
}
```

### Linting

```yaml
# analysis_options.yaml (in mobile/)
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    - always_use_package_imports
    - avoid_print
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables
    - sort_child_properties_last
    - use_key_in_widget_constructors
```

**Must pass before commit:**
```bash
flutter analyze
# Should output: No issues found!

# If issues found, fix them before committing
```

## Environment Variables

```dart
// ❌ WRONG - Hardcoded values
final apiUrl = 'http://localhost:3002';           // NO
final googleMapsKey = 'AIzaSyAbc123...';          // NO - secret exposed

// ✅ CORRECT - Environment variables
// lib/config/env.dart
class Env {
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3002',
  );
  
  // Note: API keys should be in .env file, not committed
}

// Run with:
flutter run --dart-define=API_URL=https://api.production.com
```

## Testing Requirements

### Before submitting PR:

```bash
# 1. Run tests
flutter test
# All tests must pass

# 2. Run linter
flutter analyze
# No issues found

# 3. Build APK (Android)
flutter build apk --debug
# Build must succeed

# 4. Test on emulator/device
flutter run
# App must launch without crashes
```

### Test Coverage (Minimum)

```dart
// test/repositories/trips_repository_test.dart
void main() {
  group('TripsRepository', () {
    test('getTrips returns list of trips', () async {
      // Arrange
      final mockApi = MockApiService();
      final repository = TripsRepository(mockApi);
      when(mockApi.get<List>('/trips')).thenAnswer(
        (_) async => [/* mock data */],
      );
      
      // Act
      final trips = await repository.getTrips();
      
      // Assert
      expect(trips, isNotEmpty);
    });
  });
}
```

**Coverage requirements:**
- Repositories: 80%+ coverage
- Services: 70%+ coverage
- Widgets: Not required (too complex to test)

## Security Rules

```dart
// ❌ WRONG - Security violations

// 1. Exposed secrets
final apiKey = 'sk_live_abc123...';              // NO - hardcoded API key

// 2. No input validation
final email = emailController.text;               // NO - validate first
await api.post('/auth/login', data: {email: email});

// 3. Storing sensitive data insecurely
SharedPreferences.setString('password', pwd);     // NO - use SecureStorage

// ✅ CORRECT - Secure patterns

// 1. Environment variables for non-secrets, SecureStorage for secrets
final apiKey = Env.googleMapsApiKey;  // From --dart-define
await secureStorage.write(key: 'auth_token', value: token);

// 2. Validate inputs
if (!EmailValidator.validate(email)) {
  throw ValidationException('Email không hợp lệ');
}

// 3. Use FlutterSecureStorage for tokens/passwords
final token = await secureStorage.read(key: 'auth_token');
```

## Pull Request Checklist

**Before submitting PR, ensure:**

- [ ] Only mobile/ files modified (run `git diff --name-only origin/main`)
- [ ] No backend/, frontend/, ml-service/ changes
- [ ] Branch name: `mobile/*`
- [ ] Commit messages: `mobile: *`
- [ ] `flutter analyze` passes (0 issues)
- [ ] `flutter test` passes (all green)
- [ ] `flutter build apk --debug` succeeds
- [ ] Tested on Android emulator/device
- [ ] No hardcoded API URLs or secrets
- [ ] Used AppColors constants (no raw hex)
- [ ] Used LucideIcons (no Material Icons)
- [ ] All components have rounded corners (AppRadius)
- [ ] PR title: `mobile: [feature description]`
- [ ] PR description includes screenshots (for UI changes)

## Common Mistakes to Avoid

### ❌ Mistake 1: Cross-boundary imports
```dart
// ❌ WRONG
import '../../backend/src/types/trip.dto.ts';
import '../../frontend/src/lib/api.ts';

// ✅ CORRECT
import '../models/trip.dart';  // Duplicate DTO in mobile/lib/models/
```

### ❌ Mistake 2: Modifying backend to fix mobile bug
```typescript
// ❌ WRONG - Don't fix backend from mobile branch
// backend/src/trips/trips.service.ts
async findAll() {
  // Added this from mobile branch to fix bug
}

// ✅ CORRECT - Report issue, let backend team fix
// Create issue with label "backend-needed"
```

### ❌ Mistake 3: Forgetting to test on real device
```bash
# ❌ WRONG
git commit -m "mobile: add feature"  # Without testing

# ✅ CORRECT
flutter run  # Test on emulator first
# Verify feature works
flutter test  # Run tests
git commit -m "mobile: add feature"
```

### ❌ Mistake 4: Using Material Icons instead of Lucide
```dart
// ❌ WRONG
Icon(Icons.favorite)
Icon(Icons.map)

// ✅ CORRECT
Icon(LucideIcons.heart)
Icon(LucideIcons.mapPin)
```

## Quick Reference Commands

```bash
# Development
flutter run --dart-define=API_URL=http://localhost:3002
flutter run --hot                    # Enable hot reload
flutter pub get                      # Install dependencies

# Quality checks
flutter analyze                      # Linter
flutter test                         # Run tests
flutter test --coverage              # With coverage

# Build
flutter build apk --debug            # Android debug
flutter build ios --debug            # iOS debug (Mac only)
flutter build apk --release          # Android release
flutter build ios --release          # iOS release

# Git workflow
git checkout -b mobile/feature-name
git add mobile/
git commit -m "mobile: description"
git push origin mobile/feature-name

# Verify no forbidden changes
git diff --name-only origin/main | grep -v "^mobile/"
# Should output nothing
```

## When in Doubt

**Ask yourself:**
1. Am I only modifying files in `mobile/`? → If no, STOP
2. Am I calling backend API or modifying backend code? → Call API only
3. Do I need a new backend endpoint? → Create issue first
4. Does this pass `flutter analyze`? → Fix lints before commit
5. Does this follow UI guidelines? → Check mobile-ui-guidelines.md skill

**Golden Rule:** Mobile team owns `mobile/` folder exclusively. Everything else requires permission or is forbidden.
