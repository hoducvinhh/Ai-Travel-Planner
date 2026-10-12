import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:travel_planner/models/user.dart';
import 'package:travel_planner/repositories/auth_repository.dart';
import 'package:travel_planner/services/storage_service.dart';
import 'package:travel_planner/services/providers.dart';

part 'auth_provider.freezed.dart';

/// Auth state
@Freezed(when: FreezedWhenOptions.all)
abstract class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.authenticated(User user) = _Authenticated;
  const factory AuthState.unauthenticated() = _Unauthenticated;
  const factory AuthState.error(String message) = _Error;
}

/// Auth state notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(const AuthState.initial()) {
    _checkAuthStatus();
  }

  /// Check if user is logged in on app start
  Future<void> _checkAuthStatus() async {
    try {
      final isLoggedIn = await _repository.isLoggedIn();
      if (isLoggedIn) {
        final user = await _repository.getProfile();
        state = AuthState.authenticated(user);
      } else {
        state = const AuthState.unauthenticated();
      }
    } catch (e) {
      state = const AuthState.unauthenticated();
    }
  }

  String _parseError(dynamic e) {
    if (e is DioException) {
      final res = e.response?.data;
      if (res is Map && res['message'] != null) {
        final msg = res['message'];
        if (msg is List) return msg.join(', ');
        return msg.toString();
      }
      if (e.type == DioExceptionType.connectionError ||
          e.type == DioExceptionType.connectionTimeout) {
        return 'Không thể kết nối tới server. Vui lòng kiểm tra lại kết nối!';
      }
    }
    return e.toString();
  }

  /// Login
  Future<void> login(String email, String password) async {
    state = const AuthState.loading();
    try {
      final user = await _repository.login(email, password);
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(_parseError(e));
    }
  }

  /// Register
  Future<void> register(String name, String email, String password) async {
    state = const AuthState.loading();
    try {
      final user = await _repository.register(name, email, password);
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(_parseError(e));
    }
  }


  /// Logout
  Future<void> logout() async {
    await _repository.logout();
    state = const AuthState.unauthenticated();
  }

  /// Clear error
  void clearError() {
    state = const AuthState.unauthenticated();
  }
}

/// Storage service provider
final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService();
});

/// Auth repository provider
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  final storage = ref.watch(storageServiceProvider);
  return AuthRepository(api, storage);
});

/// Auth provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});
