import 'package:freezed_annotation/freezed_annotation.dart';

part 'chat_message.freezed.dart';
part 'chat_message.g.dart';

/// Chat message model
@freezed
abstract class ChatMessage with _$ChatMessage {
  const factory ChatMessage({
    required String id,
    required String content,
    required bool isUser,
    required DateTime timestamp,
    List<ChatSource>? sources,
    @Default(false) bool isStreaming,
  }) = _ChatMessage;

  factory ChatMessage.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageFromJson(json);
}

/// Chat source/citation model
@freezed
abstract class ChatSource with _$ChatSource {
  const factory ChatSource({
    required String id,
    required String title,
    String? url,
    String? excerpt,
  }) = _ChatSource;

  factory ChatSource.fromJson(Map<String, dynamic> json) =>
      _$ChatSourceFromJson(json);
}
