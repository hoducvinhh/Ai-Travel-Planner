import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/trip.dart';
import 'package:travel_planner/repositories/trips_repository.dart';
import 'package:travel_planner/services/providers.dart';

/// Trips repository provider
final tripsRepositoryProvider = Provider<TripsRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return TripsRepository(api);
});

/// Trips list provider
final tripsProvider = FutureProvider<List<Trip>>((ref) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return await repository.getTrips();
});

/// Single trip detail notifier supporting route optimization
class TripDetailNotifier extends StateNotifier<AsyncValue<Trip>> {
  final TripsRepository _repository;
  final String _tripId;

  TripDetailNotifier(this._repository, this._tripId)
      : super(const AsyncValue.loading()) {
    loadTrip();
  }

  Future<void> loadTrip() async {
    state = const AsyncValue.loading();
    try {
      final trip = await _repository.getTripById(_tripId);
      if (!mounted) return;
      state = AsyncValue.data(_enrichImageUrls(trip));
    } catch (e, st) {
      if (!mounted) return;
      state = AsyncValue.error(e, st);
    }
  }

  Future<Trip?> optimizeRoute() async {
    try {
      final updated = await _repository.optimizeTrip(_tripId);
      final enriched = _enrichImageUrls(updated);
      if (mounted) {
        state = AsyncValue.data(enriched);
      }
      return enriched;
    } catch (e) {
      rethrow;
    }
  }

  Trip _enrichImageUrls(Trip trip) {
    final itinerary = trip.itinerary;
    final tripPlaces = trip.places;
    if (itinerary == null || tripPlaces == null || tripPlaces.isEmpty) {
      return trip;
    }
    final imageMap = <String, String>{};
    for (final tp in tripPlaces) {
      final url = tp.place?.imageUrl;
      if (url != null && url.isNotEmpty) {
        imageMap[tp.placeId] = url;
      }
    }
    final updatedDays = itinerary.days.map((day) {
      final updatedPlaces = day.places.map((p) {
        if ((p.imageUrl == null || p.imageUrl!.isEmpty) &&
            imageMap.containsKey(p.placeId)) {
          return p.copyWith(imageUrl: imageMap[p.placeId]);
        }
        return p;
      }).toList();
      return day.copyWith(places: updatedPlaces);
    }).toList();

    return trip.copyWith(
      itinerary: itinerary.copyWith(days: updatedDays),
    );
  }
}

final tripDetailProvider = StateNotifierProvider.family<TripDetailNotifier,
    AsyncValue<Trip>, String>((ref, tripId) {
  final repository = ref.watch(tripsRepositoryProvider);
  return TripDetailNotifier(repository, tripId);
});

/// Compatibility FutureProvider for single trip
final tripProvider = FutureProvider.family<Trip, String>((ref, id) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return await repository.getTripById(id);
});
