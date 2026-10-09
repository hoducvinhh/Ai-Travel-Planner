import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/biometric_service.dart';

/// Biometric service provider
final biometricServiceProvider = Provider<BiometricService>((ref) {
  return BiometricService();
});

/// Biometric enabled state provider
final biometricEnabledProvider = FutureProvider<bool>((ref) async {
  final service = ref.watch(biometricServiceProvider);
  return await service.isBiometricEnabled();
});

/// Biometric availability provider
final biometricAvailableProvider = FutureProvider<bool>((ref) async {
  final service = ref.watch(biometricServiceProvider);
  final isSupported = await service.isDeviceSupported();
  final canCheck = await service.canCheckBiometrics();
  return isSupported && canCheck;
});
