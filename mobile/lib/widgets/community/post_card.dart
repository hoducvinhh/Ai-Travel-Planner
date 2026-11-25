import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/community_post.dart';
import 'package:travel_planner/services/api_service.dart';

/// Post card widget for community feed (with attached trip, 1-click clone, DM author, edit/delete)
class PostCard extends StatelessWidget {
  final CommunityPost post;
  final String? currentUserId;
  final bool isCloningTrip;
  final VoidCallback? onLike;
  final VoidCallback? onComment;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onMessageAuthor;
  final VoidCallback? onJoinTripMessage;
  final VoidCallback? onViewTrip;
  final VoidCallback? onCloneTrip;
  final void Function(String imageUrl)? onImageTap;

  const PostCard({
    super.key,
    required this.post,
    this.currentUserId,
    this.isCloningTrip = false,
    this.onLike,
    this.onComment,
    this.onEdit,
    this.onDelete,
    this.onMessageAuthor,
    this.onJoinTripMessage,
    this.onViewTrip,
    this.onCloneTrip,
    this.onImageTap,
  });

  @override
  Widget build(BuildContext context) {
    final isAuthor = currentUserId != null && currentUserId == post.userId;
    final attachedTrip = post.trip;
    final isUpcomingOrLookingBuddy = attachedTrip != null &&
        (_isFutureDate(attachedTrip.startDate) ||
            post.tags.any((t) =>
                t.toLowerCase().contains('tìm bạn') ||
                t.toLowerCase().contains('đồng hành')));

    return Card(
      margin: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: const BorderSide(color: AppColors.border),
      ),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Author Header
            Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: AppColors.primary.withValues(alpha: 0.12),
                  child: Text(
                    post.userName.isNotEmpty
                        ? post.userName[0].toUpperCase()
                        : 'U',
                    style: AppTextStyles.labelLarge.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              post.userName,
                              style: AppTextStyles.labelLarge.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (isAuthor) ...[
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 1,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.background,
                                borderRadius:
                                    BorderRadius.circular(AppRadius.sm),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: const Text(
                                'Tác giả',
                                style: TextStyle(fontSize: 10),
                              ),
                            ),
                          ],
                        ],
                      ),
                      Text(
                        _formatTime(post.createdAt),
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                if (isAuthor)
                  PopupMenuButton<String>(
                    icon: const Icon(
                      LucideIcons.moreVertical,
                      size: 18,
                      color: AppColors.textSecondary,
                    ),
                    onSelected: (val) {
                      if (val == 'edit') onEdit?.call();
                      if (val == 'delete') onDelete?.call();
                    },
                    itemBuilder: (_) => const [
                      PopupMenuItem(
                        value: 'edit',
                        child: Text('Sửa bài viết'),
                      ),
                      PopupMenuItem(
                        value: 'delete',
                        child: Text(
                          'Xóa bài viết',
                          style: TextStyle(color: AppColors.error),
                        ),
                      ),
                    ],
                  ),
              ],
            ),

            if (post.tags.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.sm),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: post.tags
                    .map(
                      (t) => Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(AppRadius.full),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          '#$t',
                          style: AppTextStyles.bodySmall.copyWith(
                            fontSize: 10,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ],

            const SizedBox(height: AppSpacing.sm),

            // Title & Content
            if (post.title.isNotEmpty) ...[
              Text(
                post.title,
                style: AppTextStyles.titleMedium.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
            ],
            Text(
              post.content,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textPrimary,
                height: 1.45,
              ),
            ),

            // Images Gallery
            if (post.images.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.sm),
              _buildImagesGrid(post.images),
            ],

            // Smart Attached Trip Card
            if (attachedTrip != null) ...[
              const SizedBox(height: AppSpacing.md),
              _buildAttachedTripCard(attachedTrip, isUpcomingOrLookingBuddy),
            ],

            const SizedBox(height: AppSpacing.sm),
            const Divider(height: 1),
            const SizedBox(height: 4),

            // Actions Bar
            Row(
              children: [
                _ActionPill(
                  icon: LucideIcons.heart,
                  label: '${post.likesCount} Thích',
                  color:
                      post.isLiked ? AppColors.primary : AppColors.textSecondary,
                  onTap: onLike,
                ),
                const SizedBox(width: AppSpacing.sm),
                _ActionPill(
                  icon: LucideIcons.messageCircle,
                  label: '${post.commentsCount} Bình luận',
                  color: AppColors.textSecondary,
                  onTap: onComment,
                ),
                const Spacer(),
                if (!isAuthor && onMessageAuthor != null)
                  _ActionPill(
                    icon: LucideIcons.send,
                    label: 'Nhắn tin',
                    color: AppColors.textPrimary,
                    onTap: onMessageAuthor,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagesGrid(List<String> imageUrls) {
    if (imageUrls.length == 1) {
      final url = ApiService.formatImageUrl(imageUrls.first);
      return GestureDetector(
        onTap: () => onImageTap?.call(url),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppRadius.md),
          child: CachedNetworkImage(
            imageUrl: url,
            width: double.infinity,
            height: 220,
            fit: BoxFit.cover,
            placeholder: (_, __) => Container(
              height: 220,
              color: AppColors.background,
              child: const Center(child: CircularProgressIndicator()),
            ),
            errorWidget: (_, __, ___) => Container(
              height: 220,
              color: AppColors.background,
              child: const Icon(LucideIcons.image),
            ),
          ),
        ),
      );
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: imageUrls.length == 2 ? 2 : 3,
        crossAxisSpacing: 6,
        mainAxisSpacing: 6,
        childAspectRatio: 1,
      ),
      itemCount: imageUrls.length > 6 ? 6 : imageUrls.length,
      itemBuilder: (_, idx) {
        final url = ApiService.formatImageUrl(imageUrls[idx]);
        return GestureDetector(
          onTap: () => onImageTap?.call(url),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.sm),
            child: CachedNetworkImage(
              imageUrl: url,
              fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(
                color: AppColors.background,
                child: const Icon(LucideIcons.image, size: 20),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAttachedTripCard(
    CommunityAttachedTrip trip,
    bool isUpcomingOrBuddy,
  ) {
    final startStr = _shortDate(trip.startDate);
    final endStr = _shortDate(trip.endDate);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isUpcomingOrBuddy
                      ? AppColors.success.withValues(alpha: 0.14)
                      : AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  border: Border.all(color: AppColors.border),
                ),
                child: Text(
                  isUpcomingOrBuddy
                      ? 'Sắp khởi hành: $startStr'
                      : 'Lịch trình tham quan',
                  style: AppTextStyles.labelSmall.copyWith(
                    color: isUpcomingOrBuddy
                        ? AppColors.success
                        : AppColors.textPrimary,
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
              ),
              Text(
                '${trip.groupSize} người • ${NumberFormat('#,###', 'vi_VN').format(trip.budgetPerPerson)} đ',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(LucideIcons.mapPin, size: 16, color: AppColors.primary),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  '${trip.destination} ($startStr - $endStr)',
                  style: AppTextStyles.labelMedium.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          if (!isUpcomingOrBuddy &&
              trip.places != null &&
              trip.places!.isNotEmpty) ...[
            const SizedBox(height: 8),
            SizedBox(
              height: 28,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: trip.places!.length,
                separatorBuilder: (_, __) => const SizedBox(width: 6),
                itemBuilder: (_, idx) {
                  return Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Text(
                      trip.places![idx].place.name,
                      style: AppTextStyles.bodySmall.copyWith(fontSize: 10),
                    ),
                  );
                },
              ),
            ),
          ],
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              if (onViewTrip != null)
                OutlinedButton(
                  onPressed: onViewTrip,
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: const Text('Chi tiết', style: TextStyle(fontSize: 11)),
                ),
              const SizedBox(width: 8),
              if (isUpcomingOrBuddy && onJoinTripMessage != null)
                ElevatedButton.icon(
                  onPressed: onJoinTripMessage,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  icon: const Icon(LucideIcons.messageCircle, size: 13),
                  label: const Text(
                    'Nhắn tin tham gia',
                    style: TextStyle(fontSize: 11),
                  ),
                )
              else if (!isUpcomingOrBuddy && onCloneTrip != null)
                ElevatedButton.icon(
                  onPressed: isCloningTrip ? null : onCloneTrip,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.textPrimary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  icon: isCloningTrip
                      ? const SizedBox(
                          width: 12,
                          height: 12,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(LucideIcons.copy, size: 13),
                  label: const Text(
                    'Nhân bản (1-Click)',
                    style: TextStyle(fontSize: 11),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  bool _isFutureDate(String raw) {
    try {
      return DateTime.parse(raw).isAfter(DateTime.now());
    } catch (_) {
      return false;
    }
  }

  String _shortDate(String raw) {
    try {
      return DateFormat('dd/MM/yyyy').format(DateTime.parse(raw));
    } catch (_) {
      return raw;
    }
  }

  String _formatTime(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inSeconds < 60) return 'Vừa xong';
    if (diff.inMinutes < 60) return '${diff.inMinutes} phút trước';
    if (diff.inHours < 24) return '${diff.inHours} giờ trước';
    if (diff.inDays < 7) return '${diff.inDays} ngày trước';
    return DateFormat('dd/MM/yyyy').format(time);
  }
}

class _ActionPill extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  const _ActionPill({
    required this.icon,
    required this.label,
    required this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: AppTextStyles.bodySmall.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
