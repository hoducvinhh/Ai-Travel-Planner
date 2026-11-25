// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'community_post.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CommunityUserInfo _$CommunityUserInfoFromJson(Map<String, dynamic> json) =>
    _CommunityUserInfo(
      id: json['id'] as String,
      name: json['name'] as String?,
      email: json['email'] as String? ?? '',
      preferredStyles:
          (json['preferredStyles'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      budgetLevel: json['budgetLevel'] as String?,
    );

Map<String, dynamic> _$CommunityUserInfoToJson(_CommunityUserInfo instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'preferredStyles': instance.preferredStyles,
      'budgetLevel': instance.budgetLevel,
    };

_CommunityTripPlaceSummary _$CommunityTripPlaceSummaryFromJson(
  Map<String, dynamic> json,
) => _CommunityTripPlaceSummary(
  id: json['id'] as String,
  name: json['name'] as String,
  imageUrl: json['imageUrl'] as String?,
  province: json['province'] as String?,
);

Map<String, dynamic> _$CommunityTripPlaceSummaryToJson(
  _CommunityTripPlaceSummary instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'imageUrl': instance.imageUrl,
  'province': instance.province,
};

_CommunityTripPlaceWrapper _$CommunityTripPlaceWrapperFromJson(
  Map<String, dynamic> json,
) => _CommunityTripPlaceWrapper(
  place: CommunityTripPlaceSummary.fromJson(
    json['place'] as Map<String, dynamic>,
  ),
);

Map<String, dynamic> _$CommunityTripPlaceWrapperToJson(
  _CommunityTripPlaceWrapper instance,
) => <String, dynamic>{'place': instance.place};

_CommunityAttachedTrip _$CommunityAttachedTripFromJson(
  Map<String, dynamic> json,
) => _CommunityAttachedTrip(
  id: json['id'] as String,
  destination: json['destination'] as String,
  startDate: json['startDate'] as String,
  endDate: json['endDate'] as String,
  budgetPerPerson: (json['budgetPerPerson'] as num?)?.toDouble() ?? 0.0,
  groupSize: (json['groupSize'] as num?)?.toInt() ?? 1,
  status: json['status'] as String? ?? 'DRAFT',
  places: (json['places'] as List<dynamic>?)
      ?.map(
        (e) => CommunityTripPlaceWrapper.fromJson(e as Map<String, dynamic>),
      )
      .toList(),
);

Map<String, dynamic> _$CommunityAttachedTripToJson(
  _CommunityAttachedTrip instance,
) => <String, dynamic>{
  'id': instance.id,
  'destination': instance.destination,
  'startDate': instance.startDate,
  'endDate': instance.endDate,
  'budgetPerPerson': instance.budgetPerPerson,
  'groupSize': instance.groupSize,
  'status': instance.status,
  'places': instance.places,
};

_Comment _$CommentFromJson(Map<String, dynamic> json) => _Comment(
  id: json['id'] as String,
  content: json['content'] as String,
  userId: _readCommentUserId(json, 'userId') as String? ?? '',
  userName: _readCommentUserName(json, 'userName') as String? ?? 'Người dùng',
  createdAt: DateTime.parse(json['createdAt'] as String),
  user: json['user'] == null
      ? null
      : CommunityUserInfo.fromJson(json['user'] as Map<String, dynamic>),
  likesCount: (json['likesCount'] as num?)?.toInt() ?? 0,
  isLiked: json['isLiked'] as bool? ?? false,
);

Map<String, dynamic> _$CommentToJson(_Comment instance) => <String, dynamic>{
  'id': instance.id,
  'content': instance.content,
  'userId': instance.userId,
  'userName': instance.userName,
  'createdAt': instance.createdAt.toIso8601String(),
  'user': instance.user,
  'likesCount': instance.likesCount,
  'isLiked': instance.isLiked,
};

_CommunityPost _$CommunityPostFromJson(Map<String, dynamic> json) =>
    _CommunityPost(
      id: json['id'] as String,
      userId: json['userId'] as String,
      title: json['title'] as String? ?? '',
      content: json['content'] as String,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
          const [],
      images:
          (_readPostImages(json, 'images') as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      tripId: json['tripId'] as String?,
      trip: json['trip'] == null
          ? null
          : CommunityAttachedTrip.fromJson(
              json['trip'] as Map<String, dynamic>,
            ),
      likesCount: (json['likesCount'] as num?)?.toInt() ?? 0,
      commentsCount: (json['commentsCount'] as num?)?.toInt() ?? 0,
      isLiked: json['isLiked'] as bool? ?? false,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      user: json['user'] == null
          ? null
          : CommunityUserInfo.fromJson(json['user'] as Map<String, dynamic>),
      recentComments:
          (json['recentComments'] as List<dynamic>?)
              ?.map((e) => Comment.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$CommunityPostToJson(_CommunityPost instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'content': instance.content,
      'tags': instance.tags,
      'images': instance.images,
      'tripId': instance.tripId,
      'trip': instance.trip,
      'likesCount': instance.likesCount,
      'commentsCount': instance.commentsCount,
      'isLiked': instance.isLiked,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'user': instance.user,
      'recentComments': instance.recentComments,
    };

_TravelBuddy _$TravelBuddyFromJson(Map<String, dynamic> json) => _TravelBuddy(
  id: json['id'] as String,
  name: json['name'] as String? ?? '',
  email: json['email'] as String? ?? '',
  preferredStyles:
      (json['preferredStyles'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList() ??
      const [],
  budgetLevel: json['budgetLevel'] as String?,
  mutualStyles:
      (json['mutualStyles'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList() ??
      const [],
  sameBudget: json['sameBudget'] as bool? ?? false,
  matchScore: (json['matchScore'] as num?)?.toDouble() ?? 0.0,
  tripsCount: (json['tripsCount'] as num?)?.toInt() ?? 0,
  postsCount: (json['postsCount'] as num?)?.toInt() ?? 0,
);

Map<String, dynamic> _$TravelBuddyToJson(_TravelBuddy instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'preferredStyles': instance.preferredStyles,
      'budgetLevel': instance.budgetLevel,
      'mutualStyles': instance.mutualStyles,
      'sameBudget': instance.sameBudget,
      'matchScore': instance.matchScore,
      'tripsCount': instance.tripsCount,
      'postsCount': instance.postsCount,
    };
