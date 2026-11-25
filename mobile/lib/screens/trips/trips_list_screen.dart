import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';
import 'package:travel_planner/widgets/trip/trip_card.dart';

/// Trips list screen
class TripsListScreen extends ConsumerWidget {
  const TripsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripsAsync = ref.watch(tripsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Lịch trình của tôi'),
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          ref.invalidate(tripsProvider);
        },
        child: tripsAsync.when(
          loading: () => const LoadingIndicator(),
          error: (error, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    LucideIcons.circleAlert,
                    size: 56,
                    color: AppColors.error,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  const Text('Đã có lỗi xảy ra', style: AppTextStyles.headlineMedium),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    error.toString(),
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  ElevatedButton.icon(
                    onPressed: () => ref.invalidate(tripsProvider),
                    icon: const Icon(LucideIcons.refreshCw, size: 18),
                    label: const Text('Thử lại'),
                  ),
                ],
              ),
            ),
          ),
          data: (trips) {
            if (trips.isEmpty) {
              return _buildEmptyState(context);
            }

            return ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
              itemCount: trips.length,
              itemBuilder: (context, index) {
                final trip = trips[index];
                return TripCard(
                  trip: trip,
                  onTap: () => context.push('/trips/${trip.id}'),
                );
              },
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/trips/create'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(LucideIcons.plus),
        label: const Text('Tạo lịch trình'),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              LucideIcons.plane,
              size: 72,
              color: AppColors.textSecondary.withValues(alpha: 0.45),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              'Chưa có lịch trình nào',
              style: AppTextStyles.headlineMedium.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Bắt đầu khám phá và tạo chuyến đi thông minh đầu tiên cùng AI.',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton.icon(
              onPressed: () => context.push('/trips/create'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.lg,
                  vertical: AppSpacing.md,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
              ),
              icon: const Icon(LucideIcons.plus, size: 18),
              label: const Text('Tạo lịch trình ngay'),
            ),
          ],
        ),
      ),
    );
  }
}
