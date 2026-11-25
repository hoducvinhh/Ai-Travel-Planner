import 'package:travel_planner/models/trip.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Trips repository aligned with backend TripsController
class TripsRepository {
  final ApiService _api;

  TripsRepository(this._api);

  /// Get all trips of the authenticated user
  Future<List<Trip>> getTrips() async {
    final response = await _api.get<List<dynamic>>(AppConstants.trips);
    return response
        .map((json) => Trip.fromJson(Map<String, dynamic>.from(json as Map)))
        .toList();
  }

  /// Get trip by ID
  Future<Trip> getTripById(String id) async {
    final response = await _api.get<Map<String, dynamic>>(
      '${AppConstants.trips}/$id',
    );
    return Trip.fromJson(response);
  }

  /// Create new trip with backend CreateTripDto schema
  Future<Trip> createTrip({
    required String destination,
    required String startDate,
    required String endDate,
    required double budgetPerPerson,
    required int groupSize,
    List<String>? preferences,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      AppConstants.trips,
      data: {
        'destination': destination,
        'startDate': startDate,
        'endDate': endDate,
        'budgetPerPerson': budgetPerPerson,
        'groupSize': groupSize,
        if (preferences != null && preferences.isNotEmpty)
          'preferences': preferences,
      },
    );
    return Trip.fromJson(response);
  }

  /// Optimize trip route using backend TSP/RouteOptimizer
  Future<Trip> optimizeTrip(String id) async {
    final response = await _api.post<Map<String, dynamic>>(
      '${AppConstants.trips}/$id/optimize',
    );
    return Trip.fromJson(response);
  }

  /// Clone another user's trip (1-Click Clone from Community)
  Future<Trip> cloneTrip(String id) async {
    final response = await _api.post<Map<String, dynamic>>(
      '${AppConstants.trips}/$id/clone',
    );
    return Trip.fromJson(response);
  }

  /// Delete trip (Admin endpoint on backend)
  Future<void> deleteTrip(String id) async {
    await _api.delete('${AppConstants.trips}/$id');
  }
}
