import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/services/providers.dart';
import 'package:travel_planner/services/weather_service.dart';

/// Compact live weather badge using Open-Meteo API
class PlaceWeatherPill extends ConsumerStatefulWidget {
  final double latitude;
  final double longitude;

  const PlaceWeatherPill({
    super.key,
    required this.latitude,
    required this.longitude,
  });

  @override
  ConsumerState<PlaceWeatherPill> createState() => _PlaceWeatherPillState();
}

class _PlaceWeatherPillState extends ConsumerState<PlaceWeatherPill> {
  WeatherInfo? _weather;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didUpdateWidget(covariant PlaceWeatherPill oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.latitude != widget.latitude ||
        oldWidget.longitude != widget.longitude) {
      _load();
    }
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final info = await ref
        .read(weatherServiceProvider)
        .getCurrentWeather(widget.latitude, widget.longitude);
    if (mounted) {
      setState(() {
        _weather = info;
        _loading = false;
      });
    }
  }

  IconData _weatherIcon(int code) {
    if (code == 0) return LucideIcons.sun;
    if (code == 1 || code == 2) return LucideIcons.cloudSun;
    if (code == 3) return LucideIcons.cloud;
    if (code == 45 || code == 48) return LucideIcons.cloudFog;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].contains(code)) {
      return LucideIcons.cloudRain;
    }
    if ([95, 96, 99].contains(code)) return LucideIcons.cloudLightning;
    return LucideIcons.cloudSun;
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(AppRadius.full),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 10,
              height: 10,
              child: CircularProgressIndicator(strokeWidth: 1.5),
            ),
            const SizedBox(width: 4),
            Text(
              'Thời tiết...',
              style: AppTextStyles.bodySmall.copyWith(
                fontSize: 10,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      );
    }

    if (_weather == null) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(AppRadius.full),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _weatherIcon(_weather!.code),
            size: 12,
            color: AppColors.textSecondary,
          ),
          const SizedBox(width: 4),
          Text(
            '${_weather!.temp}°C',
            style: AppTextStyles.bodySmall.copyWith(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(width: 3),
          Text(
            '(${_weather!.description})',
            style: AppTextStyles.bodySmall.copyWith(
              fontSize: 10,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
