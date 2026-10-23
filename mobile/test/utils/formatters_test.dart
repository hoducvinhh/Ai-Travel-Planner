import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/utils/formatters.dart';

void main() {
  group('Formatters', () {
    group('formatCurrency', () {
      test('should format currency correctly', () {
        expect(Formatters.formatCurrency(1000000), '1.000.000 đ');
        expect(Formatters.formatCurrency(500000), '500.000 đ');
        expect(Formatters.formatCurrency(0), '0 đ');
        expect(Formatters.formatCurrency(1234567), '1.234.567 đ');
      });

      test('should handle decimal values', () {
        expect(Formatters.formatCurrency(1234.56), '1.235 đ');
        expect(Formatters.formatCurrency(999.99), '1.000 đ');
      });
    });

    group('formatDate', () {
      test('should format date correctly', () {
        final date = DateTime(2024, 3, 15);
        expect(Formatters.formatDate(date), '15/03/2024');
      });

      test('should format date with single digit day/month', () {
        final date = DateTime(2024, 1, 5);
        expect(Formatters.formatDate(date), '05/01/2024');
      });
    });

    group('formatDateRange', () {
      test('should format date range correctly', () {
        final start = DateTime(2024, 3, 15);
        final end = DateTime(2024, 3, 20);
        expect(
          Formatters.formatDateRange(start, end),
          '15/03/2024 - 20/03/2024',
        );
      });

      test('should handle same month range', () {
        final start = DateTime(2024, 5, 10);
        final end = DateTime(2024, 5, 15);
        expect(
          Formatters.formatDateRange(start, end),
          '10/05/2024 - 15/05/2024',
        );
      });
    });

    group('formatDuration', () {
      test('should format duration in days correctly', () {
        expect(Formatters.formatDuration(5), '5 ngày 4 đêm');
      });

      test('should handle single day duration', () {
        expect(Formatters.formatDuration(1), '1 ngày');
      });

      test('should handle multiple days', () {
        expect(Formatters.formatDuration(3), '3 ngày 2 đêm');
      });
    });

    group('formatPhoneNumber', () {
      test('should format Vietnamese phone number', () {
        expect(Formatters.formatPhoneNumber('0123456789'), '0123 456 789');
        expect(Formatters.formatPhoneNumber('0987654321'), '0987 654 321');
      });

      test('should handle phone with country code', () {
        expect(
          Formatters.formatPhoneNumber('+84123456789'),
          '+84 123 456 789',
        );
      });

      test('should return original if invalid length', () {
        expect(Formatters.formatPhoneNumber('123'), '123');
        expect(Formatters.formatPhoneNumber(''), '');
      });
    });

    group('formatTimeAgo', () {
      test('should format seconds ago', () {
        final now = DateTime.now();
        final past = now.subtract(const Duration(seconds: 30));
        expect(Formatters.formatTimeAgo(past), 'Vừa xong');
      });

      test('should format minutes ago', () {
        final now = DateTime.now();
        final past = now.subtract(const Duration(minutes: 5));
        expect(Formatters.formatTimeAgo(past), '5 phút trước');
      });

      test('should format hours ago', () {
        final now = DateTime.now();
        final past = now.subtract(const Duration(hours: 3));
        expect(Formatters.formatTimeAgo(past), '3 giờ trước');
      });

      test('should format days ago', () {
        final now = DateTime.now();
        final past = now.subtract(const Duration(days: 2));
        expect(Formatters.formatTimeAgo(past), '2 ngày trước');
      });

      test('should format date for old timestamps', () {
        final old = DateTime(2024, 1, 15);
        final result = Formatters.formatTimeAgo(old);
        expect(result, contains('/'));
      });
    });

    group('formatCompactNumber', () {
      test('should format large numbers with K suffix', () {
        expect(Formatters.formatCompactNumber(1500), '1.5K');
        expect(Formatters.formatCompactNumber(25000), '25K');
      });

      test('should format millions with M suffix', () {
        expect(Formatters.formatCompactNumber(1500000), '1.5M');
        expect(Formatters.formatCompactNumber(10000000), '10M');
      });

      test('should not format small numbers', () {
        expect(Formatters.formatCompactNumber(999), '999');
        expect(Formatters.formatCompactNumber(500), '500');
      });
    });

    group('formatBudgetLevel', () {
      test('should format budget levels correctly', () {
        expect(Formatters.formatBudgetLevel('low'), 'Tiết kiệm');
        expect(Formatters.formatBudgetLevel('medium'), 'Trung bình');
        expect(Formatters.formatBudgetLevel('high'), 'Cao cấp');
      });

      test('should return capitalized unknown levels', () {
        expect(Formatters.formatBudgetLevel('luxury'), 'Luxury');
        expect(Formatters.formatBudgetLevel('budget'), 'Budget');
      });
    });

    group('formatDistance', () {
      test('should format distance in kilometers', () {
        expect(Formatters.formatDistance(1500), '1.5 km');
        expect(Formatters.formatDistance(5000), '5.0 km');
      });

      test('should format short distance in meters', () {
        expect(Formatters.formatDistance(500), '500 m');
        expect(Formatters.formatDistance(999), '999 m');
      });
    });
  });
}
