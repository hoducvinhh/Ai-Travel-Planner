import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';

/// Step 2: Dates selection
class Step2Dates extends ConsumerWidget {
  const Step2Dates({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(createTripProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Khi nào bạn muốn đi?',
          style: AppTextStyles.displayMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: AppSpacing.sm),

        Text(
          'Chọn ngày khởi hành và kết thúc chuyến đi',
          style: AppTextStyles.bodyLarge.copyWith(
            color: AppColors.textSecondary,
          ),
        ),

        const SizedBox(height: AppSpacing.xl),

        // Date cards
        Row(
          children: [
            Expanded(
              child: _buildDateCard(
                context,
                ref,
                'Ngày đi',
                state.startDate,
                LucideIcons.calendar,
                isStartDate: true,
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: _buildDateCard(
                context,
                ref,
                'Ngày về',
                state.endDate,
                LucideIcons.calendarCheck,
                isStartDate: false,
              ),
            ),
          ],
        ),

        if (state.startDate != null && state.endDate != null) ...[
          const SizedBox(height: AppSpacing.lg),
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(AppSpacing.xs),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                  child: const Icon(
                    LucideIcons.info,
                    size: 20,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Tổng thời gian chuyến đi',
                        style: AppTextStyles.labelMedium.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${_calculateDays(state.startDate!, state.endDate!)} ngày',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],

        const SizedBox(height: AppSpacing.xl),

        // Quick duration options
        Text(
          'Hoặc chọn thời gian nhanh',
          style: AppTextStyles.labelLarge.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: AppSpacing.md),

        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: [
            _buildDurationChip(context, ref, '2-3 ngày', 2),
            _buildDurationChip(context, ref, '3-4 ngày', 3),
            _buildDurationChip(context, ref, '5-7 ngày', 5),
            _buildDurationChip(context, ref, '1 tuần', 7),
            _buildDurationChip(context, ref, '2 tuần', 14),
          ],
        ),
      ],
    );
  }

  Widget _buildDateCard(
    BuildContext context,
    WidgetRef ref,
    String label,
    DateTime? date,
    IconData icon, {
    required bool isStartDate,
  }) {
    return InkWell(
      onTap: () => _selectDate(context, ref, isStartDate),
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(
            color: date != null ? AppColors.primary : AppColors.border,
            width: date != null ? 2 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: date != null ? AppColors.primary : AppColors.textSecondary,
                ),
                const SizedBox(width: AppSpacing.xs),
                Text(
                  label,
                  style: AppTextStyles.labelMedium.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              date != null
                  ? DateFormat('dd/MM/yyyy').format(date)
                  : 'Chọn ngày',
              style: AppTextStyles.bodyLarge.copyWith(
                color: date != null ? AppColors.textPrimary : AppColors.textSecondary,
                fontWeight: date != null ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            if (date != null) ...[
              const SizedBox(height: 2),
              Text(
                DateFormat('EEEE', 'vi_VN').format(date),
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDurationChip(BuildContext context, WidgetRef ref, String label, int days) {
    return ActionChip(
      label: Text(label),
      labelStyle: AppTextStyles.bodyMedium.copyWith(
        color: AppColors.textPrimary,
      ),
      backgroundColor: Colors.white,
      side: const BorderSide(color: AppColors.border),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      onPressed: () {
        final now = DateTime.now();
        final startDate = now.add(const Duration(days: 7)); // Start in 1 week
        final endDate = startDate.add(Duration(days: days));
        ref.read(createTripProvider.notifier).setDates(startDate, endDate);
      },
    );
  }

  Future<void> _selectDate(BuildContext context, WidgetRef ref, bool isStartDate) async {
    final state = ref.read(createTripProvider);
    final now = DateTime.now();
    final initialDate = isStartDate
        ? (state.startDate ?? now.add(const Duration(days: 7)))
        : (state.endDate ?? (state.startDate?.add(const Duration(days: 3)) ?? now.add(const Duration(days: 10))));

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primary,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      if (isStartDate) {
        // If end date is before new start date, clear it
        final endDate = state.endDate;
        if (endDate != null && endDate.isBefore(picked)) {
          ref.read(createTripProvider.notifier).setDates(picked, null);
        } else {
          ref.read(createTripProvider.notifier).setDates(picked, endDate);
        }
      } else {
        ref.read(createTripProvider.notifier).setDates(state.startDate, picked);
      }
    }
  }

  int _calculateDays(DateTime start, DateTime end) {
    return end.difference(start).inDays + 1;
  }
}
