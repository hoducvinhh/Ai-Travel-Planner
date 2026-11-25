import 'package:flutter/material.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/widgets/common/animations.dart';

class _SkeletonBox extends StatelessWidget {
  final double? width;
  final double height;
  final double radius;

  const _SkeletonBox({
    this.width,
    required this.height,
    this.radius = AppRadius.sm,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.border,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}

/// Skeleton card for Places discovery feed loading state
class PlaceCardSkeleton extends StatelessWidget {
  const PlaceCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: const ShimmerEffect(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _SkeletonBox(width: double.infinity, height: 180, radius: 0),
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SkeletonBox(width: 190, height: 18),
                  SizedBox(height: AppSpacing.xs),
                  _SkeletonBox(width: 130, height: 14),
                  SizedBox(height: AppSpacing.sm),
                  _SkeletonBox(width: double.infinity, height: 12),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Skeleton card for Trips list loading state
class TripCardSkeleton extends StatelessWidget {
  const TripCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: const ShimmerEffect(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _SkeletonBox(width: double.infinity, height: 150, radius: 0),
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SkeletonBox(width: 160, height: 18),
                  SizedBox(height: AppSpacing.sm),
                  _SkeletonBox(width: 210, height: 14),
                  SizedBox(height: AppSpacing.xs),
                  _SkeletonBox(width: 140, height: 14),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
