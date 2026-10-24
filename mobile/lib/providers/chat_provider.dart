import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/chat_message.dart';
import 'package:travel_planner/services/stream_service.dart';
import 'package:travel_planner/services/storage_service.dart';

/// Chat state
class ChatState {
  final List<ChatMessage> messages;
  final String? sessionId;
  final bool isStreaming;
  final String? error;

  ChatState({
    this.messages = const [],
    this.sessionId,
    this.isStreaming = false,
    this.error,
  });

  ChatState copyWith({
    List<ChatMessage>? messages,
    String? sessionId,
    bool? isStreaming,
    String? error,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      sessionId: sessionId ?? this.sessionId,
      isStreaming: isStreaming ?? this.isStreaming,
      error: error,
    );
  }
}

/// Chat notifier
class ChatNotifier extends StateNotifier<ChatState> {
  final StreamService _streamService;
  final StorageService _storage;

  ChatNotifier(this._streamService, this._storage) : super(ChatState());

  Future<void> sendMessage(String content) async {
    if (content.trim().isEmpty) return;

    // Add user message
    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: content,
      isUser: true,
      timestamp: DateTime.now(),
    );

    state = state.copyWith(
      messages: [...state.messages, userMessage],
      isStreaming: true,
      error: null,
    );

    // Create AI message placeholder
    final aiMessageId = (DateTime.now().millisecondsSinceEpoch + 1).toString();
    final aiMessage = ChatMessage(
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: DateTime.now(),
      isStreaming: true,
    );

    state = state.copyWith(
      messages: [...state.messages, aiMessage],
    );

    try {
      final token = await _storage.read('auth_token') ?? '';
      String accumulatedContent = '';
      List<ChatSource>? sources;

      await for (final event in _streamService.streamChat(
        message: content,
        sessionId: state.sessionId,
        token: token,
      )) {
        final type = event['type'] as String?;

        if (type == 'session_info') {
          // Update session ID
          final newSessionId = event['sessionId'] as String?;
          if (newSessionId != null) {
            state = state.copyWith(sessionId: newSessionId);
          }
        } else if (type == 'sources') {
          // Update sources
          final sourcesData = event['sources'] as List?;
          if (sourcesData != null) {
            sources = sourcesData
                .map((s) => ChatSource.fromJson(s as Map<String, dynamic>))
                .toList();
          }
        } else if (type == 'token') {
          // Append token
          final token = event['token'] as String?;
          if (token != null) {
            accumulatedContent += token;
            _updateAiMessage(aiMessageId, accumulatedContent, sources, true);
          }
        } else if (type == 'done') {
          // Finalize message
          _updateAiMessage(aiMessageId, accumulatedContent, sources, false);
          state = state.copyWith(isStreaming: false);
        } else if (type == 'error') {
          // Handle error
          final errorMsg = event['message'] as String? ?? 'Unknown error';
          state = state.copyWith(
            error: errorMsg,
            isStreaming: false,
          );
        }
      }
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isStreaming: false,
      );
    }
  }

  void _updateAiMessage(
    String messageId,
    String content,
    List<ChatSource>? sources,
    bool isStreaming,
  ) {
    final updatedMessages = state.messages.map((msg) {
      if (msg.id == messageId) {
        return ChatMessage(
          id: msg.id,
          content: content,
          isUser: msg.isUser,
          timestamp: msg.timestamp,
          sources: sources,
          isStreaming: isStreaming,
        );
      }
      return msg;
    }).toList();

    state = state.copyWith(messages: updatedMessages);
  }

  void clearMessages() {
    state = ChatState();
  }

  @override
  void dispose() {
    _streamService.dispose();
    super.dispose();
  }
}

/// Stream service provider
final streamServiceProvider = Provider<StreamService>((ref) {
  return StreamService();
});

/// Chat provider
final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  final streamService = ref.watch(streamServiceProvider);
  final storage = StorageService();
  return ChatNotifier(streamService, storage);
});
