import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';

/// Step 4: Preferences selection aligned with Web 10 experiences + Smart Pre-fill
class Step4Preferences extends ConsumerWidget {
  const Step4Preferences({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(createTripProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sở thích & trải nghiệm',
          style: AppTextStyles.displayMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Chọn những hoạt động bạn yêu thích (có thể chọn nhiều)',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.md),

        if (state.isSmartPrefilled && state.preferences.isNotEmpty)
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            margin: const EdgeInsets.only(bottom: AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.secondary.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(
                color: AppColors.secondary.withValues(alpha: 0.35),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(LucideIcons.sparkles, size: 18),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Text(
                    'Smart Pre-fill: Đã chọn sẵn các gu du lịch từ hồ sơ của bạn. Chạm để thêm/bớt theo nhu cầu riêng.',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
              ],
            ),
          ),

        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: AppSpacing.sm,
            mainAxisSpacing: AppSpacing.sm,
            childAspectRatio: 2.1,
          ),
          itemCount: tripPreferencesList.length,
          itemBuilder: (context, index) {
            final pref = tripPreferencesList[index];
            final isSelected = state.preferences.contains(pref.id);

            return InkWell(
              onTap: () => ref
                  .read(createTripProvider.notifier)
                  .togglePreference(pref.id),
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.md,
                  vertical: AppSpacing.sm,
                ),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(
                    color: isSelected ? AppColors.primary : AppColors.border,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      pref.icon,
                      size: 20,
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Text(
                        pref.label,
                        style: AppTextStyles.labelMedium.copyWith(
                          color:
                              isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    if (isSelected)
                      const Icon(
                        LucideIcons.check,
                        size: 16,
                        color: Colors.white,
                      ),
                  ],
                ),
              ),
            );
          },
        ),

        const SizedBox(height: AppSpacing.md),
        Center(
          child: Chip(
            label: Text('Đã chọn ${state.preferences.length} sở thích'),
            backgroundColor: AppColors.surface,
            side: const BorderSide(color: AppColors.border),
          ),
        ),
      ],
    );
  }
}
