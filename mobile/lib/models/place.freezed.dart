// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'place.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Place {

 String get id; String get name;@JsonKey(readValue: _readProvince) String get province; double get latitude; double get longitude;@JsonKey(readValue: _readCategories) List<String> get categories; String? get description; String? get imageUrl; String? get district; int get priceEstimate; double get popularityScore; String? get indoorOutdoor; String? get activityLevel; int get likesCount; int get savesCount; int get commentsCount;@JsonKey(readValue: _readRatingAvg) double get ratingAvg;@JsonKey(readValue: _readRatingCount) int get ratingCount; bool get isLiked; bool get isSaved; int? get userRating; List<Place>? get nearbyPlaces; List<String>? get amenities; String? get openingHours; String? get phone; String? get website;
/// Create a copy of Place
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PlaceCopyWith<Place> get copyWith => _$PlaceCopyWithImpl<Place>(this as Place, _$identity);

  /// Serializes this Place to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as Place;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Place&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.province, _this.province) || other.province == _this.province)&&(identical(other.latitude, _this.latitude) || other.latitude == _this.latitude)&&(identical(other.longitude, _this.longitude) || other.longitude == _this.longitude)&&const DeepCollectionEquality().equals(other.categories, _this.categories)&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.imageUrl, _this.imageUrl) || other.imageUrl == _this.imageUrl)&&(identical(other.district, _this.district) || other.district == _this.district)&&(identical(other.priceEstimate, _this.priceEstimate) || other.priceEstimate == _this.priceEstimate)&&(identical(other.popularityScore, _this.popularityScore) || other.popularityScore == _this.popularityScore)&&(identical(other.indoorOutdoor, _this.indoorOutdoor) || other.indoorOutdoor == _this.indoorOutdoor)&&(identical(other.activityLevel, _this.activityLevel) || other.activityLevel == _this.activityLevel)&&(identical(other.likesCount, _this.likesCount) || other.likesCount == _this.likesCount)&&(identical(other.savesCount, _this.savesCount) || other.savesCount == _this.savesCount)&&(identical(other.commentsCount, _this.commentsCount) || other.commentsCount == _this.commentsCount)&&(identical(other.ratingAvg, _this.ratingAvg) || other.ratingAvg == _this.ratingAvg)&&(identical(other.ratingCount, _this.ratingCount) || other.ratingCount == _this.ratingCount)&&(identical(other.isLiked, _this.isLiked) || other.isLiked == _this.isLiked)&&(identical(other.isSaved, _this.isSaved) || other.isSaved == _this.isSaved)&&(identical(other.userRating, _this.userRating) || other.userRating == _this.userRating)&&const DeepCollectionEquality().equals(other.nearbyPlaces, _this.nearbyPlaces)&&const DeepCollectionEquality().equals(other.amenities, _this.amenities)&&(identical(other.openingHours, _this.openingHours) || other.openingHours == _this.openingHours)&&(identical(other.phone, _this.phone) || other.phone == _this.phone)&&(identical(other.website, _this.website) || other.website == _this.website));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as Place;
  return Object.hashAll([runtimeType,_this.id,_this.name,_this.province,_this.latitude,_this.longitude,const DeepCollectionEquality().hash(_this.categories),_this.description,_this.imageUrl,_this.district,_this.priceEstimate,_this.popularityScore,_this.indoorOutdoor,_this.activityLevel,_this.likesCount,_this.savesCount,_this.commentsCount,_this.ratingAvg,_this.ratingCount,_this.isLiked,_this.isSaved,_this.userRating,const DeepCollectionEquality().hash(_this.nearbyPlaces),const DeepCollectionEquality().hash(_this.amenities),_this.openingHours,_this.phone,_this.website]);
}

@override
String toString() {
  final _this = this as Place;
  return 'Place(id: ${_this.id}, name: ${_this.name}, province: ${_this.province}, latitude: ${_this.latitude}, longitude: ${_this.longitude}, categories: ${_this.categories}, description: ${_this.description}, imageUrl: ${_this.imageUrl}, district: ${_this.district}, priceEstimate: ${_this.priceEstimate}, popularityScore: ${_this.popularityScore}, indoorOutdoor: ${_this.indoorOutdoor}, activityLevel: ${_this.activityLevel}, likesCount: ${_this.likesCount}, savesCount: ${_this.savesCount}, commentsCount: ${_this.commentsCount}, ratingAvg: ${_this.ratingAvg}, ratingCount: ${_this.ratingCount}, isLiked: ${_this.isLiked}, isSaved: ${_this.isSaved}, userRating: ${_this.userRating}, nearbyPlaces: ${_this.nearbyPlaces}, amenities: ${_this.amenities}, openingHours: ${_this.openingHours}, phone: ${_this.phone}, website: ${_this.website})';
}


}

/// @nodoc
abstract mixin class $PlaceCopyWith<$Res>  {
  factory $PlaceCopyWith(Place value, $Res Function(Place) _then) = _$PlaceCopyWithImpl;
@useResult
$Res call({
 String id, String name,@JsonKey(readValue: _readProvince) String province, double latitude, double longitude,@JsonKey(readValue: _readCategories) List<String> categories, String? description, String? imageUrl, String? district, int priceEstimate, double popularityScore, String? indoorOutdoor, String? activityLevel, int likesCount, int savesCount, int commentsCount,@JsonKey(readValue: _readRatingAvg) double ratingAvg,@JsonKey(readValue: _readRatingCount) int ratingCount, bool isLiked, bool isSaved, int? userRating, List<Place>? nearbyPlaces, List<String>? amenities, String? openingHours, String? phone, String? website
});




}
/// @nodoc
class _$PlaceCopyWithImpl<$Res>
    implements $PlaceCopyWith<$Res> {
  _$PlaceCopyWithImpl(this._self, this._then);

  final Place _self;
  final $Res Function(Place) _then;

/// Create a copy of Place
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? province = null,Object? latitude = null,Object? longitude = null,Object? categories = null,Object? description = freezed,Object? imageUrl = freezed,Object? district = freezed,Object? priceEstimate = null,Object? popularityScore = null,Object? indoorOutdoor = freezed,Object? activityLevel = freezed,Object? likesCount = null,Object? savesCount = null,Object? commentsCount = null,Object? ratingAvg = null,Object? ratingCount = null,Object? isLiked = null,Object? isSaved = null,Object? userRating = freezed,Object? nearbyPlaces = freezed,Object? amenities = freezed,Object? openingHours = freezed,Object? phone = freezed,Object? website = freezed,}) {
  return _then(Place(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,province: null == province ? _self.province : province // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,categories: null == categories ? _self.categories : categories // ignore: cast_nullable_to_non_nullable
as List<String>,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,district: freezed == district ? _self.district : district // ignore: cast_nullable_to_non_nullable
as String?,priceEstimate: null == priceEstimate ? _self.priceEstimate : priceEstimate // ignore: cast_nullable_to_non_nullable
as int,popularityScore: null == popularityScore ? _self.popularityScore : popularityScore // ignore: cast_nullable_to_non_nullable
as double,indoorOutdoor: freezed == indoorOutdoor ? _self.indoorOutdoor : indoorOutdoor // ignore: cast_nullable_to_non_nullable
as String?,activityLevel: freezed == activityLevel ? _self.activityLevel : activityLevel // ignore: cast_nullable_to_non_nullable
as String?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,savesCount: null == savesCount ? _self.savesCount : savesCount // ignore: cast_nullable_to_non_nullable
as int,commentsCount: null == commentsCount ? _self.commentsCount : commentsCount // ignore: cast_nullable_to_non_nullable
as int,ratingAvg: null == ratingAvg ? _self.ratingAvg : ratingAvg // ignore: cast_nullable_to_non_nullable
as double,ratingCount: null == ratingCount ? _self.ratingCount : ratingCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,isSaved: null == isSaved ? _self.isSaved : isSaved // ignore: cast_nullable_to_non_nullable
as bool,userRating: freezed == userRating ? _self.userRating : userRating // ignore: cast_nullable_to_non_nullable
as int?,nearbyPlaces: freezed == nearbyPlaces ? _self.nearbyPlaces : nearbyPlaces // ignore: cast_nullable_to_non_nullable
as List<Place>?,amenities: freezed == amenities ? _self.amenities : amenities // ignore: cast_nullable_to_non_nullable
as List<String>?,openingHours: freezed == openingHours ? _self.openingHours : openingHours // ignore: cast_nullable_to_non_nullable
as String?,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,website: freezed == website ? _self.website : website // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [Place].
extension PlacePatterns on Place {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Place value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Place() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Place value)  $default,){
final _that = this;
switch (_that) {
case _Place():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Place value)?  $default,){
final _that = this;
switch (_that) {
case _Place() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name, @JsonKey(readValue: _readProvince)  String province,  double latitude,  double longitude, @JsonKey(readValue: _readCategories)  List<String> categories,  String? description,  String? imageUrl,  String? district,  int priceEstimate,  double popularityScore,  String? indoorOutdoor,  String? activityLevel,  int likesCount,  int savesCount,  int commentsCount, @JsonKey(readValue: _readRatingAvg)  double ratingAvg, @JsonKey(readValue: _readRatingCount)  int ratingCount,  bool isLiked,  bool isSaved,  int? userRating,  List<Place>? nearbyPlaces,  List<String>? amenities,  String? openingHours,  String? phone,  String? website)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Place() when $default != null:
return $default(_that.id,_that.name,_that.province,_that.latitude,_that.longitude,_that.categories,_that.description,_that.imageUrl,_that.district,_that.priceEstimate,_that.popularityScore,_that.indoorOutdoor,_that.activityLevel,_that.likesCount,_that.savesCount,_that.commentsCount,_that.ratingAvg,_that.ratingCount,_that.isLiked,_that.isSaved,_that.userRating,_that.nearbyPlaces,_that.amenities,_that.openingHours,_that.phone,_that.website);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name, @JsonKey(readValue: _readProvince)  String province,  double latitude,  double longitude, @JsonKey(readValue: _readCategories)  List<String> categories,  String? description,  String? imageUrl,  String? district,  int priceEstimate,  double popularityScore,  String? indoorOutdoor,  String? activityLevel,  int likesCount,  int savesCount,  int commentsCount, @JsonKey(readValue: _readRatingAvg)  double ratingAvg, @JsonKey(readValue: _readRatingCount)  int ratingCount,  bool isLiked,  bool isSaved,  int? userRating,  List<Place>? nearbyPlaces,  List<String>? amenities,  String? openingHours,  String? phone,  String? website)  $default,) {final _that = this;
switch (_that) {
case _Place():
return $default(_that.id,_that.name,_that.province,_that.latitude,_that.longitude,_that.categories,_that.description,_that.imageUrl,_that.district,_that.priceEstimate,_that.popularityScore,_that.indoorOutdoor,_that.activityLevel,_that.likesCount,_that.savesCount,_that.commentsCount,_that.ratingAvg,_that.ratingCount,_that.isLiked,_that.isSaved,_that.userRating,_that.nearbyPlaces,_that.amenities,_that.openingHours,_that.phone,_that.website);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name, @JsonKey(readValue: _readProvince)  String province,  double latitude,  double longitude, @JsonKey(readValue: _readCategories)  List<String> categories,  String? description,  String? imageUrl,  String? district,  int priceEstimate,  double popularityScore,  String? indoorOutdoor,  String? activityLevel,  int likesCount,  int savesCount,  int commentsCount, @JsonKey(readValue: _readRatingAvg)  double ratingAvg, @JsonKey(readValue: _readRatingCount)  int ratingCount,  bool isLiked,  bool isSaved,  int? userRating,  List<Place>? nearbyPlaces,  List<String>? amenities,  String? openingHours,  String? phone,  String? website)?  $default,) {final _that = this;
switch (_that) {
case _Place() when $default != null:
return $default(_that.id,_that.name,_that.province,_that.latitude,_that.longitude,_that.categories,_that.description,_that.imageUrl,_that.district,_that.priceEstimate,_that.popularityScore,_that.indoorOutdoor,_that.activityLevel,_that.likesCount,_that.savesCount,_that.commentsCount,_that.ratingAvg,_that.ratingCount,_that.isLiked,_that.isSaved,_that.userRating,_that.nearbyPlaces,_that.amenities,_that.openingHours,_that.phone,_that.website);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Place extends Place {
  const _Place({required this.id, required this.name, @JsonKey(readValue: _readProvince) this.province = 'Việt Nam', required this.latitude, required this.longitude, @JsonKey(readValue: _readCategories)  List<String> categories = const [], this.description, this.imageUrl, this.district, this.priceEstimate = 0, this.popularityScore = 0.0, this.indoorOutdoor, this.activityLevel, this.likesCount = 0, this.savesCount = 0, this.commentsCount = 0, @JsonKey(readValue: _readRatingAvg) this.ratingAvg = 0.0, @JsonKey(readValue: _readRatingCount) this.ratingCount = 0, this.isLiked = false, this.isSaved = false, this.userRating,  List<Place>? nearbyPlaces,  List<String>? amenities, this.openingHours, this.phone, this.website}): _categories = categories,_nearbyPlaces = nearbyPlaces,_amenities = amenities,super._();
  factory _Place.fromJson(Map<String, dynamic> json) => _$PlaceFromJson(json);

@override final  String id;
@override final  String name;
@override@JsonKey(readValue: _readProvince) final  String province;
@override final  double latitude;
@override final  double longitude;
 final  List<String> _categories;
@override@JsonKey(readValue: _readCategories) List<String> get categories {
  if (_categories is EqualUnmodifiableListView) return _categories;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_categories);
}

@override final  String? description;
@override final  String? imageUrl;
@override final  String? district;
@override@JsonKey() final  int priceEstimate;
@override@JsonKey() final  double popularityScore;
@override final  String? indoorOutdoor;
@override final  String? activityLevel;
@override@JsonKey() final  int likesCount;
@override@JsonKey() final  int savesCount;
@override@JsonKey() final  int commentsCount;
@override@JsonKey(readValue: _readRatingAvg) final  double ratingAvg;
@override@JsonKey(readValue: _readRatingCount) final  int ratingCount;
@override@JsonKey() final  bool isLiked;
@override@JsonKey() final  bool isSaved;
@override final  int? userRating;
 final  List<Place>? _nearbyPlaces;
@override List<Place>? get nearbyPlaces {
  final value = _nearbyPlaces;
  if (value == null) return null;
  if (_nearbyPlaces is EqualUnmodifiableListView) return _nearbyPlaces;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

 final  List<String>? _amenities;
@override List<String>? get amenities {
  final value = _amenities;
  if (value == null) return null;
  if (_amenities is EqualUnmodifiableListView) return _amenities;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  String? openingHours;
@override final  String? phone;
@override final  String? website;

/// Create a copy of Place
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PlaceCopyWith<_Place> get copyWith => __$PlaceCopyWithImpl<_Place>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PlaceToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Place&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.province, province) || other.province == province)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&const DeepCollectionEquality().equals(other.categories, _categories)&&(identical(other.description, description) || other.description == description)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.district, district) || other.district == district)&&(identical(other.priceEstimate, priceEstimate) || other.priceEstimate == priceEstimate)&&(identical(other.popularityScore, popularityScore) || other.popularityScore == popularityScore)&&(identical(other.indoorOutdoor, indoorOutdoor) || other.indoorOutdoor == indoorOutdoor)&&(identical(other.activityLevel, activityLevel) || other.activityLevel == activityLevel)&&(identical(other.likesCount, likesCount) || other.likesCount == likesCount)&&(identical(other.savesCount, savesCount) || other.savesCount == savesCount)&&(identical(other.commentsCount, commentsCount) || other.commentsCount == commentsCount)&&(identical(other.ratingAvg, ratingAvg) || other.ratingAvg == ratingAvg)&&(identical(other.ratingCount, ratingCount) || other.ratingCount == ratingCount)&&(identical(other.isLiked, isLiked) || other.isLiked == isLiked)&&(identical(other.isSaved, isSaved) || other.isSaved == isSaved)&&(identical(other.userRating, userRating) || other.userRating == userRating)&&const DeepCollectionEquality().equals(other.nearbyPlaces, _nearbyPlaces)&&const DeepCollectionEquality().equals(other.amenities, _amenities)&&(identical(other.openingHours, openingHours) || other.openingHours == openingHours)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.website, website) || other.website == website));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hashAll([runtimeType,id,name,province,latitude,longitude,const DeepCollectionEquality().hash(_categories),description,imageUrl,district,priceEstimate,popularityScore,indoorOutdoor,activityLevel,likesCount,savesCount,commentsCount,ratingAvg,ratingCount,isLiked,isSaved,userRating,const DeepCollectionEquality().hash(_nearbyPlaces),const DeepCollectionEquality().hash(_amenities),openingHours,phone,website]);
}

@override
String toString() {
    return 'Place(id: $id, name: $name, province: $province, latitude: $latitude, longitude: $longitude, categories: $categories, description: $description, imageUrl: $imageUrl, district: $district, priceEstimate: $priceEstimate, popularityScore: $popularityScore, indoorOutdoor: $indoorOutdoor, activityLevel: $activityLevel, likesCount: $likesCount, savesCount: $savesCount, commentsCount: $commentsCount, ratingAvg: $ratingAvg, ratingCount: $ratingCount, isLiked: $isLiked, isSaved: $isSaved, userRating: $userRating, nearbyPlaces: $nearbyPlaces, amenities: $amenities, openingHours: $openingHours, phone: $phone, website: $website)';
}


}

/// @nodoc
abstract mixin class _$PlaceCopyWith<$Res> implements $PlaceCopyWith<$Res> {
  factory _$PlaceCopyWith(_Place value, $Res Function(_Place) _then) = __$PlaceCopyWithImpl;
@override @useResult
$Res call({
 String id, String name,@JsonKey(readValue: _readProvince) String province, double latitude, double longitude,@JsonKey(readValue: _readCategories) List<String> categories, String? description, String? imageUrl, String? district, int priceEstimate, double popularityScore, String? indoorOutdoor, String? activityLevel, int likesCount, int savesCount, int commentsCount,@JsonKey(readValue: _readRatingAvg) double ratingAvg,@JsonKey(readValue: _readRatingCount) int ratingCount, bool isLiked, bool isSaved, int? userRating, List<Place>? nearbyPlaces, List<String>? amenities, String? openingHours, String? phone, String? website
});




}
/// @nodoc
class __$PlaceCopyWithImpl<$Res>
    implements _$PlaceCopyWith<$Res> {
  __$PlaceCopyWithImpl(this._self, this._then);

  final _Place _self;
  final $Res Function(_Place) _then;

/// Create a copy of Place
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? province = null,Object? latitude = null,Object? longitude = null,Object? categories = null,Object? description = freezed,Object? imageUrl = freezed,Object? district = freezed,Object? priceEstimate = null,Object? popularityScore = null,Object? indoorOutdoor = freezed,Object? activityLevel = freezed,Object? likesCount = null,Object? savesCount = null,Object? commentsCount = null,Object? ratingAvg = null,Object? ratingCount = null,Object? isLiked = null,Object? isSaved = null,Object? userRating = freezed,Object? nearbyPlaces = freezed,Object? amenities = freezed,Object? openingHours = freezed,Object? phone = freezed,Object? website = freezed,}) {
  return _then(_Place(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,province: null == province ? _self.province : province // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,categories: null == categories ? _self._categories : categories // ignore: cast_nullable_to_non_nullable
as List<String>,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,district: freezed == district ? _self.district : district // ignore: cast_nullable_to_non_nullable
as String?,priceEstimate: null == priceEstimate ? _self.priceEstimate : priceEstimate // ignore: cast_nullable_to_non_nullable
as int,popularityScore: null == popularityScore ? _self.popularityScore : popularityScore // ignore: cast_nullable_to_non_nullable
as double,indoorOutdoor: freezed == indoorOutdoor ? _self.indoorOutdoor : indoorOutdoor // ignore: cast_nullable_to_non_nullable
as String?,activityLevel: freezed == activityLevel ? _self.activityLevel : activityLevel // ignore: cast_nullable_to_non_nullable
as String?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,savesCount: null == savesCount ? _self.savesCount : savesCount // ignore: cast_nullable_to_non_nullable
as int,commentsCount: null == commentsCount ? _self.commentsCount : commentsCount // ignore: cast_nullable_to_non_nullable
as int,ratingAvg: null == ratingAvg ? _self.ratingAvg : ratingAvg // ignore: cast_nullable_to_non_nullable
as double,ratingCount: null == ratingCount ? _self.ratingCount : ratingCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,isSaved: null == isSaved ? _self.isSaved : isSaved // ignore: cast_nullable_to_non_nullable
as bool,userRating: freezed == userRating ? _self.userRating : userRating // ignore: cast_nullable_to_non_nullable
as int?,nearbyPlaces: freezed == nearbyPlaces ? _self._nearbyPlaces : nearbyPlaces // ignore: cast_nullable_to_non_nullable
as List<Place>?,amenities: freezed == amenities ? _self._amenities : amenities // ignore: cast_nullable_to_non_nullable
as List<String>?,openingHours: freezed == openingHours ? _self.openingHours : openingHours // ignore: cast_nullable_to_non_nullable
as String?,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,website: freezed == website ? _self.website : website // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$PlaceCommentUser {

 String get id; String? get name; String get email;
/// Create a copy of PlaceCommentUser
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PlaceCommentUserCopyWith<PlaceCommentUser> get copyWith => _$PlaceCommentUserCopyWithImpl<PlaceCommentUser>(this as PlaceCommentUser, _$identity);

  /// Serializes this PlaceCommentUser to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PlaceCommentUser;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PlaceCommentUser&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.email, _this.email) || other.email == _this.email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PlaceCommentUser;
  return Object.hash(runtimeType,_this.id,_this.name,_this.email);
}

@override
String toString() {
  final _this = this as PlaceCommentUser;
  return 'PlaceCommentUser(id: ${_this.id}, name: ${_this.name}, email: ${_this.email})';
}


}

/// @nodoc
abstract mixin class $PlaceCommentUserCopyWith<$Res>  {
  factory $PlaceCommentUserCopyWith(PlaceCommentUser value, $Res Function(PlaceCommentUser) _then) = _$PlaceCommentUserCopyWithImpl;
@useResult
$Res call({
 String id, String? name, String email
});




}
/// @nodoc
class _$PlaceCommentUserCopyWithImpl<$Res>
    implements $PlaceCommentUserCopyWith<$Res> {
  _$PlaceCommentUserCopyWithImpl(this._self, this._then);

  final PlaceCommentUser _self;
  final $Res Function(PlaceCommentUser) _then;

/// Create a copy of PlaceCommentUser
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = freezed,Object? email = null,}) {
  return _then(PlaceCommentUser(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [PlaceCommentUser].
extension PlaceCommentUserPatterns on PlaceCommentUser {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PlaceCommentUser value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PlaceCommentUser() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PlaceCommentUser value)  $default,){
final _that = this;
switch (_that) {
case _PlaceCommentUser():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PlaceCommentUser value)?  $default,){
final _that = this;
switch (_that) {
case _PlaceCommentUser() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String? name,  String email)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PlaceCommentUser() when $default != null:
return $default(_that.id,_that.name,_that.email);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String? name,  String email)  $default,) {final _that = this;
switch (_that) {
case _PlaceCommentUser():
return $default(_that.id,_that.name,_that.email);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String? name,  String email)?  $default,) {final _that = this;
switch (_that) {
case _PlaceCommentUser() when $default != null:
return $default(_that.id,_that.name,_that.email);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PlaceCommentUser extends PlaceCommentUser {
  const _PlaceCommentUser({required this.id, this.name, this.email = ''}): super._();
  factory _PlaceCommentUser.fromJson(Map<String, dynamic> json) => _$PlaceCommentUserFromJson(json);

@override final  String id;
@override final  String? name;
@override@JsonKey() final  String email;

/// Create a copy of PlaceCommentUser
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PlaceCommentUserCopyWith<_PlaceCommentUser> get copyWith => __$PlaceCommentUserCopyWithImpl<_PlaceCommentUser>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PlaceCommentUserToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PlaceCommentUser&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,name,email);
}

@override
String toString() {
    return 'PlaceCommentUser(id: $id, name: $name, email: $email)';
}


}

/// @nodoc
abstract mixin class _$PlaceCommentUserCopyWith<$Res> implements $PlaceCommentUserCopyWith<$Res> {
  factory _$PlaceCommentUserCopyWith(_PlaceCommentUser value, $Res Function(_PlaceCommentUser) _then) = __$PlaceCommentUserCopyWithImpl;
@override @useResult
$Res call({
 String id, String? name, String email
});




}
/// @nodoc
class __$PlaceCommentUserCopyWithImpl<$Res>
    implements _$PlaceCommentUserCopyWith<$Res> {
  __$PlaceCommentUserCopyWithImpl(this._self, this._then);

  final _PlaceCommentUser _self;
  final $Res Function(_PlaceCommentUser) _then;

/// Create a copy of PlaceCommentUser
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = freezed,Object? email = null,}) {
  return _then(_PlaceCommentUser(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: freezed == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String?,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$PlaceCommentItem {

 String get id; String get content; String get createdAt; PlaceCommentUser get user;
/// Create a copy of PlaceCommentItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PlaceCommentItemCopyWith<PlaceCommentItem> get copyWith => _$PlaceCommentItemCopyWithImpl<PlaceCommentItem>(this as PlaceCommentItem, _$identity);

  /// Serializes this PlaceCommentItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PlaceCommentItem;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PlaceCommentItem&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.content, _this.content) || other.content == _this.content)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.user, _this.user) || other.user == _this.user));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PlaceCommentItem;
  return Object.hash(runtimeType,_this.id,_this.content,_this.createdAt,_this.user);
}

@override
String toString() {
  final _this = this as PlaceCommentItem;
  return 'PlaceCommentItem(id: ${_this.id}, content: ${_this.content}, createdAt: ${_this.createdAt}, user: ${_this.user})';
}


}

/// @nodoc
abstract mixin class $PlaceCommentItemCopyWith<$Res>  {
  factory $PlaceCommentItemCopyWith(PlaceCommentItem value, $Res Function(PlaceCommentItem) _then) = _$PlaceCommentItemCopyWithImpl;
@useResult
$Res call({
 String id, String content, String createdAt, PlaceCommentUser user
});


$PlaceCommentUserCopyWith<$Res> get user;

}
/// @nodoc
class _$PlaceCommentItemCopyWithImpl<$Res>
    implements $PlaceCommentItemCopyWith<$Res> {
  _$PlaceCommentItemCopyWithImpl(this._self, this._then);

  final PlaceCommentItem _self;
  final $Res Function(PlaceCommentItem) _then;

/// Create a copy of PlaceCommentItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? content = null,Object? createdAt = null,Object? user = null,}) {
  return _then(PlaceCommentItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as PlaceCommentUser,
  ));
}
/// Create a copy of PlaceCommentItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PlaceCommentUserCopyWith<$Res> get user {
  
  return $PlaceCommentUserCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// Adds pattern-matching-related methods to [PlaceCommentItem].
extension PlaceCommentItemPatterns on PlaceCommentItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PlaceCommentItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PlaceCommentItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PlaceCommentItem value)  $default,){
final _that = this;
switch (_that) {
case _PlaceCommentItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PlaceCommentItem value)?  $default,){
final _that = this;
switch (_that) {
case _PlaceCommentItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String content,  String createdAt,  PlaceCommentUser user)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PlaceCommentItem() when $default != null:
return $default(_that.id,_that.content,_that.createdAt,_that.user);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String content,  String createdAt,  PlaceCommentUser user)  $default,) {final _that = this;
switch (_that) {
case _PlaceCommentItem():
return $default(_that.id,_that.content,_that.createdAt,_that.user);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String content,  String createdAt,  PlaceCommentUser user)?  $default,) {final _that = this;
switch (_that) {
case _PlaceCommentItem() when $default != null:
return $default(_that.id,_that.content,_that.createdAt,_that.user);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PlaceCommentItem implements PlaceCommentItem {
  const _PlaceCommentItem({required this.id, required this.content, required this.createdAt, required this.user});
  factory _PlaceCommentItem.fromJson(Map<String, dynamic> json) => _$PlaceCommentItemFromJson(json);

@override final  String id;
@override final  String content;
@override final  String createdAt;
@override final  PlaceCommentUser user;

/// Create a copy of PlaceCommentItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PlaceCommentItemCopyWith<_PlaceCommentItem> get copyWith => __$PlaceCommentItemCopyWithImpl<_PlaceCommentItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PlaceCommentItemToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PlaceCommentItem&&(identical(other.id, id) || other.id == id)&&(identical(other.content, content) || other.content == content)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.user, user) || other.user == user));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,content,createdAt,user);
}

@override
String toString() {
    return 'PlaceCommentItem(id: $id, content: $content, createdAt: $createdAt, user: $user)';
}


}

/// @nodoc
abstract mixin class _$PlaceCommentItemCopyWith<$Res> implements $PlaceCommentItemCopyWith<$Res> {
  factory _$PlaceCommentItemCopyWith(_PlaceCommentItem value, $Res Function(_PlaceCommentItem) _then) = __$PlaceCommentItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String content, String createdAt, PlaceCommentUser user
});


@override $PlaceCommentUserCopyWith<$Res> get user;

}
/// @nodoc
class __$PlaceCommentItemCopyWithImpl<$Res>
    implements _$PlaceCommentItemCopyWith<$Res> {
  __$PlaceCommentItemCopyWithImpl(this._self, this._then);

  final _PlaceCommentItem _self;
  final $Res Function(_PlaceCommentItem) _then;

/// Create a copy of PlaceCommentItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? content = null,Object? createdAt = null,Object? user = null,}) {
  return _then(_PlaceCommentItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as PlaceCommentUser,
  ));
}

/// Create a copy of PlaceCommentItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PlaceCommentUserCopyWith<$Res> get user {
  
  return $PlaceCommentUserCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// @nodoc
mixin _$PaginationInfo {

 int get page; int get limit; int get total; int get totalPages;
/// Create a copy of PaginationInfo
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PaginationInfoCopyWith<PaginationInfo> get copyWith => _$PaginationInfoCopyWithImpl<PaginationInfo>(this as PaginationInfo, _$identity);

  /// Serializes this PaginationInfo to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PaginationInfo;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PaginationInfo&&(identical(other.page, _this.page) || other.page == _this.page)&&(identical(other.limit, _this.limit) || other.limit == _this.limit)&&(identical(other.total, _this.total) || other.total == _this.total)&&(identical(other.totalPages, _this.totalPages) || other.totalPages == _this.totalPages));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PaginationInfo;
  return Object.hash(runtimeType,_this.page,_this.limit,_this.total,_this.totalPages);
}

@override
String toString() {
  final _this = this as PaginationInfo;
  return 'PaginationInfo(page: ${_this.page}, limit: ${_this.limit}, total: ${_this.total}, totalPages: ${_this.totalPages})';
}


}

/// @nodoc
abstract mixin class $PaginationInfoCopyWith<$Res>  {
  factory $PaginationInfoCopyWith(PaginationInfo value, $Res Function(PaginationInfo) _then) = _$PaginationInfoCopyWithImpl;
@useResult
$Res call({
 int page, int limit, int total, int totalPages
});




}
/// @nodoc
class _$PaginationInfoCopyWithImpl<$Res>
    implements $PaginationInfoCopyWith<$Res> {
  _$PaginationInfoCopyWithImpl(this._self, this._then);

  final PaginationInfo _self;
  final $Res Function(PaginationInfo) _then;

/// Create a copy of PaginationInfo
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? page = null,Object? limit = null,Object? total = null,Object? totalPages = null,}) {
  return _then(PaginationInfo(
page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,limit: null == limit ? _self.limit : limit // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,totalPages: null == totalPages ? _self.totalPages : totalPages // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [PaginationInfo].
extension PaginationInfoPatterns on PaginationInfo {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PaginationInfo value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PaginationInfo() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PaginationInfo value)  $default,){
final _that = this;
switch (_that) {
case _PaginationInfo():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PaginationInfo value)?  $default,){
final _that = this;
switch (_that) {
case _PaginationInfo() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int page,  int limit,  int total,  int totalPages)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PaginationInfo() when $default != null:
return $default(_that.page,_that.limit,_that.total,_that.totalPages);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int page,  int limit,  int total,  int totalPages)  $default,) {final _that = this;
switch (_that) {
case _PaginationInfo():
return $default(_that.page,_that.limit,_that.total,_that.totalPages);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int page,  int limit,  int total,  int totalPages)?  $default,) {final _that = this;
switch (_that) {
case _PaginationInfo() when $default != null:
return $default(_that.page,_that.limit,_that.total,_that.totalPages);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PaginationInfo implements PaginationInfo {
  const _PaginationInfo({this.page = 1, this.limit = 12, this.total = 0, this.totalPages = 1});
  factory _PaginationInfo.fromJson(Map<String, dynamic> json) => _$PaginationInfoFromJson(json);

@override@JsonKey() final  int page;
@override@JsonKey() final  int limit;
@override@JsonKey() final  int total;
@override@JsonKey() final  int totalPages;

/// Create a copy of PaginationInfo
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PaginationInfoCopyWith<_PaginationInfo> get copyWith => __$PaginationInfoCopyWithImpl<_PaginationInfo>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PaginationInfoToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PaginationInfo&&(identical(other.page, page) || other.page == page)&&(identical(other.limit, limit) || other.limit == limit)&&(identical(other.total, total) || other.total == total)&&(identical(other.totalPages, totalPages) || other.totalPages == totalPages));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,page,limit,total,totalPages);
}

@override
String toString() {
    return 'PaginationInfo(page: $page, limit: $limit, total: $total, totalPages: $totalPages)';
}


}

/// @nodoc
abstract mixin class _$PaginationInfoCopyWith<$Res> implements $PaginationInfoCopyWith<$Res> {
  factory _$PaginationInfoCopyWith(_PaginationInfo value, $Res Function(_PaginationInfo) _then) = __$PaginationInfoCopyWithImpl;
@override @useResult
$Res call({
 int page, int limit, int total, int totalPages
});




}
/// @nodoc
class __$PaginationInfoCopyWithImpl<$Res>
    implements _$PaginationInfoCopyWith<$Res> {
  __$PaginationInfoCopyWithImpl(this._self, this._then);

  final _PaginationInfo _self;
  final $Res Function(_PaginationInfo) _then;

/// Create a copy of PaginationInfo
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? page = null,Object? limit = null,Object? total = null,Object? totalPages = null,}) {
  return _then(_PaginationInfo(
page: null == page ? _self.page : page // ignore: cast_nullable_to_non_nullable
as int,limit: null == limit ? _self.limit : limit // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,totalPages: null == totalPages ? _self.totalPages : totalPages // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}


/// @nodoc
mixin _$PaginatedPlacesResponse {

 List<Place> get items; PaginationInfo get pagination;
/// Create a copy of PaginatedPlacesResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PaginatedPlacesResponseCopyWith<PaginatedPlacesResponse> get copyWith => _$PaginatedPlacesResponseCopyWithImpl<PaginatedPlacesResponse>(this as PaginatedPlacesResponse, _$identity);

  /// Serializes this PaginatedPlacesResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as PaginatedPlacesResponse;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PaginatedPlacesResponse&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.pagination, _this.pagination) || other.pagination == _this.pagination));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as PaginatedPlacesResponse;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.items),_this.pagination);
}

@override
String toString() {
  final _this = this as PaginatedPlacesResponse;
  return 'PaginatedPlacesResponse(items: ${_this.items}, pagination: ${_this.pagination})';
}


}

/// @nodoc
abstract mixin class $PaginatedPlacesResponseCopyWith<$Res>  {
  factory $PaginatedPlacesResponseCopyWith(PaginatedPlacesResponse value, $Res Function(PaginatedPlacesResponse) _then) = _$PaginatedPlacesResponseCopyWithImpl;
@useResult
$Res call({
 List<Place> items, PaginationInfo pagination
});


$PaginationInfoCopyWith<$Res> get pagination;

}
/// @nodoc
class _$PaginatedPlacesResponseCopyWithImpl<$Res>
    implements $PaginatedPlacesResponseCopyWith<$Res> {
  _$PaginatedPlacesResponseCopyWithImpl(this._self, this._then);

  final PaginatedPlacesResponse _self;
  final $Res Function(PaginatedPlacesResponse) _then;

/// Create a copy of PaginatedPlacesResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? items = null,Object? pagination = null,}) {
  return _then(PaginatedPlacesResponse(
items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<Place>,pagination: null == pagination ? _self.pagination : pagination // ignore: cast_nullable_to_non_nullable
as PaginationInfo,
  ));
}
/// Create a copy of PaginatedPlacesResponse
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PaginationInfoCopyWith<$Res> get pagination {
  
  return $PaginationInfoCopyWith<$Res>(_self.pagination, (value) {
    return _then(_self.copyWith(pagination: value));
  });
}
}


/// Adds pattern-matching-related methods to [PaginatedPlacesResponse].
extension PaginatedPlacesResponsePatterns on PaginatedPlacesResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PaginatedPlacesResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PaginatedPlacesResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PaginatedPlacesResponse value)  $default,){
final _that = this;
switch (_that) {
case _PaginatedPlacesResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PaginatedPlacesResponse value)?  $default,){
final _that = this;
switch (_that) {
case _PaginatedPlacesResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<Place> items,  PaginationInfo pagination)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PaginatedPlacesResponse() when $default != null:
return $default(_that.items,_that.pagination);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<Place> items,  PaginationInfo pagination)  $default,) {final _that = this;
switch (_that) {
case _PaginatedPlacesResponse():
return $default(_that.items,_that.pagination);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<Place> items,  PaginationInfo pagination)?  $default,) {final _that = this;
switch (_that) {
case _PaginatedPlacesResponse() when $default != null:
return $default(_that.items,_that.pagination);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PaginatedPlacesResponse implements PaginatedPlacesResponse {
  const _PaginatedPlacesResponse({ List<Place> items = const [], required this.pagination}): _items = items;
  factory _PaginatedPlacesResponse.fromJson(Map<String, dynamic> json) => _$PaginatedPlacesResponseFromJson(json);

 final  List<Place> _items;
@override@JsonKey() List<Place> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}

@override final  PaginationInfo pagination;

/// Create a copy of PaginatedPlacesResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PaginatedPlacesResponseCopyWith<_PaginatedPlacesResponse> get copyWith => __$PaginatedPlacesResponseCopyWithImpl<_PaginatedPlacesResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PaginatedPlacesResponseToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _PaginatedPlacesResponse&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.pagination, pagination) || other.pagination == pagination));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_items),pagination);
}

@override
String toString() {
    return 'PaginatedPlacesResponse(items: $items, pagination: $pagination)';
}


}

/// @nodoc
abstract mixin class _$PaginatedPlacesResponseCopyWith<$Res> implements $PaginatedPlacesResponseCopyWith<$Res> {
  factory _$PaginatedPlacesResponseCopyWith(_PaginatedPlacesResponse value, $Res Function(_PaginatedPlacesResponse) _then) = __$PaginatedPlacesResponseCopyWithImpl;
@override @useResult
$Res call({
 List<Place> items, PaginationInfo pagination
});


@override $PaginationInfoCopyWith<$Res> get pagination;

}
/// @nodoc
class __$PaginatedPlacesResponseCopyWithImpl<$Res>
    implements _$PaginatedPlacesResponseCopyWith<$Res> {
  __$PaginatedPlacesResponseCopyWithImpl(this._self, this._then);

  final _PaginatedPlacesResponse _self;
  final $Res Function(_PaginatedPlacesResponse) _then;

/// Create a copy of PaginatedPlacesResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? items = null,Object? pagination = null,}) {
  return _then(_PaginatedPlacesResponse(
items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<Place>,pagination: null == pagination ? _self.pagination : pagination // ignore: cast_nullable_to_non_nullable
as PaginationInfo,
  ));
}

/// Create a copy of PaginatedPlacesResponse
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$PaginationInfoCopyWith<$Res> get pagination {
  
  return $PaginationInfoCopyWith<$Res>(_self.pagination, (value) {
    return _then(_self.copyWith(pagination: value));
  });
}
}

// dart format on
