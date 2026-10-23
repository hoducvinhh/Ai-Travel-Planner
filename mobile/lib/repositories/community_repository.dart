import 'package:travel_planner/models/community_post.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Community repository
class CommunityRepository {
  final ApiService _api;

  CommunityRepository(this._api);

  /// Get all community posts
  Future<List<CommunityPost>> getPosts() async {
    final response = await _api.get<List<dynamic>>(
      AppConstants.communityPosts,
    );

    return response
        .map((json) => CommunityPost.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  /// Get post by ID
  Future<CommunityPost> getPostById(String id) async {
    final response = await _api.get<Map<String, dynamic>>(
      '${AppConstants.communityPosts}/$id',
    );

    return CommunityPost.fromJson(response);
  }

  /// Create new post
  Future<CommunityPost> createPost({
    required String content,
    List<String>? imageUrls,
    String? tripId,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      AppConstants.communityPosts,
      data: {
        'content': content,
        if (imageUrls != null) 'imageUrls': imageUrls,
        if (tripId != null) 'tripId': tripId,
      },
    );

    return CommunityPost.fromJson(response);
  }

  /// Like a post
  Future<void> likePost(String postId) async {
    await _api.post<Map<String, dynamic>>(
      '${AppConstants.communityPosts}/$postId/like',
    );
  }

  /// Unlike a post
  Future<void> unlikePost(String postId) async {
    await _api.delete('${AppConstants.communityPosts}/$postId/like');
  }

  /// Get comments for a post
  Future<List<Comment>> getComments(String postId) async {
    final response = await _api.get<List<dynamic>>(
      '${AppConstants.communityPosts}/$postId/comments',
    );

    return response
        .map((json) => Comment.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  /// Add comment to post
  Future<Comment> addComment(String postId, String content) async {
    final response = await _api.post<Map<String, dynamic>>(
      '${AppConstants.communityPosts}/$postId/comments',
      data: {'content': content},
    );

    return Comment.fromJson(response);
  }

  /// Delete post
  Future<void> deletePost(String postId) async {
    await _api.delete('${AppConstants.communityPosts}/$postId');
  }
}
