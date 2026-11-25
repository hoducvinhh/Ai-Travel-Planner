import 'package:freezed_annotation/freezed_annotation.dart';

part 'chat_message.freezed.dart';
part 'chat_message.g.dart';

Object? _readExcerpt(Map<dynamic, dynamic> json, String key) {
  return json['content'] ?? json['excerpt'];
}

Object? _readSessionMsgCount(Map<dynamic, dynamic> json, String key) {
  if (json['_count'] is Map && json['_count']['messages'] is num) {
    return (json['_count']['messages'] as num).toInt();
  }
  return json['messageCount'] ?? 0;
}

/// Chat message model
@freezed
abstract class ChatMessage with _$ChatMessage {
  const factory ChatMessage({
    required String id,
    required String content,
    required bool isUser,
    required DateTime timestamp,
    String? mode, // 'internal' | 'live_web'
    List<ChatSource>? sources,
    List<WebSourceCitation>? webSources,
    String? disclaimer,
    String? routerReason,
    @Default(false) bool isStreaming,
  }) = _ChatMessage;

  factory ChatMessage.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageFromJson(json);
}

/// Chat source/citation model (DB RAG chunk)
@freezed
abstract class ChatSource with _$ChatSource {
  const factory ChatSource({
    @Default('') String id,
    @JsonKey(name: 'chunk_type') String? chunkType,
    required String title,
    String? url,
    @JsonKey(readValue: _readExcerpt) String? excerpt,
    @Default(0.0) double similarity,
  }) = _ChatSource;

  factory ChatSource.fromJson(Map<String, dynamic> json) =>
      _$ChatSourceFromJson(json);
}

/// Web grounding source citation
@freezed
abstract class WebSourceCitation with _$WebSourceCitation {
  const factory WebSourceCitation({
    required String title,
    required String url,
    String? domain,
  }) = _WebSourceCitation;

  factory WebSourceCitation.fromJson(Map<String, dynamic> json) =>
      _$WebSourceCitationFromJson(json);
}

/// Chat session summary
@freezed
abstract class ChatSession with _$ChatSession {
  const factory ChatSession({
    required String id,
    @Default('Đoạn chat mới') String title,
    String? userId,
    required DateTime createdAt,
    required DateTime updatedAt,
    @JsonKey(readValue: _readSessionMsgCount) @Default(0) int messageCount,
  }) = _ChatSession;

  factory ChatSession.fromJson(Map<String, dynamic> json) =>
      _$ChatSessionFromJson(json);
}
