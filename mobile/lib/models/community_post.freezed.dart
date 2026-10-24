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
mixin _$CommunityPost {

 String get id; String get content; String get userId; String get userName; DateTime get createdAt; List<String>? get imageUrls; int get likesCount; int get commentsCount; bool get isLiked; String? get tripId;
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
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommunityPost&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.content, _this.content) || other.content == _this.content)&&(identical(other.userId, _this.userId) || other.userId == _this.userId)&&(identical(other.userName, _this.userName) || other.userName == _this.userName)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&const DeepCollectionEquality().equals(other.imageUrls, _this.imageUrls)&&(identical(other.likesCount, _this.likesCount) || other.likesCount == _this.likesCount)&&(identical(other.commentsCount, _this.commentsCount) || other.commentsCount == _this.commentsCount)&&(identical(other.isLiked, _this.isLiked) || other.isLiked == _this.isLiked)&&(identical(other.tripId, _this.tripId) || other.tripId == _this.tripId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as CommunityPost;
  return Object.hash(runtimeType,_this.id,_this.content,_this.userId,_this.userName,_this.createdAt,const DeepCollectionEquality().hash(_this.imageUrls),_this.likesCount,_this.commentsCount,_this.isLiked,_this.tripId);
}

@override
String toString() {
  final _this = this as CommunityPost;
  return 'CommunityPost(id: ${_this.id}, content: ${_this.content}, userId: ${_this.userId}, userName: ${_this.userName}, createdAt: ${_this.createdAt}, imageUrls: ${_this.imageUrls}, likesCount: ${_this.likesCount}, commentsCount: ${_this.commentsCount}, isLiked: ${_this.isLiked}, tripId: ${_this.tripId})';
}


}

/// @nodoc
abstract mixin class $CommunityPostCopyWith<$Res>  {
  factory $CommunityPostCopyWith(CommunityPost value, $Res Function(CommunityPost) _then) = _$CommunityPostCopyWithImpl;
@useResult
$Res call({
 String id, String content, String userId, String userName, DateTime createdAt, List<String>? imageUrls, int likesCount, int commentsCount, bool isLiked, String? tripId
});




}
/// @nodoc
class _$CommunityPostCopyWithImpl<$Res>
    implements $CommunityPostCopyWith<$Res> {
  _$CommunityPostCopyWithImpl(this._self, this._then);

  final CommunityPost _self;
  final $Res Function(CommunityPost) _then;

/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? content = null,Object? userId = null,Object? userName = null,Object? createdAt = null,Object? imageUrls = freezed,Object? likesCount = null,Object? commentsCount = null,Object? isLiked = null,Object? tripId = freezed,}) {
  return _then(CommunityPost(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,imageUrls: freezed == imageUrls ? _self.imageUrls : imageUrls // ignore: cast_nullable_to_non_nullable
as List<String>?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,commentsCount: null == commentsCount ? _self.commentsCount : commentsCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,tripId: freezed == tripId ? _self.tripId : tripId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String content,  String userId,  String userName,  DateTime createdAt,  List<String>? imageUrls,  int likesCount,  int commentsCount,  bool isLiked,  String? tripId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommunityPost() when $default != null:
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.imageUrls,_that.likesCount,_that.commentsCount,_that.isLiked,_that.tripId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String content,  String userId,  String userName,  DateTime createdAt,  List<String>? imageUrls,  int likesCount,  int commentsCount,  bool isLiked,  String? tripId)  $default,) {final _that = this;
switch (_that) {
case _CommunityPost():
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.imageUrls,_that.likesCount,_that.commentsCount,_that.isLiked,_that.tripId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String content,  String userId,  String userName,  DateTime createdAt,  List<String>? imageUrls,  int likesCount,  int commentsCount,  bool isLiked,  String? tripId)?  $default,) {final _that = this;
switch (_that) {
case _CommunityPost() when $default != null:
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.imageUrls,_that.likesCount,_that.commentsCount,_that.isLiked,_that.tripId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CommunityPost implements CommunityPost {
  const _CommunityPost({required this.id, required this.content, required this.userId, required this.userName, required this.createdAt,  List<String>? imageUrls, this.likesCount = 0, this.commentsCount = 0, this.isLiked = false, this.tripId}): _imageUrls = imageUrls;
  factory _CommunityPost.fromJson(Map<String, dynamic> json) => _$CommunityPostFromJson(json);

@override final  String id;
@override final  String content;
@override final  String userId;
@override final  String userName;
@override final  DateTime createdAt;
 final  List<String>? _imageUrls;
@override List<String>? get imageUrls {
  final value = _imageUrls;
  if (value == null) return null;
  if (_imageUrls is EqualUnmodifiableListView) return _imageUrls;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override@JsonKey() final  int likesCount;
@override@JsonKey() final  int commentsCount;
@override@JsonKey() final  bool isLiked;
@override final  String? tripId;

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
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommunityPost&&(identical(other.id, id) || other.id == id)&&(identical(other.content, content) || other.content == content)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.userName, userName) || other.userName == userName)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&const DeepCollectionEquality().equals(other.imageUrls, _imageUrls)&&(identical(other.likesCount, likesCount) || other.likesCount == likesCount)&&(identical(other.commentsCount, commentsCount) || other.commentsCount == commentsCount)&&(identical(other.isLiked, isLiked) || other.isLiked == isLiked)&&(identical(other.tripId, tripId) || other.tripId == tripId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,content,userId,userName,createdAt,const DeepCollectionEquality().hash(_imageUrls),likesCount,commentsCount,isLiked,tripId);
}

@override
String toString() {
    return 'CommunityPost(id: $id, content: $content, userId: $userId, userName: $userName, createdAt: $createdAt, imageUrls: $imageUrls, likesCount: $likesCount, commentsCount: $commentsCount, isLiked: $isLiked, tripId: $tripId)';
}


}

/// @nodoc
abstract mixin class _$CommunityPostCopyWith<$Res> implements $CommunityPostCopyWith<$Res> {
  factory _$CommunityPostCopyWith(_CommunityPost value, $Res Function(_CommunityPost) _then) = __$CommunityPostCopyWithImpl;
@override @useResult
$Res call({
 String id, String content, String userId, String userName, DateTime createdAt, List<String>? imageUrls, int likesCount, int commentsCount, bool isLiked, String? tripId
});




}
/// @nodoc
class __$CommunityPostCopyWithImpl<$Res>
    implements _$CommunityPostCopyWith<$Res> {
  __$CommunityPostCopyWithImpl(this._self, this._then);

  final _CommunityPost _self;
  final $Res Function(_CommunityPost) _then;

/// Create a copy of CommunityPost
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? content = null,Object? userId = null,Object? userName = null,Object? createdAt = null,Object? imageUrls = freezed,Object? likesCount = null,Object? commentsCount = null,Object? isLiked = null,Object? tripId = freezed,}) {
  return _then(_CommunityPost(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,imageUrls: freezed == imageUrls ? _self._imageUrls : imageUrls // ignore: cast_nullable_to_non_nullable
as List<String>?,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,commentsCount: null == commentsCount ? _self.commentsCount : commentsCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,tripId: freezed == tripId ? _self.tripId : tripId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$Comment {

 String get id; String get content; String get userId; String get userName; DateTime get createdAt; int get likesCount; bool get isLiked;
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
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Comment&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.content, _this.content) || other.content == _this.content)&&(identical(other.userId, _this.userId) || other.userId == _this.userId)&&(identical(other.userName, _this.userName) || other.userName == _this.userName)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.likesCount, _this.likesCount) || other.likesCount == _this.likesCount)&&(identical(other.isLiked, _this.isLiked) || other.isLiked == _this.isLiked));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as Comment;
  return Object.hash(runtimeType,_this.id,_this.content,_this.userId,_this.userName,_this.createdAt,_this.likesCount,_this.isLiked);
}

@override
String toString() {
  final _this = this as Comment;
  return 'Comment(id: ${_this.id}, content: ${_this.content}, userId: ${_this.userId}, userName: ${_this.userName}, createdAt: ${_this.createdAt}, likesCount: ${_this.likesCount}, isLiked: ${_this.isLiked})';
}


}

/// @nodoc
abstract mixin class $CommentCopyWith<$Res>  {
  factory $CommentCopyWith(Comment value, $Res Function(Comment) _then) = _$CommentCopyWithImpl;
@useResult
$Res call({
 String id, String content, String userId, String userName, DateTime createdAt, int likesCount, bool isLiked
});




}
/// @nodoc
class _$CommentCopyWithImpl<$Res>
    implements $CommentCopyWith<$Res> {
  _$CommentCopyWithImpl(this._self, this._then);

  final Comment _self;
  final $Res Function(Comment) _then;

/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? content = null,Object? userId = null,Object? userName = null,Object? createdAt = null,Object? likesCount = null,Object? isLiked = null,}) {
  return _then(Comment(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,
  ));
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String content,  String userId,  String userName,  DateTime createdAt,  int likesCount,  bool isLiked)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Comment() when $default != null:
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.likesCount,_that.isLiked);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String content,  String userId,  String userName,  DateTime createdAt,  int likesCount,  bool isLiked)  $default,) {final _that = this;
switch (_that) {
case _Comment():
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.likesCount,_that.isLiked);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String content,  String userId,  String userName,  DateTime createdAt,  int likesCount,  bool isLiked)?  $default,) {final _that = this;
switch (_that) {
case _Comment() when $default != null:
return $default(_that.id,_that.content,_that.userId,_that.userName,_that.createdAt,_that.likesCount,_that.isLiked);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Comment implements Comment {
  const _Comment({required this.id, required this.content, required this.userId, required this.userName, required this.createdAt, this.likesCount = 0, this.isLiked = false});
  factory _Comment.fromJson(Map<String, dynamic> json) => _$CommentFromJson(json);

@override final  String id;
@override final  String content;
@override final  String userId;
@override final  String userName;
@override final  DateTime createdAt;
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
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Comment&&(identical(other.id, id) || other.id == id)&&(identical(other.content, content) || other.content == content)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.userName, userName) || other.userName == userName)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.likesCount, likesCount) || other.likesCount == likesCount)&&(identical(other.isLiked, isLiked) || other.isLiked == isLiked));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,content,userId,userName,createdAt,likesCount,isLiked);
}

@override
String toString() {
    return 'Comment(id: $id, content: $content, userId: $userId, userName: $userName, createdAt: $createdAt, likesCount: $likesCount, isLiked: $isLiked)';
}


}

/// @nodoc
abstract mixin class _$CommentCopyWith<$Res> implements $CommentCopyWith<$Res> {
  factory _$CommentCopyWith(_Comment value, $Res Function(_Comment) _then) = __$CommentCopyWithImpl;
@override @useResult
$Res call({
 String id, String content, String userId, String userName, DateTime createdAt, int likesCount, bool isLiked
});




}
/// @nodoc
class __$CommentCopyWithImpl<$Res>
    implements _$CommentCopyWith<$Res> {
  __$CommentCopyWithImpl(this._self, this._then);

  final _Comment _self;
  final $Res Function(_Comment) _then;

/// Create a copy of Comment
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? content = null,Object? userId = null,Object? userName = null,Object? createdAt = null,Object? likesCount = null,Object? isLiked = null,}) {
  return _then(_Comment(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,likesCount: null == likesCount ? _self.likesCount : likesCount // ignore: cast_nullable_to_non_nullable
as int,isLiked: null == isLiked ? _self.isLiked : isLiked // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

// dart format on
