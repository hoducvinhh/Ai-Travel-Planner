import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/messages_provider.dart';
import 'package:travel_planner/providers/places_provider.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/widgets/common/animations.dart';
import 'package:travel_planner/widgets/common/empty_state_view.dart';
import 'package:travel_planner/widgets/common/skeleton_cards.dart';

/// Home screen dashboard with curated Vietnam hero carousel, destination strip, and crisp actions
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final TextEditingController _quickSearchController = TextEditingController();
  late final PageController _heroController;
  int _heroPage = 0;

  @override
  void initState() {
    super.initState();
    _heroController = PageController(viewportFraction: 0.92);
  }

  @override
  void dispose() {
    _quickSearchController.dispose();
    _heroController.dispose();
    super.dispose();
  }

  void _executeQuickSearch([String? overrideQuery]) {
    final query = (overrideQuery ?? _quickSearchController.text).trim();
    ref.read(placesFilterProvider.notifier).reset();
    if (query.isNotEmpty) {
      ref.read(placesFilterProvider.notifier).setSearch(query);
    }
    StatefulNavigationShell.of(context).goBranch(1);
  }

  void _openProvincePlaces(String provinceKey) {
    ref.read(placesFilterProvider.notifier).reset();
    ref.read(placesFilterProvider.notifier).setProvince(provinceKey);
    StatefulNavigationShell.of(context).goBranch(1);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final tripsAsync = ref.watch(tripsProvider);
    final unreadCount = ref.watch(unreadMessagesCountProvider);

    final userName = authState.maybeWhen(
      authenticated: (user) => user.displayName,
      orElse: () => 'bạn',
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(7),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(AppRadius.sm),
              ),
              child: const Icon(
                LucideIcons.compass,
                color: Colors.white,
                size: 18,
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'AI Travel Planner',
                  style: AppTextStyles.titleMedium.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Xin chào, $userName',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () => context.push('/chat'),
            icon: const Icon(LucideIcons.messageSquare, size: 22),
            tooltip: 'Hỏi đáp AI',
          ),
          Padding(
            padding: const EdgeInsets.only(right: AppSpacing.xs),
            child: Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  onPressed: () => context.push('/messages'),
                  icon: const Icon(LucideIcons.messageCircle, size: 22),
                  tooltip: 'Tin nhắn 1-1',
                ),
                if (unreadCount > 0)
                  Positioned(
                    top: 6,
                    right: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 5,
                        vertical: 1,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.notificationBadge,
                        borderRadius: BorderRadius.circular(AppRadius.full),
                      ),
                      constraints: const BoxConstraints(minWidth: 16),
                      child: Text(
                        unreadCount > 99 ? '99+' : '$unreadCount',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          ref.invalidate(tripsProvider);
          await ref
              .read(unreadMessagesCountProvider.notifier)
              .refreshUnreadCount();
        },
        child: ListView(
          padding: const EdgeInsets.only(bottom: AppSpacing.xl),
          children: [
            const SizedBox(height: AppSpacing.md),

            // Editorial Destination Hero Carousel
            SizedBox(
              height: 214,
              child: PageView.builder(
                controller: _heroController,
                itemCount: featuredDestinationBanners.length,
                onPageChanged: (idx) => setState(() => _heroPage = idx),
                itemBuilder: (context, idx) {
                  final banner = featuredDestinationBanners[idx];
                  return AnimatedBuilder(
                    animation: _heroController,
                    builder: (context, child) {
                      double scale = 1.0;
                      if (_heroController.hasClients &&
                          _heroController.position.haveDimensions) {
                        final page = _heroController.page ?? _heroPage.toDouble();
                        scale = (1 - (page - idx).abs() * 0.06).clamp(0.94, 1.0);
                      }
                      return Transform.scale(scale: scale, child: child);
                    },
                    child: _HeroBannerCard(
                      banner: banner,
                      onTap: () => _openProvincePlaces(banner.provinceKey),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: AppSpacing.sm),

            // Carousel Indicator Dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(featuredDestinationBanners.length, (i) {
                final active = i == _heroPage;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 220),
                  curve: Curves.easeOutCubic,
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: active ? 20 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: active ? AppColors.primary : AppColors.border,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                );
              }),
            ),

            // Quick Search Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.md,
                AppSpacing.md,
                AppSpacing.md,
                0,
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _quickSearchController,
                      textInputAction: TextInputAction.search,
                      onSubmitted: (_) => _executeQuickSearch(),
                      decoration: InputDecoration(
                        hintText: 'Tìm điểm đến: Đà Lạt, Sa Pa, Phú Quốc...',
                        prefixIcon: const Icon(
                          LucideIcons.search,
                          size: 18,
                          color: AppColors.textSecondary,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: 12,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadius.full),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadius.full),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  SizedBox(
                    height: 48,
                    width: 48,
                    child: ElevatedButton(
                      onPressed: () => _executeQuickSearch(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.zero,
                        shape: const CircleBorder(),
                      ),
                      child: const Icon(LucideIcons.arrowRight, size: 18),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.lg),

            // Visual Destination Story Strip
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Điểm đến nổi bật',
                    style: AppTextStyles.headlineSmall.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () =>
                        StatefulNavigationShell.of(context).goBranch(1),
                    child: const Text('Tất cả tỉnh thành'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            SizedBox(
              height: 112,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                scrollDirection: Axis.horizontal,
                itemCount: vietnamProvinces.length,
                separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.sm),
                itemBuilder: (context, idx) {
                  final prov = vietnamProvinces[idx];
                  return TactilePressScale(
                    onTap: () => _openProvincePlaces(prov.key),
                    child: SizedBox(
                      width: 96,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.asset(
                              provinceAssetPath(prov.key),
                              fit: BoxFit.cover,
                            ),
                            DecoratedBox(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    const Color(0xFF0F172A)
                                        .withValues(alpha: 0.78),
                                  ],
                                ),
                              ),
                            ),
                            Positioned(
                              left: 8,
                              right: 8,
                              bottom: 8,
                              child: Text(
                                prov.shortLabel,
                                style: AppTextStyles.labelSmall.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: AppSpacing.lg),

            // Primary AI Planner CTA + Compact 3-tool Row (avoiding repetitive 2x2 identical cards)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Lên kế hoạch & Trợ lý',
                    style: AppTextStyles.headlineSmall.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Primary AI Trip Banner
                  TactilePressScale(
                    onTap: () => context.push('/trips/create'),
                    child: Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.16),
                              borderRadius: BorderRadius.circular(AppRadius.md),
                            ),
                            child: const Icon(
                              LucideIcons.route,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Tạo lịch trình AI thông minh',
                                  style: AppTextStyles.titleMedium.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Tour liên tỉnh, chia 3 buổi/ngày & chấm điểm khả thi 5D',
                                  style: AppTextStyles.bodySmall.copyWith(
                                    color: Colors.white.withValues(alpha: 0.88),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: AppSpacing.xs),
                          const Icon(
                            LucideIcons.chevronRight,
                            color: Colors.white,
                            size: 20,
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: AppSpacing.sm),

                  // 3 Secondary Quick Action Pills
                  Row(
                    children: [
                      Expanded(
                        child: _CompactToolTile(
                          icon: LucideIcons.compass,
                          label: 'Khám phá',
                          onTap: () =>
                              StatefulNavigationShell.of(context).goBranch(1),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: _CompactToolTile(
                          icon: LucideIcons.users,
                          label: 'Travel Buddy',
                          onTap: () =>
                              StatefulNavigationShell.of(context).goBranch(3),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: _CompactToolTile(
                          icon: LucideIcons.sparkles,
                          label: 'Hỏi đáp AI',
                          onTap: () => context.push('/chat'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.lg),

            // Recent Trips Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Chuyến đi gần đây',
                        style: AppTextStyles.headlineSmall.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextButton(
                        onPressed: () =>
                            StatefulNavigationShell.of(context).goBranch(2),
                        child: const Text('Xem tất cả'),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  tripsAsync.when(
                    loading: () => const TripCardSkeleton(),
                    error: (_, __) => EmptyStateView(
                      assetPath: 'assets/images/illustrations/empty_trips.jpg',
                      title: 'Chưa có lịch trình nào',
                      subtitle:
                          'Bắt đầu tạo chuyến đi đầu tiên để AI gợi ý và tối ưu lộ trình cho bạn.',
                      actionLabel: 'Tạo lịch trình ngay',
                      actionIcon: LucideIcons.plus,
                      onAction: () => context.push('/trips/create'),
                      imageHeight: 130,
                    ),
                    data: (trips) {
                      if (trips.isEmpty) {
                        return Container(
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(AppRadius.lg),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: EmptyStateView(
                            assetPath:
                                'assets/images/illustrations/empty_trips.jpg',
                            title: 'Chưa có lịch trình nào',
                            subtitle:
                                'Bắt đầu tạo chuyến đi đầu tiên để AI gợi ý và tối ưu lộ trình cho bạn.',
                            actionLabel: 'Tạo lịch trình ngay',
                            actionIcon: LucideIcons.plus,
                            onAction: () => context.push('/trips/create'),
                            imageHeight: 120,
                          ),
                        );
                      }
                      return Column(
                        children: trips.take(3).map((trip) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(AppRadius.lg),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: AppSpacing.sm,
                                vertical: AppSpacing.xs,
                              ),
                              leading: ClipRRect(
                                borderRadius:
                                    BorderRadius.circular(AppRadius.md),
                                child: Image.asset(
                                  provinceAssetPath(trip.destination),
                                  width: 56,
                                  height: 56,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              title: Text(
                                trip.destination,
                                style: AppTextStyles.labelLarge.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              subtitle: Text(
                                '${_formatShortDate(trip.startDate)} - ${_formatShortDate(trip.endDate)} • ${trip.groupSize} người',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              trailing: const Icon(
                                LucideIcons.chevronRight,
                                size: 18,
                                color: AppColors.textSecondary,
                              ),
                              onTap: () => context.push('/trips/${trip.id}'),
                            ),
                          );
                        }).toList(),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatShortDate(String dateStr) {
    try {
      return DateFormat('dd/MM/yyyy').format(DateTime.parse(dateStr));
    } catch (_) {
      return dateStr;
    }
  }
}

class _HeroBannerCard extends StatelessWidget {
  final FeaturedDestinationBanner banner;
  final VoidCallback onTap;

  const _HeroBannerCard({
    required this.banner,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: TactilePressScale(
        onTap: onTap,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppRadius.xl),
          child: Stack(
            fit: StackFit.expand,
            children: [
              Image.asset(
                banner.assetPath,
                fit: BoxFit.cover,
              ),
              DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    stops: const [0.25, 1.0],
                    colors: [
                      Colors.transparent,
                      const Color(0xFF0F172A).withValues(alpha: 0.84),
                    ],
                  ),
                ),
              ),
              Positioned(
                left: AppSpacing.md,
                right: AppSpacing.md,
                bottom: AppSpacing.md,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      banner.title,
                      style: AppTextStyles.headlineMedium.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      banner.subtitle,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: Colors.white.withValues(alpha: 0.9),
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CompactToolTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _CompactToolTile({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return TactilePressScale(
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minHeight: 72),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 20, color: AppColors.primary),
            const SizedBox(height: 6),
            Text(
              label,
              style: AppTextStyles.labelSmall.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
