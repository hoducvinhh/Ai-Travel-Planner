import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/utils/validators.dart';

void main() {
  group('Validators', () {
    group('Email Validation', () {
      test('should return null for valid email', () {
        expect(Validators.email('test@example.com'), null);
        expect(Validators.email('user.name@domain.co.uk'), null);
        expect(Validators.email('user+tag@example.com'), null);
      });

      test('should return error for invalid email', () {
        expect(Validators.email(''), isNotNull);
        expect(Validators.email('invalid'), isNotNull);
        expect(Validators.email('test@'), isNotNull);
        expect(Validators.email('@example.com'), isNotNull);
        expect(Validators.email('test @example.com'), isNotNull);
      });
    });

    group('Password Validation', () {
      test('should return null for valid password', () {
        expect(Validators.password('password123'), null);
        expect(Validators.password('MyP@ssw0rd'), null);
        expect(Validators.password('12345678'), null);
      });

      test('should return error for password less than 6 characters', () {
        expect(Validators.password('12345'), isNotNull);
        expect(Validators.password(''), isNotNull);
      });
    });

    group('Required Field Validation', () {
      test('should return null for non-empty string', () {
        expect(Validators.required('test'), null);
        expect(Validators.required('  text  '), null);
      });

      test('should return error for empty string', () {
        expect(Validators.required(''), isNotNull);
        expect(Validators.required('   '), isNotNull);
      });
    });

    group('Phone Validation', () {
      test('should return null for valid Vietnamese phone', () {
        expect(Validators.phone('0123456789'), null);
        expect(Validators.phone('0987654321'), null);
        expect(Validators.phone('+84123456789'), null);
      });

      test('should return error for invalid phone', () {
        expect(Validators.phone(''), isNotNull);
        expect(Validators.phone('123'), isNotNull);
        expect(Validators.phone('abcdefghij'), isNotNull);
      });
    });

    group('Min Length Validation', () {
      test('should return null when length is sufficient', () {
        expect(Validators.minLength('test', 3), null);
        expect(Validators.minLength('hello world', 5), null);
      });

      test('should return error when length is insufficient', () {
        expect(Validators.minLength('ab', 3), isNotNull);
        expect(Validators.minLength('', 1), isNotNull);
      });
    });

    group('Max Length Validation', () {
      test('should return null when length is within limit', () {
        expect(Validators.maxLength('test', 5), null);
        expect(Validators.maxLength('hello', 10), null);
      });

      test('should return error when length exceeds limit', () {
        expect(Validators.maxLength('testing', 5), isNotNull);
        expect(Validators.maxLength('hello world', 5), isNotNull);
      });
    });

    group('Number Validation', () {
      test('should return null for valid number', () {
        expect(Validators.number('123'), null);
        expect(Validators.number('45.67'), null);
        expect(Validators.number('-10'), null);
      });

      test('should return error for invalid number', () {
        expect(Validators.number(''), isNotNull);
        expect(Validators.number('abc'), isNotNull);
        expect(Validators.number('12.34.56'), isNotNull);
      });
    });

    group('URL Validation', () {
      test('should return null for valid URL', () {
        expect(Validators.url('https://example.com'), null);
        expect(Validators.url('http://test.org/path?query=1'), null);
        expect(Validators.url('https://sub.domain.com'), null);
      });

      test('should return error for invalid URL', () {
        expect(Validators.url(''), isNotNull);
        expect(Validators.url('not a url'), isNotNull);
        expect(Validators.url('ftp://example.com'), isNotNull);
      });
    });
  });
}
