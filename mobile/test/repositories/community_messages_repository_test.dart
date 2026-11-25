import 'package:flutter_test/flutter_test.dart';
import 'package:travel_planner/repositories/community_repository.dart';
import 'package:travel_planner/repositories/messages_repository.dart';
import 'package:travel_planner/services/api_service.dart';
import 'package:travel_planner/utils/constants.dart';

class _StubApiService implements ApiService {
  String? lastPath;
  Map<String, dynamic>? lastQueryParams;
  dynamic lastData;
  dynamic nextResponse;

  @override
  Future<T> get<T>(String path, {Map<String, dynamic>? queryParams}) async {
    lastPath = path;
    lastQueryParams = queryParams;
    return nextResponse as T;
  }

  @override
  Future<T> post<T>(String path, {dynamic data}) async {
    lastPath = path;
    lastData = data;
    return nextResponse as T;
  }

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  group('CommunityRepository & MessagesRepository', () {
    late _StubApiService api;
    late CommunityRepository communityRepo;
    late MessagesRepository messagesRepo;

    setUp(() {
      api = _StubApiService();
      communityRepo = CommunityRepository(api);
      messagesRepo = MessagesRepository(api);
    });

    test('getPosts parses { items } pagination envelope', () async {
      api.nextResponse = {
        'items': [
          {
            'id': 'post1',
            'userId': 'u1',
            'title': 'Review Sa Pa',
            'content': 'Rất đẹp!',
            'tags': ['Sa Pa'],
            'likesCount': 12,
            'createdAt': '2026-11-20T08:00:00.000Z',
          },
        ],
      };

      final posts = await communityRepo.getPosts(tag: 'Sa Pa', search: 'fansipan');
      expect(api.lastPath, AppConstants.communityPosts);
      expect(api.lastQueryParams?['tag'], 'Sa Pa');
      expect(api.lastQueryParams?['search'], 'fansipan');
      expect(posts.length, 1);
      expect(posts.first.title, 'Review Sa Pa');
    });

    test('getTravelBuddies calls travel buddies endpoint', () async {
      api.nextResponse = [
        {
          'id': 'u2',
          'name': 'Minh',
          'email': 'minh@example.com',
          'matchScore': 92.0,
          'mutualStyles': ['Ẩm thực', 'Thiên nhiên'],
        },
      ];

      final buddies = await communityRepo.getTravelBuddies(userId: 'u1');
      expect(api.lastPath, AppConstants.travelBuddies);
      expect(api.lastQueryParams, {'userId': 'u1'});
      expect(buddies.length, 1);
      expect(buddies.first.matchScore, 92.0);
    });

    test('MessagesRepository endpoints and unreadCount parsing', () async {
      api.nextResponse = {'unreadCount': 4};
      final count = await messagesRepo.getUnreadCount();
      expect(api.lastPath, AppConstants.messagesUnreadCount);
      expect(count, 4);

      api.nextResponse = {'id': 'conv1'};
      final conv = await messagesRepo.getOrCreateConversation('u2');
      expect(api.lastPath, AppConstants.messagesConversations);
      expect(api.lastData, {'targetUserId': 'u2'});
      expect(conv['id'], 'conv1');
    });
  });
}
