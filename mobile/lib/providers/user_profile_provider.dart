import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/user.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/places_provider.dart';
import 'package:travel_planner/repositories/auth_repository.dart';
import 'package:travel_planner/repositories/places_repository.dart';

/// User Profile Dashboard notifier managing 5 stats + 6 tabs (Wishlist, Liked, Rated, Shared, Trips, Preferences)
class UserProfileDashboardNotifier
    extends StateNotifier<AsyncValue<UserProfileData?>> {
  final AuthRepository _authRepo;
  final PlacesRepository _placesRepo;
  final String? _userId;
  final Ref _ref;

  UserProfileDashboardNotifier(
    this._authRepo,
    this._placesRepo,
    this._userId,
    this._ref,
  ) : super(const AsyncValue.loading()) {
    loadProfile();
  }

  Future<void> loadProfile() async {
    if (_userId == null) {
      state = const AsyncValue.data(null);
      return;
    }
    state = const AsyncValue.loading();
    try {
      final data = await _authRepo.getUserProfileDashboard(_userId);
      if (mounted) state = AsyncValue.data(data);
    } catch (e, st) {
      if (mounted) state = AsyncValue.error(e, st);
    }
  }

  Future<void> removeSaved(String placeId) async {
    final current = state.valueOrNull;
    if (_userId == null || current == null) return;

    state = AsyncValue.data(
      current.copyWith(
        savedPlaces: current.savedPlaces.where((p) => p.id != placeId).toList(),
        stats: current.stats.copyWith(
          savedCount:
              current.stats.savedCount > 0 ? current.stats.savedCount - 1 : 0,
        ),
      ),
    );
    try {
      await _placesRepo.toggleSave(userId: _userId, placeId: placeId);
    } catch (_) {
      await loadProfile();
    }
  }

  Future<void> removeLiked(String placeId) async {
    final current = state.valueOrNull;
    if (_userId == null || current == null) return;

    state = AsyncValue.data(
      current.copyWith(
        likedPlaces: current.likedPlaces.where((p) => p.id != placeId).toList(),
        stats: current.stats.copyWith(
          likedCount:
              current.stats.likedCount > 0 ? current.stats.likedCount - 1 : 0,
        ),
      ),
    );
    try {
      await _placesRepo.toggleLike(userId: _userId, placeId: placeId);
    } catch (_) {
      await loadProfile();
    }
  }

  Future<void> removeRating(String placeId) async {
    final current = state.valueOrNull;
    if (_userId == null || current == null) return;

    state = AsyncValue.data(
      current.copyWith(
        ratedPlaces:
            current.ratedPlaces.where((r) => r.place.id != placeId).toList(),
        stats: current.stats.copyWith(
          ratedCount:
              current.stats.ratedCount > 0 ? current.stats.ratedCount - 1 : 0,
        ),
      ),
    );
    try {
      await _placesRepo.unratePlace(userId: _userId, placeId: placeId);
    } catch (_) {
      await loadProfile();
    }
  }

  Future<void> removeShared(String placeId) async {
    final current = state.valueOrNull;
    if (_userId == null || current == null) return;

    state = AsyncValue.data(
      current.copyWith(
        sharedPlaces:
            current.sharedPlaces.where((s) => s.place.id != placeId).toList(),
        stats: current.stats.copyWith(
          sharedCount:
              current.stats.sharedCount > 0 ? current.stats.sharedCount - 1 : 0,
        ),
      ),
    );
    try {
      await _placesRepo.unsharePlace(userId: _userId, placeId: placeId);
    } catch (_) {
      await loadProfile();
    }
  }

  Future<void> savePreferences({
    required String name,
    required List<String> preferredStyles,
    required String budgetLevel,
  }) async {
    await _ref.read(authProvider.notifier).updateProfile(
          name: name,
          preferredStyles: preferredStyles,
          budgetLevel: budgetLevel,
        );
    await loadProfile();
  }
}

final userProfileDashboardProvider = StateNotifierProvider<
    UserProfileDashboardNotifier, AsyncValue<UserProfileData?>>((ref) {
  final authRepo = ref.watch(authRepositoryProvider);
  final placesRepo = ref.watch(placesRepositoryProvider);
  final userId = ref.watch(authProvider).maybeWhen(
        authenticated: (u) => u.id,
        orElse: () => null,
      );
  return UserProfileDashboardNotifier(authRepo, placesRepo, userId, ref);
});
