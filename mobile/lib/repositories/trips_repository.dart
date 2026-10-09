import 'package:dio/dio.dart';
import '../models/trip.dart';
import '../services/api_service.dart';
import '../utils/error_handler.dart';

/// Trips repository
class TripsRepository {
  final ApiService _api;

  TripsRepository(this._api);

  /// Get all trips for current user
  Future<List<Trip>> getTrips() async {
    try {
      final response = await _api.get<List>('/trips');

      if (response == null) {
        return [];
      }

      return (response as List)
          .map((json) => Trip.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ErrorHandler.getErrorMessage(e);
    }
  }

  /// Get trip by ID
  Future<Trip> getTripById(String id) async {
    try {
      final response = await _api.get<Map<String, dynamic>>('/trips/$id');

      if (response == null) {
        throw 'Không tìm thấy chuyến đi';
      }

      return Trip.fromJson(response);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw 'Không tìm thấy chuyến đi';
      }
      throw ErrorHandler.getErrorMessage(e);
    }
  }

  /// Create new trip
  Future<Trip> createTrip({
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double budget,
    required int travelers,
    List<String>? categories,
  }) async {
    try {
      final response = await _api.post<Map<String, dynamic>>('/trips', data: {
        'destination': destination,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        'budget': budget,
        'travelers': travelers,
        'categories': categories ?? [],
      });

      if (response == null) {
        throw 'Không thể tạo chuyến đi';
      }

      return Trip.fromJson(response);
    } on DioException catch (e) {
      throw ErrorHandler.getErrorMessage(e);
    }
  }

  /// Update trip
  Future<Trip> updateTrip(String id, Map<String, dynamic> data) async {
    try {
      final response = await _api.patch<Map<String, dynamic>>('/trips/$id', data: data);

      if (response == null) {
        throw 'Không thể cập nhật chuyến đi';
      }

      return Trip.fromJson(response);
    } on DioException catch (e) {
      throw ErrorHandler.getErrorMessage(e);
    }
  }

  /// Delete trip
  Future<void> deleteTrip(String id) async {
    try {
      await _api.delete('/trips/$id');
    } on DioException catch (e) {
      throw ErrorHandler.getErrorMessage(e);
    }
  }
}
