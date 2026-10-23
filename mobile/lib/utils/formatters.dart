import 'package:intl/intl.dart';

/// Date and number formatters
class Formatters {
  /// Format date to Vietnamese format: dd/MM/yyyy
  static String formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  /// Format date with time: dd/MM/yyyy HH:mm
  static String formatDateTime(DateTime date) {
    return DateFormat('dd/MM/yyyy HH:mm').format(date);
  }

  /// Format date to readable format: 15 Thg 10, 2026
  static String formatDateReadable(DateTime date) {
    return DateFormat('dd MMM, yyyy', 'vi').format(date);
  }

  /// Format time only: HH:mm
  static String formatTime(DateTime date) {
    return DateFormat('HH:mm').format(date);
  }

  /// Format relative time: "2 giờ trước", "3 ngày trước"
  static String formatRelativeTime(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inSeconds < 60) {
      return 'Vừa xong';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} phút trước';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} giờ trước';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} ngày trước';
    } else if (difference.inDays < 30) {
      final weeks = (difference.inDays / 7).floor();
      return '$weeks tuần trước';
    } else if (difference.inDays < 365) {
      final months = (difference.inDays / 30).floor();
      return '$months tháng trước';
    } else {
      final years = (difference.inDays / 365).floor();
      return '$years năm trước';
    }
  }

  /// Format date range: "15/10 - 20/10/2026"
  static String formatDateRange(DateTime start, DateTime end) {
    if (start.year == end.year && start.month == end.month) {
      return '${DateFormat('dd').format(start)} - ${formatDate(end)}';
    }
    return '${formatDate(start)} - ${formatDate(end)}';
  }

  /// Format currency: 1,000,000 ₫
  static String formatCurrency(num amount, {String symbol = '₫'}) {
    final formatter = NumberFormat('#,###', 'vi');
    return '${formatter.format(amount.round())} $symbol';
  }

  /// Format number: 1,000
  static String formatNumber(num number) {
    final formatter = NumberFormat('#,###', 'vi');
    return formatter.format(number);
  }

  /// Format compact number: 1.2K, 1.5M
  static String formatCompactNumber(num number) {
    if (number < 1000) {
      return number.toString();
    } else if (number < 1000000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    } else {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    }
  }

  /// Format duration: "3 ngày 2 đêm"
  static String formatDuration(int days) {
    if (days == 1) {
      return '1 ngày';
    }
    return '$days ngày ${days - 1} đêm';
  }

  /// Parse date string from API (ISO 8601)
  static DateTime? parseDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return null;
    try {
      return DateTime.parse(dateStr);
    } catch (e) {
      return null;
    }
  }

  /// Format phone number: 0123456789 -> 0123 456 789
  static String formatPhoneNumber(String phone) {
    if (phone.length < 10) return phone;

    if (phone.startsWith('+84')) {
      // +84123456789 -> +84 123 456 789
      return '+84 ${phone.substring(3, 6)} ${phone.substring(6, 9)} ${phone.substring(9)}';
    } else if (phone.length == 10) {
      // 0123456789 -> 0123 456 789
      return '${phone.substring(0, 4)} ${phone.substring(4, 7)} ${phone.substring(7)}';
    }

    return phone;
  }

  /// Format time ago: "5 phút trước", "2 giờ trước"
  static String formatTimeAgo(DateTime dateTime) {
    return formatRelativeTime(dateTime);
  }

  /// Format budget level
  static String formatBudgetLevel(String level) {
    switch (level.toLowerCase()) {
      case 'low':
        return 'Tiết kiệm';
      case 'medium':
        return 'Trung bình';
      case 'high':
        return 'Cao cấp';
      default:
        return level[0].toUpperCase() + level.substring(1);
    }
  }

  /// Format distance: 1500 -> 1.5 km, 500 -> 500 m
  static String formatDistance(num meters) {
    if (meters < 1000) {
      return '${meters.toInt()} m';
    } else {
      return '${(meters / 1000).toStringAsFixed(1)} km';
    }
  }
}
