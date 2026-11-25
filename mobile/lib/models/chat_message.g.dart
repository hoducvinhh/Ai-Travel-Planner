// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_message.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ChatMessage _$ChatMessageFromJson(Map<String, dynamic> json) => _ChatMessage(
  id: json['id'] as String,
  content: json['content'] as String,
  isUser: json['isUser'] as bool,
  timestamp: DateTime.parse(json['timestamp'] as String),
  mode: json['mode'] as String?,
  sources: (json['sources'] as List<dynamic>?)
      ?.map((e) => ChatSource.fromJson(e as Map<String, dynamic>))
      .toList(),
  webSources: (json['webSources'] as List<dynamic>?)
      ?.map((e) => WebSourceCitation.fromJson(e as Map<String, dynamic>))
      .toList(),
  disclaimer: json['disclaimer'] as String?,
  routerReason: json['routerReason'] as String?,
  isStreaming: json['isStreaming'] as bool? ?? false,
);

Map<String, dynamic> _$ChatMessageToJson(_ChatMessage instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'isUser': instance.isUser,
      'timestamp': instance.timestamp.toIso8601String(),
      'mode': instance.mode,
      'sources': instance.sources,
      'webSources': instance.webSources,
      'disclaimer': instance.disclaimer,
      'routerReason': instance.routerReason,
      'isStreaming': instance.isStreaming,
    };

_ChatSource _$ChatSourceFromJson(Map<String, dynamic> json) => _ChatSource(
  id: json['id'] as String? ?? '',
  chunkType: json['chunk_type'] as String?,
  title: json['title'] as String,
  url: json['url'] as String?,
  excerpt: _readExcerpt(json, 'excerpt') as String?,
  similarity: (json['similarity'] as num?)?.toDouble() ?? 0.0,
);

Map<String, dynamic> _$ChatSourceToJson(_ChatSource instance) =>
    <String, dynamic>{
      'id': instance.id,
      'chunk_type': instance.chunkType,
      'title': instance.title,
      'url': instance.url,
      'excerpt': instance.excerpt,
      'similarity': instance.similarity,
    };

_WebSourceCitation _$WebSourceCitationFromJson(Map<String, dynamic> json) =>
    _WebSourceCitation(
      title: json['title'] as String,
      url: json['url'] as String,
      domain: json['domain'] as String?,
    );

Map<String, dynamic> _$WebSourceCitationToJson(_WebSourceCitation instance) =>
    <String, dynamic>{
      'title': instance.title,
      'url': instance.url,
      'domain': instance.domain,
    };

_ChatSession _$ChatSessionFromJson(Map<String, dynamic> json) => _ChatSession(
  id: json['id'] as String,
  title: json['title'] as String? ?? 'Đoạn chat mới',
  userId: json['userId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  messageCount:
      (_readSessionMsgCount(json, 'messageCount') as num?)?.toInt() ?? 0,
);

Map<String, dynamic> _$ChatSessionToJson(_ChatSession instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'userId': instance.userId,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'messageCount': instance.messageCount,
    };
