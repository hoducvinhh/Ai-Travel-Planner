import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/community_post.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/community_provider.dart';
import 'package:travel_planner/providers/messages_provider.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/screens/community/create_post_screen.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';
import 'package:travel_planner/widgets/community/comments_bottom_sheet.dart';
import 'package:travel_planner/widgets/community/post_card.dart';

/// Community feed + Travel Buddy Finder screen matching Web /community
class CommunityScreen extends ConsumerStatefulWidget {
  const CommunityScreen({super.key});

  @override
  ConsumerState<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends ConsumerState<CommunityScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String? _cloningTripId;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _toast(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _startChatWithUser(
    String targetUserId, {
    String? destination,
    String? startDate,
  }) async {
    final user = ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    if (user == null) {
      _toast('Vui lòng đăng nhập để nhắn tin!');
      context.push('/login');
      return;
    }
    if (user.id == targetUserId) {
      _toast('Đây là tài khoản của bạn!');
      return;
    }

    try {
      final conv = await ref
          .read(messagesRepositoryProvider)
          .getOrCreateConversation(targetUserId);
      final convId = conv['id']?.toString();
      if (convId == null || !mounted) return;

      String? seedMessage;
      if (destination != null && startDate != null) {
        try {
          final formatted =
              DateFormat('dd/MM/yyyy').format(DateTime.parse(startDate));
          seedMessage =
              'Chào bạn, mình thấy lịch trình đi $destination ngày $formatted của bạn rất thú vị, mình muốn đăng ký đi cùng được không?';
        } catch (_) {}
      }

      final uri = Uri(
        path: '/messages/$convId',
        queryParameters:
            seedMessage != null ? {'seed': seedMessage} : null,
      );
      context.push(uri.toString());
    } catch (e) {
      _toast('Không thể mở cuộc trò chuyện: $e');
    }
  }

  Future<void> _cloneTrip(String tripId) async {
    final user = ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    if (user == null) {
      _toast('Vui lòng đăng nhập để nhân bản chuyến đi!');
      return;
    }

    setState(() => _cloningTripId = tripId);
    try {
      final cloned =
          await ref.read(tripsRepositoryProvider).cloneTrip(tripId);
      ref.invalidate(tripsProvider);
      if (mounted) {
        _toast('Đã nhân bản chuyến đi thành công!');
        context.push('/trips/${cloned.id}');
      }
    } catch (e) {
      _toast('Không thể nhân bản chuyến đi: $e');
    } finally {
      if (mounted) setState(() => _cloningTripId = null);
    }
  }

  Future<void> _confirmDeletePost(CommunityPost post) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xác nhận xóa bài viết?'),
        content: const Text(
          'Hành động này sẽ xóa vĩnh viễn bài viết cùng tất cả lượt thích và bình luận.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text(
              'Xóa',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
    if (confirm == true) {
      try {
        await ref.read(communityFeedProvider.notifier).deletePost(post.id);
        _toast('Đã xóa bài viết thành công');
      } catch (e) {
        _toast('Không thể xóa bài viết: $e');
      }
    }
  }

  void _showImagePreview(String url) {
    showDialog<void>(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.black,
        insetPadding: const EdgeInsets.all(12),
        child: Stack(
          children: [
            InteractiveViewer(
              child: CachedNetworkImage(
                imageUrl: url,
                fit: BoxFit.contain,
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                onPressed: () => Navigator.pop(ctx),
                icon: const Icon(LucideIcons.x, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final unreadCount = ref.watch(unreadMessagesCountProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Cộng đồng & Buddy'),
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        actions: [
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                onPressed: () => context.push('/messages'),
                icon: const Icon(LucideIcons.messageCircle),
                tooltip: 'Tin nhắn 1-1',
              ),
              if (unreadCount > 0)
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 5,
                      vertical: 1,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: Text(
                      unreadCount > 99 ? '99+' : '$unreadCount',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(text: 'Diễn đàn chia sẻ'),
            Tab(text: 'Bạn đồng hành AI'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildFeedTab(),
          _buildBuddiesTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/community/create'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  Widget _buildFeedTab() {
    final postsAsync = ref.watch(communityFeedProvider);
    final filter = ref.watch(communityFilterProvider);
    final currentUserId = ref.watch(authProvider).maybeWhen(
          authenticated: (u) => u.id,
          orElse: () => null,
        );

    return Column(
      children: [
        // Search & Tags bar
        Container(
          color: AppColors.surface,
          padding: const EdgeInsets.all(AppSpacing.sm),
          child: Column(
            children: [
              TextField(
                controller: _searchController,
                textInputAction: TextInputAction.search,
                decoration: InputDecoration(
                  hintText: 'Tìm bài viết, kinh nghiệm, điểm đến...',
                  prefixIcon: const Icon(LucideIcons.search, size: 18),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(LucideIcons.x, size: 16),
                          onPressed: () {
                            _searchController.clear();
                            ref
                                .read(communityFilterProvider.notifier)
                                .setSearch('');
                          },
                        )
                      : null,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: 8,
                  ),
                ),
                onSubmitted: (val) =>
                    ref.read(communityFilterProvider.notifier).setSearch(val),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: popularCommunityTags.map((tag) {
                    final active = filter.tag == tag;
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text('#$tag'),
                        selected: active,
                        onSelected: (_) => ref
                            .read(communityFilterProvider.notifier)
                            .setTag(tag),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        Expanded(
          child: RefreshIndicator(
            color: AppColors.primary,
            onRefresh: () =>
                ref.read(communityFeedProvider.notifier).loadPosts(),
            child: postsAsync.when(
              loading: () => const LoadingIndicator(),
              error: (error, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Lỗi tải bài viết: $error'),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () =>
                          ref.read(communityFeedProvider.notifier).loadPosts(),
                      child: const Text('Thử lại'),
                    ),
                  ],
                ),
              ),
              data: (posts) {
                if (posts.isEmpty) {
                  return Center(
                    child: Text(
                      'Chưa có bài viết nào phù hợp.',
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
                  itemCount: posts.length,
                  itemBuilder: (_, index) {
                    final post = posts[index];
                    return PostCard(
                      post: post,
                      currentUserId: currentUserId,
                      isCloningTrip: _cloningTripId == post.trip?.id,
                      onLike: () async {
                        final msg = await ref
                            .read(communityFeedProvider.notifier)
                            .toggleLike(post);
                        if (msg != null) _toast(msg);
                      },
                      onComment: () {
                        showModalBottomSheet<void>(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (_) => CommentsBottomSheet(postId: post.id),
                        );
                      },
                      onEdit: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) =>
                                CreatePostScreen(existingPost: post),
                          ),
                        );
                      },
                      onDelete: () => _confirmDeletePost(post),
                      onMessageAuthor: () => _startChatWithUser(post.userId),
                      onJoinTripMessage: post.trip != null
                          ? () => _startChatWithUser(
                                post.userId,
                                destination: post.trip!.destination,
                                startDate: post.trip!.startDate,
                              )
                          : null,
                      onViewTrip: post.trip != null
                          ? () => context.push('/trips/${post.trip!.id}')
                          : null,
                      onCloneTrip: post.trip != null
                          ? () => _cloneTrip(post.trip!.id)
                          : null,
                      onImageTap: _showImagePreview,
                    );
                  },
                );
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBuddiesTab() {
    final buddiesAsync = ref.watch(travelBuddiesProvider);

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: () async => ref.invalidate(travelBuddiesProvider),
      child: buddiesAsync.when(
        loading: () => const LoadingIndicator(),
        error: (err, _) => Center(child: Text('Lỗi tải bạn đồng hành: $err')),
        data: (buddies) {
          if (buddies.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: Text(
                  'Chưa tìm thấy bạn đồng hành phù hợp. Hãy cập nhật gu du lịch trong Hồ sơ!',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.md),
            itemCount: buddies.length,
            itemBuilder: (_, idx) {
              final buddy = buddies[idx];
              final displayName = buddy.name.isNotEmpty
                  ? buddy.name
                  : buddy.email.split('@').first;
              return Container(
                margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor:
                              AppColors.secondary.withValues(alpha: 0.16),
                          child: Text(
                            displayName.isNotEmpty
                                ? displayName[0].toUpperCase()
                                : 'U',
                            style: AppTextStyles.titleMedium.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                displayName,
                                style: AppTextStyles.labelLarge.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                '${buddy.tripsCount} chuyến đi • ${buddy.postsCount} bài viết',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(
                            'Hợp gu ${buddy.matchScore.round()}%',
                            style: AppTextStyles.labelSmall.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    if (buddy.preferredStyles.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.sm),
                      Wrap(
                        spacing: 6,
                        runSpacing: 4,
                        children: buddy.preferredStyles
                            .where((s) => !s.startsWith('companion:'))
                            .take(4)
                            .map(
                              (st) => Chip(
                                label: Text(
                                  st,
                                  style: const TextStyle(fontSize: 10),
                                ),
                                visualDensity: VisualDensity.compact,
                                backgroundColor: AppColors.background,
                                side: const BorderSide(color: AppColors.border),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                    const SizedBox(height: AppSpacing.sm),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () => _startChatWithUser(buddy.id),
                        icon: const Icon(LucideIcons.messageCircle, size: 16),
                        label: const Text('Giao lưu kết nối'),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
