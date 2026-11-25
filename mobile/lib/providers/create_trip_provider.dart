import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/trip.dart';
import 'package:travel_planner/models/user.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/repositories/trips_repository.dart';

/// Create trip state (supports multi-province Tour liên tỉnh + Smart Pre-fill)
class CreateTripState {
  final List<String> destinations;
  final DateTime? startDate;
  final DateTime? endDate;
  final double budgetPerPerson;
  final int groupSize;
  final List<String> preferences;
  final bool isSmartPrefilled;
  final bool isLoading;
  final String? error;

  const CreateTripState({
    this.destinations = const [],
    this.startDate,
    this.endDate,
    this.budgetPerPerson = 0,
    this.groupSize = 1,
    this.preferences = const [],
    this.isSmartPrefilled = false,
    this.isLoading = false,
    this.error,
  });

  String get destination => destinations.join(', ');
  double get totalBudget => budgetPerPerson * groupSize;

  CreateTripState copyWith({
    List<String>? destinations,
    DateTime? startDate,
    DateTime? endDate,
    double? budgetPerPerson,
    int? groupSize,
    List<String>? preferences,
    bool? isSmartPrefilled,
    bool? isLoading,
    String? error,
    bool clearError = false,
  }) {
    return CreateTripState(
      destinations: destinations ?? this.destinations,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      budgetPerPerson: budgetPerPerson ?? this.budgetPerPerson,
      groupSize: groupSize ?? this.groupSize,
      preferences: preferences ?? this.preferences,
      isSmartPrefilled: isSmartPrefilled ?? this.isSmartPrefilled,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Create trip notifier
class CreateTripNotifier extends StateNotifier<CreateTripState> {
  final TripsRepository _repository;
  final Ref _ref;
  bool _hasPrefilled = false;

  CreateTripNotifier(this._repository, this._ref)
      : super(const CreateTripState());

  /// Smart Pre-fill from Onboarding profile (matches web/src/app/trips/new/page.tsx)
  void applySmartPrefill(User? user) {
    if (user == null || _hasPrefilled) return;
    _hasPrefilled = true;

    final userStyles = user.preferredStyles;
    final cleanStyles =
        userStyles.where((s) => !s.startsWith('companion:')).toList();
    final compTag = userStyles.where((s) => s.startsWith('companion:')).firstOrNull;

    int defaultGroup = 1;
    if (compTag != null) {
      final c = compTag.replaceFirst('companion:', '');
      if (c == 'couple') {
        defaultGroup = 2;
      } else if (c == 'family' || c == 'friends') {
        defaultGroup = 4;
      }
    }

    double defaultBudget = 0;
    final bLevel = user.budgetLevel?.toLowerCase();
    if (bLevel == 'budget') {
      defaultBudget = 500000;
    } else if (bLevel == 'standard' || bLevel == 'moderate') {
      defaultBudget = 1200000;
    } else if (bLevel == 'luxury') {
      defaultBudget = 2500000;
    }

    if (cleanStyles.isNotEmpty || defaultBudget > 0 || defaultGroup > 1) {
      state = state.copyWith(
        preferences: cleanStyles.isNotEmpty ? cleanStyles : state.preferences,
        budgetPerPerson:
            defaultBudget > 0 ? defaultBudget : state.budgetPerPerson,
        groupSize: defaultGroup > 1 ? defaultGroup : state.groupSize,
        isSmartPrefilled: true,
      );
    }
  }

  void toggleDestination(String provinceKey) {
    final updated = List<String>.from(state.destinations);
    if (updated.contains(provinceKey)) {
      updated.remove(provinceKey);
    } else {
      updated.add(provinceKey);
    }
    state = state.copyWith(destinations: updated, clearError: true);
  }

  void removeDestination(String provinceKey) {
    final updated = List<String>.from(state.destinations)..remove(provinceKey);
    state = state.copyWith(destinations: updated, clearError: true);
  }

  void clearDestinations() {
    state = state.copyWith(destinations: [], clearError: true);
  }

  void setDates(DateTime? startDate, DateTime? endDate) {
    state = state.copyWith(
      startDate: startDate,
      endDate: endDate,
      clearError: true,
    );
  }

  void setBudgetPerPerson(double budget) {
    state = state.copyWith(budgetPerPerson: budget, clearError: true);
  }

  void setGroupSize(int count) {
    state = state.copyWith(groupSize: count, clearError: true);
  }

  void togglePreference(String preference) {
    final preferences = List<String>.from(state.preferences);
    if (preferences.contains(preference)) {
      preferences.remove(preference);
    } else {
      preferences.add(preference);
    }
    state = state.copyWith(preferences: preferences, clearError: true);
  }

  Future<Trip?> createTrip() async {
    if (state.startDate == null || state.endDate == null) {
      state = state.copyWith(error: 'Vui lòng chọn ngày khởi hành và kết thúc');
      return null;
    }
    if (state.destinations.isEmpty) {
      state = state.copyWith(error: 'Vui lòng chọn ít nhất 1 điểm đến');
      return null;
    }

    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final created = await _repository.createTrip(
        destination: state.destination,
        startDate: state.startDate!.toIso8601String(),
        endDate: state.endDate!.toIso8601String(),
        budgetPerPerson: state.budgetPerPerson,
        groupSize: state.groupSize,
        preferences: state.preferences.isNotEmpty ? state.preferences : null,
      );

      _ref.invalidate(tripsProvider);
      state = state.copyWith(isLoading: false);
      return created;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return null;
    }
  }

  void reset() {
    _hasPrefilled = false;
    state = const CreateTripState();
    final user = _ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    applySmartPrefill(user);
  }
}

/// Create trip provider
final createTripProvider =
    StateNotifierProvider<CreateTripNotifier, CreateTripState>((ref) {
  final repository = ref.watch(tripsRepositoryProvider);
  final notifier = CreateTripNotifier(repository, ref);
  final user = ref.watch(authProvider).maybeWhen(
        authenticated: (u) => u,
        orElse: () => null,
      );
  notifier.applySmartPrefill(user);
  return notifier;
});
