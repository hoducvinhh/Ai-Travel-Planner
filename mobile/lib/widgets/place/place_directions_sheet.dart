import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/services/providers.dart';
import 'package:travel_planner/services/routing_service.dart';
import 'package:travel_planner/services/weather_service.dart';
import 'package:url_launcher/url_launcher.dart';

enum _MapLayerStyle { google, osm, satellite }

/// Directions & Live Weather modal bottom sheet (mirrors web PlaceDirectionsModal.tsx)
class PlaceDirectionsSheet extends ConsumerStatefulWidget {
  final String name;
  final double latitude;
  final double longitude;
  final String? province;
  final String? district;

  const PlaceDirectionsSheet({
    super.key,
    required this.name,
    required this.latitude,
    required this.longitude,
    this.province,
    this.district,
  });

  static Future<void> show(
    BuildContext context, {
    required String name,
    required double latitude,
    required double longitude,
    String? province,
    String? district,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => PlaceDirectionsSheet(
        name: name,
        latitude: latitude,
        longitude: longitude,
        province: province,
        district: district,
      ),
    );
  }

  @override
  ConsumerState<PlaceDirectionsSheet> createState() =>
      _PlaceDirectionsSheetState();
}

class _PlaceDirectionsSheetState extends ConsumerState<PlaceDirectionsSheet> {
  final MapController _mapController = MapController();

  late LatLng _origin;
  bool _isRealGps = false;
  bool _requestingGps = false;
  String _locationMsg = 'Đang dùng điểm xuất phát mẫu (~3km). Chạm bản đồ để đổi điểm đi.';

  TransportMode _transportMode = TransportMode.motorbike;
  _MapLayerStyle _mapStyle = _MapLayerStyle.google;

  RouteResult? _routeResult;
  bool _isRouting = false;

  WeatherInfo? _weather;
  bool _weatherLoading = true;

  @override
  void initState() {
    super.initState();
    _origin = LatLng(widget.latitude + 0.025, widget.longitude + 0.025);
    _fetchWeather();
    _calculateRoute();
    _requestGps();
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  Future<void> _fetchWeather() async {
    setState(() => _weatherLoading = true);
    final info = await ref
        .read(weatherServiceProvider)
        .getCurrentWeather(widget.latitude, widget.longitude);
    if (mounted) {
      setState(() {
        _weather = info;
        _weatherLoading = false;
      });
    }
  }

  Future<void> _requestGps() async {
    setState(() => _requestingGps = true);
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          setState(() {
            _requestingGps = false;
            _locationMsg = 'Dịch vụ GPS đang tắt. Chạm bản đồ để chọn điểm xuất phát.';
          });
        }
        return;
      }

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        if (mounted) {
          setState(() {
            _requestingGps = false;
            _locationMsg = 'Chưa có quyền GPS. Chạm vào bản đồ để đặt điểm xuất phát.';
          });
        }
        return;
      }

      final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
        timeLimit: const Duration(seconds: 8),
      );
      if (!mounted) return;
      setState(() {
        _origin = LatLng(pos.latitude, pos.longitude);
        _isRealGps = true;
        _requestingGps = false;
        _locationMsg = 'Đã nhận diện vị trí GPS thực tế của bạn!';
      });
      await _calculateRoute();
    } catch (_) {
      if (mounted) {
        setState(() {
          _requestingGps = false;
          _locationMsg = 'Không lấy được GPS. Đang dùng điểm xuất phát mẫu.';
        });
      }
    }
  }

  Future<void> _calculateRoute() async {
    setState(() => _isRouting = true);
    final dest = LatLng(widget.latitude, widget.longitude);
    final res = await ref.read(routingServiceProvider).calculateRoute(
          origin: _origin,
          destination: dest,
        );
    if (!mounted) return;
    setState(() {
      _routeResult = res;
      _isRouting = false;
    });
    _fitMapBounds();
  }

  void _fitMapBounds() {
    try {
      final bounds = LatLngBounds.fromPoints([
        _origin,
        LatLng(widget.latitude, widget.longitude),
      ]);
      _mapController.fitCamera(
        CameraFit.bounds(bounds: bounds, padding: const EdgeInsets.all(48)),
      );
    } catch (_) {}
  }

  String _tileUrl() {
    switch (_mapStyle) {
      case _MapLayerStyle.osm:
        return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      case _MapLayerStyle.satellite:
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case _MapLayerStyle.google:
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
  }

  Future<void> _openGoogleMaps() async {
    final modeParam = _transportMode == TransportMode.walking
        ? 'walking'
        : _transportMode == TransportMode.motorbike
            ? 'two-wheeler'
            : 'driving';
    final uri = Uri.parse(
      'https://www.google.com/maps/dir/?api=1'
      '&origin=${_origin.latitude},${_origin.longitude}'
      '&destination=${widget.latitude},${widget.longitude}'
      '&travelmode=$modeParam',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final dest = LatLng(widget.latitude, widget.longitude);
    final locationLabel = [
      if (widget.district != null && widget.district!.isNotEmpty) widget.district,
      widget.province ?? 'Việt Nam',
    ].join(', ');

    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                  child: const Icon(
                    LucideIcons.navigation,
                    size: 18,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Chỉ đường & Thời tiết: ${widget.name}',
                        style: AppTextStyles.labelLarge.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        locationLabel,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(LucideIcons.x, size: 20),
                ),
              ],
            ),
          ),

          // GPS Status Bar
          Container(
            margin: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.xs,
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.sm,
              vertical: 6,
            ),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _isRealGps ? AppColors.success : AppColors.textTertiary,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    _locationMsg,
                    style: AppTextStyles.bodySmall.copyWith(
                      fontSize: 11,
                      color: AppColors.textSecondary,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                TextButton.icon(
                  onPressed: _requestingGps ? null : _requestGps,
                  icon: _requestingGps
                      ? const SizedBox(
                          width: 12,
                          height: 12,
                          child: CircularProgressIndicator(strokeWidth: 1.5),
                        )
                      : const Icon(LucideIcons.locateFixed, size: 14),
                  label: const Text('GPS', style: TextStyle(fontSize: 11)),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                ),
              ],
            ),
          ),

          // Transport modes + Distance
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    _buildModeButton(
                      mode: TransportMode.motorbike,
                      label: 'Xe máy',
                      icon: LucideIcons.bike,
                      mins: _routeResult?.motorbikeMinutes,
                    ),
                    const SizedBox(width: AppSpacing.xs),
                    _buildModeButton(
                      mode: TransportMode.driving,
                      label: 'Ô tô',
                      icon: LucideIcons.car,
                      mins: _routeResult?.drivingMinutes,
                    ),
                    const SizedBox(width: AppSpacing.xs),
                    _buildModeButton(
                      mode: TransportMode.walking,
                      label: 'Đi bộ',
                      icon: LucideIcons.footprints,
                      mins: _routeResult?.walkingMinutes,
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Khoảng cách: ${_routeResult != null ? '${_routeResult!.distanceKm} km' : '...'}',
                      style: AppTextStyles.bodySmall.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (_isRouting)
                      Row(
                        children: [
                          const SizedBox(
                            width: 12,
                            height: 12,
                            child: CircularProgressIndicator(strokeWidth: 1.5),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Đang tính lộ trình...',
                            style: AppTextStyles.bodySmall.copyWith(fontSize: 11),
                          ),
                        ],
                      ),
                  ],
                ),
              ],
            ),
          ),

          // Weather Card
          Container(
            margin: const EdgeInsets.all(AppSpacing.md),
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.border),
            ),
            child: _weatherLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(8.0),
                      child: SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    ),
                  )
                : _weather == null
                    ? Text(
                        'Không thể tải dữ liệu thời tiết Open-Meteo',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(LucideIcons.cloudSun, size: 18),
                              const SizedBox(width: 8),
                              Text(
                                '${_weather!.temp}°C',
                                style: AppTextStyles.titleMedium.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  '${_weather!.description} • Cảm giác ${_weather!.apparentTemp}°C',
                                  style: AppTextStyles.bodySmall.copyWith(
                                    color: AppColors.textSecondary,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Text(
                                '${_weather!.humidity}% | ${_weather!.windSpeed}km/h',
                                style: AppTextStyles.bodySmall.copyWith(
                                  fontSize: 11,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(
                                LucideIcons.sparkles,
                                size: 14,
                                color: AppColors.primary,
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  _weather!.advice,
                                  style: AppTextStyles.bodySmall.copyWith(
                                    color: AppColors.textPrimary,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
          ),

          // Map Canvas
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.md,
                0,
                AppSpacing.md,
                AppSpacing.md,
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(AppRadius.lg),
                child: Stack(
                  children: [
                    FlutterMap(
                      mapController: _mapController,
                      options: MapOptions(
                        initialCenter: dest,
                        initialZoom: 13,
                        onTap: (_, latLng) {
                          setState(() {
                            _origin = latLng;
                            _isRealGps = false;
                            _locationMsg =
                                'Đã đặt điểm xuất phát theo vị trí bạn chạm trên bản đồ.';
                          });
                          _calculateRoute();
                        },
                      ),
                      children: [
                        TileLayer(
                          urlTemplate: _tileUrl(),
                          userAgentPackageName: 'com.example.travel_planner',
                        ),
                        if (_routeResult != null)
                          PolylineLayer(
                            polylines: [
                              Polyline(
                                points: _routeResult!.points,
                                strokeWidth: 4.5,
                                color: AppColors.primary,
                                isDotted:
                                    _transportMode == TransportMode.walking,
                              ),
                            ],
                          ),
                        MarkerLayer(
                          markers: [
                            Marker(
                              point: _origin,
                              width: 36,
                              height: 36,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: AppColors.textPrimary,
                                  shape: BoxShape.circle,
                                  border:
                                      Border.all(color: Colors.white, width: 2.5),
                                ),
                                child: const Icon(
                                  LucideIcons.user,
                                  size: 16,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            Marker(
                              point: dest,
                              width: 40,
                              height: 40,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: AppColors.primary,
                                  shape: BoxShape.circle,
                                  border:
                                      Border.all(color: Colors.white, width: 2.5),
                                ),
                                child: const Icon(
                                  LucideIcons.mapPin,
                                  size: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Tile switcher
                    Positioned(
                      top: 10,
                      right: 10,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.95),
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            _buildLayerChip('OSM', _MapLayerStyle.osm),
                            _buildLayerChip('Google', _MapLayerStyle.google),
                            _buildLayerChip('Vệ tinh', _MapLayerStyle.satellite),
                          ],
                        ),
                      ),
                    ),

                    // Open Google Maps button
                    Positioned(
                      bottom: 12,
                      right: 12,
                      child: ElevatedButton.icon(
                        onPressed: _openGoogleMaps,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.textPrimary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.md,
                            vertical: 10,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppRadius.md),
                          ),
                        ),
                        icon: const Icon(LucideIcons.externalLink, size: 15),
                        label: const Text(
                          'Mở Google Maps',
                          style: TextStyle(fontSize: 12),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModeButton({
    required TransportMode mode,
    required String label,
    required IconData icon,
    required int? mins,
  }) {
    final selected = _transportMode == mode;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _transportMode = mode),
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
          decoration: BoxDecoration(
            color: selected ? AppColors.primary : AppColors.surface,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(
              color: selected ? AppColors.primary : AppColors.border,
            ),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    icon,
                    size: 14,
                    color: selected ? Colors.white : AppColors.textPrimary,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    label,
                    style: AppTextStyles.labelSmall.copyWith(
                      color: selected ? Colors.white : AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                mins != null ? RoutingService.formatDuration(mins) : '—',
                style: AppTextStyles.labelSmall.copyWith(
                  color: selected ? Colors.white : AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLayerChip(String label, _MapLayerStyle style) {
    final active = _mapStyle == style;
    return GestureDetector(
      onTap: () => setState(() => _mapStyle = style),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: active ? AppColors.textPrimary : Colors.transparent,
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: active ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
