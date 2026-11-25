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
import 'package:travel_planner/models/user.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/biometric_provider.dart';
import 'package:travel_planner/providers/user_profile_provider.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';

const List<String> _availableProfileStyles = [
  'Thiên nhiên',
  'Văn hóa',
  'Lịch sử',
  'Ẩm thực',
  'Check-in',
  'Nghỉ dưỡng',
  'Khám phá',
  'Phượt',
  'Mua sắm',
  'Giải trí',
];

const List<Map<String, String>> _budgetOptions = [
  {
    'key': 'budget',
    'label': 'Tiết kiệm (< 1.000.000đ/ngày)',
    'desc': 'Tập trung trải nghiệm giá rẻ, ẩm thực đường phố',
  },
  {
    'key': 'standard',
    'label': 'Tiêu chuẩn (1.000.000đ - 3.000.000đ/ngày)',
    'desc': 'Cân bằng giữa chi phí và tiện nghi',
  },
  {
    'key': 'luxury',
    'label': 'Cao cấp (> 3.000.000đ/ngày)',
    'desc': 'Trải nghiệm tiện nghi cao cấp, resort và nhà hàng',
  },
];

/// Personal Profile & 6-Tab Interaction Dashboard matching Web /profile
class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  final TextEditingController _nameController = TextEditingController();
  List<String> _selectedStyles = [];
  String _selectedBudget = 'standard';
  bool _syncedPrefFields = false;
  bool _isSavingPref = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _syncPreferencesFrom(User user) {
    if (_syncedPrefFields) return;
    _syncedPrefFields = true;
    _nameController.text = user.name;
    _selectedStyles = List<String>.from(user.preferredStyles);
    final rawBudget = (user.budgetLevel ?? 'standard').toLowerCase();
    _selectedBudget =
        rawBudget == 'moderate' ? 'standard' : rawBudget;
  }

  Future<void> _savePreferences() async {
    setState(() => _isSavingPref = true);
    try {
      await ref.read(userProfileDashboardProvider.notifier).savePreferences(
            name: _nameController.text.trim(),
            preferredStyles: _selectedStyles,
            budgetLevel: _selectedBudget,
          );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đã cập nhật thông tin và sở thích thành công!'),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi lưu cài đặt: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSavingPref = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final profileAsync = ref.watch(userProfileDashboardProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Hồ sơ cá nhân'),
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut, color: AppColors.error),
            onPressed: () => _showLogoutDialog(context),
            tooltip: 'Đăng xuất',
          ),
        ],
      ),
      body: authState.when(
        initial: () => const LoadingIndicator(),
        loading: () => const LoadingIndicator(),
        error: (msg) => Center(child: Text(msg)),
        unauthenticated: () => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.userX,
                  size: 56, color: AppColors.textSecondary),
              const SizedBox(height: AppSpacing.md),
              const Text('Chưa đăng nhập', style: AppTextStyles.headlineMedium),
              const SizedBox(height: AppSpacing.md),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                child: const Text('Đăng nhập'),
              ),
            ],
          ),
        ),
        authenticated: (authUser) {
          return profileAsync.when(
            loading: () => const LoadingIndicator(),
            error: (err, _) => Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Không thể tải hồ sơ: $err'),
                  const SizedBox(height: AppSpacing.sm),
                  ElevatedButton(
                    onPressed: () => ref
                        .read(userProfileDashboardProvider.notifier)
                        .loadProfile(),
                    child: const Text('Thử lại'),
                  ),
                ],
              ),
            ),
            data: (data) {
              final u = data?.user ?? authUser;
              _syncPreferencesFrom(u);
              final stats = data?.stats ?? const UserProfileStats();

              return NestedScrollView(
                headerSliverBuilder: (_, __) => [
                  SliverToBoxAdapter(
                    child: Container(
                      color: AppColors.surface,
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 32,
                                backgroundColor: AppColors.textPrimary,
                                child: Text(
                                  u.displayName[0].toUpperCase(),
                                  style: AppTextStyles.headlineMedium.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      u.displayName,
                                      style: AppTextStyles.headlineSmall
                                          .copyWith(fontWeight: FontWeight.bold),
                                    ),
                                    Text(
                                      u.email,
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                    if (u.budgetLevel != null) ...[
                                      const SizedBox(height: 4),
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 8,
                                          vertical: 2,
                                        ),
                                        decoration: BoxDecoration(
                                          color: AppColors.primary
                                              .withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(
                                              AppRadius.full),
                                        ),
                                        child: Text(
                                          'Ngân sách: ${u.budgetLevel}',
                                          style:
                                              AppTextStyles.labelSmall.copyWith(
                                            color: AppColors.primary,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: AppSpacing.md),

                          // 5 Metric Cards
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                                _MetricCard(
                                  icon: LucideIcons.calendar,
                                  value: '${stats.tripsCount}',
                                  label: 'Chuyến đi',
                                ),
                                _MetricCard(
                                  icon: LucideIcons.bookmark,
                                  value: '${stats.savedCount}',
                                  label: 'Đã lưu',
                                ),
                                _MetricCard(
                                  icon: LucideIcons.heart,
                                  value: '${stats.likedCount}',
                                  label: 'Đã thích',
                                ),
                                _MetricCard(
                                  icon: LucideIcons.star,
                                  value: '${stats.ratedCount}',
                                  label: 'Đánh giá',
                                ),
                                _MetricCard(
                                  icon: LucideIcons.share2,
                                  value: '${stats.sharedCount}',
                                  label: 'Đã chia sẻ',
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SliverPersistentHeader(
                    pinned: true,
                    delegate: _TabHeaderDelegate(
                      TabBar(
                        controller: _tabController,
                        isScrollable: true,
                        labelColor: AppColors.primary,
                        unselectedLabelColor: AppColors.textSecondary,
                        indicatorColor: AppColors.primary,
                        tabs: [
                          Tab(
                              text:
                                  'Wishlist (${data?.savedPlaces.length ?? 0})'),
                          Tab(
                              text:
                                  'Đã thích (${data?.likedPlaces.length ?? 0})'),
                          Tab(
                              text:
                                  'Đánh giá (${data?.ratedPlaces.length ?? 0})'),
                          Tab(
                              text:
                                  'Chia sẻ (${data?.sharedPlaces.length ?? 0})'),
                          Tab(text: 'Chuyến đi (${data?.trips.length ?? 0})'),
                          const Tab(text: 'Cài đặt'),
                        ],
                      ),
                    ),
                  ),
                ],
                body: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildPlacesTab(
                      places: data?.savedPlaces ?? [],
                      emptyTitle: 'Chưa có địa điểm nào được lưu',
                      actionLabel: 'Bỏ lưu',
                      onRemove: (id) => ref
                          .read(userProfileDashboardProvider.notifier)
                          .removeSaved(id),
                    ),
                    _buildPlacesTab(
                      places: data?.likedPlaces ?? [],
                      emptyTitle: 'Chưa thích địa điểm nào',
                      actionLabel: 'Bỏ thích',
                      onRemove: (id) => ref
                          .read(userProfileDashboardProvider.notifier)
                          .removeLiked(id),
                    ),
                    _buildRatedTab(data?.ratedPlaces ?? []),
                    _buildSharedTab(data?.sharedPlaces ?? []),
                    _buildTripsTab(data),
                    _buildSettingsTab(),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildPlacesTab({
    required List<Place> places,
    required String emptyTitle,
    required String actionLabel,
    required Future<void> Function(String id) onRemove,
  }) {
    if (places.isEmpty) {
      return Center(
        child: Text(
          emptyTitle,
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: places.length,
      itemBuilder: (_, idx) {
        final place = places[idx];
        return Card(
          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            side: const BorderSide(color: AppColors.border),
          ),
          elevation: 0,
          child: ListTile(
            title: Text(
              place.name,
              style: AppTextStyles.labelLarge
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              place.province,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            trailing: IconButton(
              icon: const Icon(LucideIcons.trash2,
                  size: 18, color: AppColors.error),
              tooltip: actionLabel,
              onPressed: () => onRemove(place.id),
            ),
            onTap: () => context.push('/places/${place.id}'),
          ),
        );
      },
    );
  }

  Widget _buildRatedTab(List<UserRatedPlaceItem> items) {
    if (items.isEmpty) {
      return Center(
        child: Text(
          'Chưa đánh giá địa điểm nào',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: items.length,
      itemBuilder: (_, idx) {
        final item = items[idx];
        return Card(
          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            side: const BorderSide(color: AppColors.border),
          ),
          elevation: 0,
          child: ListTile(
            title: Text(
              item.place.name,
              style: AppTextStyles.labelLarge
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            subtitle: Text('Đã chấm: ${item.rating}/5 sao'),
            trailing: IconButton(
              icon: const Icon(LucideIcons.trash2,
                  size: 18, color: AppColors.error),
              onPressed: () => ref
                  .read(userProfileDashboardProvider.notifier)
                  .removeRating(item.place.id),
            ),
            onTap: () => context.push('/places/${item.place.id}'),
          ),
        );
      },
    );
  }

  Widget _buildSharedTab(List<UserSharedPlaceItem> items) {
    if (items.isEmpty) {
      return Center(
        child: Text(
          'Chưa có bài chia sẻ nào',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: items.length,
      itemBuilder: (_, idx) {
        final item = items[idx];
        return Card(
          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            side: const BorderSide(color: AppColors.border),
          ),
          elevation: 0,
          child: ListTile(
            title: Text(
              item.place.name,
              style: AppTextStyles.labelLarge
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            subtitle: item.note != null && item.note!.isNotEmpty
                ? Text('"${item.note}"')
                : Text(item.place.province),
            trailing: IconButton(
              icon: const Icon(LucideIcons.trash2,
                  size: 18, color: AppColors.error),
              onPressed: () => ref
                  .read(userProfileDashboardProvider.notifier)
                  .removeShared(item.place.id),
            ),
            onTap: () => context.push('/places/${item.place.id}'),
          ),
        );
      },
    );
  }

  Widget _buildTripsTab(UserProfileData? data) {
    final trips = data?.trips ?? [];
    if (trips.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Chưa có chuyến đi nào'),
            const SizedBox(height: AppSpacing.sm),
            ElevatedButton(
              onPressed: () => context.push('/trips/create'),
              child: const Text('Tạo chuyến đi mới'),
            ),
          ],
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: trips.length,
      itemBuilder: (_, idx) {
        final trip = trips[idx];
        return Card(
          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            side: const BorderSide(color: AppColors.border),
          ),
          elevation: 0,
          child: ListTile(
            title: Text(
              'Chuyến đi ${trip.destination}',
              style: AppTextStyles.labelLarge
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              '${_fmtDate(trip.startDate)} - ${_fmtDate(trip.endDate)} • ${trip.groupSize} người',
            ),
            trailing: const Icon(LucideIcons.chevronRight, size: 18),
            onTap: () => context.push('/trips/${trip.id}'),
          ),
        );
      },
    );
  }

  Widget _buildSettingsTab() {
    final bioAsync = ref.watch(biometricSettingsProvider);

    return ListView(
      padding: const EdgeInsets.all(AppSpacing.md),
      children: [
        Text(
          'Cài đặt hồ sơ & AI gợi ý',
          style: AppTextStyles.titleMedium.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: AppSpacing.sm),
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(
            labelText: 'Tên hiển thị của bạn',
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        Text(
          'Gu du lịch yêu thích',
          style: AppTextStyles.labelLarge.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: _availableProfileStyles.map((style) {
            final selected = _selectedStyles.contains(style);
            return FilterChip(
              label: Text(style),
              selected: selected,
              onSelected: (val) {
                setState(() {
                  if (val) {
                    _selectedStyles.add(style);
                  } else {
                    _selectedStyles.remove(style);
                  }
                });
              },
            );
          }).toList(),
        ),
        const SizedBox(height: AppSpacing.md),
        Text(
          'Mức ngân sách thông thường',
          style: AppTextStyles.labelLarge.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ..._budgetOptions.map((opt) {
          final selected = _selectedBudget == opt['key'];
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: InkWell(
              onTap: () => setState(() => _selectedBudget = opt['key']!),
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: selected
                      ? AppColors.primary.withValues(alpha: 0.08)
                      : AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(
                    color: selected ? AppColors.primary : AppColors.border,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      opt['label']!,
                      style: AppTextStyles.labelMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      opt['desc']!,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
        const SizedBox(height: AppSpacing.md),
        ElevatedButton.icon(
          onPressed: _isSavingPref ? null : _savePreferences,
          icon: _isSavingPref
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
              : const Icon(LucideIcons.check, size: 18),
          label: const Text('Lưu cài đặt hồ sơ'),
        ),
        const SizedBox(height: AppSpacing.lg),
        const Divider(),
        bioAsync.when(
          loading: () => const SizedBox.shrink(),
          error: (_, __) => const SizedBox.shrink(),
          data: (bio) {
            if (!bio.isAvailable) return const SizedBox.shrink();
            return SwitchListTile(
              title: const Text('Đăng nhập sinh trắc học'),
              subtitle: const Text('Sử dụng vân tay hoặc FaceID'),
              value: bio.isEnabled,
              onChanged: (val) => ref
                  .read(biometricSettingsProvider.notifier)
                  .setBiometricEnabled(val),
            );
          },
        ),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc chắn muốn đăng xuất?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authProvider.notifier).logout();
              if (context.mounted) context.go('/login');
            },
            child: const Text(
              'Đăng xuất',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }

  String _fmtDate(String raw) {
    try {
      return DateFormat('dd/MM/yyyy').format(DateTime.parse(raw));
    } catch (_) {
      return raw;
    }
  }
}

class _MetricCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _MetricCard({
    required this.icon,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 90,
      margin: const EdgeInsets.only(right: AppSpacing.xs),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Icon(icon, size: 16, color: AppColors.textSecondary),
          const SizedBox(height: 4),
          Text(
            value,
            style: AppTextStyles.titleMedium.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: AppTextStyles.bodySmall.copyWith(
              fontSize: 10,
              color: AppColors.textSecondary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _TabHeaderDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;
  _TabHeaderDelegate(this.tabBar);

  @override
  double get minExtent => tabBar.preferredSize.height + 1;
  @override
  double get maxExtent => tabBar.preferredSize.height + 1;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(covariant _TabHeaderDelegate oldDelegate) => false;
}
