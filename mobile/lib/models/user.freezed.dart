// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$User {

 String get id; String get email;@JsonKey(readValue: _readName) String get name; String get role; List<String> get preferredStyles; String? get budgetLevel; String? get avatar; DateTime? get createdAt;
/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserCopyWith<User> get copyWith => _$UserCopyWithImpl<User>(this as User, _$identity);

  /// Serializes this User to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as User;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is User&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.email, _this.email) || other.email == _this.email)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.role, _this.role) || other.role == _this.role)&&const DeepCollectionEquality().equals(other.preferredStyles, _this.preferredStyles)&&(identical(other.budgetLevel, _this.budgetLevel) || other.budgetLevel == _this.budgetLevel)&&(identical(other.avatar, _this.avatar) || other.avatar == _this.avatar)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as User;
  return Object.hash(runtimeType,_this.id,_this.email,_this.name,_this.role,const DeepCollectionEquality().hash(_this.preferredStyles),_this.budgetLevel,_this.avatar,_this.createdAt);
}

@override
String toString() {
  final _this = this as User;
  return 'User(id: ${_this.id}, email: ${_this.email}, name: ${_this.name}, role: ${_this.role}, preferredStyles: ${_this.preferredStyles}, budgetLevel: ${_this.budgetLevel}, avatar: ${_this.avatar}, createdAt: ${_this.createdAt})';
}


}

/// @nodoc
abstract mixin class $UserCopyWith<$Res>  {
  factory $UserCopyWith(User value, $Res Function(User) _then) = _$UserCopyWithImpl;
@useResult
$Res call({
 String id, String email,@JsonKey(readValue: _readName) String name, String role, List<String> preferredStyles, String? budgetLevel, String? avatar, DateTime? createdAt
});




}
/// @nodoc
class _$UserCopyWithImpl<$Res>
    implements $UserCopyWith<$Res> {
  _$UserCopyWithImpl(this._self, this._then);

  final User _self;
  final $Res Function(User) _then;

/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? email = null,Object? name = null,Object? role = null,Object? preferredStyles = null,Object? budgetLevel = freezed,Object? avatar = freezed,Object? createdAt = freezed,}) {
  return _then(User(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as String,preferredStyles: null == preferredStyles ? _self.preferredStyles : preferredStyles // ignore: cast_nullable_to_non_nullable
as List<String>,budgetLevel: freezed == budgetLevel ? _self.budgetLevel : budgetLevel // ignore: cast_nullable_to_non_nullable
as String?,avatar: freezed == avatar ? _self.avatar : avatar // ignore: cast_nullable_to_non_nullable
as String?,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [User].
extension UserPatterns on User {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _User value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _User() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _User value)  $default,){
final _that = this;
switch (_that) {
case _User():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _User value)?  $default,){
final _that = this;
switch (_that) {
case _User() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String email, @JsonKey(readValue: _readName)  String name,  String role,  List<String> preferredStyles,  String? budgetLevel,  String? avatar,  DateTime? createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _User() when $default != null:
return $default(_that.id,_that.email,_that.name,_that.role,_that.preferredStyles,_that.budgetLevel,_that.avatar,_that.createdAt);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String email, @JsonKey(readValue: _readName)  String name,  String role,  List<String> preferredStyles,  String? budgetLevel,  String? avatar,  DateTime? createdAt)  $default,) {final _that = this;
switch (_that) {
case _User():
return $default(_that.id,_that.email,_that.name,_that.role,_that.preferredStyles,_that.budgetLevel,_that.avatar,_that.createdAt);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String email, @JsonKey(readValue: _readName)  String name,  String role,  List<String> preferredStyles,  String? budgetLevel,  String? avatar,  DateTime? createdAt)?  $default,) {final _that = this;
switch (_that) {
case _User() when $default != null:
return $default(_that.id,_that.email,_that.name,_that.role,_that.preferredStyles,_that.budgetLevel,_that.avatar,_that.createdAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _User extends User {
  const _User({required this.id, required this.email, @JsonKey(readValue: _readName) this.name = '', this.role = 'USER',  List<String> preferredStyles = const [], this.budgetLevel, this.avatar, this.createdAt}): _preferredStyles = preferredStyles,super._();
  factory _User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

@override final  String id;
@override final  String email;
@override@JsonKey(readValue: _readName) final  String name;
@override@JsonKey() final  String role;
 final  List<String> _preferredStyles;
@override@JsonKey() List<String> get preferredStyles {
  if (_preferredStyles is EqualUnmodifiableListView) return _preferredStyles;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_preferredStyles);
}

@override final  String? budgetLevel;
@override final  String? avatar;
@override final  DateTime? createdAt;

/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserCopyWith<_User> get copyWith => __$UserCopyWithImpl<_User>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _User&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email)&&(identical(other.name, name) || other.name == name)&&(identical(other.role, role) || other.role == role)&&const DeepCollectionEquality().equals(other.preferredStyles, _preferredStyles)&&(identical(other.budgetLevel, budgetLevel) || other.budgetLevel == budgetLevel)&&(identical(other.avatar, avatar) || other.avatar == avatar)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,email,name,role,const DeepCollectionEquality().hash(_preferredStyles),budgetLevel,avatar,createdAt);
}

@override
String toString() {
    return 'User(id: $id, email: $email, name: $name, role: $role, preferredStyles: $preferredStyles, budgetLevel: $budgetLevel, avatar: $avatar, createdAt: $createdAt)';
}


}

/// @nodoc
abstract mixin class _$UserCopyWith<$Res> implements $UserCopyWith<$Res> {
  factory _$UserCopyWith(_User value, $Res Function(_User) _then) = __$UserCopyWithImpl;
@override @useResult
$Res call({
 String id, String email,@JsonKey(readValue: _readName) String name, String role, List<String> preferredStyles, String? budgetLevel, String? avatar, DateTime? createdAt
});




}
/// @nodoc
class __$UserCopyWithImpl<$Res>
    implements _$UserCopyWith<$Res> {
  __$UserCopyWithImpl(this._self, this._then);

  final _User _self;
  final $Res Function(_User) _then;

/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? email = null,Object? name = null,Object? role = null,Object? preferredStyles = null,Object? budgetLevel = freezed,Object? avatar = freezed,Object? createdAt = freezed,}) {
  return _then(_User(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as String,preferredStyles: null == preferredStyles ? _self._preferredStyles : preferredStyles // ignore: cast_nullable_to_non_nullable
as List<String>,budgetLevel: freezed == budgetLevel ? _self.budgetLevel : budgetLevel // ignore: cast_nullable_to_non_nullable
as String?,avatar: freezed == avatar ? _self.avatar : avatar // ignore: cast_nullable_to_non_nullable
as String?,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}


/// @nodoc
mixin _$LoginDto {

 String get email; String get password;
/// Create a copy of LoginDto
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LoginDtoCopyWith<LoginDto> get copyWith => _$LoginDtoCopyWithImpl<LoginDto>(this as LoginDto, _$identity);

  /// Serializes this LoginDto to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as LoginDto;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LoginDto&&(identical(other.email, _this.email) || other.email == _this.email)&&(identical(other.password, _this.password) || other.password == _this.password));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as LoginDto;
  return Object.hash(runtimeType,_this.email,_this.password);
}

@override
String toString() {
  final _this = this as LoginDto;
  return 'LoginDto(email: ${_this.email}, password: ${_this.password})';
}


}

/// @nodoc
abstract mixin class $LoginDtoCopyWith<$Res>  {
  factory $LoginDtoCopyWith(LoginDto value, $Res Function(LoginDto) _then) = _$LoginDtoCopyWithImpl;
@useResult
$Res call({
 String email, String password
});




}
/// @nodoc
class _$LoginDtoCopyWithImpl<$Res>
    implements $LoginDtoCopyWith<$Res> {
  _$LoginDtoCopyWithImpl(this._self, this._then);

  final LoginDto _self;
  final $Res Function(LoginDto) _then;

/// Create a copy of LoginDto
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? email = null,Object? password = null,}) {
  return _then(LoginDto(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [LoginDto].
extension LoginDtoPatterns on LoginDto {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LoginDto value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LoginDto() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LoginDto value)  $default,){
final _that = this;
switch (_that) {
case _LoginDto():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LoginDto value)?  $default,){
final _that = this;
switch (_that) {
case _LoginDto() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String email,  String password)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LoginDto() when $default != null:
return $default(_that.email,_that.password);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String email,  String password)  $default,) {final _that = this;
switch (_that) {
case _LoginDto():
return $default(_that.email,_that.password);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String email,  String password)?  $default,) {final _that = this;
switch (_that) {
case _LoginDto() when $default != null:
return $default(_that.email,_that.password);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LoginDto implements LoginDto {
  const _LoginDto({required this.email, required this.password});
  factory _LoginDto.fromJson(Map<String, dynamic> json) => _$LoginDtoFromJson(json);

@override final  String email;
@override final  String password;

/// Create a copy of LoginDto
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LoginDtoCopyWith<_LoginDto> get copyWith => __$LoginDtoCopyWithImpl<_LoginDto>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LoginDtoToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _LoginDto&&(identical(other.email, email) || other.email == email)&&(identical(other.password, password) || other.password == password));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,email,password);
}

@override
String toString() {
    return 'LoginDto(email: $email, password: $password)';
}


}

/// @nodoc
abstract mixin class _$LoginDtoCopyWith<$Res> implements $LoginDtoCopyWith<$Res> {
  factory _$LoginDtoCopyWith(_LoginDto value, $Res Function(_LoginDto) _then) = __$LoginDtoCopyWithImpl;
@override @useResult
$Res call({
 String email, String password
});




}
/// @nodoc
class __$LoginDtoCopyWithImpl<$Res>
    implements _$LoginDtoCopyWith<$Res> {
  __$LoginDtoCopyWithImpl(this._self, this._then);

  final _LoginDto _self;
  final $Res Function(_LoginDto) _then;

/// Create a copy of LoginDto
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? email = null,Object? password = null,}) {
  return _then(_LoginDto(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$LoginResponse {

@JsonKey(readValue: _readToken) String get token; User get user;
/// Create a copy of LoginResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LoginResponseCopyWith<LoginResponse> get copyWith => _$LoginResponseCopyWithImpl<LoginResponse>(this as LoginResponse, _$identity);

  /// Serializes this LoginResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as LoginResponse;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LoginResponse&&(identical(other.token, _this.token) || other.token == _this.token)&&(identical(other.user, _this.user) || other.user == _this.user));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as LoginResponse;
  return Object.hash(runtimeType,_this.token,_this.user);
}

@override
String toString() {
  final _this = this as LoginResponse;
  return 'LoginResponse(token: ${_this.token}, user: ${_this.user})';
}


}

/// @nodoc
abstract mixin class $LoginResponseCopyWith<$Res>  {
  factory $LoginResponseCopyWith(LoginResponse value, $Res Function(LoginResponse) _then) = _$LoginResponseCopyWithImpl;
@useResult
$Res call({
@JsonKey(readValue: _readToken) String token, User user
});


$UserCopyWith<$Res> get user;

}
/// @nodoc
class _$LoginResponseCopyWithImpl<$Res>
    implements $LoginResponseCopyWith<$Res> {
  _$LoginResponseCopyWithImpl(this._self, this._then);

  final LoginResponse _self;
  final $Res Function(LoginResponse) _then;

/// Create a copy of LoginResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? token = null,Object? user = null,}) {
  return _then(LoginResponse(
token: null == token ? _self.token : token // ignore: cast_nullable_to_non_nullable
as String,user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as User,
  ));
}
/// Create a copy of LoginResponse
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserCopyWith<$Res> get user {
  
  return $UserCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// Adds pattern-matching-related methods to [LoginResponse].
extension LoginResponsePatterns on LoginResponse {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LoginResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LoginResponse() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LoginResponse value)  $default,){
final _that = this;
switch (_that) {
case _LoginResponse():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LoginResponse value)?  $default,){
final _that = this;
switch (_that) {
case _LoginResponse() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(readValue: _readToken)  String token,  User user)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LoginResponse() when $default != null:
return $default(_that.token,_that.user);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(readValue: _readToken)  String token,  User user)  $default,) {final _that = this;
switch (_that) {
case _LoginResponse():
return $default(_that.token,_that.user);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(readValue: _readToken)  String token,  User user)?  $default,) {final _that = this;
switch (_that) {
case _LoginResponse() when $default != null:
return $default(_that.token,_that.user);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LoginResponse implements LoginResponse {
  const _LoginResponse({@JsonKey(readValue: _readToken) required this.token, required this.user});
  factory _LoginResponse.fromJson(Map<String, dynamic> json) => _$LoginResponseFromJson(json);

@override@JsonKey(readValue: _readToken) final  String token;
@override final  User user;

/// Create a copy of LoginResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LoginResponseCopyWith<_LoginResponse> get copyWith => __$LoginResponseCopyWithImpl<_LoginResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LoginResponseToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _LoginResponse&&(identical(other.token, token) || other.token == token)&&(identical(other.user, user) || other.user == user));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,token,user);
}

@override
String toString() {
    return 'LoginResponse(token: $token, user: $user)';
}


}

/// @nodoc
abstract mixin class _$LoginResponseCopyWith<$Res> implements $LoginResponseCopyWith<$Res> {
  factory _$LoginResponseCopyWith(_LoginResponse value, $Res Function(_LoginResponse) _then) = __$LoginResponseCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(readValue: _readToken) String token, User user
});


@override $UserCopyWith<$Res> get user;

}
/// @nodoc
class __$LoginResponseCopyWithImpl<$Res>
    implements _$LoginResponseCopyWith<$Res> {
  __$LoginResponseCopyWithImpl(this._self, this._then);

  final _LoginResponse _self;
  final $Res Function(_LoginResponse) _then;

/// Create a copy of LoginResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? token = null,Object? user = null,}) {
  return _then(_LoginResponse(
token: null == token ? _self.token : token // ignore: cast_nullable_to_non_nullable
as String,user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as User,
  ));
}

/// Create a copy of LoginResponse
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserCopyWith<$Res> get user {
  
  return $UserCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// @nodoc
mixin _$UserProfileStats {

 int get tripsCount; int get likedCount; int get savedCount; int get ratedCount; int get sharedCount;
/// Create a copy of UserProfileStats
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserProfileStatsCopyWith<UserProfileStats> get copyWith => _$UserProfileStatsCopyWithImpl<UserProfileStats>(this as UserProfileStats, _$identity);

  /// Serializes this UserProfileStats to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as UserProfileStats;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserProfileStats&&(identical(other.tripsCount, _this.tripsCount) || other.tripsCount == _this.tripsCount)&&(identical(other.likedCount, _this.likedCount) || other.likedCount == _this.likedCount)&&(identical(other.savedCount, _this.savedCount) || other.savedCount == _this.savedCount)&&(identical(other.ratedCount, _this.ratedCount) || other.ratedCount == _this.ratedCount)&&(identical(other.sharedCount, _this.sharedCount) || other.sharedCount == _this.sharedCount));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as UserProfileStats;
  return Object.hash(runtimeType,_this.tripsCount,_this.likedCount,_this.savedCount,_this.ratedCount,_this.sharedCount);
}

@override
String toString() {
  final _this = this as UserProfileStats;
  return 'UserProfileStats(tripsCount: ${_this.tripsCount}, likedCount: ${_this.likedCount}, savedCount: ${_this.savedCount}, ratedCount: ${_this.ratedCount}, sharedCount: ${_this.sharedCount})';
}


}

/// @nodoc
abstract mixin class $UserProfileStatsCopyWith<$Res>  {
  factory $UserProfileStatsCopyWith(UserProfileStats value, $Res Function(UserProfileStats) _then) = _$UserProfileStatsCopyWithImpl;
@useResult
$Res call({
 int tripsCount, int likedCount, int savedCount, int ratedCount, int sharedCount
});




}
/// @nodoc
class _$UserProfileStatsCopyWithImpl<$Res>
    implements $UserProfileStatsCopyWith<$Res> {
  _$UserProfileStatsCopyWithImpl(this._self, this._then);

  final UserProfileStats _self;
  final $Res Function(UserProfileStats) _then;

/// Create a copy of UserProfileStats
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? tripsCount = null,Object? likedCount = null,Object? savedCount = null,Object? ratedCount = null,Object? sharedCount = null,}) {
  return _then(UserProfileStats(
tripsCount: null == tripsCount ? _self.tripsCount : tripsCount // ignore: cast_nullable_to_non_nullable
as int,likedCount: null == likedCount ? _self.likedCount : likedCount // ignore: cast_nullable_to_non_nullable
as int,savedCount: null == savedCount ? _self.savedCount : savedCount // ignore: cast_nullable_to_non_nullable
as int,ratedCount: null == ratedCount ? _self.ratedCount : ratedCount // ignore: cast_nullable_to_non_nullable
as int,sharedCount: null == sharedCount ? _self.sharedCount : sharedCount // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [UserProfileStats].
extension UserProfileStatsPatterns on UserProfileStats {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserProfileStats value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserProfileStats() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserProfileStats value)  $default,){
final _that = this;
switch (_that) {
case _UserProfileStats():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserProfileStats value)?  $default,){
final _that = this;
switch (_that) {
case _UserProfileStats() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int tripsCount,  int likedCount,  int savedCount,  int ratedCount,  int sharedCount)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserProfileStats() when $default != null:
return $default(_that.tripsCount,_that.likedCount,_that.savedCount,_that.ratedCount,_that.sharedCount);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int tripsCount,  int likedCount,  int savedCount,  int ratedCount,  int sharedCount)  $default,) {final _that = this;
switch (_that) {
case _UserProfileStats():
return $default(_that.tripsCount,_that.likedCount,_that.savedCount,_that.ratedCount,_that.sharedCount);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int tripsCount,  int likedCount,  int savedCount,  int ratedCount,  int sharedCount)?  $default,) {final _that = this;
switch (_that) {
case _UserProfileStats() when $default != null:
return $default(_that.tripsCount,_that.likedCount,_that.savedCount,_that.ratedCount,_that.sharedCount);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserProfileStats implements UserProfileStats {
  const _UserProfileStats({this.tripsCount = 0, this.likedCount = 0, this.savedCount = 0, this.ratedCount = 0, this.sharedCount = 0});
  factory _UserProfileStats.fromJson(Map<String, dynamic> json) => _$UserProfileStatsFromJson(json);

@override@JsonKey() final  int tripsCount;
@override@JsonKey() final  int likedCount;
@override@JsonKey() final  int savedCount;
@override@JsonKey() final  int ratedCount;
@override@JsonKey() final  int sharedCount;

/// Create a copy of UserProfileStats
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserProfileStatsCopyWith<_UserProfileStats> get copyWith => __$UserProfileStatsCopyWithImpl<_UserProfileStats>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserProfileStatsToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserProfileStats&&(identical(other.tripsCount, tripsCount) || other.tripsCount == tripsCount)&&(identical(other.likedCount, likedCount) || other.likedCount == likedCount)&&(identical(other.savedCount, savedCount) || other.savedCount == savedCount)&&(identical(other.ratedCount, ratedCount) || other.ratedCount == ratedCount)&&(identical(other.sharedCount, sharedCount) || other.sharedCount == sharedCount));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,tripsCount,likedCount,savedCount,ratedCount,sharedCount);
}

@override
String toString() {
    return 'UserProfileStats(tripsCount: $tripsCount, likedCount: $likedCount, savedCount: $savedCount, ratedCount: $ratedCount, sharedCount: $sharedCount)';
}


}

/// @nodoc
abstract mixin class _$UserProfileStatsCopyWith<$Res> implements $UserProfileStatsCopyWith<$Res> {
  factory _$UserProfileStatsCopyWith(_UserProfileStats value, $Res Function(_UserProfileStats) _then) = __$UserProfileStatsCopyWithImpl;
@override @useResult
$Res call({
 int tripsCount, int likedCount, int savedCount, int ratedCount, int sharedCount
});




}
/// @nodoc
class __$UserProfileStatsCopyWithImpl<$Res>
    implements _$UserProfileStatsCopyWith<$Res> {
  __$UserProfileStatsCopyWithImpl(this._self, this._then);

  final _UserProfileStats _self;
  final $Res Function(_UserProfileStats) _then;

/// Create a copy of UserProfileStats
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? tripsCount = null,Object? likedCount = null,Object? savedCount = null,Object? ratedCount = null,Object? sharedCount = null,}) {
  return _then(_UserProfileStats(
tripsCount: null == tripsCount ? _self.tripsCount : tripsCount // ignore: cast_nullable_to_non_nullable
as int,likedCount: null == likedCount ? _self.likedCount : likedCount // ignore: cast_nullable_to_non_nullable
as int,savedCount: null == savedCount ? _self.savedCount : savedCount // ignore: cast_nullable_to_non_nullable
as int,ratedCount: null == ratedCount ? _self.ratedCount : ratedCount // ignore: cast_nullable_to_non_nullable
as int,sharedCount: null == sharedCount ? _self.sharedCount : sharedCount // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}


/// @nodoc
mixin _$UserRatedPlaceItem {

 Place get place; int get rating; String get ratedAt;
/// Create a copy of UserRatedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserRatedPlaceItemCopyWith<UserRatedPlaceItem> get copyWith => _$UserRatedPlaceItemCopyWithImpl<UserRatedPlaceItem>(this as UserRatedPlaceItem, _$identity);

  /// Serializes this UserRatedPlaceItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as UserRatedPlaceItem;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserRatedPlaceItem&&(identical(other.place, _this.place) || other.place == _this.place)&&(identical(other.rating, _this.rating) || other.rating == _this.rating)&&(identical(other.ratedAt, _this.ratedAt) || other.ratedAt == _this.ratedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as UserRatedPlaceItem;
  return Object.hash(runtimeType,_this.place,_this.rating,_this.ratedAt);
}

@override
String toString() {
  final _this = this as UserRatedPlaceItem;
  return 'UserRatedPlaceItem(place: ${_this.place}, rating: ${_this.rating}, ratedAt: ${_this.ratedAt})';
}


}

/// @nodoc
abstract mixin class $UserRatedPlaceItemCopyWith<$Res>  {
  factory $UserRatedPlaceItemCopyWith(UserRatedPlaceItem value, $Res Function(UserRatedPlaceItem) _then) = _$UserRatedPlaceItemCopyWithImpl;
@useResult
$Res call({
 Place place, int rating, String ratedAt
});


$PlaceCopyWith<$Res> get place;

}
/// @nodoc
class _$UserRatedPlaceItemCopyWithImpl<$Res>
    implements $UserRatedPlaceItemCopyWith<$Res> {
  _$UserRatedPlaceItemCopyWithImpl(this._self, this._then);

  final UserRatedPlaceItem _self;
  final $Res Function(UserRatedPlaceItem) _then;

/// Create a copy of UserRatedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? place = null,Object? rating = null,Object? ratedAt = null,}) {
  return _then(UserRatedPlaceItem(
place: null == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as Place,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as int,ratedAt: null == ratedAt ? _self.ratedAt : ratedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of UserRatedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PlaceCopyWith<$Res> get place {
  
  return $PlaceCopyWith<$Res>(_self.place, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// Adds pattern-matching-related methods to [UserRatedPlaceItem].
extension UserRatedPlaceItemPatterns on UserRatedPlaceItem {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserRatedPlaceItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserRatedPlaceItem() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserRatedPlaceItem value)  $default,){
final _that = this;
switch (_that) {
case _UserRatedPlaceItem():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserRatedPlaceItem value)?  $default,){
final _that = this;
switch (_that) {
case _UserRatedPlaceItem() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( Place place,  int rating,  String ratedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserRatedPlaceItem() when $default != null:
return $default(_that.place,_that.rating,_that.ratedAt);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( Place place,  int rating,  String ratedAt)  $default,) {final _that = this;
switch (_that) {
case _UserRatedPlaceItem():
return $default(_that.place,_that.rating,_that.ratedAt);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( Place place,  int rating,  String ratedAt)?  $default,) {final _that = this;
switch (_that) {
case _UserRatedPlaceItem() when $default != null:
return $default(_that.place,_that.rating,_that.ratedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserRatedPlaceItem implements UserRatedPlaceItem {
  const _UserRatedPlaceItem({required this.place, required this.rating, required this.ratedAt});
  factory _UserRatedPlaceItem.fromJson(Map<String, dynamic> json) => _$UserRatedPlaceItemFromJson(json);

@override final  Place place;
@override final  int rating;
@override final  String ratedAt;

/// Create a copy of UserRatedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserRatedPlaceItemCopyWith<_UserRatedPlaceItem> get copyWith => __$UserRatedPlaceItemCopyWithImpl<_UserRatedPlaceItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserRatedPlaceItemToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserRatedPlaceItem&&(identical(other.place, place) || other.place == place)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.ratedAt, ratedAt) || other.ratedAt == ratedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,place,rating,ratedAt);
}

@override
String toString() {
    return 'UserRatedPlaceItem(place: $place, rating: $rating, ratedAt: $ratedAt)';
}


}

/// @nodoc
abstract mixin class _$UserRatedPlaceItemCopyWith<$Res> implements $UserRatedPlaceItemCopyWith<$Res> {
  factory _$UserRatedPlaceItemCopyWith(_UserRatedPlaceItem value, $Res Function(_UserRatedPlaceItem) _then) = __$UserRatedPlaceItemCopyWithImpl;
@override @useResult
$Res call({
 Place place, int rating, String ratedAt
});


@override $PlaceCopyWith<$Res> get place;

}
/// @nodoc
class __$UserRatedPlaceItemCopyWithImpl<$Res>
    implements _$UserRatedPlaceItemCopyWith<$Res> {
  __$UserRatedPlaceItemCopyWithImpl(this._self, this._then);

  final _UserRatedPlaceItem _self;
  final $Res Function(_UserRatedPlaceItem) _then;

/// Create a copy of UserRatedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? place = null,Object? rating = null,Object? ratedAt = null,}) {
  return _then(_UserRatedPlaceItem(
place: null == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as Place,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as int,ratedAt: null == ratedAt ? _self.ratedAt : ratedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of UserRatedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PlaceCopyWith<$Res> get place {
  
  return $PlaceCopyWith<$Res>(_self.place, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// @nodoc
mixin _$UserSharedPlaceItem {

 String get id; Place get place; String? get note; String get sharedAt;
/// Create a copy of UserSharedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserSharedPlaceItemCopyWith<UserSharedPlaceItem> get copyWith => _$UserSharedPlaceItemCopyWithImpl<UserSharedPlaceItem>(this as UserSharedPlaceItem, _$identity);

  /// Serializes this UserSharedPlaceItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as UserSharedPlaceItem;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserSharedPlaceItem&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.place, _this.place) || other.place == _this.place)&&(identical(other.note, _this.note) || other.note == _this.note)&&(identical(other.sharedAt, _this.sharedAt) || other.sharedAt == _this.sharedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as UserSharedPlaceItem;
  return Object.hash(runtimeType,_this.id,_this.place,_this.note,_this.sharedAt);
}

@override
String toString() {
  final _this = this as UserSharedPlaceItem;
  return 'UserSharedPlaceItem(id: ${_this.id}, place: ${_this.place}, note: ${_this.note}, sharedAt: ${_this.sharedAt})';
}


}

/// @nodoc
abstract mixin class $UserSharedPlaceItemCopyWith<$Res>  {
  factory $UserSharedPlaceItemCopyWith(UserSharedPlaceItem value, $Res Function(UserSharedPlaceItem) _then) = _$UserSharedPlaceItemCopyWithImpl;
@useResult
$Res call({
 String id, Place place, String? note, String sharedAt
});


$PlaceCopyWith<$Res> get place;

}
/// @nodoc
class _$UserSharedPlaceItemCopyWithImpl<$Res>
    implements $UserSharedPlaceItemCopyWith<$Res> {
  _$UserSharedPlaceItemCopyWithImpl(this._self, this._then);

  final UserSharedPlaceItem _self;
  final $Res Function(UserSharedPlaceItem) _then;

/// Create a copy of UserSharedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? place = null,Object? note = freezed,Object? sharedAt = null,}) {
  return _then(UserSharedPlaceItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,place: null == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as Place,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,sharedAt: null == sharedAt ? _self.sharedAt : sharedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of UserSharedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PlaceCopyWith<$Res> get place {
  
  return $PlaceCopyWith<$Res>(_self.place, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// Adds pattern-matching-related methods to [UserSharedPlaceItem].
extension UserSharedPlaceItemPatterns on UserSharedPlaceItem {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserSharedPlaceItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserSharedPlaceItem() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserSharedPlaceItem value)  $default,){
final _that = this;
switch (_that) {
case _UserSharedPlaceItem():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserSharedPlaceItem value)?  $default,){
final _that = this;
switch (_that) {
case _UserSharedPlaceItem() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  Place place,  String? note,  String sharedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserSharedPlaceItem() when $default != null:
return $default(_that.id,_that.place,_that.note,_that.sharedAt);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  Place place,  String? note,  String sharedAt)  $default,) {final _that = this;
switch (_that) {
case _UserSharedPlaceItem():
return $default(_that.id,_that.place,_that.note,_that.sharedAt);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  Place place,  String? note,  String sharedAt)?  $default,) {final _that = this;
switch (_that) {
case _UserSharedPlaceItem() when $default != null:
return $default(_that.id,_that.place,_that.note,_that.sharedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserSharedPlaceItem implements UserSharedPlaceItem {
  const _UserSharedPlaceItem({required this.id, required this.place, this.note, required this.sharedAt});
  factory _UserSharedPlaceItem.fromJson(Map<String, dynamic> json) => _$UserSharedPlaceItemFromJson(json);

@override final  String id;
@override final  Place place;
@override final  String? note;
@override final  String sharedAt;

/// Create a copy of UserSharedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserSharedPlaceItemCopyWith<_UserSharedPlaceItem> get copyWith => __$UserSharedPlaceItemCopyWithImpl<_UserSharedPlaceItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserSharedPlaceItemToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserSharedPlaceItem&&(identical(other.id, id) || other.id == id)&&(identical(other.place, place) || other.place == place)&&(identical(other.note, note) || other.note == note)&&(identical(other.sharedAt, sharedAt) || other.sharedAt == sharedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,place,note,sharedAt);
}

@override
String toString() {
    return 'UserSharedPlaceItem(id: $id, place: $place, note: $note, sharedAt: $sharedAt)';
}


}

/// @nodoc
abstract mixin class _$UserSharedPlaceItemCopyWith<$Res> implements $UserSharedPlaceItemCopyWith<$Res> {
  factory _$UserSharedPlaceItemCopyWith(_UserSharedPlaceItem value, $Res Function(_UserSharedPlaceItem) _then) = __$UserSharedPlaceItemCopyWithImpl;
@override @useResult
$Res call({
 String id, Place place, String? note, String sharedAt
});


@override $PlaceCopyWith<$Res> get place;

}
/// @nodoc
class __$UserSharedPlaceItemCopyWithImpl<$Res>
    implements _$UserSharedPlaceItemCopyWith<$Res> {
  __$UserSharedPlaceItemCopyWithImpl(this._self, this._then);

  final _UserSharedPlaceItem _self;
  final $Res Function(_UserSharedPlaceItem) _then;

/// Create a copy of UserSharedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? place = null,Object? note = freezed,Object? sharedAt = null,}) {
  return _then(_UserSharedPlaceItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,place: null == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as Place,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,sharedAt: null == sharedAt ? _self.sharedAt : sharedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of UserSharedPlaceItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PlaceCopyWith<$Res> get place {
  
  return $PlaceCopyWith<$Res>(_self.place, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// @nodoc
mixin _$UserProfileData {

 User get user; List<Trip> get trips; List<Place> get savedPlaces; List<Place> get likedPlaces; List<UserRatedPlaceItem> get ratedPlaces; List<UserSharedPlaceItem> get sharedPlaces; UserProfileStats get stats;
/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserProfileDataCopyWith<UserProfileData> get copyWith => _$UserProfileDataCopyWithImpl<UserProfileData>(this as UserProfileData, _$identity);

  /// Serializes this UserProfileData to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as UserProfileData;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserProfileData&&(identical(other.user, _this.user) || other.user == _this.user)&&const DeepCollectionEquality().equals(other.trips, _this.trips)&&const DeepCollectionEquality().equals(other.savedPlaces, _this.savedPlaces)&&const DeepCollectionEquality().equals(other.likedPlaces, _this.likedPlaces)&&const DeepCollectionEquality().equals(other.ratedPlaces, _this.ratedPlaces)&&const DeepCollectionEquality().equals(other.sharedPlaces, _this.sharedPlaces)&&(identical(other.stats, _this.stats) || other.stats == _this.stats));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as UserProfileData;
  return Object.hash(runtimeType,_this.user,const DeepCollectionEquality().hash(_this.trips),const DeepCollectionEquality().hash(_this.savedPlaces),const DeepCollectionEquality().hash(_this.likedPlaces),const DeepCollectionEquality().hash(_this.ratedPlaces),const DeepCollectionEquality().hash(_this.sharedPlaces),_this.stats);
}

@override
String toString() {
  final _this = this as UserProfileData;
  return 'UserProfileData(user: ${_this.user}, trips: ${_this.trips}, savedPlaces: ${_this.savedPlaces}, likedPlaces: ${_this.likedPlaces}, ratedPlaces: ${_this.ratedPlaces}, sharedPlaces: ${_this.sharedPlaces}, stats: ${_this.stats})';
}


}

/// @nodoc
abstract mixin class $UserProfileDataCopyWith<$Res>  {
  factory $UserProfileDataCopyWith(UserProfileData value, $Res Function(UserProfileData) _then) = _$UserProfileDataCopyWithImpl;
@useResult
$Res call({
 User user, List<Trip> trips, List<Place> savedPlaces, List<Place> likedPlaces, List<UserRatedPlaceItem> ratedPlaces, List<UserSharedPlaceItem> sharedPlaces, UserProfileStats stats
});


$UserCopyWith<$Res> get user;$UserProfileStatsCopyWith<$Res> get stats;

}
/// @nodoc
class _$UserProfileDataCopyWithImpl<$Res>
    implements $UserProfileDataCopyWith<$Res> {
  _$UserProfileDataCopyWithImpl(this._self, this._then);

  final UserProfileData _self;
  final $Res Function(UserProfileData) _then;

/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? user = null,Object? trips = null,Object? savedPlaces = null,Object? likedPlaces = null,Object? ratedPlaces = null,Object? sharedPlaces = null,Object? stats = null,}) {
  return _then(UserProfileData(
user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as User,trips: null == trips ? _self.trips : trips // ignore: cast_nullable_to_non_nullable
as List<Trip>,savedPlaces: null == savedPlaces ? _self.savedPlaces : savedPlaces // ignore: cast_nullable_to_non_nullable
as List<Place>,likedPlaces: null == likedPlaces ? _self.likedPlaces : likedPlaces // ignore: cast_nullable_to_non_nullable
as List<Place>,ratedPlaces: null == ratedPlaces ? _self.ratedPlaces : ratedPlaces // ignore: cast_nullable_to_non_nullable
as List<UserRatedPlaceItem>,sharedPlaces: null == sharedPlaces ? _self.sharedPlaces : sharedPlaces // ignore: cast_nullable_to_non_nullable
as List<UserSharedPlaceItem>,stats: null == stats ? _self.stats : stats // ignore: cast_nullable_to_non_nullable
as UserProfileStats,
  ));
}
/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserCopyWith<$Res> get user {
  
  return $UserCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserProfileStatsCopyWith<$Res> get stats {
  
  return $UserProfileStatsCopyWith<$Res>(_self.stats, (value) {
    return _then(_self.copyWith(stats: value));
  });
}
}


/// Adds pattern-matching-related methods to [UserProfileData].
extension UserProfileDataPatterns on UserProfileData {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserProfileData value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserProfileData() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserProfileData value)  $default,){
final _that = this;
switch (_that) {
case _UserProfileData():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserProfileData value)?  $default,){
final _that = this;
switch (_that) {
case _UserProfileData() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( User user,  List<Trip> trips,  List<Place> savedPlaces,  List<Place> likedPlaces,  List<UserRatedPlaceItem> ratedPlaces,  List<UserSharedPlaceItem> sharedPlaces,  UserProfileStats stats)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserProfileData() when $default != null:
return $default(_that.user,_that.trips,_that.savedPlaces,_that.likedPlaces,_that.ratedPlaces,_that.sharedPlaces,_that.stats);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( User user,  List<Trip> trips,  List<Place> savedPlaces,  List<Place> likedPlaces,  List<UserRatedPlaceItem> ratedPlaces,  List<UserSharedPlaceItem> sharedPlaces,  UserProfileStats stats)  $default,) {final _that = this;
switch (_that) {
case _UserProfileData():
return $default(_that.user,_that.trips,_that.savedPlaces,_that.likedPlaces,_that.ratedPlaces,_that.sharedPlaces,_that.stats);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( User user,  List<Trip> trips,  List<Place> savedPlaces,  List<Place> likedPlaces,  List<UserRatedPlaceItem> ratedPlaces,  List<UserSharedPlaceItem> sharedPlaces,  UserProfileStats stats)?  $default,) {final _that = this;
switch (_that) {
case _UserProfileData() when $default != null:
return $default(_that.user,_that.trips,_that.savedPlaces,_that.likedPlaces,_that.ratedPlaces,_that.sharedPlaces,_that.stats);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserProfileData implements UserProfileData {
  const _UserProfileData({required this.user,  List<Trip> trips = const [],  List<Place> savedPlaces = const [],  List<Place> likedPlaces = const [],  List<UserRatedPlaceItem> ratedPlaces = const [],  List<UserSharedPlaceItem> sharedPlaces = const [], required this.stats}): _trips = trips,_savedPlaces = savedPlaces,_likedPlaces = likedPlaces,_ratedPlaces = ratedPlaces,_sharedPlaces = sharedPlaces;
  factory _UserProfileData.fromJson(Map<String, dynamic> json) => _$UserProfileDataFromJson(json);

@override final  User user;
 final  List<Trip> _trips;
@override@JsonKey() List<Trip> get trips {
  if (_trips is EqualUnmodifiableListView) return _trips;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_trips);
}

 final  List<Place> _savedPlaces;
@override@JsonKey() List<Place> get savedPlaces {
  if (_savedPlaces is EqualUnmodifiableListView) return _savedPlaces;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_savedPlaces);
}

 final  List<Place> _likedPlaces;
@override@JsonKey() List<Place> get likedPlaces {
  if (_likedPlaces is EqualUnmodifiableListView) return _likedPlaces;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_likedPlaces);
}

 final  List<UserRatedPlaceItem> _ratedPlaces;
@override@JsonKey() List<UserRatedPlaceItem> get ratedPlaces {
  if (_ratedPlaces is EqualUnmodifiableListView) return _ratedPlaces;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_ratedPlaces);
}

 final  List<UserSharedPlaceItem> _sharedPlaces;
@override@JsonKey() List<UserSharedPlaceItem> get sharedPlaces {
  if (_sharedPlaces is EqualUnmodifiableListView) return _sharedPlaces;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_sharedPlaces);
}

@override final  UserProfileStats stats;

/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserProfileDataCopyWith<_UserProfileData> get copyWith => __$UserProfileDataCopyWithImpl<_UserProfileData>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserProfileDataToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserProfileData&&(identical(other.user, user) || other.user == user)&&const DeepCollectionEquality().equals(other.trips, _trips)&&const DeepCollectionEquality().equals(other.savedPlaces, _savedPlaces)&&const DeepCollectionEquality().equals(other.likedPlaces, _likedPlaces)&&const DeepCollectionEquality().equals(other.ratedPlaces, _ratedPlaces)&&const DeepCollectionEquality().equals(other.sharedPlaces, _sharedPlaces)&&(identical(other.stats, stats) || other.stats == stats));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,user,const DeepCollectionEquality().hash(_trips),const DeepCollectionEquality().hash(_savedPlaces),const DeepCollectionEquality().hash(_likedPlaces),const DeepCollectionEquality().hash(_ratedPlaces),const DeepCollectionEquality().hash(_sharedPlaces),stats);
}

@override
String toString() {
    return 'UserProfileData(user: $user, trips: $trips, savedPlaces: $savedPlaces, likedPlaces: $likedPlaces, ratedPlaces: $ratedPlaces, sharedPlaces: $sharedPlaces, stats: $stats)';
}


}

/// @nodoc
abstract mixin class _$UserProfileDataCopyWith<$Res> implements $UserProfileDataCopyWith<$Res> {
  factory _$UserProfileDataCopyWith(_UserProfileData value, $Res Function(_UserProfileData) _then) = __$UserProfileDataCopyWithImpl;
@override @useResult
$Res call({
 User user, List<Trip> trips, List<Place> savedPlaces, List<Place> likedPlaces, List<UserRatedPlaceItem> ratedPlaces, List<UserSharedPlaceItem> sharedPlaces, UserProfileStats stats
});


@override $UserCopyWith<$Res> get user;@override $UserProfileStatsCopyWith<$Res> get stats;

}
/// @nodoc
class __$UserProfileDataCopyWithImpl<$Res>
    implements _$UserProfileDataCopyWith<$Res> {
  __$UserProfileDataCopyWithImpl(this._self, this._then);

  final _UserProfileData _self;
  final $Res Function(_UserProfileData) _then;

/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? user = null,Object? trips = null,Object? savedPlaces = null,Object? likedPlaces = null,Object? ratedPlaces = null,Object? sharedPlaces = null,Object? stats = null,}) {
  return _then(_UserProfileData(
user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as User,trips: null == trips ? _self._trips : trips // ignore: cast_nullable_to_non_nullable
as List<Trip>,savedPlaces: null == savedPlaces ? _self._savedPlaces : savedPlaces // ignore: cast_nullable_to_non_nullable
as List<Place>,likedPlaces: null == likedPlaces ? _self._likedPlaces : likedPlaces // ignore: cast_nullable_to_non_nullable
as List<Place>,ratedPlaces: null == ratedPlaces ? _self._ratedPlaces : ratedPlaces // ignore: cast_nullable_to_non_nullable
as List<UserRatedPlaceItem>,sharedPlaces: null == sharedPlaces ? _self._sharedPlaces : sharedPlaces // ignore: cast_nullable_to_non_nullable
as List<UserSharedPlaceItem>,stats: null == stats ? _self.stats : stats // ignore: cast_nullable_to_non_nullable
as UserProfileStats,
  ));
}

/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserCopyWith<$Res> get user {
  
  return $UserCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}/// Create a copy of UserProfileData
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserProfileStatsCopyWith<$Res> get stats {
  
  return $UserProfileStatsCopyWith<$Res>(_self.stats, (value) {
    return _then(_self.copyWith(stats: value));
  });
}
}

// dart format on
