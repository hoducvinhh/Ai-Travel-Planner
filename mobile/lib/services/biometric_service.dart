import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Biometric authentication service
class BiometricService {
  final LocalAuthentication _localAuth = LocalAuthentication();
  static const String _biometricEnabledKey = 'biometric_enabled';

  /// Check if device supports biometric authentication
  Future<bool> isDeviceSupported() async {
    try {
      return await _localAuth.isDeviceSupported();
    } catch (e) {
      return false;
    }
  }

  /// Check if biometric authentication is available
  Future<bool> canCheckBiometrics() async {
    try {
      return await _localAuth.canCheckBiometrics;
    } catch (e) {
      return false;
    }
  }

  /// Get available biometric types
  Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _localAuth.getAvailableBiometrics();
    } catch (e) {
      return [];
    }
  }

  /// Authenticate with biometrics
  Future<bool> authenticate({
    String localizedReason = 'Vui lòng xác thực để tiếp tục',
  }) async {
    try {
      final isSupported = await isDeviceSupported();
      final canCheck = await canCheckBiometrics();

      if (!isSupported || !canCheck) {
        return false;
      }

      return await _localAuth.authenticate(
        localizedReason: localizedReason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
    } catch (e) {
      return false;
    }
  }

  /// Check if biometric is enabled by user
  Future<bool> isBiometricEnabled() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_biometricEnabledKey) ?? false;
    } catch (e) {
      return false;
    }
  }

  /// Enable biometric authentication
  Future<void> enableBiometric() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_biometricEnabledKey, true);
  }

  /// Disable biometric authentication
  Future<void> disableBiometric() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_biometricEnabledKey, false);
  }

  /// Get biometric type name (for display)
  String getBiometricTypeName(BiometricType type) {
    switch (type) {
      case BiometricType.face:
        return 'Face ID';
      case BiometricType.fingerprint:
        return 'Vân tay';
      case BiometricType.iris:
        return 'Mống mắt';
      case BiometricType.strong:
        return 'Sinh trắc học mạnh';
      case BiometricType.weak:
        return 'Sinh trắc học yếu';
    }
  }
}
