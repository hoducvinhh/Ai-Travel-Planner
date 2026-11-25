import 'dart:convert';
import 'package:http/http.dart' as http;

class WeatherInfo {
  final int temp;
  final int apparentTemp;
  final int humidity;
  final int windSpeed;
  final String description;
  final int code;
  final bool isRain;
  final String advice;

  const WeatherInfo({
    required this.temp,
    required this.apparentTemp,
    required this.humidity,
    required this.windSpeed,
    required this.description,
    required this.code,
    required this.isRain,
    required this.advice,
  });
}

/// Service fetching current weather from Open-Meteo (matching web PlaceDirectionsModal & PlaceWeatherPill)
class WeatherService {
  static final Map<String, WeatherInfo> _cache = {};

  static WeatherInfo _interpretWeather({
    required int code,
    required double tempRaw,
    required double apparentRaw,
    required int humidity,
    required double windRaw,
  }) {
    final temp = tempRaw.round();
    String description = 'Trời đẹp';
    bool isRain = false;
    String advice = 'Thời tiết rất lý tưởng để tham quan và chụp ảnh ngoài trời!';

    if (code == 0) {
      description = 'Trời nắng trong xanh';
    } else if (code == 1 || code == 2) {
      description = 'Ít mây, nắng nhẹ';
    } else if (code == 3) {
      description = 'Nhiều mây';
    } else if (code == 45 || code == 48) {
      description = 'Sương mù';
      advice = 'Tầm nhìn có thể bị hạn chế, hãy chú ý an toàn khi di chuyển!';
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].contains(code)) {
      description = 'Có mưa rào';
      isRain = true;
      advice = 'Đang có mưa, hãy mang theo ô/áo mưa hoặc ưu tiên điểm đến trong nhà!';
    } else if ([95, 96, 99].contains(code)) {
      description = 'Giông bão sét';
      isRain = true;
      advice = 'Thời tiết có giông bão, nên hạn chế hoạt động ngoài trời lúc này!';
    }

    if (!isRain && tempRaw >= 34) {
      advice = 'Trời nắng gắt, hãy mang theo nón mũ, kem chống nắng và uống đủ nước!';
    } else if (!isRain && tempRaw <= 16) {
      advice = 'Trời se lạnh, bạn nên mặc thêm áo ấm khi ra ngoài!';
    }

    return WeatherInfo(
      temp: temp,
      apparentTemp: apparentRaw.round(),
      humidity: humidity,
      windSpeed: windRaw.round(),
      description: description,
      code: code,
      isRain: isRain,
      advice: advice,
    );
  }

  Future<WeatherInfo?> getCurrentWeather(double latitude, double longitude) async {
    if (!latitude.isFinite || !longitude.isFinite) return null;

    final cacheKey = '${latitude.toStringAsFixed(2)}_${longitude.toStringAsFixed(2)}';
    if (_cache.containsKey(cacheKey)) {
      return _cache[cacheKey];
    }

    try {
      final uri = Uri.parse(
        'https://api.open-meteo.com/v1/forecast?latitude=$latitude&longitude=$longitude'
        '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m'
        '&timezone=Asia%2FBangkok',
      );
      final response = await http.get(uri).timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        final data = json.decode(response.body) as Map<String, dynamic>;
        final current = data['current'] as Map<String, dynamic>?;
        if (current != null) {
          final info = _interpretWeather(
            code: (current['weather_code'] as num?)?.toInt() ?? 0,
            tempRaw: (current['temperature_2m'] as num?)?.toDouble() ?? 26.0,
            apparentRaw: (current['apparent_temperature'] as num?)?.toDouble() ?? 26.0,
            humidity: (current['relative_humidity_2m'] as num?)?.toInt() ?? 70,
            windRaw: (current['wind_speed_10m'] as num?)?.toDouble() ?? 10.0,
          );
          _cache[cacheKey] = info;
          return info;
        }
      }
    } catch (_) {
      // Return null silently if Open-Meteo is unreachable
    }
    return null;
  }
}
