import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/services/api_service.dart';

/// Provider for ApiService singleton
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});
