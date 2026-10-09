import 'package:flutter/material.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';

/// Home screen - temporary placeholder
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Travel Planner'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.travel_explore,
              size: 64,
              color: AppColors.primary,
            ),
            SizedBox(height: 16),
            Text(
              'Welcome to AI Travel Planner',
              style: AppTextStyles.displayMedium,
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 8),
            Text(
              'Setup in progress...',
              style: AppTextStyles.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
