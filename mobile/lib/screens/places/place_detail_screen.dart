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
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/places_provider.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';
import 'package:travel_planner/widgets/place/place_directions_sheet.dart';
import 'package:travel_planner/widgets/place/place_weather_pill.dart';
import 'package:travel_planner/widgets/place/share_place_sheet.dart';

/// Place detail screen with Like, Save, 1-5 Star Rating, Comments, Weather, Directions, Share
class PlaceDetailScreen extends ConsumerStatefulWidget {
  final String placeId;

  const PlaceDetailScreen({
    super.key,
    required this.placeId,
  });

  @override
  ConsumerState<PlaceDetailScreen> createState() => _PlaceDetailScreenState();
}

class _PlaceDetailScreenState extends ConsumerState<PlaceDetailScreen> {
  final TextEditingController _commentController = TextEditingController();
  bool _submittingComment = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _trackView());
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _trackView() {
    final user = ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    if (user == null) return;
    ref
        .read(placesRepositoryProvider)
        .trackInteraction(
          userId: user.id,
          placeId: widget.placeId,
          eventType: 'VIEW_DETAIL',
        )
        .catchError((_) {});
  }

  void _toast(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _submitComment() async {
    final text = _commentController.text.trim();
    if (text.isEmpty || _submittingComment) return;

    final user = ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    if (user == null) {
      _toast('Vui lòng đăng nhập để bình luận!');
      return;
    }

    setState(() => _submittingComment = true);
    try {
      await ref.read(placesRepositoryProvider).addPlaceComment(
            placeId: widget.placeId,
            userId: user.id,
            content: text,
          );
      _commentController.clear();
      ref.invalidate(placeCommentsProvider(widget.placeId));
      ref.invalidate(placeProvider(widget.placeId));
      _toast('Bình luận của bạn đã được đăng!');
    } catch (e) {
      _toast('Lỗi gửi bình luận: $e');
    } finally {
      if (mounted) setState(() => _submittingComment = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final placeAsync = ref.watch(placeProvider(widget.placeId));
    final commentsAsync = ref.watch(placeCommentsProvider(widget.placeId));

    return Scaffold(
      backgroundColor: AppColors.background,
      body: placeAsync.when(
        loading: () => const LoadingIndicator(),
        error: (error, _) => _buildErrorState(error),
        data: (place) {
          final prov = getProvinceMeta(place.province);
          final priceText = place.priceEstimate > 0
              ? '${NumberFormat('#,###', 'vi_VN').format(place.priceEstimate)} đ'
              : 'Miễn phí';

          return CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 280,
                pinned: true,
                backgroundColor: AppColors.surface,
                leading: IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.45),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(LucideIcons.arrowLeft, color: Colors.white, size: 18),
                  ),
                  onPressed: () => context.pop(),
                ),
                actions: [
                  IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.45),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        LucideIcons.bookmark,
                        color: place.isSaved ? AppColors.accent : Colors.white,
                        size: 18,
                      ),
                    ),
                    onPressed: () async {
                      final msg = await ref
                          .read(placesFeedProvider.notifier)
                          .toggleSave(place);
                      ref.invalidate(placeProvider(widget.placeId));
                      if (msg != null) _toast(msg);
                    },
                  ),
                  IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.45),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(LucideIcons.share2, color: Colors.white, size: 18),
                    ),
                    onPressed: () => SharePlaceSheet.show(context, place),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      if (place.imageUrl != null && place.imageUrl!.isNotEmpty)
                        CachedNetworkImage(
                          imageUrl: place.imageUrl!,
                          fit: BoxFit.cover,
                          errorWidget: (_, __, ___) => Container(
                            color: AppColors.primary.withValues(alpha: 0.12),
                            child: const Icon(LucideIcons.image, size: 64),
                          ),
                        )
                      else
                        Container(
                          color: AppColors.primary.withValues(alpha: 0.12),
                          child: const Icon(LucideIcons.mapPin, size: 64),
                        ),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.65),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: AppSpacing.md,
                        left: AppSpacing.md,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.92),
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                          child: Text(
                            '${prov.label} • $priceText',
                            style: AppTextStyles.labelSmall.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        place.name,
                        style: AppTextStyles.displaySmall.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(
                            LucideIcons.mapPin,
                            size: 16,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              '${place.district != null && place.district!.isNotEmpty ? '${place.district}, ' : ''}${prov.label}',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: AppSpacing.sm),

                      // Live Weather Pill & Rating Summary
                      Wrap(
                        spacing: AppSpacing.sm,
                        runSpacing: AppSpacing.xs,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          PlaceWeatherPill(
                            latitude: place.latitude,
                            longitude: place.longitude,
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.rating.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(AppRadius.full),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  LucideIcons.star,
                                  size: 13,
                                  color: AppColors.rating,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${place.ratingAvg > 0 ? place.ratingAvg.toStringAsFixed(1) : '—'} (${place.ratingCount})',
                                  style: AppTextStyles.labelSmall.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: AppSpacing.md),

                      // Interactive Like, Save, Directions, Share bar
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () async {
                                final msg = await ref
                                    .read(placesFeedProvider.notifier)
                                    .toggleLike(place);
                                ref.invalidate(placeProvider(widget.placeId));
                                if (msg != null) _toast(msg);
                              },
                              icon: Icon(
                                LucideIcons.heart,
                                size: 16,
                                color: place.isLiked
                                    ? AppColors.primary
                                    : AppColors.textPrimary,
                              ),
                              label: Text('Thích (${place.likesCount})'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: place.isLiked
                                    ? AppColors.primary
                                    : AppColors.textPrimary,
                                side: BorderSide(
                                  color: place.isLiked
                                      ? AppColors.primary
                                      : AppColors.border,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () {
                                PlaceDirectionsSheet.show(
                                  context,
                                  name: place.name,
                                  latitude: place.latitude,
                                  longitude: place.longitude,
                                  province: place.province,
                                  district: place.district,
                                );
                              },
                              icon: const Icon(LucideIcons.navigation, size: 16),
                              label: const Text('Chỉ đường'),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: AppSpacing.lg),

                      // Star Rating Box (1-5 stars + Unrate)
                      _buildRatingBox(place),

                      const SizedBox(height: AppSpacing.lg),

                      if (place.description != null &&
                          place.description!.isNotEmpty) ...[
                        Text(
                          'Giới thiệu',
                          style: AppTextStyles.titleMedium.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          place.description!,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      if (place.categories.isNotEmpty) ...[
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: place.categories
                              .map(
                                (c) => Chip(
                                  label: Text('#$c'),
                                  backgroundColor: AppColors.surface,
                                  side: const BorderSide(color: AppColors.border),
                                ),
                              )
                              .toList(),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      // Nearby Places
                      if (place.nearbyPlaces != null &&
                          place.nearbyPlaces!.isNotEmpty) ...[
                        Text(
                          'Địa điểm lân cận',
                          style: AppTextStyles.titleMedium.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        SizedBox(
                          height: 110,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: place.nearbyPlaces!.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(width: AppSpacing.sm),
                            itemBuilder: (_, idx) {
                              final np = place.nearbyPlaces![idx];
                              return InkWell(
                                onTap: () => context.push('/places/${np.id}'),
                                borderRadius:
                                    BorderRadius.circular(AppRadius.md),
                                child: Container(
                                  width: 200,
                                  padding: const EdgeInsets.all(AppSpacing.sm),
                                  decoration: BoxDecoration(
                                    color: AppColors.surface,
                                    borderRadius:
                                        BorderRadius.circular(AppRadius.md),
                                    border:
                                        Border.all(color: AppColors.border),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        np.name,
                                        style: AppTextStyles.labelMedium
                                            .copyWith(
                                                fontWeight: FontWeight.bold),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        getProvinceMeta(np.province).shortLabel,
                                        style: AppTextStyles.bodySmall.copyWith(
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                      ],

                      // Comments Section
                      Text(
                        'Bình luận (${place.commentsCount})',
                        style: AppTextStyles.titleMedium.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _commentController,
                              decoration: InputDecoration(
                                hintText: 'Chia sẻ cảm nhận về địa điểm...',
                                border: OutlineInputBorder(
                                  borderRadius:
                                      BorderRadius.circular(AppRadius.md),
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: AppSpacing.md,
                                  vertical: 10,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.xs),
                          IconButton(
                            onPressed:
                                _submittingComment ? null : _submitComment,
                            icon: _submittingComment
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2),
                                  )
                                : const Icon(
                                    LucideIcons.send,
                                    color: AppColors.primary,
                                  ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),

                      commentsAsync.when(
                        loading: () => const Center(
                          child: Padding(
                            padding: EdgeInsets.all(AppSpacing.md),
                            child: CircularProgressIndicator(),
                          ),
                        ),
                        error: (e, _) => Text('Lỗi tải bình luận: $e'),
                        data: (comments) {
                          if (comments.isEmpty) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(
                                  vertical: AppSpacing.md),
                              child: Text(
                                'Chưa có bình luận nào. Hãy là người đầu tiên!',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            );
                          }
                          return Column(
                            children: comments.map((c) {
                              return Container(
                                width: double.infinity,
                                margin:
                                    const EdgeInsets.only(bottom: AppSpacing.sm),
                                padding: const EdgeInsets.all(AppSpacing.sm),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius:
                                      BorderRadius.circular(AppRadius.md),
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
                                    Text(c.content,
                                        style: AppTextStyles.bodySmall),
                                  ],
                                ),
                              );
                            }).toList(),
                          );
                        },
                      ),

                      const SizedBox(height: AppSpacing.xl),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildRatingBox(Place place) {
    final userRating = place.userRating;
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                userRating != null
                    ? 'Đánh giá của bạn: $userRating/5 sao'
                    : 'Đánh giá địa điểm này',
                style: AppTextStyles.labelLarge.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (userRating != null)
                TextButton(
                  onPressed: () async {
                    final msg = await ref
                        .read(placesFeedProvider.notifier)
                        .unratePlace(place.id);
                    ref.invalidate(placeProvider(widget.placeId));
                    if (msg != null) _toast(msg);
                  },
                  child: const Text(
                    'Hủy đánh giá',
                    style: TextStyle(color: AppColors.error, fontSize: 12),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: List.generate(5, (i) {
              final starValue = i + 1;
              final filled = userRating != null && starValue <= userRating;
              return IconButton(
                onPressed: () async {
                  final msg = await ref
                      .read(placesFeedProvider.notifier)
                      .ratePlace(place.id, starValue);
                  ref.invalidate(placeProvider(widget.placeId));
                  if (msg != null) _toast(msg);
                },
                icon: Icon(
                  LucideIcons.star,
                  size: 26,
                  color: filled ? AppColors.rating : AppColors.textTertiary,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(Object error) {
    return Scaffold(
      appBar: AppBar(),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.circleAlert, size: 56, color: AppColors.error),
            const SizedBox(height: AppSpacing.md),
            Text('Không thể tải địa điểm: $error', textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.md),
            ElevatedButton(
              onPressed: () => ref.invalidate(placeProvider(widget.placeId)),
              child: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }
}
