import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Places repository
class PlacesRepository {
  final ApiService _api;

  PlacesRepository(this._api);

  /// Get all places with filters
  Future<List<Place>> getPlaces({
    String? province,
    String? category,
    String? budgetLevel,
    String? search,
  }) async {
    final queryParams = <String, dynamic>{};
    if (province != null) queryParams['province'] = province;
    if (category != null) queryParams['category'] = category;
    if (budgetLevel != null) queryParams['budgetLevel'] = budgetLevel;
    if (search != null) queryParams['search'] = search;

    final response = await _api.get<List<dynamic>>(
      AppConstants.places,
      queryParams: queryParams,
    );

    return response.map((json) => Place.fromJson(json as Map<String, dynamic>)).toList();
  }

  /// Get place by ID
  Future<Place> getPlaceById(String id) async {
    final response = await _api.get<Map<String, dynamic>>(
      '${AppConstants.places}/$id',
    );

    return Place.fromJson(response);
  }

  /// Track place interaction
  Future<void> trackInteraction({
    required String placeId,
    required String interactionType,
  }) async {
    await _api.post<dynamic>(
      '/interactions',
      data: {
        'placeId': placeId,
        'type': interactionType,
      },
    );
  }
}
