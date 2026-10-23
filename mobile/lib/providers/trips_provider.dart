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

/// Single trip provider
final tripProvider = FutureProvider.family<Trip, String>((ref, id) async {
  final repository = ref.watch(tripsRepositoryProvider);
  return await repository.getTripById(id);
});
