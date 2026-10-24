import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:travel_planner/services/database_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  group('DatabaseService', () {
    late DatabaseService databaseService;

    setUp(() {
      databaseService = DatabaseService();
    });

    test('should initialize database', () async {
      final db = await databaseService.database;
      expect(db, isNotNull);
    });

    group('Trip Operations', () {
      test('should cache and retrieve trip', () async {
        final tripData = {
          'id': 'trip_123',
          'destination': 'Hà Nội',
          'startDate': '2024-03-15',
          'endDate': '2024-03-20',
          'budget': 5000000.0,
          'imageUrl': 'https://example.com/image.jpg',
          'travelersCount': 2,
          'preferences': ['culture', 'food'],
        };

        await databaseService.cacheTrip(tripData);

        final retrieved = await databaseService.getCachedTrip('trip_123');

        expect(retrieved, isNotNull);
        expect(retrieved!['id'], equals('trip_123'));
        expect(retrieved['destination'], equals('Hà Nội'));
      });

      test('should get all cached trips', () async {
        final trip1 = {
          'id': 'trip_1',
          'destination': 'Đà Nẵng',
          'startDate': '2024-04-01',
          'endDate': '2024-04-05',
          'budget': 3000000.0,
          'travelersCount': 2,
        };

        final trip2 = {
          'id': 'trip_2',
          'destination': 'Sapa',
          'startDate': '2024-05-01',
          'endDate': '2024-05-03',
          'budget': 2000000.0,
          'travelersCount': 1,
        };

        await databaseService.cacheTrip(trip1);
        await databaseService.cacheTrip(trip2);

        final trips = await databaseService.getCachedTrips();

        expect(trips.length, greaterThanOrEqualTo(2));
      });

      test('should delete cached trip', () async {
        final tripData = {
          'id': 'trip_to_delete',
          'destination': 'Nha Trang',
          'startDate': '2024-06-01',
          'endDate': '2024-06-05',
          'budget': 4000000.0,
          'travelersCount': 2,
        };

        await databaseService.cacheTrip(tripData);
        await databaseService.deleteCachedTrip('trip_to_delete');

        final retrieved = await databaseService.getCachedTrip('trip_to_delete');
        expect(retrieved, isNull);
      });
    });

    group('Place Operations', () {
      test('should cache and retrieve place', () async {
        final placeData = {
          'id': 'place_123',
          'name': 'Hồ Hoàn Kiếm',
          'province': 'Hà Nội',
          'latitude': 21.028511,
          'longitude': 105.804817,
          'category': 'attraction',
          'rating': 4.5,
          'reviewCount': 1000,
          'amenities': ['parking', 'wifi'],
        };

        await databaseService.cachePlace(placeData);

        final retrieved = await databaseService.getCachedPlace('place_123');

        expect(retrieved, isNotNull);
        expect(retrieved!['name'], equals('Hồ Hoàn Kiếm'));
        expect(retrieved['province'], equals('Hà Nội'));
      });

      test('should filter cached places by province', () async {
        final place1 = {
          'id': 'place_hn',
          'name': 'Temple',
          'province': 'Hà Nội',
          'latitude': 21.0,
          'longitude': 105.0,
        };

        final place2 = {
          'id': 'place_dn',
          'name': 'Beach',
          'province': 'Đà Nẵng',
          'latitude': 16.0,
          'longitude': 108.0,
        };

        await databaseService.cachePlace(place1);
        await databaseService.cachePlace(place2);

        final hanoiPlaces = await databaseService.getCachedPlaces(
          province: 'Hà Nội',
        );

        expect(hanoiPlaces.length, greaterThanOrEqualTo(1));
        expect(hanoiPlaces.first['province'], equals('Hà Nội'));
      });

      test('should filter cached places by category', () async {
        final restaurant = {
          'id': 'rest_1',
          'name': 'Restaurant',
          'province': 'Hà Nội',
          'latitude': 21.0,
          'longitude': 105.0,
          'category': 'restaurant',
        };

        await databaseService.cachePlace(restaurant);

        final restaurants = await databaseService.getCachedPlaces(
          category: 'restaurant',
        );

        expect(restaurants.length, greaterThanOrEqualTo(1));
        expect(restaurants.first['category'], equals('restaurant'));
      });
    });

    group('Cache Management', () {
      test('should clear all cache', () async {
        final trip = {
          'id': 'trip_clear',
          'destination': 'Test',
          'startDate': '2024-01-01',
          'endDate': '2024-01-02',
          'budget': 1000000.0,
          'travelersCount': 1,
        };

        await databaseService.cacheTrip(trip);
        await databaseService.clearCache();

        final trips = await databaseService.getCachedTrips();
        final places = await databaseService.getCachedPlaces();

        expect(trips.length, equals(0));
        expect(places.length, equals(0));
      });
    });

    tearDown(() async {
      // Clean up after tests
      await databaseService.clearCache();
      await databaseService.close();
    });
  });
}
