import 'package:freezed_annotation/freezed_annotation.dart';

part 'trip.freezed.dart';
part 'trip.g.dart';

Object? _readBudget(Map<dynamic, dynamic> json, String key) {
  final val =
      json['budgetPerPerson'] ?? json['budget'] ?? json['budget_per_person'] ?? 0;
  return (val is num) ? val.toDouble() : (double.tryParse(val.toString()) ?? 0.0);
}

Object? _readGroupSize(Map<dynamic, dynamic> json, String key) {
  final val =
      json['groupSize'] ?? json['travelersCount'] ?? json['group_size'] ?? 1;
  return (val is num) ? val.toInt() : (int.tryParse(val.toString()) ?? 1);
}

/// Place item inside a day itinerary
@freezed
abstract class ItineraryPlace with _$ItineraryPlace {
  const factory ItineraryPlace({
    required String placeId,
    required String name,
    @Default('') String description,
    @Default([]) List<String> categories,
    @Default('') String estimatedTime,
    @Default(1) int orderInDay,
    required double latitude,
    required double longitude,
    @Default(0) int priceEstimate,
    String? timeSlot,
    String? province,
    String? imageUrl,
  }) = _ItineraryPlace;

  factory ItineraryPlace.fromJson(Map<String, dynamic> json) =>
      _$ItineraryPlaceFromJson(json);
}

/// Day optimization stats
@freezed
abstract class DayOptimizationStats with _$DayOptimizationStats {
  const factory DayOptimizationStats({
    required int dayNumber,
    @Default(0.0) double originalDistanceKm,
    @Default(0.0) double optimizedDistanceKm,
    @Default(0.0) double savedDistanceKm,
    @Default(0.0) double savedPercentage,
  }) = _DayOptimizationStats;

  factory DayOptimizationStats.fromJson(Map<String, dynamic> json) =>
      _$DayOptimizationStatsFromJson(json);
}

/// Trip-wide optimization stats
@freezed
abstract class TripOptimizationStats with _$TripOptimizationStats {
  const factory TripOptimizationStats({
    @Default(0.0) double totalOriginalDistanceKm,
    @Default(0.0) double totalOptimizedDistanceKm,
    @Default(0.0) double totalSavedDistanceKm,
    @Default(0.0) double totalSavedPercentage,
    @Default([]) List<DayOptimizationStats> days,
  }) = _TripOptimizationStats;

  factory TripOptimizationStats.fromJson(Map<String, dynamic> json) =>
      _$TripOptimizationStatsFromJson(json);
}

/// Feasibility criterion (one of 5 dimensions)
@freezed
abstract class FeasibilityCriterion with _$FeasibilityCriterion {
  const factory FeasibilityCriterion({
    @Default(0.0) double score,
    @Default(0.0) double weight,
    @Default('') String label,
    @Default('good') String status,
    @Default('') String summary,
  }) = _FeasibilityCriterion;

  factory FeasibilityCriterion.fromJson(Map<String, dynamic> json) =>
      _$FeasibilityCriterionFromJson(json);
}

/// Feasibility 5 metrics container
@freezed
abstract class FeasibilityMetrics with _$FeasibilityMetrics {
  const factory FeasibilityMetrics({
    required FeasibilityCriterion geo,
    required FeasibilityCriterion time,
    required FeasibilityCriterion budget,
    required FeasibilityCriterion preference,
    required FeasibilityCriterion diversity,
  }) = _FeasibilityMetrics;

  factory FeasibilityMetrics.fromJson(Map<String, dynamic> json) =>
      _$FeasibilityMetricsFromJson(json);
}

/// Feasibility warning item
@freezed
abstract class FeasibilityWarning with _$FeasibilityWarning {
  const factory FeasibilityWarning({
    required String type, // CRITICAL | WARNING | TIP
    required String category, // geo | time | budget | pref | div
    int? dayNumber,
    required String message,
  }) = _FeasibilityWarning;

  factory FeasibilityWarning.fromJson(Map<String, dynamic> json) =>
      _$FeasibilityWarningFromJson(json);
}

/// Feasibility per-day details
@freezed
abstract class FeasibilityDayDetail with _$FeasibilityDayDetail {
  const factory FeasibilityDayDetail({
    required int dayNumber,
    @Default(0) int placesCount,
    @Default(0.0) double distanceKm,
    @Default(0.0) double estimatedTransitTimeHours,
    @Default(0) int dayCost,
    @Default([]) List<String> warnings,
  }) = _FeasibilityDayDetail;

  factory FeasibilityDayDetail.fromJson(Map<String, dynamic> json) =>
      _$FeasibilityDayDetailFromJson(json);
}

/// Overall Feasibility Score (OFS) report
@freezed
abstract class FeasibilityReport with _$FeasibilityReport {
  const factory FeasibilityReport({
    @Default(0.0) double overallScore,
    @Default('Khả thi') String rating,
    required FeasibilityMetrics metrics,
    @Default([]) List<FeasibilityWarning> warnings,
    @Default([]) List<FeasibilityDayDetail> dayDetails,
    @Default(0.0) double totalDistanceKm,
    @Default(0.0) double totalTransitTimeHours,
    String? evaluatedAt,
  }) = _FeasibilityReport;

  factory FeasibilityReport.fromJson(Map<String, dynamic> json) =>
      _$FeasibilityReportFromJson(json);
}

/// Single day plan
@freezed
abstract class DayPlan with _$DayPlan {
  const factory DayPlan({
    required int dayNumber,
    @Default('') String date,
    @Default([]) List<ItineraryPlace> places,
    String? notes,
    DayOptimizationStats? optimizationStats,
  }) = _DayPlan;

  factory DayPlan.fromJson(Map<String, dynamic> json) =>
      _$DayPlanFromJson(json);
}

/// Full itinerary payload
@freezed
abstract class TripItinerary with _$TripItinerary {
  const factory TripItinerary({
    @Default([]) List<DayPlan> days,
    @Default('') String summary,
    @Default(0.0) double totalEstimatedCost,
    TripOptimizationStats? optimizationStats,
    FeasibilityReport? feasibilityReport,
  }) = _TripItinerary;

  factory TripItinerary.fromJson(Map<String, dynamic> json) =>
      _$TripItineraryFromJson(json);
}

/// Embedded place info inside trip.places relation
@freezed
abstract class TripPlaceInfo with _$TripPlaceInfo {
  const factory TripPlaceInfo({
    required String id,
    required String name,
    String? description,
    String? imageUrl,
    double? latitude,
    double? longitude,
    @Default([]) List<String> categories,
  }) = _TripPlaceInfo;

  factory TripPlaceInfo.fromJson(Map<String, dynamic> json) =>
      _$TripPlaceInfoFromJson(json);
}

/// Trip-place relation item
@freezed
abstract class TripPlaceRelation with _$TripPlaceRelation {
  const factory TripPlaceRelation({
    required String id,
    required String tripId,
    required String placeId,
    required int dayNumber,
    required int orderInDay,
    TripPlaceInfo? place,
  }) = _TripPlaceRelation;

  factory TripPlaceRelation.fromJson(Map<String, dynamic> json) =>
      _$TripPlaceRelationFromJson(json);
}

/// Trip model matching backend TripsService
@freezed
abstract class Trip with _$Trip {
  const Trip._();

  const factory Trip({
    required String id,
    required String destination,
    required String startDate,
    required String endDate,
    @JsonKey(readValue: _readBudget) @Default(0.0) double budgetPerPerson,
    @JsonKey(readValue: _readGroupSize) @Default(1) int groupSize,
    @Default('DRAFT') String status,
    String? createdAt,
    String? imageUrl,
    String? description,
    @Default([]) List<String> preferences,
    TripItinerary? itinerary,
    List<TripPlaceRelation>? places,
  }) = _Trip;

  factory Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);

  // Compatibility getters
  double get budget => budgetPerPerson;
  int get travelersCount => groupSize;
}
