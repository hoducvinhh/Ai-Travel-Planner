// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'chat_message.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ChatMessage {

 String get id; String get content; bool get isUser; DateTime get timestamp; String? get mode; List<ChatSource>? get sources; List<WebSourceCitation>? get webSources; String? get disclaimer; String? get routerReason; bool get isStreaming;
/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ChatMessageCopyWith<ChatMessage> get copyWith => _$ChatMessageCopyWithImpl<ChatMessage>(this as ChatMessage, _$identity);

  /// Serializes this ChatMessage to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ChatMessage;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ChatMessage&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.content, _this.content) || other.content == _this.content)&&(identical(other.isUser, _this.isUser) || other.isUser == _this.isUser)&&(identical(other.timestamp, _this.timestamp) || other.timestamp == _this.timestamp)&&(identical(other.mode, _this.mode) || other.mode == _this.mode)&&const DeepCollectionEquality().equals(other.sources, _this.sources)&&const DeepCollectionEquality().equals(other.webSources, _this.webSources)&&(identical(other.disclaimer, _this.disclaimer) || other.disclaimer == _this.disclaimer)&&(identical(other.routerReason, _this.routerReason) || other.routerReason == _this.routerReason)&&(identical(other.isStreaming, _this.isStreaming) || other.isStreaming == _this.isStreaming));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ChatMessage;
  return Object.hash(runtimeType,_this.id,_this.content,_this.isUser,_this.timestamp,_this.mode,const DeepCollectionEquality().hash(_this.sources),const DeepCollectionEquality().hash(_this.webSources),_this.disclaimer,_this.routerReason,_this.isStreaming);
}

@override
String toString() {
  final _this = this as ChatMessage;
  return 'ChatMessage(id: ${_this.id}, content: ${_this.content}, isUser: ${_this.isUser}, timestamp: ${_this.timestamp}, mode: ${_this.mode}, sources: ${_this.sources}, webSources: ${_this.webSources}, disclaimer: ${_this.disclaimer}, routerReason: ${_this.routerReason}, isStreaming: ${_this.isStreaming})';
}


}

/// @nodoc
abstract mixin class $ChatMessageCopyWith<$Res>  {
  factory $ChatMessageCopyWith(ChatMessage value, $Res Function(ChatMessage) _then) = _$ChatMessageCopyWithImpl;
@useResult
$Res call({
 String id, String content, bool isUser, DateTime timestamp, String? mode, List<ChatSource>? sources, List<WebSourceCitation>? webSources, String? disclaimer, String? routerReason, bool isStreaming
});




}
/// @nodoc
class _$ChatMessageCopyWithImpl<$Res>
    implements $ChatMessageCopyWith<$Res> {
  _$ChatMessageCopyWithImpl(this._self, this._then);

  final ChatMessage _self;
  final $Res Function(ChatMessage) _then;

/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? content = null,Object? isUser = null,Object? timestamp = null,Object? mode = freezed,Object? sources = freezed,Object? webSources = freezed,Object? disclaimer = freezed,Object? routerReason = freezed,Object? isStreaming = null,}) {
  return _then(ChatMessage(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,isUser: null == isUser ? _self.isUser : isUser // ignore: cast_nullable_to_non_nullable
as bool,timestamp: null == timestamp ? _self.timestamp : timestamp // ignore: cast_nullable_to_non_nullable
as DateTime,mode: freezed == mode ? _self.mode : mode // ignore: cast_nullable_to_non_nullable
as String?,sources: freezed == sources ? _self.sources : sources // ignore: cast_nullable_to_non_nullable
as List<ChatSource>?,webSources: freezed == webSources ? _self.webSources : webSources // ignore: cast_nullable_to_non_nullable
as List<WebSourceCitation>?,disclaimer: freezed == disclaimer ? _self.disclaimer : disclaimer // ignore: cast_nullable_to_non_nullable
as String?,routerReason: freezed == routerReason ? _self.routerReason : routerReason // ignore: cast_nullable_to_non_nullable
as String?,isStreaming: null == isStreaming ? _self.isStreaming : isStreaming // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [ChatMessage].
extension ChatMessagePatterns on ChatMessage {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ChatMessage value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ChatMessage() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ChatMessage value)  $default,){
final _that = this;
switch (_that) {
case _ChatMessage():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ChatMessage value)?  $default,){
final _that = this;
switch (_that) {
case _ChatMessage() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String content,  bool isUser,  DateTime timestamp,  String? mode,  List<ChatSource>? sources,  List<WebSourceCitation>? webSources,  String? disclaimer,  String? routerReason,  bool isStreaming)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ChatMessage() when $default != null:
return $default(_that.id,_that.content,_that.isUser,_that.timestamp,_that.mode,_that.sources,_that.webSources,_that.disclaimer,_that.routerReason,_that.isStreaming);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String content,  bool isUser,  DateTime timestamp,  String? mode,  List<ChatSource>? sources,  List<WebSourceCitation>? webSources,  String? disclaimer,  String? routerReason,  bool isStreaming)  $default,) {final _that = this;
switch (_that) {
case _ChatMessage():
return $default(_that.id,_that.content,_that.isUser,_that.timestamp,_that.mode,_that.sources,_that.webSources,_that.disclaimer,_that.routerReason,_that.isStreaming);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String content,  bool isUser,  DateTime timestamp,  String? mode,  List<ChatSource>? sources,  List<WebSourceCitation>? webSources,  String? disclaimer,  String? routerReason,  bool isStreaming)?  $default,) {final _that = this;
switch (_that) {
case _ChatMessage() when $default != null:
return $default(_that.id,_that.content,_that.isUser,_that.timestamp,_that.mode,_that.sources,_that.webSources,_that.disclaimer,_that.routerReason,_that.isStreaming);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ChatMessage implements ChatMessage {
  const _ChatMessage({required this.id, required this.content, required this.isUser, required this.timestamp, this.mode,  List<ChatSource>? sources,  List<WebSourceCitation>? webSources, this.disclaimer, this.routerReason, this.isStreaming = false}): _sources = sources,_webSources = webSources;
  factory _ChatMessage.fromJson(Map<String, dynamic> json) => _$ChatMessageFromJson(json);

@override final  String id;
@override final  String content;
@override final  bool isUser;
@override final  DateTime timestamp;
@override final  String? mode;
 final  List<ChatSource>? _sources;
@override List<ChatSource>? get sources {
  final value = _sources;
  if (value == null) return null;
  if (_sources is EqualUnmodifiableListView) return _sources;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

 final  List<WebSourceCitation>? _webSources;
@override List<WebSourceCitation>? get webSources {
  final value = _webSources;
  if (value == null) return null;
  if (_webSources is EqualUnmodifiableListView) return _webSources;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  String? disclaimer;
@override final  String? routerReason;
@override@JsonKey() final  bool isStreaming;

/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ChatMessageCopyWith<_ChatMessage> get copyWith => __$ChatMessageCopyWithImpl<_ChatMessage>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ChatMessageToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ChatMessage&&(identical(other.id, id) || other.id == id)&&(identical(other.content, content) || other.content == content)&&(identical(other.isUser, isUser) || other.isUser == isUser)&&(identical(other.timestamp, timestamp) || other.timestamp == timestamp)&&(identical(other.mode, mode) || other.mode == mode)&&const DeepCollectionEquality().equals(other.sources, _sources)&&const DeepCollectionEquality().equals(other.webSources, _webSources)&&(identical(other.disclaimer, disclaimer) || other.disclaimer == disclaimer)&&(identical(other.routerReason, routerReason) || other.routerReason == routerReason)&&(identical(other.isStreaming, isStreaming) || other.isStreaming == isStreaming));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,content,isUser,timestamp,mode,const DeepCollectionEquality().hash(_sources),const DeepCollectionEquality().hash(_webSources),disclaimer,routerReason,isStreaming);
}

@override
String toString() {
    return 'ChatMessage(id: $id, content: $content, isUser: $isUser, timestamp: $timestamp, mode: $mode, sources: $sources, webSources: $webSources, disclaimer: $disclaimer, routerReason: $routerReason, isStreaming: $isStreaming)';
}


}

/// @nodoc
abstract mixin class _$ChatMessageCopyWith<$Res> implements $ChatMessageCopyWith<$Res> {
  factory _$ChatMessageCopyWith(_ChatMessage value, $Res Function(_ChatMessage) _then) = __$ChatMessageCopyWithImpl;
@override @useResult
$Res call({
 String id, String content, bool isUser, DateTime timestamp, String? mode, List<ChatSource>? sources, List<WebSourceCitation>? webSources, String? disclaimer, String? routerReason, bool isStreaming
});




}
/// @nodoc
class __$ChatMessageCopyWithImpl<$Res>
    implements _$ChatMessageCopyWith<$Res> {
  __$ChatMessageCopyWithImpl(this._self, this._then);

  final _ChatMessage _self;
  final $Res Function(_ChatMessage) _then;

/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? content = null,Object? isUser = null,Object? timestamp = null,Object? mode = freezed,Object? sources = freezed,Object? webSources = freezed,Object? disclaimer = freezed,Object? routerReason = freezed,Object? isStreaming = null,}) {
  return _then(_ChatMessage(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,content: null == content ? _self.content : content // ignore: cast_nullable_to_non_nullable
as String,isUser: null == isUser ? _self.isUser : isUser // ignore: cast_nullable_to_non_nullable
as bool,timestamp: null == timestamp ? _self.timestamp : timestamp // ignore: cast_nullable_to_non_nullable
as DateTime,mode: freezed == mode ? _self.mode : mode // ignore: cast_nullable_to_non_nullable
as String?,sources: freezed == sources ? _self._sources : sources // ignore: cast_nullable_to_non_nullable
as List<ChatSource>?,webSources: freezed == webSources ? _self._webSources : webSources // ignore: cast_nullable_to_non_nullable
as List<WebSourceCitation>?,disclaimer: freezed == disclaimer ? _self.disclaimer : disclaimer // ignore: cast_nullable_to_non_nullable
as String?,routerReason: freezed == routerReason ? _self.routerReason : routerReason // ignore: cast_nullable_to_non_nullable
as String?,isStreaming: null == isStreaming ? _self.isStreaming : isStreaming // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$ChatSource {

 String get id;@JsonKey(name: 'chunk_type') String? get chunkType; String get title; String? get url;@JsonKey(readValue: _readExcerpt) String? get excerpt; double get similarity;
/// Create a copy of ChatSource
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ChatSourceCopyWith<ChatSource> get copyWith => _$ChatSourceCopyWithImpl<ChatSource>(this as ChatSource, _$identity);

  /// Serializes this ChatSource to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ChatSource;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ChatSource&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.chunkType, _this.chunkType) || other.chunkType == _this.chunkType)&&(identical(other.title, _this.title) || other.title == _this.title)&&(identical(other.url, _this.url) || other.url == _this.url)&&(identical(other.excerpt, _this.excerpt) || other.excerpt == _this.excerpt)&&(identical(other.similarity, _this.similarity) || other.similarity == _this.similarity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ChatSource;
  return Object.hash(runtimeType,_this.id,_this.chunkType,_this.title,_this.url,_this.excerpt,_this.similarity);
}

@override
String toString() {
  final _this = this as ChatSource;
  return 'ChatSource(id: ${_this.id}, chunkType: ${_this.chunkType}, title: ${_this.title}, url: ${_this.url}, excerpt: ${_this.excerpt}, similarity: ${_this.similarity})';
}


}

/// @nodoc
abstract mixin class $ChatSourceCopyWith<$Res>  {
  factory $ChatSourceCopyWith(ChatSource value, $Res Function(ChatSource) _then) = _$ChatSourceCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'chunk_type') String? chunkType, String title, String? url,@JsonKey(readValue: _readExcerpt) String? excerpt, double similarity
});




}
/// @nodoc
class _$ChatSourceCopyWithImpl<$Res>
    implements $ChatSourceCopyWith<$Res> {
  _$ChatSourceCopyWithImpl(this._self, this._then);

  final ChatSource _self;
  final $Res Function(ChatSource) _then;

/// Create a copy of ChatSource
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? chunkType = freezed,Object? title = null,Object? url = freezed,Object? excerpt = freezed,Object? similarity = null,}) {
  return _then(ChatSource(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,chunkType: freezed == chunkType ? _self.chunkType : chunkType // ignore: cast_nullable_to_non_nullable
as String?,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,url: freezed == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String?,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,similarity: null == similarity ? _self.similarity : similarity // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [ChatSource].
extension ChatSourcePatterns on ChatSource {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ChatSource value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ChatSource() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ChatSource value)  $default,){
final _that = this;
switch (_that) {
case _ChatSource():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ChatSource value)?  $default,){
final _that = this;
switch (_that) {
case _ChatSource() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'chunk_type')  String? chunkType,  String title,  String? url, @JsonKey(readValue: _readExcerpt)  String? excerpt,  double similarity)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ChatSource() when $default != null:
return $default(_that.id,_that.chunkType,_that.title,_that.url,_that.excerpt,_that.similarity);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'chunk_type')  String? chunkType,  String title,  String? url, @JsonKey(readValue: _readExcerpt)  String? excerpt,  double similarity)  $default,) {final _that = this;
switch (_that) {
case _ChatSource():
return $default(_that.id,_that.chunkType,_that.title,_that.url,_that.excerpt,_that.similarity);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'chunk_type')  String? chunkType,  String title,  String? url, @JsonKey(readValue: _readExcerpt)  String? excerpt,  double similarity)?  $default,) {final _that = this;
switch (_that) {
case _ChatSource() when $default != null:
return $default(_that.id,_that.chunkType,_that.title,_that.url,_that.excerpt,_that.similarity);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ChatSource implements ChatSource {
  const _ChatSource({this.id = '', @JsonKey(name: 'chunk_type') this.chunkType, required this.title, this.url, @JsonKey(readValue: _readExcerpt) this.excerpt, this.similarity = 0.0});
  factory _ChatSource.fromJson(Map<String, dynamic> json) => _$ChatSourceFromJson(json);

@override@JsonKey() final  String id;
@override@JsonKey(name: 'chunk_type') final  String? chunkType;
@override final  String title;
@override final  String? url;
@override@JsonKey(readValue: _readExcerpt) final  String? excerpt;
@override@JsonKey() final  double similarity;

/// Create a copy of ChatSource
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ChatSourceCopyWith<_ChatSource> get copyWith => __$ChatSourceCopyWithImpl<_ChatSource>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ChatSourceToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ChatSource&&(identical(other.id, id) || other.id == id)&&(identical(other.chunkType, chunkType) || other.chunkType == chunkType)&&(identical(other.title, title) || other.title == title)&&(identical(other.url, url) || other.url == url)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.similarity, similarity) || other.similarity == similarity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,chunkType,title,url,excerpt,similarity);
}

@override
String toString() {
    return 'ChatSource(id: $id, chunkType: $chunkType, title: $title, url: $url, excerpt: $excerpt, similarity: $similarity)';
}


}

/// @nodoc
abstract mixin class _$ChatSourceCopyWith<$Res> implements $ChatSourceCopyWith<$Res> {
  factory _$ChatSourceCopyWith(_ChatSource value, $Res Function(_ChatSource) _then) = __$ChatSourceCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'chunk_type') String? chunkType, String title, String? url,@JsonKey(readValue: _readExcerpt) String? excerpt, double similarity
});




}
/// @nodoc
class __$ChatSourceCopyWithImpl<$Res>
    implements _$ChatSourceCopyWith<$Res> {
  __$ChatSourceCopyWithImpl(this._self, this._then);

  final _ChatSource _self;
  final $Res Function(_ChatSource) _then;

/// Create a copy of ChatSource
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? chunkType = freezed,Object? title = null,Object? url = freezed,Object? excerpt = freezed,Object? similarity = null,}) {
  return _then(_ChatSource(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,chunkType: freezed == chunkType ? _self.chunkType : chunkType // ignore: cast_nullable_to_non_nullable
as String?,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,url: freezed == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String?,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,similarity: null == similarity ? _self.similarity : similarity // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}


/// @nodoc
mixin _$WebSourceCitation {

 String get title; String get url; String? get domain;
/// Create a copy of WebSourceCitation
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$WebSourceCitationCopyWith<WebSourceCitation> get copyWith => _$WebSourceCitationCopyWithImpl<WebSourceCitation>(this as WebSourceCitation, _$identity);

  /// Serializes this WebSourceCitation to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as WebSourceCitation;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is WebSourceCitation&&(identical(other.title, _this.title) || other.title == _this.title)&&(identical(other.url, _this.url) || other.url == _this.url)&&(identical(other.domain, _this.domain) || other.domain == _this.domain));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as WebSourceCitation;
  return Object.hash(runtimeType,_this.title,_this.url,_this.domain);
}

@override
String toString() {
  final _this = this as WebSourceCitation;
  return 'WebSourceCitation(title: ${_this.title}, url: ${_this.url}, domain: ${_this.domain})';
}


}

/// @nodoc
abstract mixin class $WebSourceCitationCopyWith<$Res>  {
  factory $WebSourceCitationCopyWith(WebSourceCitation value, $Res Function(WebSourceCitation) _then) = _$WebSourceCitationCopyWithImpl;
@useResult
$Res call({
 String title, String url, String? domain
});




}
/// @nodoc
class _$WebSourceCitationCopyWithImpl<$Res>
    implements $WebSourceCitationCopyWith<$Res> {
  _$WebSourceCitationCopyWithImpl(this._self, this._then);

  final WebSourceCitation _self;
  final $Res Function(WebSourceCitation) _then;

/// Create a copy of WebSourceCitation
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? title = null,Object? url = null,Object? domain = freezed,}) {
  return _then(WebSourceCitation(
title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,domain: freezed == domain ? _self.domain : domain // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [WebSourceCitation].
extension WebSourceCitationPatterns on WebSourceCitation {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _WebSourceCitation value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _WebSourceCitation() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _WebSourceCitation value)  $default,){
final _that = this;
switch (_that) {
case _WebSourceCitation():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _WebSourceCitation value)?  $default,){
final _that = this;
switch (_that) {
case _WebSourceCitation() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String title,  String url,  String? domain)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _WebSourceCitation() when $default != null:
return $default(_that.title,_that.url,_that.domain);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String title,  String url,  String? domain)  $default,) {final _that = this;
switch (_that) {
case _WebSourceCitation():
return $default(_that.title,_that.url,_that.domain);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String title,  String url,  String? domain)?  $default,) {final _that = this;
switch (_that) {
case _WebSourceCitation() when $default != null:
return $default(_that.title,_that.url,_that.domain);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _WebSourceCitation implements WebSourceCitation {
  const _WebSourceCitation({required this.title, required this.url, this.domain});
  factory _WebSourceCitation.fromJson(Map<String, dynamic> json) => _$WebSourceCitationFromJson(json);

@override final  String title;
@override final  String url;
@override final  String? domain;

/// Create a copy of WebSourceCitation
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$WebSourceCitationCopyWith<_WebSourceCitation> get copyWith => __$WebSourceCitationCopyWithImpl<_WebSourceCitation>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$WebSourceCitationToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _WebSourceCitation&&(identical(other.title, title) || other.title == title)&&(identical(other.url, url) || other.url == url)&&(identical(other.domain, domain) || other.domain == domain));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,title,url,domain);
}

@override
String toString() {
    return 'WebSourceCitation(title: $title, url: $url, domain: $domain)';
}


}

/// @nodoc
abstract mixin class _$WebSourceCitationCopyWith<$Res> implements $WebSourceCitationCopyWith<$Res> {
  factory _$WebSourceCitationCopyWith(_WebSourceCitation value, $Res Function(_WebSourceCitation) _then) = __$WebSourceCitationCopyWithImpl;
@override @useResult
$Res call({
 String title, String url, String? domain
});




}
/// @nodoc
class __$WebSourceCitationCopyWithImpl<$Res>
    implements _$WebSourceCitationCopyWith<$Res> {
  __$WebSourceCitationCopyWithImpl(this._self, this._then);

  final _WebSourceCitation _self;
  final $Res Function(_WebSourceCitation) _then;

/// Create a copy of WebSourceCitation
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? title = null,Object? url = null,Object? domain = freezed,}) {
  return _then(_WebSourceCitation(
title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,domain: freezed == domain ? _self.domain : domain // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}


/// @nodoc
mixin _$ChatSession {

 String get id; String get title; String? get userId; DateTime get createdAt; DateTime get updatedAt;@JsonKey(readValue: _readSessionMsgCount) int get messageCount;
/// Create a copy of ChatSession
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ChatSessionCopyWith<ChatSession> get copyWith => _$ChatSessionCopyWithImpl<ChatSession>(this as ChatSession, _$identity);

  /// Serializes this ChatSession to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  final _this = this as ChatSession;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ChatSession&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.title, _this.title) || other.title == _this.title)&&(identical(other.userId, _this.userId) || other.userId == _this.userId)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.updatedAt, _this.updatedAt) || other.updatedAt == _this.updatedAt)&&(identical(other.messageCount, _this.messageCount) || other.messageCount == _this.messageCount));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
  final _this = this as ChatSession;
  return Object.hash(runtimeType,_this.id,_this.title,_this.userId,_this.createdAt,_this.updatedAt,_this.messageCount);
}

@override
String toString() {
  final _this = this as ChatSession;
  return 'ChatSession(id: ${_this.id}, title: ${_this.title}, userId: ${_this.userId}, createdAt: ${_this.createdAt}, updatedAt: ${_this.updatedAt}, messageCount: ${_this.messageCount})';
}


}

/// @nodoc
abstract mixin class $ChatSessionCopyWith<$Res>  {
  factory $ChatSessionCopyWith(ChatSession value, $Res Function(ChatSession) _then) = _$ChatSessionCopyWithImpl;
@useResult
$Res call({
 String id, String title, String? userId, DateTime createdAt, DateTime updatedAt,@JsonKey(readValue: _readSessionMsgCount) int messageCount
});




}
/// @nodoc
class _$ChatSessionCopyWithImpl<$Res>
    implements $ChatSessionCopyWith<$Res> {
  _$ChatSessionCopyWithImpl(this._self, this._then);

  final ChatSession _self;
  final $Res Function(ChatSession) _then;

/// Create a copy of ChatSession
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? title = null,Object? userId = freezed,Object? createdAt = null,Object? updatedAt = null,Object? messageCount = null,}) {
  return _then(ChatSession(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,userId: freezed == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,messageCount: null == messageCount ? _self.messageCount : messageCount // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [ChatSession].
extension ChatSessionPatterns on ChatSession {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ChatSession value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ChatSession() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ChatSession value)  $default,){
final _that = this;
switch (_that) {
case _ChatSession():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ChatSession value)?  $default,){
final _that = this;
switch (_that) {
case _ChatSession() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String title,  String? userId,  DateTime createdAt,  DateTime updatedAt, @JsonKey(readValue: _readSessionMsgCount)  int messageCount)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ChatSession() when $default != null:
return $default(_that.id,_that.title,_that.userId,_that.createdAt,_that.updatedAt,_that.messageCount);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String title,  String? userId,  DateTime createdAt,  DateTime updatedAt, @JsonKey(readValue: _readSessionMsgCount)  int messageCount)  $default,) {final _that = this;
switch (_that) {
case _ChatSession():
return $default(_that.id,_that.title,_that.userId,_that.createdAt,_that.updatedAt,_that.messageCount);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String title,  String? userId,  DateTime createdAt,  DateTime updatedAt, @JsonKey(readValue: _readSessionMsgCount)  int messageCount)?  $default,) {final _that = this;
switch (_that) {
case _ChatSession() when $default != null:
return $default(_that.id,_that.title,_that.userId,_that.createdAt,_that.updatedAt,_that.messageCount);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ChatSession implements ChatSession {
  const _ChatSession({required this.id, this.title = 'Đoạn chat mới', this.userId, required this.createdAt, required this.updatedAt, @JsonKey(readValue: _readSessionMsgCount) this.messageCount = 0});
  factory _ChatSession.fromJson(Map<String, dynamic> json) => _$ChatSessionFromJson(json);

@override final  String id;
@override@JsonKey() final  String title;
@override final  String? userId;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;
@override@JsonKey(readValue: _readSessionMsgCount) final  int messageCount;

/// Create a copy of ChatSession
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ChatSessionCopyWith<_ChatSession> get copyWith => __$ChatSessionCopyWithImpl<_ChatSession>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ChatSessionToJson(this, );
}

@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ChatSession&&(identical(other.id, id) || other.id == id)&&(identical(other.title, title) || other.title == title)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.messageCount, messageCount) || other.messageCount == messageCount));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode {
    return Object.hash(runtimeType,id,title,userId,createdAt,updatedAt,messageCount);
}

@override
String toString() {
    return 'ChatSession(id: $id, title: $title, userId: $userId, createdAt: $createdAt, updatedAt: $updatedAt, messageCount: $messageCount)';
}


}

/// @nodoc
abstract mixin class _$ChatSessionCopyWith<$Res> implements $ChatSessionCopyWith<$Res> {
  factory _$ChatSessionCopyWith(_ChatSession value, $Res Function(_ChatSession) _then) = __$ChatSessionCopyWithImpl;
@override @useResult
$Res call({
 String id, String title, String? userId, DateTime createdAt, DateTime updatedAt,@JsonKey(readValue: _readSessionMsgCount) int messageCount
});




}
/// @nodoc
class __$ChatSessionCopyWithImpl<$Res>
    implements _$ChatSessionCopyWith<$Res> {
  __$ChatSessionCopyWithImpl(this._self, this._then);

  final _ChatSession _self;
  final $Res Function(_ChatSession) _then;

/// Create a copy of ChatSession
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? title = null,Object? userId = freezed,Object? createdAt = null,Object? updatedAt = null,Object? messageCount = null,}) {
  return _then(_ChatSession(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,userId: freezed == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,messageCount: null == messageCount ? _self.messageCount : messageCount // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
