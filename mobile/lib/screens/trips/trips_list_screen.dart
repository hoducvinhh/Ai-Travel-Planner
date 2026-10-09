import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../config/colors.dart';
import '../../config/text_styles.dart';
import '../../config/radius.dart';
import '../../config/spacing.dart';
import '../../providers/trips_provider.dart';
import '../../widgets/trip/trip_card.dart';
import '../../widgets/common/loading_indicator.dart';

/// Trips list screen
class TripsListScreen extends ConsumerWidget {
  const TripsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripsAsync = ref.watch(tripsNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chuyến đi của tôi'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(tripsNotifierProvider.notifier).refresh();
        },
        child: tripsAsync.when(
          loading: () => const LoadingIndicator(),
          error: (error, stack) => _buildError(context, error.toString(), ref),
          data: (trips) => trips.isEmpty
              ? _buildEmptyState(context)
              : _buildTripsList(context, trips),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          context.push('/trips/create');
        },
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text(
          'Tạo chuyến đi',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: AppColors.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
      ),
    );
  }

  /// Build trips list
  Widget _buildTripsList(BuildContext context, List trips) {
    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: trips.length,
      separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, index) {
        final trip = trips[index];
        return TripCard(
          trip: trip,
          onTap: () {
            context.push('/trips/${trip.id}');
          },
        );
      },
    );
  }

  /// Build empty state
  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              LucideIcons.mapPin,
              size: 80,
              color: AppColors.textSecondary,
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              'Chưa có chuyến đi nào',
              style: AppTextStyles.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Tạo chuyến đi đầu tiên của bạn\nvà khám phá những điểm đến tuyệt vời!',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton.icon(
              onPressed: () {
                context.push('/trips/create');
              },
              icon: const Icon(LucideIcons.plus, size: 20, color: Colors.white),
              label: const Text(
                'Tạo chuyến đi mới',
                style: TextStyle(color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.lg,
                  vertical: AppSpacing.md,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Build error state
  Widget _buildError(BuildContext context, String message, WidgetRef ref) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              LucideIcons.alertCircle,
              size: 64,
              color: AppColors.error,
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              'Đã có lỗi xảy ra',
              style: AppTextStyles.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              message,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton.icon(
              onPressed: () {
                ref.read(tripsNotifierProvider.notifier).refresh();
              },
              icon: const Icon(LucideIcons.refreshCw, size: 20, color: Colors.white),
              label: const Text(
                'Thử lại',
                style: TextStyle(color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.lg,
                  vertical: AppSpacing.md,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
