import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/services/storage_service.dart';

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

    group('Preferences Management', () {
      test('should save and retrieve boolean preference', () async {
        await storageService.saveBool('test_key', true);
        final value = storageService.getBool('test_key');

        expect(value, isTrue);
      });

      test('should save and retrieve string preference', () async {
        await storageService.saveString('test_key', 'test_value');
        final value = storageService.getString('test_key');

        expect(value, equals('test_value'));
      });

      test('should save and retrieve int preference', () async {
        await storageService.saveInt('test_key', 42);
        final value = storageService.getInt('test_key');

        expect(value, equals(42));
      });

      test('should return null for non-existent key', () async {
        final value = storageService.getString('non_existent');
        expect(value, isNull);
      });
    });

    group('Clear Storage', () {
      test('should clear all data', () async {
        await storageService.saveToken('token');
        await storageService.saveString('key', 'value');

        await storageService.clear();

        final token = await storageService.getToken();
        final value = storageService.getString('key');

        expect(token, isNull);
        expect(value, isNull);
      });
    });
  });
}
