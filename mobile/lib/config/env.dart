/// Environment configuration
class Env {
  /// API base URL
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3002',
  );

  /// Environment type
  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'dev',
  );

  /// Is production environment
  static const bool isProduction = environment == 'production';

  /// Is development environment
  static const bool isDevelopment = environment == 'dev';
}
