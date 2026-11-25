import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/services/routing_service.dart';
import 'package:travel_planner/services/socket_service.dart';
import 'package:travel_planner/services/weather_service.dart';

/// Provider for ApiService singleton
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

/// Provider for WeatherService singleton
final weatherServiceProvider = Provider<WeatherService>((ref) {
  return WeatherService();
});

/// Provider for RoutingService singleton
final routingServiceProvider = Provider<RoutingService>((ref) {
  return RoutingService();
});

/// Provider for SocketService singleton
final socketServiceProvider = Provider<SocketService>((ref) {
  final service = SocketService();
  ref.onDispose(service.dispose);
  return service;
});
