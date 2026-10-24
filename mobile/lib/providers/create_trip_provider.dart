import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/repositories/trips_repository.dart';
import 'package:travel_planner/providers/trips_provider.dart';

/// Create trip state
class CreateTripState {
  final String destination;
  final DateTime? startDate;
  final DateTime? endDate;
  final double budget;
  final int travelersCount;
  final List<String> preferences;
  final bool isLoading;
  final String? error;

  CreateTripState({
    this.destination = '',
    this.startDate,
    this.endDate,
    this.budget = 0,
    this.travelersCount = 1,
    this.preferences = const [],
    this.isLoading = false,
    this.error,
  });

  CreateTripState copyWith({
    String? destination,
    DateTime? startDate,
    DateTime? endDate,
    double? budget,
    int? travelersCount,
    List<String>? preferences,
    bool? isLoading,
    String? error,
  }) {
    return CreateTripState(
      destination: destination ?? this.destination,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      budget: budget ?? this.budget,
      travelersCount: travelersCount ?? this.travelersCount,
      preferences: preferences ?? this.preferences,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Create trip notifier
class CreateTripNotifier extends StateNotifier<CreateTripState> {
  final TripsRepository _repository;

  CreateTripNotifier(this._repository) : super(CreateTripState());

  void setDestination(String destination) {
    state = state.copyWith(destination: destination, error: null);
  }

  void setDates(DateTime? startDate, DateTime? endDate) {
    state = state.copyWith(
      startDate: startDate,
      endDate: endDate,
      error: null,
    );
  }

  void setBudget(double budget) {
    state = state.copyWith(budget: budget, error: null);
  }

  void setTravelersCount(int count) {
    state = state.copyWith(travelersCount: count, error: null);
  }

  void setPreferences(List<String> preferences) {
    state = state.copyWith(preferences: preferences, error: null);
  }

  void togglePreference(String preference) {
    final preferences = List<String>.from(state.preferences);
    if (preferences.contains(preference)) {
      preferences.remove(preference);
    } else {
      preferences.add(preference);
    }
    state = state.copyWith(preferences: preferences, error: null);
  }

  Future<bool> createTrip() async {
    if (state.startDate == null || state.endDate == null) {
      state = state.copyWith(error: 'Vui lòng chọn ngày khởi hành và kết thúc');
      return false;
    }

    state = state.copyWith(isLoading: true, error: null);

    try {
      await _repository.createTrip(
        destination: state.destination,
        startDate: state.startDate!.toIso8601String(),
        endDate: state.endDate!.toIso8601String(),
        budget: state.budget,
        travelersCount: state.travelersCount,
        preferences: state.preferences.isNotEmpty ? state.preferences : null,
      );

      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  void reset() {
    state = CreateTripState();
  }
}

/// Create trip provider
final createTripProvider =
    StateNotifierProvider<CreateTripNotifier, CreateTripState>((ref) {
  final repository = ref.watch(tripsRepositoryProvider);
  return CreateTripNotifier(repository);
});
