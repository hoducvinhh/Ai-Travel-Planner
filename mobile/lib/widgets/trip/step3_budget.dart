import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';

/// Step 3: Budget per person & Group size (with Smart Pre-fill)
class Step3Budget extends ConsumerStatefulWidget {
  const Step3Budget({super.key});

  @override
  ConsumerState<Step3Budget> createState() => _Step3BudgetState();
}

class _Step3BudgetState extends ConsumerState<Step3Budget> {
  late TextEditingController _budgetController;

  @override
  void initState() {
    super.initState();
    final state = ref.read(createTripProvider);
    _budgetController = TextEditingController(
      text: state.budgetPerPerson > 0
          ? state.budgetPerPerson.toStringAsFixed(0)
          : '',
    );
  }

  @override
  void dispose() {
    _budgetController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(createTripProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Ngân sách & số người',
          style: AppTextStyles.displayMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Xác định quy mô đoàn và hạn mức chi tiêu mỗi người để AI cân đối chi phí',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.md),

        if (state.isSmartPrefilled)
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
                    'Smart Pre-fill: Đã tự động điền ngân sách & số người theo hồ sơ khảo sát của bạn. Bạn có thể tùy chỉnh cho chuyến đi này.',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
              ],
            ),
          ),

        // Budget per person input
        TextField(
          controller: _budgetController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Ngân sách dự kiến mỗi người (VNĐ)',
            hintText: 'Ví dụ: 3000000',
            prefixIcon: const Icon(LucideIcons.dollarSign),
            suffixText: '₫',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
          ),
          onChanged: (value) {
            final budget = double.tryParse(value.replaceAll(',', '')) ?? 0;
            ref.read(createTripProvider.notifier).setBudgetPerPerson(budget);
          },
        ),
        const SizedBox(height: AppSpacing.md),

        Text(
          'Chọn nhanh ngân sách/người',
          style: AppTextStyles.labelLarge.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: AppSpacing.sm),
        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.xs,
          children: [
            _buildBudgetChip('500k (Tiết kiệm)', 500000),
            _buildBudgetChip('1.2tr (Tiêu chuẩn)', 1200000),
            _buildBudgetChip('2.5tr (Cao cấp)', 2500000),
            _buildBudgetChip('5 triệu', 5000000),
            _buildBudgetChip('10 triệu', 10000000),
          ],
        ),

        const SizedBox(height: AppSpacing.xl),

        Text(
          'Số lượng người tham gia',
          style: AppTextStyles.labelLarge.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: AppSpacing.sm),

        Row(
          children: [1, 2, 3, 4, 5, 6].map((size) {
            final selected = state.groupSize == size;
            return Expanded(
              child: Padding(
                padding: EdgeInsets.only(right: size == 6 ? 0 : 6),
                child: InkWell(
                  onTap: () =>
                      ref.read(createTripProvider.notifier).setGroupSize(size),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: selected ? AppColors.primary : AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(
                        color: selected ? AppColors.primary : AppColors.border,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      size == 6 ? '6+' : '$size',
                      style: AppTextStyles.labelLarge.copyWith(
                        color: selected ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),

        if (state.budgetPerPerson > 0 && state.groupSize > 0) ...[
          const SizedBox(height: AppSpacing.lg),
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Tổng ngân sách toàn chuyến đi:',
                  style: AppTextStyles.labelMedium.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  _formatCurrency(state.totalBudget),
                  style: AppTextStyles.titleMedium.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildBudgetChip(String label, double budget) {
    return ActionChip(
      label: Text(label),
      backgroundColor: AppColors.surface,
      side: const BorderSide(color: AppColors.border),
      onPressed: () {
        _budgetController.text = budget.toStringAsFixed(0);
        ref.read(createTripProvider.notifier).setBudgetPerPerson(budget);
      },
    );
  }

  String _formatCurrency(double amount) {
    return NumberFormat.currency(
      locale: 'vi_VN',
      symbol: 'đ',
      decimalDigits: 0,
    ).format(amount);
  }
}
