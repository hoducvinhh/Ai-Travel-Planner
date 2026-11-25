import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/places_provider.dart';
import 'package:travel_planner/widgets/common/empty_state_view.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';
import 'package:travel_planner/widgets/common/skeleton_cards.dart';
import 'package:travel_planner/widgets/place/place_card.dart';
import 'package:travel_planner/widgets/place/place_directions_sheet.dart';
import 'package:travel_planner/widgets/place/places_filter_sheet.dart';
import 'package:travel_planner/widgets/place/share_place_sheet.dart';

/// Places social discovery feed matching Web /places
class PlacesScreen extends ConsumerStatefulWidget {
  const PlacesScreen({super.key});

  @override
  ConsumerState<PlacesScreen> createState() => _PlacesScreenState();
}

class _PlacesScreenState extends ConsumerState<PlacesScreen> {
  bool _isGridView = false;
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(placesFilterProvider).search ?? '';
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 300) {
      ref.read(placesFeedProvider.notifier).loadMore();
    }
  }

  void _showMessage(String? msg) {
    if (msg == null || !mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), duration: const Duration(seconds: 2)),
    );
  }

  Future<void> _openPlaceCommentsSheet(Place place) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _PlaceCommentsSheet(place: place),
    );
  }

  @override
  Widget build(BuildContext context) {
    final feedState = ref.watch(placesFeedProvider);
    final filter = ref.watch(placesFilterProvider);

    // Sync controller if external quick search updated filter
    if ((filter.search ?? '') != _searchController.text &&
        !FocusScope.of(context).hasFocus) {
      _searchController.text = filter.search ?? '';
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Khám phá điểm đến'),
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(_isGridView ? LucideIcons.list : LucideIcons.grid3x3),
            onPressed: () => setState(() => _isGridView = !_isGridView),
            tooltip: _isGridView ? 'Xem dạng danh sách' : 'Xem dạng lưới',
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.md,
              AppSpacing.sm,
              AppSpacing.md,
              AppSpacing.sm,
            ),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(bottom: BorderSide(color: AppColors.border)),
            ),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Tìm theo tên địa điểm, quận, mô tả...',
                    prefixIcon: const Icon(LucideIcons.search, size: 18),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(LucideIcons.x, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              ref
                                  .read(placesFilterProvider.notifier)
                                  .setSearch(null);
                            },
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: 10,
                    ),
                  ),
                  onSubmitted: (val) {
                    ref.read(placesFilterProvider.notifier).setSearch(val);
                  },
                  onChanged: (val) {
                    setState(() {});
                    if (val.isEmpty) {
                      ref.read(placesFilterProvider.notifier).setSearch(null);
                    }
                  },
                ),

                const SizedBox(height: AppSpacing.sm),

                // Quick Province & Category Filter Row
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ActionChip(
                        avatar: const Icon(LucideIcons.slidersHorizontal, size: 15),
                        label: const Text('Bộ lọc & Sắp xếp'),
                        onPressed: () {
                          showModalBottomSheet<void>(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (_) => const PlacesFilterSheet(),
                          );
                        },
                        backgroundColor: AppColors.background,
                        side: const BorderSide(color: AppColors.border),
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      ...vietnamProvinces.map((prov) {
                        final active = filter.province == prov.key;
                        return Padding(
                          padding: const EdgeInsets.only(right: AppSpacing.xs),
                          child: ChoiceChip(
                            label: Text(prov.shortLabel),
                            selected: active,
                            onSelected: (sel) {
                              ref
                                  .read(placesFilterProvider.notifier)
                                  .setProvince(sel ? prov.key : null);
                            },
                          ),
                        );
                      }),
                    ],
                  ),
                ),

                const SizedBox(height: 6),

                // Results summary row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Hiển thị ${feedState.places.length} / ${feedState.total} địa điểm',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    if (filter.category != null ||
                        filter.province != null ||
                        filter.sortBy != 'popularity')
                      GestureDetector(
                        onTap: () {
                          _searchController.clear();
                          ref.read(placesFilterProvider.notifier).reset();
                        },
                        child: Text(
                          'Đặt lại lọc',
                          style: AppTextStyles.labelSmall.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),

          // Feed Content
          Expanded(
            child: RefreshIndicator(
              color: AppColors.primary,
              onRefresh: () =>
                  ref.read(placesFeedProvider.notifier).loadInitial(),
              child: _buildFeedBody(feedState),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeedBody(PlacesFeedState feedState) {
    if (feedState.isLoading) {
      return ListView.builder(
        padding: const EdgeInsets.only(top: AppSpacing.sm),
        itemCount: 4,
        itemBuilder: (_, __) => const PlaceCardSkeleton(),
      );
    }

    if (feedState.error != null && feedState.places.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.circleAlert, size: 56, color: AppColors.error),
              const SizedBox(height: AppSpacing.md),
              const Text('Không tải được địa điểm', style: AppTextStyles.headlineSmall),
              const SizedBox(height: AppSpacing.sm),
              ElevatedButton.icon(
                onPressed: () =>
                    ref.read(placesFeedProvider.notifier).loadInitial(),
                icon: const Icon(LucideIcons.refreshCw, size: 18),
                label: const Text('Thử lại'),
              ),
            ],
          ),
        ),
      );
    }

    if (feedState.places.isEmpty) {
      return EmptyStateView(
        assetPath: 'assets/images/illustrations/empty_places.jpg',
        title: 'Không tìm thấy địa điểm phù hợp',
        subtitle: 'Hãy thử đổi từ khóa tìm kiếm hoặc bỏ chọn tiêu chí lọc.',
        actionLabel: 'Đặt lại bộ lọc',
        actionIcon: LucideIcons.rotateCcw,
        onAction: () {
          _searchController.clear();
          ref.read(placesFilterProvider.notifier).reset();
        },
      );
    }

    if (_isGridView) {
      return GridView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.all(AppSpacing.md),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: AppSpacing.sm,
          mainAxisSpacing: AppSpacing.sm,
          childAspectRatio: 0.78,
        ),
        itemCount: feedState.places.length + (feedState.isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index >= feedState.places.length) {
            return const Center(child: CircularProgressIndicator());
          }
          final place = feedState.places[index];
          return PlaceCard(
            place: place,
            isCompact: true,
            onTap: () => context.push('/places/${place.id}'),
            onLike: () async {
              final msg = await ref
                  .read(placesFeedProvider.notifier)
                  .toggleLike(place);
              _showMessage(msg);
            },
          );
        },
      );
    }

    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
      itemCount: feedState.places.length + (feedState.isLoadingMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index >= feedState.places.length) {
          return const Padding(
            padding: EdgeInsets.all(AppSpacing.md),
            child: Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            ),
          );
        }
        final place = feedState.places[index];
        return PlaceCard(
          place: place,
          onTap: () => context.push('/places/${place.id}'),
          onLike: () async {
            final msg =
                await ref.read(placesFeedProvider.notifier).toggleLike(place);
            _showMessage(msg);
          },
          onSave: () async {
            final msg =
                await ref.read(placesFeedProvider.notifier).toggleSave(place);
            _showMessage(msg);
          },
          onComment: () => _openPlaceCommentsSheet(place),
          onDirections: () {
            PlaceDirectionsSheet.show(
              context,
              name: place.name,
              latitude: place.latitude,
              longitude: place.longitude,
              province: place.province,
              district: place.district,
            );
          },
          onShare: () => SharePlaceSheet.show(context, place),
        );
      },
    );
  }
}

class _PlaceCommentsSheet extends ConsumerStatefulWidget {
  final Place place;
  const _PlaceCommentsSheet({required this.place});

  @override
  ConsumerState<_PlaceCommentsSheet> createState() =>
      _PlaceCommentsSheetState();
}

class _PlaceCommentsSheetState extends ConsumerState<_PlaceCommentsSheet> {
  final TextEditingController _controller = TextEditingController();
  bool _submitting = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _submitting) return;
    final user = ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng đăng nhập để bình luận!')),
      );
      return;
    }

    setState(() => _submitting = true);
    try {
      await ref.read(placesRepositoryProvider).addPlaceComment(
            placeId: widget.place.id,
            userId: user.id,
            content: text,
          );
      _controller.clear();
      ref.invalidate(placeCommentsProvider(widget.place.id));
      ref
          .read(placesFeedProvider.notifier)
          .incrementCommentCount(widget.place.id);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể gửi bình luận: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final commentsAsync = ref.watch(placeCommentsProvider(widget.place.id));

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        height: MediaQuery.of(context).size.height * 0.65,
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
        ),
        child: Column(
          children: [
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'Bình luận • ${widget.place.name}',
                      style: AppTextStyles.titleMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(LucideIcons.x, size: 20),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: commentsAsync.when(
                loading: () => const LoadingIndicator(),
                error: (e, _) => Center(child: Text('Lỗi tải bình luận: $e')),
                data: (comments) {
                  if (comments.isEmpty) {
                    return Center(
                      child: Text(
                        'Chưa có bình luận nào. Hãy là người đầu tiên!',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    itemCount: comments.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(height: AppSpacing.sm),
                    itemBuilder: (_, idx) {
                      final c = comments[idx];
                      return Container(
                        padding: const EdgeInsets.all(AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              c.user.displayName,
                              style: AppTextStyles.labelMedium.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(c.content, style: AppTextStyles.bodySmall),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ),
            SafeArea(
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: AppColors.border)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        decoration: InputDecoration(
                          hintText: 'Viết bình luận, chia sẻ trải nghiệm...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppRadius.lg),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.md,
                            vertical: 8,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.xs),
                    IconButton(
                      onPressed: _submitting ? null : _submit,
                      icon: _submitting
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(LucideIcons.send, color: AppColors.primary),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
