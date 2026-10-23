import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/places_provider.dart';
import 'package:travel_planner/widgets/common/custom_button.dart';

/// Places filter bottom sheet
class PlacesFilterSheet extends ConsumerWidget {
  const PlacesFilterSheet({super.key});

  static const List<String> _provinces = [
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Khánh Hòa',
    'Quảng Nam',
    'Thừa Thiên Huế',
    'Kiên Giang',
    'Lâm Đồng',
  ];

  static const List<Map<String, dynamic>> _categories = [
    {'id': 'beach', 'name': 'Biển', 'icon': LucideIcons.waves},
    {'id': 'mountain', 'name': 'Núi', 'icon': LucideIcons.mountain},
    {'id': 'culture', 'name': 'Văn hóa', 'icon': LucideIcons.landmark},
    {'id': 'food', 'name': 'Ẩm thực', 'icon': LucideIcons.utensils},
    {'id': 'nature', 'name': 'Thiên nhiên', 'icon': LucideIcons.treeDeciduous},
    {'id': 'city', 'name': 'Đô thị', 'icon': LucideIcons.building2},
  ];

  static const List<Map<String, String>> _budgetLevels = [
    {'id': 'low', 'name': 'Tiết kiệm', 'icon': '💰'},
    {'id': 'medium', 'name': 'Trung bình', 'icon': '💰💰'},
    {'id': 'high', 'name': 'Cao cấp', 'icon': '💰💰💰'},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(placesFilterProvider);

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(AppRadius.xl),
          topRight: Radius.circular(AppRadius.xl),
        ),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Container(
              margin: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(AppRadius.sm),
              ),
            ),

            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Row(
                children: [
                  Text(
                    'Bộ lọc',
                    style: AppTextStyles.headlineMedium.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () {
                      ref.read(placesFilterProvider.notifier).reset();
                    },
                    child: const Text('Xóa tất cả'),
                  ),
                ],
              ),
            ),

            const Divider(),

            // Content
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category filter
                    Text(
                      'Loại hình',
                      style: AppTextStyles.labelLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: AppSpacing.sm),

                    Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.sm,
                      children: _categories.map((cat) {
                        final isSelected = filter.category == cat['id'];
                        return FilterChip(
                          label: Text(cat['name'] as String),
                          avatar: Icon(cat['icon'] as IconData, size: 18),
                          selected: isSelected,
                          onSelected: (selected) {
                            ref.read(placesFilterProvider.notifier).setCategory(
                                  selected ? cat['id'] as String : null,
                                );
                          },
                          backgroundColor: Colors.white,
                          selectedColor: AppColors.primary.withValues(alpha: 0.15),
                          checkmarkColor: AppColors.primary,
                          side: BorderSide(
                            color: isSelected ? AppColors.primary : AppColors.border,
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: AppSpacing.lg),

                    // Province filter
                    Text(
                      'Tỉnh/Thành phố',
                      style: AppTextStyles.labelLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: AppSpacing.sm),

                    Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.sm,
                      children: _provinces.map((province) {
                        final isSelected = filter.province == province;
                        return FilterChip(
                          label: Text(province),
                          selected: isSelected,
                          onSelected: (selected) {
                            ref.read(placesFilterProvider.notifier).setProvince(
                                  selected ? province : null,
                                );
                          },
                          backgroundColor: Colors.white,
                          selectedColor: AppColors.secondary.withValues(alpha: 0.15),
                          checkmarkColor: AppColors.secondary,
                          side: BorderSide(
                            color: isSelected ? AppColors.secondary : AppColors.border,
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: AppSpacing.lg),

                    // Budget filter
                    Text(
                      'Mức giá',
                      style: AppTextStyles.labelLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: AppSpacing.sm),

                    Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.sm,
                      children: _budgetLevels.map((budget) {
                        final isSelected = filter.budgetLevel == budget['id'];
                        return FilterChip(
                          label: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(budget['icon']!),
                              const SizedBox(width: 4),
                              Text(budget['name']!),
                            ],
                          ),
                          selected: isSelected,
                          onSelected: (selected) {
                            ref.read(placesFilterProvider.notifier).setBudgetLevel(
                                  selected ? budget['id'] : null,
                                );
                          },
                          backgroundColor: Colors.white,
                          selectedColor: AppColors.accent.withValues(alpha: 0.15),
                          checkmarkColor: AppColors.accent,
                          side: BorderSide(
                            color: isSelected ? AppColors.accent : AppColors.border,
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),

            // Apply button
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: CustomButton(
                text: 'Áp dụng',
                onPressed: () {
                  Navigator.pop(context);
                },
                icon: LucideIcons.check,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
