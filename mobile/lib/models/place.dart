import 'package:freezed_annotation/freezed_annotation.dart';

part 'place.freezed.dart';
part 'place.g.dart';

/// Place model
@freezed
abstract class Place with _$Place {
  const factory Place({
    required String id,
    required String name,
    required String province,
    required double latitude,
    required double longitude,
    String? category,
    String? description,
    String? imageUrl,
    @Default(0.0) double rating,
    @Default(0) int reviewCount,
    String? budgetLevel,
    String? district,
    List<String>? amenities,
    String? openingHours,
    String? phone,
    String? website,
  }) = _Place;

  factory Place.fromJson(Map<String, dynamic> json) => _$PlaceFromJson(json);
}
