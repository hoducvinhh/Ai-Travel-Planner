import 'package:flutter/material.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';

/// Reusable illustrated empty state for lists, feeds, and search results
class EmptyStateView extends StatelessWidget {
  final String assetPath;
  final String title;
  final String subtitle;
  final String? actionLabel;
  final IconData? actionIcon;
  final VoidCallback? onAction;
  final double imageHeight;

  const EmptyStateView({
    super.key,
    required this.assetPath,
    required this.title,
    required this.subtitle,
    this.actionLabel,
    this.actionIcon,
    this.onAction,
    this.imageHeight = 160,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.lg),
              child: Image.asset(
                assetPath,
                height: imageHeight,
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => Container(
                  height: 96,
                  width: 96,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.08),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.explore_outlined,
                    size: 40,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              title,
              style: AppTextStyles.headlineSmall.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              subtitle,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
                height: 1.45,
              ),
              textAlign: TextAlign.center,
            ),
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: AppSpacing.lg),
              ElevatedButton.icon(
                onPressed: onAction,
                icon: Icon(actionIcon ?? Icons.add, size: 18),
                label: Text(actionLabel!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
