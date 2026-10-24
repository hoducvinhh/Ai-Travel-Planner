import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
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
      appBar: AppBar(
        title: const Text('Tạo chuyến đi mới'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.x),
          onPressed: () => _handleBack(context),
        ),
      ),
      body: Column(
        children: [
          // Step indicator
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(
                  color: AppColors.border,
                  width: 1,
                ),
              ),
            ),
            child: CreateTripStepIndicator(
              currentStep: _currentStep + 1,
              totalSteps: _totalSteps,
            ),
          ),

          // Step content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: _buildStepContent(),
            ),
          ),

          // Navigation buttons
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(
                  color: AppColors.border,
                  width: 1,
                ),
              ),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  if (_currentStep > 0)
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          setState(() {
                            _currentStep--;
                          });
                        },
                        icon: const Icon(LucideIcons.arrowLeft, size: 20),
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
                  if (_currentStep > 0) const SizedBox(width: AppSpacing.md),
                  Expanded(
                    flex: _currentStep == 0 ? 1 : 1,
                    child: CustomButton(
                      text: _currentStep == _totalSteps - 1 ? 'Tạo chuyến đi' : 'Tiếp tục',
                      onPressed: _canProceed() ? _handleNext : null,
                      isLoading: createTripState.isLoading,
                      icon: _currentStep == _totalSteps - 1
                          ? const Icon(LucideIcons.check)
                          : const Icon(LucideIcons.arrowRight),
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

  bool _canProceed() {
    final state = ref.read(createTripProvider);

    switch (_currentStep) {
      case 0:
        return state.destination.isNotEmpty;
      case 1:
        return state.startDate != null && state.endDate != null;
      case 2:
        return state.budget > 0;
      case 3:
        return true; // Preferences are optional
      default:
        return false;
    }
  }

  void _handleNext() async {
    if (_currentStep < _totalSteps - 1) {
      setState(() {
        _currentStep++;
      });
    } else {
      // Create trip
      final success = await ref.read(createTripProvider.notifier).createTrip();
      if (success && mounted) {
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Tạo chuyến đi thành công!'),
            backgroundColor: AppColors.success,
          ),
        );
        // Navigate back and refresh trips list
        context.go('/trips');
      } else if (mounted) {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(ref.read(createTripProvider).error ?? 'Có lỗi xảy ra'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  void _handleBack(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hủy tạo chuyến đi?'),
        content: const Text(
          'Các thông tin bạn đã nhập sẽ không được lưu.',
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Tiếp tục',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.pop();
            },
            child: const Text(
              'Hủy',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }
}
