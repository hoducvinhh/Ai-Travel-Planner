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
  sources: (json['sources'] as List<dynamic>?)
      ?.map((e) => ChatSource.fromJson(e as Map<String, dynamic>))
      .toList(),
  isStreaming: json['isStreaming'] as bool? ?? false,
);

Map<String, dynamic> _$ChatMessageToJson(_ChatMessage instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'isUser': instance.isUser,
      'timestamp': instance.timestamp.toIso8601String(),
      'sources': instance.sources,
      'isStreaming': instance.isStreaming,
    };

_ChatSource _$ChatSourceFromJson(Map<String, dynamic> json) => _ChatSource(
  id: json['id'] as String,
  title: json['title'] as String,
  url: json['url'] as String?,
  excerpt: json['excerpt'] as String?,
);

Map<String, dynamic> _$ChatSourceToJson(_ChatSource instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'url': instance.url,
      'excerpt': instance.excerpt,
    };
