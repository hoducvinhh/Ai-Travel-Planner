/// Input validators
class Validators {
  /// Email validation
  static String? email(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email không được để trống';
    }

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(value)) {
      return 'Email không hợp lệ';
    }

    return null;
  }

  /// Password validation
  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return 'Mật khẩu không được để trống';
    }

    if (value.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Mật khẩu phải có ít nhất 1 chữ hoa';
    }

    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Mật khẩu phải có ít nhất 1 chữ số';
    }

    return null;
  }

  /// Confirm password validation
  static String? confirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Vui lòng xác nhận mật khẩu';
    }

    if (value != password) {
      return 'Mật khẩu không khớp';
    }

    return null;
  }

  /// Required field validation
  static String? required(String? value, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return '${fieldName ?? "Trường này"} không được để trống';
    }
    return null;
  }

  /// Phone number validation (Vietnam)
  static String? phoneNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Số điện thoại không được để trống';
    }

    final phoneRegex = RegExp(r'^(0|\+84)[3|5|7|8|9][0-9]{8}$');

    if (!phoneRegex.hasMatch(value)) {
      return 'Số điện thoại không hợp lệ';
    }

    return null;
  }

  /// Minimum length validation
  static String? minLength(String? value, int length, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return '${fieldName ?? "Trường này"} không được để trống';
    }

    if (value.length < length) {
      return '${fieldName ?? "Trường này"} phải có ít nhất $length ký tự';
    }

    return null;
  }

  /// Maximum length validation
  static String? maxLength(String? value, int length, {String? fieldName}) {
    if (value != null && value.length > length) {
      return '${fieldName ?? "Trường này"} không được vượt quá $length ký tự';
    }

    return null;
  }

  /// Number validation
  static String? number(String? value) {
    if (value == null || value.isEmpty) {
      return 'Vui lòng nhập số';
    }

    if (double.tryParse(value) == null) {
      return 'Giá trị phải là số';
    }

    return null;
  }

  /// Positive number validation
  static String? positiveNumber(String? value) {
    final numberError = number(value);
    if (numberError != null) return numberError;

    if (double.parse(value!) <= 0) {
      return 'Giá trị phải lớn hơn 0';
    }

    return null;
  }
}
