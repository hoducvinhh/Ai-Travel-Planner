import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/models/place.dart';

/// Trip map widget with numbered markers and route
class TripMap extends StatefulWidget {
  final List<Place> places;
  final LatLng? currentLocation;
  final double initialZoom;
  final bool showRoute;
  final Function(Place)? onMarkerTap;

  const TripMap({
    super.key,
    required this.places,
    this.currentLocation,
    this.initialZoom = 12.0,
    this.showRoute = true,
    this.onMarkerTap,
  });

  @override
  State<TripMap> createState() => _TripMapState();
}

class _TripMapState extends State<TripMap> {
  late MapController _mapController;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  LatLng get _center {
    if (widget.places.isEmpty) {
      return widget.currentLocation ?? const LatLng(21.028511, 105.804817); // Hanoi
    }

    // Calculate center of all places
    double totalLat = 0;
    double totalLng = 0;
    for (final place in widget.places) {
      totalLat += place.latitude;
      totalLng += place.longitude;
    }
    return LatLng(
      totalLat / widget.places.length,
      totalLng / widget.places.length,
    );
  }

  List<Marker> get _markers {
    final markers = <Marker>[];

    // Current location marker
    if (widget.currentLocation != null) {
      markers.add(
        Marker(
          point: widget.currentLocation!,
          width: 40,
          height: 40,
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.secondary,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.person_pin_circle,
              color: Colors.white,
              size: 20,
            ),
          ),
        ),
      );
    }

    // Place markers with numbers
    for (int i = 0; i < widget.places.length; i++) {
      final place = widget.places[i];
      markers.add(
        Marker(
          point: LatLng(place.latitude, place.longitude),
          width: 44,
          height: 54,
          child: GestureDetector(
            onTap: () => widget.onMarkerTap?.call(place),
            child: _buildNumberedMarker(i + 1),
          ),
        ),
      );
    }

    return markers;
  }

  Widget _buildNumberedMarker(int number) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Shadow
        Positioned(
          bottom: 0,
          child: Container(
            width: 20,
            height: 8,
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
        // Marker pin
        Positioned(
          bottom: 4,
          child: Container(
            width: 44,
            height: 50,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppColors.primary,
                  AppColors.primary.withValues(alpha: 0.8),
                ],
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(22),
                topRight: Radius.circular(22),
                bottomLeft: Radius.circular(22),
              ),
              border: Border.all(color: Colors.white, width: 2.5),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.4),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  number.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  List<Polyline> get _polylines {
    if (!widget.showRoute || widget.places.length < 2) {
      return [];
    }

    final points = widget.places
        .map((place) => LatLng(place.latitude, place.longitude))
        .toList();

    return [
      // Shadow line
      Polyline(
        points: points,
        strokeWidth: 6,
        color: Colors.black.withValues(alpha: 0.2),
      ),
      // Main line
      Polyline(
        points: points,
        strokeWidth: 4,
        color: AppColors.primary,
        borderColor: Colors.white,
        borderStrokeWidth: 1,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: FlutterMap(
        mapController: _mapController,
        options: MapOptions(
          initialCenter: _center,
          initialZoom: widget.initialZoom,
          minZoom: 5,
          maxZoom: 18,
          interactionOptions: const InteractionOptions(
            flags: InteractiveFlag.all,
          ),
        ),
        children: [
          // Google Maps tile layer (no API key needed)
          TileLayer(
            urlTemplate: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            userAgentPackageName: 'com.example.travel_planner',
          ),
          // Route polylines
          PolylineLayer(polylines: _polylines),
          // Markers
          MarkerLayer(markers: _markers),
        ],
      ),
    );
  }
}
