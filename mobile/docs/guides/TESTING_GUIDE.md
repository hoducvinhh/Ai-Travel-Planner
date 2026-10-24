# Testing Guide - Mobile App

## Overview

This guide covers testing strategies, test organization, and how to write tests for the Travel Planner mobile app.

## Test Coverage Goals

- **Unit Tests:** 80%+ coverage for business logic
- **Widget Tests:** All critical UI components
- **Integration Tests:** All major user flows

## Running Tests

### All Tests
```bash
flutter test
```

### Specific Test File
```bash
flutter test test/utils/validators_test.dart
```

### With Coverage
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

### Watch Mode
```bash
flutter test --watch
```

## Test Organization

```
test/
├── utils/                    # Utility function tests
│   ├── validators_test.dart
│   └── formatters_test.dart
├── services/                 # Service layer tests
│   ├── storage_service_test.dart
│   └── database_service_test.dart
├── repositories/             # Repository tests (TODO)
│   ├── auth_repository_test.dart
│   ├── trips_repository_test.dart
│   └── places_repository_test.dart
├── providers/                # Provider tests (TODO)
│   ├── auth_provider_test.dart
│   └── trips_provider_test.dart
├── widgets/                  # Widget tests
│   ├── custom_button_test.dart
│   └── loading_indicator_test.dart
├── screens/                  # Screen tests
│   └── login_screen_test.dart
└── integration/              # Integration tests
    └── app_integration_test.dart
```

## Unit Testing

### Validators Example

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/utils/validators.dart';

void main() {
  group('Email Validation', () {
    test('should accept valid email', () {
      expect(Validators.email('user@example.com'), null);
    });

    test('should reject invalid email', () {
      expect(Validators.email('invalid'), isNotNull);
    });
  });
}
```

### Service Testing with Mocks

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

@GenerateMocks([ApiService])
void main() {
  late MockApiService mockApi;
  late AuthRepository repository;

  setUp(() {
    mockApi = MockApiService();
    repository = AuthRepository(mockApi);
  });

  test('should login successfully', () async {
    when(mockApi.post('/auth/login', any))
        .thenAnswer((_) async => {'token': 'test_token'});

    final result = await repository.login('test@example.com', 'password');

    expect(result['token'], 'test_token');
  });
}
```

## Widget Testing

### Simple Widget Test

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/widgets/common/custom_button.dart';

void main() {
  testWidgets('CustomButton displays text', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: 'Click Me',
            onPressed: () {},
          ),
        ),
      ),
    );

    expect(find.text('Click Me'), findsOneWidget);
  });
}
```

### Widget with User Interaction

```dart
testWidgets('Button calls onPressed when tapped', (WidgetTester tester) async {
  bool pressed = false;

  await tester.pumpWidget(
    MaterialApp(
      home: Scaffold(
        body: CustomButton(
          text: 'Tap Me',
          onPressed: () => pressed = true,
        ),
      ),
    ),
  );

  await tester.tap(find.byType(CustomButton));
  await tester.pump();

  expect(pressed, isTrue);
});
```

### Testing with Riverpod

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

testWidgets('Screen loads data', (WidgetTester tester) async {
  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(
        home: LoginScreen(),
      ),
    ),
  );

  expect(find.byType(TextFormField), findsNWidgets(2));
});
```

## Integration Testing

### Full Flow Test Structure

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:travel_planner/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Complete authentication flow', (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();

    // Navigate to login
    await tester.tap(find.text('Đăng nhập'));
    await tester.pumpAndSettle();

    // Enter credentials
    await tester.enterText(
      find.byType(TextFormField).first,
      'test@example.com',
    );
    await tester.enterText(
      find.byType(TextFormField).last,
      'password123',
    );

    // Submit
    await tester.tap(find.text('Đăng nhập').last);
    await tester.pumpAndSettle();

    // Verify navigation to home
    expect(find.text('Chuyến đi của tôi'), findsOneWidget);
  });
}
```

## Golden Tests (Screenshot Testing)

### Setup
```bash
flutter pub add --dev golden_toolkit
```

### Golden Test Example

```dart
import 'package:golden_toolkit/golden_toolkit.dart';

void main() {
  testGoldens('TripCard matches golden', (tester) async {
    await tester.pumpWidgetBuilder(
      TripCard(trip: mockTrip),
    );

    await screenMatchesGolden(tester, 'trip_card');
  });
}
```

### Update Goldens
```bash
flutter test --update-goldens
```

## Test Best Practices

### 1. Test Organization

```dart
group('Feature Name', () {
  group('Subfeature', () {
    test('specific behavior', () {
      // Test implementation
    });
  });
});
```

### 2. Setup and Teardown

```dart
void main() {
  late MyService service;

  setUp(() {
    service = MyService();
  });

  tearDown(() {
    service.dispose();
  });

  test('does something', () {
    // Test uses service
  });
}
```

### 3. Test Naming

```dart
// Good
test('should return error when email is invalid', () {});

// Bad
test('email test', () {});
```

### 4. Arrange-Act-Assert Pattern

```dart
test('calculates trip duration correctly', () {
  // Arrange
  final start = DateTime(2024, 1, 1);
  final end = DateTime(2024, 1, 5);

  // Act
  final duration = calculateDuration(start, end);

  // Assert
  expect(duration, equals(4));
});
```

### 5. One Assertion Per Test

```dart
// Prefer this
test('validates email format', () {
  expect(Validators.email('test@example.com'), null);
});

test('rejects invalid email', () {
  expect(Validators.email('invalid'), isNotNull);
});

// Over this
test('email validation', () {
  expect(Validators.email('test@example.com'), null);
  expect(Validators.email('invalid'), isNotNull);
  expect(Validators.email(''), isNotNull);
});
```

## Mocking Dependencies

### Using Mockito

```bash
flutter pub add --dev mockito
flutter pub add --dev build_runner
```

```dart
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

@GenerateMocks([ApiService, StorageService])
void main() {
  late MockApiService mockApi;

  setUp(() {
    mockApi = MockApiService();
  });

  test('fetches trips', () async {
    when(mockApi.get('/trips'))
        .thenAnswer((_) async => [{'id': '1', 'name': 'Trip'}]);

    final trips = await mockApi.get('/trips');

    expect(trips.length, 1);
    verify(mockApi.get('/trips')).called(1);
  });
}
```

## Testing Asynchronous Code

```dart
test('loads data asynchronously', () async {
  final data = await fetchData();
  expect(data, isNotNull);
});

test('handles async errors', () {
  expect(
    () async => await fetchDataWithError(),
    throwsA(isA<Exception>()),
  );
});
```

## Testing Streams

```dart
test('stream emits values', () async {
  final stream = numberStream();

  await expectLater(
    stream,
    emitsInOrder([1, 2, 3, emitsDone]),
  );
});
```

## Performance Testing

```dart
test('search completes within 100ms', () async {
  final stopwatch = Stopwatch()..start();

  await searchPlaces('query');

  stopwatch.stop();
  expect(stopwatch.elapsedMilliseconds, lessThan(100));
});
```

## Test Coverage Tips

### Check Coverage
```bash
flutter test --coverage
lcov --summary coverage/lcov.info
```

### Ignore Generated Files
```yaml
# coverage/lcov.info
LF:0
*.freezed.dart
*.g.dart
*.mocks.dart
```

## Common Testing Patterns

### Testing Form Validation

```dart
testWidgets('shows error for empty email', (tester) async {
  await tester.pumpWidget(TestApp(child: LoginForm()));

  await tester.tap(find.text('Submit'));
  await tester.pump();

  expect(find.text('Email không được để trống'), findsOneWidget);
});
```

### Testing Navigation

```dart
testWidgets('navigates to details screen', (tester) async {
  await tester.pumpWidget(TestApp(child: TripsList()));

  await tester.tap(find.text('Trip Name'));
  await tester.pumpAndSettle();

  expect(find.text('Trip Details'), findsOneWidget);
});
```

### Testing Lists

```dart
testWidgets('displays all items', (tester) async {
  await tester.pumpWidget(TestApp(child: ItemsList()));

  expect(find.byType(ListTile), findsNWidgets(5));
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.0'
      - run: flutter pub get
      - run: dart run build_runner build
      - run: flutter test --coverage
      - uses: codecov/codecov-action@v2
```

## Resources

- [Flutter Testing Documentation](https://docs.flutter.dev/testing)
- [Widget Testing Guide](https://docs.flutter.dev/cookbook/testing/widget/introduction)
- [Mockito Documentation](https://pub.dev/packages/mockito)
- [Golden Toolkit](https://pub.dev/packages/golden_toolkit)

---

**Last Updated:** 2026-10-23  
**Test Files:** 8 created, ~40 more needed  
**Current Coverage:** ~15% (target: 80%+)
