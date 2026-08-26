import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:developer' as developer;
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../constants/constants.dart';
import '../../controllers/chat_controller.dart';
import '../../controllers/message_room_controller.dart';

class WebSocketService extends GetxService with WidgetsBindingObserver {
  WebSocket? ws;
  bool _isConnected = false;
  bool _manualClose = false;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addObserver(this);
    connect();
  }

  @override
  void onClose() {
    WidgetsBinding.instance.removeObserver(this);
    disconnect();
    super.onClose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.detached) {
      developer.log('📱 App went to background. Closing socket.');
      disconnect();
    } else if (state == AppLifecycleState.resumed) {
      developer.log('📱 App returned to foreground. Reconnecting socket.');
      connect();
    }
  }

  Future<void> connect() async {
    if (_isConnected) return;

    _manualClose = false;
    developer.log('🔌 Connecting to WebSocket...');
    try {
      final prefs = await SharedPreferences.getInstance();
      String activeChannelId = prefs
          .getString(AppConstants.channelId)
          .toString();
      developer.log("activeChannelId $activeChannelId");
      ws = await WebSocket.connect('wss://app.waki.in/ws');
      _isConnected = true;
      developer.log('✅ WebSocket connected successfully!');
      ws!.add(
        jsonEncode({'type': 'join-channel', 'channelId': activeChannelId}),
      );
      ws!.listen(
        (message) {
          try {
            Map<String, dynamic> parsedData;
            developer.log("received message:- $message");
            if (message is String) {
              parsedData = jsonDecode(message) as Map<String, dynamic>;
            } else if (message is Map<String, dynamic>) {
              parsedData = message;
            } else {
              return;
            }
            final messagePayload = parsedData['message'] is Map
                ? parsedData['message'] as Map<String, dynamic>
                : null;
            final String? incomingConversationId =
                parsedData['conversationId'] ??
                messagePayload?['conversationId'];

            if (incomingConversationId == null) return;
            bool isCurrentlyInThisChatRoom = false;
            if (Get.isRegistered<MessageRoomController>()) {
              final messageRoomCtrl = Get.find<MessageRoomController>();
              if (messageRoomCtrl.activeConversationId ==
                  incomingConversationId) {
                isCurrentlyInThisChatRoom = true;
              }
            }
            if (isCurrentlyInThisChatRoom) {
              Get.find<MessageRoomController>().handleIncomingRoomMessage(
                parsedData,
              );
            } else {
              if (Get.isRegistered<ChatController>()) {
                Get.find<ChatController>().handleIncomingSocketMessage(
                  parsedData,
                );
              }
            }
          } catch (e) {
            developer.log("Error processing socket updates: $e");
          }
        },
        onDone: () {
          developer.log('🔌 WebSocket connection closed');
          _isConnected = false;
          if (!_manualClose) _reconnect();
        },
        onError: (error) {
          developer.log('❌ WebSocket error: $error');
          _isConnected = false;
        },
      );
    } catch (e) {
      developer.log('❌ WebSocket connection failed: $e');
      _isConnected = false;
      if (!_manualClose) _reconnect();
    }
  }

  void _reconnect() {
    Future.delayed(const Duration(seconds: 5), () {
      if (!_isConnected && !_manualClose) connect();
    });
  }

  void joinConversationRoom(String conversationId) {
    if (ws != null && _isConnected) {
      ws!.add(
        jsonEncode({
          'type': 'join-conversation',
          'conversationId': conversationId,
        }),
      );
    }
  }

  void joinConversationRoomEvent(String conversationId, String? role) {
    developer.log('🔌 joinConversationRoomEvent called: conversationId=$conversationId, role=$role, isConnected=$_isConnected, ws=${ws != null}');
    if (ws != null && _isConnected) {
      final isAgentOrAdmin = role == 'agent' || role == 'admin';
      final eventType = isAgentOrAdmin
          ? 'agent_join_conversation'
          : 'join_conversation';
      developer.log(
        '🔌 Emitting socket event: $eventType with conversationId: $conversationId',
      );
      ws!.add(
        jsonEncode({'type': eventType, 'conversationId': conversationId}),
      );
    }
  }

  void leaveConversationRoomEvent(String conversationId) {
    developer.log('🔌 leaveConversationRoomEvent called: conversationId=$conversationId, isConnected=$_isConnected, ws=${ws != null}');
    if (ws != null && _isConnected) {
      developer.log(
        '🔌 Emitting socket event: leave_conversation with conversationId: $conversationId',
      );
      ws!.add(
        jsonEncode({
          'type': 'leave_conversation',
          'conversationId': conversationId,
        }),
      );
    }
  }

  void disconnect() {
    _manualClose = true;
    _isConnected = false;
    ws?.close();
    ws = null;
    developer.log('🔌 WebSocket manually disconnected');
  }
}
