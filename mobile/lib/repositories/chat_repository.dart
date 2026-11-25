import 'package:travel_planner/models/chat_message.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

/// Repository for AI Q&A sessions and knowledge feedback
class ChatRepository {
  final ApiService _api;

  ChatRepository(this._api);

  Future<List<ChatSession>> getSessions({List<String>? guestIds}) async {
    final queryParams = <String, dynamic>{};
    if (guestIds != null && guestIds.isNotEmpty) {
      queryParams['guest_ids'] = guestIds.join(',');
    }
    final res = await _api.get<List<dynamic>>(
      AppConstants.chatSessions,
      queryParams: queryParams.isNotEmpty ? queryParams : null,
    );
    return res
        .map((e) => ChatSession.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<Map<String, dynamic>> getSessionDetail(String sessionId) async {
    return await _api.get<Map<String, dynamic>>(
      '${AppConstants.chatSessions}/$sessionId',
    );
  }

  Future<ChatSession> createSession({String? title}) async {
    final res = await _api.post<Map<String, dynamic>>(
      AppConstants.chatSessions,
      data: {if (title != null) 'title': title},
    );
    return ChatSession.fromJson(res);
  }

  Future<void> updateSessionTitle(String sessionId, String title) async {
    await _api.patch<dynamic>(
      '${AppConstants.chatSessions}/$sessionId',
      data: {'title': title},
    );
  }

  Future<void> deleteSession(String sessionId) async {
    await _api.delete('${AppConstants.chatSessions}/$sessionId');
  }

  Future<void> submitFeedback({
    String? sessionId,
    required String userQuestion,
    required String botAnswer,
    required String reason,
    String? userNote,
  }) async {
    await _api.post<dynamic>(
      AppConstants.chatFeedback,
      data: {
        if (sessionId != null) 'sessionId': sessionId,
        'userQuestion': userQuestion,
        'botAnswer': botAnswer,
        'reason': reason,
        if (userNote != null && userNote.trim().isNotEmpty)
          'userNote': userNote.trim(),
      },
    );
  }

  Future<Map<String, dynamic>> getSystemStatus() async {
    return await _api.get<Map<String, dynamic>>(AppConstants.chatStatus);
  }
}
