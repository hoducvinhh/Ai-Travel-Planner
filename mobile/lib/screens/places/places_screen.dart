import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/providers/places_provider.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';
import 'package:travel_planner/widgets/place/place_card.dart';
import 'package:travel_planner/widgets/place/places_filter_sheet.dart';

/// Places browse screen
class PlacesScreen extends ConsumerStatefulWidget {
  const PlacesScreen({super.key});

  @override
  ConsumerState<PlacesScreen> createState() => _PlacesScreenState();
}

class _PlacesScreenState extends ConsumerState<PlacesScreen> {
  bool _isGridView = false;
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final placesAsync = ref.watch(placesProvider);
    final filter = ref.watch(placesFilterProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Khám phá địa điểm'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(_isGridView ? LucideIcons.list : LucideIcons.grid3x3),
            onPressed: () {
              setState(() {
                _isGridView = !_isGridView;
              });
            },
            tooltip: _isGridView ? 'Xem dạng danh sách' : 'Xem dạng lưới',
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and filter bar
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(color: AppColors.border, width: 1),
              ),
            ),
            child: Column(
              children: [
                // Search bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Tìm kiếm địa điểm...',
                    prefixIcon: const Icon(LucideIcons.search),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(LucideIcons.x),
                            onPressed: () {
                              _searchController.clear();
                              ref.read(placesFilterProvider.notifier).setSearch(null);
                            },
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      borderSide: const BorderSide(color: AppColors.primary, width: 2),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.sm,
                    ),
                  ),
                  onChanged: (value) {
                    ref.read(placesFilterProvider.notifier).setSearch(
                          value.isEmpty ? null : value,
                        );
                  },
                ),

                const SizedBox(height: AppSpacing.sm),

                // Filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      FilterChip(
                        label: const Text('Bộ lọc'),
                        avatar: const Icon(LucideIcons.sliders, size: 18),
                        onSelected: (selected) {
                          _showFilterSheet(context);
                        },
                        backgroundColor: Colors.white,
                        side: const BorderSide(color: AppColors.border),
                      ),
                      if (filter.category != null) ...[
                        const SizedBox(width: AppSpacing.sm),
                        Chip(
                          label: Text(_getCategoryName(filter.category!)),
                          avatar: const Icon(LucideIcons.tag, size: 18),
                          deleteIcon: const Icon(LucideIcons.x, size: 16),
                          onDeleted: () {
                            ref.read(placesFilterProvider.notifier).setCategory(null);
                          },
                          backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                        ),
                      ],
                      if (filter.province != null) ...[
                        const SizedBox(width: AppSpacing.sm),
                        Chip(
                          label: Text(filter.province!),
                          avatar: const Icon(LucideIcons.mapPin, size: 18),
                          deleteIcon: const Icon(LucideIcons.x, size: 16),
                          onDeleted: () {
                            ref.read(placesFilterProvider.notifier).setProvince(null);
                          },
                          backgroundColor: AppColors.secondary.withValues(alpha: 0.1),
                        ),
                      ],
                      if (filter.budgetLevel != null) ...[
                        const SizedBox(width: AppSpacing.sm),
                        Chip(
                          label: Text(_getBudgetName(filter.budgetLevel!)),
                          avatar: const Icon(LucideIcons.dollarSign, size: 18),
                          deleteIcon: const Icon(LucideIcons.x, size: 16),
                          onDeleted: () {
                            ref.read(placesFilterProvider.notifier).setBudgetLevel(null);
                          },
                          backgroundColor: AppColors.accent.withValues(alpha: 0.1),
                        ),
                      ],
                      if (filter.category != null || filter.province != null || filter.budgetLevel != null) ...[
                        const SizedBox(width: AppSpacing.sm),
                        TextButton.icon(
                          onPressed: () {
                            ref.read(placesFilterProvider.notifier).reset();
                          },
                          icon: const Icon(LucideIcons.x, size: 16),
                          label: const Text('Xóa tất cả'),
                          style: TextButton.styleFrom(
                            foregroundColor: AppColors.error,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Places list
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(placesProvider);
              },
              child: placesAsync.when(
                loading: () => const LoadingIndicator(),
                error: (error, stack) => _buildErrorState(error),
                data: (places) {
                  if (places.isEmpty) {
                    return _buildEmptyState();
                  }

                  return _isGridView
                      ? _buildGridView(places)
                      : _buildListView(places);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGridView(List<Place> places) {
    return GridView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: AppSpacing.md,
        mainAxisSpacing: AppSpacing.md,
        childAspectRatio: 0.75,
      ),
      itemCount: places.length,
      itemBuilder: (context, index) {
        return PlaceCard(
          place: places[index],
          isCompact: true,
          onTap: () {
            context.push('/places/${places[index].id}');
          },
        );
      },
    );
  }

  Widget _buildListView(List<Place> places) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
      itemCount: places.length,
      itemBuilder: (context, index) {
        return PlaceCard(
          place: places[index],
          onTap: () {
            context.push('/places/${places[index].id}');
          },
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              LucideIcons.searchX,
              size: 80,
              color: AppColors.textSecondary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              'Không tìm thấy địa điểm',
              style: AppTextStyles.headlineMedium.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
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
              onPressed: () => ref.invalidate(placesProvider),
              icon: const Icon(LucideIcons.refreshCw, size: 20),
              label: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const PlacesFilterSheet(),
    );
  }

  String _getCategoryName(String category) {
    switch (category.toLowerCase()) {
      case 'beach':
        return 'Biển';
      case 'mountain':
        return 'Núi';
      case 'culture':
        return 'Văn hóa';
      case 'food':
        return 'Ẩm thực';
      case 'nature':
        return 'Thiên nhiên';
      case 'city':
        return 'Đô thị';
      default:
        return category;
    }
  }

  String _getBudgetName(String level) {
    switch (level) {
      case 'low':
        return 'Tiết kiệm';
      case 'medium':
        return 'Trung bình';
      case 'high':
        return 'Cao cấp';
      default:
        return level;
    }
  }
}
