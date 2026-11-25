// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ItineraryPlace _$ItineraryPlaceFromJson(Map<String, dynamic> json) =>
    _ItineraryPlace(
      placeId: json['placeId'] as String,
      name: json['name'] as String,
      description: json['description'] as String? ?? '',
      categories:
          (json['categories'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      estimatedTime: json['estimatedTime'] as String? ?? '',
      orderInDay: (json['orderInDay'] as num?)?.toInt() ?? 1,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      priceEstimate: (json['priceEstimate'] as num?)?.toInt() ?? 0,
      timeSlot: json['timeSlot'] as String?,
      province: json['province'] as String?,
      imageUrl: json['imageUrl'] as String?,
    );

Map<String, dynamic> _$ItineraryPlaceToJson(_ItineraryPlace instance) =>
    <String, dynamic>{
      'placeId': instance.placeId,
      'name': instance.name,
      'description': instance.description,
      'categories': instance.categories,
      'estimatedTime': instance.estimatedTime,
      'orderInDay': instance.orderInDay,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'priceEstimate': instance.priceEstimate,
      'timeSlot': instance.timeSlot,
      'province': instance.province,
      'imageUrl': instance.imageUrl,
    };

_DayOptimizationStats _$DayOptimizationStatsFromJson(
  Map<String, dynamic> json,
) => _DayOptimizationStats(
  dayNumber: (json['dayNumber'] as num).toInt(),
  originalDistanceKm: (json['originalDistanceKm'] as num?)?.toDouble() ?? 0.0,
  optimizedDistanceKm: (json['optimizedDistanceKm'] as num?)?.toDouble() ?? 0.0,
  savedDistanceKm: (json['savedDistanceKm'] as num?)?.toDouble() ?? 0.0,
  savedPercentage: (json['savedPercentage'] as num?)?.toDouble() ?? 0.0,
);

Map<String, dynamic> _$DayOptimizationStatsToJson(
  _DayOptimizationStats instance,
) => <String, dynamic>{
  'dayNumber': instance.dayNumber,
  'originalDistanceKm': instance.originalDistanceKm,
  'optimizedDistanceKm': instance.optimizedDistanceKm,
  'savedDistanceKm': instance.savedDistanceKm,
  'savedPercentage': instance.savedPercentage,
};

_TripOptimizationStats _$TripOptimizationStatsFromJson(
  Map<String, dynamic> json,
) => _TripOptimizationStats(
  totalOriginalDistanceKm:
      (json['totalOriginalDistanceKm'] as num?)?.toDouble() ?? 0.0,
  totalOptimizedDistanceKm:
      (json['totalOptimizedDistanceKm'] as num?)?.toDouble() ?? 0.0,
  totalSavedDistanceKm:
      (json['totalSavedDistanceKm'] as num?)?.toDouble() ?? 0.0,
  totalSavedPercentage:
      (json['totalSavedPercentage'] as num?)?.toDouble() ?? 0.0,
  days:
      (json['days'] as List<dynamic>?)
          ?.map((e) => DayOptimizationStats.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
);

Map<String, dynamic> _$TripOptimizationStatsToJson(
  _TripOptimizationStats instance,
) => <String, dynamic>{
  'totalOriginalDistanceKm': instance.totalOriginalDistanceKm,
  'totalOptimizedDistanceKm': instance.totalOptimizedDistanceKm,
  'totalSavedDistanceKm': instance.totalSavedDistanceKm,
  'totalSavedPercentage': instance.totalSavedPercentage,
  'days': instance.days,
};

_FeasibilityCriterion _$FeasibilityCriterionFromJson(
  Map<String, dynamic> json,
) => _FeasibilityCriterion(
  score: (json['score'] as num?)?.toDouble() ?? 0.0,
  weight: (json['weight'] as num?)?.toDouble() ?? 0.0,
  label: json['label'] as String? ?? '',
  status: json['status'] as String? ?? 'good',
  summary: json['summary'] as String? ?? '',
);

Map<String, dynamic> _$FeasibilityCriterionToJson(
  _FeasibilityCriterion instance,
) => <String, dynamic>{
  'score': instance.score,
  'weight': instance.weight,
  'label': instance.label,
  'status': instance.status,
  'summary': instance.summary,
};

_FeasibilityMetrics _$FeasibilityMetricsFromJson(Map<String, dynamic> json) =>
    _FeasibilityMetrics(
      geo: FeasibilityCriterion.fromJson(json['geo'] as Map<String, dynamic>),
      time: FeasibilityCriterion.fromJson(json['time'] as Map<String, dynamic>),
      budget: FeasibilityCriterion.fromJson(
        json['budget'] as Map<String, dynamic>,
      ),
      preference: FeasibilityCriterion.fromJson(
        json['preference'] as Map<String, dynamic>,
      ),
      diversity: FeasibilityCriterion.fromJson(
        json['diversity'] as Map<String, dynamic>,
      ),
    );

Map<String, dynamic> _$FeasibilityMetricsToJson(_FeasibilityMetrics instance) =>
    <String, dynamic>{
      'geo': instance.geo,
      'time': instance.time,
      'budget': instance.budget,
      'preference': instance.preference,
      'diversity': instance.diversity,
    };

_FeasibilityWarning _$FeasibilityWarningFromJson(Map<String, dynamic> json) =>
    _FeasibilityWarning(
      type: json['type'] as String,
      category: json['category'] as String,
      dayNumber: (json['dayNumber'] as num?)?.toInt(),
      message: json['message'] as String,
    );

Map<String, dynamic> _$FeasibilityWarningToJson(_FeasibilityWarning instance) =>
    <String, dynamic>{
      'type': instance.type,
      'category': instance.category,
      'dayNumber': instance.dayNumber,
      'message': instance.message,
    };

_FeasibilityDayDetail _$FeasibilityDayDetailFromJson(
  Map<String, dynamic> json,
) => _FeasibilityDayDetail(
  dayNumber: (json['dayNumber'] as num).toInt(),
  placesCount: (json['placesCount'] as num?)?.toInt() ?? 0,
  distanceKm: (json['distanceKm'] as num?)?.toDouble() ?? 0.0,
  estimatedTransitTimeHours:
      (json['estimatedTransitTimeHours'] as num?)?.toDouble() ?? 0.0,
  dayCost: (json['dayCost'] as num?)?.toInt() ?? 0,
  warnings:
      (json['warnings'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
);

Map<String, dynamic> _$FeasibilityDayDetailToJson(
  _FeasibilityDayDetail instance,
) => <String, dynamic>{
  'dayNumber': instance.dayNumber,
  'placesCount': instance.placesCount,
  'distanceKm': instance.distanceKm,
  'estimatedTransitTimeHours': instance.estimatedTransitTimeHours,
  'dayCost': instance.dayCost,
  'warnings': instance.warnings,
};

_FeasibilityReport _$FeasibilityReportFromJson(
  Map<String, dynamic> json,
) => _FeasibilityReport(
  overallScore: (json['overallScore'] as num?)?.toDouble() ?? 0.0,
  rating: json['rating'] as String? ?? 'Khả thi',
  metrics: FeasibilityMetrics.fromJson(json['metrics'] as Map<String, dynamic>),
  warnings:
      (json['warnings'] as List<dynamic>?)
          ?.map((e) => FeasibilityWarning.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  dayDetails:
      (json['dayDetails'] as List<dynamic>?)
          ?.map((e) => FeasibilityDayDetail.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  totalDistanceKm: (json['totalDistanceKm'] as num?)?.toDouble() ?? 0.0,
  totalTransitTimeHours:
      (json['totalTransitTimeHours'] as num?)?.toDouble() ?? 0.0,
  evaluatedAt: json['evaluatedAt'] as String?,
);

Map<String, dynamic> _$FeasibilityReportToJson(_FeasibilityReport instance) =>
    <String, dynamic>{
      'overallScore': instance.overallScore,
      'rating': instance.rating,
      'metrics': instance.metrics,
      'warnings': instance.warnings,
      'dayDetails': instance.dayDetails,
      'totalDistanceKm': instance.totalDistanceKm,
      'totalTransitTimeHours': instance.totalTransitTimeHours,
      'evaluatedAt': instance.evaluatedAt,
    };

_DayPlan _$DayPlanFromJson(Map<String, dynamic> json) => _DayPlan(
  dayNumber: (json['dayNumber'] as num).toInt(),
  date: json['date'] as String? ?? '',
  places:
      (json['places'] as List<dynamic>?)
          ?.map((e) => ItineraryPlace.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  notes: json['notes'] as String?,
  optimizationStats: json['optimizationStats'] == null
      ? null
      : DayOptimizationStats.fromJson(
          json['optimizationStats'] as Map<String, dynamic>,
        ),
);

Map<String, dynamic> _$DayPlanToJson(_DayPlan instance) => <String, dynamic>{
  'dayNumber': instance.dayNumber,
  'date': instance.date,
  'places': instance.places,
  'notes': instance.notes,
  'optimizationStats': instance.optimizationStats,
};

_TripItinerary _$TripItineraryFromJson(Map<String, dynamic> json) =>
    _TripItinerary(
      days:
          (json['days'] as List<dynamic>?)
              ?.map((e) => DayPlan.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      summary: json['summary'] as String? ?? '',
      totalEstimatedCost:
          (json['totalEstimatedCost'] as num?)?.toDouble() ?? 0.0,
      optimizationStats: json['optimizationStats'] == null
          ? null
          : TripOptimizationStats.fromJson(
              json['optimizationStats'] as Map<String, dynamic>,
            ),
      feasibilityReport: json['feasibilityReport'] == null
          ? null
          : FeasibilityReport.fromJson(
              json['feasibilityReport'] as Map<String, dynamic>,
            ),
    );

Map<String, dynamic> _$TripItineraryToJson(_TripItinerary instance) =>
    <String, dynamic>{
      'days': instance.days,
      'summary': instance.summary,
      'totalEstimatedCost': instance.totalEstimatedCost,
      'optimizationStats': instance.optimizationStats,
      'feasibilityReport': instance.feasibilityReport,
    };

_TripPlaceInfo _$TripPlaceInfoFromJson(Map<String, dynamic> json) =>
    _TripPlaceInfo(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      imageUrl: json['imageUrl'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      categories:
          (json['categories'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$TripPlaceInfoToJson(_TripPlaceInfo instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'imageUrl': instance.imageUrl,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'categories': instance.categories,
    };

_TripPlaceRelation _$TripPlaceRelationFromJson(Map<String, dynamic> json) =>
    _TripPlaceRelation(
      id: json['id'] as String,
      tripId: json['tripId'] as String,
      placeId: json['placeId'] as String,
      dayNumber: (json['dayNumber'] as num).toInt(),
      orderInDay: (json['orderInDay'] as num).toInt(),
      place: json['place'] == null
          ? null
          : TripPlaceInfo.fromJson(json['place'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$TripPlaceRelationToJson(_TripPlaceRelation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'tripId': instance.tripId,
      'placeId': instance.placeId,
      'dayNumber': instance.dayNumber,
      'orderInDay': instance.orderInDay,
      'place': instance.place,
    };

_Trip _$TripFromJson(Map<String, dynamic> json) => _Trip(
  id: json['id'] as String,
  destination: json['destination'] as String,
  startDate: json['startDate'] as String,
  endDate: json['endDate'] as String,
  budgetPerPerson:
      (_readBudget(json, 'budgetPerPerson') as num?)?.toDouble() ?? 0.0,
  groupSize: (_readGroupSize(json, 'groupSize') as num?)?.toInt() ?? 1,
  status: json['status'] as String? ?? 'DRAFT',
  createdAt: json['createdAt'] as String?,
  imageUrl: json['imageUrl'] as String?,
  description: json['description'] as String?,
  preferences:
      (json['preferences'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList() ??
      const [],
  itinerary: json['itinerary'] == null
      ? null
      : TripItinerary.fromJson(json['itinerary'] as Map<String, dynamic>),
  places: (json['places'] as List<dynamic>?)
      ?.map((e) => TripPlaceRelation.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$TripToJson(_Trip instance) => <String, dynamic>{
  'id': instance.id,
  'destination': instance.destination,
  'startDate': instance.startDate,
  'endDate': instance.endDate,
  'budgetPerPerson': instance.budgetPerPerson,
  'groupSize': instance.groupSize,
  'status': instance.status,
  'createdAt': instance.createdAt,
  'imageUrl': instance.imageUrl,
  'description': instance.description,
  'preferences': instance.preferences,
  'itinerary': instance.itinerary,
  'places': instance.places,
};
