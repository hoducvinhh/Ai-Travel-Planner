import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/models/trip.dart';

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
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: const BorderSide(color: AppColors.border),
      ),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppRadius.lg),
                topRight: Radius.circular(AppRadius.lg),
              ),
              child: trip.imageUrl != null
                  ? Image.network(
                      trip.imageUrl!,
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return _buildPlaceholderImage();
                      },
                    )
                  : _buildPlaceholderImage(),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Destination
                  Text(
                    trip.destination,
                    style: AppTextStyles.headlineSmall.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: AppSpacing.sm),

                  // Dates
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.calendar,
                        size: 16,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        _formatDateRange(),
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: AppSpacing.xs),

                  // Budget
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.dollarSign,
                        size: 16,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        _formatBudget(),
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),

                  if (trip.travelersCount > 0) ...[
                    const SizedBox(height: AppSpacing.xs),
                    Row(
                      children: [
                        const Icon(
                          LucideIcons.users,
                          size: 16,
                          color: AppColors.textSecondary,
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        Text(
                          '${trip.travelersCount} người',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholderImage() {
    return Image.asset(
      provinceAssetPath(trip.destination),
      height: 170,
      width: double.infinity,
      fit: BoxFit.cover,
      errorBuilder: (_, __, ___) => Container(
        height: 170,
        width: double.infinity,
        color: AppColors.primary.withValues(alpha: 0.1),
        child: Icon(
          LucideIcons.image,
          size: 48,
          color: AppColors.primary.withValues(alpha: 0.3),
        ),
      ),
    );
  }

  String _formatDateRange() {
    try {
      final start = DateTime.parse(trip.startDate);
      final end = DateTime.parse(trip.endDate);
      final formatter = DateFormat('dd/MM');
      return '${formatter.format(start)} - ${formatter.format(end)}';
    } catch (e) {
      return '${trip.startDate} - ${trip.endDate}';
    }
  }

  String _formatBudget() {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return '${formatter.format(trip.budgetPerPerson)} / người';
  }
}
