import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:travel_planner/models/trip.dart';

/// Notification service for local notifications
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  bool _initialized = false;

  /// Initialize notification service
  Future<void> initialize() async {
    if (_initialized) return;

    // Initialize timezone
    tz.initializeTimeZones();

    // Android initialization settings
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    // iOS initialization settings
    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    // Combined initialization settings
    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    _initialized = true;
  }

  /// Handle notification tap
  void _onNotificationTapped(NotificationResponse response) {
    // TODO: Navigate to appropriate screen based on payload
    final payload = response.payload;
    if (payload != null) {
      // Parse payload and navigate
    }
  }

  /// Request notification permissions (iOS)
  Future<bool> requestPermissions() async {
    final bool? result = await _notifications
        .resolvePlatformSpecificImplementation<
            IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );

    return result ?? false;
  }

  /// Show immediate notification
  Future<void> showNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'travel_planner_channel',
      'Travel Planner',
      channelDescription: 'Notifications for travel plans and reminders',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.show(id, title, body, details, payload: payload);
  }

  /// Schedule notification
  Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledTime,
    String? payload,
  }) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'travel_planner_channel',
      'Travel Planner',
      channelDescription: 'Notifications for travel plans and reminders',
      importance: Importance.high,
      priority: Priority.high,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.zonedSchedule(
      id,
      title,
      body,
      tz.TZDateTime.from(scheduledTime, tz.local),
      details,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
  }

  /// Schedule trip reminder (1 day before)
  Future<void> scheduleTripReminder(Trip trip) async {
    final parsedStartDate = DateTime.tryParse(trip.startDate);
    if (parsedStartDate == null) return;

    final reminderTime = parsedStartDate.subtract(const Duration(days: 1));

    // Only schedule if reminder time is in the future
    if (reminderTime.isAfter(DateTime.now())) {
      await scheduleNotification(
        id: trip.id.hashCode,
        title: 'Nhắc nhở chuyến đi',
        body: 'Chuyến đi "${trip.destination}" sẽ bắt đầu vào ngày mai!',
        scheduledTime: reminderTime,
        payload: 'trip:${trip.id}',
      );
    }
  }

  /// Schedule trip start notification
  Future<void> scheduleTripStartNotification(Trip trip) async {
    final parsedStartDate = DateTime.tryParse(trip.startDate);
    if (parsedStartDate == null) return;

    final startTime = DateTime(
      parsedStartDate.year,
      parsedStartDate.month,
      parsedStartDate.day,
      8, // 8 AM on start date
    );

    if (startTime.isAfter(DateTime.now())) {
      await scheduleNotification(
        id: '${trip.id}_start'.hashCode,
        title: 'Chuyến đi bắt đầu hôm nay!',
        body: 'Chúc bạn có một chuyến đi vui vẻ đến ${trip.destination}!',
        scheduledTime: startTime,
        payload: 'trip:${trip.id}',
      );
    }
  }

  /// Cancel notification
  Future<void> cancelNotification(int id) async {
    await _notifications.cancel(id);
  }

  /// Cancel all notifications
  Future<void> cancelAllNotifications() async {
    await _notifications.cancelAll();
  }

  /// Cancel trip notifications
  Future<void> cancelTripNotifications(String tripId) async {
    await cancelNotification(tripId.hashCode);
    await cancelNotification('${tripId}_start'.hashCode);
  }

  /// Get pending notifications
  Future<List<PendingNotificationRequest>> getPendingNotifications() async {
    return await _notifications.pendingNotificationRequests();
  }

  /// Check if notifications are enabled
  Future<bool> areNotificationsEnabled() async {
    if (_notifications
            .resolvePlatformSpecificImplementation<
                AndroidFlutterLocalNotificationsPlugin>() !=
        null) {
      return await _notifications
              .resolvePlatformSpecificImplementation<
                  AndroidFlutterLocalNotificationsPlugin>()!
              .areNotificationsEnabled() ??
          false;
    }
    return true; // iOS permissions are requested at initialization
  }
}
