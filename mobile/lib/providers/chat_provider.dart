import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/chat_message.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/repositories/chat_repository.dart';
import 'package:travel_planner/services/providers.dart';
import 'package:travel_planner/services/storage_service.dart';
import 'package:travel_planner/services/stream_service.dart';

const String _guestSessionsKey = 'vietnam_travel_rag_guest_sessions';

final chatRepositoryProvider = Provider<ChatRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return ChatRepository(api);
});

final streamServiceProvider = Provider<StreamService>((ref) {
  return StreamService();
});

/// Chat state
class ChatState {
  final List<ChatMessage> messages;
  final List<ChatSession> sessions;
  final String? sessionId;
  final bool isStreaming;
  final bool isLoadingSessions;
  final bool isLoadingHistory;
  final String? error;

  const ChatState({
    this.messages = const [],
    this.sessions = const [],
    this.sessionId,
    this.isStreaming = false,
    this.isLoadingSessions = false,
    this.isLoadingHistory = false,
    this.error,
  });

  ChatState copyWith({
    List<ChatMessage>? messages,
    List<ChatSession>? sessions,
    String? sessionId,
    bool clearSessionId = false,
    bool? isStreaming,
    bool? isLoadingSessions,
    bool? isLoadingHistory,
    String? error,
    bool clearError = false,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      sessions: sessions ?? this.sessions,
      sessionId: clearSessionId ? null : (sessionId ?? this.sessionId),
      isStreaming: isStreaming ?? this.isStreaming,
      isLoadingSessions: isLoadingSessions ?? this.isLoadingSessions,
      isLoadingHistory: isLoadingHistory ?? this.isLoadingHistory,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Chat notifier with fixed backend SSE parsing and multi-session management
class ChatNotifier extends StateNotifier<ChatState> {
  final StreamService _streamService;
  final ChatRepository _chatRepository;
  final StorageService _storage;
  final bool _isAuthenticated;

  ChatNotifier(
    this._streamService,
    this._chatRepository,
    this._storage,
    this._isAuthenticated,
  ) : super(const ChatState()) {
    loadSessions();
  }

  Future<List<String>> _getGuestSessionIds() async {
    await _storage.init();
    final raw = _storage.getString(_guestSessionsKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final list = json.decode(raw) as List<dynamic>;
      return list.map((e) => e.toString()).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> _saveGuestSessionId(String id) async {
    final current = await _getGuestSessionIds();
    if (!current.contains(id)) {
      await _storage.saveString(
        _guestSessionsKey,
        json.encode([id, ...current]),
      );
    }
  }

  Future<void> _removeGuestSessionId(String id) async {
    final current = await _getGuestSessionIds();
    final updated = current.where((item) => item != id).toList();
    await _storage.saveString(_guestSessionsKey, json.encode(updated));
  }

  Future<void> loadSessions() async {
    state = state.copyWith(isLoadingSessions: true);
    try {
      final guestIds = _isAuthenticated ? null : await _getGuestSessionIds();
      if (!_isAuthenticated && (guestIds == null || guestIds.isEmpty)) {
        if (mounted) {
          state = state.copyWith(sessions: [], isLoadingSessions: false);
        }
        return;
      }
      final sessions = await _chatRepository.getSessions(guestIds: guestIds);
      if (!mounted) return;
      state = state.copyWith(sessions: sessions, isLoadingSessions: false);
    } catch (_) {
      if (!mounted) return;
      state = state.copyWith(isLoadingSessions: false);
    }
  }

  Future<void> selectSession(String sessionId) async {
    if (sessionId == state.sessionId) return;
    state = state.copyWith(isLoadingHistory: true, clearError: true);
    try {
      final detail = await _chatRepository.getSessionDetail(sessionId);
      final rawMessages = detail['messages'] as List<dynamic>? ?? [];
      final mapped = rawMessages.map((m) {
        final map = Map<String, dynamic>.from(m as Map);
        final meta = map['metadata'] is Map
            ? Map<String, dynamic>.from(map['metadata'] as Map)
            : <String, dynamic>{};

        final rawSources = meta['sources'] as List<dynamic>?;
        final sources = rawSources
            ?.map((s) => ChatSource.fromJson(Map<String, dynamic>.from(s as Map)))
            .toList();

        final rawWeb = meta['webSources'] as List<dynamic>?;
        final webSources = rawWeb
            ?.map((s) => WebSourceCitation.fromJson(Map<String, dynamic>.from(s as Map)))
            .toList();

        return ChatMessage(
          id: map['id'].toString(),
          content: map['content']?.toString() ?? '',
          isUser: map['role']?.toString().toLowerCase() == 'user',
          timestamp: DateTime.tryParse(map['createdAt']?.toString() ?? '') ??
              DateTime.now(),
          mode: meta['mode']?.toString(),
          sources: sources,
          webSources: webSources,
          disclaimer: meta['disclaimer']?.toString(),
        );
      }).toList();

      if (!mounted) return;
      state = state.copyWith(
        sessionId: sessionId,
        messages: mapped,
        isLoadingHistory: false,
      );
    } catch (e) {
      if (!mounted) return;
      state = state.copyWith(
        isLoadingHistory: false,
        error: 'Không thể tải lịch sử hội thoại',
      );
    }
  }

  void startNewChat() {
    state = state.copyWith(
      clearSessionId: true,
      messages: [],
      clearError: true,
    );
  }

  Future<void> updateSessionTitle(String sessionId, String newTitle) async {
    final trimmed = newTitle.trim();
    if (trimmed.isEmpty) return;
    if (_isAuthenticated) {
      await _chatRepository.updateSessionTitle(sessionId, trimmed);
    }
    state = state.copyWith(
      sessions: state.sessions
          .map((s) => s.id == sessionId ? s.copyWith(title: trimmed) : s)
          .toList(),
    );
  }

  Future<void> deleteSession(String sessionId) async {
    if (_isAuthenticated) {
      await _chatRepository.deleteSession(sessionId);
    } else {
      await _removeGuestSessionId(sessionId);
    }
    final remaining = state.sessions.where((s) => s.id != sessionId).toList();
    if (state.sessionId == sessionId) {
      state = state.copyWith(
        sessions: remaining,
        clearSessionId: true,
        messages: [],
      );
    } else {
      state = state.copyWith(sessions: remaining);
    }
  }

  Future<void> sendMessage(String content) async {
    final query = content.trim();
    if (query.isEmpty || state.isStreaming) return;

    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: query,
      isUser: true,
      timestamp: DateTime.now(),
    );

    final aiMessageId =
        (DateTime.now().millisecondsSinceEpoch + 1).toString();
    final aiPlaceholder = ChatMessage(
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: DateTime.now(),
      isStreaming: true,
    );

    state = state.copyWith(
      messages: [...state.messages, userMessage, aiPlaceholder],
      isStreaming: true,
      clearError: true,
    );

    try {
      final token = await _storage.getToken();
      String accumulatedContent = '';
      List<ChatSource>? sources;
      List<WebSourceCitation>? webSources;
      String? mode;
      String? disclaimer;
      String? routerReason;

      await for (final event in _streamService.streamChat(
        message: query,
        sessionId: state.sessionId,
        token: token,
      )) {
        final type = event['type'] as String?;
        final data = event['data'];

        if (type == 'session_info' && data is Map) {
          final newSessionId = data['sessionId']?.toString();
          final isNew = data['isNew'] == true;
          if (newSessionId != null && newSessionId.isNotEmpty) {
            state = state.copyWith(sessionId: newSessionId);
            if (isNew) {
              if (!_isAuthenticated) {
                await _saveGuestSessionId(newSessionId);
              }
              loadSessions();
            }
          }
        } else if (type == 'routing' && data is Map) {
          mode = data['mode']?.toString();
          disclaimer = data['disclaimer']?.toString();
          routerReason = data['reason']?.toString();
          _updateAiMessage(
            aiMessageId,
            content: accumulatedContent,
            mode: mode,
            sources: sources,
            webSources: webSources,
            disclaimer: disclaimer,
            routerReason: routerReason,
            isStreaming: true,
          );
        } else if (type == 'sources') {
          if (data is List) {
            sources = data
                .map((s) => ChatSource.fromJson(Map<String, dynamic>.from(s as Map)))
                .toList();
          } else if (data is Map) {
            final map = Map<String, dynamic>.from(data);
            mode = map['mode']?.toString() ?? mode;
            if (map.containsKey('disclaimer')) {
              disclaimer = map['disclaimer']?.toString();
            }
            if (map['items'] is List && (map['items'] as List).isNotEmpty) {
              sources = (map['items'] as List)
                  .map((s) => ChatSource.fromJson(Map<String, dynamic>.from(s as Map)))
                  .toList();
            }
            if (map['webSources'] is List &&
                (map['webSources'] as List).isNotEmpty) {
              webSources = (map['webSources'] as List)
                  .map((s) => WebSourceCitation.fromJson(
                      Map<String, dynamic>.from(s as Map)))
                  .toList();
            }
          }
          _updateAiMessage(
            aiMessageId,
            content: accumulatedContent,
            mode: mode,
            sources: sources,
            webSources: webSources,
            disclaimer: disclaimer,
            routerReason: routerReason,
            isStreaming: true,
          );
        } else if (type == 'token') {
          final tokenText = data?.toString() ?? '';
          if (tokenText.isNotEmpty) {
            accumulatedContent += tokenText;
            _updateAiMessage(
              aiMessageId,
              content: accumulatedContent,
              mode: mode,
              sources: sources,
              webSources: webSources,
              disclaimer: disclaimer,
              routerReason: routerReason,
              isStreaming: true,
            );
          }
        } else if (type == 'content_update') {
          accumulatedContent = data?.toString() ?? accumulatedContent;
          _updateAiMessage(
            aiMessageId,
            content: accumulatedContent,
            mode: mode,
            sources: sources,
            webSources: webSources,
            disclaimer: disclaimer,
            routerReason: routerReason,
            isStreaming: true,
          );
        } else if (type == 'done') {
          _updateAiMessage(
            aiMessageId,
            content: accumulatedContent,
            mode: mode,
            sources: sources,
            webSources: webSources,
            disclaimer: disclaimer,
            routerReason: routerReason,
            isStreaming: false,
          );
          state = state.copyWith(isStreaming: false);
          loadSessions();
        } else if (type == 'error') {
          final errorMsg = data?.toString() ?? 'Không thể lấy phản hồi';
          accumulatedContent = '$accumulatedContent\n\n*(Thông báo: $errorMsg)*';
          _updateAiMessage(
            aiMessageId,
            content: accumulatedContent,
            mode: mode,
            sources: sources,
            webSources: webSources,
            disclaimer: disclaimer,
            routerReason: routerReason,
            isStreaming: false,
          );
          state = state.copyWith(error: errorMsg, isStreaming: false);
        }
      }

      if (state.isStreaming) {
        _updateAiMessage(
          aiMessageId,
          content: accumulatedContent,
          mode: mode,
          sources: sources,
          webSources: webSources,
          disclaimer: disclaimer,
          routerReason: routerReason,
          isStreaming: false,
        );
        state = state.copyWith(isStreaming: false);
      }
    } catch (e) {
      _updateAiMessage(
        aiMessageId,
        content:
            'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.',
        isStreaming: false,
      );
      state = state.copyWith(error: e.toString(), isStreaming: false);
    }
  }

  Future<void> submitFeedback({
    required String userQuestion,
    required String botAnswer,
    required String reason,
    String? userNote,
  }) async {
    await _chatRepository.submitFeedback(
      sessionId: state.sessionId,
      userQuestion: userQuestion,
      botAnswer: botAnswer,
      reason: reason,
      userNote: userNote,
    );
  }

  void _updateAiMessage(
    String messageId, {
    required String content,
    String? mode,
    List<ChatSource>? sources,
    List<WebSourceCitation>? webSources,
    String? disclaimer,
    String? routerReason,
    required bool isStreaming,
  }) {
    final updatedMessages = state.messages.map((msg) {
      if (msg.id == messageId) {
        return msg.copyWith(
          content: content,
          mode: mode,
          sources: sources,
          webSources: webSources,
          disclaimer: disclaimer,
          routerReason: routerReason,
          isStreaming: isStreaming,
        );
      }
      return msg;
    }).toList();

    state = state.copyWith(messages: updatedMessages);
  }

  void clearError() {
    state = state.copyWith(clearError: true);
  }

  void clearMessages() {
    startNewChat();
  }

  @override
  void dispose() {
    _streamService.dispose();
    super.dispose();
  }
}

final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  final streamService = ref.watch(streamServiceProvider);
  final chatRepository = ref.watch(chatRepositoryProvider);
  final storage = ref.watch(storageServiceProvider);
  final isAuthenticated = ref.watch(authProvider).maybeWhen(
        authenticated: (_) => true,
        orElse: () => false,
      );
  return ChatNotifier(streamService, chatRepository, storage, isAuthenticated);
});
