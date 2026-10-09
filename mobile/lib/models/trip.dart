import 'package:freezed_annotation/freezed_annotation.dart';

part 'trip.freezed.dart';
part 'trip.g.dart';

/// Trip model
@freezed
class Trip with _$Trip {
  const factory Trip({
    required String id,
    required String destination,
    required String startDate,
    required String endDate,
    required double budget,
    String? imageUrl,
    String? description,
    int? travelersCount,
    @Default([]) List<String> preferences,
  }) = _Trip;

  factory Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);
}
