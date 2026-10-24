// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Place _$PlaceFromJson(Map<String, dynamic> json) => _Place(
  id: json['id'] as String,
  name: json['name'] as String,
  province: json['province'] as String,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  category: json['category'] as String?,
  description: json['description'] as String?,
  imageUrl: json['imageUrl'] as String?,
  rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
  reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 0,
  budgetLevel: json['budgetLevel'] as String?,
  district: json['district'] as String?,
  amenities: (json['amenities'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  openingHours: json['openingHours'] as String?,
  phone: json['phone'] as String?,
  website: json['website'] as String?,
);

Map<String, dynamic> _$PlaceToJson(_Place instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'province': instance.province,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'category': instance.category,
  'description': instance.description,
  'imageUrl': instance.imageUrl,
  'rating': instance.rating,
  'reviewCount': instance.reviewCount,
  'budgetLevel': instance.budgetLevel,
  'district': instance.district,
  'amenities': instance.amenities,
  'openingHours': instance.openingHours,
  'phone': instance.phone,
  'website': instance.website,
};
