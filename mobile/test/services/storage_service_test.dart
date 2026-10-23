import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:travel_planner/services/storage_service.dart';

// Generate mock class
@GenerateMocks([StorageService])
void main() {
  group('StorageService', () {
    late StorageService storageService;

    setUp(() {
      storageService = StorageService();
    });

    test('should initialize successfully', () async {
      // Test initialization
      expect(storageService, isNotNull);
    });

    group('Token Management', () {
      test('should save and retrieve token', () async {
        const testToken = 'test_token_123';

        await storageService.saveToken(testToken);
        final retrievedToken = await storageService.getToken();

        expect(retrievedToken, equals(testToken));
      });

      test('should delete token', () async {
        const testToken = 'test_token_123';

        await storageService.saveToken(testToken);
        await storageService.deleteToken();

        final retrievedToken = await storageService.getToken();
        expect(retrievedToken, isNull);
      });
    });

    group('User Data Management', () {
      test('should save and retrieve user data', () async {
        final testUserData = {
          'id': '123',
          'email': 'test@example.com',
          'name': 'Test User',
        };

        await storageService.saveUserData(testUserData);
        final retrievedData = await storageService.getUserData();

        expect(retrievedData, equals(testUserData));
      });

      test('should delete user data', () async {
        final testUserData = {
          'id': '123',
          'email': 'test@example.com',
        };

        await storageService.saveUserData(testUserData);
        await storageService.deleteUserData();

        final retrievedData = await storageService.getUserData();
        expect(retrievedData, isNull);
      });
    });

    group('Preferences Management', () {
      test('should save and retrieve boolean preference', () async {
        await storageService.saveBool('test_key', true);
        final value = await storageService.getBool('test_key');

        expect(value, isTrue);
      });

      test('should save and retrieve string preference', () async {
        await storageService.saveString('test_key', 'test_value');
        final value = await storageService.getString('test_key');

        expect(value, equals('test_value'));
      });

      test('should save and retrieve int preference', () async {
        await storageService.saveInt('test_key', 42);
        final value = await storageService.getInt('test_key');

        expect(value, equals(42));
      });

      test('should return null for non-existent key', () async {
        final value = await storageService.getString('non_existent');
        expect(value, isNull);
      });
    });

    group('Clear Storage', () {
      test('should clear all data', () async {
        await storageService.saveToken('token');
        await storageService.saveString('key', 'value');

        await storageService.clear();

        final token = await storageService.getToken();
        final value = await storageService.getString('key');

        expect(token, isNull);
        expect(value, isNull);
      });
    });
  });
}
