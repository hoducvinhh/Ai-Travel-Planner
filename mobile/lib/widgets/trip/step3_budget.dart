import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';

/// Step 3: Budget input
class Step3Budget extends ConsumerStatefulWidget {
  const Step3Budget({super.key});

  @override
  ConsumerState<Step3Budget> createState() => _Step3BudgetState();
}

class _Step3BudgetState extends ConsumerState<Step3Budget> {
  late TextEditingController _budgetController;
  late TextEditingController _travelersController;

  @override
  void initState() {
    super.initState();
    final state = ref.read(createTripProvider);
    _budgetController = TextEditingController(
      text: state.budget > 0 ? state.budget.toStringAsFixed(0) : '',
    );
    _travelersController = TextEditingController(
      text: state.travelersCount.toString(),
    );
  }

  @override
  void dispose() {
    _budgetController.dispose();
    _travelersController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(createTripProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Ngân sách của bạn?',
          style: AppTextStyles.displayMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: AppSpacing.sm),

        Text(
          'Nhập tổng ngân sách dự kiến cho chuyến đi',
          style: AppTextStyles.bodyLarge.copyWith(
            color: AppColors.textSecondary,
          ),
        ),

        const SizedBox(height: AppSpacing.xl),

        // Budget input
        TextField(
          controller: _budgetController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Tổng ngân sách',
            hintText: '0',
            prefixIcon: const Icon(LucideIcons.dollarSign),
            suffixText: '₫',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: const BorderSide(color: AppColors.primary, width: 2),
            ),
          ),
          onChanged: (value) {
            final budget = double.tryParse(value.replaceAll(',', '')) ?? 0;
            ref.read(createTripProvider.notifier).setBudget(budget);
          },
        ),

        const SizedBox(height: AppSpacing.lg),

        // Quick budget options
        Text(
          'Hoặc chọn mức ngân sách',
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
            _buildBudgetChip('< 5 triệu', 5000000),
            _buildBudgetChip('5-10 triệu', 7500000),
            _buildBudgetChip('10-20 triệu', 15000000),
            _buildBudgetChip('20-30 triệu', 25000000),
            _buildBudgetChip('> 30 triệu', 35000000),
          ],
        ),

        const SizedBox(height: AppSpacing.xl),

        // Travelers count
        Text(
          'Số người đi cùng',
          style: AppTextStyles.labelLarge.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: AppSpacing.md),

        Row(
          children: [
            IconButton(
              onPressed: state.travelersCount > 1
                  ? () {
                      final newCount = state.travelersCount - 1;
                      _travelersController.text = newCount.toString();
                      ref.read(createTripProvider.notifier).setTravelersCount(newCount);
                    }
                  : null,
              icon: const Icon(LucideIcons.minus),
              style: IconButton.styleFrom(
                backgroundColor: state.travelersCount > 1
                    ? AppColors.primary.withValues(alpha: 0.1)
                    : AppColors.border.withValues(alpha: 0.3),
                foregroundColor: state.travelersCount > 1
                    ? AppColors.primary
                    : AppColors.textSecondary,
              ),
            ),
            Expanded(
              child: TextField(
                controller: _travelersController,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.primary, width: 2),
                  ),
                  suffixText: 'người',
                ),
                onChanged: (value) {
                  final count = int.tryParse(value) ?? 1;
                  if (count > 0 && count <= 99) {
                    ref.read(createTripProvider.notifier).setTravelersCount(count);
                  }
                },
              ),
            ),
            IconButton(
              onPressed: state.travelersCount < 99
                  ? () {
                      final newCount = state.travelersCount + 1;
                      _travelersController.text = newCount.toString();
                      ref.read(createTripProvider.notifier).setTravelersCount(newCount);
                    }
                  : null,
              icon: const Icon(LucideIcons.plus),
              style: IconButton.styleFrom(
                backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                foregroundColor: AppColors.primary,
              ),
            ),
          ],
        ),

        if (state.budget > 0 && state.travelersCount > 0) ...[
          const SizedBox(height: AppSpacing.lg),
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.accent.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(AppSpacing.xs),
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                  child: const Icon(
                    LucideIcons.calculator,
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
                        'Ngân sách mỗi người',
                        style: AppTextStyles.labelMedium.copyWith(
                          color: AppColors.accent,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _formatCurrency(state.budget / state.travelersCount),
                        style: AppTextStyles.bodyLarge.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
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
      labelStyle: AppTextStyles.bodyMedium.copyWith(
        color: AppColors.textPrimary,
      ),
      backgroundColor: Colors.white,
      side: const BorderSide(color: AppColors.border),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      onPressed: () {
        _budgetController.text = budget.toStringAsFixed(0);
        ref.read(createTripProvider.notifier).setBudget(budget);
      },
    );
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }
}
