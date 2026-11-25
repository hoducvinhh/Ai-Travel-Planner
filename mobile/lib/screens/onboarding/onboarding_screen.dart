import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';
import 'package:travel_planner/widgets/common/custom_button.dart';

class _StyleOption {
  final String id;
  final String name;
  final String desc;
  final IconData icon;
  const _StyleOption(this.id, this.name, this.desc, this.icon);
}

class _CompanionOption {
  final String id;
  final String name;
  final String desc;
  final IconData icon;
  const _CompanionOption(this.id, this.name, this.desc, this.icon);
}

class _BudgetOption {
  final String id;
  final String name;
  final String range;
  final String desc;
  final IconData icon;
  const _BudgetOption(this.id, this.name, this.range, this.desc, this.icon);
}

const List<_StyleOption> _styleOptions = [
  _StyleOption('culture', 'Văn hóa & Lịch sử', 'Bảo tàng, di tích, đền chùa, phố cổ', LucideIcons.landmark),
  _StyleOption('nature', 'Thiên nhiên & Sinh thái', 'Rừng núi, thác nước, cắm trại', LucideIcons.trees),
  _StyleOption('food', 'Ẩm thực & Đặc sản', 'Chợ đêm, street food, đặc sản địa phương', LucideIcons.utensils),
  _StyleOption('relax', 'Nghỉ dưỡng & Biển đảo', 'Resort, bãi biển, spa thư giãn', LucideIcons.waves),
  _StyleOption('photography', 'Check-in & Sống ảo', 'Cung đường đẹp, cafe săn mây', LucideIcons.camera),
  _StyleOption('adventure', 'Khám phá & Mạo hiểm', 'Trekking leo núi, chèo SUP, hang động', LucideIcons.mountain),
  _StyleOption('nightlife', 'Vui chơi & Giải trí', 'Công viên chủ đề, phố đi bộ, giải trí', LucideIcons.sparkles),
];

const List<_CompanionOption> _companionOptions = [
  _CompanionOption('solo', 'Đi một mình', 'Tự do, linh hoạt', LucideIcons.user),
  _CompanionOption('couple', 'Cặp đôi', 'Lãng mạn, riêng tư', LucideIcons.heart),
  _CompanionOption('family', 'Gia đình', 'An toàn, thoáng mát', LucideIcons.users),
  _CompanionOption('friends', 'Nhóm bạn bè', 'Sôi động, tập thể', LucideIcons.users),
];

const List<_BudgetOption> _budgetOptions = [
  _BudgetOption('budget', 'Tiết kiệm', '< 500k / ngày', 'Ưu tiên điểm miễn phí hoặc giá rẻ, homestay bình dân', LucideIcons.wallet),
  _BudgetOption('standard', 'Tiêu chuẩn', '500k - 1.5tr / ngày', 'Chi tiêu cân bằng, ẩm thực & dịch vụ vừa đủ', LucideIcons.creditCard),
  _BudgetOption('luxury', 'Cao cấp', '> 1.5tr / ngày', 'Nghỉ dưỡng sang trọng, vé VIP, resort 4-5 sao', LucideIcons.gem),
];

/// Onboarding Survey Screen (mirrors web OnboardingModal.tsx)
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final Set<String> _selectedStyles = {};
  String _selectedCompanion = 'friends';
  String _selectedBudget = 'standard';
  bool _isSubmitting = false;

  bool get _isValid => _selectedStyles.length >= 3 && !_isSubmitting;

  Future<void> _handleSubmit() async {
    if (!_isValid) return;
    setState(() => _isSubmitting = true);
    try {
      final finalStyles = [
        ..._selectedStyles,
        'companion:$_selectedCompanion',
      ];
      await ref.read(authProvider.notifier).updateProfile(
            preferredStyles: finalStyles,
            budgetLevel: _selectedBudget,
          );
      ref.read(createTripProvider.notifier).reset();
      if (mounted) {
        context.go('/');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Không thể lưu khảo sát: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final progress = ((_selectedStyles.length.clamp(0, 3) / 3) * 0.6) + 0.4;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Smooth completion progress strip
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0.4, end: progress),
              duration: const Duration(milliseconds: 220),
              curve: const Cubic(0.16, 1.0, 0.3, 1.0),
              builder: (_, val, __) => LinearProgressIndicator(
                value: val,
                minHeight: 4,
                backgroundColor: AppColors.border,
                color: _isValid ? AppColors.success : AppColors.primary,
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(AppSpacing.lg),
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    child: SizedBox(
                      height: 120,
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.asset(
                            'assets/images/provinces/sapa.jpg',
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              color: AppColors.primary.withValues(alpha: 0.12),
                            ),
                          ),
                          DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  const Color(0xFF0F172A).withValues(alpha: 0.72),
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            left: AppSpacing.md,
                            right: AppSpacing.md,
                            bottom: AppSpacing.sm,
                            child: Text(
                              'Chào mừng đến với AI Travel Planner',
                              style: AppTextStyles.headlineMedium.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Hãy dành 1 phút chia sẻ gu du lịch để AI gợi ý lịch trình chuẩn xác nhất cho bạn.',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),

                  const SizedBox(height: AppSpacing.xl),

                  // Step 1: Styles
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildSectionTitle('1', 'Gu du lịch yêu thích'),
                      Text(
                        'Đã chọn ${_selectedStyles.length}/3 tối thiểu',
                        style: AppTextStyles.labelSmall.copyWith(
                          color: _selectedStyles.length >= 3
                              ? AppColors.success
                              : AppColors.accent,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  ..._styleOptions.map((style) {
                    final selected = _selectedStyles.contains(style.id);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                      child: InkWell(
                        onTap: () {
                          setState(() {
                            if (selected) {
                              _selectedStyles.remove(style.id);
                            } else {
                              _selectedStyles.add(style.id);
                            }
                          });
                        },
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          curve: Curves.easeOutCubic,
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.primary.withValues(alpha: 0.08)
                                : AppColors.surface,
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            border: Border.all(
                              color: selected ? AppColors.primary : AppColors.border,
                              width: selected ? 1.5 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 38,
                                height: 38,
                                decoration: BoxDecoration(
                                  color: selected
                                      ? AppColors.primary
                                      : AppColors.background,
                                  borderRadius: BorderRadius.circular(AppRadius.sm),
                                ),
                                child: Icon(
                                  style.icon,
                                  size: 18,
                                  color: selected
                                      ? Colors.white
                                      : AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      style.name,
                                      style: AppTextStyles.labelLarge.copyWith(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      style.desc,
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (selected)
                                const Icon(
                                  LucideIcons.check,
                                  size: 18,
                                  color: AppColors.primary,
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),

                  const SizedBox(height: AppSpacing.lg),

                  // Step 2: Companion
                  _buildSectionTitle('2', 'Đối tượng thường đồng hành'),
                  const SizedBox(height: AppSpacing.sm),
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    crossAxisSpacing: AppSpacing.sm,
                    mainAxisSpacing: AppSpacing.sm,
                    childAspectRatio: 2.1,
                    children: _companionOptions.map((comp) {
                      final selected = _selectedCompanion == comp.id;
                      return InkWell(
                        onTap: () => setState(() => _selectedCompanion = comp.id),
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.sm,
                            vertical: AppSpacing.xs,
                          ),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.primary.withValues(alpha: 0.08)
                                : AppColors.surface,
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            border: Border.all(
                              color: selected ? AppColors.primary : AppColors.border,
                              width: selected ? 1.5 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                comp.icon,
                                size: 20,
                                color: selected
                                    ? AppColors.primary
                                    : AppColors.textPrimary,
                              ),
                              const SizedBox(width: AppSpacing.sm),
                              Expanded(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      comp.name,
                                      style: AppTextStyles.labelMedium.copyWith(
                                        fontWeight: FontWeight.bold,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      comp.desc,
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: AppColors.textSecondary,
                                        fontSize: 11,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: AppSpacing.lg),

                  // Step 3: Budget
                  _buildSectionTitle('3', 'Mức ngân sách thông thường'),
                  const SizedBox(height: AppSpacing.sm),
                  ..._budgetOptions.map((b) {
                    final selected = _selectedBudget == b.id;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                      child: InkWell(
                        onTap: () => setState(() => _selectedBudget = b.id),
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          curve: Curves.easeOutCubic,
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.primary.withValues(alpha: 0.08)
                                : AppColors.surface,
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            border: Border.all(
                              color: selected ? AppColors.primary : AppColors.border,
                              width: selected ? 1.5 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                b.icon,
                                size: 20,
                                color: selected
                                    ? AppColors.primary
                                    : AppColors.textPrimary,
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          b.name,
                                          style: AppTextStyles.labelLarge.copyWith(
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Text(
                                          b.range,
                                          style: AppTextStyles.labelSmall.copyWith(
                                            color: AppColors.success,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      b.desc,
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),

            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: CustomButton(
                text: 'Hoàn tất & Khám phá',
                onPressed: _isValid ? _handleSubmit : null,
                isLoading: _isSubmitting,
                icon: const Icon(
                  LucideIcons.arrowRight,
                  size: 18,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String num, String title) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: AppColors.textPrimary,
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: Text(
            num,
            style: AppTextStyles.labelSmall.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        Text(
          title,
          style: AppTextStyles.titleMedium.copyWith(
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
