import 'package:travel_planner/models/trip.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Trips repository
class TripsRepository {
  final ApiService _api;

  TripsRepository(this._api);

  /// Get all trips
  Future<List<Trip>> getTrips() async {
    final response = await _api.get<List<dynamic>>(
      AppConstants.trips,
    );

    return response.map((json) => Trip.fromJson(json as Map<String, dynamic>)).toList();
  }

  /// Get trip by ID
  Future<Trip> getTripById(String id) async {
    final response = await _api.get<Map<String, dynamic>>(
      '${AppConstants.trips}/$id',
    );

    return Trip.fromJson(response);
  }

  /// Create new trip
  Future<Trip> createTrip({
    required String destination,
    required String startDate,
    required String endDate,
    required double budget,
    int? travelersCount,
    List<String>? preferences,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      AppConstants.trips,
      data: {
        'destination': destination,
        'startDate': startDate,
        'endDate': endDate,
        'budget': budget,
        if (travelersCount != null) 'travelersCount': travelersCount,
        if (preferences != null) 'preferences': preferences,
      },
    );

    return Trip.fromJson(response);
  }

  /// Delete trip
  Future<void> deleteTrip(String id) async {
    await _api.delete('${AppConstants.trips}/$id');
  }
}
