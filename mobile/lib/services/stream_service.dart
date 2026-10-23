import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:travel_planner/config/env.dart';

/// SSE streaming service for chat
class StreamService {
  final http.Client _client;

  StreamService({http.Client? client}) : _client = client ?? http.Client();

  /// Stream chat messages from API
  Stream<Map<String, dynamic>> streamChat({
    required String message,
    String? sessionId,
    required String token,
  }) async* {
    final request = http.Request(
      'POST',
      Uri.parse('${Env.apiUrl}/api/chat'),
    );

    request.headers['Content-Type'] = 'application/json';
    request.headers['Authorization'] = 'Bearer $token';
    request.headers['Accept'] = 'text/event-stream';

    request.body = json.encode({
      'message': message,
      if (sessionId != null) 'sessionId': sessionId,
    });

    final response = await _client.send(request);

    if (response.statusCode != 200) {
      throw Exception('Failed to stream chat: ${response.statusCode}');
    }

    String buffer = '';
    await for (final chunk in response.stream.transform(utf8.decoder)) {
      buffer += chunk;
      final lines = buffer.split('\n\n');
      buffer = lines.last;

      for (final line in lines.take(lines.length - 1)) {
        if (line.startsWith('data: ')) {
          try {
            final data = line.substring(6);
            if (data.trim().isEmpty) continue;

            final event = json.decode(data) as Map<String, dynamic>;
            yield event;
          } catch (e) {
            // Skip malformed events
            continue;
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim().isNotEmpty && buffer.startsWith('data: ')) {
      try {
        final data = buffer.substring(6);
        final event = json.decode(data) as Map<String, dynamic>;
        yield event;
      } catch (e) {
        // Skip
      }
    }
  }

  void dispose() {
    _client.close();
  }
}
