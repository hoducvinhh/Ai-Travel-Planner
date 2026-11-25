import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/repositories/places_repository.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

class _StubApiService implements ApiService {
  String? lastPath;
  Map<String, dynamic>? lastQueryParams;
  dynamic lastData;
  dynamic nextResponse;

  @override
  Future<T> get<T>(String path, {Map<String, dynamic>? queryParams}) async {
    lastPath = path;
    lastQueryParams = queryParams;
    return nextResponse as T;
  }

  @override
  Future<T> post<T>(String path, {dynamic data}) async {
    lastPath = path;
    lastData = data;
    return nextResponse as T;
  }

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  group('PlacesRepository', () {
    late _StubApiService api;
    late PlacesRepository repository;

    setUp(() {
      api = _StubApiService();
      repository = PlacesRepository(api);
    });

    test('getPlaces sends expected query parameters and parses paginated payload', () async {
      api.nextResponse = {
        'items': [
          {
            'id': 'p1',
            'name': 'Hồ Hoàn Kiếm',
            'province': 'Hanoi',
            'latitude': 21.0285,
            'longitude': 105.8542,
            'categories': ['Văn hóa', 'Thiên nhiên'],
            'ratingAvg': 4.8,
            'ratingCount': 120,
            'isLiked': true,
          },
        ],
        'pagination': {
          'page': 2,
          'limit': 24,
          'total': 50,
          'totalPages': 3,
        },
      };

      final res = await repository.getPlaces(
        page: 2,
        limit: 24,
        province: 'Hanoi',
        category: 'Văn hóa',
        search: 'Hoàn Kiếm',
        sortBy: 'rating',
        userId: 'u1',
      );

      expect(api.lastPath, AppConstants.places);
      expect(api.lastQueryParams, {
        'page': 2,
        'limit': 24,
        'sortBy': 'rating',
        'province': 'Hanoi',
        'category': 'Văn hóa',
        'search': 'Hoàn Kiếm',
        'userId': 'u1',
      });
      expect(res.items.length, 1);
      expect(res.items.first.name, 'Hồ Hoàn Kiếm');
      expect(res.items.first.isLiked, isTrue);
      expect(res.pagination.totalPages, 3);
    });

    test('getPlaces omits ALL province and Tất cả category', () async {
      api.nextResponse = {
        'items': <dynamic>[],
        'pagination': {'page': 1, 'limit': 24, 'total': 0, 'totalPages': 1},
      };

      await repository.getPlaces(province: 'ALL', category: 'Tất cả');

      expect(api.lastQueryParams, {'page': 1, 'limit': 12, 'sortBy': 'popularity'});
    });

    test('interaction endpoints post expected payloads', () async {
      api.nextResponse = {'liked': true, 'likesCount': 5};
      final likeRes = await repository.toggleLike(userId: 'u1', placeId: 'p1');
      expect(api.lastPath, AppConstants.interactionsToggleLike);
      expect(api.lastData, {'userId': 'u1', 'placeId': 'p1'});
      expect(likeRes['liked'], isTrue);

      api.nextResponse = {'saved': true, 'savesCount': 2};
      await repository.toggleSave(userId: 'u1', placeId: 'p1');
      expect(api.lastPath, AppConstants.interactionsToggleSave);

      api.nextResponse = {'ratingAvg': 4.5, 'ratingCount': 10};
      await repository.ratePlace(userId: 'u1', placeId: 'p1', ratingValue: 5);
      expect(api.lastPath, AppConstants.interactionsRate);
      expect(api.lastData, {'userId': 'u1', 'placeId': 'p1', 'ratingValue': 5});

      api.nextResponse = {'ratingAvg': 4.0, 'ratingCount': 9};
      await repository.unratePlace(userId: 'u1', placeId: 'p1');
      expect(api.lastPath, AppConstants.interactionsUnrate);
    });
  });
}
