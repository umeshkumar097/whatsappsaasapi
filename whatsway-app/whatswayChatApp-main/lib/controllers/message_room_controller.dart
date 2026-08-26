import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'package:get/get_state_manager/src/simple/get_controllers.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waki/controllers/chat_controller.dart';
import 'package:waki/network/session_manager.dart';
import '../constants/constants.dart';
import '../models/chatroom_massage_model.dart';
import '../network/api_result.dart';
import '../network/api_service.dart';
import 'package:get/get.dart';
import 'package:waki/utiles/app_utils.dart';
import 'package:http/http.dart' as http;

class MessageRoomController extends GetxController {
  final ApiService _apiService = ApiService();
  bool isLoading = false;
  String? errorMessage;
  List<RoomMessageModel> roomMessageList = [];

  String? activeConversationId;
  final Map<String, String> _imageCache = {};

  void handleIncomingRoomMessage(Map<String, dynamic> socketData) {
    try {
      final String? type = socketData['type'];
      if (type != 'new-message') return;

      final messagePayload = socketData['message'] is Map
          ? socketData['message'] as Map<String, dynamic>
          : null;

      if (messagePayload == null) return;

      final String? targetConversationId =
          socketData['conversationId'] ?? messagePayload['conversationId'];

      // Safety check: Only append to the UI if the user is currently viewing this exact chat room
      if (targetConversationId == null ||
          targetConversationId != activeConversationId) {
        return;
      }

      // FIX DUPLICATES: If the message was sent by an agent/outbound, ignore it
      // because your sendTextMessage() method already added it optimistically.
      final String direction =
          messagePayload['direction']?.toString() ?? "inbound";
      final String? fromType = messagePayload['fromType']?.toString();
      if (direction == "outbound" || fromType == "agent") {
        log(
          "Skipping socket message: already added by optimistic UI layout framework.",
        );
        return;
      }

      final String? content = messagePayload['content'];
      final String? createdAt = messagePayload['createdAt'];
      final String? status = messagePayload['status']?.toString();
      final String? mediaUrl = messagePayload['mediaUrl']?.toString();
      final String? messageType =
          messagePayload['messageType']?.toString() ??
          messagePayload['type']?.toString();

      // Instantiate your RoomMessageModel
      final incomingMessage = RoomMessageModel(
        id:
            messagePayload['id']?.toString() ??
            DateTime.now().millisecondsSinceEpoch.toString(),
        content: content,
        createdAt: createdAt,
        direction: direction,
        status: status ?? "received",
        mediaUrl: mediaUrl,
        messageType: messageType,
      );

      // Double check to prevent duplicate entries
      bool alreadyExists = roomMessageList.any(
        (msg) => msg.createdAt == createdAt && msg.content == content,
      );

      if (!alreadyExists) {
        roomMessageList.add(incomingMessage);
        update();
      }
    } catch (e) {
      log("Exception inside handleIncomingRoomMessage: $e");
    }
  }

  Future<bool> sendWidgetTextMessage({
    required String message,
    required String conversationId,
    required String agentId,
    required String agentName,
  }) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final tempMessage = RoomMessageModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: message,
        createdAt: DateTime.now().toString(),
        direction: "outbound",
        status: "sent",
      );
      roomMessageList.add(tempMessage);
      update();

      final response = await _apiService.post(
        endUrl: "${ApiUrl.CONVERSATION}/$conversationId/messages",
        data: {
          "content": message,
          "fromUser": true,
          "fromType": "agent",
          "agentId": agentId,
          "agentName": agentName,
        },
      );
      if (response is ApiSuccess) {
        return true;
      } else if (response is ApiFailure) {
        log("log sendWidgetTextMessage response ${response.statusCode}");
        log("log sendWidgetTextMessage response ${response.message}");
        errorMessage = response.message ?? 'Failed to sendWidgetText message';
        return false;
      } else {
        errorMessage = 'Failed to sendWidgetText';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.sendWidgetText(): $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<bool> sendTextMessage({
    required String mobileNumber,
    required String message,
  }) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      // Optimistic UI update
      final tempMessage = RoomMessageModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: message,
        createdAt: DateTime.now().toString(),
        direction: "outbound",
        status: "sent",
      );
      roomMessageList.add(tempMessage);
      update();

      final response = await _apiService.post(
        endUrl: ApiUrl.SEND_WHATSAPP_MESSAGE,
        data: {"to": mobileNumber, "message": message, "channelId": channelId},
      );
      if (response is ApiSuccess) {
        print("api success");
        return true;
      } else if (response is ApiFailure) {
        log("log send message response ${response.statusCode}");
        log("log send message response ${response.message}");
        errorMessage = response.message ?? 'Failed to send text message';
        return false;
      } else {
        errorMessage = 'Failed to send text message';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.sendTextMessage(): $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<bool> sendTemplateMessage({
    required String toPhone,
    required String templateName,
    required String headerType,
    required String templateMessage,
    required List<Map<String, dynamic>> parameters,
    required bool isFromContact,
    List<dynamic>? uploadedMediaIds,
    List<String>? buttonParameters,
    String? mediaId,
    String? localImagePath, // For Optimistic UI image preview
  }) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();

      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      // 1. Reconstruct preview text for Optimistic UI
      String uiMessagePreview = templateMessage;
      // if (parameters.isNotEmpty) {
      //   uiMessagePreview += " " +
      //       parameters
      //           .map((p) => "${p['value'] ?? p['text'] ?? ''}")
      //           .join(", ");
      // }

      // 2. Optimistic UI update
      print("uiMessagePreview:- ${uiMessagePreview}");
      final tempMessage = RoomMessageModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: uiMessagePreview.trim(),
        mediaUrl: localImagePath,
        createdAt: DateTime.now().toString(),
        direction: "outbound",
        status: "sent",
      );
      roomMessageList.add(tempMessage);
      update();

      // 3. Map parameters correctly
      final mappedParameters = parameters.map((p) {
        return {
          "type": p['type'] ?? 'custom',
          "value": p['value'] ?? p['text'] ?? '',
        };
      }).toList();

      // 4. Sanitize and extract media IDs
      final List<String> cleanCarouselIds = (uploadedMediaIds ?? [])
          .map((e) => e.toString())
          .where((id) => id.trim().isNotEmpty)
          .toList();

      final String? cleanSingleMediaId = (mediaId != null && mediaId.trim().isNotEmpty)
          ? mediaId.trim()
          : (cleanCarouselIds.length == 1 ? cleanCarouselIds.first : null);

      // 5. Build base payload
      final Map<String, dynamic> payload = {
        "to": toPhone,
        "channelId": channelId,
        "templateName": templateName,
        "parameters": mappedParameters,
        if (buttonParameters != null && buttonParameters.isNotEmpty)
          "buttonParameters": buttonParameters,
      };

      // 6. Conditionally attach media based on image count
      if (cleanCarouselIds.length > 1) {
        // SCENARIO 3: Multiple images -> carouselCardMediaIds ONLY
        payload["carouselCardMediaIds"] = cleanCarouselIds;
      } else if (cleanSingleMediaId != null) {
        // SCENARIO 2: Single image -> headerType & mediaId ONLY
        payload["headerType"] = headerType.toUpperCase();
        payload["mediaId"] = cleanSingleMediaId;
      }
      // SCENARIO 1: No images -> Neither key is added

      log("Payload sending: $payload");

      // 7. Make API request
      final response = await _apiService.post(
        endUrl: ApiUrl.SEND_WHATSAPP_MESSAGE,
        data: payload,
      );

      if (response is ApiSuccess) {
        print("template api success");
        if (isFromContact) {
          Get.snackbar(
            'Success',
            'Template Sent!',
            snackPosition: SnackPosition.BOTTOM,
          );
        }
        return true;
      } else if (response is ApiFailure) {
        log("log send template response ${response.statusCode}");
        log("log send template response ${response.message}");
        errorMessage = response.message ?? 'Failed to send template message';
        return false;
      } else {
        errorMessage = 'Failed to send template message';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.sendTemplateMessage(): $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  ///upload template image
  ///

  Future<String?> uploadTemplateImage({
    required File imageFile,
    required String templateId,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      // Construct the endpoint URL path
      final String endUrl = "/whatsapp/channels/$channelId/upload-image";

      // Call the centralized postMultipart method
      final response = await _apiService.postMultipart(
        endUrl: endUrl,
        file: imageFile,
        fileField: "mediaFile", // Field name for binary file upload
        fields: {
          "templateId": templateId, // Form data text fields
        },
      );

      // If postMultipart returns a success model or parsed map
      if (response != null) {
        // Extract mediaId directly from response data
        Map<String, dynamic> responseData = {};

        if (response is Map<String, dynamic>) {
          responseData = response;
        } else if (response.data != null && response.data is Map<String, dynamic>) {
          responseData = response.data;
        }

        String? mediaId = responseData['mediaId'] ??
            responseData['id'] ??
            responseData['data']?['id'];

        return mediaId;
      } else {
        AppUtils.showToast(message: 'Failed to upload image.');
        return null;
      }
    } catch (e) {
      log("Exception inside uploadTemplateImage: $e");
      return null;
    }
  }

  Future<bool> sendMediaMessage({
    required String toPhone,
    required String mediaId,
    required String caption,
  }) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();

      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      final response = await _apiService.post(
        endUrl: ApiUrl.SEND_WHATSAPP_MESSAGE,
        data: {
          "to": toPhone,
          "channelId": channelId,
          "mediaId": mediaId,
          "caption": caption,
        },
      );

      if (response is ApiSuccess) {
        return true;
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to send media message';
        return false;
      } else {
        errorMessage = 'Failed to send media message';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.sendMediaMessage(): $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  bool isImageSending = false;
  Future<bool> shareImageInChat({
    required String conversationId,
    required File imageFile,
    required String caption,
  }) async {
    try {
      isImageSending = true;
      errorMessage = null;
      update();

      final response = await _apiService.postMultipart(
        endUrl: "${ApiUrl.CONVERSATION}/$conversationId/messages",
        file: imageFile,
        fileField: "media",
        fields: {
          "fromUser": "true",
          "conversationId": conversationId,
          "caption": caption,
        },
      );

      if (response is ApiSuccess) {
        RoomMessageModel tempMessage;
        if (response.data is Map<String, dynamic>) {
          tempMessage = RoomMessageModel.fromJson(
            response.data as Map<String, dynamic>,
          );
        } else if (response.data is Map && response.data['message'] is Map) {
          tempMessage = RoomMessageModel.fromJson(
            Map<String, dynamic>.from(response.data['message']),
          );
        } else if (response.data is Map && response.data['data'] is Map) {
          tempMessage = RoomMessageModel.fromJson(
            Map<String, dynamic>.from(response.data['data']),
          );
        } else {
          tempMessage = RoomMessageModel(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            content: caption,
            createdAt: DateTime.now().toString(),
            direction: "outbound",
            status: "sent",
          );
        }
        roomMessageList.add(tempMessage);
        update();
        return true;
      } else if (response is ApiFailure) {
        AppUtils.showToast(
          message: 'Alert!',
          description: response.message ?? 'Failed to send image message',
        );
        errorMessage = response.message ?? 'Failed to send image message';
        return false;
      } else {
        errorMessage = 'Failed to send image message';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      log(
        "Exception inside MessageRoomController method shareImageInChat(): $e",
      );
      return false;
    } finally {
      isImageSending = false;
      update();
    }
  }

  bool chatPin = false;
  bool archivechat = false;
  Future<void> getRoomMessages({required String conversationId}) async {
    try {
      isLoading = true;
      errorMessage = null;
      activeConversationId = conversationId; // Set active room context tracking
      _imageCache.clear();
      update();

      final response = await _apiService.get(
        endUrl: "${ApiUrl.CONVERSATION}/$conversationId/messages?limit=100",
      );
      log('getRoomMessages response ${jsonEncode(response.data)}');
      if (response is ApiSuccess) {
        if (response.data is List) {
          roomMessageList = (response.data as List)
              .map((x) => RoomMessageModel.fromJson(x as Map<String, dynamic>))
              .toList();
        } else {
          roomMessageList = [];
        }
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to send text message';
      } else {
        errorMessage = 'Failed to send text message';
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.sendTextMessage(): $e");
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<void> assigedChatTo({
    required String conversationId,
    required String userId,
    required String userName,
    String? status,
  }) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final data = {
        "assignedTo": userId,
        "status": status ?? '',
        "assignedToName": userName,
      };
      final response = await _apiService.put(
        endUrl: "${ApiUrl.CONVERSATION}/$conversationId",
        data: data,
      );
      log('getRoomMessages response ${jsonEncode(response.data)}');
      if (response is ApiSuccess) {
        AppUtils.showToast(message: "Assigned to $userName");
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to send text message';
      } else {
        errorMessage = 'Failed to send text message';
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.sendTextMessage(): $e");
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<void> unassignChat({required String conversationId}) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final data = {"assignedTo": null, "status": "open"};
      final response = await _apiService.put(
        endUrl: "${ApiUrl.CONVERSATION}/$conversationId",
        data: data,
      );
      log('unassignChat response ${jsonEncode(response.data)}');
      if (response is ApiSuccess) {
        AppUtils.showToast(message: "Chat unassigned successfully");
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to unassign chat';
      } else {
        errorMessage = 'Failed to unassign chat';
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.unassignChat(): $e");
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<void> togglePinChat({
    required String conversationId,
    required bool isPinned,
  }) async {
    try {
      isLoading = true;
      update();
      dynamic response;
      if (isPinned == true) {
        response = await _apiService.post(
          endUrl: "${ApiUrl.CONVERSATION}/$conversationId/pin",
        );
      } else {
        response = await _apiService.delete(
          endUrl: "${ApiUrl.CONVERSATION}/$conversationId/pin",
        );
      }
      if (response is ApiSuccess) {
        chatPin = chatPin == false ? true : false;
        update();
        // AppUtils.showToast(message: "Chat updated successfully");
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to update chat';
      } else {
        errorMessage = 'Failed to update chat';
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageController.togglePinChat(): $e");
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<bool> archiveChat({
    required String conversationId,
    required String archivedstatus,
  }) async {
    try {
      isLoading = true;
      update();
      final response = await _apiService.patch(
        endUrl: "${ApiUrl.CONVERSATION}/$conversationId/status",
        data: {"status": archivedstatus},
      );
      log('archiveChat response data packet: $response');
      if (response is ApiSuccess) {
        archivechat = archivechat == false ? true : false;
        update();
        AppUtils.showToast(
          message:
              "Chat ${archivedstatus.toLowerCase() == 'open' ? 'Un-Archived' : 'Archived'}",
        );
        final chatCtrl = Get.find<ChatController>();
        await chatCtrl.loadConversations();
        return true;
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to archive conversation';
        return false;
      }
      return false;
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageRoomController method archiveChat(): $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<bool> deleteChat({required String conversationId}) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final response = await _apiService.delete(
        endUrl: "${ApiUrl.CONVERSATION}/$conversationId",
      );
      log('deleteChat API response: $response');
      if (response is ApiSuccess) {
        return true;
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to delete conversation';
        log("Failed to deleteChat error:- $errorMessage");
        return false;
      }
      return false;
    } catch (e) {
      errorMessage = e.toString();
      log("Exception inside MessageRoomController method deleteChat(): $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<String> getUploadedImage({required String messageID}) async {
    if (_imageCache.containsKey(messageID)) {
      return _imageCache[messageID]!;
    }
    try {
      log('getUploadedImage API starting for messageID: $messageID');
      final sessionHeaders = await SessionManager.getAuthHeaders();
      final response = await http.get(
        Uri.parse(
          "${ApiUrl.BASE_URL}${ApiUrl.MEDIA_PROXY}?messageId=$messageID",
        ),
        headers: sessionHeaders,
      );
      log('getUploadedImage API statusCode: ${response.statusCode}');
      if (response.statusCode == 200) {
        final contentType = response.headers['content-type'] ?? 'image/png';
        final base64Image = base64Encode(response.bodyBytes);
        final dataUri = 'data:$contentType;base64,$base64Image';
        _imageCache[messageID] = dataUri;
        return dataUri;
      }
      return '';
    } catch (e) {
      log(
        "Exception inside MessageRoomController method getUploadedImage(): $e",
      );
      return '';
    }
  }
}
