import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/widgets/trip/trip_card.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';

/// Trips list screen
class TripsListScreen extends ConsumerWidget {
  const TripsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripsAsync = ref.watch(tripsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chuyến đi của tôi'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.user),
            onPressed: () => context.push('/profile'),
            tooltip: 'Hồ sơ',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(tripsProvider);
        },
        child: tripsAsync.when(
          loading: () => const LoadingIndicator(),
          error: (error, stack) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  LucideIcons.circleAlert,
                  size: 64,
                  color: AppColors.error,
                ),
                const SizedBox(height: AppSpacing.md),
                const Text(
                  'Đã có lỗi xảy ra',
                  style: AppTextStyles.headlineMedium,
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  error.toString(),
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.lg),
                ElevatedButton.icon(
                  onPressed: () => ref.invalidate(tripsProvider),
                  icon: const Icon(LucideIcons.refreshCw, size: 20),
                  label: const Text('Thử lại'),
                ),
              ],
            ),
          ),
          data: (trips) {
            if (trips.isEmpty) {
              return _buildEmptyState(context);
            }

            return ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
              itemCount: trips.length,
              itemBuilder: (context, index) {
                final trip = trips[index];
                return TripCard(
                  trip: trip,
                  onTap: () {
                    // TODO: Navigate to trip detail
                    context.push('/trips/${trip.id}');
                  },
                );
              },
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Navigate to create trip screen
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Chức năng tạo chuyến đi đang phát triển'),
            ),
          );
        },
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(LucideIcons.plus),
        label: const Text('Tạo chuyến đi'),
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
              size: 80,
              color: AppColors.textSecondary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              'Chưa có chuyến đi nào',
              style: AppTextStyles.headlineMedium.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Hãy bắt đầu lên kế hoạch cho chuyến đi đầu tiên của bạn',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Navigate to create trip
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Chức năng tạo chuyến đi đang phát triển'),
                  ),
                );
              },
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
              icon: const Icon(LucideIcons.plus, size: 20),
              label: Text(
                'Tạo chuyến đi mới',
                style: AppTextStyles.labelLarge.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
