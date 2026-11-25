import 'dart:async';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:travel_planner/config/env.dart';

/// HTTP client service using Dio
class ApiService {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final StreamController<void> _unauthorizedController =
      StreamController<void>.broadcast();

  Stream<void> get onUnauthorized => _unauthorizedController.stream;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: Env.apiUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 60),
        headers: {
          'Content-Type': 'application/json',
        },
      ),
    );

    _setupInterceptors();
  }

  void _setupInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'auth_token');
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await _storage.delete(key: 'auth_token');
            _unauthorizedController.add(null);
          }
          return handler.next(error);
        },
      ),
    );
  }

  /// Format relative image URLs (e.g., `/uploads/...`) against Env.apiUrl
  static String formatImageUrl(String? url) {
    if (url == null || url.isEmpty) return '';
    if (url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('data:')) {
      return url;
    }
    final cleanUrl = url.startsWith('/') ? url : '/$url';
    return '${Env.apiUrl}$cleanUrl';
  }

  /// GET request
  Future<T> get<T>(String path, {Map<String, dynamic>? queryParams}) async {
    final response =
        await _dio.get<dynamic>(path, queryParameters: queryParams);
    return response.data as T;
  }

  /// POST request
  Future<T> post<T>(String path, {dynamic data}) async {
    final response = await _dio.post<dynamic>(path, data: data);
    return response.data as T;
  }

  /// PATCH request
  Future<T> patch<T>(String path, {dynamic data}) async {
    final response = await _dio.patch<dynamic>(path, data: data);
    return response.data as T;
  }

  /// PUT request
  Future<T> put<T>(String path, {dynamic data}) async {
    final response = await _dio.put<dynamic>(path, data: data);
    return response.data as T;
  }

  /// DELETE request
  Future<void> delete(String path) async {
    await _dio.delete<dynamic>(path);
  }

  /// Upload single image multipart file
  Future<Map<String, dynamic>> uploadImage(File file) async {
    final fileName = file.path.split(Platform.pathSeparator).last;
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(file.path, filename: fileName),
    });

    final response = await _dio.post<dynamic>(
      '/upload/image',
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );
    return Map<String, dynamic>.from(response.data as Map);
  }
}
