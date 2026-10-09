import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../repositories/trips_repository.dart';
import '../services/providers.dart';

/// Trips repository provider
final tripsRepositoryProvider = Provider<TripsRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return TripsRepository(api);
});

/// Trips list provider
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTrips();
});

/// Single trip provider (by ID)
final tripProvider = FutureProvider.family<Trip, String>((ref, id) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return repository.getTripById(id);
});

/// Trips state notifier for mutations
class TripsNotifier extends StateNotifier<AsyncValue<List<Trip>>> {
  final TripsRepository _repository;

  TripsNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadTrips();
  }

  /// Load trips
  Future<void> loadTrips() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _repository.getTrips());
  }

  /// Refresh trips
  Future<void> refresh() async {
    await loadTrips();
  }

  /// Delete trip
  Future<void> deleteTrip(String id) async {
    try {
      await _repository.deleteTrip(id);
      await loadTrips(); // Reload after delete
    } catch (e) {
      // Keep current state, show error in UI
      rethrow;
    }
  }
}

/// Trips notifier provider
final tripsNotifierProvider =
    StateNotifierProvider<TripsNotifier, AsyncValue<List<Trip>>>((ref) {
  final repository = ref.watch(tripsRepositoryProvider);
  return TripsNotifier(repository);
});
