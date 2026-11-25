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

/// Login screen
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (_formKey.currentState?.validate() ?? false) {
      await ref.read(authProvider.notifier).login(
            _emailController.text.trim(),
            _passwordController.text,
          );
    }
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
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Framed Vietnam coastal editorial banner
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  child: SizedBox(
                    height: 148,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.asset(
                          'assets/images/provinces/halong.jpg',
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
                                Colors.black.withValues(alpha: 0.1),
                                const Color(0xFF0F172A).withValues(alpha: 0.78),
                              ],
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(
                                      color: AppColors.primary,
                                      borderRadius: BorderRadius.circular(AppRadius.sm),
                                    ),
                                    child: const Icon(
                                      LucideIcons.compass,
                                      size: 16,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(width: AppSpacing.xs),
                                  Text(
                                    'AI Travel Planner',
                                    style: AppTextStyles.headlineMedium.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Đăng nhập để tiếp tục hành trình khám phá Việt Nam',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: Colors.white.withValues(alpha: 0.9),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

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
                  textInputAction: TextInputAction.done,
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
                  validator: (value) =>
                      Validators.required(value, fieldName: 'Mật khẩu'),
                  onFieldSubmitted: (_) => _handleLogin(),
                  enabled: !authState.maybeWhen(
                    loading: () => true,
                    orElse: () => false,
                  ),
                ),

                const SizedBox(height: AppSpacing.md),

                // Forgot password
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {
                      // TODO: Navigate to forgot password
                    },
                    child: Text(
                      'Quên mật khẩu?',
                      style: AppTextStyles.labelMedium.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
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

                // Login button
                CustomButton(
                  text: 'Đăng nhập',
                  onPressed: _handleLogin,
                  isLoading: authState.maybeWhen(
                    loading: () => true,
                    orElse: () => false,
                  ),
                  icon: const Icon(
                    LucideIcons.logIn,
                    size: 20,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Register link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Chưa có tài khoản? ',
                      style: AppTextStyles.bodyMedium,
                    ),
                    TextButton(
                      onPressed: () {
                        context.push('/register');
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: const Size(0, 0),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        'Đăng ký ngay',
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
}
