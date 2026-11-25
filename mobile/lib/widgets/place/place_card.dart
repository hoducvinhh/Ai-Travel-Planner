import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/place.dart';

/// Place card widget with social actions (Like, Save, Comment, Directions, Share)
class PlaceCard extends StatelessWidget {
  final Place place;
  final VoidCallback? onTap;
  final VoidCallback? onLike;
  final VoidCallback? onSave;
  final VoidCallback? onComment;
  final VoidCallback? onDirections;
  final VoidCallback? onShare;
  final bool isCompact;

  const PlaceCard({
    super.key,
    required this.place,
    this.onTap,
    this.onLike,
    this.onSave,
    this.onComment,
    this.onDirections,
    this.onShare,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isCompact) {
      return _buildCompactCard();
    }
    return _buildFullCard();
  }

  Widget _buildCompactCard() {
    final prov = getProvinceMeta(place.province);
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: const BorderSide(color: AppColors.border),
      ),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 1.15,
              child: Stack(
                children: [
                  place.imageUrl != null && place.imageUrl!.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: place.imageUrl!,
                          width: double.infinity,
                          height: double.infinity,
                          fit: BoxFit.cover,
                          placeholder: (_, __) => _buildPlaceholder(),
                          errorWidget: (_, __, ___) => _buildPlaceholder(),
                        )
                      : _buildPlaceholder(),
                  Positioned(
                    top: AppSpacing.xs,
                    left: AppSpacing.xs,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.92),
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                      ),
                      child: Text(
                        prov.shortLabel,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.sm),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      place.name,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        const Icon(
                          LucideIcons.star,
                          size: 13,
                          color: AppColors.rating,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          place.ratingAvg > 0
                              ? place.ratingAvg.toStringAsFixed(1)
                              : '—',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Spacer(),
                        if (onLike != null)
                          GestureDetector(
                            onTap: onLike,
                            child: Icon(
                              LucideIcons.heart,
                              size: 16,
                              color: place.isLiked
                                  ? AppColors.likeRed
                                  : AppColors.textSecondary,
                            ),
                          ),
                      ],
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

  Widget _buildFullCard() {
    final prov = getProvinceMeta(place.province);
    final priceLabel = place.priceEstimate > 0
        ? '${NumberFormat('#,###', 'vi_VN').format(place.priceEstimate)} đ'
        : 'Miễn phí';

    return Card(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: const BorderSide(color: AppColors.border),
      ),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner Image + Top Badges
            Stack(
              children: [
                Hero(
                  tag: 'place-hero-${place.id}',
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: place.imageUrl != null && place.imageUrl!.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: place.imageUrl!,
                            fit: BoxFit.cover,
                            placeholder: (_, __) => _buildPlaceholder(),
                            errorWidget: (_, __, ___) => _buildPlaceholder(),
                          )
                        : _buildPlaceholder(),
                  ),
                ),
                Positioned(
                  top: AppSpacing.sm,
                  left: AppSpacing.sm,
                  right: AppSpacing.sm,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.92),
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          prov.label,
                          style: AppTextStyles.labelSmall.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.92),
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              LucideIcons.ticket,
                              size: 12,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              priceLabel,
                              style: AppTextStyles.labelSmall.copyWith(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    place.name,
                    style: AppTextStyles.headlineSmall.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    place.description ??
                        'Địa điểm du lịch nổi tiếng với nhiều hoạt động hấp dẫn.',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Categories + indoor/outdoor
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: [
                      ...place.categories.take(3).map(
                            (cat) => Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.background,
                                borderRadius:
                                    BorderRadius.circular(AppRadius.sm),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Text(
                                '#$cat',
                                style: AppTextStyles.bodySmall.copyWith(
                                  fontSize: 10,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ),
                          ),
                      if (place.indoorOutdoor != null &&
                          place.indoorOutdoor!.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.secondary.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                          child: Text(
                            place.indoorOutdoor!,
                            style: AppTextStyles.bodySmall.copyWith(
                              fontSize: 10,
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                    ],
                  ),

                  const SizedBox(height: AppSpacing.sm),

                  // Rating Summary
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            LucideIcons.star,
                            size: 15,
                            color: AppColors.rating,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            place.ratingAvg > 0
                                ? place.ratingAvg.toStringAsFixed(1)
                                : '—',
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '(${place.ratingCount} đánh giá)',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                      if (place.userRating != null)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.success.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(
                            'Đã chấm ${place.userRating}★',
                            style: AppTextStyles.bodySmall.copyWith(
                              fontSize: 10,
                              color: AppColors.success,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),

            // Social Actions Footer
            if (onLike != null ||
                onSave != null ||
                onComment != null ||
                onDirections != null ||
                onShare != null)
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: 6,
                ),
                decoration: const BoxDecoration(
                  color: AppColors.background,
                  border: Border(top: BorderSide(color: AppColors.border)),
                ),
                child: Row(
                  children: [
                    if (onLike != null)
                      _FooterIconBtn(
                        icon: LucideIcons.heart,
                        label: '${place.likesCount}',
                        active: place.isLiked,
                        activeColor: AppColors.likeRed,
                        onTap: onLike!,
                      ),
                    if (onSave != null)
                      _FooterIconBtn(
                        icon: LucideIcons.bookmark,
                        label: '${place.savesCount}',
                        active: place.isSaved,
                        activeColor: AppColors.accent,
                        onTap: onSave!,
                      ),
                    if (onComment != null)
                      _FooterIconBtn(
                        icon: LucideIcons.messageCircle,
                        label: '${place.commentsCount}',
                        active: false,
                        activeColor: AppColors.textPrimary,
                        onTap: onComment!,
                      ),
                    const Spacer(),
                    if (onDirections != null)
                      OutlinedButton.icon(
                        onPressed: onDirections,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          side: const BorderSide(color: AppColors.border),
                          foregroundColor: AppColors.textPrimary,
                        ),
                        icon: const Icon(LucideIcons.navigation, size: 13),
                        label: const Text(
                          'Chỉ đường',
                          style: TextStyle(fontSize: 11),
                        ),
                      ),
                    if (onShare != null)
                      IconButton(
                        onPressed: onShare,
                        icon: const Icon(
                          LucideIcons.share2,
                          size: 16,
                          color: AppColors.textSecondary,
                        ),
                        visualDensity: VisualDensity.compact,
                      ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Image.asset(
      provinceAssetPath(place.province),
      width: double.infinity,
      height: double.infinity,
      fit: BoxFit.cover,
      errorBuilder: (_, __, ___) => Container(
        color: AppColors.primary.withValues(alpha: 0.08),
        child: Center(
          child: Icon(
            LucideIcons.mapPin,
            size: 40,
            color: AppColors.primary.withValues(alpha: 0.4),
          ),
        ),
      ),
    );
  }
}

class _FooterIconBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final Color activeColor;
  final VoidCallback onTap;

  const _FooterIconBtn({
    required this.icon,
    required this.label,
    required this.active,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = active ? activeColor : AppColors.textSecondary;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: AppTextStyles.bodySmall.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
