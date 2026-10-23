import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';
import 'package:travel_planner/widgets/trip/trip_header.dart';
import 'package:travel_planner/widgets/trip/itinerary_day_section.dart';
import 'package:travel_planner/widgets/map/trip_map.dart';

/// Trip detail screen
class TripDetailScreen extends ConsumerWidget {
  final String tripId;

  const TripDetailScreen({
    super.key,
    required this.tripId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripAsync = ref.watch(tripProvider(tripId));

    return Scaffold(
      body: tripAsync.when(
        loading: () => const LoadingIndicator(),
        error: (error, stack) => _buildErrorState(context, ref, error),
        data: (trip) => CustomScrollView(
          slivers: [
            // App Bar with image
            SliverAppBar(
              expandedHeight: 250,
              pinned: true,
              backgroundColor: AppColors.primary,
              leading: IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(AppSpacing.xs),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.3),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.arrowLeft,
                    color: Colors.white,
                  ),
                ),
                onPressed: () => context.pop(),
              ),
              actions: [
                IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(AppSpacing.xs),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.3),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      LucideIcons.pencil,
                      color: Colors.white,
                    ),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Chức năng chỉnh sửa đang phát triển'),
                      ),
                    );
                  },
                ),
                IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(AppSpacing.xs),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.3),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      LucideIcons.trash2,
                      color: Colors.white,
                    ),
                  ),
                  onPressed: () => _showDeleteDialog(context, ref),
                ),
              ],
              flexibleSpace: FlexibleSpaceBar(
                background: TripHeader(trip: trip),
              ),
            ),

            // Trip Info
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Destination
                    Text(
                      trip.destination,
                      style: AppTextStyles.displayMedium.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: AppSpacing.md),

                    // Date range
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.xs),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                          child: const Icon(
                            LucideIcons.calendar,
                            size: 20,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Text(
                          _formatDateRange(trip.startDate, trip.endDate),
                          style: AppTextStyles.bodyLarge.copyWith(
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: AppSpacing.sm),

                    // Budget
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.xs),
                          decoration: BoxDecoration(
                            color: AppColors.accent.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                          child: const Icon(
                            LucideIcons.dollarSign,
                            size: 20,
                            color: AppColors.accent,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Text(
                          _formatBudget(trip.budget),
                          style: AppTextStyles.bodyLarge.copyWith(
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),

                    if (trip.travelersCount != null) ...[
                      const SizedBox(height: AppSpacing.sm),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(AppSpacing.xs),
                            decoration: BoxDecoration(
                              color: AppColors.secondary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(AppRadius.sm),
                            ),
                            child: const Icon(
                              LucideIcons.users,
                              size: 20,
                              color: AppColors.secondary,
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Text(
                            '${trip.travelersCount} người',
                            style: AppTextStyles.bodyLarge.copyWith(
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ],

                    if (trip.description != null) ...[
                      const SizedBox(height: AppSpacing.lg),
                      Text(
                        trip.description!,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.6,
                        ),
                      ),
                    ],

                    const SizedBox(height: AppSpacing.md),

                    // Map Section
                    if (trip.itinerary != null && trip.itinerary!.isNotEmpty)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Bản đồ',
                            style: AppTextStyles.headlineMedium.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.md),
                          SizedBox(
                            height: 250,
                            child: TripMap(
                              places: trip.itinerary!,
                              showRoute: true,
                              initialZoom: 12.0,
                              onMarkerTap: (place) {
                                context.push('/places/${place.id}');
                              },
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xl),
                        ],
                      ),

                    // Itinerary Section
                    Text(
                      'Lịch trình',
                      style: AppTextStyles.headlineMedium.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: AppSpacing.md),
                  ],
                ),
              ),
            ),

            // Itinerary Days (placeholder - will be populated when places are available)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                child: ItineraryDaySection(
                  dayNumber: 1,
                  date: trip.startDate,
                  places: const [],
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: AppSpacing.xl),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(BuildContext context, WidgetRef ref, Object error) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
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
                'Không thể tải chi tiết chuyến đi',
                style: AppTextStyles.headlineMedium,
                textAlign: TextAlign.center,
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
                onPressed: () => ref.invalidate(tripProvider(tripId)),
                icon: const Icon(LucideIcons.refreshCw, size: 20),
                label: const Text('Thử lại'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, WidgetRef ref) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xóa chuyến đi'),
        content: const Text(
          'Bạn có chắc chắn muốn xóa chuyến đi này? '
          'Hành động này không thể hoàn tác.',
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Hủy',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Chức năng xóa chuyến đi đang phát triển'),
                ),
              );
            },
            child: const Text(
              'Xóa',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDateRange(String startDate, String endDate) {
    try {
      final start = DateTime.parse(startDate);
      final end = DateTime.parse(endDate);
      final formatter = DateFormat('dd/MM/yyyy');
      final days = end.difference(start).inDays + 1;
      return '${formatter.format(start)} - ${formatter.format(end)} ($days ngày)';
    } catch (e) {
      return '$startDate - $endDate';
    }
  }

  String _formatBudget(double budget) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(budget);
  }
}
