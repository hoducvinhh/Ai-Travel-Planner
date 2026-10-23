import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/widgets/common/custom_button.dart';

void main() {
  group('CustomButton Widget Tests', () {
    testWidgets('should display text', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Test Button',
              onPressed: () {},
            ),
          ),
        ),
      );

      expect(find.text('Test Button'), findsOneWidget);
    });

    testWidgets('should call onPressed when tapped', (WidgetTester tester) async {
      bool pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Tap Me',
              onPressed: () {
                pressed = true;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.byType(CustomButton));
      await tester.pump();

      expect(pressed, isTrue);
    });

    testWidgets('should be disabled when onPressed is null', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Disabled',
              onPressed: null,
            ),
          ),
        ),
      );

      final button = tester.widget<ElevatedButton>(
        find.byType(ElevatedButton),
      );

      expect(button.onPressed, isNull);
    });

    testWidgets('should show loading indicator when isLoading is true', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Loading',
              onPressed: () {},
              isLoading: true,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Loading'), findsNothing);
    });

    testWidgets('should display icon when provided', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'With Icon',
              icon: const Icon(Icons.add),
              onPressed: () {},
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.add), findsOneWidget);
      expect(find.text('With Icon'), findsOneWidget);
    });

    testWidgets('should render as outlined button when isOutlined is true', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Outlined',
              onPressed: () {},
              isOutlined: true,
            ),
          ),
        ),
      );

      expect(find.byType(OutlinedButton), findsOneWidget);
    });
  });
}
