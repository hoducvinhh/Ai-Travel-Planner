import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/models/place.dart';

/// Compact place card for itinerary
class PlaceCardCompact extends StatelessWidget {
  final Place place;
  final int index;
  final VoidCallback? onTap;

  const PlaceCardCompact({
    super.key,
    required this.place,
    required this.index,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.sm),
          child: Row(
            children: [
              // Index number
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF10B981), Color(0xFF14B8A6)],
                  ),
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Center(
                  child: Text(
                    '$index',
                    style: AppTextStyles.labelMedium.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),

              const SizedBox(width: AppSpacing.sm),

              // Place image
              ClipRRect(
                borderRadius: BorderRadius.circular(AppRadius.sm),
                child: place.imageUrl != null
                    ? CachedNetworkImage(
                        imageUrl: place.imageUrl!,
                        width: 60,
                        height: 60,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => _buildPlaceholder(),
                        errorWidget: (context, url, error) => _buildPlaceholder(),
                      )
                    : _buildPlaceholder(),
              ),

              const SizedBox(width: AppSpacing.sm),

              // Place info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name
                    Text(
                      place.name,
                      style: AppTextStyles.bodyLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),

                    const SizedBox(height: 2),

                    // Category badge
                    if (place.category != null)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.xs,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: _getCategoryColor(place.category!).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                        ),
                        child: Text(
                          _getCategoryName(place.category!),
                          style: AppTextStyles.bodySmall.copyWith(
                            color: _getCategoryColor(place.category!),
                            fontWeight: FontWeight.w500,
                            fontSize: 11,
                          ),
                        ),
                      ),

                    const SizedBox(height: 4),

                    // Rating
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
                        if (place.reviewCount > 0) ...[
                          Text(
                            ' (${place.reviewCount})',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),

              // Arrow icon
              const Icon(
                LucideIcons.chevronRight,
                size: 20,
                color: AppColors.textSecondary,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      width: 60,
      height: 60,
      color: AppColors.primary.withValues(alpha: 0.1),
      child: Icon(
        LucideIcons.mapPin,
        size: 24,
        color: AppColors.primary.withValues(alpha: 0.3),
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
}
