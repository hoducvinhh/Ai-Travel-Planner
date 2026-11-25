import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/spacing.dart';

/// Animated like button
class AnimatedLikeButton extends StatefulWidget {
  final bool isLiked;
  final VoidCallback onTap;
  final int? count;

  const AnimatedLikeButton({
    super.key,
    required this.isLiked,
    required this.onTap,
    this.count,
  });

  @override
  State<AnimatedLikeButton> createState() => _AnimatedLikeButtonState();
}

class _AnimatedLikeButtonState extends State<AnimatedLikeButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.3).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTap() {
    _controller.forward().then((_) => _controller.reverse());
    widget.onTap();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          ScaleTransition(
            scale: _scaleAnimation,
            child: Icon(
              widget.isLiked ? LucideIcons.heart : LucideIcons.heart,
              size: 20,
              color: widget.isLiked ? AppColors.likeRed : AppColors.textSecondary,
            ),
          ),
          if (widget.count != null && widget.count! > 0) ...[
            const SizedBox(width: AppSpacing.xs),
            Text(
              '${widget.count}',
              style: TextStyle(
                color: widget.isLiked ? AppColors.likeRed : AppColors.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Animated bookmark button
class AnimatedBookmarkButton extends StatefulWidget {
  final bool isBookmarked;
  final VoidCallback onTap;

  const AnimatedBookmarkButton({
    super.key,
    required this.isBookmarked,
    required this.onTap,
  });

  @override
  State<AnimatedBookmarkButton> createState() => _AnimatedBookmarkButtonState();
}

class _AnimatedBookmarkButtonState extends State<AnimatedBookmarkButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _rotationAnimation = Tween<double>(begin: 0.0, end: 0.1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTap() {
    _controller.forward().then((_) => _controller.reverse());
    widget.onTap();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: RotationTransition(
        turns: _rotationAnimation,
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: Icon(
            widget.isBookmarked ? LucideIcons.bookmark : LucideIcons.bookmark,
            size: 24,
            color: widget.isBookmarked
                ? AppColors.bookmarkGold
                : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}

/// Page transition animations
class SlideUpPageRoute<T> extends PageRouteBuilder<T> {
  final Widget page;

  SlideUpPageRoute({required this.page})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => page,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            const begin = Offset(0.0, 1.0);
            const end = Offset.zero;
            const curve = Curves.easeInOut;

            final tween = Tween(begin: begin, end: end).chain(
              CurveTween(curve: curve),
            );

            final offsetAnimation = animation.drive(tween);

            return SlideTransition(
              position: offsetAnimation,
              child: child,
            );
          },
        );
}

/// Fade page transition
class FadePageRoute<T> extends PageRouteBuilder<T> {
  final Widget page;

  FadePageRoute({required this.page})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => page,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(
              opacity: animation,
              child: child,
            );
          },
        );
}

/// Animated counter widget
class AnimatedCounter extends StatelessWidget {
  final int value;
  final Duration duration;
  final TextStyle? style;

  const AnimatedCounter({
    super.key,
    required this.value,
    this.duration = const Duration(milliseconds: 300),
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<int>(
      tween: IntTween(begin: 0, end: value),
      duration: duration,
      builder: (context, value, child) {
        return Text('$value', style: style);
      },
    );
  }
}

/// Shimmer effect for loading states
class ShimmerEffect extends StatefulWidget {
  final Widget child;
  final Duration duration;

  const ShimmerEffect({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 1500),
  });

  @override
  State<ShimmerEffect> createState() => _ShimmerEffectState();
}

class _ShimmerEffectState extends State<ShimmerEffect>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) {
      return widget.child;
    }
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              stops: [
                (_controller.value - 0.3).clamp(0.0, 1.0),
                _controller.value.clamp(0.0, 1.0),
                (_controller.value + 0.3).clamp(0.0, 1.0),
              ],
              colors: const [
                Color(0xFFE2E8F0),
                Color(0xFFF1F5F9),
                Color(0xFFE2E8F0),
              ],
            ).createShader(bounds);
          },
          child: widget.child,
        );
      },
    );
  }
}

/// Subtle deceleration reveal anchored from an already-grounded offset, honoring Reduce Motion
class EditorialArrival extends StatefulWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;
  final double offsetY;

  const EditorialArrival({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 260),
    this.offsetY = 10,
  });

  @override
  State<EditorialArrival> createState() => _EditorialArrivalState();
}

class _EditorialArrivalState extends State<EditorialArrival>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _opacity;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    const curve = Cubic(0.16, 1.0, 0.3, 1.0);
    _opacity = CurvedAnimation(parent: _controller, curve: curve);
    _slide = Tween<Offset>(
      begin: Offset(0, widget.offsetY),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: curve));

    if (widget.delay == Duration.zero) {
      _controller.forward();
    } else {
      Future.delayed(widget.delay, () {
        if (mounted) _controller.forward();
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) {
      return widget.child;
    }
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacity.value,
          child: Transform.translate(
            offset: _slide.value,
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}

/// Crisp tactile press micro-interaction (0.97 scale down on touch)
class TactilePressScale extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double pressedScale;

  const TactilePressScale({
    super.key,
    required this.child,
    this.onTap,
    this.pressedScale = 0.97,
  });

  @override
  State<TactilePressScale> createState() => _TactilePressScaleState();
}

class _TactilePressScaleState extends State<TactilePressScale> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final disableMotion = MediaQuery.disableAnimationsOf(context);
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: widget.onTap == null ? null : (_) => setState(() => _isPressed = true),
      onTapUp: widget.onTap == null
          ? null
          : (_) {
              setState(() => _isPressed = false);
              widget.onTap?.call();
            },
      onTapCancel: widget.onTap == null ? null : () => setState(() => _isPressed = false),
      child: AnimatedScale(
        scale: (!disableMotion && _isPressed) ? widget.pressedScale : 1.0,
        duration: const Duration(milliseconds: 110),
        curve: Curves.easeOutCubic,
        child: widget.child,
      ),
    );
  }
}

/// Smooth arrival scale (replaces elastic bounce cliché with natural deceleration)
class BounceInAnimation extends StatefulWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;

  const BounceInAnimation({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 280),
  });

  @override
  State<BounceInAnimation> createState() => _BounceInAnimationState();
}

class _BounceInAnimationState extends State<BounceInAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 0.92, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Cubic(0.16, 1.0, 0.3, 1.0),
      ),
    );

    if (widget.delay == Duration.zero) {
      _controller.forward();
    } else {
      Future.delayed(widget.delay, () {
        if (mounted) {
          _controller.forward();
        }
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) {
      return widget.child;
    }
    return ScaleTransition(
      scale: _scaleAnimation,
      child: widget.child,
    );
  }
}
