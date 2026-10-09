import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../config/colors.dart';
import '../../config/text_styles.dart';
import '../../config/spacing.dart';
import '../../config/radius.dart';
import '../../providers/auth_provider.dart';
import '../../providers/biometric_provider.dart';
import '../../widgets/common/loading_indicator.dart';

/// Profile screen
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ sơ'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
      ),
      body: authState.when(
        initial: () => const LoadingIndicator(),
        loading: () => const LoadingIndicator(),
        authenticated: (user) => SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: AppSpacing.xl),

              // Avatar
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary.withOpacity(0.1),
                  border: Border.all(
                    color: AppColors.primary,
                    width: 2,
                  ),
                ),
                child: Icon(
                  LucideIcons.user,
                  size: 48,
                  color: AppColors.primary,
                ),
              ),

              const SizedBox(height: AppSpacing.md),

              // User name
              Text(
                user.name,
                style: AppTextStyles.headlineLarge.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: AppSpacing.xs),

              // User email
              Text(
                user.email,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),

              const SizedBox(height: AppSpacing.xl),

              // Profile options
              Container(
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    _buildProfileOption(
                      icon: LucideIcons.edit,
                      title: 'Chỉnh sửa hồ sơ',
                      onTap: () {
                        // TODO: Navigate to edit profile screen
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Chức năng đang phát triển'),
                          ),
                        );
                      },
                    ),
                    _buildDivider(),
                    _buildProfileOption(
                      icon: LucideIcons.fingerprint,
                      title: 'Xác thực sinh trắc học',
                      trailing: Consumer(
                        builder: (context, ref, child) {
                          final biometricEnabled = ref.watch(biometricEnabledProvider);
                          final biometricAvailable = ref.watch(biometricAvailableProvider);

                          return biometricAvailable.when(
                            data: (isAvailable) {
                              if (!isAvailable) {
                                return Text(
                                  'Không khả dụng',
                                  style: AppTextStyles.bodySmall.copyWith(
                                    color: AppColors.textSecondary,
                                  ),
                                );
                              }

                              return biometricEnabled.when(
                                data: (isEnabled) => Switch(
                                  value: isEnabled,
                                  onChanged: (value) async {
                                    final service = ref.read(biometricServiceProvider);
                                    if (value) {
                                      // Try to authenticate before enabling
                                      final authenticated = await service.authenticate(
                                        localizedReason: 'Xác thực để bật sinh trắc học',
                                      );
                                      if (authenticated) {
                                        await service.enableBiometric();
                                        ref.invalidate(biometricEnabledProvider);
                                      } else if (context.mounted) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(
                                            content: Text('Xác thực thất bại'),
                                          ),
                                        );
                                      }
                                    } else {
                                      await service.disableBiometric();
                                      ref.invalidate(biometricEnabledProvider);
                                    }
                                  },
                                  activeColor: AppColors.primary,
                                ),
                                loading: () => const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                ),
                                error: (_, __) => const Icon(
                                  LucideIcons.alertCircle,
                                  size: 20,
                                  color: Colors.red,
                                ),
                              );
                            },
                            loading: () => const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                            error: (_, __) => const Icon(
                              LucideIcons.alertCircle,
                              size: 20,
                              color: Colors.red,
                            ),
                          );
                        },
                      ),
                      showArrow: false,
                    ),
                    _buildDivider(),
                    _buildProfileOption(
                      icon: LucideIcons.bell,
                      title: 'Thông báo',
                      onTap: () {
                        // TODO: Navigate to notifications settings
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Chức năng đang phát triển'),
                          ),
                        );
                      },
                    ),
                    _buildDivider(),
                    _buildProfileOption(
                      icon: LucideIcons.shield,
                      title: 'Bảo mật',
                      onTap: () {
                        // TODO: Navigate to security settings
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Chức năng đang phát triển'),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              // About section
              Container(
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    _buildProfileOption(
                      icon: LucideIcons.helpCircle,
                      title: 'Trợ giúp & Hỗ trợ',
                      onTap: () {
                        // TODO: Navigate to help screen
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Chức năng đang phát triển'),
                          ),
                        );
                      },
                    ),
                    _buildDivider(),
                    _buildProfileOption(
                      icon: LucideIcons.info,
                      title: 'Về ứng dụng',
                      subtitle: 'Phiên bản 1.0.0',
                      onTap: () {
                        // TODO: Show about dialog
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('AI Travel Planner'),
                            content: const Text(
                              'Phiên bản 1.0.0\n\n'
                              'Ứng dụng lập kế hoạch du lịch thông minh '
                              'với sự hỗ trợ của AI.',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Đóng'),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.xl),

              // Logout button
              Container(
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => _showLogoutDialog(context, ref),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.error,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      vertical: AppSpacing.md,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    elevation: 0,
                  ),
                  icon: const Icon(LucideIcons.logOut, size: 20),
                  label: Text(
                    'Đăng xuất',
                    style: AppTextStyles.labelLarge.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        ),
        unauthenticated: () => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                LucideIcons.userX,
                size: 64,
                color: AppColors.textSecondary,
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                'Chưa đăng nhập',
                style: AppTextStyles.headlineMedium,
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Vui lòng đăng nhập để xem hồ sơ',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                child: const Text('Đăng nhập'),
              ),
            ],
          ),
        ),
        error: (message) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                LucideIcons.alertCircle,
                size: 64,
                color: AppColors.error,
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                'Đã có lỗi xảy ra',
                style: AppTextStyles.headlineMedium,
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                message,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileOption({
    required IconData icon,
    required String title,
    String? subtitle,
    VoidCallback? onTap,
    Widget? trailing,
    bool showArrow = true,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.md,
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppRadius.sm),
              ),
              child: Icon(
                icon,
                size: 20,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.bodyLarge.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            if (trailing != null)
              trailing
            else if (showArrow)
              Icon(
                LucideIcons.chevronRight,
                size: 20,
                color: AppColors.textSecondary,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(
      height: 1,
      thickness: 1,
      color: AppColors.border,
      indent: AppSpacing.md + 40 + AppSpacing.md,
    );
  }

  void _showLogoutDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc chắn muốn đăng xuất?'),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Hủy',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await ref.read(authProvider.notifier).logout();
              if (context.mounted) {
                context.go('/login');
              }
            },
            child: Text(
              'Đăng xuất',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }
}
