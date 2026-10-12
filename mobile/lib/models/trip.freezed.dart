// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'trip.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Trip {
  String get id;
  String get destination;
  String get startDate;
  String get endDate;
  @JsonKey(readValue: _readBudget)
  double get budget;
  String? get imageUrl;
  String? get description;
  @JsonKey(readValue: _readTravelers)
  int? get travelersCount;
  List<String> get preferences;

  /// Create a copy of Trip
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @pragma('vm:prefer-inline')
  $TripCopyWith<Trip> get copyWith =>
      _$TripCopyWithImpl<Trip>(this as Trip, _$identity);

  /// Serializes this Trip to a JSON map.
  Map<String, dynamic> toJson();

  @override
  bool operator ==(Object other) {
    final _this = this as Trip;
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is Trip &&
            (identical(other.id, _this.id) || other.id == _this.id) &&
            (identical(other.destination, _this.destination) ||
                other.destination == _this.destination) &&
            (identical(other.startDate, _this.startDate) ||
                other.startDate == _this.startDate) &&
            (identical(other.endDate, _this.endDate) ||
                other.endDate == _this.endDate) &&
            (identical(other.budget, _this.budget) ||
                other.budget == _this.budget) &&
            (identical(other.imageUrl, _this.imageUrl) ||
                other.imageUrl == _this.imageUrl) &&
            (identical(other.description, _this.description) ||
                other.description == _this.description) &&
            (identical(other.travelersCount, _this.travelersCount) ||
                other.travelersCount == _this.travelersCount) &&
            const DeepCollectionEquality()
                .equals(other.preferences, _this.preferences));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode {
    final _this = this as Trip;
    return Object.hash(
        runtimeType,
        _this.id,
        _this.destination,
        _this.startDate,
        _this.endDate,
        _this.budget,
        _this.imageUrl,
        _this.description,
        _this.travelersCount,
        const DeepCollectionEquality().hash(_this.preferences));
  }

  @override
  String toString() {
    final _this = this as Trip;
    return 'Trip(id: ${_this.id}, destination: ${_this.destination}, startDate: ${_this.startDate}, endDate: ${_this.endDate}, budget: ${_this.budget}, imageUrl: ${_this.imageUrl}, description: ${_this.description}, travelersCount: ${_this.travelersCount}, preferences: ${_this.preferences})';
  }
}

/// @nodoc
abstract mixin class $TripCopyWith<$Res> {
  factory $TripCopyWith(Trip value, $Res Function(Trip) _then) =
      _$TripCopyWithImpl;
  @useResult
  $Res call(
      {String id,
      String destination,
      String startDate,
      String endDate,
      @JsonKey(readValue: _readBudget) double budget,
      String? imageUrl,
      String? description,
      @JsonKey(readValue: _readTravelers) int? travelersCount,
      List<String> preferences});
}

/// @nodoc
class _$TripCopyWithImpl<$Res> implements $TripCopyWith<$Res> {
  _$TripCopyWithImpl(this._self, this._then);

  final Trip _self;
  final $Res Function(Trip) _then;

  /// Create a copy of Trip
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? destination = null,
    Object? startDate = null,
    Object? endDate = null,
    Object? budget = null,
    Object? imageUrl = freezed,
    Object? description = freezed,
    Object? travelersCount = freezed,
    Object? preferences = null,
  }) {
    return _then(Trip(
      id: null == id
          ? _self.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      destination: null == destination
          ? _self.destination
          : destination // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _self.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as String,
      endDate: null == endDate
          ? _self.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String,
      budget: null == budget
          ? _self.budget
          : budget // ignore: cast_nullable_to_non_nullable
              as double,
      imageUrl: freezed == imageUrl
          ? _self.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _self.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      travelersCount: freezed == travelersCount
          ? _self.travelersCount
          : travelersCount // ignore: cast_nullable_to_non_nullable
              as int?,
      preferences: null == preferences
          ? _self.preferences
          : preferences // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ));
  }
}

/// Adds pattern-matching-related methods to [Trip].
extension TripPatterns on Trip {
  /// A variant of `map` that fallback to returning `orElse`.
  ///
  /// It is equivalent to doing:
  /// ```dart
  /// switch (sealedClass) {
  ///   case final Subclass value:
  ///     return ...;
  ///   case _:
  ///     return orElse();
  /// }
  /// ```

  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>(
    TResult Function(_Trip value)? $default, {
    required TResult orElse(),
  }) {
    final _that = this;
    switch (_that) {
      case _Trip() when $default != null:
        return $default(_that);
      case _:
        return orElse();
    }
  }

  /// A `switch`-like method, using callbacks.
  ///
  /// Callbacks receives the raw object, upcasted.
  /// It is equivalent to doing:
  /// ```dart
  /// switch (sealedClass) {
  ///   case final Subclass value:
  ///     return ...;
  ///   case final Subclass2 value:
  ///     return ...;
  /// }
  /// ```

  @optionalTypeArgs
  TResult map<TResult extends Object?>(
    TResult Function(_Trip value) $default,
  ) {
    final _that = this;
    switch (_that) {
      case _Trip():
        return $default(_that);
      case _:
        throw StateError('Unexpected subclass');
    }
  }

  /// A variant of `map` that fallback to returning `null`.
  ///
  /// It is equivalent to doing:
  /// ```dart
  /// switch (sealedClass) {
  ///   case final Subclass value:
  ///     return ...;
  ///   case _:
  ///     return null;
  /// }
  /// ```

  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>(
    TResult? Function(_Trip value)? $default,
  ) {
    final _that = this;
    switch (_that) {
      case _Trip() when $default != null:
        return $default(_that);
      case _:
        return null;
    }
  }

  /// A variant of `when` that fallback to an `orElse` callback.
  ///
  /// It is equivalent to doing:
  /// ```dart
  /// switch (sealedClass) {
  ///   case Subclass(:final field):
  ///     return ...;
  ///   case _:
  ///     return orElse();
  /// }
  /// ```

  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>(
    TResult Function(
            String id,
            String destination,
            String startDate,
            String endDate,
            @JsonKey(readValue: _readBudget) double budget,
            String? imageUrl,
            String? description,
            @JsonKey(readValue: _readTravelers) int? travelersCount,
            List<String> preferences)?
        $default, {
    required TResult orElse(),
  }) {
    final _that = this;
    switch (_that) {
      case _Trip() when $default != null:
        return $default(
            _that.id,
            _that.destination,
            _that.startDate,
            _that.endDate,
            _that.budget,
            _that.imageUrl,
            _that.description,
            _that.travelersCount,
            _that.preferences);
      case _:
        return orElse();
    }
  }

  /// A `switch`-like method, using callbacks.
  ///
  /// As opposed to `map`, this offers destructuring.
  /// It is equivalent to doing:
  /// ```dart
  /// switch (sealedClass) {
  ///   case Subclass(:final field):
  ///     return ...;
  ///   case Subclass2(:final field2):
  ///     return ...;
  /// }
  /// ```

  @optionalTypeArgs
  TResult when<TResult extends Object?>(
    TResult Function(
            String id,
            String destination,
            String startDate,
            String endDate,
            @JsonKey(readValue: _readBudget) double budget,
            String? imageUrl,
            String? description,
            @JsonKey(readValue: _readTravelers) int? travelersCount,
            List<String> preferences)
        $default,
  ) {
    final _that = this;
    switch (_that) {
      case _Trip():
        return $default(
            _that.id,
            _that.destination,
            _that.startDate,
            _that.endDate,
            _that.budget,
            _that.imageUrl,
            _that.description,
            _that.travelersCount,
            _that.preferences);
      case _:
        throw StateError('Unexpected subclass');
    }
  }

  /// A variant of `when` that fallback to returning `null`
  ///
  /// It is equivalent to doing:
  /// ```dart
  /// switch (sealedClass) {
  ///   case Subclass(:final field):
  ///     return ...;
  ///   case _:
  ///     return null;
  /// }
  /// ```

  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>(
    TResult? Function(
            String id,
            String destination,
            String startDate,
            String endDate,
            @JsonKey(readValue: _readBudget) double budget,
            String? imageUrl,
            String? description,
            @JsonKey(readValue: _readTravelers) int? travelersCount,
            List<String> preferences)?
        $default,
  ) {
    final _that = this;
    switch (_that) {
      case _Trip() when $default != null:
        return $default(
            _that.id,
            _that.destination,
            _that.startDate,
            _that.endDate,
            _that.budget,
            _that.imageUrl,
            _that.description,
            _that.travelersCount,
            _that.preferences);
      case _:
        return null;
    }
  }
}

/// @nodoc
@JsonSerializable()
class _Trip implements Trip {
  const _Trip(
      {required this.id,
      required this.destination,
      required this.startDate,
      required this.endDate,
      @JsonKey(readValue: _readBudget) this.budget = 0.0,
      this.imageUrl,
      this.description,
      @JsonKey(readValue: _readTravelers) this.travelersCount,
      List<String> preferences = const []})
      : _preferences = preferences;
  factory _Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);

  @override
  final String id;
  @override
  final String destination;
  @override
  final String startDate;
  @override
  final String endDate;
  @override
  @JsonKey(readValue: _readBudget)
  final double budget;
  @override
  final String? imageUrl;
  @override
  final String? description;
  @override
  @JsonKey(readValue: _readTravelers)
  final int? travelersCount;
  final List<String> _preferences;
  @override
  @JsonKey()
  List<String> get preferences {
    if (_preferences is EqualUnmodifiableListView) return _preferences;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_preferences);
  }

  /// Create a copy of Trip
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  @pragma('vm:prefer-inline')
  _$TripCopyWith<_Trip> get copyWith =>
      __$TripCopyWithImpl<_Trip>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$TripToJson(
      this,
    );
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _Trip &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.destination, destination) ||
                other.destination == destination) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.budget, budget) || other.budget == budget) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.travelersCount, travelersCount) ||
                other.travelersCount == travelersCount) &&
            const DeepCollectionEquality()
                .equals(other.preferences, _preferences));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode {
    return Object.hash(
        runtimeType,
        id,
        destination,
        startDate,
        endDate,
        budget,
        imageUrl,
        description,
        travelersCount,
        const DeepCollectionEquality().hash(_preferences));
  }

  @override
  String toString() {
    return 'Trip(id: $id, destination: $destination, startDate: $startDate, endDate: $endDate, budget: $budget, imageUrl: $imageUrl, description: $description, travelersCount: $travelersCount, preferences: $preferences)';
  }
}

/// @nodoc
abstract mixin class _$TripCopyWith<$Res> implements $TripCopyWith<$Res> {
  factory _$TripCopyWith(_Trip value, $Res Function(_Trip) _then) =
      __$TripCopyWithImpl;
  @override
  @useResult
  $Res call(
      {String id,
      String destination,
      String startDate,
      String endDate,
      @JsonKey(readValue: _readBudget) double budget,
      String? imageUrl,
      String? description,
      @JsonKey(readValue: _readTravelers) int? travelersCount,
      List<String> preferences});
}

/// @nodoc
class __$TripCopyWithImpl<$Res> implements _$TripCopyWith<$Res> {
  __$TripCopyWithImpl(this._self, this._then);

  final _Trip _self;
  final $Res Function(_Trip) _then;

  /// Create a copy of Trip
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $Res call({
    Object? id = null,
    Object? destination = null,
    Object? startDate = null,
    Object? endDate = null,
    Object? budget = null,
    Object? imageUrl = freezed,
    Object? description = freezed,
    Object? travelersCount = freezed,
    Object? preferences = null,
  }) {
    return _then(_Trip(
      id: null == id
          ? _self.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      destination: null == destination
          ? _self.destination
          : destination // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _self.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as String,
      endDate: null == endDate
          ? _self.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String,
      budget: null == budget
          ? _self.budget
          : budget // ignore: cast_nullable_to_non_nullable
              as double,
      imageUrl: freezed == imageUrl
          ? _self.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _self.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      travelersCount: freezed == travelersCount
          ? _self.travelersCount
          : travelersCount // ignore: cast_nullable_to_non_nullable
              as int?,
      preferences: null == preferences
          ? _self._preferences
          : preferences // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ));
  }
}

// dart format on
