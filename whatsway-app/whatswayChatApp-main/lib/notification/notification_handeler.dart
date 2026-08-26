import 'dart:convert';
import 'dart:developer';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:get/get.dart';
import 'package:waki/models/chat_conversation_model.dart' as chat_model;
import '../controllers/profile_controller.dart';
import '../modules/chatRoomModule/chat_room_screen.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  log("Handling a background message: ${message.messageId}");
  log("Background message data: ${message.data}");
  if (message.notification == null && message.data.isNotEmpty) {
    await _showBackgroundLocalNotification(message);
  }
}

Future<void> _showBackgroundLocalNotification(RemoteMessage message) async {
  try {
    final localNotifications = FlutterLocalNotificationsPlugin();
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosInit = DarwinInitializationSettings();
    await localNotifications.initialize(
      settings: const InitializationSettings(
        android: androidInit,
        iOS: iosInit,
      ),
    );

    const channel = AndroidNotificationChannel(
      'high_importance_channel_v2',
      'High Importance Notifications',
      description: 'This channel is used for important notifications.',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    final androidPlatformChannelSpecifics = localNotifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();
    if (androidPlatformChannelSpecifics != null) {
      await androidPlatformChannelSpecifics.createNotificationChannel(channel);
    }

    final data = message.data;
    final title = data['title'] ?? data['contactName'] ?? 'New Message';
    final body = data['body'] ?? data['lastMessageText'] ?? '';

    final androidDetails = AndroidNotificationDetails(
      channel.id,
      channel.name,
      channelDescription: channel.description,
      icon: '@mipmap/ic_launcher',
      importance: Importance.max,
      priority: Priority.max,
      playSound: true,
      enableVibration: true,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    await localNotifications.show(
      id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title: title,
      body: body,
      notificationDetails: NotificationDetails(
        android: androidDetails,
        iOS: iosDetails,
      ),
      payload: jsonEncode(data),
    );
  } catch (e) {
    log("Error showing local notification in background: $e");
  }
}

class NotificationHandler {
  static final instance = NotificationHandler._internal();
  NotificationHandler._internal();

  String? activeConversationId;

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  static const AndroidNotificationChannel _channel = AndroidNotificationChannel(
    'high_importance_channel_v2',
    'High Importance Notifications',
    description: 'This channel is used for important notifications.',
    importance: Importance.max,
    playSound: true,
  );

  /// Initializes everything related to notifications
  Future<void> initialize() async {
    // 1. Request Permissions
    await requestPermission();

    // 2. Register Background handler
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // 3. Initialize Local Notifications
    await _initLocalNotifications();

    // 4. Setup FCM message listeners
    _setupMessageListeners();
  }

  /// Request runtime permissions (required for Android 13+ and iOS)
  Future<void> requestPermission() async {
    try {
      final settings = await _messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        log('User granted notification permission');
      } else if (settings.authorizationStatus ==
          AuthorizationStatus.provisional) {
        log('User granted provisional notification permission');
      } else {
        log('User declined or has not accepted notification permissions');
      }
    } catch (e) {
      log('Error requesting notification permission: $e');
    }
  }

  /// Set up Local Notifications
  Future<void> _initLocalNotifications() async {
    try {
      // Android setup
      const AndroidInitializationSettings androidInitSettings =
          AndroidInitializationSettings('@mipmap/ic_launcher');

      // iOS setup
      const DarwinInitializationSettings iosInitSettings =
          DarwinInitializationSettings(
            requestAlertPermission: true,
            requestBadgePermission: true,
            requestSoundPermission: true,
          );

      const InitializationSettings initSettings = InitializationSettings(
        android: androidInitSettings,
        iOS: iosInitSettings,
      );

      // Create Android Channel
      final androidPlatformChannelSpecifics = _localNotifications
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >();
      if (androidPlatformChannelSpecifics != null) {
        await androidPlatformChannelSpecifics.createNotificationChannel(
          _channel,
        );
      }

      await _localNotifications.initialize(
        onDidReceiveNotificationResponse:
            _onDidReceiveLocalNotificationResponse,
        settings: initSettings,
      );
      // Important: for iOS foreground notifications with FCM
      await _messaging.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );
    } catch (e) {
      log('Error initializing local notifications: $e');
    }
  }

  void _setupMessageListeners() {
    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
      log('New FCM Token:- $newToken');
      final profileController = Get.find<ProfileController>();
      await profileController.updateFCMToken(fcmToke: newToken);
    });

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      log('Received a message in the message.data: ${message.data}');
      final conversationId = message.data['conversationId']?.toString();
      if (conversationId != null && activeConversationId == conversationId) {
        return;
      }
      showLocalNotification(message);
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      log('A new onMessageOpenedApp event was published!');
      _handleNotificationClick(message.data);
    });
  }

  Future<void> showLocalNotification(RemoteMessage message) async {
    final notification = message.notification;
    if (notification != null) {
      final androidDetails = AndroidNotificationDetails(
        _channel.id,
        _channel.name,
        channelDescription: _channel.description,
        icon: '@mipmap/ic_launcher',
        importance: Importance.max,
        priority: Priority.max,
        playSound: true,
      );

      final iosDetails = const DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      );

      final platformDetails = NotificationDetails(
        android: androidDetails,
        iOS: iosDetails,
      );

      await _localNotifications.show(
        id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
        title: notification.title,
        body: notification.body,
        notificationDetails: platformDetails,
        payload: jsonEncode(message.data),
      );
    } else if (message.data.isNotEmpty) {
      log('Received a data-only FCM message in foreground: ${message.data}');
    }
  }

  /// Triggered when a LOCAL notification is tapped while the app is running in foreground
  void _onDidReceiveLocalNotificationResponse(NotificationResponse response) {
    if (response.payload != null) {
      log('Local notification tapped with payload: ${response.payload}');
      try {
        final data = jsonDecode(response.payload!);
        if (data is Map<String, dynamic>) {
          _handleNotificationClick(data);
        }
      } catch (e) {
        log('Error parsing notification payload: $e');
      }
    }
  }

  /// Common method to handle navigation based on notification data
  void _handleNotificationClick(Map<String, dynamic> data) {
    log('Handling notification click with data: $data');
    try {
      final conversationId = data['conversationId']?.toString();
      if (conversationId != null && conversationId.isNotEmpty) {
        final messageType = data['messageType']?.toString() ?? 'whatsapp';
        final mobileNumber = data['mobileNumber']?.toString() ?? '';

        bool chatPined = false;
        if (data['chatPined'] != null) {
          if (data['chatPined'] is bool) {
            chatPined = data['chatPined'] as bool;
          } else {
            chatPined = data['chatPined'].toString().toLowerCase() == 'true';
          }
        }

        bool archivechat = false;
        if (data['archivechat'] != null) {
          if (data['archivechat'] is bool) {
            archivechat = data['archivechat'] as bool;
          } else {
            archivechat =
                data['archivechat'].toString().toLowerCase() == 'true';
          }
        }

        chat_model.ChatConversation? chatConversation;
        if (data['chatConversation'] != null &&
            data['chatConversation'] is String &&
            (data['chatConversation'] as String).isNotEmpty) {
          try {
            final decoded = jsonDecode(data['chatConversation'] as String);
            chatConversation = chat_model.ChatConversation.fromJson(decoded);
          } catch (e) {
            log('Error parsing chatConversation string: $e');
          }
        } else if (data['chatConversation'] is Map<String, dynamic>) {
          try {
            chatConversation = chat_model.ChatConversation.fromJson(
              data['chatConversation'] as Map<String, dynamic>,
            );
          } catch (e) {
            log('Error parsing chatConversation map: $e');
          }
        }

        // Parse direct properties or populate fallback minimal ChatConversation
        if (chatConversation == null) {
          final assignedTo = data['assignedTo'];
          final assignedToName = data['assignedToName'];
          final contactName = data['contactName'] ?? data['title'];
          chatConversation = chat_model.ChatConversation(
            id: conversationId,
            assignedTo: assignedTo,
            assignedToName: assignedToName,
            contactName: contactName,
            contact: chat_model.Contact(name: contactName ?? 'Anonymous'),
          );
        } else {
          if (chatConversation.assignedTo == null &&
              data['assignedTo'] != null) {
            chatConversation.assignedTo = data['assignedTo'];
          }
          if (chatConversation.assignedToName == null &&
              data['assignedToName'] != null) {
            chatConversation.assignedToName = data['assignedToName'];
          }
          if (chatConversation.contact == null) {
            final contactName =
                chatConversation.contactName ??
                data['contactName'] ??
                data['title'] ??
                'Anonymous';
            chatConversation.contact = chat_model.Contact(name: contactName);
          }
        }

        Get.to(
          () => ChatRoomScreen(
            conversationId: conversationId,
            mobileNumber: mobileNumber,
            messageType: messageType,
            chatPined: chatPined,
            archivechat: archivechat,
            chatConversation: chatConversation,
          ),
        );
      }
    } catch (e) {
      log('Error handling notification click navigation: $e');
    }
  }
}
