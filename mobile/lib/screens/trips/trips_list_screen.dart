import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/widgets/common/empty_state_view.dart';
import 'package:travel_planner/widgets/common/skeleton_cards.dart';
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
          loading: () => ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
            itemCount: 3,
            itemBuilder: (_, __) => const TripCardSkeleton(),
          ),
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
    return EmptyStateView(
      assetPath: 'assets/images/illustrations/empty_trips.jpg',
      title: 'Chưa có lịch trình nào',
      subtitle: 'Bắt đầu khám phá và tạo chuyến đi thông minh đầu tiên cùng AI.',
      actionLabel: 'Tạo lịch trình ngay',
      actionIcon: LucideIcons.plus,
      onAction: () => context.push('/trips/create'),
    );
  }
}
