import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/models/trip.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';
import 'package:travel_planner/widgets/map/trip_map.dart';
import 'package:travel_planner/widgets/place/place_directions_sheet.dart';
import 'package:travel_planner/widgets/place/place_weather_pill.dart';
import 'package:travel_planner/widgets/trip/trip_feasibility_card.dart';

class _SessionConfig {
  final String slot; // 'morning' | 'afternoon' | 'evening'
  final String label;
  final IconData icon;
  final String timeRange;
  final String theme;
  final String emptyNote;

  const _SessionConfig({
    required this.slot,
    required this.label,
    required this.icon,
    required this.timeRange,
    required this.theme,
    required this.emptyNote,
  });
}

const List<_SessionConfig> _sessionDefinitions = [
  _SessionConfig(
    slot: 'morning',
    label: 'Buổi Sáng',
    icon: LucideIcons.sunrise,
    timeRange: '08:00 - 11:30',
    theme: 'Tham quan văn hoá, di tích & Khởi đầu ngày mới',
    emptyNote:
        'Buổi sáng tự do: Thưởng thức bữa sáng, cà phê hoặc nghỉ ngơi chuẩn bị cho chuyến đi.',
  ),
  _SessionConfig(
    slot: 'afternoon',
    label: 'Buổi Chiều',
    icon: LucideIcons.sun,
    timeRange: '13:30 - 17:30',
    theme: 'Vui chơi, trải nghiệm khám phá & Ẩm thực địa phương',
    emptyNote:
        'Buổi chiều tự do: Tự do tham quan các điểm lân cận hoặc mua sắm.',
  ),
  _SessionConfig(
    slot: 'evening',
    label: 'Buổi Tối',
    icon: LucideIcons.moon,
    timeRange: '18:30 - 21:30',
    theme: 'Ẩm thực đêm, phố đi bộ, chợ đêm & Ngắm cảnh',
    emptyNote:
        'Buổi tối tự do: Dạo mát, thưởng thức ẩm thực đường phố hoặc nghỉ ngơi.',
  ),
];

/// Trip detail screen matching Web /trips/[id]
class TripDetailScreen extends ConsumerStatefulWidget {
  final String tripId;

  const TripDetailScreen({
    super.key,
    required this.tripId,
  });

  @override
  ConsumerState<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends ConsumerState<TripDetailScreen> {
  int _selectedDay = 1;
  String _selectedSession = 'all'; // 'all' | 'morning' | 'afternoon' | 'evening'
  bool _isOptimizing = false;
  String? _optimizationNotice;
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _mapKey = GlobalKey();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  String _normalizePlaceSlot(ItineraryPlace place, int index, int total) {
    final slot = place.timeSlot;
    if (slot == 'morning' || slot == 'afternoon' || slot == 'evening') {
      return slot!;
    }
    final time = place.estimatedTime.toLowerCase();
    if (time.contains('sáng') ||
        time.contains('morn') ||
        RegExp(r'0[6-9]:|1[0-1]:').hasMatch(time)) {
      return 'morning';
    }
    if (time.contains('tối') ||
        time.contains('even') ||
        time.contains('night') ||
        RegExp(r'1[8-9]:|2[0-3]:').hasMatch(time)) {
      return 'evening';
    }
    if (time.contains('chiều') ||
        time.contains('trưa') ||
        time.contains('after') ||
        RegExp(r'1[2-7]:').hasMatch(time)) {
      return 'afternoon';
    }
    if (total <= 2) return index == 0 ? 'morning' : 'afternoon';
    if (index == 0) return 'morning';
    if (index >= total - 1) return 'evening';
    return 'afternoon';
  }

  String _formatDayDate(String startDateStr, int dayNumber, String rawDate) {
    try {
      final start = DateTime.parse(startDateStr);
      final d = start.add(Duration(days: dayNumber - 1));
      return DateFormat('EEEE, dd/MM/yyyy', 'vi_VN').format(d);
    } catch (_) {
      if (rawDate.trim().isNotEmpty) return rawDate;
      return 'Lịch trình ngày $dayNumber';
    }
  }

  Future<void> _handleOptimize() async {
    if (_isOptimizing) return;
    setState(() {
      _isOptimizing = true;
      _optimizationNotice = null;
    });
    try {
      final updated =
          await ref.read(tripDetailProvider(widget.tripId).notifier).optimizeRoute();
      if (!mounted) return;
      final stats = updated?.itinerary?.optimizationStats;
      setState(() {
        if (stats != null && stats.totalSavedDistanceKm > 0) {
          _optimizationNotice =
              'Tối ưu hóa thành công! Đã tiết kiệm ${stats.totalSavedDistanceKm} km (-${stats.totalSavedPercentage}% quãng đường di chuyển).';
        } else {
          _optimizationNotice =
              'Lộ trình đã được tối ưu hóa đường đi ngắn nhất thỏa mãn các khung giờ!';
        }
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Không thể tối ưu hóa lộ trình: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isOptimizing = false);
    }
  }

  void _openDirections(ItineraryPlace place) {
    PlaceDirectionsSheet.show(
      context,
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      province: place.province,
    );
  }

  void _focusMap() {
    final ctx = _mapKey.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(
        ctx,
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final tripAsync = ref.watch(tripDetailProvider(widget.tripId));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => context.pop(),
        ),
        title: tripAsync.maybeWhen(
          data: (trip) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                trip.destination,
                style: AppTextStyles.titleMedium.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              Text(
                '${_shortDate(trip.startDate)} - ${_shortDate(trip.endDate)} • ${trip.groupSize} người',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                ),
              ),
            ],
          ),
          orElse: () => const Text('Chi tiết lịch trình'),
        ),
      ),
      body: tripAsync.when(
        loading: () => const LoadingIndicator(),
        error: (error, _) => _buildErrorState(error),
        data: (trip) {
          final itinerary = trip.itinerary;
          final days = itinerary?.days ?? [];
          final currentDay = days.where((d) => d.dayNumber == _selectedDay).firstOrNull ??
              (days.isNotEmpty ? days.first : null);
          final dayPlaces = currentDay?.places ?? [];

          final grouped = _sessionDefinitions.map((def) {
            final list = <ItineraryPlace>[];
            for (var i = 0; i < dayPlaces.length; i++) {
              if (_normalizePlaceSlot(dayPlaces[i], i, dayPlaces.length) ==
                  def.slot) {
                list.add(dayPlaces[i]);
              }
            }
            return (config: def, places: list);
          }).toList();

          final displayedPlaces = _selectedSession == 'all'
              ? dayPlaces
              : grouped
                      .where((g) => g.config.slot == _selectedSession)
                      .firstOrNull
                      ?.places ??
                  dayPlaces;

          final mapPlaces = displayedPlaces
              .map(
                (p) => Place(
                  id: p.placeId,
                  name: p.name,
                  province: p.province ?? trip.destination,
                  latitude: p.latitude,
                  longitude: p.longitude,
                  categories: p.categories,
                  description: p.description,
                  imageUrl: p.imageUrl,
                  priceEstimate: p.priceEstimate,
                ),
              )
              .toList();

          return RefreshIndicator(
            color: AppColors.primary,
            onRefresh: () =>
                ref.read(tripDetailProvider(widget.tripId).notifier).loadTrip(),
            child: ListView(
              controller: _scrollController,
              padding: const EdgeInsets.all(AppSpacing.md),
              children: [
                // 1. Summary + Optimize Card
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.1),
                              borderRadius:
                                  BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text(
                              'AI (${days.length} ngày • 3 buổi/ngày)',
                              style: AppTextStyles.labelSmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          if (itinerary?.optimizationStats != null)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.textPrimary,
                                borderRadius:
                                    BorderRadius.circular(AppRadius.full),
                              ),
                              child: Text(
                                '⚡ Đã tối ưu (-${itinerary!.optimizationStats!.totalSavedPercentage}%)',
                                style: AppTextStyles.labelSmall.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Text(
                        (itinerary?.summary.isNotEmpty ?? false)
                            ? itinerary!.summary
                            : 'Lịch trình ${trip.destination}',
                        style: AppTextStyles.titleMedium.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Tổng chi phí dự kiến',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                  fontSize: 11,
                                ),
                              ),
                              Text(
                                _formatCurrency(
                                    itinerary?.totalEstimatedCost ?? 0),
                                style: AppTextStyles.titleMedium.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          ElevatedButton.icon(
                            onPressed: _isOptimizing ? null : _handleOptimize,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.textPrimary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 10,
                              ),
                            ),
                            icon: _isOptimizing
                                ? const SizedBox(
                                    width: 14,
                                    height: 14,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Icon(LucideIcons.zap, size: 15),
                            label: Text(
                              _isOptimizing
                                  ? 'Đang tối ưu...'
                                  : 'Tối ưu lộ trình',
                              style: const TextStyle(fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                      if (_optimizationNotice != null) ...[
                        const SizedBox(height: AppSpacing.sm),
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.sm),
                          decoration: BoxDecoration(
                            color: AppColors.success.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                LucideIcons.circleCheck,
                                size: 16,
                                color: AppColors.success,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _optimizationNotice!,
                                  style: AppTextStyles.bodySmall.copyWith(
                                    color: AppColors.success,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                // 2. 5-Dimension Feasibility Report Card (OFS)
                if (itinerary?.feasibilityReport != null) ...[
                  const SizedBox(height: AppSpacing.md),
                  TripFeasibilityCard(report: itinerary!.feasibilityReport!),
                ],

                const SizedBox(height: AppSpacing.md),

                // 3. Horizontal Day Selector
                if (days.isNotEmpty) ...[
                  Text(
                    'Lịch trình theo ngày (${days.length} ngày)',
                    style: AppTextStyles.labelLarge.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  SizedBox(
                    height: 82,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: days.length,
                      separatorBuilder: (_, __) =>
                          const SizedBox(width: AppSpacing.sm),
                      itemBuilder: (_, idx) {
                        final day = days[idx];
                        final active = day.dayNumber == (currentDay?.dayNumber ?? 1);
                        return InkWell(
                          onTap: () => setState(() {
                            _selectedDay = day.dayNumber;
                            _selectedSession = 'all';
                          }),
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          child: Container(
                            width: 155,
                            padding: const EdgeInsets.all(AppSpacing.sm),
                            decoration: BoxDecoration(
                              color: active
                                  ? AppColors.primary
                                  : AppColors.surface,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                              border: Border.all(
                                color: active
                                    ? AppColors.primary
                                    : AppColors.border,
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Ngày ${day.dayNumber}',
                                      style: AppTextStyles.labelLarge.copyWith(
                                        color: active
                                            ? Colors.white
                                            : AppColors.textPrimary,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '${day.places.length} điểm',
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: active
                                            ? Colors.white70
                                            : AppColors.textSecondary,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ],
                                ),
                                Text(
                                  _formatDayDate(
                                      trip.startDate, day.dayNumber, day.date),
                                  style: AppTextStyles.bodySmall.copyWith(
                                    color: active
                                        ? Colors.white.withValues(alpha: 0.9)
                                        : AppColors.textSecondary,
                                    fontSize: 11,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                if (day.optimizationStats != null &&
                                    day.optimizationStats!.savedDistanceKm > 0)
                                  Text(
                                    '⚡ -${day.optimizationStats!.savedPercentage}%',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: active
                                          ? Colors.white
                                          : AppColors.success,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],

                const SizedBox(height: AppSpacing.md),

                // 4. Interactive Day/Session Map
                if (mapPlaces.isNotEmpty) ...[
                  Container(
                    key: _mapKey,
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.md,
                            vertical: AppSpacing.sm,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  const Icon(LucideIcons.map, size: 15),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Bản đồ Ngày ${currentDay?.dayNumber ?? 1}',
                                    style: AppTextStyles.labelMedium.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                '${mapPlaces.length} điểm hiển thị',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                          height: 240,
                          child: TripMap(
                            key: ValueKey(
                                '${currentDay?.dayNumber}_$_selectedSession'),
                            places: mapPlaces,
                            onMarkerTap: (p) {
                              PlaceDirectionsSheet.show(
                                context,
                                name: p.name,
                                latitude: p.latitude,
                                longitude: p.longitude,
                                province: p.province,
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],

                // 5. Session Filter Tabs
                if (currentDay != null) ...[
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text('Tất cả (${dayPlaces.length})'),
                            selected: _selectedSession == 'all',
                            onSelected: (_) =>
                                setState(() => _selectedSession = 'all'),
                          ),
                        ),
                        ...grouped.map((g) {
                          return Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: ChoiceChip(
                              avatar: Icon(g.config.icon, size: 14),
                              label: Text(
                                  '${g.config.label} (${g.places.length})'),
                              selected: _selectedSession == g.config.slot,
                              onSelected: (_) => setState(
                                  () => _selectedSession = g.config.slot),
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),

                  // 6. Session Timelines
                  ...grouped
                      .where((g) =>
                          _selectedSession == 'all' ||
                          _selectedSession == g.config.slot)
                      .map((g) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.lg),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(AppSpacing.sm),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color:
                                        AppColors.primary.withValues(alpha: 0.1),
                                    borderRadius:
                                        BorderRadius.circular(AppRadius.sm),
                                  ),
                                  child: Icon(
                                    g.config.icon,
                                    size: 16,
                                    color: AppColors.primary,
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.sm),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '${g.config.label} • ${g.config.timeRange}',
                                        style: AppTextStyles.labelMedium.copyWith(
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        g.config.theme,
                                        style: AppTextStyles.bodySmall.copyWith(
                                          fontSize: 11,
                                          color: AppColors.textSecondary,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  '${g.places.length} điểm',
                                  style: AppTextStyles.labelSmall.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          if (g.places.isEmpty)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(AppSpacing.md),
                              decoration: BoxDecoration(
                                color: AppColors.surface,
                                borderRadius:
                                    BorderRadius.circular(AppRadius.md),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Text(
                                g.config.emptyNote,
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            )
                          else
                            ...g.places.map((p) => _buildItineraryPlaceCard(p)),
                        ],
                      ),
                    );
                  }),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildItineraryPlaceCard(ItineraryPlace place) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 26,
                height: 26,
                decoration: const BoxDecoration(
                  color: AppColors.textPrimary,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  '${place.orderInDay}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              if (place.imageUrl != null && place.imageUrl!.isNotEmpty) ...[
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                  child: CachedNetworkImage(
                    imageUrl: place.imageUrl!,
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                    errorWidget: (_, __, ___) => const SizedBox.shrink(),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      place.name,
                      style: AppTextStyles.labelLarge.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: [
                        PlaceWeatherPill(
                          latitude: place.latitude,
                          longitude: place.longitude,
                        ),
                        if (place.estimatedTime.isNotEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.background,
                              borderRadius:
                                  BorderRadius.circular(AppRadius.full),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Text(
                              place.estimatedTime,
                              style: AppTextStyles.bodySmall.copyWith(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (place.description.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.sm),
            Text(
              place.description,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
          const SizedBox(height: AppSpacing.sm),
          const Divider(height: 1),
          const SizedBox(height: AppSpacing.xs),
          Row(
            children: [
              Text(
                place.priceEstimate > 0
                    ? _formatCurrency(place.priceEstimate.toDouble())
                    : 'Miễn phí',
                style: AppTextStyles.labelMedium.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                onPressed: _focusMap,
                icon: const Icon(LucideIcons.mapPin, size: 14),
                label: const Text('Bản đồ', style: TextStyle(fontSize: 12)),
              ),
              OutlinedButton.icon(
                onPressed: () => _openDirections(place),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                icon: const Icon(LucideIcons.navigation, size: 13),
                label: const Text('Chỉ đường', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(Object error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.circleAlert, size: 56, color: AppColors.error),
            const SizedBox(height: AppSpacing.md),
            Text('Không thể tải chi tiết chuyến đi: $error',
                textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.md),
            ElevatedButton(
              onPressed: () =>
                  ref.read(tripDetailProvider(widget.tripId).notifier).loadTrip(),
              child: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }

  String _shortDate(String raw) {
    try {
      return DateFormat('dd/MM/yyyy').format(DateTime.parse(raw));
    } catch (_) {
      return raw;
    }
  }

  String _formatCurrency(double amount) {
    return NumberFormat.currency(
      locale: 'vi_VN',
      symbol: 'đ',
      decimalDigits: 0,
    ).format(amount);
  }
}
