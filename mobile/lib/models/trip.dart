import 'package:freezed_annotation/freezed_annotation.dart';

part 'trip.freezed.dart';
part 'trip.g.dart';

Object? _readBudget(Map<dynamic, dynamic> json, String key) {
  final val = json['budget'] ?? json['budgetPerPerson'] ?? json['budget_per_person'] ?? 0;
  return (val is num) ? val.toDouble() : (double.tryParse(val.toString()) ?? 0.0);
}

Object? _readTravelers(Map<dynamic, dynamic> json, String key) {
  final val = json['travelersCount'] ?? json['groupSize'] ?? json['group_size'] ?? 1;
  return (val is num) ? val.toInt() : (int.tryParse(val.toString()) ?? 1);
}


/// Trip model
@freezed
abstract class Trip with _$Trip {
  const factory Trip({
    required String id,
    required String destination,
    required String startDate,
    required String endDate,
    @JsonKey(readValue: _readBudget) @Default(0.0) double budget,
    String? imageUrl,
    String? description,
    @JsonKey(readValue: _readTravelers) int? travelersCount,
    @Default([]) List<String> preferences,
  }) = _Trip;

  factory Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);
}

