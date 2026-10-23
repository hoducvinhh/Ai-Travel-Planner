import 'package:freezed_annotation/freezed_annotation.dart';

part 'community_post.freezed.dart';
part 'community_post.g.dart';

/// Community post model
@freezed
class CommunityPost with _$CommunityPost {
  const factory CommunityPost({
    required String id,
    required String content,
    required String userId,
    required String userName,
    required DateTime createdAt,
    List<String>? imageUrls,
    @Default(0) int likesCount,
    @Default(0) int commentsCount,
    @Default(false) bool isLiked,
    String? tripId,
  }) = _CommunityPost;

  factory CommunityPost.fromJson(Map<String, dynamic> json) =>
      _$CommunityPostFromJson(json);
}

/// Comment model
@freezed
class Comment with _$Comment {
  const factory Comment({
    required String id,
    required String content,
    required String userId,
    required String userName,
    required DateTime createdAt,
  }) = _Comment;

  factory Comment.fromJson(Map<String, dynamic> json) =>
      _$CommentFromJson(json);
}
