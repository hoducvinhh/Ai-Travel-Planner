import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/providers/create_trip_provider.dart';

/// Step 1: Destination input
class Step1Destination extends ConsumerStatefulWidget {
  const Step1Destination({super.key});

  @override
  ConsumerState<Step1Destination> createState() => _Step1DestinationState();
}

class _Step1DestinationState extends ConsumerState<Step1Destination> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(
      text: ref.read(createTripProvider).destination,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title
        Text(
          'Bạn muốn đi đâu?',
          style: AppTextStyles.displayMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: AppSpacing.sm),

        Text(
          'Nhập tên thành phố hoặc quốc gia bạn muốn khám phá',
          style: AppTextStyles.bodyLarge.copyWith(
            color: AppColors.textSecondary,
          ),
        ),

        const SizedBox(height: AppSpacing.xl),

        // Destination input
        TextField(
          controller: _controller,
          decoration: InputDecoration(
            labelText: 'Điểm đến',
            hintText: 'VD: Đà Nẵng, Phú Quốc, Hạ Long...',
            prefixIcon: const Icon(LucideIcons.mapPin),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: const BorderSide(color: AppColors.primary, width: 2),
            ),
          ),
          textCapitalization: TextCapitalization.words,
          onChanged: (value) {
            ref.read(createTripProvider.notifier).setDestination(value);
          },
        ),

        const SizedBox(height: AppSpacing.lg),

        // Popular destinations
        Text(
          'Điểm đến phổ biến',
          style: AppTextStyles.labelLarge.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: AppSpacing.md),

        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: [
            _buildDestinationChip('Đà Nẵng', LucideIcons.waves),
            _buildDestinationChip('Hà Nội', LucideIcons.landmark),
            _buildDestinationChip('Hồ Chí Minh', LucideIcons.building2),
            _buildDestinationChip('Phú Quốc', LucideIcons.palmtree),
            _buildDestinationChip('Hạ Long', LucideIcons.sailboat),
            _buildDestinationChip('Đà Lạt', LucideIcons.mountain),
            _buildDestinationChip('Nha Trang', LucideIcons.umbrella),
            _buildDestinationChip('Sapa', LucideIcons.treeDeciduous),
          ],
        ),
      ],
    );
  }

  Widget _buildDestinationChip(String destination, IconData icon) {
    return ActionChip(
      avatar: Icon(
        icon,
        size: 18,
        color: AppColors.primary,
      ),
      label: Text(destination),
      labelStyle: AppTextStyles.bodyMedium.copyWith(
        color: AppColors.textPrimary,
      ),
      backgroundColor: Colors.white,
      side: const BorderSide(color: AppColors.border),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      onPressed: () {
        _controller.text = destination;
        ref.read(createTripProvider.notifier).setDestination(destination);
      },
    );
  }
}
