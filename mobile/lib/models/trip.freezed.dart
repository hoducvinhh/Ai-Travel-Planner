// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'trip.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ItineraryPlace {

 String get placeId; String get name; String get description; List<String> get categories; String get estimatedTime; int get orderInDay; double get latitude; double get longitude; int get priceEstimate; String? get timeSlot; String? get province; String? get imageUrl;
/// Create a copy of ItineraryPlace
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ItineraryPlaceCopyWith<ItineraryPlace> get copyWith => _$ItineraryPlaceCopyWithImpl<ItineraryPlace>(this as ItineraryPlace, _$identity);

  /// Serializes this ItineraryPlace to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ItineraryPlace;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ItineraryPlace&&(identical(other.placeId, _this.placeId) || other.placeId == _this.placeId)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.description, _this.description) || other.description == _this.description)&&const DeepCollectionEquality().equals(other.categories, _this.categories)&&(identical(other.estimatedTime, _this.estimatedTime) || other.estimatedTime == _this.estimatedTime)&&(identical(other.orderInDay, _this.orderInDay) || other.orderInDay == _this.orderInDay)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&(identical(other.priceEstimate, _this.priceEstimate) || other.priceEstimate == _this.priceEstimate)&&(identical(other.timeSlot, _this.timeSlot) || other.timeSlot == _this.timeSlot)&&(identical(other.province, _this.province) || other.province == _this.province)&&(identical(other.imageUrl, _this.imageUrl) || other.imageUrl == _this.imageUrl));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ItineraryPlace;
  return Object.hash(runtimeType,_this.placeId,_this.name,_this.description,const DeepCollectionEquality().hash(_this.categories),_this.estimatedTime,_this.orderInDay,_this.latitude,_this.longitude,_this.priceEstimate,_this.timeSlot,_this.province,_this.imageUrl);
}

@override
String toString() {
  final _this = this as ItineraryPlace;
  return 'ItineraryPlace(placeId: ${_this.placeId}, name: ${_this.name}, description: ${_this.description}, categories: ${_this.categories}, estimatedTime: ${_this.estimatedTime}, orderInDay: ${_this.orderInDay}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, priceEstimate: ${_this.priceEstimate}, timeSlot: ${_this.timeSlot}, province: ${_this.province}, imageUrl: ${_this.imageUrl})';
}


}

/// @nodoc
abstract mixin class $ItineraryPlaceCopyWith<$Res>  {
  factory $ItineraryPlaceCopyWith(ItineraryPlace value, $Res Function(ItineraryPlace) _then) = _$ItineraryPlaceCopyWithImpl;
@useResult
$Res call({
 String placeId, String name, String description, List<String> categories, String estimatedTime, int orderInDay, double latitude, double longitude, int priceEstimate, String? timeSlot, String? province, String? imageUrl
});




}
/// @nodoc
class _$ItineraryPlaceCopyWithImpl<$Res>
    implements $ItineraryPlaceCopyWith<$Res> {
  _$ItineraryPlaceCopyWithImpl(this._self, this._then);

  final ItineraryPlace _self;
  final $Res Function(ItineraryPlace) _then;

/// Create a copy of ItineraryPlace
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? placeId = null,Object? name = null,Object? description = null,Object? categories = null,Object? estimatedTime = null,Object? orderInDay = null,Object? latitude = null,Object? longitude = null,Object? priceEstimate = null,Object? timeSlot = freezed,Object? province = freezed,Object? imageUrl = freezed,}) {
  return _then(ItineraryPlace(
placeId: null == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,categories: null == categories ? _self.categories : categories // ignore: cast_nullable_to_non_nullable
as List<String>,estimatedTime: null == estimatedTime ? _self.estimatedTime : estimatedTime // ignore: cast_nullable_to_non_nullable
as String,orderInDay: null == orderInDay ? _self.orderInDay : orderInDay // ignore: cast_nullable_to_non_nullable
as int,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,priceEstimate: null == priceEstimate ? _self.priceEstimate : priceEstimate // ignore: cast_nullable_to_non_nullable
as int,timeSlot: freezed == timeSlot ? _self.timeSlot : timeSlot // ignore: cast_nullable_to_non_nullable
as String?,province: freezed == province ? _self.province : province // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ItineraryPlace].
extension ItineraryPlacePatterns on ItineraryPlace {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ItineraryPlace value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ItineraryPlace() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ItineraryPlace value)  $default,){
final _that = this;
switch (_that) {
case _ItineraryPlace():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ItineraryPlace value)?  $default,){
final _that = this;
switch (_that) {
case _ItineraryPlace() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String placeId,  String name,  String description,  List<String> categories,  String estimatedTime,  int orderInDay,  double latitude,  double longitude,  int priceEstimate,  String? timeSlot,  String? province,  String? imageUrl)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ItineraryPlace() when $default != null:
return $default(_that.placeId,_that.name,_that.description,_that.categories,_that.estimatedTime,_that.orderInDay,_that.latitude,_that.longitude,_that.priceEstimate,_that.timeSlot,_that.province,_that.imageUrl);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String placeId,  String name,  String description,  List<String> categories,  String estimatedTime,  int orderInDay,  double latitude,  double longitude,  int priceEstimate,  String? timeSlot,  String? province,  String? imageUrl)  $default,) {final _that = this;
switch (_that) {
case _ItineraryPlace():
return $default(_that.placeId,_that.name,_that.description,_that.categories,_that.estimatedTime,_that.orderInDay,_that.latitude,_that.longitude,_that.priceEstimate,_that.timeSlot,_that.province,_that.imageUrl);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String placeId,  String name,  String description,  List<String> categories,  String estimatedTime,  int orderInDay,  double latitude,  double longitude,  int priceEstimate,  String? timeSlot,  String? province,  String? imageUrl)?  $default,) {final _that = this;
switch (_that) {
case _ItineraryPlace() when $default != null:
return $default(_that.placeId,_that.name,_that.description,_that.categories,_that.estimatedTime,_that.orderInDay,_that.latitude,_that.longitude,_that.priceEstimate,_that.timeSlot,_that.province,_that.imageUrl);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ItineraryPlace implements ItineraryPlace {
  const _ItineraryPlace({required this.placeId, required this.name, this.description = '',  List<String> categories = const [], this.estimatedTime = '', this.orderInDay = 1, required this.latitude, required this.longitude, this.priceEstimate = 0, this.timeSlot, this.province, this.imageUrl}): _categories = categories;
  factory _ItineraryPlace.fromJson(Map<String, dynamic> json) => _$ItineraryPlaceFromJson(json);

@override final  String placeId;
@override final  String name;
@override@JsonKey() final  String description;
 final  List<String> _categories;
@override@JsonKey() List<String> get categories {
  if (_categories is EqualUnmodifiableListView) return _categories;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_categories);
}

@override@JsonKey() final  String estimatedTime;
@override@JsonKey() final  int orderInDay;
@override final  double latitude;
@override final  double longitude;
@override@JsonKey() final  int priceEstimate;
@override final  String? timeSlot;
@override final  String? province;
@override final  String? imageUrl;

/// Create a copy of ItineraryPlace
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ItineraryPlaceCopyWith<_ItineraryPlace> get copyWith => __$ItineraryPlaceCopyWithImpl<_ItineraryPlace>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ItineraryPlaceToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ItineraryPlace&&(identical(other.placeId, placeId) || other.placeId == placeId)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other.categories, _categories)&&(identical(other.estimatedTime, estimatedTime) || other.estimatedTime == estimatedTime)&&(identical(other.orderInDay, orderInDay) || other.orderInDay == orderInDay)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.priceEstimate, priceEstimate) || other.priceEstimate == priceEstimate)&&(identical(other.timeSlot, timeSlot) || other.timeSlot == timeSlot)&&(identical(other.province, province) || other.province == province)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,placeId,name,description,const DeepCollectionEquality().hash(_categories),estimatedTime,orderInDay,latitude,longitude,priceEstimate,timeSlot,province,imageUrl);
}

@override
String toString() {
    return 'ItineraryPlace(placeId: $placeId, name: $name, description: $description, categories: $categories, estimatedTime: $estimatedTime, orderInDay: $orderInDay, latitude: $latitude, longitude: $longitude, priceEstimate: $priceEstimate, timeSlot: $timeSlot, province: $province, imageUrl: $imageUrl)';
}


}

/// @nodoc
abstract mixin class _$ItineraryPlaceCopyWith<$Res> implements $ItineraryPlaceCopyWith<$Res> {
  factory _$ItineraryPlaceCopyWith(_ItineraryPlace value, $Res Function(_ItineraryPlace) _then) = __$ItineraryPlaceCopyWithImpl;
@override @useResult
$Res call({
 String placeId, String name, String description, List<String> categories, String estimatedTime, int orderInDay, double latitude, double longitude, int priceEstimate, String? timeSlot, String? province, String? imageUrl
});




}
/// @nodoc
class __$ItineraryPlaceCopyWithImpl<$Res>
    implements _$ItineraryPlaceCopyWith<$Res> {
  __$ItineraryPlaceCopyWithImpl(this._self, this._then);

  final _ItineraryPlace _self;
  final $Res Function(_ItineraryPlace) _then;

/// Create a copy of ItineraryPlace
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? placeId = null,Object? name = null,Object? description = null,Object? categories = null,Object? estimatedTime = null,Object? orderInDay = null,Object? latitude = null,Object? longitude = null,Object? priceEstimate = null,Object? timeSlot = freezed,Object? province = freezed,Object? imageUrl = freezed,}) {
  return _then(_ItineraryPlace(
placeId: null == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,categories: null == categories ? _self._categories : categories // ignore: cast_nullable_to_non_nullable
as List<String>,estimatedTime: null == estimatedTime ? _self.estimatedTime : estimatedTime // ignore: cast_nullable_to_non_nullable
as String,orderInDay: null == orderInDay ? _self.orderInDay : orderInDay // ignore: cast_nullable_to_non_nullable
as int,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,priceEstimate: null == priceEstimate ? _self.priceEstimate : priceEstimate // ignore: cast_nullable_to_non_nullable
as int,timeSlot: freezed == timeSlot ? _self.timeSlot : timeSlot // ignore: cast_nullable_to_non_nullable
as String?,province: freezed == province ? _self.province : province // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$DayOptimizationStats {

 int get dayNumber; double get originalDistanceKm; double get optimizedDistanceKm; double get savedDistanceKm; double get savedPercentage;
/// Create a copy of DayOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DayOptimizationStatsCopyWith<DayOptimizationStats> get copyWith => _$DayOptimizationStatsCopyWithImpl<DayOptimizationStats>(this as DayOptimizationStats, _$identity);

  /// Serializes this DayOptimizationStats to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DayOptimizationStats;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DayOptimizationStats&&(identical(other.dayNumber, _this.dayNumber) || other.dayNumber == _this.dayNumber)&&(identical(other.originalDistanceKm, _this.originalDistanceKm) || other.originalDistanceKm == _this.originalDistanceKm)&&(identical(other.optimizedDistanceKm, _this.optimizedDistanceKm) || other.optimizedDistanceKm == _this.optimizedDistanceKm)&&(identical(other.savedDistanceKm, _this.savedDistanceKm) || other.savedDistanceKm == _this.savedDistanceKm)&&(identical(other.savedPercentage, _this.savedPercentage) || other.savedPercentage == _this.savedPercentage));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DayOptimizationStats;
  return Object.hash(runtimeType,_this.dayNumber,_this.originalDistanceKm,_this.optimizedDistanceKm,_this.savedDistanceKm,_this.savedPercentage);
}

@override
String toString() {
  final _this = this as DayOptimizationStats;
  return 'DayOptimizationStats(dayNumber: ${_this.dayNumber}, originalDistanceKm: ${_this.originalDistanceKm}, optimizedDistanceKm: ${_this.optimizedDistanceKm}, savedDistanceKm: ${_this.savedDistanceKm}, savedPercentage: ${_this.savedPercentage})';
}


}

/// @nodoc
abstract mixin class $DayOptimizationStatsCopyWith<$Res>  {
  factory $DayOptimizationStatsCopyWith(DayOptimizationStats value, $Res Function(DayOptimizationStats) _then) = _$DayOptimizationStatsCopyWithImpl;
@useResult
$Res call({
 int dayNumber, double originalDistanceKm, double optimizedDistanceKm, double savedDistanceKm, double savedPercentage
});




}
/// @nodoc
class _$DayOptimizationStatsCopyWithImpl<$Res>
    implements $DayOptimizationStatsCopyWith<$Res> {
  _$DayOptimizationStatsCopyWithImpl(this._self, this._then);

  final DayOptimizationStats _self;
  final $Res Function(DayOptimizationStats) _then;

/// Create a copy of DayOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? dayNumber = null,Object? originalDistanceKm = null,Object? optimizedDistanceKm = null,Object? savedDistanceKm = null,Object? savedPercentage = null,}) {
  return _then(DayOptimizationStats(
dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,originalDistanceKm: null == originalDistanceKm ? _self.originalDistanceKm : originalDistanceKm // ignore: cast_nullable_to_non_nullable
as double,optimizedDistanceKm: null == optimizedDistanceKm ? _self.optimizedDistanceKm : optimizedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,savedDistanceKm: null == savedDistanceKm ? _self.savedDistanceKm : savedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,savedPercentage: null == savedPercentage ? _self.savedPercentage : savedPercentage // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [DayOptimizationStats].
extension DayOptimizationStatsPatterns on DayOptimizationStats {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DayOptimizationStats value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DayOptimizationStats() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DayOptimizationStats value)  $default,){
final _that = this;
switch (_that) {
case _DayOptimizationStats():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DayOptimizationStats value)?  $default,){
final _that = this;
switch (_that) {
case _DayOptimizationStats() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int dayNumber,  double originalDistanceKm,  double optimizedDistanceKm,  double savedDistanceKm,  double savedPercentage)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DayOptimizationStats() when $default != null:
return $default(_that.dayNumber,_that.originalDistanceKm,_that.optimizedDistanceKm,_that.savedDistanceKm,_that.savedPercentage);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int dayNumber,  double originalDistanceKm,  double optimizedDistanceKm,  double savedDistanceKm,  double savedPercentage)  $default,) {final _that = this;
switch (_that) {
case _DayOptimizationStats():
return $default(_that.dayNumber,_that.originalDistanceKm,_that.optimizedDistanceKm,_that.savedDistanceKm,_that.savedPercentage);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int dayNumber,  double originalDistanceKm,  double optimizedDistanceKm,  double savedDistanceKm,  double savedPercentage)?  $default,) {final _that = this;
switch (_that) {
case _DayOptimizationStats() when $default != null:
return $default(_that.dayNumber,_that.originalDistanceKm,_that.optimizedDistanceKm,_that.savedDistanceKm,_that.savedPercentage);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DayOptimizationStats implements DayOptimizationStats {
  const _DayOptimizationStats({required this.dayNumber, this.originalDistanceKm = 0.0, this.optimizedDistanceKm = 0.0, this.savedDistanceKm = 0.0, this.savedPercentage = 0.0});
  factory _DayOptimizationStats.fromJson(Map<String, dynamic> json) => _$DayOptimizationStatsFromJson(json);

@override final  int dayNumber;
@override@JsonKey() final  double originalDistanceKm;
@override@JsonKey() final  double optimizedDistanceKm;
@override@JsonKey() final  double savedDistanceKm;
@override@JsonKey() final  double savedPercentage;

/// Create a copy of DayOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DayOptimizationStatsCopyWith<_DayOptimizationStats> get copyWith => __$DayOptimizationStatsCopyWithImpl<_DayOptimizationStats>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DayOptimizationStatsToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DayOptimizationStats&&(identical(other.dayNumber, dayNumber) || other.dayNumber == dayNumber)&&(identical(other.originalDistanceKm, originalDistanceKm) || other.originalDistanceKm == originalDistanceKm)&&(identical(other.optimizedDistanceKm, optimizedDistanceKm) || other.optimizedDistanceKm == optimizedDistanceKm)&&(identical(other.savedDistanceKm, savedDistanceKm) || other.savedDistanceKm == savedDistanceKm)&&(identical(other.savedPercentage, savedPercentage) || other.savedPercentage == savedPercentage));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,dayNumber,originalDistanceKm,optimizedDistanceKm,savedDistanceKm,savedPercentage);
}

@override
String toString() {
    return 'DayOptimizationStats(dayNumber: $dayNumber, originalDistanceKm: $originalDistanceKm, optimizedDistanceKm: $optimizedDistanceKm, savedDistanceKm: $savedDistanceKm, savedPercentage: $savedPercentage)';
}


}

/// @nodoc
abstract mixin class _$DayOptimizationStatsCopyWith<$Res> implements $DayOptimizationStatsCopyWith<$Res> {
  factory _$DayOptimizationStatsCopyWith(_DayOptimizationStats value, $Res Function(_DayOptimizationStats) _then) = __$DayOptimizationStatsCopyWithImpl;
@override @useResult
$Res call({
 int dayNumber, double originalDistanceKm, double optimizedDistanceKm, double savedDistanceKm, double savedPercentage
});




}
/// @nodoc
class __$DayOptimizationStatsCopyWithImpl<$Res>
    implements _$DayOptimizationStatsCopyWith<$Res> {
  __$DayOptimizationStatsCopyWithImpl(this._self, this._then);

  final _DayOptimizationStats _self;
  final $Res Function(_DayOptimizationStats) _then;

/// Create a copy of DayOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? dayNumber = null,Object? originalDistanceKm = null,Object? optimizedDistanceKm = null,Object? savedDistanceKm = null,Object? savedPercentage = null,}) {
  return _then(_DayOptimizationStats(
dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,originalDistanceKm: null == originalDistanceKm ? _self.originalDistanceKm : originalDistanceKm // ignore: cast_nullable_to_non_nullable
as double,optimizedDistanceKm: null == optimizedDistanceKm ? _self.optimizedDistanceKm : optimizedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,savedDistanceKm: null == savedDistanceKm ? _self.savedDistanceKm : savedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,savedPercentage: null == savedPercentage ? _self.savedPercentage : savedPercentage // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}


/// @nodoc
mixin _$TripOptimizationStats {

 double get totalOriginalDistanceKm; double get totalOptimizedDistanceKm; double get totalSavedDistanceKm; double get totalSavedPercentage; List<DayOptimizationStats> get days;
/// Create a copy of TripOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TripOptimizationStatsCopyWith<TripOptimizationStats> get copyWith => _$TripOptimizationStatsCopyWithImpl<TripOptimizationStats>(this as TripOptimizationStats, _$identity);

  /// Serializes this TripOptimizationStats to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as TripOptimizationStats;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TripOptimizationStats&&(identical(other.totalOriginalDistanceKm, _this.totalOriginalDistanceKm) || other.totalOriginalDistanceKm == _this.totalOriginalDistanceKm)&&(identical(other.totalOptimizedDistanceKm, _this.totalOptimizedDistanceKm) || other.totalOptimizedDistanceKm == _this.totalOptimizedDistanceKm)&&(identical(other.totalSavedDistanceKm, _this.totalSavedDistanceKm) || other.totalSavedDistanceKm == _this.totalSavedDistanceKm)&&(identical(other.totalSavedPercentage, _this.totalSavedPercentage) || other.totalSavedPercentage == _this.totalSavedPercentage)&&const DeepCollectionEquality().equals(other.days, _this.days));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as TripOptimizationStats;
  return Object.hash(runtimeType,_this.totalOriginalDistanceKm,_this.totalOptimizedDistanceKm,_this.totalSavedDistanceKm,_this.totalSavedPercentage,const DeepCollectionEquality().hash(_this.days));
}

@override
String toString() {
  final _this = this as TripOptimizationStats;
  return 'TripOptimizationStats(totalOriginalDistanceKm: ${_this.totalOriginalDistanceKm}, totalOptimizedDistanceKm: ${_this.totalOptimizedDistanceKm}, totalSavedDistanceKm: ${_this.totalSavedDistanceKm}, totalSavedPercentage: ${_this.totalSavedPercentage}, days: ${_this.days})';
}


}

/// @nodoc
abstract mixin class $TripOptimizationStatsCopyWith<$Res>  {
  factory $TripOptimizationStatsCopyWith(TripOptimizationStats value, $Res Function(TripOptimizationStats) _then) = _$TripOptimizationStatsCopyWithImpl;
@useResult
$Res call({
 double totalOriginalDistanceKm, double totalOptimizedDistanceKm, double totalSavedDistanceKm, double totalSavedPercentage, List<DayOptimizationStats> days
});




}
/// @nodoc
class _$TripOptimizationStatsCopyWithImpl<$Res>
    implements $TripOptimizationStatsCopyWith<$Res> {
  _$TripOptimizationStatsCopyWithImpl(this._self, this._then);

  final TripOptimizationStats _self;
  final $Res Function(TripOptimizationStats) _then;

/// Create a copy of TripOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? totalOriginalDistanceKm = null,Object? totalOptimizedDistanceKm = null,Object? totalSavedDistanceKm = null,Object? totalSavedPercentage = null,Object? days = null,}) {
  return _then(TripOptimizationStats(
totalOriginalDistanceKm: null == totalOriginalDistanceKm ? _self.totalOriginalDistanceKm : totalOriginalDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalOptimizedDistanceKm: null == totalOptimizedDistanceKm ? _self.totalOptimizedDistanceKm : totalOptimizedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalSavedDistanceKm: null == totalSavedDistanceKm ? _self.totalSavedDistanceKm : totalSavedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalSavedPercentage: null == totalSavedPercentage ? _self.totalSavedPercentage : totalSavedPercentage // ignore: cast_nullable_to_non_nullable
as double,days: null == days ? _self.days : days // ignore: cast_nullable_to_non_nullable
as List<DayOptimizationStats>,
  ));
}

}


/// Adds pattern-matching-related methods to [TripOptimizationStats].
extension TripOptimizationStatsPatterns on TripOptimizationStats {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TripOptimizationStats value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TripOptimizationStats() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TripOptimizationStats value)  $default,){
final _that = this;
switch (_that) {
case _TripOptimizationStats():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TripOptimizationStats value)?  $default,){
final _that = this;
switch (_that) {
case _TripOptimizationStats() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( double totalOriginalDistanceKm,  double totalOptimizedDistanceKm,  double totalSavedDistanceKm,  double totalSavedPercentage,  List<DayOptimizationStats> days)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TripOptimizationStats() when $default != null:
return $default(_that.totalOriginalDistanceKm,_that.totalOptimizedDistanceKm,_that.totalSavedDistanceKm,_that.totalSavedPercentage,_that.days);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( double totalOriginalDistanceKm,  double totalOptimizedDistanceKm,  double totalSavedDistanceKm,  double totalSavedPercentage,  List<DayOptimizationStats> days)  $default,) {final _that = this;
switch (_that) {
case _TripOptimizationStats():
return $default(_that.totalOriginalDistanceKm,_that.totalOptimizedDistanceKm,_that.totalSavedDistanceKm,_that.totalSavedPercentage,_that.days);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( double totalOriginalDistanceKm,  double totalOptimizedDistanceKm,  double totalSavedDistanceKm,  double totalSavedPercentage,  List<DayOptimizationStats> days)?  $default,) {final _that = this;
switch (_that) {
case _TripOptimizationStats() when $default != null:
return $default(_that.totalOriginalDistanceKm,_that.totalOptimizedDistanceKm,_that.totalSavedDistanceKm,_that.totalSavedPercentage,_that.days);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TripOptimizationStats implements TripOptimizationStats {
  const _TripOptimizationStats({this.totalOriginalDistanceKm = 0.0, this.totalOptimizedDistanceKm = 0.0, this.totalSavedDistanceKm = 0.0, this.totalSavedPercentage = 0.0,  List<DayOptimizationStats> days = const []}): _days = days;
  factory _TripOptimizationStats.fromJson(Map<String, dynamic> json) => _$TripOptimizationStatsFromJson(json);

@override@JsonKey() final  double totalOriginalDistanceKm;
@override@JsonKey() final  double totalOptimizedDistanceKm;
@override@JsonKey() final  double totalSavedDistanceKm;
@override@JsonKey() final  double totalSavedPercentage;
 final  List<DayOptimizationStats> _days;
@override@JsonKey() List<DayOptimizationStats> get days {
  if (_days is EqualUnmodifiableListView) return _days;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_days);
}


/// Create a copy of TripOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TripOptimizationStatsCopyWith<_TripOptimizationStats> get copyWith => __$TripOptimizationStatsCopyWithImpl<_TripOptimizationStats>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TripOptimizationStatsToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TripOptimizationStats&&(identical(other.totalOriginalDistanceKm, totalOriginalDistanceKm) || other.totalOriginalDistanceKm == totalOriginalDistanceKm)&&(identical(other.totalOptimizedDistanceKm, totalOptimizedDistanceKm) || other.totalOptimizedDistanceKm == totalOptimizedDistanceKm)&&(identical(other.totalSavedDistanceKm, totalSavedDistanceKm) || other.totalSavedDistanceKm == totalSavedDistanceKm)&&(identical(other.totalSavedPercentage, totalSavedPercentage) || other.totalSavedPercentage == totalSavedPercentage)&&const DeepCollectionEquality().equals(other.days, _days));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,totalOriginalDistanceKm,totalOptimizedDistanceKm,totalSavedDistanceKm,totalSavedPercentage,const DeepCollectionEquality().hash(_days));
}

@override
String toString() {
    return 'TripOptimizationStats(totalOriginalDistanceKm: $totalOriginalDistanceKm, totalOptimizedDistanceKm: $totalOptimizedDistanceKm, totalSavedDistanceKm: $totalSavedDistanceKm, totalSavedPercentage: $totalSavedPercentage, days: $days)';
}


}

/// @nodoc
abstract mixin class _$TripOptimizationStatsCopyWith<$Res> implements $TripOptimizationStatsCopyWith<$Res> {
  factory _$TripOptimizationStatsCopyWith(_TripOptimizationStats value, $Res Function(_TripOptimizationStats) _then) = __$TripOptimizationStatsCopyWithImpl;
@override @useResult
$Res call({
 double totalOriginalDistanceKm, double totalOptimizedDistanceKm, double totalSavedDistanceKm, double totalSavedPercentage, List<DayOptimizationStats> days
});




}
/// @nodoc
class __$TripOptimizationStatsCopyWithImpl<$Res>
    implements _$TripOptimizationStatsCopyWith<$Res> {
  __$TripOptimizationStatsCopyWithImpl(this._self, this._then);

  final _TripOptimizationStats _self;
  final $Res Function(_TripOptimizationStats) _then;

/// Create a copy of TripOptimizationStats
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? totalOriginalDistanceKm = null,Object? totalOptimizedDistanceKm = null,Object? totalSavedDistanceKm = null,Object? totalSavedPercentage = null,Object? days = null,}) {
  return _then(_TripOptimizationStats(
totalOriginalDistanceKm: null == totalOriginalDistanceKm ? _self.totalOriginalDistanceKm : totalOriginalDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalOptimizedDistanceKm: null == totalOptimizedDistanceKm ? _self.totalOptimizedDistanceKm : totalOptimizedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalSavedDistanceKm: null == totalSavedDistanceKm ? _self.totalSavedDistanceKm : totalSavedDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalSavedPercentage: null == totalSavedPercentage ? _self.totalSavedPercentage : totalSavedPercentage // ignore: cast_nullable_to_non_nullable
as double,days: null == days ? _self._days : days // ignore: cast_nullable_to_non_nullable
as List<DayOptimizationStats>,
  ));
}


}


/// @nodoc
mixin _$FeasibilityCriterion {

 double get score; double get weight; String get label; String get status; String get summary;
/// Create a copy of FeasibilityCriterion
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<FeasibilityCriterion> get copyWith => _$FeasibilityCriterionCopyWithImpl<FeasibilityCriterion>(this as FeasibilityCriterion, _$identity);

  /// Serializes this FeasibilityCriterion to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FeasibilityCriterion;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeasibilityCriterion&&(identical(other.score, _this.score) || other.score == _this.score)&&(identical(other.weight, _this.weight) || other.weight == _this.weight)&&(identical(other.label, _this.label) || other.label == _this.label)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.summary, _this.summary) || other.summary == _this.summary));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FeasibilityCriterion;
  return Object.hash(runtimeType,_this.score,_this.weight,_this.label,_this.status,_this.summary);
}

@override
String toString() {
  final _this = this as FeasibilityCriterion;
  return 'FeasibilityCriterion(score: ${_this.score}, weight: ${_this.weight}, label: ${_this.label}, status: ${_this.status}, summary: ${_this.summary})';
}


}

/// @nodoc
abstract mixin class $FeasibilityCriterionCopyWith<$Res>  {
  factory $FeasibilityCriterionCopyWith(FeasibilityCriterion value, $Res Function(FeasibilityCriterion) _then) = _$FeasibilityCriterionCopyWithImpl;
@useResult
$Res call({
 double score, double weight, String label, String status, String summary
});




}
/// @nodoc
class _$FeasibilityCriterionCopyWithImpl<$Res>
    implements $FeasibilityCriterionCopyWith<$Res> {
  _$FeasibilityCriterionCopyWithImpl(this._self, this._then);

  final FeasibilityCriterion _self;
  final $Res Function(FeasibilityCriterion) _then;

/// Create a copy of FeasibilityCriterion
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? score = null,Object? weight = null,Object? label = null,Object? status = null,Object? summary = null,}) {
  return _then(FeasibilityCriterion(
score: null == score ? _self.score : score // ignore: cast_nullable_to_non_nullable
as double,weight: null == weight ? _self.weight : weight // ignore: cast_nullable_to_non_nullable
as double,label: null == label ? _self.label : label // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [FeasibilityCriterion].
extension FeasibilityCriterionPatterns on FeasibilityCriterion {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeasibilityCriterion value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeasibilityCriterion() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeasibilityCriterion value)  $default,){
final _that = this;
switch (_that) {
case _FeasibilityCriterion():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeasibilityCriterion value)?  $default,){
final _that = this;
switch (_that) {
case _FeasibilityCriterion() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( double score,  double weight,  String label,  String status,  String summary)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeasibilityCriterion() when $default != null:
return $default(_that.score,_that.weight,_that.label,_that.status,_that.summary);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( double score,  double weight,  String label,  String status,  String summary)  $default,) {final _that = this;
switch (_that) {
case _FeasibilityCriterion():
return $default(_that.score,_that.weight,_that.label,_that.status,_that.summary);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( double score,  double weight,  String label,  String status,  String summary)?  $default,) {final _that = this;
switch (_that) {
case _FeasibilityCriterion() when $default != null:
return $default(_that.score,_that.weight,_that.label,_that.status,_that.summary);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FeasibilityCriterion implements FeasibilityCriterion {
  const _FeasibilityCriterion({this.score = 0.0, this.weight = 0.0, this.label = '', this.status = 'good', this.summary = ''});
  factory _FeasibilityCriterion.fromJson(Map<String, dynamic> json) => _$FeasibilityCriterionFromJson(json);

@override@JsonKey() final  double score;
@override@JsonKey() final  double weight;
@override@JsonKey() final  String label;
@override@JsonKey() final  String status;
@override@JsonKey() final  String summary;

/// Create a copy of FeasibilityCriterion
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeasibilityCriterionCopyWith<_FeasibilityCriterion> get copyWith => __$FeasibilityCriterionCopyWithImpl<_FeasibilityCriterion>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FeasibilityCriterionToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeasibilityCriterion&&(identical(other.score, score) || other.score == score)&&(identical(other.weight, weight) || other.weight == weight)&&(identical(other.label, label) || other.label == label)&&(identical(other.status, status) || other.status == status)&&(identical(other.summary, summary) || other.summary == summary));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,score,weight,label,status,summary);
}

@override
String toString() {
    return 'FeasibilityCriterion(score: $score, weight: $weight, label: $label, status: $status, summary: $summary)';
}


}

/// @nodoc
abstract mixin class _$FeasibilityCriterionCopyWith<$Res> implements $FeasibilityCriterionCopyWith<$Res> {
  factory _$FeasibilityCriterionCopyWith(_FeasibilityCriterion value, $Res Function(_FeasibilityCriterion) _then) = __$FeasibilityCriterionCopyWithImpl;
@override @useResult
$Res call({
 double score, double weight, String label, String status, String summary
});




}
/// @nodoc
class __$FeasibilityCriterionCopyWithImpl<$Res>
    implements _$FeasibilityCriterionCopyWith<$Res> {
  __$FeasibilityCriterionCopyWithImpl(this._self, this._then);

  final _FeasibilityCriterion _self;
  final $Res Function(_FeasibilityCriterion) _then;

/// Create a copy of FeasibilityCriterion
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? score = null,Object? weight = null,Object? label = null,Object? status = null,Object? summary = null,}) {
  return _then(_FeasibilityCriterion(
score: null == score ? _self.score : score // ignore: cast_nullable_to_non_nullable
as double,weight: null == weight ? _self.weight : weight // ignore: cast_nullable_to_non_nullable
as double,label: null == label ? _self.label : label // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$FeasibilityMetrics {

 FeasibilityCriterion get geo; FeasibilityCriterion get time; FeasibilityCriterion get budget; FeasibilityCriterion get preference; FeasibilityCriterion get diversity;
/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeasibilityMetricsCopyWith<FeasibilityMetrics> get copyWith => _$FeasibilityMetricsCopyWithImpl<FeasibilityMetrics>(this as FeasibilityMetrics, _$identity);

  /// Serializes this FeasibilityMetrics to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FeasibilityMetrics;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeasibilityMetrics&&(identical(other.geo, _this.geo) || other.geo == _this.geo)&&(identical(other.time, _this.time) || other.time == _this.time)&&(identical(other.budget, _this.budget) || other.budget == _this.budget)&&(identical(other.preference, _this.preference) || other.preference == _this.preference)&&(identical(other.diversity, _this.diversity) || other.diversity == _this.diversity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FeasibilityMetrics;
  return Object.hash(runtimeType,_this.geo,_this.time,_this.budget,_this.preference,_this.diversity);
}

@override
String toString() {
  final _this = this as FeasibilityMetrics;
  return 'FeasibilityMetrics(geo: ${_this.geo}, time: ${_this.time}, budget: ${_this.budget}, preference: ${_this.preference}, diversity: ${_this.diversity})';
}


}

/// @nodoc
abstract mixin class $FeasibilityMetricsCopyWith<$Res>  {
  factory $FeasibilityMetricsCopyWith(FeasibilityMetrics value, $Res Function(FeasibilityMetrics) _then) = _$FeasibilityMetricsCopyWithImpl;
@useResult
$Res call({
 FeasibilityCriterion geo, FeasibilityCriterion time, FeasibilityCriterion budget, FeasibilityCriterion preference, FeasibilityCriterion diversity
});


$FeasibilityCriterionCopyWith<$Res> get geo;$FeasibilityCriterionCopyWith<$Res> get time;$FeasibilityCriterionCopyWith<$Res> get budget;$FeasibilityCriterionCopyWith<$Res> get preference;$FeasibilityCriterionCopyWith<$Res> get diversity;

}
/// @nodoc
class _$FeasibilityMetricsCopyWithImpl<$Res>
    implements $FeasibilityMetricsCopyWith<$Res> {
  _$FeasibilityMetricsCopyWithImpl(this._self, this._then);

  final FeasibilityMetrics _self;
  final $Res Function(FeasibilityMetrics) _then;

/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? geo = null,Object? time = null,Object? budget = null,Object? preference = null,Object? diversity = null,}) {
  return _then(FeasibilityMetrics(
geo: null == geo ? _self.geo : geo // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,time: null == time ? _self.time : time // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,budget: null == budget ? _self.budget : budget // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,preference: null == preference ? _self.preference : preference // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,diversity: null == diversity ? _self.diversity : diversity // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,
  ));
}
/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get geo {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.geo, (value) {
    return _then(_self.copyWith(geo: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get time {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.time, (value) {
    return _then(_self.copyWith(time: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get budget {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.budget, (value) {
    return _then(_self.copyWith(budget: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get preference {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.preference, (value) {
    return _then(_self.copyWith(preference: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get diversity {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.diversity, (value) {
    return _then(_self.copyWith(diversity: value));
  });
}
}


/// Adds pattern-matching-related methods to [FeasibilityMetrics].
extension FeasibilityMetricsPatterns on FeasibilityMetrics {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeasibilityMetrics value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeasibilityMetrics() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeasibilityMetrics value)  $default,){
final _that = this;
switch (_that) {
case _FeasibilityMetrics():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeasibilityMetrics value)?  $default,){
final _that = this;
switch (_that) {
case _FeasibilityMetrics() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( FeasibilityCriterion geo,  FeasibilityCriterion time,  FeasibilityCriterion budget,  FeasibilityCriterion preference,  FeasibilityCriterion diversity)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeasibilityMetrics() when $default != null:
return $default(_that.geo,_that.time,_that.budget,_that.preference,_that.diversity);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( FeasibilityCriterion geo,  FeasibilityCriterion time,  FeasibilityCriterion budget,  FeasibilityCriterion preference,  FeasibilityCriterion diversity)  $default,) {final _that = this;
switch (_that) {
case _FeasibilityMetrics():
return $default(_that.geo,_that.time,_that.budget,_that.preference,_that.diversity);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( FeasibilityCriterion geo,  FeasibilityCriterion time,  FeasibilityCriterion budget,  FeasibilityCriterion preference,  FeasibilityCriterion diversity)?  $default,) {final _that = this;
switch (_that) {
case _FeasibilityMetrics() when $default != null:
return $default(_that.geo,_that.time,_that.budget,_that.preference,_that.diversity);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FeasibilityMetrics implements FeasibilityMetrics {
  const _FeasibilityMetrics({required this.geo, required this.time, required this.budget, required this.preference, required this.diversity});
  factory _FeasibilityMetrics.fromJson(Map<String, dynamic> json) => _$FeasibilityMetricsFromJson(json);

@override final  FeasibilityCriterion geo;
@override final  FeasibilityCriterion time;
@override final  FeasibilityCriterion budget;
@override final  FeasibilityCriterion preference;
@override final  FeasibilityCriterion diversity;

/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeasibilityMetricsCopyWith<_FeasibilityMetrics> get copyWith => __$FeasibilityMetricsCopyWithImpl<_FeasibilityMetrics>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FeasibilityMetricsToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeasibilityMetrics&&(identical(other.geo, geo) || other.geo == geo)&&(identical(other.time, time) || other.time == time)&&(identical(other.budget, budget) || other.budget == budget)&&(identical(other.preference, preference) || other.preference == preference)&&(identical(other.diversity, diversity) || other.diversity == diversity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,geo,time,budget,preference,diversity);
}

@override
String toString() {
    return 'FeasibilityMetrics(geo: $geo, time: $time, budget: $budget, preference: $preference, diversity: $diversity)';
}


}

/// @nodoc
abstract mixin class _$FeasibilityMetricsCopyWith<$Res> implements $FeasibilityMetricsCopyWith<$Res> {
  factory _$FeasibilityMetricsCopyWith(_FeasibilityMetrics value, $Res Function(_FeasibilityMetrics) _then) = __$FeasibilityMetricsCopyWithImpl;
@override @useResult
$Res call({
 FeasibilityCriterion geo, FeasibilityCriterion time, FeasibilityCriterion budget, FeasibilityCriterion preference, FeasibilityCriterion diversity
});


@override $FeasibilityCriterionCopyWith<$Res> get geo;@override $FeasibilityCriterionCopyWith<$Res> get time;@override $FeasibilityCriterionCopyWith<$Res> get budget;@override $FeasibilityCriterionCopyWith<$Res> get preference;@override $FeasibilityCriterionCopyWith<$Res> get diversity;

}
/// @nodoc
class __$FeasibilityMetricsCopyWithImpl<$Res>
    implements _$FeasibilityMetricsCopyWith<$Res> {
  __$FeasibilityMetricsCopyWithImpl(this._self, this._then);

  final _FeasibilityMetrics _self;
  final $Res Function(_FeasibilityMetrics) _then;

/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? geo = null,Object? time = null,Object? budget = null,Object? preference = null,Object? diversity = null,}) {
  return _then(_FeasibilityMetrics(
geo: null == geo ? _self.geo : geo // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,time: null == time ? _self.time : time // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,budget: null == budget ? _self.budget : budget // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,preference: null == preference ? _self.preference : preference // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,diversity: null == diversity ? _self.diversity : diversity // ignore: cast_nullable_to_non_nullable
as FeasibilityCriterion,
  ));
}

/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get geo {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.geo, (value) {
    return _then(_self.copyWith(geo: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get time {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.time, (value) {
    return _then(_self.copyWith(time: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get budget {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.budget, (value) {
    return _then(_self.copyWith(budget: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get preference {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.preference, (value) {
    return _then(_self.copyWith(preference: value));
  });
}/// Create a copy of FeasibilityMetrics
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityCriterionCopyWith<$Res> get diversity {
  
  return $FeasibilityCriterionCopyWith<$Res>(_self.diversity, (value) {
    return _then(_self.copyWith(diversity: value));
  });
}
}


/// @nodoc
mixin _$FeasibilityWarning {

 String get type; String get category; int? get dayNumber; String get message;
/// Create a copy of FeasibilityWarning
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeasibilityWarningCopyWith<FeasibilityWarning> get copyWith => _$FeasibilityWarningCopyWithImpl<FeasibilityWarning>(this as FeasibilityWarning, _$identity);

  /// Serializes this FeasibilityWarning to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FeasibilityWarning;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeasibilityWarning&&(identical(other.type, _this.type) || other.type == _this.type)&&(identical(other.category, _this.category) || other.category == _this.category)&&(identical(other.dayNumber, _this.dayNumber) || other.dayNumber == _this.dayNumber)&&(identical(other.message, _this.message) || other.message == _this.message));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FeasibilityWarning;
  return Object.hash(runtimeType,_this.type,_this.category,_this.dayNumber,_this.message);
}

@override
String toString() {
  final _this = this as FeasibilityWarning;
  return 'FeasibilityWarning(type: ${_this.type}, category: ${_this.category}, dayNumber: ${_this.dayNumber}, message: ${_this.message})';
}


}

/// @nodoc
abstract mixin class $FeasibilityWarningCopyWith<$Res>  {
  factory $FeasibilityWarningCopyWith(FeasibilityWarning value, $Res Function(FeasibilityWarning) _then) = _$FeasibilityWarningCopyWithImpl;
@useResult
$Res call({
 String type, String category, int? dayNumber, String message
});




}
/// @nodoc
class _$FeasibilityWarningCopyWithImpl<$Res>
    implements $FeasibilityWarningCopyWith<$Res> {
  _$FeasibilityWarningCopyWithImpl(this._self, this._then);

  final FeasibilityWarning _self;
  final $Res Function(FeasibilityWarning) _then;

/// Create a copy of FeasibilityWarning
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? type = null,Object? category = null,Object? dayNumber = freezed,Object? message = null,}) {
  return _then(FeasibilityWarning(
type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,dayNumber: freezed == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int?,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [FeasibilityWarning].
extension FeasibilityWarningPatterns on FeasibilityWarning {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeasibilityWarning value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeasibilityWarning() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeasibilityWarning value)  $default,){
final _that = this;
switch (_that) {
case _FeasibilityWarning():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeasibilityWarning value)?  $default,){
final _that = this;
switch (_that) {
case _FeasibilityWarning() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String type,  String category,  int? dayNumber,  String message)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeasibilityWarning() when $default != null:
return $default(_that.type,_that.category,_that.dayNumber,_that.message);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String type,  String category,  int? dayNumber,  String message)  $default,) {final _that = this;
switch (_that) {
case _FeasibilityWarning():
return $default(_that.type,_that.category,_that.dayNumber,_that.message);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String type,  String category,  int? dayNumber,  String message)?  $default,) {final _that = this;
switch (_that) {
case _FeasibilityWarning() when $default != null:
return $default(_that.type,_that.category,_that.dayNumber,_that.message);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FeasibilityWarning implements FeasibilityWarning {
  const _FeasibilityWarning({required this.type, required this.category, this.dayNumber, required this.message});
  factory _FeasibilityWarning.fromJson(Map<String, dynamic> json) => _$FeasibilityWarningFromJson(json);

@override final  String type;
@override final  String category;
@override final  int? dayNumber;
@override final  String message;

/// Create a copy of FeasibilityWarning
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeasibilityWarningCopyWith<_FeasibilityWarning> get copyWith => __$FeasibilityWarningCopyWithImpl<_FeasibilityWarning>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FeasibilityWarningToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeasibilityWarning&&(identical(other.type, type) || other.type == type)&&(identical(other.category, category) || other.category == category)&&(identical(other.dayNumber, dayNumber) || other.dayNumber == dayNumber)&&(identical(other.message, message) || other.message == message));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,type,category,dayNumber,message);
}

@override
String toString() {
    return 'FeasibilityWarning(type: $type, category: $category, dayNumber: $dayNumber, message: $message)';
}


}

/// @nodoc
abstract mixin class _$FeasibilityWarningCopyWith<$Res> implements $FeasibilityWarningCopyWith<$Res> {
  factory _$FeasibilityWarningCopyWith(_FeasibilityWarning value, $Res Function(_FeasibilityWarning) _then) = __$FeasibilityWarningCopyWithImpl;
@override @useResult
$Res call({
 String type, String category, int? dayNumber, String message
});




}
/// @nodoc
class __$FeasibilityWarningCopyWithImpl<$Res>
    implements _$FeasibilityWarningCopyWith<$Res> {
  __$FeasibilityWarningCopyWithImpl(this._self, this._then);

  final _FeasibilityWarning _self;
  final $Res Function(_FeasibilityWarning) _then;

/// Create a copy of FeasibilityWarning
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? type = null,Object? category = null,Object? dayNumber = freezed,Object? message = null,}) {
  return _then(_FeasibilityWarning(
type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,dayNumber: freezed == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int?,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$FeasibilityDayDetail {

 int get dayNumber; int get placesCount; double get distanceKm; double get estimatedTransitTimeHours; int get dayCost; List<String> get warnings;
/// Create a copy of FeasibilityDayDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeasibilityDayDetailCopyWith<FeasibilityDayDetail> get copyWith => _$FeasibilityDayDetailCopyWithImpl<FeasibilityDayDetail>(this as FeasibilityDayDetail, _$identity);

  /// Serializes this FeasibilityDayDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FeasibilityDayDetail;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeasibilityDayDetail&&(identical(other.dayNumber, _this.dayNumber) || other.dayNumber == _this.dayNumber)&&(identical(other.placesCount, _this.placesCount) || other.placesCount == _this.placesCount)&&(identical(other.distanceKm, _this.distanceKm) || other.distanceKm == _this.distanceKm)&&(identical(other.estimatedTransitTimeHours, _this.estimatedTransitTimeHours) || other.estimatedTransitTimeHours == _this.estimatedTransitTimeHours)&&(identical(other.dayCost, _this.dayCost) || other.dayCost == _this.dayCost)&&const DeepCollectionEquality().equals(other.warnings, _this.warnings));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FeasibilityDayDetail;
  return Object.hash(runtimeType,_this.dayNumber,_this.placesCount,_this.distanceKm,_this.estimatedTransitTimeHours,_this.dayCost,const DeepCollectionEquality().hash(_this.warnings));
}

@override
String toString() {
  final _this = this as FeasibilityDayDetail;
  return 'FeasibilityDayDetail(dayNumber: ${_this.dayNumber}, placesCount: ${_this.placesCount}, distanceKm: ${_this.distanceKm}, estimatedTransitTimeHours: ${_this.estimatedTransitTimeHours}, dayCost: ${_this.dayCost}, warnings: ${_this.warnings})';
}


}

/// @nodoc
abstract mixin class $FeasibilityDayDetailCopyWith<$Res>  {
  factory $FeasibilityDayDetailCopyWith(FeasibilityDayDetail value, $Res Function(FeasibilityDayDetail) _then) = _$FeasibilityDayDetailCopyWithImpl;
@useResult
$Res call({
 int dayNumber, int placesCount, double distanceKm, double estimatedTransitTimeHours, int dayCost, List<String> warnings
});




}
/// @nodoc
class _$FeasibilityDayDetailCopyWithImpl<$Res>
    implements $FeasibilityDayDetailCopyWith<$Res> {
  _$FeasibilityDayDetailCopyWithImpl(this._self, this._then);

  final FeasibilityDayDetail _self;
  final $Res Function(FeasibilityDayDetail) _then;

/// Create a copy of FeasibilityDayDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? dayNumber = null,Object? placesCount = null,Object? distanceKm = null,Object? estimatedTransitTimeHours = null,Object? dayCost = null,Object? warnings = null,}) {
  return _then(FeasibilityDayDetail(
dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,placesCount: null == placesCount ? _self.placesCount : placesCount // ignore: cast_nullable_to_non_nullable
as int,distanceKm: null == distanceKm ? _self.distanceKm : distanceKm // ignore: cast_nullable_to_non_nullable
as double,estimatedTransitTimeHours: null == estimatedTransitTimeHours ? _self.estimatedTransitTimeHours : estimatedTransitTimeHours // ignore: cast_nullable_to_non_nullable
as double,dayCost: null == dayCost ? _self.dayCost : dayCost // ignore: cast_nullable_to_non_nullable
as int,warnings: null == warnings ? _self.warnings : warnings // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [FeasibilityDayDetail].
extension FeasibilityDayDetailPatterns on FeasibilityDayDetail {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeasibilityDayDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeasibilityDayDetail() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeasibilityDayDetail value)  $default,){
final _that = this;
switch (_that) {
case _FeasibilityDayDetail():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeasibilityDayDetail value)?  $default,){
final _that = this;
switch (_that) {
case _FeasibilityDayDetail() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int dayNumber,  int placesCount,  double distanceKm,  double estimatedTransitTimeHours,  int dayCost,  List<String> warnings)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeasibilityDayDetail() when $default != null:
return $default(_that.dayNumber,_that.placesCount,_that.distanceKm,_that.estimatedTransitTimeHours,_that.dayCost,_that.warnings);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int dayNumber,  int placesCount,  double distanceKm,  double estimatedTransitTimeHours,  int dayCost,  List<String> warnings)  $default,) {final _that = this;
switch (_that) {
case _FeasibilityDayDetail():
return $default(_that.dayNumber,_that.placesCount,_that.distanceKm,_that.estimatedTransitTimeHours,_that.dayCost,_that.warnings);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int dayNumber,  int placesCount,  double distanceKm,  double estimatedTransitTimeHours,  int dayCost,  List<String> warnings)?  $default,) {final _that = this;
switch (_that) {
case _FeasibilityDayDetail() when $default != null:
return $default(_that.dayNumber,_that.placesCount,_that.distanceKm,_that.estimatedTransitTimeHours,_that.dayCost,_that.warnings);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FeasibilityDayDetail implements FeasibilityDayDetail {
  const _FeasibilityDayDetail({required this.dayNumber, this.placesCount = 0, this.distanceKm = 0.0, this.estimatedTransitTimeHours = 0.0, this.dayCost = 0,  List<String> warnings = const []}): _warnings = warnings;
  factory _FeasibilityDayDetail.fromJson(Map<String, dynamic> json) => _$FeasibilityDayDetailFromJson(json);

@override final  int dayNumber;
@override@JsonKey() final  int placesCount;
@override@JsonKey() final  double distanceKm;
@override@JsonKey() final  double estimatedTransitTimeHours;
@override@JsonKey() final  int dayCost;
 final  List<String> _warnings;
@override@JsonKey() List<String> get warnings {
  if (_warnings is EqualUnmodifiableListView) return _warnings;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_warnings);
}


/// Create a copy of FeasibilityDayDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeasibilityDayDetailCopyWith<_FeasibilityDayDetail> get copyWith => __$FeasibilityDayDetailCopyWithImpl<_FeasibilityDayDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FeasibilityDayDetailToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeasibilityDayDetail&&(identical(other.dayNumber, dayNumber) || other.dayNumber == dayNumber)&&(identical(other.placesCount, placesCount) || other.placesCount == placesCount)&&(identical(other.distanceKm, distanceKm) || other.distanceKm == distanceKm)&&(identical(other.estimatedTransitTimeHours, estimatedTransitTimeHours) || other.estimatedTransitTimeHours == estimatedTransitTimeHours)&&(identical(other.dayCost, dayCost) || other.dayCost == dayCost)&&const DeepCollectionEquality().equals(other.warnings, _warnings));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,dayNumber,placesCount,distanceKm,estimatedTransitTimeHours,dayCost,const DeepCollectionEquality().hash(_warnings));
}

@override
String toString() {
    return 'FeasibilityDayDetail(dayNumber: $dayNumber, placesCount: $placesCount, distanceKm: $distanceKm, estimatedTransitTimeHours: $estimatedTransitTimeHours, dayCost: $dayCost, warnings: $warnings)';
}


}

/// @nodoc
abstract mixin class _$FeasibilityDayDetailCopyWith<$Res> implements $FeasibilityDayDetailCopyWith<$Res> {
  factory _$FeasibilityDayDetailCopyWith(_FeasibilityDayDetail value, $Res Function(_FeasibilityDayDetail) _then) = __$FeasibilityDayDetailCopyWithImpl;
@override @useResult
$Res call({
 int dayNumber, int placesCount, double distanceKm, double estimatedTransitTimeHours, int dayCost, List<String> warnings
});




}
/// @nodoc
class __$FeasibilityDayDetailCopyWithImpl<$Res>
    implements _$FeasibilityDayDetailCopyWith<$Res> {
  __$FeasibilityDayDetailCopyWithImpl(this._self, this._then);

  final _FeasibilityDayDetail _self;
  final $Res Function(_FeasibilityDayDetail) _then;

/// Create a copy of FeasibilityDayDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? dayNumber = null,Object? placesCount = null,Object? distanceKm = null,Object? estimatedTransitTimeHours = null,Object? dayCost = null,Object? warnings = null,}) {
  return _then(_FeasibilityDayDetail(
dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,placesCount: null == placesCount ? _self.placesCount : placesCount // ignore: cast_nullable_to_non_nullable
as int,distanceKm: null == distanceKm ? _self.distanceKm : distanceKm // ignore: cast_nullable_to_non_nullable
as double,estimatedTransitTimeHours: null == estimatedTransitTimeHours ? _self.estimatedTransitTimeHours : estimatedTransitTimeHours // ignore: cast_nullable_to_non_nullable
as double,dayCost: null == dayCost ? _self.dayCost : dayCost // ignore: cast_nullable_to_non_nullable
as int,warnings: null == warnings ? _self._warnings : warnings // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}


/// @nodoc
mixin _$FeasibilityReport {

 double get overallScore; String get rating; FeasibilityMetrics get metrics; List<FeasibilityWarning> get warnings; List<FeasibilityDayDetail> get dayDetails; double get totalDistanceKm; double get totalTransitTimeHours; String? get evaluatedAt;
/// Create a copy of FeasibilityReport
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FeasibilityReportCopyWith<FeasibilityReport> get copyWith => _$FeasibilityReportCopyWithImpl<FeasibilityReport>(this as FeasibilityReport, _$identity);

  /// Serializes this FeasibilityReport to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as FeasibilityReport;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FeasibilityReport&&(identical(other.overallScore, _this.overallScore) || other.overallScore == _this.overallScore)&&(identical(other.rating, _this.rating) || other.rating == _this.rating)&&(identical(other.metrics, _this.metrics) || other.metrics == _this.metrics)&&const DeepCollectionEquality().equals(other.warnings, _this.warnings)&&const DeepCollectionEquality().equals(other.dayDetails, _this.dayDetails)&&(identical(other.totalDistanceKm, _this.totalDistanceKm) || other.totalDistanceKm == _this.totalDistanceKm)&&(identical(other.totalTransitTimeHours, _this.totalTransitTimeHours) || other.totalTransitTimeHours == _this.totalTransitTimeHours)&&(identical(other.evaluatedAt, _this.evaluatedAt) || other.evaluatedAt == _this.evaluatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as FeasibilityReport;
  return Object.hash(runtimeType,_this.overallScore,_this.rating,_this.metrics,const DeepCollectionEquality().hash(_this.warnings),const DeepCollectionEquality().hash(_this.dayDetails),_this.totalDistanceKm,_this.totalTransitTimeHours,_this.evaluatedAt);
}

@override
String toString() {
  final _this = this as FeasibilityReport;
  return 'FeasibilityReport(overallScore: ${_this.overallScore}, rating: ${_this.rating}, metrics: ${_this.metrics}, warnings: ${_this.warnings}, dayDetails: ${_this.dayDetails}, totalDistanceKm: ${_this.totalDistanceKm}, totalTransitTimeHours: ${_this.totalTransitTimeHours}, evaluatedAt: ${_this.evaluatedAt})';
}


}

/// @nodoc
abstract mixin class $FeasibilityReportCopyWith<$Res>  {
  factory $FeasibilityReportCopyWith(FeasibilityReport value, $Res Function(FeasibilityReport) _then) = _$FeasibilityReportCopyWithImpl;
@useResult
$Res call({
 double overallScore, String rating, FeasibilityMetrics metrics, List<FeasibilityWarning> warnings, List<FeasibilityDayDetail> dayDetails, double totalDistanceKm, double totalTransitTimeHours, String? evaluatedAt
});


$FeasibilityMetricsCopyWith<$Res> get metrics;

}
/// @nodoc
class _$FeasibilityReportCopyWithImpl<$Res>
    implements $FeasibilityReportCopyWith<$Res> {
  _$FeasibilityReportCopyWithImpl(this._self, this._then);

  final FeasibilityReport _self;
  final $Res Function(FeasibilityReport) _then;

/// Create a copy of FeasibilityReport
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? overallScore = null,Object? rating = null,Object? metrics = null,Object? warnings = null,Object? dayDetails = null,Object? totalDistanceKm = null,Object? totalTransitTimeHours = null,Object? evaluatedAt = freezed,}) {
  return _then(FeasibilityReport(
overallScore: null == overallScore ? _self.overallScore : overallScore // ignore: cast_nullable_to_non_nullable
as double,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as String,metrics: null == metrics ? _self.metrics : metrics // ignore: cast_nullable_to_non_nullable
as FeasibilityMetrics,warnings: null == warnings ? _self.warnings : warnings // ignore: cast_nullable_to_non_nullable
as List<FeasibilityWarning>,dayDetails: null == dayDetails ? _self.dayDetails : dayDetails // ignore: cast_nullable_to_non_nullable
as List<FeasibilityDayDetail>,totalDistanceKm: null == totalDistanceKm ? _self.totalDistanceKm : totalDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalTransitTimeHours: null == totalTransitTimeHours ? _self.totalTransitTimeHours : totalTransitTimeHours // ignore: cast_nullable_to_non_nullable
as double,evaluatedAt: freezed == evaluatedAt ? _self.evaluatedAt : evaluatedAt // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}
/// Create a copy of FeasibilityReport
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityMetricsCopyWith<$Res> get metrics {
  
  return $FeasibilityMetricsCopyWith<$Res>(_self.metrics, (value) {
    return _then(_self.copyWith(metrics: value));
  });
}
}


/// Adds pattern-matching-related methods to [FeasibilityReport].
extension FeasibilityReportPatterns on FeasibilityReport {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FeasibilityReport value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FeasibilityReport() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FeasibilityReport value)  $default,){
final _that = this;
switch (_that) {
case _FeasibilityReport():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FeasibilityReport value)?  $default,){
final _that = this;
switch (_that) {
case _FeasibilityReport() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( double overallScore,  String rating,  FeasibilityMetrics metrics,  List<FeasibilityWarning> warnings,  List<FeasibilityDayDetail> dayDetails,  double totalDistanceKm,  double totalTransitTimeHours,  String? evaluatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FeasibilityReport() when $default != null:
return $default(_that.overallScore,_that.rating,_that.metrics,_that.warnings,_that.dayDetails,_that.totalDistanceKm,_that.totalTransitTimeHours,_that.evaluatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( double overallScore,  String rating,  FeasibilityMetrics metrics,  List<FeasibilityWarning> warnings,  List<FeasibilityDayDetail> dayDetails,  double totalDistanceKm,  double totalTransitTimeHours,  String? evaluatedAt)  $default,) {final _that = this;
switch (_that) {
case _FeasibilityReport():
return $default(_that.overallScore,_that.rating,_that.metrics,_that.warnings,_that.dayDetails,_that.totalDistanceKm,_that.totalTransitTimeHours,_that.evaluatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( double overallScore,  String rating,  FeasibilityMetrics metrics,  List<FeasibilityWarning> warnings,  List<FeasibilityDayDetail> dayDetails,  double totalDistanceKm,  double totalTransitTimeHours,  String? evaluatedAt)?  $default,) {final _that = this;
switch (_that) {
case _FeasibilityReport() when $default != null:
return $default(_that.overallScore,_that.rating,_that.metrics,_that.warnings,_that.dayDetails,_that.totalDistanceKm,_that.totalTransitTimeHours,_that.evaluatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _FeasibilityReport implements FeasibilityReport {
  const _FeasibilityReport({this.overallScore = 0.0, this.rating = 'Khả thi', required this.metrics,  List<FeasibilityWarning> warnings = const [],  List<FeasibilityDayDetail> dayDetails = const [], this.totalDistanceKm = 0.0, this.totalTransitTimeHours = 0.0, this.evaluatedAt}): _warnings = warnings,_dayDetails = dayDetails;
  factory _FeasibilityReport.fromJson(Map<String, dynamic> json) => _$FeasibilityReportFromJson(json);

@override@JsonKey() final  double overallScore;
@override@JsonKey() final  String rating;
@override final  FeasibilityMetrics metrics;
 final  List<FeasibilityWarning> _warnings;
@override@JsonKey() List<FeasibilityWarning> get warnings {
  if (_warnings is EqualUnmodifiableListView) return _warnings;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_warnings);
}

 final  List<FeasibilityDayDetail> _dayDetails;
@override@JsonKey() List<FeasibilityDayDetail> get dayDetails {
  if (_dayDetails is EqualUnmodifiableListView) return _dayDetails;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_dayDetails);
}

@override@JsonKey() final  double totalDistanceKm;
@override@JsonKey() final  double totalTransitTimeHours;
@override final  String? evaluatedAt;

/// Create a copy of FeasibilityReport
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FeasibilityReportCopyWith<_FeasibilityReport> get copyWith => __$FeasibilityReportCopyWithImpl<_FeasibilityReport>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FeasibilityReportToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _FeasibilityReport&&(identical(other.overallScore, overallScore) || other.overallScore == overallScore)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.metrics, metrics) || other.metrics == metrics)&&const DeepCollectionEquality().equals(other.warnings, _warnings)&&const DeepCollectionEquality().equals(other.dayDetails, _dayDetails)&&(identical(other.totalDistanceKm, totalDistanceKm) || other.totalDistanceKm == totalDistanceKm)&&(identical(other.totalTransitTimeHours, totalTransitTimeHours) || other.totalTransitTimeHours == totalTransitTimeHours)&&(identical(other.evaluatedAt, evaluatedAt) || other.evaluatedAt == evaluatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,overallScore,rating,metrics,const DeepCollectionEquality().hash(_warnings),const DeepCollectionEquality().hash(_dayDetails),totalDistanceKm,totalTransitTimeHours,evaluatedAt);
}

@override
String toString() {
    return 'FeasibilityReport(overallScore: $overallScore, rating: $rating, metrics: $metrics, warnings: $warnings, dayDetails: $dayDetails, totalDistanceKm: $totalDistanceKm, totalTransitTimeHours: $totalTransitTimeHours, evaluatedAt: $evaluatedAt)';
}


}

/// @nodoc
abstract mixin class _$FeasibilityReportCopyWith<$Res> implements $FeasibilityReportCopyWith<$Res> {
  factory _$FeasibilityReportCopyWith(_FeasibilityReport value, $Res Function(_FeasibilityReport) _then) = __$FeasibilityReportCopyWithImpl;
@override @useResult
$Res call({
 double overallScore, String rating, FeasibilityMetrics metrics, List<FeasibilityWarning> warnings, List<FeasibilityDayDetail> dayDetails, double totalDistanceKm, double totalTransitTimeHours, String? evaluatedAt
});


@override $FeasibilityMetricsCopyWith<$Res> get metrics;

}
/// @nodoc
class __$FeasibilityReportCopyWithImpl<$Res>
    implements _$FeasibilityReportCopyWith<$Res> {
  __$FeasibilityReportCopyWithImpl(this._self, this._then);

  final _FeasibilityReport _self;
  final $Res Function(_FeasibilityReport) _then;

/// Create a copy of FeasibilityReport
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? overallScore = null,Object? rating = null,Object? metrics = null,Object? warnings = null,Object? dayDetails = null,Object? totalDistanceKm = null,Object? totalTransitTimeHours = null,Object? evaluatedAt = freezed,}) {
  return _then(_FeasibilityReport(
overallScore: null == overallScore ? _self.overallScore : overallScore // ignore: cast_nullable_to_non_nullable
as double,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as String,metrics: null == metrics ? _self.metrics : metrics // ignore: cast_nullable_to_non_nullable
as FeasibilityMetrics,warnings: null == warnings ? _self._warnings : warnings // ignore: cast_nullable_to_non_nullable
as List<FeasibilityWarning>,dayDetails: null == dayDetails ? _self._dayDetails : dayDetails // ignore: cast_nullable_to_non_nullable
as List<FeasibilityDayDetail>,totalDistanceKm: null == totalDistanceKm ? _self.totalDistanceKm : totalDistanceKm // ignore: cast_nullable_to_non_nullable
as double,totalTransitTimeHours: null == totalTransitTimeHours ? _self.totalTransitTimeHours : totalTransitTimeHours // ignore: cast_nullable_to_non_nullable
as double,evaluatedAt: freezed == evaluatedAt ? _self.evaluatedAt : evaluatedAt // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

/// Create a copy of FeasibilityReport
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityMetricsCopyWith<$Res> get metrics {
  
  return $FeasibilityMetricsCopyWith<$Res>(_self.metrics, (value) {
    return _then(_self.copyWith(metrics: value));
  });
}
}


/// @nodoc
mixin _$DayPlan {

 int get dayNumber; String get date; List<ItineraryPlace> get places; String? get notes; DayOptimizationStats? get optimizationStats;
/// Create a copy of DayPlan
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DayPlanCopyWith<DayPlan> get copyWith => _$DayPlanCopyWithImpl<DayPlan>(this as DayPlan, _$identity);

  /// Serializes this DayPlan to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as DayPlan;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DayPlan&&(identical(other.dayNumber, _this.dayNumber) || other.dayNumber == _this.dayNumber)&&(identical(other.date, _this.date) || other.date == _this.date)&&const DeepCollectionEquality().equals(other.places, _this.places)&&(identical(other.notes, _this.notes) || other.notes == _this.notes)&&(identical(other.optimizationStats, _this.optimizationStats) || other.optimizationStats == _this.optimizationStats));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as DayPlan;
  return Object.hash(runtimeType,_this.dayNumber,_this.date,const DeepCollectionEquality().hash(_this.places),_this.notes,_this.optimizationStats);
}

@override
String toString() {
  final _this = this as DayPlan;
  return 'DayPlan(dayNumber: ${_this.dayNumber}, date: ${_this.date}, places: ${_this.places}, notes: ${_this.notes}, optimizationStats: ${_this.optimizationStats})';
}


}

/// @nodoc
abstract mixin class $DayPlanCopyWith<$Res>  {
  factory $DayPlanCopyWith(DayPlan value, $Res Function(DayPlan) _then) = _$DayPlanCopyWithImpl;
@useResult
$Res call({
 int dayNumber, String date, List<ItineraryPlace> places, String? notes, DayOptimizationStats? optimizationStats
});


$DayOptimizationStatsCopyWith<$Res>? get optimizationStats;

}
/// @nodoc
class _$DayPlanCopyWithImpl<$Res>
    implements $DayPlanCopyWith<$Res> {
  _$DayPlanCopyWithImpl(this._self, this._then);

  final DayPlan _self;
  final $Res Function(DayPlan) _then;

/// Create a copy of DayPlan
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? dayNumber = null,Object? date = null,Object? places = null,Object? notes = freezed,Object? optimizationStats = freezed,}) {
  return _then(DayPlan(
dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,places: null == places ? _self.places : places // ignore: cast_nullable_to_non_nullable
as List<ItineraryPlace>,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,optimizationStats: freezed == optimizationStats ? _self.optimizationStats : optimizationStats // ignore: cast_nullable_to_non_nullable
as DayOptimizationStats?,
  ));
}
/// Create a copy of DayPlan
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$DayOptimizationStatsCopyWith<$Res>? get optimizationStats {
    if (_self.optimizationStats == null) {
    return null;
  }

  return $DayOptimizationStatsCopyWith<$Res>(_self.optimizationStats!, (value) {
    return _then(_self.copyWith(optimizationStats: value));
  });
}
}


/// Adds pattern-matching-related methods to [DayPlan].
extension DayPlanPatterns on DayPlan {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DayPlan value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DayPlan() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DayPlan value)  $default,){
final _that = this;
switch (_that) {
case _DayPlan():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DayPlan value)?  $default,){
final _that = this;
switch (_that) {
case _DayPlan() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int dayNumber,  String date,  List<ItineraryPlace> places,  String? notes,  DayOptimizationStats? optimizationStats)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DayPlan() when $default != null:
return $default(_that.dayNumber,_that.date,_that.places,_that.notes,_that.optimizationStats);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int dayNumber,  String date,  List<ItineraryPlace> places,  String? notes,  DayOptimizationStats? optimizationStats)  $default,) {final _that = this;
switch (_that) {
case _DayPlan():
return $default(_that.dayNumber,_that.date,_that.places,_that.notes,_that.optimizationStats);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int dayNumber,  String date,  List<ItineraryPlace> places,  String? notes,  DayOptimizationStats? optimizationStats)?  $default,) {final _that = this;
switch (_that) {
case _DayPlan() when $default != null:
return $default(_that.dayNumber,_that.date,_that.places,_that.notes,_that.optimizationStats);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DayPlan implements DayPlan {
  const _DayPlan({required this.dayNumber, this.date = '',  List<ItineraryPlace> places = const [], this.notes, this.optimizationStats}): _places = places;
  factory _DayPlan.fromJson(Map<String, dynamic> json) => _$DayPlanFromJson(json);

@override final  int dayNumber;
@override@JsonKey() final  String date;
 final  List<ItineraryPlace> _places;
@override@JsonKey() List<ItineraryPlace> get places {
  if (_places is EqualUnmodifiableListView) return _places;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_places);
}

@override final  String? notes;
@override final  DayOptimizationStats? optimizationStats;

/// Create a copy of DayPlan
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DayPlanCopyWith<_DayPlan> get copyWith => __$DayPlanCopyWithImpl<_DayPlan>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DayPlanToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _DayPlan&&(identical(other.dayNumber, dayNumber) || other.dayNumber == dayNumber)&&(identical(other.date, date) || other.date == date)&&const DeepCollectionEquality().equals(other.places, _places)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.optimizationStats, optimizationStats) || other.optimizationStats == optimizationStats));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,dayNumber,date,const DeepCollectionEquality().hash(_places),notes,optimizationStats);
}

@override
String toString() {
    return 'DayPlan(dayNumber: $dayNumber, date: $date, places: $places, notes: $notes, optimizationStats: $optimizationStats)';
}


}

/// @nodoc
abstract mixin class _$DayPlanCopyWith<$Res> implements $DayPlanCopyWith<$Res> {
  factory _$DayPlanCopyWith(_DayPlan value, $Res Function(_DayPlan) _then) = __$DayPlanCopyWithImpl;
@override @useResult
$Res call({
 int dayNumber, String date, List<ItineraryPlace> places, String? notes, DayOptimizationStats? optimizationStats
});


@override $DayOptimizationStatsCopyWith<$Res>? get optimizationStats;

}
/// @nodoc
class __$DayPlanCopyWithImpl<$Res>
    implements _$DayPlanCopyWith<$Res> {
  __$DayPlanCopyWithImpl(this._self, this._then);

  final _DayPlan _self;
  final $Res Function(_DayPlan) _then;

/// Create a copy of DayPlan
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? dayNumber = null,Object? date = null,Object? places = null,Object? notes = freezed,Object? optimizationStats = freezed,}) {
  return _then(_DayPlan(
dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,places: null == places ? _self._places : places // ignore: cast_nullable_to_non_nullable
as List<ItineraryPlace>,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,optimizationStats: freezed == optimizationStats ? _self.optimizationStats : optimizationStats // ignore: cast_nullable_to_non_nullable
as DayOptimizationStats?,
  ));
}

/// Create a copy of DayPlan
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$DayOptimizationStatsCopyWith<$Res>? get optimizationStats {
    if (_self.optimizationStats == null) {
    return null;
  }

  return $DayOptimizationStatsCopyWith<$Res>(_self.optimizationStats!, (value) {
    return _then(_self.copyWith(optimizationStats: value));
  });
}
}


/// @nodoc
mixin _$TripItinerary {

 List<DayPlan> get days; String get summary; double get totalEstimatedCost; TripOptimizationStats? get optimizationStats; FeasibilityReport? get feasibilityReport;
/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TripItineraryCopyWith<TripItinerary> get copyWith => _$TripItineraryCopyWithImpl<TripItinerary>(this as TripItinerary, _$identity);

  /// Serializes this TripItinerary to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as TripItinerary;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TripItinerary&&const DeepCollectionEquality().equals(other.days, _this.days)&&(identical(other.summary, _this.summary) || other.summary == _this.summary)&&(identical(other.totalEstimatedCost, _this.totalEstimatedCost) || other.totalEstimatedCost == _this.totalEstimatedCost)&&(identical(other.optimizationStats, _this.optimizationStats) || other.optimizationStats == _this.optimizationStats)&&(identical(other.feasibilityReport, _this.feasibilityReport) || other.feasibilityReport == _this.feasibilityReport));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as TripItinerary;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.days),_this.summary,_this.totalEstimatedCost,_this.optimizationStats,_this.feasibilityReport);
}

@override
String toString() {
  final _this = this as TripItinerary;
  return 'TripItinerary(days: ${_this.days}, summary: ${_this.summary}, totalEstimatedCost: ${_this.totalEstimatedCost}, optimizationStats: ${_this.optimizationStats}, feasibilityReport: ${_this.feasibilityReport})';
}


}

/// @nodoc
abstract mixin class $TripItineraryCopyWith<$Res>  {
  factory $TripItineraryCopyWith(TripItinerary value, $Res Function(TripItinerary) _then) = _$TripItineraryCopyWithImpl;
@useResult
$Res call({
 List<DayPlan> days, String summary, double totalEstimatedCost, TripOptimizationStats? optimizationStats, FeasibilityReport? feasibilityReport
});


$TripOptimizationStatsCopyWith<$Res>? get optimizationStats;$FeasibilityReportCopyWith<$Res>? get feasibilityReport;

}
/// @nodoc
class _$TripItineraryCopyWithImpl<$Res>
    implements $TripItineraryCopyWith<$Res> {
  _$TripItineraryCopyWithImpl(this._self, this._then);

  final TripItinerary _self;
  final $Res Function(TripItinerary) _then;

/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? days = null,Object? summary = null,Object? totalEstimatedCost = null,Object? optimizationStats = freezed,Object? feasibilityReport = freezed,}) {
  return _then(TripItinerary(
days: null == days ? _self.days : days // ignore: cast_nullable_to_non_nullable
as List<DayPlan>,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as String,totalEstimatedCost: null == totalEstimatedCost ? _self.totalEstimatedCost : totalEstimatedCost // ignore: cast_nullable_to_non_nullable
as double,optimizationStats: freezed == optimizationStats ? _self.optimizationStats : optimizationStats // ignore: cast_nullable_to_non_nullable
as TripOptimizationStats?,feasibilityReport: freezed == feasibilityReport ? _self.feasibilityReport : feasibilityReport // ignore: cast_nullable_to_non_nullable
as FeasibilityReport?,
  ));
}
/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TripOptimizationStatsCopyWith<$Res>? get optimizationStats {
    if (_self.optimizationStats == null) {
    return null;
  }

  return $TripOptimizationStatsCopyWith<$Res>(_self.optimizationStats!, (value) {
    return _then(_self.copyWith(optimizationStats: value));
  });
}/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityReportCopyWith<$Res>? get feasibilityReport {
    if (_self.feasibilityReport == null) {
    return null;
  }

  return $FeasibilityReportCopyWith<$Res>(_self.feasibilityReport!, (value) {
    return _then(_self.copyWith(feasibilityReport: value));
  });
}
}


/// Adds pattern-matching-related methods to [TripItinerary].
extension TripItineraryPatterns on TripItinerary {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TripItinerary value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TripItinerary() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TripItinerary value)  $default,){
final _that = this;
switch (_that) {
case _TripItinerary():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TripItinerary value)?  $default,){
final _that = this;
switch (_that) {
case _TripItinerary() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<DayPlan> days,  String summary,  double totalEstimatedCost,  TripOptimizationStats? optimizationStats,  FeasibilityReport? feasibilityReport)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TripItinerary() when $default != null:
return $default(_that.days,_that.summary,_that.totalEstimatedCost,_that.optimizationStats,_that.feasibilityReport);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<DayPlan> days,  String summary,  double totalEstimatedCost,  TripOptimizationStats? optimizationStats,  FeasibilityReport? feasibilityReport)  $default,) {final _that = this;
switch (_that) {
case _TripItinerary():
return $default(_that.days,_that.summary,_that.totalEstimatedCost,_that.optimizationStats,_that.feasibilityReport);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<DayPlan> days,  String summary,  double totalEstimatedCost,  TripOptimizationStats? optimizationStats,  FeasibilityReport? feasibilityReport)?  $default,) {final _that = this;
switch (_that) {
case _TripItinerary() when $default != null:
return $default(_that.days,_that.summary,_that.totalEstimatedCost,_that.optimizationStats,_that.feasibilityReport);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TripItinerary implements TripItinerary {
  const _TripItinerary({ List<DayPlan> days = const [], this.summary = '', this.totalEstimatedCost = 0.0, this.optimizationStats, this.feasibilityReport}): _days = days;
  factory _TripItinerary.fromJson(Map<String, dynamic> json) => _$TripItineraryFromJson(json);

 final  List<DayPlan> _days;
@override@JsonKey() List<DayPlan> get days {
  if (_days is EqualUnmodifiableListView) return _days;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_days);
}

@override@JsonKey() final  String summary;
@override@JsonKey() final  double totalEstimatedCost;
@override final  TripOptimizationStats? optimizationStats;
@override final  FeasibilityReport? feasibilityReport;

/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TripItineraryCopyWith<_TripItinerary> get copyWith => __$TripItineraryCopyWithImpl<_TripItinerary>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TripItineraryToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TripItinerary&&const DeepCollectionEquality().equals(other.days, _days)&&(identical(other.summary, summary) || other.summary == summary)&&(identical(other.totalEstimatedCost, totalEstimatedCost) || other.totalEstimatedCost == totalEstimatedCost)&&(identical(other.optimizationStats, optimizationStats) || other.optimizationStats == optimizationStats)&&(identical(other.feasibilityReport, feasibilityReport) || other.feasibilityReport == feasibilityReport));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_days),summary,totalEstimatedCost,optimizationStats,feasibilityReport);
}

@override
String toString() {
    return 'TripItinerary(days: $days, summary: $summary, totalEstimatedCost: $totalEstimatedCost, optimizationStats: $optimizationStats, feasibilityReport: $feasibilityReport)';
}


}

/// @nodoc
abstract mixin class _$TripItineraryCopyWith<$Res> implements $TripItineraryCopyWith<$Res> {
  factory _$TripItineraryCopyWith(_TripItinerary value, $Res Function(_TripItinerary) _then) = __$TripItineraryCopyWithImpl;
@override @useResult
$Res call({
 List<DayPlan> days, String summary, double totalEstimatedCost, TripOptimizationStats? optimizationStats, FeasibilityReport? feasibilityReport
});


@override $TripOptimizationStatsCopyWith<$Res>? get optimizationStats;@override $FeasibilityReportCopyWith<$Res>? get feasibilityReport;

}
/// @nodoc
class __$TripItineraryCopyWithImpl<$Res>
    implements _$TripItineraryCopyWith<$Res> {
  __$TripItineraryCopyWithImpl(this._self, this._then);

  final _TripItinerary _self;
  final $Res Function(_TripItinerary) _then;

/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? days = null,Object? summary = null,Object? totalEstimatedCost = null,Object? optimizationStats = freezed,Object? feasibilityReport = freezed,}) {
  return _then(_TripItinerary(
days: null == days ? _self._days : days // ignore: cast_nullable_to_non_nullable
as List<DayPlan>,summary: null == summary ? _self.summary : summary // ignore: cast_nullable_to_non_nullable
as String,totalEstimatedCost: null == totalEstimatedCost ? _self.totalEstimatedCost : totalEstimatedCost // ignore: cast_nullable_to_non_nullable
as double,optimizationStats: freezed == optimizationStats ? _self.optimizationStats : optimizationStats // ignore: cast_nullable_to_non_nullable
as TripOptimizationStats?,feasibilityReport: freezed == feasibilityReport ? _self.feasibilityReport : feasibilityReport // ignore: cast_nullable_to_non_nullable
as FeasibilityReport?,
  ));
}

/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TripOptimizationStatsCopyWith<$Res>? get optimizationStats {
    if (_self.optimizationStats == null) {
    return null;
  }

  return $TripOptimizationStatsCopyWith<$Res>(_self.optimizationStats!, (value) {
    return _then(_self.copyWith(optimizationStats: value));
  });
}/// Create a copy of TripItinerary
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$FeasibilityReportCopyWith<$Res>? get feasibilityReport {
    if (_self.feasibilityReport == null) {
    return null;
  }

  return $FeasibilityReportCopyWith<$Res>(_self.feasibilityReport!, (value) {
    return _then(_self.copyWith(feasibilityReport: value));
  });
}
}


/// @nodoc
mixin _$TripPlaceInfo {

 String get id; String get name; String? get description; String? get imageUrl; double? get latitude; double? get longitude; List<String> get categories;
/// Create a copy of TripPlaceInfo
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TripPlaceInfoCopyWith<TripPlaceInfo> get copyWith => _$TripPlaceInfoCopyWithImpl<TripPlaceInfo>(this as TripPlaceInfo, _$identity);

  /// Serializes this TripPlaceInfo to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as TripPlaceInfo;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TripPlaceInfo&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.imageUrl, _this.imageUrl) || other.imageUrl == _this.imageUrl)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&const DeepCollectionEquality().equals(other.categories, _this.categories));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as TripPlaceInfo;
  return Object.hash(runtimeType,_this.id,_this.name,_this.description,_this.imageUrl,_this.latitude,_this.longitude,const DeepCollectionEquality().hash(_this.categories));
}

@override
String toString() {
  final _this = this as TripPlaceInfo;
  return 'TripPlaceInfo(id: ${_this.id}, name: ${_this.name}, description: ${_this.description}, imageUrl: ${_this.imageUrl}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, categories: ${_this.categories})';
}


}

/// @nodoc
abstract mixin class $TripPlaceInfoCopyWith<$Res>  {
  factory $TripPlaceInfoCopyWith(TripPlaceInfo value, $Res Function(TripPlaceInfo) _then) = _$TripPlaceInfoCopyWithImpl;
@useResult
$Res call({
 String id, String name, String? description, String? imageUrl, double? latitude, double? longitude, List<String> categories
});




}
/// @nodoc
class _$TripPlaceInfoCopyWithImpl<$Res>
    implements $TripPlaceInfoCopyWith<$Res> {
  _$TripPlaceInfoCopyWithImpl(this._self, this._then);

  final TripPlaceInfo _self;
  final $Res Function(TripPlaceInfo) _then;

/// Create a copy of TripPlaceInfo
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? description = freezed,Object? imageUrl = freezed,Object? latitude = freezed,Object? longitude = freezed,Object? categories = null,}) {
  return _then(TripPlaceInfo(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,categories: null == categories ? _self.categories : categories // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [TripPlaceInfo].
extension TripPlaceInfoPatterns on TripPlaceInfo {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TripPlaceInfo value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TripPlaceInfo() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TripPlaceInfo value)  $default,){
final _that = this;
switch (_that) {
case _TripPlaceInfo():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TripPlaceInfo value)?  $default,){
final _that = this;
switch (_that) {
case _TripPlaceInfo() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String? description,  String? imageUrl,  double? latitude,  double? longitude,  List<String> categories)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TripPlaceInfo() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.imageUrl,_that.latitude,_that.longitude,_that.categories);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String? description,  String? imageUrl,  double? latitude,  double? longitude,  List<String> categories)  $default,) {final _that = this;
switch (_that) {
case _TripPlaceInfo():
return $default(_that.id,_that.name,_that.description,_that.imageUrl,_that.latitude,_that.longitude,_that.categories);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String? description,  String? imageUrl,  double? latitude,  double? longitude,  List<String> categories)?  $default,) {final _that = this;
switch (_that) {
case _TripPlaceInfo() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.imageUrl,_that.latitude,_that.longitude,_that.categories);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TripPlaceInfo implements TripPlaceInfo {
  const _TripPlaceInfo({required this.id, required this.name, this.description, this.imageUrl, this.latitude, this.longitude,  List<String> categories = const []}): _categories = categories;
  factory _TripPlaceInfo.fromJson(Map<String, dynamic> json) => _$TripPlaceInfoFromJson(json);

@override final  String id;
@override final  String name;
@override final  String? description;
@override final  String? imageUrl;
@override final  double? latitude;
@override final  double? longitude;
 final  List<String> _categories;
@override@JsonKey() List<String> get categories {
  if (_categories is EqualUnmodifiableListView) return _categories;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_categories);
}


/// Create a copy of TripPlaceInfo
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TripPlaceInfoCopyWith<_TripPlaceInfo> get copyWith => __$TripPlaceInfoCopyWithImpl<_TripPlaceInfo>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TripPlaceInfoToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TripPlaceInfo&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&const DeepCollectionEquality().equals(other.categories, _categories));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,description,imageUrl,latitude,longitude,const DeepCollectionEquality().hash(_categories));
}

@override
String toString() {
    return 'TripPlaceInfo(id: $id, name: $name, description: $description, imageUrl: $imageUrl, latitude: $latitude, longitude: $longitude, categories: $categories)';
}


}

/// @nodoc
abstract mixin class _$TripPlaceInfoCopyWith<$Res> implements $TripPlaceInfoCopyWith<$Res> {
  factory _$TripPlaceInfoCopyWith(_TripPlaceInfo value, $Res Function(_TripPlaceInfo) _then) = __$TripPlaceInfoCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String? description, String? imageUrl, double? latitude, double? longitude, List<String> categories
});




}
/// @nodoc
class __$TripPlaceInfoCopyWithImpl<$Res>
    implements _$TripPlaceInfoCopyWith<$Res> {
  __$TripPlaceInfoCopyWithImpl(this._self, this._then);

  final _TripPlaceInfo _self;
  final $Res Function(_TripPlaceInfo) _then;

/// Create a copy of TripPlaceInfo
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? description = freezed,Object? imageUrl = freezed,Object? latitude = freezed,Object? longitude = freezed,Object? categories = null,}) {
  return _then(_TripPlaceInfo(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,categories: null == categories ? _self._categories : categories // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}


/// @nodoc
mixin _$TripPlaceRelation {

 String get id; String get tripId; String get placeId; int get dayNumber; int get orderInDay; TripPlaceInfo? get place;
/// Create a copy of TripPlaceRelation
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TripPlaceRelationCopyWith<TripPlaceRelation> get copyWith => _$TripPlaceRelationCopyWithImpl<TripPlaceRelation>(this as TripPlaceRelation, _$identity);

  /// Serializes this TripPlaceRelation to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as TripPlaceRelation;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TripPlaceRelation&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.tripId, _this.tripId) || other.tripId == _this.tripId)&&(identical(other.placeId, _this.placeId) || other.placeId == _this.placeId)&&(identical(other.dayNumber, _this.dayNumber) || other.dayNumber == _this.dayNumber)&&(identical(other.orderInDay, _this.orderInDay) || other.orderInDay == _this.orderInDay)&&(identical(other.place, _this.place) || other.place == _this.place));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as TripPlaceRelation;
  return Object.hash(runtimeType,_this.id,_this.tripId,_this.placeId,_this.dayNumber,_this.orderInDay,_this.place);
}

@override
String toString() {
  final _this = this as TripPlaceRelation;
  return 'TripPlaceRelation(id: ${_this.id}, tripId: ${_this.tripId}, placeId: ${_this.placeId}, dayNumber: ${_this.dayNumber}, orderInDay: ${_this.orderInDay}, place: ${_this.place})';
}


}

/// @nodoc
abstract mixin class $TripPlaceRelationCopyWith<$Res>  {
  factory $TripPlaceRelationCopyWith(TripPlaceRelation value, $Res Function(TripPlaceRelation) _then) = _$TripPlaceRelationCopyWithImpl;
@useResult
$Res call({
 String id, String tripId, String placeId, int dayNumber, int orderInDay, TripPlaceInfo? place
});


$TripPlaceInfoCopyWith<$Res>? get place;

}
/// @nodoc
class _$TripPlaceRelationCopyWithImpl<$Res>
    implements $TripPlaceRelationCopyWith<$Res> {
  _$TripPlaceRelationCopyWithImpl(this._self, this._then);

  final TripPlaceRelation _self;
  final $Res Function(TripPlaceRelation) _then;

/// Create a copy of TripPlaceRelation
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? tripId = null,Object? placeId = null,Object? dayNumber = null,Object? orderInDay = null,Object? place = freezed,}) {
  return _then(TripPlaceRelation(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,tripId: null == tripId ? _self.tripId : tripId // ignore: cast_nullable_to_non_nullable
as String,placeId: null == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String,dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,orderInDay: null == orderInDay ? _self.orderInDay : orderInDay // ignore: cast_nullable_to_non_nullable
as int,place: freezed == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as TripPlaceInfo?,
  ));
}
/// Create a copy of TripPlaceRelation
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TripPlaceInfoCopyWith<$Res>? get place {
    if (_self.place == null) {
    return null;
  }

  return $TripPlaceInfoCopyWith<$Res>(_self.place!, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// Adds pattern-matching-related methods to [TripPlaceRelation].
extension TripPlaceRelationPatterns on TripPlaceRelation {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TripPlaceRelation value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TripPlaceRelation() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TripPlaceRelation value)  $default,){
final _that = this;
switch (_that) {
case _TripPlaceRelation():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TripPlaceRelation value)?  $default,){
final _that = this;
switch (_that) {
case _TripPlaceRelation() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String tripId,  String placeId,  int dayNumber,  int orderInDay,  TripPlaceInfo? place)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TripPlaceRelation() when $default != null:
return $default(_that.id,_that.tripId,_that.placeId,_that.dayNumber,_that.orderInDay,_that.place);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String tripId,  String placeId,  int dayNumber,  int orderInDay,  TripPlaceInfo? place)  $default,) {final _that = this;
switch (_that) {
case _TripPlaceRelation():
return $default(_that.id,_that.tripId,_that.placeId,_that.dayNumber,_that.orderInDay,_that.place);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String tripId,  String placeId,  int dayNumber,  int orderInDay,  TripPlaceInfo? place)?  $default,) {final _that = this;
switch (_that) {
case _TripPlaceRelation() when $default != null:
return $default(_that.id,_that.tripId,_that.placeId,_that.dayNumber,_that.orderInDay,_that.place);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TripPlaceRelation implements TripPlaceRelation {
  const _TripPlaceRelation({required this.id, required this.tripId, required this.placeId, required this.dayNumber, required this.orderInDay, this.place});
  factory _TripPlaceRelation.fromJson(Map<String, dynamic> json) => _$TripPlaceRelationFromJson(json);

@override final  String id;
@override final  String tripId;
@override final  String placeId;
@override final  int dayNumber;
@override final  int orderInDay;
@override final  TripPlaceInfo? place;

/// Create a copy of TripPlaceRelation
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TripPlaceRelationCopyWith<_TripPlaceRelation> get copyWith => __$TripPlaceRelationCopyWithImpl<_TripPlaceRelation>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TripPlaceRelationToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TripPlaceRelation&&(identical(other.id, id) || other.id == id)&&(identical(other.tripId, tripId) || other.tripId == tripId)&&(identical(other.placeId, placeId) || other.placeId == placeId)&&(identical(other.dayNumber, dayNumber) || other.dayNumber == dayNumber)&&(identical(other.orderInDay, orderInDay) || other.orderInDay == orderInDay)&&(identical(other.place, place) || other.place == place));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,tripId,placeId,dayNumber,orderInDay,place);
}

@override
String toString() {
    return 'TripPlaceRelation(id: $id, tripId: $tripId, placeId: $placeId, dayNumber: $dayNumber, orderInDay: $orderInDay, place: $place)';
}


}

/// @nodoc
abstract mixin class _$TripPlaceRelationCopyWith<$Res> implements $TripPlaceRelationCopyWith<$Res> {
  factory _$TripPlaceRelationCopyWith(_TripPlaceRelation value, $Res Function(_TripPlaceRelation) _then) = __$TripPlaceRelationCopyWithImpl;
@override @useResult
$Res call({
 String id, String tripId, String placeId, int dayNumber, int orderInDay, TripPlaceInfo? place
});


@override $TripPlaceInfoCopyWith<$Res>? get place;

}
/// @nodoc
class __$TripPlaceRelationCopyWithImpl<$Res>
    implements _$TripPlaceRelationCopyWith<$Res> {
  __$TripPlaceRelationCopyWithImpl(this._self, this._then);

  final _TripPlaceRelation _self;
  final $Res Function(_TripPlaceRelation) _then;

/// Create a copy of TripPlaceRelation
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? tripId = null,Object? placeId = null,Object? dayNumber = null,Object? orderInDay = null,Object? place = freezed,}) {
  return _then(_TripPlaceRelation(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,tripId: null == tripId ? _self.tripId : tripId // ignore: cast_nullable_to_non_nullable
as String,placeId: null == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String,dayNumber: null == dayNumber ? _self.dayNumber : dayNumber // ignore: cast_nullable_to_non_nullable
as int,orderInDay: null == orderInDay ? _self.orderInDay : orderInDay // ignore: cast_nullable_to_non_nullable
as int,place: freezed == place ? _self.place : place // ignore: cast_nullable_to_non_nullable
as TripPlaceInfo?,
  ));
}

/// Create a copy of TripPlaceRelation
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TripPlaceInfoCopyWith<$Res>? get place {
    if (_self.place == null) {
    return null;
  }

  return $TripPlaceInfoCopyWith<$Res>(_self.place!, (value) {
    return _then(_self.copyWith(place: value));
  });
}
}


/// @nodoc
mixin _$Trip {

 String get id; String get destination; String get startDate; String get endDate;@JsonKey(readValue: _readBudget) double get budgetPerPerson;@JsonKey(readValue: _readGroupSize) int get groupSize; String get status; String? get createdAt; String? get imageUrl; String? get description; List<String> get preferences; TripItinerary? get itinerary; List<TripPlaceRelation>? get places;
/// Create a copy of Trip
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TripCopyWith<Trip> get copyWith => _$TripCopyWithImpl<Trip>(this as Trip, _$identity);

  /// Serializes this Trip to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as Trip;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Trip&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.destination, _this.destination) || other.destination == _this.destination)&&(identical(other.startDate, _this.startDate) || other.startDate == _this.startDate)&&(identical(other.endDate, _this.endDate) || other.endDate == _this.endDate)&&(identical(other.budgetPerPerson, _this.budgetPerPerson) || other.budgetPerPerson == _this.budgetPerPerson)&&(identical(other.groupSize, _this.groupSize) || other.groupSize == _this.groupSize)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.imageUrl, _this.imageUrl) || other.imageUrl == _this.imageUrl)&&(identical(other.description, _this.description) || other.description == _this.description)&&const DeepCollectionEquality().equals(other.preferences, _this.preferences)&&(identical(other.itinerary, _this.itinerary) || other.itinerary == _this.itinerary)&&const DeepCollectionEquality().equals(other.places, _this.places));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as Trip;
  return Object.hash(runtimeType,_this.id,_this.destination,_this.startDate,_this.endDate,_this.budgetPerPerson,_this.groupSize,_this.status,_this.createdAt,_this.imageUrl,_this.description,const DeepCollectionEquality().hash(_this.preferences),_this.itinerary,const DeepCollectionEquality().hash(_this.places));
}

@override
String toString() {
  final _this = this as Trip;
  return 'Trip(id: ${_this.id}, destination: ${_this.destination}, startDate: ${_this.startDate}, endDate: ${_this.endDate}, budgetPerPerson: ${_this.budgetPerPerson}, groupSize: ${_this.groupSize}, status: ${_this.status}, createdAt: ${_this.createdAt}, imageUrl: ${_this.imageUrl}, description: ${_this.description}, preferences: ${_this.preferences}, itinerary: ${_this.itinerary}, places: ${_this.places})';
}


}

/// @nodoc
abstract mixin class $TripCopyWith<$Res>  {
  factory $TripCopyWith(Trip value, $Res Function(Trip) _then) = _$TripCopyWithImpl;
@useResult
$Res call({
 String id, String destination, String startDate, String endDate,@JsonKey(readValue: _readBudget) double budgetPerPerson,@JsonKey(readValue: _readGroupSize) int groupSize, String status, String? createdAt, String? imageUrl, String? description, List<String> preferences, TripItinerary? itinerary, List<TripPlaceRelation>? places
});


$TripItineraryCopyWith<$Res>? get itinerary;

}
/// @nodoc
class _$TripCopyWithImpl<$Res>
    implements $TripCopyWith<$Res> {
  _$TripCopyWithImpl(this._self, this._then);

  final Trip _self;
  final $Res Function(Trip) _then;

/// Create a copy of Trip
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? destination = null,Object? startDate = null,Object? endDate = null,Object? budgetPerPerson = null,Object? groupSize = null,Object? status = null,Object? createdAt = freezed,Object? imageUrl = freezed,Object? description = freezed,Object? preferences = null,Object? itinerary = freezed,Object? places = freezed,}) {
  return _then(Trip(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,destination: null == destination ? _self.destination : destination // ignore: cast_nullable_to_non_nullable
as String,startDate: null == startDate ? _self.startDate : startDate // ignore: cast_nullable_to_non_nullable
as String,endDate: null == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as String,budgetPerPerson: null == budgetPerPerson ? _self.budgetPerPerson : budgetPerPerson // ignore: cast_nullable_to_non_nullable
as double,groupSize: null == groupSize ? _self.groupSize : groupSize // ignore: cast_nullable_to_non_nullable
as int,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,preferences: null == preferences ? _self.preferences : preferences // ignore: cast_nullable_to_non_nullable
as List<String>,itinerary: freezed == itinerary ? _self.itinerary : itinerary // ignore: cast_nullable_to_non_nullable
as TripItinerary?,places: freezed == places ? _self.places : places // ignore: cast_nullable_to_non_nullable
as List<TripPlaceRelation>?,
  ));
}
/// Create a copy of Trip
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TripItineraryCopyWith<$Res>? get itinerary {
    if (_self.itinerary == null) {
    return null;
  }

  return $TripItineraryCopyWith<$Res>(_self.itinerary!, (value) {
    return _then(_self.copyWith(itinerary: value));
  });
}
}


/// Adds pattern-matching-related methods to [Trip].
extension TripPatterns on Trip {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Trip value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Trip() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Trip value)  $default,){
final _that = this;
switch (_that) {
case _Trip():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Trip value)?  $default,){
final _that = this;
switch (_that) {
case _Trip() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String destination,  String startDate,  String endDate, @JsonKey(readValue: _readBudget)  double budgetPerPerson, @JsonKey(readValue: _readGroupSize)  int groupSize,  String status,  String? createdAt,  String? imageUrl,  String? description,  List<String> preferences,  TripItinerary? itinerary,  List<TripPlaceRelation>? places)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Trip() when $default != null:
return $default(_that.id,_that.destination,_that.startDate,_that.endDate,_that.budgetPerPerson,_that.groupSize,_that.status,_that.createdAt,_that.imageUrl,_that.description,_that.preferences,_that.itinerary,_that.places);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String destination,  String startDate,  String endDate, @JsonKey(readValue: _readBudget)  double budgetPerPerson, @JsonKey(readValue: _readGroupSize)  int groupSize,  String status,  String? createdAt,  String? imageUrl,  String? description,  List<String> preferences,  TripItinerary? itinerary,  List<TripPlaceRelation>? places)  $default,) {final _that = this;
switch (_that) {
case _Trip():
return $default(_that.id,_that.destination,_that.startDate,_that.endDate,_that.budgetPerPerson,_that.groupSize,_that.status,_that.createdAt,_that.imageUrl,_that.description,_that.preferences,_that.itinerary,_that.places);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String destination,  String startDate,  String endDate, @JsonKey(readValue: _readBudget)  double budgetPerPerson, @JsonKey(readValue: _readGroupSize)  int groupSize,  String status,  String? createdAt,  String? imageUrl,  String? description,  List<String> preferences,  TripItinerary? itinerary,  List<TripPlaceRelation>? places)?  $default,) {final _that = this;
switch (_that) {
case _Trip() when $default != null:
return $default(_that.id,_that.destination,_that.startDate,_that.endDate,_that.budgetPerPerson,_that.groupSize,_that.status,_that.createdAt,_that.imageUrl,_that.description,_that.preferences,_that.itinerary,_that.places);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Trip extends Trip {
  const _Trip({required this.id, required this.destination, required this.startDate, required this.endDate, @JsonKey(readValue: _readBudget) this.budgetPerPerson = 0.0, @JsonKey(readValue: _readGroupSize) this.groupSize = 1, this.status = 'DRAFT', this.createdAt, this.imageUrl, this.description,  List<String> preferences = const [], this.itinerary,  List<TripPlaceRelation>? places}): _preferences = preferences,_places = places,super._();
  factory _Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);

@override final  String id;
@override final  String destination;
@override final  String startDate;
@override final  String endDate;
@override@JsonKey(readValue: _readBudget) final  double budgetPerPerson;
@override@JsonKey(readValue: _readGroupSize) final  int groupSize;
@override@JsonKey() final  String status;
@override final  String? createdAt;
@override final  String? imageUrl;
@override final  String? description;
 final  List<String> _preferences;
@override@JsonKey() List<String> get preferences {
  if (_preferences is EqualUnmodifiableListView) return _preferences;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_preferences);
}

@override final  TripItinerary? itinerary;
 final  List<TripPlaceRelation>? _places;
@override List<TripPlaceRelation>? get places {
  final value = _places;
  if (value == null) return null;
  if (_places is EqualUnmodifiableListView) return _places;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}


/// Create a copy of Trip
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TripCopyWith<_Trip> get copyWith => __$TripCopyWithImpl<_Trip>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TripToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Trip&&(identical(other.id, id) || other.id == id)&&(identical(other.destination, destination) || other.destination == destination)&&(identical(other.startDate, startDate) || other.startDate == startDate)&&(identical(other.endDate, endDate) || other.endDate == endDate)&&(identical(other.budgetPerPerson, budgetPerPerson) || other.budgetPerPerson == budgetPerPerson)&&(identical(other.groupSize, groupSize) || other.groupSize == groupSize)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other.preferences, _preferences)&&(identical(other.itinerary, itinerary) || other.itinerary == itinerary)&&const DeepCollectionEquality().equals(other.places, _places));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,destination,startDate,endDate,budgetPerPerson,groupSize,status,createdAt,imageUrl,description,const DeepCollectionEquality().hash(_preferences),itinerary,const DeepCollectionEquality().hash(_places));
}

@override
String toString() {
    return 'Trip(id: $id, destination: $destination, startDate: $startDate, endDate: $endDate, budgetPerPerson: $budgetPerPerson, groupSize: $groupSize, status: $status, createdAt: $createdAt, imageUrl: $imageUrl, description: $description, preferences: $preferences, itinerary: $itinerary, places: $places)';
}


}

/// @nodoc
abstract mixin class _$TripCopyWith<$Res> implements $TripCopyWith<$Res> {
  factory _$TripCopyWith(_Trip value, $Res Function(_Trip) _then) = __$TripCopyWithImpl;
@override @useResult
$Res call({
 String id, String destination, String startDate, String endDate,@JsonKey(readValue: _readBudget) double budgetPerPerson,@JsonKey(readValue: _readGroupSize) int groupSize, String status, String? createdAt, String? imageUrl, String? description, List<String> preferences, TripItinerary? itinerary, List<TripPlaceRelation>? places
});


@override $TripItineraryCopyWith<$Res>? get itinerary;

}
/// @nodoc
class __$TripCopyWithImpl<$Res>
    implements _$TripCopyWith<$Res> {
  __$TripCopyWithImpl(this._self, this._then);

  final _Trip _self;
  final $Res Function(_Trip) _then;

/// Create a copy of Trip
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? destination = null,Object? startDate = null,Object? endDate = null,Object? budgetPerPerson = null,Object? groupSize = null,Object? status = null,Object? createdAt = freezed,Object? imageUrl = freezed,Object? description = freezed,Object? preferences = null,Object? itinerary = freezed,Object? places = freezed,}) {
  return _then(_Trip(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,destination: null == destination ? _self.destination : destination // ignore: cast_nullable_to_non_nullable
as String,startDate: null == startDate ? _self.startDate : startDate // ignore: cast_nullable_to_non_nullable
as String,endDate: null == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as String,budgetPerPerson: null == budgetPerPerson ? _self.budgetPerPerson : budgetPerPerson // ignore: cast_nullable_to_non_nullable
as double,groupSize: null == groupSize ? _self.groupSize : groupSize // ignore: cast_nullable_to_non_nullable
as int,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,preferences: null == preferences ? _self._preferences : preferences // ignore: cast_nullable_to_non_nullable
as List<String>,itinerary: freezed == itinerary ? _self.itinerary : itinerary // ignore: cast_nullable_to_non_nullable
as TripItinerary?,places: freezed == places ? _self._places : places // ignore: cast_nullable_to_non_nullable
as List<TripPlaceRelation>?,
  ));
}

/// Create a copy of Trip
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TripItineraryCopyWith<$Res>? get itinerary {
    if (_self.itinerary == null) {
    return null;
  }

  return $TripItineraryCopyWith<$Res>(_self.itinerary!, (value) {
    return _then(_self.copyWith(itinerary: value));
  });
}
}

// dart format on
