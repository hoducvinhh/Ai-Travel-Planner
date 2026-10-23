import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';

void main() {
  group('LoadingIndicator Widget Tests', () {
    testWidgets('should display CircularProgressIndicator', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: LoadingIndicator(),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('should be centered', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: LoadingIndicator(),
          ),
        ),
      );

      expect(find.byType(Center), findsOneWidget);
    });

    testWidgets('should display custom message when provided', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: LoadingIndicator(
              message: 'Đang tải dữ liệu...',
            ),
          ),
        ),
      );

      expect(find.text('Đang tải dữ liệu...'), findsOneWidget);
    });
  });
}
