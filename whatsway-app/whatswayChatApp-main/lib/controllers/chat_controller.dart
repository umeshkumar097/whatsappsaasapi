import 'dart:convert';
import 'dart:developer';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/models/all_members_model.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/api_service.dart';
import '../models/chat_conversation_model.dart';

class ChatController extends GetxController {
  final ApiService _apiService = ApiService();
  bool isLoading = false;
  List<ChatConversation> conversations = [];
  List<AllMembers> allMembers = [];
  String? errorMessage;

  @override
  void onInit() {
    super.onInit();
    loadPinedConversations();
    loadConversations();
  }

  Future<bool> loadConversations() async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';
      final response = await _apiService.get(
        endUrl: "${ApiUrl.CONVERSATION}?channelId=$channelId",
      );
      log('loadConversations chatListing  ${response.data}');
      if (response is ApiSuccess) {
        final List<dynamic> responseData = response.data is List
            ? response.data
            : [];
        conversations = responseData
            .where((jsonItem) => jsonItem["lastMessageText"] != null)
            .map(
              (jsonItem) =>
                  ChatConversation.fromJson(jsonItem as Map<String, dynamic>),
            )
            .toList();
        return true;
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to load chat conversations';
        log("Failed to loadConversations error:- $errorMessage");
        return false;
      } else {
        errorMessage = 'Failed to load chat conversations';
        log("Failed to loadConversations error:- $errorMessage");
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception in ChatController method loadConversations():- $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<bool> loadPinedConversations() async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';
      final response = await _apiService.get(
        endUrl: "${ApiUrl.PINNED_CONVERSATION}?channelId=$channelId",
      );
      log('loadPinedConversations chatListing  ${jsonEncode(response.data)}');
      if (response is ApiSuccess) {
        return true;
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to load chat conversations';
        log("Failed to loadPinedConversations error:- $errorMessage");
        return false;
      } else {
        errorMessage = 'Failed to load chat loadPinedConversations';
        log("Failed to loadPinedConversations error:- $errorMessage");
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception in ChatController method loadPinedConversations():- $e");
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  /// Call this method inside your Socket listener whenever a new message payload arrives
  void handleIncomingSocketMessage(Map<String, dynamic> socketData) {
    try {
      final String? type = socketData['type'];
      if (type != 'new-message') return;
      final messagePayload = socketData['message'] is Map
          ? socketData['message'] as Map<String, dynamic>
          : null;
      if (messagePayload == null) return;
      final String? targetConversationId =
          socketData['conversationId'] ?? messagePayload['conversationId'];
      final String? content = messagePayload['content'];
      // 1. Extract raw timestamp string safely
      final String? createdAtString = messagePayload['createdAt']?.toString();
      if (targetConversationId == null) return;
      int index = conversations.indexWhere(
        (conv) => conv.id == targetConversationId,
      );
      if (index != -1) {
        final existingConv = conversations[index];

        // 2. Parse the string into a DateTime object if it exists
        DateTime? parsedDate = createdAtString != null
            ? DateTime.tryParse(createdAtString)
            : null;

        // Update values
        existingConv.lastMessageText = content ?? existingConv.lastMessageText;

        // 3. Assign the parsed DateTime object instead of the raw string object
        existingConv.lastMessageAt = parsedDate ?? existingConv.lastMessageAt;

        existingConv.unreadCount = (existingConv.unreadCount ?? 0) + 1;

        // Move to top
        conversations.removeAt(index);
        conversations.insert(0, existingConv);
      } else {
        loadConversations();
      }

      update();
    } catch (e) {
      log(
        "Exception inside handleIncomingSocketMessage processing string elements: $e",
      );
    }
  }

  Future<void> getAllMembers() async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final response = await _apiService.get(
        endUrl: "${ApiUrl.GET_MEMBERS}?limit=100",
      );
      log('my getAllMembers  ${response.data}');
      if (response is ApiSuccess) {
        allMembers = AllMembersModel.fromJson(response.data).data ?? [];
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to getAllMembers';
        log("Failed to getAllMembers error:- $errorMessage");
      } else {
        errorMessage = 'Failed to getAllMembers';
        log("Failed to getAllMembers error:- $errorMessage");
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception in ChatController method getAllMembers():- $e");
    } finally {
      isLoading = false;
      update();
    }
  }
}
