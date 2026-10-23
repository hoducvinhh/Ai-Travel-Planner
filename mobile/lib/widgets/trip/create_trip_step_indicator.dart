import 'package:flutter/material.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';

/// Step indicator widget
class CreateTripStepIndicator extends StatelessWidget {
  final int currentStep;
  final int totalSteps;

  const CreateTripStepIndicator({
    super.key,
    required this.currentStep,
    required this.totalSteps,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(totalSteps, (index) {
        final stepNumber = index + 1;
        final isActive = stepNumber == currentStep;
        final isCompleted = stepNumber < currentStep;

        return Expanded(
          child: Row(
            children: [
              Expanded(
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: isCompleted || isActive
                        ? AppColors.primary
                        : AppColors.border,
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                ),
              ),
              if (index < totalSteps - 1)
                const SizedBox(width: AppSpacing.xs),
            ],
          ),
        );
      }),
    );
  }
}
