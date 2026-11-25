import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/env.dart';
import 'package:travel_planner/config/provinces.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/places_provider.dart';

const List<String> _quickShareTags = [
  'View đẹp chụp ảnh',
  'Ẩm thực đặc sắc',
  'Không gian thư giãn',
  'Đáng để trải nghiệm',
  'Gợi ý đi cuối tuần',
];

/// Share Place Modal Bottom Sheet (mirrors web SharePlaceModal.tsx)
class SharePlaceSheet extends ConsumerStatefulWidget {
  final Place place;

  const SharePlaceSheet({super.key, required this.place});

  static Future<void> show(BuildContext context, Place place) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => SharePlaceSheet(place: place),
    );
  }

  @override
  ConsumerState<SharePlaceSheet> createState() => _SharePlaceSheetState();
}

class _SharePlaceSheetState extends ConsumerState<SharePlaceSheet> {
  final TextEditingController _noteController = TextEditingController();
  bool _isSubmitting = false;
  bool _copied = false;

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _copyLink() async {
    final link = '${Env.apiUrl}/places#${widget.place.id}';
    await Clipboard.setData(ClipboardData(text: link));
    if (!mounted) return;
    setState(() => _copied = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Đã sao chép liên kết vào bộ nhớ tạm!')),
    );
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  Future<void> _shareToProfile() async {
    final user = ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng đăng nhập để chia sẻ lên trang cá nhân!'),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      await ref.read(placesRepositoryProvider).sharePlace(
            userId: user.id,
            placeId: widget.place.id,
            note: _noteController.text,
          );
      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đã chia sẻ địa điểm lên trang cá nhân của bạn!'),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi chia sẻ: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _addTag(String tag) {
    final current = _noteController.text;
    if (current.contains(tag)) return;
    _noteController.text = current.isEmpty ? tag : '$current $tag';
  }

  @override
  Widget build(BuildContext context) {
    final place = widget.place;
    final provLabel = getProvinceMeta(place.province).label;
    final priceText = place.priceEstimate > 0
        ? '${NumberFormat('#,###', 'vi_VN').format(place.priceEstimate)} đ'
        : 'Miễn phí';

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
        ),
        padding: const EdgeInsets.all(AppSpacing.md),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: AppColors.textPrimary,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    child: const Icon(
                      LucideIcons.share2,
                      size: 18,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Chia sẻ địa điểm',
                          style: AppTextStyles.titleMedium.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Đăng lên trang cá nhân để bạn bè cùng khám phá',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(LucideIcons.x, size: 20),
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.md),

              // Place preview
              Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                      child: place.imageUrl != null && place.imageUrl!.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: place.imageUrl!,
                              width: 64,
                              height: 64,
                              fit: BoxFit.cover,
                            )
                          : Container(
                              width: 64,
                              height: 64,
                              color: AppColors.border,
                              child: const Icon(LucideIcons.mapPin),
                            ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            place.name,
                            style: AppTextStyles.labelLarge.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            place.district != null && place.district!.isNotEmpty
                                ? '${place.district}, $provLabel'
                                : provLabel,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            priceText,
                            style: AppTextStyles.labelSmall.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.md),

              Text(
                'Cảm nghĩ của bạn (tùy chọn)',
                style: AppTextStyles.labelMedium.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _noteController,
                maxLines: 3,
                maxLength: 300,
                decoration: InputDecoration(
                  hintText: 'Bạn thấy địa điểm này thế nào? Có mẹo gì hay không...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                ),
              ),

              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: _quickShareTags.map((tag) {
                  return ActionChip(
                    label: Text('+ $tag', style: const TextStyle(fontSize: 11)),
                    onPressed: () => _addTag(tag),
                    backgroundColor: AppColors.background,
                    side: const BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: AppSpacing.md),

              Row(
                children: [
                  OutlinedButton.icon(
                    onPressed: _copyLink,
                    icon: Icon(
                      _copied ? LucideIcons.check : LucideIcons.copy,
                      size: 16,
                    ),
                    label: Text(_copied ? 'Đã sao chép' : 'Sao chép link'),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _isSubmitting ? null : _shareToProfile,
                      icon: _isSubmitting
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(LucideIcons.send, size: 16),
                      label: const Text('Chia sẻ lên hồ sơ'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
