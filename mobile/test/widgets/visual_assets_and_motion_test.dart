import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/widgets/common/animations.dart';
import 'package:travel_planner/widgets/common/empty_state_view.dart';
import 'package:travel_planner/widgets/common/skeleton_cards.dart';

void main() {
  group('Visual Assets & Motion Primitives', () {
    test('provinceAssetPath maps provinces and multi-province destinations', () {
      expect(provinceAssetPath('Lam Dong'), 'assets/images/provinces/dalat.jpg');
      expect(provinceAssetPath('Đà Lạt, Nha Trang'), 'assets/images/provinces/dalat.jpg');
      expect(provinceAssetPath('Sa Pa'), 'assets/images/provinces/sapa.jpg');
      expect(provinceAssetPath('Hội An'), 'assets/images/provinces/hoian.jpg');
      expect(provinceAssetPath(null), 'assets/images/provinces/halong.jpg');
      expect(featuredDestinationBanners.length, 6);
    });

    testWidgets('EmptyStateView displays title, subtitle, and triggers action',
        (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: EmptyStateView(
              assetPath: 'assets/images/illustrations/empty_trips.jpg',
              title: 'Chưa có chuyến đi',
              subtitle: 'Hãy tạo lịch trình đầu tiên.',
              actionLabel: 'Tạo ngay',
              onAction: () => tapped = true,
            ),
          ),
        ),
      );

      expect(find.text('Chưa có chuyến đi'), findsOneWidget);
      expect(find.text('Hãy tạo lịch trình đầu tiên.'), findsOneWidget);
      await tester.tap(find.text('Tạo ngay'));
      expect(tapped, isTrue);
    });

    testWidgets('TactilePressScale triggers onTap cleanly', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TactilePressScale(
              onTap: () => tapped = true,
              child: const Text('Nhấn thử'),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Nhấn thử'));
      await tester.pumpAndSettle();
      expect(tapped, isTrue);
    });

    testWidgets('EditorialArrival honors disableAnimations (Reduce Motion)',
        (tester) async {
      await tester.pumpWidget(
        const MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: MaterialApp(
            home: Scaffold(
              body: EditorialArrival(
                child: Text('Nội dung tức thì'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('Nội dung tức thì'), findsOneWidget);
    });

    testWidgets('Skeleton cards render cleanly under disableAnimations',
        (tester) async {
      await tester.pumpWidget(
        const MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: MaterialApp(
            home: Scaffold(
              body: Column(
                children: [
                  PlaceCardSkeleton(),
                  TripCardSkeleton(),
                ],
              ),
            ),
          ),
        ),
      );

      expect(find.byType(PlaceCardSkeleton), findsOneWidget);
      expect(find.byType(TripCardSkeleton), findsOneWidget);
    });
  });
}
