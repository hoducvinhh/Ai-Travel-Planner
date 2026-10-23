import 'package:dio/dio.dart';

/// Error handler utility for API errors
class ErrorHandler {
  /// Convert DioException to user-friendly message
  static String getErrorMessage(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return 'Kết nối timeout. Vui lòng thử lại.';

        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          if (statusCode == 401) {
            return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          } else if (statusCode == 404) {
            return 'Không tìm thấy dữ liệu.';
          } else if (statusCode == 500) {
            return 'Lỗi server. Vui lòng thử lại sau.';
          } else if (statusCode == 400) {
            // Try to extract error message from response
            final message = error.response?.data?['message'];
            if (message != null) {
              return message.toString();
            }
            return 'Dữ liệu không hợp lệ.';
          }
          return error.response?.data?['message']?.toString() ??
              'Đã có lỗi xảy ra.';

        case DioExceptionType.cancel:
          return 'Yêu cầu đã bị hủy.';

        case DioExceptionType.connectionError:
        case DioExceptionType.unknown:
        default:
          return 'Không thể kết nối. Kiểm tra kết nối mạng.';
      }
    }

    return error.toString();
  }

  /// Check if error is authentication error
  static bool isAuthError(dynamic error) {
    if (error is DioException) {
      return error.response?.statusCode == 401;
    }
    return false;
  }

  /// Check if error is network error
  static bool isNetworkError(dynamic error) {
    if (error is DioException) {
      return error.type == DioExceptionType.connectionTimeout ||
          error.type == DioExceptionType.connectionError ||
          error.type == DioExceptionType.unknown;
    }
    return false;
  }
}
