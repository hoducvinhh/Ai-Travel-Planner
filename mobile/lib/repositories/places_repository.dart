import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Places repository aligned with backend PlacesController & InteractionsController
class PlacesRepository {
  final ApiService _api;

  PlacesRepository(this._api);

  /// Get paginated places with filters and sorting
  Future<PaginatedPlacesResponse> getPlaces({
    int page = 1,
    int limit = AppConstants.defaultPageSize,
    String? province,
    String? category,
    String? search,
    String sortBy = 'popularity',
    String? userId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sortBy': sortBy,
    };
    if (province != null && province.isNotEmpty && province != 'ALL') {
      queryParams['province'] = province;
    }
    if (category != null && category.isNotEmpty && category != 'Tất cả') {
      queryParams['category'] = category;
    }
    if (search != null && search.trim().isNotEmpty) {
      queryParams['search'] = search.trim();
    }
    if (userId != null && userId.isNotEmpty) {
      queryParams['userId'] = userId;
    }

    final response = await _api.get<dynamic>(
      AppConstants.places,
      queryParams: queryParams,
    );

    if (response is Map<String, dynamic>) {
      return PaginatedPlacesResponse.fromJson(response);
    }
    if (response is List) {
      final items = response
          .map((e) => Place.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
      return PaginatedPlacesResponse(
        items: items,
        pagination: PaginationInfo(
          page: page,
          limit: limit,
          total: items.length,
          totalPages: 1,
        ),
      );
    }
    return const PaginatedPlacesResponse(
      items: [],
      pagination: PaginationInfo(),
    );
  }

  /// Get place by ID
  Future<Place> getPlaceById(String id, {String? userId}) async {
    final response = await _api.get<Map<String, dynamic>>(
      '${AppConstants.places}/$id',
      queryParams: userId != null ? {'userId': userId} : null,
    );
    return Place.fromJson(response);
  }

  /// Toggle Like on a place
  Future<Map<String, dynamic>> toggleLike({
    required String userId,
    required String placeId,
  }) async {
    final res = await _api.post<Map<String, dynamic>>(
      AppConstants.interactionsToggleLike,
      data: {'userId': userId, 'placeId': placeId},
    );
    return res;
  }

  /// Toggle Save / Wishlist on a place
  Future<Map<String, dynamic>> toggleSave({
    required String userId,
    required String placeId,
  }) async {
    final res = await _api.post<Map<String, dynamic>>(
      AppConstants.interactionsToggleSave,
      data: {'userId': userId, 'placeId': placeId},
    );
    return res;
  }

  /// Rate a place (1-5 stars)
  Future<Map<String, dynamic>> ratePlace({
    required String userId,
    required String placeId,
    required int ratingValue,
  }) async {
    final res = await _api.post<Map<String, dynamic>>(
      AppConstants.interactionsRate,
      data: {
        'userId': userId,
        'placeId': placeId,
        'ratingValue': ratingValue,
      },
    );
    return res;
  }

  /// Remove rating from a place
  Future<Map<String, dynamic>> unratePlace({
    required String userId,
    required String placeId,
  }) async {
    final res = await _api.post<Map<String, dynamic>>(
      AppConstants.interactionsUnrate,
      data: {'userId': userId, 'placeId': placeId},
    );
    return res;
  }

  /// Share a place to user profile
  Future<void> sharePlace({
    required String userId,
    required String placeId,
    String? note,
  }) async {
    await _api.post<dynamic>(
      AppConstants.interactionsShare,
      data: {
        'userId': userId,
        'placeId': placeId,
        if (note != null && note.trim().isNotEmpty) 'note': note.trim(),
      },
    );
  }

  /// Remove a shared place from user profile
  Future<void> unsharePlace({
    required String userId,
    required String placeId,
  }) async {
    await _api.post<dynamic>(
      AppConstants.interactionsUnshare,
      data: {'userId': userId, 'placeId': placeId},
    );
  }

  /// Track interaction event (e.g. VIEW_DETAIL)
  Future<void> trackInteraction({
    required String userId,
    required String placeId,
    String eventType = 'VIEW_DETAIL',
  }) async {
    await _api.post<dynamic>(
      AppConstants.interactionsTrack,
      data: {
        'userId': userId,
        'placeId': placeId,
        'eventType': eventType,
      },
    );
  }

  /// Get comments for a place
  Future<List<PlaceCommentItem>> getPlaceComments(String placeId) async {
    final res = await _api.get<List<dynamic>>(
      '${AppConstants.places}/$placeId/comments',
    );
    return res
        .map((e) => PlaceCommentItem.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  /// Add comment to a place
  Future<PlaceCommentItem> addPlaceComment({
    required String placeId,
    required String userId,
    required String content,
  }) async {
    final res = await _api.post<Map<String, dynamic>>(
      '${AppConstants.places}/$placeId/comments',
      data: {'userId': userId, 'content': content},
    );
    return PlaceCommentItem.fromJson(res);
  }
}
