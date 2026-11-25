import 'package:travel_planner/models/direct_message.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Repository for 1-1 Direct Messaging REST endpoints
class MessagesRepository {
  final ApiService _api;

  MessagesRepository(this._api);

  Future<List<ConversationItem>> getConversations() async {
    final response = await _api.get<List<dynamic>>(
      AppConstants.messagesConversations,
    );
    return response
        .map((e) => ConversationItem.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<Map<String, dynamic>> getOrCreateConversation(String targetUserId) async {
    return await _api.post<Map<String, dynamic>>(
      AppConstants.messagesConversations,
      data: {'targetUserId': targetUserId},
    );
  }

  Future<Map<String, dynamic>> getConversationMessages(String conversationId) async {
    return await _api.get<Map<String, dynamic>>(
      '${AppConstants.messagesConversations}/$conversationId/messages',
    );
  }

  Future<void> markConversationRead(String conversationId) async {
    await _api.post<dynamic>(
      '${AppConstants.messagesConversations}/$conversationId/read',
    );
  }

  Future<int> getUnreadCount() async {
    final res = await _api.get<Map<String, dynamic>>(
      AppConstants.messagesUnreadCount,
    );
    return (res['unreadCount'] as num?)?.toInt() ?? 0;
  }
}
