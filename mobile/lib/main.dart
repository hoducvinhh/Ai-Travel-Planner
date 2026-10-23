import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/app.dart';

void main() {
  runApp(
    const ProviderScope(
      child: TravelPlannerApp(),
    ),
  );
}
