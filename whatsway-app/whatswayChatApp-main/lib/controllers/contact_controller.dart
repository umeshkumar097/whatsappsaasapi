import 'dart:convert';
import 'dart:developer';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/models/all_groups_mode.dart' as group_model;
import 'package:waki/models/all_groups_mode.dart';
import 'package:waki/models/contact_model.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/api_service.dart';

class ContactController extends GetxController {
  final ApiService _apiService = ApiService();
  bool isLoading = false;
  bool isLoadMore = false;
  List<ContactsList> contacts = [];
  bool isGroupsLoading = false;
  List<group_model.Group>? allGroups = [];
  String? errorMessage;
  bool isFirstLoad = true;
  int currentPage = 1;
  bool hasMore = true;

  @override
  void onInit() {
    super.onInit();
    allContact();
    getAllGroups();
  }

  Future<bool> allContact({
    String searchQuery = '',
    bool loadMore = false,
  }) async
  {
    try {
      if (loadMore) {
        if (isLoadMore || !hasMore) return false;
        isLoadMore = true;
        currentPage++;
      } else {
        isLoading = true;
        currentPage = 1;
        hasMore = true;
      }
      errorMessage = null;
      update();

      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      String targetUrl =
          "${ApiUrl.CONTACTS}?channelId=$channelId&page=$currentPage&limit=10";
      if (searchQuery.isNotEmpty) {
        targetUrl =
            "${ApiUrl.CONTACTS}?search=$searchQuery&channelId=$channelId&page=$currentPage&limit=10";
      }

      final response = await _apiService.get(endUrl: targetUrl);
      log("All contact Url for the ${jsonEncode(response.data)}");
      if (response is ApiSuccess) {
        final List<dynamic> responseData = response.data['data'] is List
            ? response.data['data']
            : [];

        final newContacts = responseData
            .map(
              (jsonItem) =>
                  ContactsList.fromJson(jsonItem as Map<String, dynamic>),
            )
            .toList();

        if (newContacts.isEmpty) {
          hasMore = false;
        }

        if (loadMore) {
          contacts.addAll(newContacts);
        } else {
          contacts = newContacts;
        }

        isFirstLoad = false;
        return true;
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to load contacts';
        return false;
      } else {
        errorMessage = 'Failed to load contacts';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      return false;
    } finally {
      isLoading = false;
      isLoadMore = false;
      update();
    }
  }

  Future<bool> updateContact(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiService.put(
        endUrl: "${ApiUrl.CONTACTS}/$id",
        data: data,
      );
      if (response is ApiSuccess) {
        return true;
      } else {
        errorMessage = response.message ?? 'Failed to update contact';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      return false;
    }
  }

  Future<void> getAllGroups() async {
    isGroupsLoading = true;
    update();

    try {
      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      final response = await _apiService.get(
        endUrl: "${ApiUrl.GROUPS}?channelId=$channelId",
      );
      log("all groups data loaded ${jsonEncode(response.data)}");
      if (response is ApiSuccess) {
        if (response.data != null) {
          allGroups = AllGroupsModel.fromJson(response.data).groups;
        }
      }
    } catch (e) {
      log("Error fetching groups: $e");
    } finally {
      isGroupsLoading = false;
      update();
    }
  }

  Future<bool> addToGroup(String contactId, String groupName) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      final response = await _apiService.post(
        endUrl: "${ApiUrl.GROUPS}/add-contacts",
        data: {
          "contactIds": [contactId],
          "groupName": groupName,
          "channelId": channelId,
        },
      );

      if (response is ApiSuccess) {
        if (response.data != null && response.data['success'] == true) {
          return true;
        }
        return false;
      } else {
        errorMessage = response.message ?? 'Failed to add contact to group';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      return false;
    }
  }

  Future<bool> removeFromGroup(String contactId, String groupName) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      final response = await _apiService.post(
        endUrl: "${ApiUrl.GROUPS}/remove-contacts",
        data: {
          "contactIds": [contactId],
          "groupName": groupName,
          "channelId": channelId,
        },
      );

      if (response is ApiSuccess) {
        if (response.data != null && response.data['success'] == true) {
          return true;
        }
        return false;
      } else {
        errorMessage =
            response.message ?? 'Failed to remove contact from group';
        return false;
      }
    } catch (e) {
      errorMessage = e.toString();
      return false;
    }
  }
}
