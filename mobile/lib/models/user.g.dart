// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_User _$UserFromJson(Map<String, dynamic> json) => _User(
  id: json['id'] as String,
  email: json['email'] as String,
  name: _readName(json, 'name') as String? ?? '',
  role: json['role'] as String? ?? 'USER',
  preferredStyles:
      (json['preferredStyles'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList() ??
      const [],
  budgetLevel: json['budgetLevel'] as String?,
  avatar: json['avatar'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$UserToJson(_User instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'name': instance.name,
  'role': instance.role,
  'preferredStyles': instance.preferredStyles,
  'budgetLevel': instance.budgetLevel,
  'avatar': instance.avatar,
  'createdAt': instance.createdAt?.toIso8601String(),
};

_LoginDto _$LoginDtoFromJson(Map<String, dynamic> json) => _LoginDto(
  email: json['email'] as String,
  password: json['password'] as String,
);

Map<String, dynamic> _$LoginDtoToJson(_LoginDto instance) => <String, dynamic>{
  'email': instance.email,
  'password': instance.password,
};

_LoginResponse _$LoginResponseFromJson(Map<String, dynamic> json) =>
    _LoginResponse(
      token: _readToken(json, 'token') as String,
      user: User.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$LoginResponseToJson(_LoginResponse instance) =>
    <String, dynamic>{'token': instance.token, 'user': instance.user};

_UserProfileStats _$UserProfileStatsFromJson(Map<String, dynamic> json) =>
    _UserProfileStats(
      tripsCount: (json['tripsCount'] as num?)?.toInt() ?? 0,
      likedCount: (json['likedCount'] as num?)?.toInt() ?? 0,
      savedCount: (json['savedCount'] as num?)?.toInt() ?? 0,
      ratedCount: (json['ratedCount'] as num?)?.toInt() ?? 0,
      sharedCount: (json['sharedCount'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$UserProfileStatsToJson(_UserProfileStats instance) =>
    <String, dynamic>{
      'tripsCount': instance.tripsCount,
      'likedCount': instance.likedCount,
      'savedCount': instance.savedCount,
      'ratedCount': instance.ratedCount,
      'sharedCount': instance.sharedCount,
    };

_UserRatedPlaceItem _$UserRatedPlaceItemFromJson(Map<String, dynamic> json) =>
    _UserRatedPlaceItem(
      place: Place.fromJson(json['place'] as Map<String, dynamic>),
      rating: (json['rating'] as num).toInt(),
      ratedAt: json['ratedAt'] as String,
    );

Map<String, dynamic> _$UserRatedPlaceItemToJson(_UserRatedPlaceItem instance) =>
    <String, dynamic>{
      'place': instance.place,
      'rating': instance.rating,
      'ratedAt': instance.ratedAt,
    };

_UserSharedPlaceItem _$UserSharedPlaceItemFromJson(Map<String, dynamic> json) =>
    _UserSharedPlaceItem(
      id: json['id'] as String,
      place: Place.fromJson(json['place'] as Map<String, dynamic>),
      note: json['note'] as String?,
      sharedAt: json['sharedAt'] as String,
    );

Map<String, dynamic> _$UserSharedPlaceItemToJson(
  _UserSharedPlaceItem instance,
) => <String, dynamic>{
  'id': instance.id,
  'place': instance.place,
  'note': instance.note,
  'sharedAt': instance.sharedAt,
};

_UserProfileData _$UserProfileDataFromJson(
  Map<String, dynamic> json,
) => _UserProfileData(
  user: User.fromJson(json['user'] as Map<String, dynamic>),
  trips:
      (json['trips'] as List<dynamic>?)
          ?.map((e) => Trip.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  savedPlaces:
      (json['savedPlaces'] as List<dynamic>?)
          ?.map((e) => Place.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  likedPlaces:
      (json['likedPlaces'] as List<dynamic>?)
          ?.map((e) => Place.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  ratedPlaces:
      (json['ratedPlaces'] as List<dynamic>?)
          ?.map((e) => UserRatedPlaceItem.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  sharedPlaces:
      (json['sharedPlaces'] as List<dynamic>?)
          ?.map((e) => UserSharedPlaceItem.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  stats: UserProfileStats.fromJson(json['stats'] as Map<String, dynamic>),
);

Map<String, dynamic> _$UserProfileDataToJson(_UserProfileData instance) =>
    <String, dynamic>{
      'user': instance.user,
      'trips': instance.trips,
      'savedPlaces': instance.savedPlaces,
      'likedPlaces': instance.likedPlaces,
      'ratedPlaces': instance.ratedPlaces,
      'sharedPlaces': instance.sharedPlaces,
      'stats': instance.stats,
    };
