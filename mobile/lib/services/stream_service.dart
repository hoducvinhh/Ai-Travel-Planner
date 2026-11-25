import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:travel_planner/config/env.dart';

/// SSE streaming service for RAG Q&A chat
class StreamService {
  final http.Client _client;

  StreamService({http.Client? client}) : _client = client ?? http.Client();

  /// Stream chat messages from POST /api/chat
  Stream<Map<String, dynamic>> streamChat({
    required String message,
    String? sessionId,
    String? token,
  }) async* {
    final request = http.Request(
      'POST',
      Uri.parse('${Env.apiUrl}/api/chat'),
    );

    request.headers['Content-Type'] = 'application/json';
    if (token != null && token.isNotEmpty) {
      request.headers['Authorization'] = 'Bearer $token';
    }
    request.headers['Accept'] = 'text/event-stream';

    request.body = json.encode({
      'message': message,
      if (sessionId != null) 'sessionId': sessionId,
    });

    final response = await _client.send(request);

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Không thể kết nối trợ lý AI (${response.statusCode})');
    }

    String buffer = '';
    await for (final chunk in response.stream.transform(utf8.decoder)) {
      buffer += chunk;
      final events = buffer.split('\n\n');
      buffer = events.last;

      for (final rawEvent in events.take(events.length - 1)) {
        for (final line in rawEvent.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              final data = line.substring(6).trim();
              if (data.isEmpty) continue;
              final parsed = json.decode(data);
              if (parsed is Map<String, dynamic>) {
                yield parsed;
              }
            } catch (_) {
              continue;
            }
          }
        }
      }
    }

    if (buffer.trim().isNotEmpty) {
      for (final line in buffer.split('\n')) {
        if (line.startsWith('data: ')) {
          try {
            final data = line.substring(6).trim();
            if (data.isEmpty) continue;
            final parsed = json.decode(data);
            if (parsed is Map<String, dynamic>) {
              yield parsed;
            }
          } catch (_) {}
        }
      }
    }
  }

  void dispose() {
    _client.close();
  }
}
