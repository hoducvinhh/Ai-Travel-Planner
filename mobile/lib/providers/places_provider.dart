import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/place.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/repositories/places_repository.dart';
import 'package:travel_planner/services/providers.dart';

/// Places repository provider
final placesRepositoryProvider = Provider<PlacesRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return PlacesRepository(api);
});

/// Places filter & sort state
class PlacesFilter {
  final String? province;
  final String? category;
  final String? search;
  final String sortBy;

  const PlacesFilter({
    this.province,
    this.category,
    this.search,
    this.sortBy = 'popularity',
  });

  PlacesFilter copyWith({
    String? province,
    String? category,
    String? search,
    String? sortBy,
    bool clearProvince = false,
    bool clearCategory = false,
    bool clearSearch = false,
  }) {
    return PlacesFilter(
      province: clearProvince ? null : (province ?? this.province),
      category: clearCategory ? null : (category ?? this.category),
      search: clearSearch ? null : (search ?? this.search),
      sortBy: sortBy ?? this.sortBy,
    );
  }
}

/// Places filter notifier
class PlacesFilterNotifier extends StateNotifier<PlacesFilter> {
  PlacesFilterNotifier() : super(const PlacesFilter());

  void setProvince(String? province) {
    state = state.copyWith(
      province: province,
      clearProvince: province == null || province == 'ALL',
    );
  }

  void setCategory(String? category) {
    state = state.copyWith(
      category: category,
      clearCategory: category == null || category == 'Tất cả',
    );
  }

  void setSearch(String? search) {
    state = state.copyWith(
      search: search,
      clearSearch: search == null || search.trim().isEmpty,
    );
  }

  void setSortBy(String sortBy) {
    state = state.copyWith(sortBy: sortBy);
  }

  void reset() {
    state = const PlacesFilter();
  }
}

final placesFilterProvider =
    StateNotifierProvider<PlacesFilterNotifier, PlacesFilter>((ref) {
  return PlacesFilterNotifier();
});

/// Paginated places list state
class PlacesFeedState {
  final List<Place> places;
  final int page;
  final int totalPages;
  final int total;
  final bool isLoading;
  final bool isLoadingMore;
  final String? error;

  const PlacesFeedState({
    this.places = const [],
    this.page = 1,
    this.totalPages = 1,
    this.total = 0,
    this.isLoading = false,
    this.isLoadingMore = false,
    this.error,
  });

  bool get hasMore => page < totalPages;

  PlacesFeedState copyWith({
    List<Place>? places,
    int? page,
    int? totalPages,
    int? total,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    bool clearError = false,
  }) {
    return PlacesFeedState(
      places: places ?? this.places,
      page: page ?? this.page,
      totalPages: totalPages ?? this.totalPages,
      total: total ?? this.total,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Places feed state notifier with pagination & optimistic interactions
class PlacesFeedNotifier extends StateNotifier<PlacesFeedState> {
  final PlacesRepository _repository;
  final PlacesFilter _filter;
  final String? _userId;

  PlacesFeedNotifier(this._repository, this._filter, this._userId)
      : super(const PlacesFeedState(isLoading: true)) {
    loadInitial();
  }

  Future<void> loadInitial() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final res = await _repository.getPlaces(
        page: 1,
        province: _filter.province,
        category: _filter.category,
        search: _filter.search,
        sortBy: _filter.sortBy,
        userId: _userId,
      );
      if (!mounted) return;
      state = PlacesFeedState(
        places: res.items,
        page: res.pagination.page,
        totalPages: res.pagination.totalPages,
        total: res.pagination.total,
        isLoading: false,
      );
    } catch (e) {
      if (!mounted) return;
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore) return;
    state = state.copyWith(isLoadingMore: true);
    try {
      final nextPage = state.page + 1;
      final res = await _repository.getPlaces(
        page: nextPage,
        province: _filter.province,
        category: _filter.category,
        search: _filter.search,
        sortBy: _filter.sortBy,
        userId: _userId,
      );
      if (!mounted) return;
      state = state.copyWith(
        places: [...state.places, ...res.items],
        page: res.pagination.page,
        totalPages: res.pagination.totalPages,
        total: res.pagination.total,
        isLoadingMore: false,
      );
    } catch (_) {
      if (!mounted) return;
      state = state.copyWith(isLoadingMore: false);
    }
  }

  Future<String?> toggleLike(Place place) async {
    if (_userId == null) return 'Vui lòng đăng nhập để thích địa điểm!';
    final prevLiked = place.isLiked;
    final nextLiked = !prevLiked;

    _updatePlace(place.id, (p) => p.copyWith(
          isLiked: nextLiked,
          likesCount: nextLiked
              ? p.likesCount + 1
              : (p.likesCount > 0 ? p.likesCount - 1 : 0),
        ));

    try {
      final res = await _repository.toggleLike(userId: _userId, placeId: place.id);
      _updatePlace(place.id, (p) => p.copyWith(
            isLiked: res['isLiked'] == true,
            likesCount: (res['likesCount'] as num?)?.toInt() ?? p.likesCount,
          ));
      return null;
    } catch (_) {
      _updatePlace(place.id, (p) => p.copyWith(
            isLiked: prevLiked,
            likesCount: place.likesCount,
          ));
      return 'Có lỗi xảy ra khi thích địa điểm';
    }
  }

  Future<String?> toggleSave(Place place) async {
    if (_userId == null) return 'Vui lòng đăng nhập để lưu vào Wishlist!';
    final prevSaved = place.isSaved;
    final nextSaved = !prevSaved;

    _updatePlace(place.id, (p) => p.copyWith(
          isSaved: nextSaved,
          savesCount: nextSaved
              ? p.savesCount + 1
              : (p.savesCount > 0 ? p.savesCount - 1 : 0),
        ));

    try {
      final res = await _repository.toggleSave(userId: _userId, placeId: place.id);
      final saved = res['isSaved'] == true;
      _updatePlace(place.id, (p) => p.copyWith(isSaved: saved));
      return saved ? 'Đã lưu vào danh sách Wishlist!' : 'Đã bỏ lưu khỏi Wishlist';
    } catch (_) {
      _updatePlace(place.id, (p) => p.copyWith(
            isSaved: prevSaved,
            savesCount: place.savesCount,
          ));
      return 'Có lỗi xảy ra khi lưu địa điểm';
    }
  }

  Future<String?> ratePlace(String placeId, int ratingValue) async {
    if (_userId == null) return 'Vui lòng đăng nhập để đánh giá!';
    try {
      final res = await _repository.ratePlace(
        userId: _userId,
        placeId: placeId,
        ratingValue: ratingValue,
      );
      _updatePlace(placeId, (p) => p.copyWith(
            userRating: (res['userRating'] as num?)?.toInt() ?? ratingValue,
            ratingAvg: (res['ratingAvg'] as num?)?.toDouble() ?? p.ratingAvg,
            ratingCount: (res['ratingCount'] as num?)?.toInt() ?? p.ratingCount,
          ));
      return 'Cảm ơn bạn đã đánh giá $ratingValue sao!';
    } catch (_) {
      return 'Có lỗi xảy ra khi gửi đánh giá';
    }
  }

  Future<String?> unratePlace(String placeId) async {
    if (_userId == null) return 'Vui lòng đăng nhập!';
    try {
      final res = await _repository.unratePlace(userId: _userId, placeId: placeId);
      _updatePlace(placeId, (p) => p.copyWith(
            userRating: null,
            ratingAvg: (res['ratingAvg'] as num?)?.toDouble() ?? p.ratingAvg,
            ratingCount: (res['ratingCount'] as num?)?.toInt() ?? p.ratingCount,
          ));
      return 'Đã hủy đánh giá của bạn';
    } catch (_) {
      return 'Có lỗi xảy ra khi hủy đánh giá';
    }
  }

  void incrementCommentCount(String placeId) {
    _updatePlace(placeId, (p) => p.copyWith(commentsCount: p.commentsCount + 1));
  }

  void _updatePlace(String placeId, Place Function(Place) updater) {
    state = state.copyWith(
      places: state.places.map((p) => p.id == placeId ? updater(p) : p).toList(),
    );
  }
}

final placesFeedProvider =
    StateNotifierProvider<PlacesFeedNotifier, PlacesFeedState>((ref) {
  final repository = ref.watch(placesRepositoryProvider);
  final filter = ref.watch(placesFilterProvider);
  final authState = ref.watch(authProvider);
  final userId = authState.maybeWhen(
    authenticated: (u) => u.id,
    orElse: () => null,
  );
  return PlacesFeedNotifier(repository, filter, userId);
});

/// Single place detail provider
final placeProvider = FutureProvider.family<Place, String>((ref, id) async {
  final repository = ref.watch(placesRepositoryProvider);
  final authState = ref.watch(authProvider);
  final userId = authState.maybeWhen(
    authenticated: (u) => u.id,
    orElse: () => null,
  );
  return await repository.getPlaceById(id, userId: userId);
});

/// Place comments provider
final placeCommentsProvider =
    FutureProvider.family<List<PlaceCommentItem>, String>((ref, placeId) async {
  final repository = ref.watch(placesRepositoryProvider);
  return await repository.getPlaceComments(placeId);
});
