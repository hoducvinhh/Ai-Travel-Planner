// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Place _$PlaceFromJson(Map<String, dynamic> json) => _Place(
  id: json['id'] as String,
  name: json['name'] as String,
  province: _readProvince(json, 'province') as String? ?? 'Việt Nam',
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  categories:
      (_readCategories(json, 'categories') as List<dynamic>?)
          ?.map((e) => e as String)
          .toList() ??
      const [],
  description: json['description'] as String?,
  imageUrl: json['imageUrl'] as String?,
  district: json['district'] as String?,
  priceEstimate: (json['priceEstimate'] as num?)?.toInt() ?? 0,
  popularityScore: (json['popularityScore'] as num?)?.toDouble() ?? 0.0,
  indoorOutdoor: json['indoorOutdoor'] as String?,
  activityLevel: json['activityLevel'] as String?,
  likesCount: (json['likesCount'] as num?)?.toInt() ?? 0,
  savesCount: (json['savesCount'] as num?)?.toInt() ?? 0,
  commentsCount: (json['commentsCount'] as num?)?.toInt() ?? 0,
  ratingAvg: (_readRatingAvg(json, 'ratingAvg') as num?)?.toDouble() ?? 0.0,
  ratingCount: (_readRatingCount(json, 'ratingCount') as num?)?.toInt() ?? 0,
  isLiked: json['isLiked'] as bool? ?? false,
  isSaved: json['isSaved'] as bool? ?? false,
  userRating: (json['userRating'] as num?)?.toInt(),
  nearbyPlaces: (json['nearbyPlaces'] as List<dynamic>?)
      ?.map((e) => Place.fromJson(e as Map<String, dynamic>))
      .toList(),
  amenities: (json['amenities'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  openingHours: json['openingHours'] as String?,
  phone: json['phone'] as String?,
  website: json['website'] as String?,
);

Map<String, dynamic> _$PlaceToJson(_Place instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'province': instance.province,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'categories': instance.categories,
  'description': instance.description,
  'imageUrl': instance.imageUrl,
  'district': instance.district,
  'priceEstimate': instance.priceEstimate,
  'popularityScore': instance.popularityScore,
  'indoorOutdoor': instance.indoorOutdoor,
  'activityLevel': instance.activityLevel,
  'likesCount': instance.likesCount,
  'savesCount': instance.savesCount,
  'commentsCount': instance.commentsCount,
  'ratingAvg': instance.ratingAvg,
  'ratingCount': instance.ratingCount,
  'isLiked': instance.isLiked,
  'isSaved': instance.isSaved,
  'userRating': instance.userRating,
  'nearbyPlaces': instance.nearbyPlaces,
  'amenities': instance.amenities,
  'openingHours': instance.openingHours,
  'phone': instance.phone,
  'website': instance.website,
};

_PlaceCommentUser _$PlaceCommentUserFromJson(Map<String, dynamic> json) =>
    _PlaceCommentUser(
      id: json['id'] as String,
      name: json['name'] as String?,
      email: json['email'] as String? ?? '',
    );

Map<String, dynamic> _$PlaceCommentUserToJson(_PlaceCommentUser instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
    };

_PlaceCommentItem _$PlaceCommentItemFromJson(Map<String, dynamic> json) =>
    _PlaceCommentItem(
      id: json['id'] as String,
      content: json['content'] as String,
      createdAt: json['createdAt'] as String,
      user: PlaceCommentUser.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$PlaceCommentItemToJson(_PlaceCommentItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'createdAt': instance.createdAt,
      'user': instance.user,
    };

_PaginationInfo _$PaginationInfoFromJson(Map<String, dynamic> json) =>
    _PaginationInfo(
      page: (json['page'] as num?)?.toInt() ?? 1,
      limit: (json['limit'] as num?)?.toInt() ?? 12,
      total: (json['total'] as num?)?.toInt() ?? 0,
      totalPages: (json['totalPages'] as num?)?.toInt() ?? 1,
    );

Map<String, dynamic> _$PaginationInfoToJson(_PaginationInfo instance) =>
    <String, dynamic>{
      'page': instance.page,
      'limit': instance.limit,
      'total': instance.total,
      'totalPages': instance.totalPages,
    };

_PaginatedPlacesResponse _$PaginatedPlacesResponseFromJson(
  Map<String, dynamic> json,
) => _PaginatedPlacesResponse(
  items:
      (json['items'] as List<dynamic>?)
          ?.map((e) => Place.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  pagination: PaginationInfo.fromJson(
    json['pagination'] as Map<String, dynamic>,
  ),
);

Map<String, dynamic> _$PaginatedPlacesResponseToJson(
  _PaginatedPlacesResponse instance,
) => <String, dynamic>{
  'items': instance.items,
  'pagination': instance.pagination,
};
