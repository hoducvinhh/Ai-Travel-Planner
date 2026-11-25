import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:travel_planner/models/direct_message.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/repositories/messages_repository.dart';
import 'package:travel_planner/services/providers.dart';
import 'package:travel_planner/services/socket_service.dart';

final messagesRepositoryProvider = Provider<MessagesRepository>((ref) {
  final api = ref.watch(apiServiceProvider);
  return MessagesRepository(api);
});

/// Global unread direct-messages count + Socket.IO lifecycle manager
class MessagingHubNotifier extends StateNotifier<int> {
  final SocketService _socketService;
  final MessagesRepository _repository;
  final AuthRepositoryAccessor _getToken;
  StreamSubscription<int>? _unreadSub;
  StreamSubscription<bool>? _connSub;

  MessagingHubNotifier(
    this._socketService,
    this._repository,
    this._getToken,
    bool isAuthenticated,
  ) : super(0) {
    _unreadSub = _socketService.unreadStream.listen((count) {
      if (mounted) state = count;
    });
    _connSub = _socketService.connectionStream.listen((connected) {
      if (connected) refreshUnreadCount();
    });
    if (isAuthenticated) {
      connect();
    } else {
      _socketService.disconnect();
    }
  }

  Future<void> connect() async {
    final token = await _getToken();
    if (token != null && token.isNotEmpty) {
      _socketService.connect(token);
      await refreshUnreadCount();
    }
  }

  Future<void> refreshUnreadCount() async {
    try {
      final count = await _repository.getUnreadCount();
      if (mounted) state = count;
    } catch (_) {}
  }

  @override
  void dispose() {
    _unreadSub?.cancel();
    _connSub?.cancel();
    super.dispose();
  }
}

typedef AuthRepositoryAccessor = Future<String?> Function();

final unreadMessagesCountProvider =
    StateNotifierProvider<MessagingHubNotifier, int>((ref) {
  final socketService = ref.watch(socketServiceProvider);
  final repository = ref.watch(messagesRepositoryProvider);
  final authRepo = ref.watch(authRepositoryProvider);
  final isAuthenticated = ref.watch(authProvider).maybeWhen(
        authenticated: (_) => true,
        orElse: () => false,
      );
  return MessagingHubNotifier(
    socketService,
    repository,
    authRepo.getStoredToken,
    isAuthenticated,
  );
});

/// Conversations inbox notifier
class ConversationsNotifier
    extends StateNotifier<AsyncValue<List<ConversationItem>>> {
  final MessagesRepository _repository;
  final SocketService _socketService;
  final String? _currentUserId;
  StreamSubscription<DirectMessageItem>? _msgSub;

  ConversationsNotifier(
    this._repository,
    this._socketService,
    this._currentUserId,
  ) : super(const AsyncValue.loading()) {
    loadConversations();
    _msgSub = _socketService.newMessageStream.listen(_onNewMessage);
  }

  Future<void> loadConversations() async {
    if (_currentUserId == null) {
      state = const AsyncValue.data([]);
      return;
    }
    try {
      final list = await _repository.getConversations();
      if (mounted) state = AsyncValue.data(list);
    } catch (e, st) {
      if (mounted) state = AsyncValue.error(e, st);
    }
  }

  void _onNewMessage(DirectMessageItem msg) {
    final current = state.valueOrNull;
    if (current == null) return;
    final idx = current.indexWhere((c) => c.id == msg.conversationId);
    if (idx == -1) {
      loadConversations();
      return;
    }
    final updated = List<ConversationItem>.from(current);
    final conv = updated.removeAt(idx);
    final newUnread = msg.senderId != _currentUserId
        ? conv.unreadCount + 1
        : conv.unreadCount;
    updated.insert(
      0,
      conv.copyWith(
        lastMessage: msg,
        lastMessageAt: msg.createdAt,
        unreadCount: newUnread,
      ),
    );
    state = AsyncValue.data(updated);
  }

  void markConversationReadLocally(String conversationId) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncValue.data(
      current
          .map((c) => c.id == conversationId ? c.copyWith(unreadCount: 0) : c)
          .toList(),
    );
  }

  @override
  void dispose() {
    _msgSub?.cancel();
    super.dispose();
  }
}

final conversationsProvider = StateNotifierProvider<ConversationsNotifier,
    AsyncValue<List<ConversationItem>>>((ref) {
  final repo = ref.watch(messagesRepositoryProvider);
  final socket = ref.watch(socketServiceProvider);
  final userId = ref.watch(authProvider).maybeWhen(
        authenticated: (u) => u.id,
        orElse: () => null,
      );
  return ConversationsNotifier(repo, socket, userId);
});

/// Active direct conversation chat state
class DirectChatState {
  final String conversationId;
  final ChatUser? partner;
  final List<DirectMessageItem> messages;
  final bool isLoading;
  final bool partnerTyping;
  final String? error;

  const DirectChatState({
    required this.conversationId,
    this.partner,
    this.messages = const [],
    this.isLoading = true,
    this.partnerTyping = false,
    this.error,
  });

  DirectChatState copyWith({
    ChatUser? partner,
    List<DirectMessageItem>? messages,
    bool? isLoading,
    bool? partnerTyping,
    String? error,
  }) {
    return DirectChatState(
      conversationId: conversationId,
      partner: partner ?? this.partner,
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      partnerTyping: partnerTyping ?? this.partnerTyping,
      error: error,
    );
  }
}

class DirectChatNotifier extends StateNotifier<DirectChatState> {
  final MessagesRepository _repository;
  final SocketService _socketService;
  final String? _currentUserId;
  final Ref _ref;
  StreamSubscription<DirectMessageItem>? _msgSub;
  StreamSubscription<TypingEvent>? _typingSub;
  Timer? _typingTimer;

  DirectChatNotifier(
    this._repository,
    this._socketService,
    this._currentUserId,
    this._ref,
    String conversationId,
  ) : super(DirectChatState(conversationId: conversationId)) {
    _init();
  }

  Future<void> _init() async {
    _socketService.joinConversation(state.conversationId);
    _socketService.markConversationRead(state.conversationId);
    _ref
        .read(conversationsProvider.notifier)
        .markConversationReadLocally(state.conversationId);

    _msgSub = _socketService.newMessageStream.listen((msg) {
      if (msg.conversationId != state.conversationId) return;
      final existing = state.messages;
      if (existing.any((m) => m.id == msg.id)) return;

      if (msg.senderId == _currentUserId) {
        final tempIdx = existing.indexWhere(
          (m) => m.id.startsWith('temp-') && m.content == msg.content,
        );
        if (tempIdx != -1) {
          final updated = List<DirectMessageItem>.from(existing);
          updated[tempIdx] = msg;
          state = state.copyWith(messages: updated);
          return;
        }
      }

      state = state.copyWith(messages: [...existing, msg]);
      _socketService.markConversationRead(state.conversationId);
      _ref.read(unreadMessagesCountProvider.notifier).refreshUnreadCount();
    });

    _typingSub = _socketService.typingStream.listen((event) {
      if (event.userId == state.partner?.id) {
        state = state.copyWith(partnerTyping: event.isTyping);
      }
    });

    await loadMessages();
  }

  Future<void> loadMessages() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final data =
          await _repository.getConversationMessages(state.conversationId);
      final rawMsgs = data['messages'] as List<dynamic>? ?? [];
      final msgs = rawMsgs
          .map((e) =>
              DirectMessageItem.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
      final partner = data['partner'] is Map
          ? ChatUser.fromJson(Map<String, dynamic>.from(data['partner'] as Map))
          : null;
      if (!mounted) return;
      state = state.copyWith(
        messages: msgs,
        partner: partner,
        isLoading: false,
      );
      await _repository.markConversationRead(state.conversationId);
      _ref.read(unreadMessagesCountProvider.notifier).refreshUnreadCount();
    } catch (e) {
      if (!mounted) return;
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void onTypingChanged(String text) {
    _socketService.sendTyping(state.conversationId, true);
    _typingTimer?.cancel();
    _typingTimer = Timer(const Duration(milliseconds: 1500), () {
      _socketService.sendTyping(state.conversationId, false);
    });
  }

  void sendMessage(String text) {
    final trimmed = text.trim();
    if (trimmed.isEmpty || _currentUserId == null) return;

    _socketService.sendMessage(state.conversationId, trimmed);
    _socketService.sendTyping(state.conversationId, false);

    final temp = DirectMessageItem(
      id: 'temp-${DateTime.now().millisecondsSinceEpoch}',
      conversationId: state.conversationId,
      senderId: _currentUserId,
      content: trimmed,
      isRead: false,
      createdAt: DateTime.now().toIso8601String(),
    );
    state = state.copyWith(messages: [...state.messages, temp]);
  }

  @override
  void dispose() {
    _typingTimer?.cancel();
    _msgSub?.cancel();
    _typingSub?.cancel();
    _socketService.leaveConversation(state.conversationId);
    super.dispose();
  }
}

final directChatProvider = StateNotifierProvider.autoDispose
    .family<DirectChatNotifier, DirectChatState, String>((ref, conversationId) {
  final repo = ref.watch(messagesRepositoryProvider);
  final socket = ref.watch(socketServiceProvider);
  final userId = ref.watch(authProvider).maybeWhen(
        authenticated: (u) => u.id,
        orElse: () => null,
      );
  return DirectChatNotifier(repo, socket, userId, ref, conversationId);
});
