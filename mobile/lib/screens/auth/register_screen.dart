import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/utils/validators.dart';
import 'package:travel_planner/widgets/common/custom_button.dart';

/// Register screen
class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (_formKey.currentState?.validate() ?? false) {
      await ref.read(authProvider.notifier).register(
            _nameController.text.trim(),
            _emailController.text.trim(),
            _passwordController.text,
          );
    }
  }

  String? _validateConfirmPassword(String? value) {
    return Validators.confirmPassword(value, _passwordController.text);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // Navigate to home when authenticated
    ref.listen<AuthState>(authProvider, (previous, next) {
      next.whenOrNull(
        authenticated: (user) {
          context.go('/');
        },
      );
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, size: 24),
          onPressed: () => context.pop(),
        ),
        title: const Text('Đăng ký tài khoản'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  child: SizedBox(
                    height: 112,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.asset(
                          'assets/images/provinces/dalat.jpg',
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
                                Colors.black.withValues(alpha: 0.08),
                                const Color(0xFF0F172A).withValues(alpha: 0.78),
                              ],
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          child: Align(
                            alignment: Alignment.bottomLeft,
                            child: Text(
                              'Tạo tài khoản mới để bắt đầu lên kế hoạch du lịch',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Name field
                TextFormField(
                  controller: _nameController,
                  textInputAction: TextInputAction.next,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'Họ và tên',
                    hintText: 'Nguyễn Văn A',
                    prefixIcon: Icon(
                      LucideIcons.user,
                      size: 20,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  validator: (value) =>
                      Validators.required(value, fieldName: 'Họ và tên'),
                  enabled: !authState.maybeWhen(
                    loading: () => true,
                    orElse: () => false,
                  ),
                ),

                const SizedBox(height: AppSpacing.md),

                // Email field
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    hintText: 'example@email.com',
                    prefixIcon: Icon(
                      LucideIcons.mail,
                      size: 20,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  validator: Validators.email,
                  enabled: !authState.maybeWhen(
                    loading: () => true,
                    orElse: () => false,
                  ),
                ),

                const SizedBox(height: AppSpacing.md),

                // Password field
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  textInputAction: TextInputAction.next,
                  decoration: InputDecoration(
                    labelText: 'Mật khẩu',
                    hintText: '••••••••',
                    prefixIcon: const Icon(
                      LucideIcons.lock,
                      size: 20,
                      color: AppColors.textSecondary,
                    ),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? LucideIcons.eyeOff
                            : LucideIcons.eye,
                        size: 20,
                        color: AppColors.textSecondary,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),
                  validator: Validators.password,
                  enabled: !authState.maybeWhen(
                    loading: () => true,
                    orElse: () => false,
                  ),
                ),

                const SizedBox(height: AppSpacing.md),

                // Confirm password field
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: _obscureConfirmPassword,
                  textInputAction: TextInputAction.done,
                  decoration: InputDecoration(
                    labelText: 'Xác nhận mật khẩu',
                    hintText: '••••••••',
                    prefixIcon: const Icon(
                      LucideIcons.lock,
                      size: 20,
                      color: AppColors.textSecondary,
                    ),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscureConfirmPassword
                            ? LucideIcons.eyeOff
                            : LucideIcons.eye,
                        size: 20,
                        color: AppColors.textSecondary,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscureConfirmPassword = !_obscureConfirmPassword;
                        });
                      },
                    ),
                  ),
                  validator: _validateConfirmPassword,
                  onFieldSubmitted: (_) => _handleRegister(),
                  enabled: !authState.maybeWhen(
                    loading: () => true,
                    orElse: () => false,
                  ),
                ),

                const SizedBox(height: AppSpacing.md),

                // Password requirements hint
                Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: AppColors.secondary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Mật khẩu phải có:',
                        style: AppTextStyles.labelSmall.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      _buildPasswordRequirement('Ít nhất 8 ký tự'),
                      _buildPasswordRequirement('Ít nhất 1 chữ hoa'),
                      _buildPasswordRequirement('Ít nhất 1 chữ số'),
                    ],
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Error message
                authState.whenOrNull(
                  error: (message) => Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: AppColors.error.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(
                        color: AppColors.error.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          LucideIcons.circleAlert,
                          size: 20,
                          color: AppColors.error,
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Expanded(
                          child: Text(
                            message,
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.error,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ) ?? const SizedBox.shrink(),

                authState.maybeWhen(
                  error: (_) => const SizedBox(height: AppSpacing.md),
                  orElse: () => const SizedBox.shrink(),
                ),

                // Register button
                CustomButton(
                  text: 'Đăng ký',
                  onPressed: _handleRegister,
                  isLoading: authState.maybeWhen(
                    loading: () => true,
                    orElse: () => false,
                  ),
                  icon: const Icon(
                    LucideIcons.userPlus,
                    size: 20,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Login link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Đã có tài khoản? ',
                      style: AppTextStyles.bodyMedium,
                    ),
                    TextButton(
                      onPressed: () {
                        context.pop();
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: const Size(0, 0),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        'Đăng nhập',
                        style: AppTextStyles.labelLarge.copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordRequirement(String text) {
    return Row(
      children: [
        const Icon(
          LucideIcons.check,
          size: 12,
          color: AppColors.textSecondary,
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: AppTextStyles.bodySmall,
        ),
      ],
    );
  }
}
