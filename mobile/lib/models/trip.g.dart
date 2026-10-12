// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Trip _$TripFromJson(Map<String, dynamic> json) => _Trip(
      id: json['id'] as String,
      destination: json['destination'] as String,
      startDate: json['startDate'] as String,
      endDate: json['endDate'] as String,
      budget: (_readBudget(json, 'budget') as num?)?.toDouble() ?? 0.0,
      imageUrl: json['imageUrl'] as String?,
      description: json['description'] as String?,
      travelersCount: (_readTravelers(json, 'travelersCount') as num?)?.toInt(),
      preferences: (json['preferences'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$TripToJson(_Trip instance) => <String, dynamic>{
      'id': instance.id,
      'destination': instance.destination,
      'startDate': instance.startDate,
      'endDate': instance.endDate,
      'budget': instance.budget,
      'imageUrl': instance.imageUrl,
      'description': instance.description,
      'travelersCount': instance.travelersCount,
      'preferences': instance.preferences,
    };
