import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/community_post.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/repositories/community_repository.dart';
import 'package:travel_planner/services/providers.dart';

/// Community repository provider
final communityRepositoryProvider = Provider<CommunityRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return CommunityRepository(api);
});

/// Filter state for community feed
class CommunityFilter {
  final String tag;
  final String search;

  const CommunityFilter({this.tag = 'Tất cả', this.search = ''});

  CommunityFilter copyWith({String? tag, String? search}) {
    return CommunityFilter(
      tag: tag ?? this.tag,
      search: search ?? this.search,
    );
  }
}

class CommunityFilterNotifier extends StateNotifier<CommunityFilter> {
  CommunityFilterNotifier() : super(const CommunityFilter());

  void setTag(String tag) {
    state = state.copyWith(tag: tag);
  }

  void setSearch(String search) {
    state = state.copyWith(search: search);
  }
}

final communityFilterProvider =
    StateNotifierProvider<CommunityFilterNotifier, CommunityFilter>((ref) {
  return CommunityFilterNotifier();
});

/// Community feed notifier supporting optimistic likes, comments, edit, delete
class CommunityFeedNotifier extends StateNotifier<AsyncValue<List<CommunityPost>>> {
  final CommunityRepository _repository;
  final CommunityFilter _filter;
  final String? _userId;

  CommunityFeedNotifier(this._repository, this._filter, this._userId)
      : super(const AsyncValue.loading()) {
    loadPosts();
  }

  Future<void> loadPosts() async {
    state = const AsyncValue.loading();
    try {
      final posts = await _repository.getPosts(
        tag: _filter.tag,
        search: _filter.search,
        userId: _userId,
      );
      if (!mounted) return;
      state = AsyncValue.data(posts);
    } catch (e, st) {
      if (!mounted) return;
      state = AsyncValue.error(e, st);
    }
  }

  Future<String?> toggleLike(CommunityPost post) async {
    if (_userId == null) return 'Vui lòng đăng nhập để thích bài viết!';
    final currentList = state.valueOrNull;
    if (currentList == null) return null;

    final prevLiked = post.isLiked;
    final nextLiked = !prevLiked;

    state = AsyncValue.data(
      currentList.map((p) {
        if (p.id != post.id) return p;
        return p.copyWith(
          isLiked: nextLiked,
          likesCount: nextLiked
              ? p.likesCount + 1
              : (p.likesCount > 0 ? p.likesCount - 1 : 0),
        );
      }).toList(),
    );

    try {
      final res = await _repository.toggleLike(postId: post.id, userId: _userId);
      final latest = state.valueOrNull;
      if (latest != null && mounted) {
        state = AsyncValue.data(
          latest.map((p) {
            if (p.id != post.id) return p;
            return p.copyWith(
              isLiked: res['isLiked'] == true,
              likesCount: (res['likesCount'] as num?)?.toInt() ?? p.likesCount,
            );
          }).toList(),
        );
      }
      return null;
    } catch (_) {
      if (mounted) {
        state = AsyncValue.data(currentList);
      }
      return 'Có lỗi xảy ra khi thích bài viết';
    }
  }

  Future<void> deletePost(String postId) async {
    await _repository.deletePost(postId);
    final current = state.valueOrNull;
    if (current != null && mounted) {
      state = AsyncValue.data(current.where((p) => p.id != postId).toList());
    }
  }

  void prependPost(CommunityPost created) {
    final current = state.valueOrNull ?? [];
    state = AsyncValue.data([created, ...current]);
  }

  void replacePost(CommunityPost updated) {
    final current = state.valueOrNull ?? [];
    state = AsyncValue.data(
      current.map((p) => p.id == updated.id ? updated : p).toList(),
    );
  }

  void onCommentAdded(String postId, Comment added) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncValue.data(
      current.map((p) {
        if (p.id != postId) return p;
        return p.copyWith(
          commentsCount: p.commentsCount + 1,
          recentComments: [...p.recentComments, added],
        );
      }).toList(),
    );
  }
}

final communityFeedProvider = StateNotifierProvider<CommunityFeedNotifier,
    AsyncValue<List<CommunityPost>>>((ref) {
  final repository = ref.watch(communityRepositoryProvider);
  final filter = ref.watch(communityFilterProvider);
  final userId = ref.watch(authProvider).maybeWhen(
        authenticated: (u) => u.id,
        orElse: () => null,
      );
  return CommunityFeedNotifier(repository, filter, userId);
});

/// Travel Buddies AI-matched provider
final travelBuddiesProvider = FutureProvider<List<TravelBuddy>>((ref) async {
  final repository = ref.watch(communityRepositoryProvider);
  final userId = ref.watch(authProvider).maybeWhen(
        authenticated: (u) => u.id,
        orElse: () => null,
      );
  return await repository.getTravelBuddies(userId: userId);
});

/// Comments provider for a specific post
final commentsProvider =
    FutureProvider.family<List<Comment>, String>((ref, postId) async {
  final repository = ref.watch(communityRepositoryProvider);
  return await repository.getComments(postId);
});
