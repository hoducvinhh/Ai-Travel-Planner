import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';
import 'package:travel_planner/widgets/common/custom_button.dart';
import 'package:travel_planner/widgets/trip/create_trip_step_indicator.dart';
import 'package:travel_planner/widgets/trip/step1_destination.dart';
import 'package:travel_planner/widgets/trip/step2_dates.dart';
import 'package:travel_planner/widgets/trip/step3_budget.dart';
import 'package:travel_planner/widgets/trip/step4_preferences.dart';

/// Create trip multi-step screen
class CreateTripScreen extends ConsumerStatefulWidget {
  const CreateTripScreen({super.key});

  @override
  ConsumerState<CreateTripScreen> createState() => _CreateTripScreenState();
}

class _CreateTripScreenState extends ConsumerState<CreateTripScreen> {
  int _currentStep = 0;
  final int _totalSteps = 4;

  @override
  Widget build(BuildContext context) {
    final createTripState = ref.watch(createTripProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Lập lịch trình thông minh'),
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.x),
          onPressed: () => _handleBack(context),
        ),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(bottom: BorderSide(color: AppColors.border)),
            ),
            child: CreateTripStepIndicator(
              currentStep: _currentStep + 1,
              totalSteps: _totalSteps,
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: _buildStepContent(),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  if (_currentStep > 0) ...[
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => setState(() => _currentStep--),
                        icon: const Icon(LucideIcons.arrowLeft, size: 18),
                        label: const Text('Quay lại'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            vertical: AppSpacing.md,
                          ),
                          side: const BorderSide(color: AppColors.border),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppRadius.md),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                  ],
                  Expanded(
                    child: CustomButton(
                      text: _currentStep == _totalSteps - 1
                          ? 'Khởi tạo lịch trình'
                          : 'Tiếp tục',
                      onPressed:
                          _canProceed(createTripState) ? _handleNext : null,
                      isLoading: createTripState.isLoading,
                      icon: Icon(
                        _currentStep == _totalSteps - 1
                            ? LucideIcons.sparkles
                            : LucideIcons.arrowRight,
                        color: Colors.white,
                        size: 18,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return const Step1Destination();
      case 1:
        return const Step2Dates();
      case 2:
        return const Step3Budget();
      case 3:
        return const Step4Preferences();
      default:
        return const SizedBox.shrink();
    }
  }

  bool _canProceed(CreateTripState state) {
    switch (_currentStep) {
      case 0:
        return state.destinations.isNotEmpty;
      case 1:
        return state.startDate != null && state.endDate != null;
      case 2:
        return state.budgetPerPerson > 0 && state.groupSize > 0;
      case 3:
        return state.preferences.isNotEmpty;
      default:
        return false;
    }
  }

  Future<void> _handleNext() async {
    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
      return;
    }

    final created = await ref.read(createTripProvider.notifier).createTrip();
    if (!mounted) return;
    if (created != null) {
      ref.read(createTripProvider.notifier).reset();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Tạo lịch trình thông minh thành công!'),
          backgroundColor: AppColors.success,
        ),
      );
      context.pushReplacement('/trips/${created.id}');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            ref.read(createTripProvider).error ?? 'Không thể tạo lịch trình',
          ),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  void _handleBack(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Hủy tạo chuyến đi?'),
        content: const Text('Các thông tin bạn đã nhập sẽ không được lưu.'),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Tiếp tục'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.pop();
            },
            child: const Text('Hủy', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}
