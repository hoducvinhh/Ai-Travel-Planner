import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/community_post.dart';
import 'package:travel_planner/repositories/community_repository.dart';
import 'package:travel_planner/services/providers.dart';

/// Community repository provider
final communityRepositoryProvider = Provider<CommunityRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return CommunityRepository(api);
});

/// Community posts provider
final communityPostsProvider = FutureProvider<List<CommunityPost>>((ref) async {
  final repository = ref.watch(communityRepositoryProvider);
  return await repository.getPosts();
});

/// Single post provider
final postProvider = FutureProvider.family<CommunityPost, String>((ref, id) async {
  final repository = ref.watch(communityRepositoryProvider);
  return await repository.getPostById(id);
});

/// Comments provider
final commentsProvider = FutureProvider.family<List<Comment>, String>((ref, postId) async {
  final repository = ref.watch(communityRepositoryProvider);
  return await repository.getComments(postId);
});
