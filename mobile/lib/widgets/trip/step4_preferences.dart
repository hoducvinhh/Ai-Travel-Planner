import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';

/// Step 4: Preferences selection
class Step4Preferences extends ConsumerWidget {
  const Step4Preferences({super.key});

  static const List<Map<String, dynamic>> _preferences = [
    {
      'id': 'beach',
      'name': 'Biển',
      'icon': LucideIcons.waves,
      'color': AppColors.categoryBeach,
    },
    {
      'id': 'mountain',
      'name': 'Núi',
      'icon': LucideIcons.mountain,
      'color': AppColors.categoryMountain,
    },
    {
      'id': 'culture',
      'name': 'Văn hóa',
      'icon': LucideIcons.landmark,
      'color': AppColors.categoryCulture,
    },
    {
      'id': 'food',
      'name': 'Ẩm thực',
      'icon': LucideIcons.utensils,
      'color': AppColors.categoryFood,
    },
    {
      'id': 'nature',
      'name': 'Thiên nhiên',
      'icon': LucideIcons.treeDeciduous,
      'color': AppColors.categoryNature,
    },
    {
      'id': 'city',
      'name': 'Đô thị',
      'icon': LucideIcons.building2,
      'color': AppColors.categoryCity,
    },
    {
      'id': 'adventure',
      'name': 'Mạo hiểm',
      'icon': LucideIcons.tent,
      'color': AppColors.primary,
    },
    {
      'id': 'relax',
      'name': 'Thư giãn',
      'icon': LucideIcons.palmtree,
      'color': AppColors.secondary,
    },
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(createTripProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Sở thích của bạn?',
          style: AppTextStyles.displayMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: AppSpacing.sm),

        Text(
          'Chọn những gì bạn quan tâm (có thể chọn nhiều)',
          style: AppTextStyles.bodyLarge.copyWith(
            color: AppColors.textSecondary,
          ),
        ),

        const SizedBox(height: AppSpacing.xl),

        // Preferences grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: AppSpacing.md,
            mainAxisSpacing: AppSpacing.md,
            childAspectRatio: 1.5,
          ),
          itemCount: _preferences.length,
          itemBuilder: (context, index) {
            final pref = _preferences[index];
            final isSelected = state.preferences.contains(pref['id']);

            return _buildPreferenceCard(
              context,
              ref,
              pref['id'] as String,
              pref['name'] as String,
              pref['icon'] as IconData,
              pref['color'] as Color,
              isSelected,
            );
          },
        ),

        const SizedBox(height: AppSpacing.lg),

        // Info card
        Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: AppColors.info.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(AppSpacing.xs),
                decoration: BoxDecoration(
                  color: AppColors.info,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: const Icon(
                  LucideIcons.lightbulb,
                  size: 20,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text(
                  'Chúng tôi sẽ gợi ý các địa điểm phù hợp với sở thích của bạn',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPreferenceCard(
    BuildContext context,
    WidgetRef ref,
    String id,
    String name,
    IconData icon,
    Color color,
    bool isSelected,
  ) {
    return InkWell(
      onTap: () {
        ref.read(createTripProvider.notifier).togglePreference(id);
      },
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: isSelected ? color.withValues(alpha: 0.15) : Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(
            color: isSelected ? color : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withValues(alpha: isSelected ? 0.2 : 0.1),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(
                icon,
                size: 28,
                color: color,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              name,
              style: AppTextStyles.bodyMedium.copyWith(
                color: isSelected ? color : AppColors.textPrimary,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
            ),
            if (isSelected)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Icon(
                  LucideIcons.check,
                  size: 16,
                  color: color,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
