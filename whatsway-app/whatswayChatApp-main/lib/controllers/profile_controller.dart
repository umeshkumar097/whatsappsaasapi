import 'dart:convert';
import 'dart:developer';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/models/profile_data_model.dart';
import 'package:waki/modules/loginmodule/login_screen.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/api_service.dart';
import 'package:waki/network/session_manager.dart';

class ProfileController extends GetxController {
  final ApiService _apiService = ApiService();
  bool isLoading = false;
  ProfileDataModel? profileDataModel;
  String? errorMessage;

  @override
  void onInit() {
    getProfileData();
    getFCMToken();
    super.onInit();
  }

  Future<void> getFCMToken() async {
    try {
      final fcmToke = await FirebaseMessaging.instance.getToken() ?? "";
      debugPrint("FCM Token:- $fcmToke");
      if (fcmToke.isNotEmpty) {
        updateFCMToken(fcmToke: fcmToke);
      }
    } catch (e) {
      log("Exception in ProfileController method getFCMToken():- $e");
    }
  }

  Future<void> getProfileData() async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final response = await _apiService.get(endUrl: ApiUrl.PROFILE);
      if (response is ApiSuccess) {
        profileDataModel = ProfileDataModel.fromJson(response.data);
        final userJson = jsonEncode(profileDataModel?.toJson());
        await SessionManager.saveUser(userjson: userJson);
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to getProfileData';
        log("Failed to getProfileData error:- $errorMessage");
        if (errorMessage == "Not authenticated") {
          await SessionManager.logOut();
          Get.offAll(() => LoginScreen());
        }
      } else {
        errorMessage = 'Failed to getProfileData';
        log("Failed to getProfileData error:- $errorMessage");
        if (errorMessage == "Not authenticated") {
          await SessionManager.logOut();
          Get.offAll(() => LoginScreen());
        }
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception in ProfileController method getProfileData():- $e");
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<void> logoutUser() async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final response = await _apiService.post(endUrl: ApiUrl.LOGOUT_USER);
      if (response is ApiSuccess) {
        await SessionManager.logOut();
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to logoutUser';
        log("Failed to logoutUser error:- $errorMessage");
      } else {
        errorMessage = 'Failed to logoutUser';
        log("Failed to logoutUser error:- $errorMessage");
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception in ProfileController method logoutUser():- $e");
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<void> updateFCMToken({required String fcmToke}) async {
    try {
      debugPrint("FCM Token:- $fcmToke");
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString(AppConstants.userId);
      final response = await _apiService.put(
        endUrl: "${ApiUrl.UPDATE_USER}/$userId",
        data: {"fcmToken": fcmToke},
      );
      if (response is ApiSuccess) {
        log("FCM token updated successfully");
      } else if (response is ApiFailure) {
        log("Failed to updateFCMToken ");
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Exception in ProfileController method updateFCMToken():- $e");
    }
  }
}
