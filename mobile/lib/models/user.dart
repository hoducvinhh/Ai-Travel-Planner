import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/models/trip.dart';

part 'user.freezed.dart';
part 'user.g.dart';

Object? _readName(Map<dynamic, dynamic> json, String key) {
  return json['name'] ?? json['email']?.toString().split('@').first ?? '';
}

Object? _readToken(Map<dynamic, dynamic> json, String key) {
  return json['access_token'] ?? json['token'] ?? '';
}

/// User model
@freezed
abstract class User with _$User {
  const User._();

  const factory User({
    required String id,
    required String email,
    @JsonKey(readValue: _readName) @Default('') String name,
    @Default('USER') String role,
    @Default([]) List<String> preferredStyles,
    String? budgetLevel,
    String? avatar,
    DateTime? createdAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  bool get needsOnboarding => preferredStyles.isEmpty;
  String get displayName => name.isNotEmpty ? name : email.split('@').first;
}

/// Login request DTO
@freezed
abstract class LoginDto with _$LoginDto {
  const factory LoginDto({
    required String email,
    required String password,
  }) = _LoginDto;

  factory LoginDto.fromJson(Map<String, dynamic> json) =>
      _$LoginDtoFromJson(json);
}

/// Login response
@freezed
abstract class LoginResponse with _$LoginResponse {
  const factory LoginResponse({
    @JsonKey(readValue: _readToken) required String token,
    required User user,
  }) = _LoginResponse;

  factory LoginResponse.fromJson(Map<String, dynamic> json) =>
      _$LoginResponseFromJson(json);
}

/// User profile statistics
@freezed
abstract class UserProfileStats with _$UserProfileStats {
  const factory UserProfileStats({
    @Default(0) int tripsCount,
    @Default(0) int likedCount,
    @Default(0) int savedCount,
    @Default(0) int ratedCount,
    @Default(0) int sharedCount,
  }) = _UserProfileStats;

  factory UserProfileStats.fromJson(Map<String, dynamic> json) =>
      _$UserProfileStatsFromJson(json);
}

/// Rated place entry on user profile
@freezed
abstract class UserRatedPlaceItem with _$UserRatedPlaceItem {
  const factory UserRatedPlaceItem({
    required Place place,
    required int rating,
    required String ratedAt,
  }) = _UserRatedPlaceItem;

  factory UserRatedPlaceItem.fromJson(Map<String, dynamic> json) =>
      _$UserRatedPlaceItemFromJson(json);
}

/// Shared place entry on user profile
@freezed
abstract class UserSharedPlaceItem with _$UserSharedPlaceItem {
  const factory UserSharedPlaceItem({
    required String id,
    required Place place,
    String? note,
    required String sharedAt,
  }) = _UserSharedPlaceItem;

  factory UserSharedPlaceItem.fromJson(Map<String, dynamic> json) =>
      _$UserSharedPlaceItemFromJson(json);
}

/// Full user profile dashboard data from GET /users/:id/profile
@freezed
abstract class UserProfileData with _$UserProfileData {
  const factory UserProfileData({
    required User user,
    @Default([]) List<Trip> trips,
    @Default([]) List<Place> savedPlaces,
    @Default([]) List<Place> likedPlaces,
    @Default([]) List<UserRatedPlaceItem> ratedPlaces,
    @Default([]) List<UserSharedPlaceItem> sharedPlaces,
    required UserProfileStats stats,
  }) = _UserProfileData;

  factory UserProfileData.fromJson(Map<String, dynamic> json) =>
      _$UserProfileDataFromJson(json);
}
