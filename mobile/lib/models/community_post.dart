import 'package:freezed_annotation/freezed_annotation.dart';

part 'community_post.freezed.dart';
part 'community_post.g.dart';

Object? _readPostImages(Map<dynamic, dynamic> json, String key) {
  if (json['images'] is List) return json['images'];
  if (json['imageUrls'] is List) return json['imageUrls'];
  return <String>[];
}

Object? _readCommentUserId(Map<dynamic, dynamic> json, String key) {
  if (json['userId'] != null) return json['userId'].toString();
  if (json['user'] is Map && json['user']['id'] != null) {
    return json['user']['id'].toString();
  }
  return '';
}

Object? _readCommentUserName(Map<dynamic, dynamic> json, String key) {
  if (json['userName'] != null && json['userName'].toString().isNotEmpty) {
    return json['userName'].toString();
  }
  if (json['user'] is Map) {
    final u = json['user'] as Map;
    final name = u['name']?.toString();
    if (name != null && name.isNotEmpty) return name;
    final email = u['email']?.toString();
    if (email != null && email.isNotEmpty) return email.split('@').first;
  }
  return 'Người dùng';
}

/// Community author / user info
@freezed
abstract class CommunityUserInfo with _$CommunityUserInfo {
  const CommunityUserInfo._();

  const factory CommunityUserInfo({
    required String id,
    String? name,
    @Default('') String email,
    @Default([]) List<String> preferredStyles,
    String? budgetLevel,
  }) = _CommunityUserInfo;

  factory CommunityUserInfo.fromJson(Map<String, dynamic> json) =>
      _$CommunityUserInfoFromJson(json);

  String get displayName =>
      (name != null && name!.isNotEmpty) ? name! : email.split('@').first;
}

/// Brief place summary inside an attached trip
@freezed
abstract class CommunityTripPlaceSummary with _$CommunityTripPlaceSummary {
  const factory CommunityTripPlaceSummary({
    required String id,
    required String name,
    String? imageUrl,
    String? province,
  }) = _CommunityTripPlaceSummary;

  factory CommunityTripPlaceSummary.fromJson(Map<String, dynamic> json) =>
      _$CommunityTripPlaceSummaryFromJson(json);
}

@freezed
abstract class CommunityTripPlaceWrapper with _$CommunityTripPlaceWrapper {
  const factory CommunityTripPlaceWrapper({
    required CommunityTripPlaceSummary place,
  }) = _CommunityTripPlaceWrapper;

  factory CommunityTripPlaceWrapper.fromJson(Map<String, dynamic> json) =>
      _$CommunityTripPlaceWrapperFromJson(json);
}

/// Trip attached to a community post
@freezed
abstract class CommunityAttachedTrip with _$CommunityAttachedTrip {
  const factory CommunityAttachedTrip({
    required String id,
    required String destination,
    required String startDate,
    required String endDate,
    @Default(0.0) double budgetPerPerson,
    @Default(1) int groupSize,
    @Default('DRAFT') String status,
    List<CommunityTripPlaceWrapper>? places,
  }) = _CommunityAttachedTrip;

  factory CommunityAttachedTrip.fromJson(Map<String, dynamic> json) =>
      _$CommunityAttachedTripFromJson(json);
}

/// Comment model
@freezed
abstract class Comment with _$Comment {
  const factory Comment({
    required String id,
    required String content,
    @JsonKey(readValue: _readCommentUserId) @Default('') String userId,
    @JsonKey(readValue: _readCommentUserName) @Default('Người dùng') String userName,
    required DateTime createdAt,
    CommunityUserInfo? user,
    @Default(0) int likesCount,
    @Default(false) bool isLiked,
  }) = _Comment;

  factory Comment.fromJson(Map<String, dynamic> json) =>
      _$CommentFromJson(json);
}

/// Community post model matching backend CommunityService
@freezed
abstract class CommunityPost with _$CommunityPost {
  const CommunityPost._();

  const factory CommunityPost({
    required String id,
    required String userId,
    @Default('') String title,
    required String content,
    @Default([]) List<String> tags,
    @JsonKey(readValue: _readPostImages) @Default([]) List<String> images,
    String? tripId,
    CommunityAttachedTrip? trip,
    @Default(0) int likesCount,
    @Default(0) int commentsCount,
    @Default(false) bool isLiked,
    required DateTime createdAt,
    DateTime? updatedAt,
    CommunityUserInfo? user,
    @Default([]) List<Comment> recentComments,
  }) = _CommunityPost;

  factory CommunityPost.fromJson(Map<String, dynamic> json) =>
      _$CommunityPostFromJson(json);

  // Compatibility getters
  String get userName => user?.displayName ?? 'Người dùng';
  List<String>? get imageUrls => images;
}

/// Travel buddy match item from GET /community/travel-buddies
@freezed
abstract class TravelBuddy with _$TravelBuddy {
  const factory TravelBuddy({
    required String id,
    @Default('') String name,
    @Default('') String email,
    @Default([]) List<String> preferredStyles,
    String? budgetLevel,
    @Default([]) List<String> mutualStyles,
    @Default(false) bool sameBudget,
    @Default(0.0) double matchScore,
    @Default(0) int tripsCount,
    @Default(0) int postsCount,
  }) = _TravelBuddy;

  factory TravelBuddy.fromJson(Map<String, dynamic> json) =>
      _$TravelBuddyFromJson(json);
}
