import 'package:freezed_annotation/freezed_annotation.dart';

part 'direct_message.freezed.dart';
part 'direct_message.g.dart';

/// Direct chat participant
@freezed
abstract class ChatUser with _$ChatUser {
  const ChatUser._();

  const factory ChatUser({
    required String id,
    String? name,
    @Default('') String email,
    @Default([]) List<String> preferredStyles,
    String? budgetLevel,
  }) = _ChatUser;

  factory ChatUser.fromJson(Map<String, dynamic> json) =>
      _$ChatUserFromJson(json);

  String get displayName =>
      (name != null && name!.isNotEmpty) ? name! : email.split('@').first;
}

/// Single 1-1 message
@freezed
abstract class DirectMessageItem with _$DirectMessageItem {
  const factory DirectMessageItem({
    required String id,
    required String conversationId,
    required String senderId,
    required String content,
    @Default(false) bool isRead,
    required String createdAt,
    ChatUser? sender,
  }) = _DirectMessageItem;

  factory DirectMessageItem.fromJson(Map<String, dynamic> json) =>
      _$DirectMessageItemFromJson(json);
}

/// Conversation summary in inbox list
@freezed
abstract class ConversationItem with _$ConversationItem {
  const factory ConversationItem({
    required String id,
    required ChatUser partner,
    DirectMessageItem? lastMessage,
    @Default(0) int unreadCount,
    required String lastMessageAt,
  }) = _ConversationItem;

  factory ConversationItem.fromJson(Map<String, dynamic> json) =>
      _$ConversationItemFromJson(json);
}
