import 'package:freezed_annotation/freezed_annotation.dart';

part 'place.freezed.dart';
part 'place.g.dart';

Object? _readProvince(Map<dynamic, dynamic> json, String key) {
  return json['province'] ?? 'Việt Nam';
}

Object? _readCategories(Map<dynamic, dynamic> json, String key) {
  if (json['categories'] is List) return json['categories'];
  if (json['category'] is String && (json['category'] as String).isNotEmpty) {
    return [json['category']];
  }
  return <String>[];
}

Object? _readRatingAvg(Map<dynamic, dynamic> json, String key) {
  final val = json['ratingAvg'] ?? json['rating'] ?? 0;
  return (val is num) ? val.toDouble() : (double.tryParse(val.toString()) ?? 0.0);
}

Object? _readRatingCount(Map<dynamic, dynamic> json, String key) {
  final val = json['ratingCount'] ?? json['reviewCount'] ?? 0;
  return (val is num) ? val.toInt() : (int.tryParse(val.toString()) ?? 0);
}

/// Place model matching backend PlacesService
@freezed
abstract class Place with _$Place {
  const Place._();

  const factory Place({
    required String id,
    required String name,
    @JsonKey(readValue: _readProvince) @Default('Việt Nam') String province,
    required double latitude,
    required double longitude,
    @JsonKey(readValue: _readCategories) @Default([]) List<String> categories,
    String? description,
    String? imageUrl,
    String? district,
    @Default(0) int priceEstimate,
    @Default(0.0) double popularityScore,
    String? indoorOutdoor,
    String? activityLevel,
    @Default(0) int likesCount,
    @Default(0) int savesCount,
    @Default(0) int commentsCount,
    @JsonKey(readValue: _readRatingAvg) @Default(0.0) double ratingAvg,
    @JsonKey(readValue: _readRatingCount) @Default(0) int ratingCount,
    @Default(false) bool isLiked,
    @Default(false) bool isSaved,
    int? userRating,
    List<Place>? nearbyPlaces,
    List<String>? amenities,
    String? openingHours,
    String? phone,
    String? website,
  }) = _Place;

  factory Place.fromJson(Map<String, dynamic> json) => _$PlaceFromJson(json);

  // Compatibility getters for existing UI widgets
  String? get category => categories.isNotEmpty ? categories.first : null;
  double get rating => ratingAvg;
  int get reviewCount => ratingCount;
  String? get budgetLevel {
    if (priceEstimate <= 0) return 'low';
    if (priceEstimate <= 200000) return 'medium';
    return 'high';
  }
}

/// Comment author summary
@freezed
abstract class PlaceCommentUser with _$PlaceCommentUser {
  const PlaceCommentUser._();

  const factory PlaceCommentUser({
    required String id,
    String? name,
    @Default('') String email,
  }) = _PlaceCommentUser;

  factory PlaceCommentUser.fromJson(Map<String, dynamic> json) =>
      _$PlaceCommentUserFromJson(json);

  String get displayName =>
      (name != null && name!.isNotEmpty) ? name! : email.split('@').first;
}

/// Place comment item
@freezed
abstract class PlaceCommentItem with _$PlaceCommentItem {
  const factory PlaceCommentItem({
    required String id,
    required String content,
    required String createdAt,
    required PlaceCommentUser user,
  }) = _PlaceCommentItem;

  factory PlaceCommentItem.fromJson(Map<String, dynamic> json) =>
      _$PlaceCommentItemFromJson(json);
}

/// Pagination metadata
@freezed
abstract class PaginationInfo with _$PaginationInfo {
  const factory PaginationInfo({
    @Default(1) int page,
    @Default(12) int limit,
    @Default(0) int total,
    @Default(1) int totalPages,
  }) = _PaginationInfo;

  factory PaginationInfo.fromJson(Map<String, dynamic> json) =>
      _$PaginationInfoFromJson(json);
}

/// Paginated places response from GET /places
@freezed
abstract class PaginatedPlacesResponse with _$PaginatedPlacesResponse {
  const factory PaginatedPlacesResponse({
    @Default([]) List<Place> items,
    required PaginationInfo pagination,
  }) = _PaginatedPlacesResponse;

  factory PaginatedPlacesResponse.fromJson(Map<String, dynamic> json) =>
      _$PaginatedPlacesResponseFromJson(json);
}
