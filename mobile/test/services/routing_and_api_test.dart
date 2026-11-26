import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/config/env.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/services/routing_service.dart';

void main() {
  group('RoutingService & Helpers', () {
    test('formatDuration formats minutes, hours and multi-day durations', () {
      expect(RoutingService.formatDuration(25), '25 phút');
      expect(RoutingService.formatDuration(60), '1 giờ');
      expect(RoutingService.formatDuration(95), '1 giờ 35 phút');
      expect(RoutingService.formatDuration(48 * 60), '2 ngày');
      expect(RoutingService.formatDuration(50 * 60), '2 ngày 2 giờ');
    });

    test('RouteResult returns mode-specific duration', () {
      const result = RouteResult(
        points: [],
        distanceKm: 5.0,
        motorbikeMinutes: 12,
        drivingMinutes: 14,
        walkingMinutes: 62,
      );

      expect(result.durationFor(TransportMode.motorbike), 12);
      expect(result.durationFor(TransportMode.driving), 14);
      expect(result.durationFor(TransportMode.walking), 62);
    });

    test('ApiService.formatImageUrl resolves relative and absolute URLs', () {
      expect(ApiService.formatImageUrl(null), '');
      expect(ApiService.formatImageUrl(''), '');
      expect(
        ApiService.formatImageUrl('https://cdn.example.com/a.jpg'),
        'https://cdn.example.com/a.jpg',
      );
      expect(
        ApiService.formatImageUrl('/uploads/img.png'),
        '${Env.apiUrl}/uploads/img.png',
      );
      expect(
        ApiService.formatImageUrl('uploads/img.png'),
        '${Env.apiUrl}/uploads/img.png',
      );
    });

    test('provinces configuration includes 11 provinces and 10 categories', () {
      expect(vietnamProvinces.length, 11);
      expect(placeCategories.length, 10);
      expect(getProvinceMeta('Hanoi').label, 'Hà Nội');
    });

    test('Env reads API_URL and ENV from dotenv with default fallback', () {
      dotenv.testLoad(
        fileInput: 'API_URL=http://192.168.1.50:3002\nENV=production',
      );
      expect(Env.apiUrl, 'http://192.168.1.50:3002');
      expect(Env.environment, 'production');
      expect(Env.isProduction, isTrue);

      dotenv.clean();
      expect(Env.apiUrl, 'http://localhost:3002');
      expect(Env.environment, 'dev');
      expect(Env.isDevelopment, isTrue);
    });
  });
}
