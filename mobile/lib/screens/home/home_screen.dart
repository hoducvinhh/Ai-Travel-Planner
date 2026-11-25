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

/// Home screen dashboard aligned with Web home features
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final TextEditingController _quickSearchController = TextEditingController();

  @override
  void dispose() {
    _quickSearchController.dispose();
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
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(AppRadius.sm),
              ),
              child: const Icon(
                LucideIcons.mapPin,
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
                  'Du lịch thông minh Việt Nam',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // AI Chat quick button
          IconButton(
            onPressed: () => context.push('/chat'),
            icon: const Icon(LucideIcons.messageSquare, size: 22),
            tooltip: 'Hỏi đáp AI',
          ),
          // 1-1 Direct Messages button with unread badge
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
                        color: AppColors.primary,
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
          await ref.read(unreadMessagesCountProvider.notifier).refreshUnreadCount();
        },
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.md),
          children: [
            // Hero Greeting
            Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.sm,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          LucideIcons.sparkles,
                          size: 14,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Cá nhân hóa cho $userName',
                          style: AppTextStyles.labelSmall.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    'Nền tảng du lịch thông minh dành riêng cho bạn',
                    style: AppTextStyles.headlineMedium.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    'Khám phá điểm đến thực tế, kết nối bạn đồng hành cùng gu và để AI tối ưu lịch trình từng buổi.',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),

                  // Quick Search Bar
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _quickSearchController,
                          textInputAction: TextInputAction.search,
                          onSubmitted: (_) => _executeQuickSearch(),
                          decoration: InputDecoration(
                            hintText: 'Bạn muốn đi đâu? (Đà Lạt, Sa Pa...)',
                            prefixIcon: const Icon(
                              LucideIcons.search,
                              size: 18,
                              color: AppColors.textSecondary,
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.md,
                              vertical: 10,
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
                      ElevatedButton(
                        onPressed: () => _executeQuickSearch(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.md,
                            vertical: 14,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                        ),
                        child: const Icon(LucideIcons.arrowRight, size: 18),
                      ),
                    ],
                  ),

                  const SizedBox(height: AppSpacing.md),

                  // Popular Destinations Quick Chips
                  Wrap(
                    spacing: AppSpacing.xs,
                    runSpacing: AppSpacing.xs,
                    children: popularQuickDestinations.map((dest) {
                      return ActionChip(
                        label: Text(dest['name']!),
                        labelStyle: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w500,
                        ),
                        backgroundColor: AppColors.background,
                        side: const BorderSide(color: AppColors.border),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        onPressed: () => _executeQuickSearch(dest['query']),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.lg),

            // 4 Core Feature Cards (2x2 Grid)
            Text(
              'Tính năng nổi bật',
              style: AppTextStyles.headlineSmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),

            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: AppSpacing.sm,
              mainAxisSpacing: AppSpacing.sm,
              childAspectRatio: 1.05,
              children: [
                _FeatureCard(
                  icon: LucideIcons.compass,
                  accentColor: AppColors.secondary,
                  title: 'Khám phá điểm đến',
                  subtitle: 'Thích, Wishlist, đánh giá & chỉ đường thời tiết',
                  onTap: () => StatefulNavigationShell.of(context).goBranch(1),
                ),
                _FeatureCard(
                  icon: LucideIcons.calendar,
                  accentColor: AppColors.primary,
                  title: 'Lập lịch trình AI',
                  subtitle: 'Tour liên tỉnh, 3 buổi/ngày, tối ưu & OFS',
                  badge: 'AI',
                  onTap: () => context.push('/trips/create'),
                ),
                _FeatureCard(
                  icon: LucideIcons.users,
                  accentColor: AppColors.categoryNature,
                  title: 'Cộng đồng & Buddy',
                  subtitle: 'Chia sẻ, nhân bản lịch trình & chat 1-1',
                  onTap: () => StatefulNavigationShell.of(context).goBranch(3),
                ),
                _FeatureCard(
                  icon: LucideIcons.messageSquare,
                  accentColor: AppColors.accent,
                  title: 'Hỏi đáp du lịch AI',
                  subtitle: 'RAG trích dẫn nguồn web & cẩm nang',
                  badge: 'Trợ lý',
                  onTap: () => context.push('/chat'),
                ),
              ],
            ),

            const SizedBox(height: AppSpacing.lg),

            // Recent Trips Section
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
              loading: () => const Padding(
                padding: EdgeInsets.all(AppSpacing.lg),
                child: Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
              ),
              error: (_, __) => _buildEmptyTripsCard(context),
              data: (trips) {
                if (trips.isEmpty) {
                  return _buildEmptyTripsCard(context);
                }
                return Column(
                  children: trips.take(3).map((trip) {
                    return Card(
                      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        side: const BorderSide(color: AppColors.border),
                      ),
                      elevation: 0,
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: AppSpacing.xs,
                        ),
                        leading: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppRadius.md),
                          ),
                          child: const Icon(
                            LucideIcons.mapPin,
                            color: AppColors.primary,
                            size: 20,
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
    );
  }

  Widget _buildEmptyTripsCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          const Icon(
            LucideIcons.map,
            size: 36,
            color: AppColors.textTertiary,
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Chưa có lịch trình nào',
            style: AppTextStyles.labelLarge.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Bắt đầu tạo chuyến đi đầu tiên để AI lên kế hoạch cho bạn.',
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.md),
          OutlinedButton.icon(
            onPressed: () => context.push('/trips/create'),
            icon: const Icon(LucideIcons.plus, size: 16),
            label: const Text('Tạo lịch trình ngay'),
          ),
        ],
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

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final Color accentColor;
  final String title;
  final String subtitle;
  final String? badge;
  final VoidCallback onTap;

  const _FeatureCard({
    required this.icon,
    required this.accentColor,
    required this.title,
    required this.subtitle,
    this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: accentColor.withValues(alpha: 0.14),
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                  child: Icon(icon, color: AppColors.textPrimary, size: 20),
                ),
                if (badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 3,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: Text(
                      badge!,
                      style: AppTextStyles.labelSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
              ],
            ),
            const Spacer(),
            Text(
              title,
              style: AppTextStyles.labelLarge.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textSecondary,
                fontSize: 11,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
