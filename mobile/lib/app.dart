import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/config/routes.dart';
import 'package:travel_planner/config/theme.dart';

class TravelPlannerApp extends ConsumerWidget {
  const TravelPlannerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'AI Travel Planner',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: router,
    );
  }
}
