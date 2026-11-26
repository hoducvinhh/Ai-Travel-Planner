import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Environment configuration
class Env {
  static const String _dartDefineApiUrl = String.fromEnvironment('API_URL');
  static const String _dartDefineEnvironment = String.fromEnvironment('ENV');

  static String? _readDotenv(String key) {
    if (!dotenv.isInitialized) return null;
    final value = dotenv.env[key]?.trim();
    return (value != null && value.isNotEmpty) ? value : null;
  }

  /// API base URL (priority: --dart-define > .env > default)
  static String get apiUrl {
    if (_dartDefineApiUrl.isNotEmpty) return _dartDefineApiUrl;
    return _readDotenv('API_URL') ?? 'http://localhost:3002';
  }

  /// Environment type (priority: --dart-define > .env > default)
  static String get environment {
    if (_dartDefineEnvironment.isNotEmpty) return _dartDefineEnvironment;
    return _readDotenv('ENV') ?? 'dev';
  }

  /// Is production environment
  static bool get isProduction => environment == 'production';

  /// Is development environment
  static bool get isDevelopment => environment == 'dev';
}
