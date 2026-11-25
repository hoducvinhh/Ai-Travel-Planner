import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/repositories/trips_repository.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

class _StubApiService implements ApiService {
  String? lastPath;
  dynamic lastData;
  dynamic nextResponse;

  @override
  Future<T> get<T>(String path, {Map<String, dynamic>? queryParams}) async {
    lastPath = path;
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

Map<String, dynamic> _sampleTripJson({String id = 't1'}) => {
      'id': id,
      'destination': 'Đà Lạt, Nha Trang',
      'startDate': '2026-12-01',
      'endDate': '2026-12-03',
      'budgetPerPerson': 4500000,
      'groupSize': 2,
      'preferences': ['Thiên nhiên', 'Ẩm thực'],
      'itinerary': {
        'days': [
          {
            'dayNumber': 1,
            'places': [
              {
                'placeId': 'p1',
                'name': 'Hồ Xuân Hương',
                'latitude': 11.9404,
                'longitude': 108.4426,
                'estimatedTime': '08:00 - 10:00',
                'timeSlot': 'Sáng',
                'orderInDay': 1,
                'priceEstimate': 0,
              },
            ],
          },
        ],
        'feasibilityReport': {
          'overallScore': 88.5,
          'rating': 'Khả thi',
          'metrics': {
            'geo': {'score': 90.0, 'label': 'Địa lý'},
            'time': {'score': 85.0, 'label': 'Thời gian'},
            'budget': {'score': 90.0, 'label': 'Ngân sách'},
            'preference': {'score': 88.0, 'label': 'Sở thích'},
            'diversity': {'score': 89.0, 'label': 'Đa dạng'},
          },
          'warnings': <Map<String, dynamic>>[],
        },
      },
    };

void main() {
  group('TripsRepository', () {
    late _StubApiService api;
    late TripsRepository repository;

    setUp(() {
      api = _StubApiService();
      repository = TripsRepository(api);
    });

    test('createTrip posts CreateTripDto fields aligned with backend', () async {
      api.nextResponse = _sampleTripJson();

      final trip = await repository.createTrip(
        destination: 'Đà Lạt, Nha Trang',
        startDate: '2026-12-01',
        endDate: '2026-12-03',
        budgetPerPerson: 4500000,
        groupSize: 2,
        preferences: ['Thiên nhiên', 'Ẩm thực'],
      );

      expect(api.lastPath, AppConstants.trips);
      expect(api.lastData, {
        'destination': 'Đà Lạt, Nha Trang',
        'startDate': '2026-12-01',
        'endDate': '2026-12-03',
        'budgetPerPerson': 4500000.0,
        'groupSize': 2,
        'preferences': ['Thiên nhiên', 'Ẩm thực'],
      });
      expect(trip.budgetPerPerson, 4500000);
      expect(trip.travelersCount, 2);
      expect(trip.itinerary?.feasibilityReport?.overallScore, 88.5);
      expect(trip.itinerary?.days.first.places.first.name, 'Hồ Xuân Hương');
    });

    test('optimizeTrip and cloneTrip call expected POST endpoints', () async {
      api.nextResponse = _sampleTripJson(id: 't1');
      await repository.optimizeTrip('t1');
      expect(api.lastPath, '${AppConstants.trips}/t1/optimize');

      api.nextResponse = _sampleTripJson(id: 't2');
      final cloned = await repository.cloneTrip('t1');
      expect(api.lastPath, '${AppConstants.trips}/t1/clone');
      expect(cloned.id, 't2');
    });
  });
}
