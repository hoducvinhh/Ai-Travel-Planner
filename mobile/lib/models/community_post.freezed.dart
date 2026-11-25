// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'community_post.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CommunityUserInfo {

 String get id; String? get name; String get email; List<String> get preferredStyles; String? get budgetLevel;
/// Create a copy of CommunityUserInfo
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommunityUserInfoCopyWith<CommunityUserInfo> get copyWith => _$CommunityUserInfoCopyWithImpl<CommunityUserInfo>(this as CommunityUserInfo, _$identity);

  /// Serializes this CommunityUserInfo to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CommunityUserInfo;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityUserInfo&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.email, _this.email) || other.email == _this.email)&&const DeepCollectionEquality().equals(other.preferredStyles, _this.preferredStyles)&&(identical(other.budgetLevel, _this.budgetLevel) || other.budgetLevel == _this.budgetLevel));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CommunityUserInfo;
  return Object.hash(runtimeType,_this.id,_this.name,_this.email,const DeepCollectionEquality().hash(_this.preferredStyles),_this.budgetLevel);
}

@override
String toString() {
  final _this = this as CommunityUserInfo;
  return 'CommunityUserInfo(id: ${_this.id}, name: ${_this.name}, email: ${_this.email}, preferredStyles: ${_this.preferredStyles}, budgetLevel: ${_this.budgetLevel})';
}


}

/// @nodoc
abstract mixin class $CommunityUserInfoCopyWith<$Res>  {
  factory $CommunityUserInfoCopyWith(CommunityUserInfo value, $Res Function(CommunityUserInfo) _then) = _$CommunityUserInfoCopyWithImpl;
@useResult
$Res call({
 String id, String? name, String email, List<String> preferredStyles, String? budgetLevel
});




}
/// @nodoc
class _$CommunityUserInfoCopyWithImpl<$Res>
    implements $CommunityUserInfoCopyWith<$Res> {
  _$CommunityUserInfoCopyWithImpl(this._self, this._then);

  final CommunityUserInfo _self;
  final $Res Function(CommunityUserInfo) _then;

/// Create a copy of CommunityUserInfo
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = freezed,Object? email = null,Object? preferredStyles = null,Object? budgetLevel = freezed,}) {
  return _then(CommunityUserInfo(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,preferredStyles: null == preferredStyles ? _self.preferredStyles : preferredStyles // ignore: cast_nullable_to_non_nullable
as List<String>,budgetLevel: freezed == budgetLevel ? _self.budgetLevel : budgetLevel // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [CommunityUserInfo].
extension CommunityUserInfoPatterns on CommunityUserInfo {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommunityUserInfo value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommunityUserInfo() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommunityUserInfo value)  $default,){
final _that = this;
switch (_that) {
case _CommunityUserInfo():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommunityUserInfo value)?  $default,){
final _that = this;
switch (_that) {
case _CommunityUserInfo() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String? name,  String email,  List<String> preferredStyles,  String? budgetLevel)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityUserInfo() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.preferredStyles,_that.budgetLevel);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String? name,  String email,  List<String> preferredStyles,  String? budgetLevel)  $default,) {final _that = this;
switch (_that) {
case _CommunityUserInfo():
return $default(_that.id,_that.name,_that.email,_that.preferredStyles,_that.budgetLevel);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String? name,  String email,  List<String> preferredStyles,  String? budgetLevel)?  $default,) {final _that = this;
switch (_that) {
case _CommunityUserInfo() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.preferredStyles,_that.budgetLevel);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CommunityUserInfo extends CommunityUserInfo {
  const _CommunityUserInfo({required this.id, this.name, this.email = '',  List<String> preferredStyles = const [], this.budgetLevel}): _preferredStyles = preferredStyles,super._();
  factory _CommunityUserInfo.fromJson(Map<String, dynamic> json) => _$CommunityUserInfoFromJson(json);

@override final  String id;
@override final  String? name;
@override@JsonKey() final  String email;
 final  List<String> _preferredStyles;
@override@JsonKey() List<String> get preferredStyles {
  if (_preferredStyles is EqualUnmodifiableListView) return _preferredStyles;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_preferredStyles);
}

@override final  String? budgetLevel;

/// Create a copy of CommunityUserInfo
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommunityUserInfoCopyWith<_CommunityUserInfo> get copyWith => __$CommunityUserInfoCopyWithImpl<_CommunityUserInfo>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CommunityUserInfoToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityUserInfo&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&const DeepCollectionEquality().equals(other.preferredStyles, _preferredStyles)&&(identical(other.budgetLevel, budgetLevel) || other.budgetLevel == budgetLevel));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,email,const DeepCollectionEquality().hash(_preferredStyles),budgetLevel);
}

@override
String toString() {
    return 'CommunityUserInfo(id: $id, name: $name, email: $email, preferredStyles: $preferredStyles, budgetLevel: $budgetLevel)';
}


}

/// @nodoc
abstract mixin class _$CommunityUserInfoCopyWith<$Res> implements $CommunityUserInfoCopyWith<$Res> {
  factory _$CommunityUserInfoCopyWith(_CommunityUserInfo value, $Res Function(_CommunityUserInfo) _then) = __$CommunityUserInfoCopyWithImpl;
@override @useResult
$Res call({
 String id, String? name, String email, List<String> preferredStyles, String? budgetLevel
});




}
/// @nodoc
class __$CommunityUserInfoCopyWithImpl<$Res>
    implements _$CommunityUserInfoCopyWith<$Res> {
  __$CommunityUserInfoCopyWithImpl(this._self, this._then);

  final _CommunityUserInfo _self;
  final $Res Function(_CommunityUserInfo) _then;

/// Create a copy of CommunityUserInfo
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = freezed,Object? email = null,Object? preferredStyles = null,Object? budgetLevel = freezed,}) {
  return _then(_CommunityUserInfo(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,preferredStyles: null == preferredStyles ? _self._preferredStyles : preferredStyles // ignore: cast_nullable_to_non_nullable
as List<String>,budgetLevel: freezed == budgetLevel ? _self.budgetLevel : budgetLevel // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$CommunityTripPlaceSummary {

 String get id; String get name; String? get imageUrl; String? get province;
/// Create a copy of CommunityTripPlaceSummary
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommunityTripPlaceSummaryCopyWith<CommunityTripPlaceSummary> get copyWith => _$CommunityTripPlaceSummaryCopyWithImpl<CommunityTripPlaceSummary>(this as CommunityTripPlaceSummary, _$identity);

  /// Serializes this CommunityTripPlaceSummary to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CommunityTripPlaceSummary;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityTripPlaceSummary&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.imageUrl, _this.imageUrl) || other.imageUrl == _this.imageUrl)&&(identical(other.province, _this.province) || other.province == _this.province));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CommunityTripPlaceSummary;
  return Object.hash(runtimeType,_this.id,_this.name,_this.imageUrl,_this.province);
}

@override
String toString() {
  final _this = this as CommunityTripPlaceSummary;
  return 'CommunityTripPlaceSummary(id: ${_this.id}, name: ${_this.name}, imageUrl: ${_this.imageUrl}, province: ${_this.province})';
}


}

/// @nodoc
abstract mixin class $CommunityTripPlaceSummaryCopyWith<$Res>  {
  factory $CommunityTripPlaceSummaryCopyWith(CommunityTripPlaceSummary value, $Res Function(CommunityTripPlaceSummary) _then) = _$CommunityTripPlaceSummaryCopyWithImpl;
@useResult
$Res call({
 String id, String name, String? imageUrl, String? province
});




}
/// @nodoc
class _$CommunityTripPlaceSummaryCopyWithImpl<$Res>
    implements $CommunityTripPlaceSummaryCopyWith<$Res> {
  _$CommunityTripPlaceSummaryCopyWithImpl(this._self, this._then);

  final CommunityTripPlaceSummary _self;
  final $Res Function(CommunityTripPlaceSummary) _then;

/// Create a copy of CommunityTripPlaceSummary
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? imageUrl = freezed,Object? province = freezed,}) {
  return _then(CommunityTripPlaceSummary(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,province: freezed == province ? _self.province : province // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [CommunityTripPlaceSummary].
extension CommunityTripPlaceSummaryPatterns on CommunityTripPlaceSummary {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommunityTripPlaceSummary value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommunityTripPlaceSummary() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommunityTripPlaceSummary value)  $default,){
final _that = this;
switch (_that) {
case _CommunityTripPlaceSummary():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommunityTripPlaceSummary value)?  $default,){
final _that = this;
switch (_that) {
case _CommunityTripPlaceSummary() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String? imageUrl,  String? province)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityTripPlaceSummary() when $default != null:
return $default(_that.id,_that.name,_that.imageUrl,_that.province);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String? imageUrl,  String? province)  $default,) {final _that = this;
switch (_that) {
case _CommunityTripPlaceSummary():
return $default(_that.id,_that.name,_that.imageUrl,_that.province);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String? imageUrl,  String? province)?  $default,) {final _that = this;
switch (_that) {
case _CommunityTripPlaceSummary() when $default != null:
return $default(_that.id,_that.name,_that.imageUrl,_that.province);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CommunityTripPlaceSummary implements CommunityTripPlaceSummary {
  const _CommunityTripPlaceSummary({required this.id, required this.name, this.imageUrl, this.province});
  factory _CommunityTripPlaceSummary.fromJson(Map<String, dynamic> json) => _$CommunityTripPlaceSummaryFromJson(json);

@override final  String id;
@override final  String name;
@override final  String? imageUrl;
@override final  String? province;

/// Create a copy of CommunityTripPlaceSummary
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommunityTripPlaceSummaryCopyWith<_CommunityTripPlaceSummary> get copyWith => __$CommunityTripPlaceSummaryCopyWithImpl<_CommunityTripPlaceSummary>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CommunityTripPlaceSummaryToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityTripPlaceSummary&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.province, province) || other.province == province));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,imageUrl,province);
}

@override
String toString() {
    return 'CommunityTripPlaceSummary(id: $id, name: $name, imageUrl: $imageUrl, province: $province)';
}


}

/// @nodoc
abstract mixin class _$CommunityTripPlaceSummaryCopyWith<$Res> implements $CommunityTripPlaceSummaryCopyWith<$Res> {
  factory _$CommunityTripPlaceSummaryCopyWith(_CommunityTripPlaceSummary value, $Res Function(_CommunityTripPlaceSummary) _then) = __$CommunityTripPlaceSummaryCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String? imageUrl, String? province
});




}
/// @nodoc
class __$CommunityTripPlaceSummaryCopyWithImpl<$Res>
    implements _$CommunityTripPlaceSummaryCopyWith<$Res> {
  __$CommunityTripPlaceSummaryCopyWithImpl(this._self, this._then);

  final _CommunityTripPlaceSummary _self;
  final $Res Function(_CommunityTripPlaceSummary) _then;

/// Create a copy of CommunityTripPlaceSummary
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? imageUrl = freezed,Object? province = freezed,}) {
  return _then(_CommunityTripPlaceSummary(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,province: freezed == province ? _self.province : province // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$CommunityTripPlaceWrapper {

 CommunityTripPlaceSummary get place;
/// Create a copy of CommunityTripPlaceWrapper
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommunityTripPlaceWrapperCopyWith<CommunityTripPlaceWrapper> get copyWith => _$CommunityTripPlaceWrapperCopyWithImpl<CommunityTripPlaceWrapper>(this as CommunityTripPlaceWrapper, _$identity);

  /// Serializes this CommunityTripPlaceWrapper to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CommunityTripPlaceWrapper;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityTripPlaceWrapper&&(identical(other.place, _this.place) || other.place == _this.place));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CommunityTripPlaceWrapper;
  return Object.hash(runtimeType,_this.place);
}

@override
String toString() {
  final _this = this as CommunityTripPlaceWrapper;
  return 'CommunityTripPlaceWrapper(place: ${_this.place})';
}


}

/// @nodoc
abstract mixin class $CommunityTripPlaceWrapperCopyWith<$Res>  {
  factory $CommunityTripPlaceWrapperCopyWith(CommunityTripPlaceWrapper value, $Res Function(CommunityTripPlaceWrapper) _then) = _$CommunityTripPlaceWrapperCopyWithImpl;
@useResult
$Res call({
 CommunityTripPlaceSummary place
});


$CommunityTripPlaceSummaryCopyWith<$Res> get place;

}
/// @nodoc
class _$CommunityTripPlaceWrapperCopyWithImpl<$Res>
    implements $CommunityTripPlaceWrapperCopyWith<$Res> {
  _$CommunityTripPlaceWrapperCopyWithImpl(this._self, this._then);

  final CommunityTripPlaceWrapper _self;
  final $Res Function(CommunityTripPlaceWrapper) _then;

/// Create a copy of CommunityTripPlaceWrapper
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? place = null,}) {
  return _then(CommunityTripPlaceWrapper(
place: null == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as CommunityTripPlaceSummary,
  ));
}
/// Create a copy of CommunityTripPlaceWrapper
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityTripPlaceSummaryCopyWith<$Res> get place {
  
  return $CommunityTripPlaceSummaryCopyWith<$Res>(_self.place, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// Adds pattern-matching-related methods to [CommunityTripPlaceWrapper].
extension CommunityTripPlaceWrapperPatterns on CommunityTripPlaceWrapper {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommunityTripPlaceWrapper value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommunityTripPlaceWrapper() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommunityTripPlaceWrapper value)  $default,){
final _that = this;
switch (_that) {
case _CommunityTripPlaceWrapper():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommunityTripPlaceWrapper value)?  $default,){
final _that = this;
switch (_that) {
case _CommunityTripPlaceWrapper() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( CommunityTripPlaceSummary place)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityTripPlaceWrapper() when $default != null:
return $default(_that.place);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( CommunityTripPlaceSummary place)  $default,) {final _that = this;
switch (_that) {
case _CommunityTripPlaceWrapper():
return $default(_that.place);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( CommunityTripPlaceSummary place)?  $default,) {final _that = this;
switch (_that) {
case _CommunityTripPlaceWrapper() when $default != null:
return $default(_that.place);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CommunityTripPlaceWrapper implements CommunityTripPlaceWrapper {
  const _CommunityTripPlaceWrapper({required this.place});
  factory _CommunityTripPlaceWrapper.fromJson(Map<String, dynamic> json) => _$CommunityTripPlaceWrapperFromJson(json);

@override final  CommunityTripPlaceSummary place;

/// Create a copy of CommunityTripPlaceWrapper
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommunityTripPlaceWrapperCopyWith<_CommunityTripPlaceWrapper> get copyWith => __$CommunityTripPlaceWrapperCopyWithImpl<_CommunityTripPlaceWrapper>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CommunityTripPlaceWrapperToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityTripPlaceWrapper&&(identical(other.place, place) || other.place == place));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,place);
}

@override
String toString() {
    return 'CommunityTripPlaceWrapper(place: $place)';
}


}

/// @nodoc
abstract mixin class _$CommunityTripPlaceWrapperCopyWith<$Res> implements $CommunityTripPlaceWrapperCopyWith<$Res> {
  factory _$CommunityTripPlaceWrapperCopyWith(_CommunityTripPlaceWrapper value, $Res Function(_CommunityTripPlaceWrapper) _then) = __$CommunityTripPlaceWrapperCopyWithImpl;
@override @useResult
$Res call({
 CommunityTripPlaceSummary place
});


@override $CommunityTripPlaceSummaryCopyWith<$Res> get place;

}
/// @nodoc
class __$CommunityTripPlaceWrapperCopyWithImpl<$Res>
    implements _$CommunityTripPlaceWrapperCopyWith<$Res> {
  __$CommunityTripPlaceWrapperCopyWithImpl(this._self, this._then);

  final _CommunityTripPlaceWrapper _self;
  final $Res Function(_CommunityTripPlaceWrapper) _then;

/// Create a copy of CommunityTripPlaceWrapper
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? place = null,}) {
  return _then(_CommunityTripPlaceWrapper(
place: null == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as CommunityTripPlaceSummary,
  ));
}

/// Create a copy of CommunityTripPlaceWrapper
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityTripPlaceSummaryCopyWith<$Res> get place {
  
  return $CommunityTripPlaceSummaryCopyWith<$Res>(_self.place, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// @nodoc
mixin _$CommunityAttachedTrip {

 String get id; String get destination; String get startDate; String get endDate; double get budgetPerPerson; int get groupSize; String get status; List<CommunityTripPlaceWrapper>? get places;
/// Create a copy of CommunityAttachedTrip
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommunityAttachedTripCopyWith<CommunityAttachedTrip> get copyWith => _$CommunityAttachedTripCopyWithImpl<CommunityAttachedTrip>(this as CommunityAttachedTrip, _$identity);

  /// Serializes this CommunityAttachedTrip to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CommunityAttachedTrip;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityAttachedTrip&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.destination, _this.destination) || other.destination == _this.destination)&&(identical(other.startDate, _this.startDate) || other.startDate == _this.startDate)&&(identical(other.endDate, _this.endDate) || other.endDate == _this.endDate)&&(identical(other.budgetPerPerson, _this.budgetPerPerson) || other.budgetPerPerson == _this.budgetPerPerson)&&(identical(other.groupSize, _this.groupSize) || other.groupSize == _this.groupSize)&&(identical(other.status, _this.status) || other.status == _this.status)&&const DeepCollectionEquality().equals(other.places, _this.places));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CommunityAttachedTrip;
  return Object.hash(runtimeType,_this.id,_this.destination,_this.startDate,_this.endDate,_this.budgetPerPerson,_this.groupSize,_this.status,const DeepCollectionEquality().hash(_this.places));
}

@override
String toString() {
  final _this = this as CommunityAttachedTrip;
  return 'CommunityAttachedTrip(id: ${_this.id}, destination: ${_this.destination}, startDate: ${_this.startDate}, endDate: ${_this.endDate}, budgetPerPerson: ${_this.budgetPerPerson}, groupSize: ${_this.groupSize}, status: ${_this.status}, places: ${_this.places})';
}


}

/// @nodoc
abstract mixin class $CommunityAttachedTripCopyWith<$Res>  {
  factory $CommunityAttachedTripCopyWith(CommunityAttachedTrip value, $Res Function(CommunityAttachedTrip) _then) = _$CommunityAttachedTripCopyWithImpl;
@useResult
$Res call({
 String id, String destination, String startDate, String endDate, double budgetPerPerson, int groupSize, String status, List<CommunityTripPlaceWrapper>? places
});




}
/// @nodoc
class _$CommunityAttachedTripCopyWithImpl<$Res>
    implements $CommunityAttachedTripCopyWith<$Res> {
  _$CommunityAttachedTripCopyWithImpl(this._self, this._then);

  final CommunityAttachedTrip _self;
  final $Res Function(CommunityAttachedTrip) _then;

/// Create a copy of CommunityAttachedTrip
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? destination = null,Object? startDate = null,Object? endDate = null,Object? budgetPerPerson = null,Object? groupSize = null,Object? status = null,Object? places = freezed,}) {
  return _then(CommunityAttachedTrip(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,destination: null == destination ? _self.destination : destination // ignore: cast_nullable_to_non_nullable
as String,startDate: null == startDate ? _self.startDate : startDate // ignore: cast_nullable_to_non_nullable
as String,endDate: null == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as String,budgetPerPerson: null == budgetPerPerson ? _self.budgetPerPerson : budgetPerPerson // ignore: cast_nullable_to_non_nullable
as double,groupSize: null == groupSize ? _self.groupSize : groupSize // ignore: cast_nullable_to_non_nullable
as int,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,places: freezed == places ? _self.places : places // ignore: cast_nullable_to_non_nullable
as List<CommunityTripPlaceWrapper>?,
  ));
}

}


/// Adds pattern-matching-related methods to [CommunityAttachedTrip].
extension CommunityAttachedTripPatterns on CommunityAttachedTrip {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommunityAttachedTrip value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommunityAttachedTrip() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommunityAttachedTrip value)  $default,){
final _that = this;
switch (_that) {
case _CommunityAttachedTrip():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommunityAttachedTrip value)?  $default,){
final _that = this;
switch (_that) {
case _CommunityAttachedTrip() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String destination,  String startDate,  String endDate,  double budgetPerPerson,  int groupSize,  String status,  List<CommunityTripPlaceWrapper>? places)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityAttachedTrip() when $default != null:
return $default(_that.id,_that.destination,_that.startDate,_that.endDate,_that.budgetPerPerson,_that.groupSize,_that.status,_that.places);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String destination,  String startDate,  String endDate,  double budgetPerPerson,  int groupSize,  String status,  List<CommunityTripPlaceWrapper>? places)  $default,) {final _that = this;
switch (_that) {
case _CommunityAttachedTrip():
return $default(_that.id,_that.destination,_that.startDate,_that.endDate,_that.budgetPerPerson,_that.groupSize,_that.status,_that.places);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String destination,  String startDate,  String endDate,  double budgetPerPerson,  int groupSize,  String status,  List<CommunityTripPlaceWrapper>? places)?  $default,) {final _that = this;
switch (_that) {
case _CommunityAttachedTrip() when $default != null:
return $default(_that.id,_that.destination,_that.startDate,_that.endDate,_that.budgetPerPerson,_that.groupSize,_that.status,_that.places);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CommunityAttachedTrip implements CommunityAttachedTrip {
  const _CommunityAttachedTrip({required this.id, required this.destination, required this.startDate, required this.endDate, this.budgetPerPerson = 0.0, this.groupSize = 1, this.status = 'DRAFT',  List<CommunityTripPlaceWrapper>? places}): _places = places;
  factory _CommunityAttachedTrip.fromJson(Map<String, dynamic> json) => _$CommunityAttachedTripFromJson(json);

@override final  String id;
@override final  String destination;
@override final  String startDate;
@override final  String endDate;
@override@JsonKey() final  double budgetPerPerson;
@override@JsonKey() final  int groupSize;
@override@JsonKey() final  String status;
 final  List<CommunityTripPlaceWrapper>? _places;
@override List<CommunityTripPlaceWrapper>? get places {
  final value = _places;
  if (value == null) return null;
  if (_places is EqualUnmodifiableListView) return _places;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of CommunityAttachedTrip
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommunityAttachedTripCopyWith<_CommunityAttachedTrip> get copyWith => __$CommunityAttachedTripCopyWithImpl<_CommunityAttachedTrip>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CommunityAttachedTripToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityAttachedTrip&&(identical(other.id, id) || other.id == id)&&(identical(other.destination, destination) || other.destination == destination)&&(identical(other.startDate, startDate) || other.startDate == startDate)&&(identical(other.endDate, endDate) || other.endDate == endDate)&&(identical(other.budgetPerPerson, budgetPerPerson) || other.budgetPerPerson == budgetPerPerson)&&(identical(other.groupSize, groupSize) || other.groupSize == groupSize)&&(identical(other.status, status) || other.status == status)&&const DeepCollectionEquality().equals(other.places, _places));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,destination,startDate,endDate,budgetPerPerson,groupSize,status,const DeepCollectionEquality().hash(_places));
}

@override
String toString() {
    return 'CommunityAttachedTrip(id: $id, destination: $destination, startDate: $startDate, endDate: $endDate, budgetPerPerson: $budgetPerPerson, groupSize: $groupSize, status: $status, places: $places)';
}


}

/// @nodoc
abstract mixin class _$CommunityAttachedTripCopyWith<$Res> implements $CommunityAttachedTripCopyWith<$Res> {
  factory _$CommunityAttachedTripCopyWith(_CommunityAttachedTrip value, $Res Function(_CommunityAttachedTrip) _then) = __$CommunityAttachedTripCopyWithImpl;
@override @useResult
$Res call({
 String id, String destination, String startDate, String endDate, double budgetPerPerson, int groupSize, String status, List<CommunityTripPlaceWrapper>? places
});




}
/// @nodoc
class __$CommunityAttachedTripCopyWithImpl<$Res>
    implements _$CommunityAttachedTripCopyWith<$Res> {
  __$CommunityAttachedTripCopyWithImpl(this._self, this._then);

  final _CommunityAttachedTrip _self;
  final $Res Function(_CommunityAttachedTrip) _then;

/// Create a copy of CommunityAttachedTrip
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? destination = null,Object? startDate = null,Object? endDate = null,Object? budgetPerPerson = null,Object? groupSize = null,Object? status = null,Object? places = freezed,}) {
  return _then(_CommunityAttachedTrip(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,destination: null == destination ? _self.destination : destination // ignore: cast_nullable_to_non_nullable
as String,startDate: null == startDate ? _self.startDate : startDate // ignore: cast_nullable_to_non_nullable
as String,endDate: null == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as String,budgetPerPerson: null == budgetPerPerson ? _self.budgetPerPerson : budgetPerPerson // ignore: cast_nullable_to_non_nullable
as double,groupSize: null == groupSize ? _self.groupSize : groupSize // ignore: cast_nullable_to_non_nullable
as int,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,places: freezed == places ? _self._places : places // ignore: cast_nullable_to_non_nullable
as List<CommunityTripPlaceWrapper>?,
  ));
}


}


/// @nodoc
mixin _$Comment {

 String get id; String get content;@JsonKey(readValue: _readCommentUserId) String get userId;@JsonKey(readValue: _readCommentUserName) String get userName; DateTime get createdAt; CommunityUserInfo? get user; int get likesCount; bool get isLiked;
/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommentCopyWith<Comment> get copyWith => _$CommentCopyWithImpl<Comment>(this as Comment, _$identity);

  /// Serializes this Comment to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as Comment;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Comment&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.content, _this.content) || other.content == _this.content)&&(identical(other.userId, _this.userId) || other.userId == _this.userId)&&(identical(other.userName, _this.userName) || other.userName == _this.userName)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.user, _this.user) || other.user == _this.user)&&(identical(other.likesCount, _this.likesCount) || other.likesCount == _this.likesCount)&&(identical(other.isLiked, _this.isLiked) || other.isLiked == _this.isLiked));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as Comment;
  return Object.hash(runtimeType,_this.id,_this.content,_this.userId,_this.userName,_this.createdAt,_this.user,_this.likesCount,_this.isLiked);
}

@override
String toString() {
  final _this = this as Comment;
  return 'Comment(id: ${_this.id}, content: ${_this.content}, userId: ${_this.userId}, userName: ${_this.userName}, createdAt: ${_this.createdAt}, user: ${_this.user}, likesCount: ${_this.likesCount}, isLiked: ${_this.isLiked})';
}


}

/// @nodoc
abstract mixin class $CommentCopyWith<$Res>  {
  factory $CommentCopyWith(Comment value, $Res Function(Comment) _then) = _$CommentCopyWithImpl;
@useResult
$Res call({
 String id, String content,@JsonKey(readValue: _readCommentUserId) String userId,@JsonKey(readValue: _readCommentUserName) String userName, DateTime createdAt, CommunityUserInfo? user, int likesCount, bool isLiked
});


$CommunityUserInfoCopyWith<$Res>? get user;

}
/// @nodoc
class _$CommentCopyWithImpl<$Res>
    implements $CommentCopyWith<$Res> {
  _$CommentCopyWithImpl(this._self, this._then);

  final Comment _self;
  final $Res Function(Comment) _then;

/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? content = null,Object? userId = null,Object? userName = null,Object? createdAt = null,Object? user = freezed,Object? likesCount = null,Object? isLiked = null,}) {
  return _then(Comment(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,user: freezed == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as CommunityUserInfo?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}
/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityUserInfoCopyWith<$Res>? get user {
    if (_self.user == null) {
    return null;
  }

  return $CommunityUserInfoCopyWith<$Res>(_self.user!, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// Adds pattern-matching-related methods to [Comment].
extension CommentPatterns on Comment {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Comment value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Comment() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Comment value)  $default,){
final _that = this;
switch (_that) {
case _Comment():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Comment value)?  $default,){
final _that = this;
switch (_that) {
case _Comment() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String content, @JsonKey(readValue: _readCommentUserId)  String userId, @JsonKey(readValue: _readCommentUserName)  String userName,  DateTime createdAt,  CommunityUserInfo? user,  int likesCount,  bool isLiked)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Comment() when $default != null:
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.user,_that.likesCount,_that.isLiked);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String content, @JsonKey(readValue: _readCommentUserId)  String userId, @JsonKey(readValue: _readCommentUserName)  String userName,  DateTime createdAt,  CommunityUserInfo? user,  int likesCount,  bool isLiked)  $default,) {final _that = this;
switch (_that) {
case _Comment():
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.user,_that.likesCount,_that.isLiked);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String content, @JsonKey(readValue: _readCommentUserId)  String userId, @JsonKey(readValue: _readCommentUserName)  String userName,  DateTime createdAt,  CommunityUserInfo? user,  int likesCount,  bool isLiked)?  $default,) {final _that = this;
switch (_that) {
case _Comment() when $default != null:
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.user,_that.likesCount,_that.isLiked);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Comment implements Comment {
  const _Comment({required this.id, required this.content, @JsonKey(readValue: _readCommentUserId) this.userId = '', @JsonKey(readValue: _readCommentUserName) this.userName = 'Người dùng', required this.createdAt, this.user, this.likesCount = 0, this.isLiked = false});
  factory _Comment.fromJson(Map<String, dynamic> json) => _$CommentFromJson(json);

@override final  String id;
@override final  String content;
@override@JsonKey(readValue: _readCommentUserId) final  String userId;
@override@JsonKey(readValue: _readCommentUserName) final  String userName;
@override final  DateTime createdAt;
@override final  CommunityUserInfo? user;
@override@JsonKey() final  int likesCount;
@override@JsonKey() final  bool isLiked;

/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommentCopyWith<_Comment> get copyWith => __$CommentCopyWithImpl<_Comment>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CommentToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Comment&&(identical(other.id, id) || other.id == id)&&(identical(other.content, content) || other.content == content)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.userName, userName) || other.userName == userName)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.user, user) || other.user == user)&&(identical(other.likesCount, likesCount) || other.likesCount == likesCount)&&(identical(other.isLiked, isLiked) || other.isLiked == isLiked));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,content,userId,userName,createdAt,user,likesCount,isLiked);
}

@override
String toString() {
    return 'Comment(id: $id, content: $content, userId: $userId, userName: $userName, createdAt: $createdAt, user: $user, likesCount: $likesCount, isLiked: $isLiked)';
}


}

/// @nodoc
abstract mixin class _$CommentCopyWith<$Res> implements $CommentCopyWith<$Res> {
  factory _$CommentCopyWith(_Comment value, $Res Function(_Comment) _then) = __$CommentCopyWithImpl;
@override @useResult
$Res call({
 String id, String content,@JsonKey(readValue: _readCommentUserId) String userId,@JsonKey(readValue: _readCommentUserName) String userName, DateTime createdAt, CommunityUserInfo? user, int likesCount, bool isLiked
});


@override $CommunityUserInfoCopyWith<$Res>? get user;

}
/// @nodoc
class __$CommentCopyWithImpl<$Res>
    implements _$CommentCopyWith<$Res> {
  __$CommentCopyWithImpl(this._self, this._then);

  final _Comment _self;
  final $Res Function(_Comment) _then;

/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? content = null,Object? userId = null,Object? userName = null,Object? createdAt = null,Object? user = freezed,Object? likesCount = null,Object? isLiked = null,}) {
  return _then(_Comment(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,user: freezed == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as CommunityUserInfo?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityUserInfoCopyWith<$Res>? get user {
    if (_self.user == null) {
    return null;
  }

  return $CommunityUserInfoCopyWith<$Res>(_self.user!, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// @nodoc
mixin _$CommunityPost {

 String get id; String get userId; String get title; String get content; List<String> get tags;@JsonKey(readValue: _readPostImages) List<String> get images; String? get tripId; CommunityAttachedTrip? get trip; int get likesCount; int get commentsCount; bool get isLiked; DateTime get createdAt; DateTime? get updatedAt; CommunityUserInfo? get user; List<Comment> get recentComments;
/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommunityPostCopyWith<CommunityPost> get copyWith => _$CommunityPostCopyWithImpl<CommunityPost>(this as CommunityPost, _$identity);

  /// Serializes this CommunityPost to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as CommunityPost;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityPost&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.userId, _this.userId) || other.userId == _this.userId)&&(identical(other.title, _this.title) || other.title == _this.title)&&(identical(other.content, _this.content) || other.content == _this.content)&&const DeepCollectionEquality().equals(other.tags, _this.tags)&&const DeepCollectionEquality().equals(other.images, _this.images)&&(identical(other.tripId, _this.tripId) || other.tripId == _this.tripId)&&(identical(other.trip, _this.trip) || other.trip == _this.trip)&&(identical(other.likesCount, _this.likesCount) || other.likesCount == _this.likesCount)&&(identical(other.commentsCount, _this.commentsCount) || other.commentsCount == _this.commentsCount)&&(identical(other.isLiked, _this.isLiked) || other.isLiked == _this.isLiked)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.user, _this.user) || other.user == _this.user)&&const DeepCollectionEquality().equals(other.recentComments, _this.recentComments));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CommunityPost;
  return Object.hash(runtimeType,_this.id,_this.userId,_this.title,_this.content,const DeepCollectionEquality().hash(_this.tags),const DeepCollectionEquality().hash(_this.images),_this.tripId,_this.trip,_this.likesCount,_this.commentsCount,_this.isLiked,_this.createdAt,_this.updatedAt,_this.user,const DeepCollectionEquality().hash(_this.recentComments));
}

@override
String toString() {
  final _this = this as CommunityPost;
  return 'CommunityPost(id: ${_this.id}, userId: ${_this.userId}, title: ${_this.title}, content: ${_this.content}, tags: ${_this.tags}, images: ${_this.images}, tripId: ${_this.tripId}, trip: ${_this.trip}, likesCount: ${_this.likesCount}, commentsCount: ${_this.commentsCount}, isLiked: ${_this.isLiked}, createdAt: ${_this.createdAt}, updatedAt: ${_this.updatedAt}, user: ${_this.user}, recentComments: ${_this.recentComments})';
}


}

/// @nodoc
abstract mixin class $CommunityPostCopyWith<$Res>  {
  factory $CommunityPostCopyWith(CommunityPost value, $Res Function(CommunityPost) _then) = _$CommunityPostCopyWithImpl;
@useResult
$Res call({
 String id, String userId, String title, String content, List<String> tags,@JsonKey(readValue: _readPostImages) List<String> images, String? tripId, CommunityAttachedTrip? trip, int likesCount, int commentsCount, bool isLiked, DateTime createdAt, DateTime? updatedAt, CommunityUserInfo? user, List<Comment> recentComments
});


$CommunityAttachedTripCopyWith<$Res>? get trip;$CommunityUserInfoCopyWith<$Res>? get user;

}
/// @nodoc
class _$CommunityPostCopyWithImpl<$Res>
    implements $CommunityPostCopyWith<$Res> {
  _$CommunityPostCopyWithImpl(this._self, this._then);

  final CommunityPost _self;
  final $Res Function(CommunityPost) _then;

/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? userId = null,Object? title = null,Object? content = null,Object? tags = null,Object? images = null,Object? tripId = freezed,Object? trip = freezed,Object? likesCount = null,Object? commentsCount = null,Object? isLiked = null,Object? createdAt = null,Object? updatedAt = freezed,Object? user = freezed,Object? recentComments = null,}) {
  return _then(CommunityPost(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,images: null == images ? _self.images : images // ignore: cast_nullable_to_non_nullable
as List<String>,tripId: freezed == tripId ? _self.tripId : tripId // ignore: cast_nullable_to_non_nullable
as String?,trip: freezed == trip ? _self.trip : trip // ignore: cast_nullable_to_non_nullable
as CommunityAttachedTrip?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,commentsCount: null == commentsCount ? _self.commentsCount : commentsCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,user: freezed == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as CommunityUserInfo?,recentComments: null == recentComments ? _self.recentComments : recentComments // ignore: cast_nullable_to_non_nullable
as List<Comment>,
  ));
}
/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityAttachedTripCopyWith<$Res>? get trip {
    if (_self.trip == null) {
    return null;
  }

  return $CommunityAttachedTripCopyWith<$Res>(_self.trip!, (value) {
    return _then(_self.copyWith(trip: value));
  });
}/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityUserInfoCopyWith<$Res>? get user {
    if (_self.user == null) {
    return null;
  }

  return $CommunityUserInfoCopyWith<$Res>(_self.user!, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// Adds pattern-matching-related methods to [CommunityPost].
extension CommunityPostPatterns on CommunityPost {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommunityPost value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommunityPost() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommunityPost value)  $default,){
final _that = this;
switch (_that) {
case _CommunityPost():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommunityPost value)?  $default,){
final _that = this;
switch (_that) {
case _CommunityPost() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String userId,  String title,  String content,  List<String> tags, @JsonKey(readValue: _readPostImages)  List<String> images,  String? tripId,  CommunityAttachedTrip? trip,  int likesCount,  int commentsCount,  bool isLiked,  DateTime createdAt,  DateTime? updatedAt,  CommunityUserInfo? user,  List<Comment> recentComments)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityPost() when $default != null:
return $default(_that.id,_that.userId,_that.title,_that.content,_that.tags,_that.images,_that.tripId,_that.trip,_that.likesCount,_that.commentsCount,_that.isLiked,_that.createdAt,_that.updatedAt,_that.user,_that.recentComments);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String userId,  String title,  String content,  List<String> tags, @JsonKey(readValue: _readPostImages)  List<String> images,  String? tripId,  CommunityAttachedTrip? trip,  int likesCount,  int commentsCount,  bool isLiked,  DateTime createdAt,  DateTime? updatedAt,  CommunityUserInfo? user,  List<Comment> recentComments)  $default,) {final _that = this;
switch (_that) {
case _CommunityPost():
return $default(_that.id,_that.userId,_that.title,_that.content,_that.tags,_that.images,_that.tripId,_that.trip,_that.likesCount,_that.commentsCount,_that.isLiked,_that.createdAt,_that.updatedAt,_that.user,_that.recentComments);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String userId,  String title,  String content,  List<String> tags, @JsonKey(readValue: _readPostImages)  List<String> images,  String? tripId,  CommunityAttachedTrip? trip,  int likesCount,  int commentsCount,  bool isLiked,  DateTime createdAt,  DateTime? updatedAt,  CommunityUserInfo? user,  List<Comment> recentComments)?  $default,) {final _that = this;
switch (_that) {
case _CommunityPost() when $default != null:
return $default(_that.id,_that.userId,_that.title,_that.content,_that.tags,_that.images,_that.tripId,_that.trip,_that.likesCount,_that.commentsCount,_that.isLiked,_that.createdAt,_that.updatedAt,_that.user,_that.recentComments);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CommunityPost extends CommunityPost {
  const _CommunityPost({required this.id, required this.userId, this.title = '', required this.content,  List<String> tags = const [], @JsonKey(readValue: _readPostImages)  List<String> images = const [], this.tripId, this.trip, this.likesCount = 0, this.commentsCount = 0, this.isLiked = false, required this.createdAt, this.updatedAt, this.user,  List<Comment> recentComments = const []}): _tags = tags,_images = images,_recentComments = recentComments,super._();
  factory _CommunityPost.fromJson(Map<String, dynamic> json) => _$CommunityPostFromJson(json);

@override final  String id;
@override final  String userId;
@override@JsonKey() final  String title;
@override final  String content;
 final  List<String> _tags;
@override@JsonKey() List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

 final  List<String> _images;
@override@JsonKey(readValue: _readPostImages) List<String> get images {
  if (_images is EqualUnmodifiableListView) return _images;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_images);
}

@override final  String? tripId;
@override final  CommunityAttachedTrip? trip;
@override@JsonKey() final  int likesCount;
@override@JsonKey() final  int commentsCount;
@override@JsonKey() final  bool isLiked;
@override final  DateTime createdAt;
@override final  DateTime? updatedAt;
@override final  CommunityUserInfo? user;
 final  List<Comment> _recentComments;
@override@JsonKey() List<Comment> get recentComments {
  if (_recentComments is EqualUnmodifiableListView) return _recentComments;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_recentComments);
}


/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommunityPostCopyWith<_CommunityPost> get copyWith => __$CommunityPostCopyWithImpl<_CommunityPost>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CommunityPostToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityPost&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.title, title) || other.title == title)&&(identical(other.content, content) || other.content == content)&&const DeepCollectionEquality().equals(other.tags, _tags)&&const DeepCollectionEquality().equals(other.images, _images)&&(identical(other.tripId, tripId) || other.tripId == tripId)&&(identical(other.trip, trip) || other.trip == trip)&&(identical(other.likesCount, likesCount) || other.likesCount == likesCount)&&(identical(other.commentsCount, commentsCount) || other.commentsCount == commentsCount)&&(identical(other.isLiked, isLiked) || other.isLiked == isLiked)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.user, user) || other.user == user)&&const DeepCollectionEquality().equals(other.recentComments, _recentComments));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,userId,title,content,const DeepCollectionEquality().hash(_tags),const DeepCollectionEquality().hash(_images),tripId,trip,likesCount,commentsCount,isLiked,createdAt,updatedAt,user,const DeepCollectionEquality().hash(_recentComments));
}

@override
String toString() {
    return 'CommunityPost(id: $id, userId: $userId, title: $title, content: $content, tags: $tags, images: $images, tripId: $tripId, trip: $trip, likesCount: $likesCount, commentsCount: $commentsCount, isLiked: $isLiked, createdAt: $createdAt, updatedAt: $updatedAt, user: $user, recentComments: $recentComments)';
}


}

/// @nodoc
abstract mixin class _$CommunityPostCopyWith<$Res> implements $CommunityPostCopyWith<$Res> {
  factory _$CommunityPostCopyWith(_CommunityPost value, $Res Function(_CommunityPost) _then) = __$CommunityPostCopyWithImpl;
@override @useResult
$Res call({
 String id, String userId, String title, String content, List<String> tags,@JsonKey(readValue: _readPostImages) List<String> images, String? tripId, CommunityAttachedTrip? trip, int likesCount, int commentsCount, bool isLiked, DateTime createdAt, DateTime? updatedAt, CommunityUserInfo? user, List<Comment> recentComments
});


@override $CommunityAttachedTripCopyWith<$Res>? get trip;@override $CommunityUserInfoCopyWith<$Res>? get user;

}
/// @nodoc
class __$CommunityPostCopyWithImpl<$Res>
    implements _$CommunityPostCopyWith<$Res> {
  __$CommunityPostCopyWithImpl(this._self, this._then);

  final _CommunityPost _self;
  final $Res Function(_CommunityPost) _then;

/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? userId = null,Object? title = null,Object? content = null,Object? tags = null,Object? images = null,Object? tripId = freezed,Object? trip = freezed,Object? likesCount = null,Object? commentsCount = null,Object? isLiked = null,Object? createdAt = null,Object? updatedAt = freezed,Object? user = freezed,Object? recentComments = null,}) {
  return _then(_CommunityPost(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,images: null == images ? _self._images : images // ignore: cast_nullable_to_non_nullable
as List<String>,tripId: freezed == tripId ? _self.tripId : tripId // ignore: cast_nullable_to_non_nullable
as String?,trip: freezed == trip ? _self.trip : trip // ignore: cast_nullable_to_non_nullable
as CommunityAttachedTrip?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,commentsCount: null == commentsCount ? _self.commentsCount : commentsCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,user: freezed == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as CommunityUserInfo?,recentComments: null == recentComments ? _self._recentComments : recentComments // ignore: cast_nullable_to_non_nullable
as List<Comment>,
  ));
}

/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityAttachedTripCopyWith<$Res>? get trip {
    if (_self.trip == null) {
    return null;
  }

  return $CommunityAttachedTripCopyWith<$Res>(_self.trip!, (value) {
    return _then(_self.copyWith(trip: value));
  });
}/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$CommunityUserInfoCopyWith<$Res>? get user {
    if (_self.user == null) {
    return null;
  }

  return $CommunityUserInfoCopyWith<$Res>(_self.user!, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// @nodoc
mixin _$TravelBuddy {

 String get id; String get name; String get email; List<String> get preferredStyles; String? get budgetLevel; List<String> get mutualStyles; bool get sameBudget; double get matchScore; int get tripsCount; int get postsCount;
/// Create a copy of TravelBuddy
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TravelBuddyCopyWith<TravelBuddy> get copyWith => _$TravelBuddyCopyWithImpl<TravelBuddy>(this as TravelBuddy, _$identity);

  /// Serializes this TravelBuddy to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as TravelBuddy;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TravelBuddy&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.email, _this.email) || other.email == _this.email)&&const DeepCollectionEquality().equals(other.preferredStyles, _this.preferredStyles)&&(identical(other.budgetLevel, _this.budgetLevel) || other.budgetLevel == _this.budgetLevel)&&const DeepCollectionEquality().equals(other.mutualStyles, _this.mutualStyles)&&(identical(other.sameBudget, _this.sameBudget) || other.sameBudget == _this.sameBudget)&&(identical(other.matchScore, _this.matchScore) || other.matchScore == _this.matchScore)&&(identical(other.tripsCount, _this.tripsCount) || other.tripsCount == _this.tripsCount)&&(identical(other.postsCount, _this.postsCount) || other.postsCount == _this.postsCount));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as TravelBuddy;
  return Object.hash(runtimeType,_this.id,_this.name,_this.email,const DeepCollectionEquality().hash(_this.preferredStyles),_this.budgetLevel,const DeepCollectionEquality().hash(_this.mutualStyles),_this.sameBudget,_this.matchScore,_this.tripsCount,_this.postsCount);
}

@override
String toString() {
  final _this = this as TravelBuddy;
  return 'TravelBuddy(id: ${_this.id}, name: ${_this.name}, email: ${_this.email}, preferredStyles: ${_this.preferredStyles}, budgetLevel: ${_this.budgetLevel}, mutualStyles: ${_this.mutualStyles}, sameBudget: ${_this.sameBudget}, matchScore: ${_this.matchScore}, tripsCount: ${_this.tripsCount}, postsCount: ${_this.postsCount})';
}


}

/// @nodoc
abstract mixin class $TravelBuddyCopyWith<$Res>  {
  factory $TravelBuddyCopyWith(TravelBuddy value, $Res Function(TravelBuddy) _then) = _$TravelBuddyCopyWithImpl;
@useResult
$Res call({
 String id, String name, String email, List<String> preferredStyles, String? budgetLevel, List<String> mutualStyles, bool sameBudget, double matchScore, int tripsCount, int postsCount
});




}
/// @nodoc
class _$TravelBuddyCopyWithImpl<$Res>
    implements $TravelBuddyCopyWith<$Res> {
  _$TravelBuddyCopyWithImpl(this._self, this._then);

  final TravelBuddy _self;
  final $Res Function(TravelBuddy) _then;

/// Create a copy of TravelBuddy
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? email = null,Object? preferredStyles = null,Object? budgetLevel = freezed,Object? mutualStyles = null,Object? sameBudget = null,Object? matchScore = null,Object? tripsCount = null,Object? postsCount = null,}) {
  return _then(TravelBuddy(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,preferredStyles: null == preferredStyles ? _self.preferredStyles : preferredStyles // ignore: cast_nullable_to_non_nullable
as List<String>,budgetLevel: freezed == budgetLevel ? _self.budgetLevel : budgetLevel // ignore: cast_nullable_to_non_nullable
as String?,mutualStyles: null == mutualStyles ? _self.mutualStyles : mutualStyles // ignore: cast_nullable_to_non_nullable
as List<String>,sameBudget: null == sameBudget ? _self.sameBudget : sameBudget // ignore: cast_nullable_to_non_nullable
as bool,matchScore: null == matchScore ? _self.matchScore : matchScore // ignore: cast_nullable_to_non_nullable
as double,tripsCount: null == tripsCount ? _self.tripsCount : tripsCount // ignore: cast_nullable_to_non_nullable
as int,postsCount: null == postsCount ? _self.postsCount : postsCount // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [TravelBuddy].
extension TravelBuddyPatterns on TravelBuddy {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TravelBuddy value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TravelBuddy() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TravelBuddy value)  $default,){
final _that = this;
switch (_that) {
case _TravelBuddy():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TravelBuddy value)?  $default,){
final _that = this;
switch (_that) {
case _TravelBuddy() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String email,  List<String> preferredStyles,  String? budgetLevel,  List<String> mutualStyles,  bool sameBudget,  double matchScore,  int tripsCount,  int postsCount)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TravelBuddy() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.preferredStyles,_that.budgetLevel,_that.mutualStyles,_that.sameBudget,_that.matchScore,_that.tripsCount,_that.postsCount);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String email,  List<String> preferredStyles,  String? budgetLevel,  List<String> mutualStyles,  bool sameBudget,  double matchScore,  int tripsCount,  int postsCount)  $default,) {final _that = this;
switch (_that) {
case _TravelBuddy():
return $default(_that.id,_that.name,_that.email,_that.preferredStyles,_that.budgetLevel,_that.mutualStyles,_that.sameBudget,_that.matchScore,_that.tripsCount,_that.postsCount);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String email,  List<String> preferredStyles,  String? budgetLevel,  List<String> mutualStyles,  bool sameBudget,  double matchScore,  int tripsCount,  int postsCount)?  $default,) {final _that = this;
switch (_that) {
case _TravelBuddy() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.preferredStyles,_that.budgetLevel,_that.mutualStyles,_that.sameBudget,_that.matchScore,_that.tripsCount,_that.postsCount);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TravelBuddy implements TravelBuddy {
  const _TravelBuddy({required this.id, this.name = '', this.email = '',  List<String> preferredStyles = const [], this.budgetLevel,  List<String> mutualStyles = const [], this.sameBudget = false, this.matchScore = 0.0, this.tripsCount = 0, this.postsCount = 0}): _preferredStyles = preferredStyles,_mutualStyles = mutualStyles;
  factory _TravelBuddy.fromJson(Map<String, dynamic> json) => _$TravelBuddyFromJson(json);

@override final  String id;
@override@JsonKey() final  String name;
@override@JsonKey() final  String email;
 final  List<String> _preferredStyles;
@override@JsonKey() List<String> get preferredStyles {
  if (_preferredStyles is EqualUnmodifiableListView) return _preferredStyles;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_preferredStyles);
}

@override final  String? budgetLevel;
 final  List<String> _mutualStyles;
@override@JsonKey() List<String> get mutualStyles {
  if (_mutualStyles is EqualUnmodifiableListView) return _mutualStyles;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_mutualStyles);
}

@override@JsonKey() final  bool sameBudget;
@override@JsonKey() final  double matchScore;
@override@JsonKey() final  int tripsCount;
@override@JsonKey() final  int postsCount;

/// Create a copy of TravelBuddy
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TravelBuddyCopyWith<_TravelBuddy> get copyWith => __$TravelBuddyCopyWithImpl<_TravelBuddy>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TravelBuddyToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TravelBuddy&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&const DeepCollectionEquality().equals(other.preferredStyles, _preferredStyles)&&(identical(other.budgetLevel, budgetLevel) || other.budgetLevel == budgetLevel)&&const DeepCollectionEquality().equals(other.mutualStyles, _mutualStyles)&&(identical(other.sameBudget, sameBudget) || other.sameBudget == sameBudget)&&(identical(other.matchScore, matchScore) || other.matchScore == matchScore)&&(identical(other.tripsCount, tripsCount) || other.tripsCount == tripsCount)&&(identical(other.postsCount, postsCount) || other.postsCount == postsCount));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,email,const DeepCollectionEquality().hash(_preferredStyles),budgetLevel,const DeepCollectionEquality().hash(_mutualStyles),sameBudget,matchScore,tripsCount,postsCount);
}

@override
String toString() {
    return 'TravelBuddy(id: $id, name: $name, email: $email, preferredStyles: $preferredStyles, budgetLevel: $budgetLevel, mutualStyles: $mutualStyles, sameBudget: $sameBudget, matchScore: $matchScore, tripsCount: $tripsCount, postsCount: $postsCount)';
}


}

/// @nodoc
abstract mixin class _$TravelBuddyCopyWith<$Res> implements $TravelBuddyCopyWith<$Res> {
  factory _$TravelBuddyCopyWith(_TravelBuddy value, $Res Function(_TravelBuddy) _then) = __$TravelBuddyCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String email, List<String> preferredStyles, String? budgetLevel, List<String> mutualStyles, bool sameBudget, double matchScore, int tripsCount, int postsCount
});




}
/// @nodoc
class __$TravelBuddyCopyWithImpl<$Res>
    implements _$TravelBuddyCopyWith<$Res> {
  __$TravelBuddyCopyWithImpl(this._self, this._then);

  final _TravelBuddy _self;
  final $Res Function(_TravelBuddy) _then;

/// Create a copy of TravelBuddy
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? email = null,Object? preferredStyles = null,Object? budgetLevel = freezed,Object? mutualStyles = null,Object? sameBudget = null,Object? matchScore = null,Object? tripsCount = null,Object? postsCount = null,}) {
  return _then(_TravelBuddy(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,preferredStyles: null == preferredStyles ? _self._preferredStyles : preferredStyles // ignore: cast_nullable_to_non_nullable
as List<String>,budgetLevel: freezed == budgetLevel ? _self.budgetLevel : budgetLevel // ignore: cast_nullable_to_non_nullable
as String?,mutualStyles: null == mutualStyles ? _self._mutualStyles : mutualStyles // ignore: cast_nullable_to_non_nullable
as List<String>,sameBudget: null == sameBudget ? _self.sameBudget : sameBudget // ignore: cast_nullable_to_non_nullable
as bool,matchScore: null == matchScore ? _self.matchScore : matchScore // ignore: cast_nullable_to_non_nullable
as double,tripsCount: null == tripsCount ? _self.tripsCount : tripsCount // ignore: cast_nullable_to_non_nullable
as int,postsCount: null == postsCount ? _self.postsCount : postsCount // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
