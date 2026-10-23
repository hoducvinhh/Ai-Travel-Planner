import 'package:freezed_annotation/freezed_annotation.dart';

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
  const factory User({
    required String id,
    required String email,
    @JsonKey(readValue: _readName) @Default('') String name,
    String? avatar,
    DateTime? createdAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
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

