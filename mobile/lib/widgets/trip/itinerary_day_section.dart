import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/widgets/place/place_card_compact.dart';

/// Itinerary day section widget
class ItineraryDaySection extends StatelessWidget {
  final int dayNumber;
  final String date;
  final List<Place> places;

  const ItineraryDaySection({
    super.key,
    required this.dayNumber,
    required this.date,
    required this.places,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Day header
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm,
            ),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                  child: Center(
                    child: Text(
                      '$dayNumber',
                      style: AppTextStyles.labelLarge.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Ngày $dayNumber',
                      style: AppTextStyles.labelLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      _formatDate(date),
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.sm),

          // Places list
          if (places.isEmpty)
            _buildEmptyState()
          else
            ...places.asMap().entries.map((entry) {
              return PlaceCardCompact(
                place: entry.value,
                index: entry.key + 1,
                onTap: () {
                  // TODO: Navigate to place detail
                },
              );
            }),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(
          color: AppColors.border,
          style: BorderStyle.solid,
        ),
      ),
      child: Row(
        children: [
          Icon(
            LucideIcons.mapPin,
            size: 24,
            color: AppColors.textSecondary.withValues(alpha: 0.5),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Text(
              'Chưa có địa điểm nào cho ngày này',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      final formatter = DateFormat('EEEE, dd/MM/yyyy', 'vi_VN');
      return formatter.format(date);
    } catch (e) {
      return dateStr;
    }
  }
}
