import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:travel_planner/app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await dotenv.load(fileName: '.env');
  } catch (_) {
    // Fallback to --dart-define or default values when .env is missing
  }
  await initializeDateFormatting('vi_VN', null);
  runApp(
    const ProviderScope(
      child: TravelPlannerApp(),
    ),
  );
}
