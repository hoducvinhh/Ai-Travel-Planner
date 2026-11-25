import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/places_provider.dart';
import 'package:travel_planner/widgets/common/custom_button.dart';

/// Places filter & sort bottom sheet aligned with Web 11 provinces & 10 categories
class PlacesFilterSheet extends ConsumerWidget {
  const PlacesFilterSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(placesFilterProvider);

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(AppRadius.sm),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Row(
                children: [
                  Text(
                    'Bộ lọc & Sắp xếp',
                    style: AppTextStyles.headlineMedium.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () {
                      ref.read(placesFilterProvider.notifier).reset();
                    },
                    child: const Text('Đặt lại'),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Sort By
                    Text(
                      'Sắp xếp theo',
                      style: AppTextStyles.labelLarge.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.xs,
                      children: placeSortOptions.map((opt) {
                        final selected = filter.sortBy == opt['value'];
                        return ChoiceChip(
                          label: Text(opt['label']!),
                          selected: selected,
                          onSelected: (_) {
                            ref
                                .read(placesFilterProvider.notifier)
                                .setSortBy(opt['value']!);
                          },
                          selectedColor:
                              AppColors.primary.withValues(alpha: 0.14),
                          labelStyle: TextStyle(
                            color: selected
                                ? AppColors.primary
                                : AppColors.textPrimary,
                            fontSize: 12,
                            fontWeight:
                                selected ? FontWeight.bold : FontWeight.normal,
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: AppSpacing.lg),

                    // Provinces (11 key provinces)
                    Text(
                      'Tỉnh / Thành phố trọng điểm',
                      style: AppTextStyles.labelLarge.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.xs,
                      children: [
                        ChoiceChip(
                          label: const Text('Tất cả điểm đến'),
                          selected: filter.province == null,
                          onSelected: (_) {
                            ref
                                .read(placesFilterProvider.notifier)
                                .setProvince(null);
                          },
                        ),
                        ...vietnamProvinces.map((prov) {
                          final selected = filter.province == prov.key;
                          return ChoiceChip(
                            label: Text(prov.label),
                            selected: selected,
                            onSelected: (isSel) {
                              ref
                                  .read(placesFilterProvider.notifier)
                                  .setProvince(isSel ? prov.key : null);
                            },
                          );
                        }),
                      ],
                    ),

                    const SizedBox(height: AppSpacing.lg),

                    // Categories (10 Vietnamese categories)
                    Text(
                      'Thể loại trải nghiệm',
                      style: AppTextStyles.labelLarge.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.xs,
                      children: placeCategories.map((cat) {
                        final selected = (filter.category ?? 'Tất cả') == cat;
                        return ChoiceChip(
                          label: Text(cat),
                          selected: selected,
                          onSelected: (_) {
                            ref
                                .read(placesFilterProvider.notifier)
                                .setCategory(cat == 'Tất cả' ? null : cat);
                          },
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: CustomButton(
                text: 'Áp dụng',
                onPressed: () => Navigator.pop(context),
                icon: const Icon(LucideIcons.check, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
