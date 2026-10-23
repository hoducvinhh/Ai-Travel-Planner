import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/models/place.dart';

/// Place card widget
class PlaceCard extends StatelessWidget {
  final Place place;
  final VoidCallback? onTap;
  final bool isCompact;

  const PlaceCard({
    super.key,
    required this.place,
    this.onTap,
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
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            AspectRatio(
              aspectRatio: 1,
              child: Stack(
                children: [
                  place.imageUrl != null
                      ? CachedNetworkImage(
                          imageUrl: place.imageUrl!,
                          width: double.infinity,
                          height: double.infinity,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => _buildPlaceholder(),
                          errorWidget: (context, url, error) => _buildPlaceholder(),
                        )
                      : _buildPlaceholder(),
                  // Category badge
                  if (place.category != null)
                    Positioned(
                      top: AppSpacing.xs,
                      right: AppSpacing.xs,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.xs,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: _getCategoryColor(place.category!),
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                        ),
                        child: Text(
                          _getCategoryName(place.category!),
                          style: AppTextStyles.bodySmall.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Content
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
                          size: 14,
                          color: AppColors.rating,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          place.rating.toStringAsFixed(1),
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.textSecondary,
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
    return Card(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Stack(
              children: [
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: place.imageUrl != null
                      ? CachedNetworkImage(
                          imageUrl: place.imageUrl!,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => _buildPlaceholder(),
                          errorWidget: (context, url, error) => _buildPlaceholder(),
                        )
                      : _buildPlaceholder(),
                ),
                // Category badge
                if (place.category != null)
                  Positioned(
                    top: AppSpacing.sm,
                    left: AppSpacing.sm,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.sm,
                        vertical: AppSpacing.xs,
                      ),
                      decoration: BoxDecoration(
                        color: _getCategoryColor(place.category!),
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            _getCategoryIcon(place.category!),
                            size: 14,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _getCategoryName(place.category!),
                            style: AppTextStyles.bodySmall.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
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
                  // Name
                  Text(
                    place.name,
                    style: AppTextStyles.headlineSmall.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: AppSpacing.xs),

                  // Location
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.mapPin,
                        size: 14,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          '${place.district ?? ''} ${place.province}',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: AppSpacing.sm),

                  // Rating and budget
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.star,
                        size: 16,
                        color: AppColors.rating,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        place.rating.toStringAsFixed(1),
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      if (place.reviewCount > 0) ...[
                        Text(
                          ' (${place.reviewCount})',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                      const Spacer(),
                      if (place.budgetLevel != null)
                        Text(
                          _getBudgetDisplay(place.budgetLevel!),
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.accent,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                    ],
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
    return Container(
      color: AppColors.primary.withValues(alpha: 0.1),
      child: Center(
        child: Icon(
          LucideIcons.image,
          size: 48,
          color: AppColors.primary.withValues(alpha: 0.3),
        ),
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'beach':
        return AppColors.categoryBeach;
      case 'mountain':
        return AppColors.categoryMountain;
      case 'culture':
        return AppColors.categoryCulture;
      case 'food':
        return AppColors.categoryFood;
      case 'nature':
        return AppColors.categoryNature;
      case 'city':
        return AppColors.categoryCity;
      default:
        return AppColors.primary;
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'beach':
        return LucideIcons.waves;
      case 'mountain':
        return LucideIcons.mountain;
      case 'culture':
        return LucideIcons.landmark;
      case 'food':
        return LucideIcons.utensils;
      case 'nature':
        return LucideIcons.treeDeciduous;
      case 'city':
        return LucideIcons.building2;
      default:
        return LucideIcons.mapPin;
    }
  }

  String _getCategoryName(String category) {
    switch (category.toLowerCase()) {
      case 'beach':
        return 'Biển';
      case 'mountain':
        return 'Núi';
      case 'culture':
        return 'Văn hóa';
      case 'food':
        return 'Ẩm thực';
      case 'nature':
        return 'Thiên nhiên';
      case 'city':
        return 'Đô thị';
      default:
        return category;
    }
  }

  String _getBudgetDisplay(String level) {
    switch (level.toLowerCase()) {
      case 'low':
        return '💰';
      case 'medium':
        return '💰💰';
      case 'high':
        return '💰💰💰';
      default:
        return '💰';
    }
  }
}
