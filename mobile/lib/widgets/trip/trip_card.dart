import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../config/colors.dart';
import '../../config/text_styles.dart';
import '../../config/radius.dart';
import '../../config/spacing.dart';
import '../../models/trip.dart';
import '../../utils/formatters.dart';

/// Trip card widget
class TripCard extends StatelessWidget {
  final Trip trip;
  final VoidCallback? onTap;

  const TripCard({
    super.key,
    required this.trip,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Trip image
            _buildImage(),

            // Trip info
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Destination
                  Text(
                    trip.destination,
                    style: AppTextStyles.headlineMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Date range
                  _buildInfoRow(
                    icon: LucideIcons.calendar,
                    text: Formatters.dateRange(trip.startDate, trip.endDate),
                  ),
                  const SizedBox(height: AppSpacing.xs),

                  // Budget
                  _buildInfoRow(
                    icon: LucideIcons.dollarSign,
                    text: Formatters.currency(trip.budget),
                  ),
                  const SizedBox(height: AppSpacing.xs),

                  // Travelers
                  _buildInfoRow(
                    icon: LucideIcons.users,
                    text: '${trip.travelers} người',
                  ),

                  // Status badge (if available)
                  if (trip.status != null) ...[
                    const SizedBox(height: AppSpacing.sm),
                    _buildStatusBadge(trip.status!),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Build trip image
  Widget _buildImage() {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(
        top: Radius.circular(AppRadius.lg),
      ),
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: trip.imageUrl != null
            ? CachedNetworkImage(
                imageUrl: trip.imageUrl!,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  color: AppColors.surface,
                  child: const Center(
                    child: CircularProgressIndicator(),
                  ),
                ),
                errorWidget: (context, url, error) => _buildPlaceholder(),
              )
            : _buildPlaceholder(),
      ),
    );
  }

  /// Build placeholder image
  Widget _buildPlaceholder() {
    return Container(
      color: AppColors.surface,
      child: Icon(
        LucideIcons.mapPin,
        size: 48,
        color: AppColors.textSecondary,
      ),
    );
  }

  /// Build info row
  Widget _buildInfoRow({
    required IconData icon,
    required String text,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: AppColors.textSecondary,
        ),
        const SizedBox(width: AppSpacing.xs),
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  /// Build status badge
  Widget _buildStatusBadge(TripStatus status) {
    Color badgeColor;
    switch (status) {
      case TripStatus.draft:
        badgeColor = AppColors.textSecondary;
        break;
      case TripStatus.planned:
        badgeColor = AppColors.secondary;
        break;
      case TripStatus.ongoing:
        badgeColor = AppColors.accent;
        break;
      case TripStatus.completed:
        badgeColor = AppColors.success;
        break;
      case TripStatus.cancelled:
        badgeColor = AppColors.error;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: badgeColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppRadius.sm),
      ),
      child: Text(
        status.displayName,
        style: AppTextStyles.labelSmall.copyWith(
          color: badgeColor,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
