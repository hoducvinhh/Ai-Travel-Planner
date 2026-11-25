/// App constants
class AppConstants {
  // Auth & Users endpoints
  static const String authLogin = '/auth/login';
  static const String authRegister = '/auth/register';
  static const String authProfile = '/auth/profile';
  static const String users = '/users';

  // Trips endpoints
  static const String trips = '/trips';

  // Places & Interactions endpoints
  static const String places = '/places';
  static const String interactions = '/interactions';
  static const String interactionsToggleLike = '/interactions/toggle-like';
  static const String interactionsToggleSave = '/interactions/toggle-save';
  static const String interactionsRate = '/interactions/rate';
  static const String interactionsUnrate = '/interactions/unrate';
  static const String interactionsShare = '/interactions/share';
  static const String interactionsUnshare = '/interactions/unshare';
  static const String interactionsTrack = '/interactions/track';

  // AI Q&A Chat endpoints
  static const String chat = '/api/chat';
  static const String chatSessions = '/api/chat/sessions';
  static const String chatFeedback = '/api/chat/feedback';
  static const String chatStatus = '/api/chat/status';

  // Community & Direct Messaging endpoints
  static const String communityPosts = '/community/posts';
  static const String travelBuddies = '/community/travel-buddies';
  static const String messagesConversations = '/messages/conversations';
  static const String messagesUnreadCount = '/messages/unread-count';

  // Upload endpoint
  static const String uploadImage = '/upload/image';

  // Storage keys
  static const String keyAuthToken = 'auth_token';
  static const String keyUserId = 'user_id';
  static const String keyUserEmail = 'user_email';
  static const String keyBiometricEnabled = 'biometric_enabled';
  static const String keyRecentSearches = 'recent_searches';

  // Pagination
  static const int defaultPageSize = 12;

  // Timeouts
  static const Duration apiTimeout = Duration(seconds: 30);
  static const Duration cacheExpiry = Duration(hours: 24);
}
