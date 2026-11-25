import 'dart:convert';
import 'dart:math' as math;
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

enum TransportMode { motorbike, driving, walking }

class RouteResult {
  final List<LatLng> points;
  final double distanceKm;
  final int motorbikeMinutes;
  final int drivingMinutes;
  final int walkingMinutes;
  final bool isEstimatedFallback;

  const RouteResult({
    required this.points,
    required this.distanceKm,
    required this.motorbikeMinutes,
    required this.drivingMinutes,
    required this.walkingMinutes,
    this.isEstimatedFallback = false,
  });

  int durationFor(TransportMode mode) {
    switch (mode) {
      case TransportMode.motorbike:
        return motorbikeMinutes;
      case TransportMode.driving:
        return drivingMinutes;
      case TransportMode.walking:
        return walkingMinutes;
    }
  }
}

/// Service calculating driving/motorbike/walking routes via OSRM with Haversine fallback
class RoutingService {
  Future<RouteResult> calculateRoute({
    required LatLng origin,
    required LatLng destination,
  }) async {
    try {
      final url = Uri.parse(
        'https://router.project-osrm.org/route/v1/driving/'
        '${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}'
        '?overview=full&geometries=geojson',
      );
      final response = await http.get(url).timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        final data = json.decode(response.body) as Map<String, dynamic>;
        final routes = data['routes'] as List<dynamic>?;
        if (routes != null && routes.isNotEmpty) {
          final primary = routes.first as Map<String, dynamic>;
          final distanceMeters = (primary['distance'] as num).toDouble();
          final distanceKm = (distanceMeters / 1000 * 10).round() / 10;
          final drivingMins = math.max(1, ((primary['duration'] as num) / 60).round());

          final bikeSpeed = distanceKm < 10 ? 28.0 : (distanceKm < 50 ? 35.0 : 40.0);
          int motorbikeMins = math.max(1, ((distanceKm / bikeSpeed) * 60).round());
          if (distanceKm < 15 && motorbikeMins > drivingMins) {
            motorbikeMins = math.max(1, (drivingMins * 0.9).round());
          }
          final walkingMins = math.max(2, ((distanceKm / 4.8) * 60).round());

          final geometry = primary['geometry'] as Map<String, dynamic>;
          final coords = geometry['coordinates'] as List<dynamic>;
          final points = coords
              .map((c) => LatLng((c[1] as num).toDouble(), (c[0] as num).toDouble()))
              .toList();

          return RouteResult(
            points: points,
            distanceKm: distanceKm,
            motorbikeMinutes: motorbikeMins,
            drivingMinutes: drivingMins,
            walkingMinutes: walkingMins,
          );
        }
      }
    } catch (_) {
      // Fallback to Haversine below
    }

    return _haversineFallback(origin, destination);
  }

  RouteResult _haversineFallback(LatLng origin, LatLng destination) {
    const earthRadiusKm = 6371.0;
    final dLat = (destination.latitude - origin.latitude) * math.pi / 180;
    final dLon = (destination.longitude - origin.longitude) * math.pi / 180;
    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(origin.latitude * math.pi / 180) *
            math.cos(destination.latitude * math.pi / 180) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);
    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    final estKm = (earthRadiusKm * c * 1.25 * 10).round() / 10;

    final drivingSpeed = estKm < 15 ? 30.0 : 60.0;
    final drivingMins = math.max(1, ((estKm / drivingSpeed) * 60).round());
    final bikeSpeed = estKm < 10 ? 28.0 : (estKm < 50 ? 35.0 : 40.0);
    final motorbikeMins = math.max(1, ((estKm / bikeSpeed) * 60).round());
    final walkingMins = math.max(2, ((estKm / 4.8) * 60).round());

    return RouteResult(
      points: [origin, destination],
      distanceKm: estKm,
      motorbikeMinutes: motorbikeMins,
      drivingMinutes: drivingMins,
      walkingMinutes: walkingMins,
      isEstimatedFallback: true,
    );
  }

  static String formatDuration(int mins) {
    if (mins < 60) return '$mins phút';
    final h = mins ~/ 60;
    final m = mins % 60;
    if (h >= 48) {
      final days = h ~/ 24;
      final remH = h % 24;
      return remH > 0 ? '$days ngày $remH giờ' : '$days ngày';
    }
    return m > 0 ? '$h giờ $m phút' : '$h giờ';
  }
}
