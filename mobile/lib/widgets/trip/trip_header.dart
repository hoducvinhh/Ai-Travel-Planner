import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/models/trip.dart';

/// Trip header widget with image
class TripHeader extends StatelessWidget {
  final Trip trip;

  const TripHeader({
    super.key,
    required this.trip,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // Background image
        if (trip.imageUrl != null)
          CachedNetworkImage(
            imageUrl: trip.imageUrl!,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(
              color: AppColors.primary.withValues(alpha: 0.1),
              child: const Center(
                child: CircularProgressIndicator(
                  color: AppColors.primary,
                ),
              ),
            ),
            errorWidget: (context, url, error) => _buildPlaceholder(),
          )
        else
          _buildPlaceholder(),

        // Gradient overlay
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.transparent,
                Colors.black.withValues(alpha: 0.7),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppColors.primary.withValues(alpha: 0.1),
      child: Center(
        child: Icon(
          LucideIcons.mountain,
          size: 80,
          color: AppColors.primary.withValues(alpha: 0.3),
        ),
      ),
    );
  }
}
