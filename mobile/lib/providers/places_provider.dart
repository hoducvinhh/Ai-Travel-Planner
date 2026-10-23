import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/repositories/places_repository.dart';
import 'package:travel_planner/services/providers.dart';

/// Places repository provider
final placesRepositoryProvider = Provider<PlacesRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return PlacesRepository(api);
});

/// Places filter state
class PlacesFilter {
  final String? province;
  final String? category;
  final String? budgetLevel;
  final String? search;

  PlacesFilter({
    this.province,
    this.category,
    this.budgetLevel,
    this.search,
  });

  PlacesFilter copyWith({
    String? province,
    String? category,
    String? budgetLevel,
    String? search,
    bool clearProvince = false,
    bool clearCategory = false,
    bool clearBudgetLevel = false,
    bool clearSearch = false,
  }) {
    return PlacesFilter(
      province: clearProvince ? null : (province ?? this.province),
      category: clearCategory ? null : (category ?? this.category),
      budgetLevel: clearBudgetLevel ? null : (budgetLevel ?? this.budgetLevel),
      search: clearSearch ? null : (search ?? this.search),
    );
  }
}

/// Places filter notifier
class PlacesFilterNotifier extends StateNotifier<PlacesFilter> {
  PlacesFilterNotifier() : super(PlacesFilter());

  void setProvince(String? province) {
    state = state.copyWith(province: province, clearProvince: province == null);
  }

  void setCategory(String? category) {
    state = state.copyWith(category: category, clearCategory: category == null);
  }

  void setBudgetLevel(String? budgetLevel) {
    state = state.copyWith(budgetLevel: budgetLevel, clearBudgetLevel: budgetLevel == null);
  }

  void setSearch(String? search) {
    state = state.copyWith(search: search, clearSearch: search == null);
  }

  void reset() {
    state = PlacesFilter();
  }
}

/// Places filter provider
final placesFilterProvider = StateNotifierProvider<PlacesFilterNotifier, PlacesFilter>((ref) {
  return PlacesFilterNotifier();
});

/// Places list provider with filters
final placesProvider = FutureProvider<List<Place>>((ref) async {
  final repository = ref.watch(placesRepositoryProvider);
  final filter = ref.watch(placesFilterProvider);

  return await repository.getPlaces(
    province: filter.province,
    category: filter.category,
    budgetLevel: filter.budgetLevel,
    search: filter.search,
  );
});

/// Single place provider
final placeProvider = FutureProvider.family<Place, String>((ref, id) async {
  final repository = ref.watch(placesRepositoryProvider);
  return await repository.getPlaceById(id);
});
