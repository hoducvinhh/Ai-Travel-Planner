import 'package:freezed_annotation/freezed_annotation.dart';

part 'trip.freezed.dart';
part 'trip.g.dart';

/// Trip model
@freezed
class Trip with _$Trip {
  const factory Trip({
    required String id,
    required String userId,
    required String destination,
    required DateTime startDate,
    required DateTime endDate,
    required double budget,
    required int travelers,
    String? imageUrl,
    String? description,
    TripStatus? status,
    @Default([]) List<String> categories,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Trip;

  factory Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);
}

/// Trip status enum
enum TripStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('planned')
  planned,
  @JsonValue('ongoing')
  ongoing,
  @JsonValue('completed')
  completed,
  @JsonValue('cancelled')
  cancelled,
}

/// Extension for TripStatus display
extension TripStatusExtension on TripStatus {
  String get displayName {
    switch (this) {
      case TripStatus.draft:
        return 'Nháp';
      case TripStatus.planned:
        return 'Đã lên kế hoạch';
      case TripStatus.ongoing:
        return 'Đang diễn ra';
      case TripStatus.completed:
        return 'Đã hoàn thành';
      case TripStatus.cancelled:
        return 'Đã hủy';
    }
  }
}
