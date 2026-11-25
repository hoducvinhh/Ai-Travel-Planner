import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:travel_planner/config/env.dart';
import 'package:travel_planner/models/direct_message.dart';

class TypingEvent {
  final String userId;
  final bool isTyping;

  const TypingEvent({required this.userId, required this.isTyping});
}

/// Real-time Socket.IO client connecting to NestJS MessagesGateway
class SocketService {
  io.Socket? _socket;
  bool _isConnected = false;

  final _connectionController = StreamController<bool>.broadcast();
  final _unreadController = StreamController<int>.broadcast();
  final _newMessageController = StreamController<DirectMessageItem>.broadcast();
  final _typingController = StreamController<TypingEvent>.broadcast();

  bool get isConnected => _isConnected;
  Stream<bool> get connectionStream => _connectionController.stream;
  Stream<int> get unreadStream => _unreadController.stream;
  Stream<DirectMessageItem> get newMessageStream => _newMessageController.stream;
  Stream<TypingEvent> get typingStream => _typingController.stream;

  void connect(String token) {
    disconnect();
    if (token.isEmpty) return;

    final socket = io.io(
      Env.apiUrl,
      io.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .enableReconnection()
          .setReconnectionAttempts(10)
          .setReconnectionDelay(1000)
          .build(),
    );

    socket.onConnect((_) {
      _isConnected = true;
      _connectionController.add(true);
    });

    socket.onDisconnect((_) {
      _isConnected = false;
      _connectionController.add(false);
    });

    socket.on('unread_notification', (data) {
      if (data is Map && data['unreadCount'] is num) {
        _unreadController.add((data['unreadCount'] as num).toInt());
      }
    });

    socket.on('new_message', (data) {
      if (data is Map) {
        try {
          final msg = DirectMessageItem.fromJson(Map<String, dynamic>.from(data));
          _newMessageController.add(msg);
        } catch (_) {}
      }
    });

    socket.on('typing', (data) {
      if (data is Map && data['userId'] != null) {
        _typingController.add(
          TypingEvent(
            userId: data['userId'].toString(),
            isTyping: data['isTyping'] == true,
          ),
        );
      }
    });

    _socket = socket;
  }

  void joinConversation(String conversationId) {
    if (_socket?.connected == true) {
      _socket!.emit('join_conversation', {'conversationId': conversationId});
    }
  }

  void leaveConversation(String conversationId) {
    if (_socket?.connected == true) {
      _socket!.emit('leave_conversation', {'conversationId': conversationId});
    }
  }

  void sendMessage(String conversationId, String content) {
    if (_socket?.connected == true) {
      _socket!.emit('send_message', {
        'conversationId': conversationId,
        'content': content,
      });
    }
  }

  void sendTyping(String conversationId, bool isTyping) {
    if (_socket?.connected == true) {
      _socket!.emit('typing', {
        'conversationId': conversationId,
        'isTyping': isTyping,
      });
    }
  }

  void markConversationRead(String conversationId) {
    if (_socket?.connected == true) {
      _socket!.emit('mark_read', {'conversationId': conversationId});
    }
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _isConnected = false;
    _connectionController.add(false);
  }

  void dispose() {
    disconnect();
    _connectionController.close();
    _unreadController.close();
    _newMessageController.close();
    _typingController.close();
  }
}
