import 'package:travel_planner/models/user.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/services/storage_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Authentication and User Profile repository
class AuthRepository {
  final ApiService _api;
  final StorageService _storage;

  AuthRepository(this._api, this._storage);

  /// Login with email and password
  Future<User> login(String email, String password) async {
    final response = await _api.post<Map<String, dynamic>>(
      AppConstants.authLogin,
      data: {
        'email': email,
        'password': password,
      },
    );

    final loginResponse = LoginResponse.fromJson(response);
    await _storage.saveToken(loginResponse.token);
    await _storage.saveString(AppConstants.keyUserId, loginResponse.user.id);
    await _storage.saveString(
      AppConstants.keyUserEmail,
      loginResponse.user.email,
    );

    return loginResponse.user;
  }

  /// Register new user
  Future<User> register(String name, String email, String password) async {
    final response = await _api.post<Map<String, dynamic>>(
      AppConstants.authRegister,
      data: {
        'name': name,
        'email': email,
        'password': password,
      },
    );

    final loginResponse = LoginResponse.fromJson(response);
    await _storage.saveToken(loginResponse.token);
    await _storage.saveString(AppConstants.keyUserId, loginResponse.user.id);
    await _storage.saveString(
      AppConstants.keyUserEmail,
      loginResponse.user.email,
    );

    return loginResponse.user;
  }

  /// Get current user profile
  Future<User> getProfile() async {
    final response = await _api.get<Map<String, dynamic>>(
      AppConstants.authProfile,
    );
    return User.fromJson(response);
  }

  /// Get full user profile dashboard (stats, trips, wishlist, liked, rated, shared)
  Future<UserProfileData> getUserProfileDashboard(String userId) async {
    final response = await _api.get<Map<String, dynamic>>(
      '${AppConstants.users}/$userId/profile',
    );
    return UserProfileData.fromJson(response);
  }

  /// Update user profile / onboarding preferences
  Future<User> updateProfile({
    required String userId,
    String? name,
    List<String>? preferredStyles,
    String? budgetLevel,
  }) async {
    final response = await _api.patch<Map<String, dynamic>>(
      '${AppConstants.users}/$userId/profile',
      data: {
        if (name != null) 'name': name,
        if (preferredStyles != null) 'preferredStyles': preferredStyles,
        if (budgetLevel != null) 'budgetLevel': budgetLevel,
      },
    );
    return User.fromJson(response);
  }

  /// Logout
  Future<void> logout() async {
    await _storage.deleteToken();
    await _storage.remove(AppConstants.keyUserId);
    await _storage.remove(AppConstants.keyUserEmail);
  }

  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await _storage.getToken();
    return token != null && token.isNotEmpty;
  }

  Future<String?> getStoredToken() => _storage.getToken();
}
