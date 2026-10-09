import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_service.dart';

/// Provider for ApiService singleton
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});
