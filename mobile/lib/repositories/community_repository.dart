import 'dart:io';
import 'package:travel_planner/models/community_post.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Community repository aligned with backend CommunityController
class CommunityRepository {
  final ApiService _api;

  CommunityRepository(this._api);

  /// Get community posts with tag/search/userId filters
  Future<List<CommunityPost>> getPosts({
    int page = 1,
    int limit = 30,
    String? tag,
    String? search,
    String? userId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (tag != null && tag.isNotEmpty && tag != 'Tất cả') {
      queryParams['tag'] = tag;
    }
    if (search != null && search.trim().isNotEmpty) {
      queryParams['search'] = search.trim();
    }
    if (userId != null && userId.isNotEmpty) {
      queryParams['userId'] = userId;
    }

    final response = await _api.get<dynamic>(
      AppConstants.communityPosts,
      queryParams: queryParams,
    );

    if (response is Map<String, dynamic>) {
      final items = response['items'] as List<dynamic>? ?? [];
      return items
          .map((e) => CommunityPost.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
    }
    if (response is List) {
      return response
          .map((e) => CommunityPost.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
    }
    return [];
  }

  /// Upload image to /upload/image and return relative URL
  Future<String> uploadImage(File file) async {
    final res = await _api.uploadImage(file);
    return res['url']?.toString() ?? '';
  }

  /// Create new post
  Future<CommunityPost> createPost({
    required String userId,
    required String title,
    required String content,
    List<String>? tags,
    List<String>? images,
    String? tripId,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      AppConstants.communityPosts,
      data: {
        'userId': userId,
        'title': title,
        'content': content,
        'tags': tags ?? [],
        'images': images ?? [],
        'tripId': (tripId != null && tripId.isNotEmpty) ? tripId : null,
      },
    );
    return CommunityPost.fromJson(response);
  }

  /// Update existing post
  Future<CommunityPost> updatePost({
    required String postId,
    required String title,
    required String content,
    List<String>? tags,
    List<String>? images,
    String? tripId,
  }) async {
    final response = await _api.patch<Map<String, dynamic>>(
      '${AppConstants.communityPosts}/$postId',
      data: {
        'title': title,
        'content': content,
        'tags': tags ?? [],
        'images': images ?? [],
        'tripId': (tripId != null && tripId.isNotEmpty) ? tripId : null,
      },
    );
    return CommunityPost.fromJson(response);
  }

  /// Delete post
  Future<void> deletePost(String postId) async {
    await _api.delete('${AppConstants.communityPosts}/$postId');
  }

  /// Toggle like on post
  Future<Map<String, dynamic>> toggleLike({
    required String postId,
    required String userId,
  }) async {
    return await _api.post<Map<String, dynamic>>(
      '${AppConstants.communityPosts}/$postId/like',
      data: {'userId': userId},
    );
  }

  /// Get comments for a post
  Future<List<Comment>> getComments(String postId) async {
    final response = await _api.get<List<dynamic>>(
      '${AppConstants.communityPosts}/$postId/comments',
    );
    return response
        .map((e) => Comment.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  /// Add comment to post
  Future<Comment> addComment({
    required String postId,
    required String userId,
    required String content,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '${AppConstants.communityPosts}/$postId/comments',
      data: {'userId': userId, 'content': content},
    );
    return Comment.fromJson(response);
  }

  /// Get AI-matched Travel Buddies
  Future<List<TravelBuddy>> getTravelBuddies({String? userId}) async {
    final response = await _api.get<List<dynamic>>(
      AppConstants.travelBuddies,
      queryParams: userId != null && userId.isNotEmpty ? {'userId': userId} : null,
    );
    return response
        .map((e) => TravelBuddy.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }
}
