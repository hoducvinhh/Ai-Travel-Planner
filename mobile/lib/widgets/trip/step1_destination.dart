import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';

/// Step 1: Multi-province destination selection (Tour liên tỉnh)
class Step1Destination extends ConsumerWidget {
  const Step1Destination({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(createTripProvider);
    final selected = state.destinations;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Bạn muốn đi đâu?',
          style: AppTextStyles.displayMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Chọn 1 hoặc nhiều tỉnh thành tại Việt Nam (Tour liên tỉnh)',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.lg),

        if (selected.isNotEmpty) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Đã chọn (${selected.length}):',
                style: AppTextStyles.labelMedium.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () =>
                    ref.read(createTripProvider.notifier).clearDestinations(),
                child: const Text('Bỏ chọn tất cả'),
              ),
            ],
          ),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: selected.asMap().entries.map((entry) {
              final idx = entry.key;
              final key = entry.value;
              final prov = getProvinceMeta(key);
              return Chip(
                avatar: CircleAvatar(
                  backgroundColor: AppColors.primary,
                  radius: 10,
                  child: Text(
                    '${idx + 1}',
                    style: const TextStyle(
                      fontSize: 10,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                label: Text(prov.shortLabel),
                deleteIcon: const Icon(LucideIcons.x, size: 14),
                onDeleted: () => ref
                    .read(createTripProvider.notifier)
                    .removeDestination(key),
                backgroundColor: AppColors.surface,
                side: const BorderSide(color: AppColors.border),
              );
            }).toList(),
          ),
          const SizedBox(height: AppSpacing.md),
        ],

        if (selected.length >= 2) ...[
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
                const Icon(
                  LucideIcons.sparkles,
                  size: 18,
                  color: AppColors.textPrimary,
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Text(
                    'Chế độ Tour Liên Tỉnh (${selected.length} địa phương): Hệ thống sẽ tự động phân bổ các ngày theo khu vực liền kề để di chuyển thuận tiện nhất.',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],

        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: AppSpacing.sm,
            mainAxisSpacing: AppSpacing.sm,
            childAspectRatio: 2.6,
          ),
          itemCount: vietnamProvinces.length,
          itemBuilder: (_, index) {
            final prov = vietnamProvinces[index];
            final orderIdx = selected.indexOf(prov.key);
            final isSelected = orderIdx != -1;

            return InkWell(
              onTap: () => ref
                  .read(createTripProvider.notifier)
                  .toggleDestination(prov.key),
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: AppSpacing.xs,
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
                    if (isSelected)
                      Container(
                        width: 22,
                        height: 22,
                        margin: const EdgeInsets.only(right: 6),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '${orderIdx + 1}',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    Expanded(
                      child: Text(
                        prov.label,
                        style: AppTextStyles.bodySmall.copyWith(
                          color:
                              isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
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
      ],
    );
  }
}
