import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/trip.dart';

/// 5-Dimension Overall Feasibility Score (OFS) Card (mirrors web TripFeasibilityCard.tsx)
class TripFeasibilityCard extends StatefulWidget {
  final FeasibilityReport report;

  const TripFeasibilityCard({
    super.key,
    required this.report,
  });

  @override
  State<TripFeasibilityCard> createState() => _TripFeasibilityCardState();
}

class _TripFeasibilityCardState extends State<TripFeasibilityCard> {
  bool _expanded = false;

  Color _scoreColor(double score) {
    if (score >= 85) return AppColors.success;
    if (score >= 70) return AppColors.info;
    if (score >= 50) return AppColors.warning;
    return AppColors.error;
  }

  @override
  Widget build(BuildContext context) {
    final report = widget.report;
    final themeColor = _scoreColor(report.overallScore);

    final criteria = [
      ('Khoảng cách & Cung đường', LucideIcons.mapPin, report.metrics.geo),
      ('Khung giờ & Nhịp độ', LucideIcons.clock, report.metrics.time),
      ('Phù hợp ngân sách', LucideIcons.dollarSign, report.metrics.budget),
      ('Độ khớp gu du lịch', LucideIcons.sparkles, report.metrics.preference),
      ('Đa dạng trải nghiệm', LucideIcons.layers, report.metrics.diversity),
    ];

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: themeColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: themeColor.withValues(alpha: 0.35)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '${report.overallScore.round()}',
                      style: AppTextStyles.headlineSmall.copyWith(
                        color: themeColor,
                        fontWeight: FontWeight.bold,
                        height: 1.0,
                      ),
                    ),
                    Text(
                      '/100',
                      style: AppTextStyles.bodySmall.copyWith(
                        fontSize: 10,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Đánh Giá Tính Khả Thi',
                      style: AppTextStyles.titleMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: themeColor.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(AppRadius.full),
                      ),
                      child: Text(
                        report.rating,
                        style: AppTextStyles.labelSmall.copyWith(
                          color: themeColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Tổng cung đường: ${report.totalDistanceKm} km • ~${report.totalTransitTimeHours} giờ di chuyển',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.md),
          const Divider(height: 1),
          const SizedBox(height: AppSpacing.md),

          // 5 Technical Criteria Progress Bars
          ...criteria.map((item) {
            final label = item.$1;
            final icon = item.$2;
            final criterion = item.$3;
            final cColor = _scoreColor(criterion.score);
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(icon, size: 13, color: AppColors.textSecondary),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          label,
                          style: AppTextStyles.labelSmall.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      Text(
                        '${criterion.score.round()}/100',
                        style: AppTextStyles.labelSmall.copyWith(
                          color: cColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: (criterion.score.clamp(5, 100)) / 100,
                      minHeight: 6,
                      backgroundColor: AppColors.border,
                      valueColor: AlwaysStoppedAnimation<Color>(cColor),
                    ),
                  ),
                  if (criterion.summary.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      criterion.summary,
                      style: AppTextStyles.bodySmall.copyWith(
                        fontSize: 11,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            );
          }),

          // Warnings & Recommendations
          if (report.warnings.isNotEmpty) ...[
            const Divider(height: 1),
            const SizedBox(height: AppSpacing.sm),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(
                      LucideIcons.circleAlert,
                      size: 15,
                      color: AppColors.accent,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Lưu ý & Khuyến cáo (${report.warnings.length})',
                      style: AppTextStyles.labelMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                if (report.warnings.length > 2)
                  TextButton(
                    onPressed: () => setState(() => _expanded = !_expanded),
                    child: Text(_expanded ? 'Thu gọn' : 'Xem tất cả'),
                  ),
              ],
            ),
            const SizedBox(height: 4),
            ...(_expanded
                    ? report.warnings
                    : report.warnings.take(2).toList())
                .map((w) {
              Color bg = AppColors.warning.withValues(alpha: 0.12);
              Color fg = AppColors.textPrimary;
              IconData wIcon = LucideIcons.circleAlert;
              String prefix = '[Lưu ý]';
              if (w.type == 'CRITICAL') {
                bg = AppColors.error.withValues(alpha: 0.1);
                fg = AppColors.error;
                wIcon = LucideIcons.triangleAlert;
                prefix = '[Cảnh báo]';
              } else if (w.type == 'TIP') {
                bg = AppColors.info.withValues(alpha: 0.1);
                fg = AppColors.textPrimary;
                wIcon = LucideIcons.info;
                prefix = '[Gợi ý]';
              }
              return Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(wIcon, size: 15, color: fg),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '$prefix ${w.message}',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: fg,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ] else
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
                      'Lịch trình đạt độ cân bằng lý tưởng về cự ly di chuyển, ngân sách và khung giờ!',
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
      ),
    );
  }
}
