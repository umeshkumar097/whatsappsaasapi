import 'dart:convert';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/api_service.dart';
import 'package:waki/network/session_manager.dart';
import '../models/all_channel_model.dart';
import '../models/login_model.dart';

class LoginController extends GetxController {
  final ApiService _apiService = ApiService();
  bool isLoading = false;
  List<AllChannels> channelsList = [];
  LoginModel? _user;
  String? errorMessage;
  LoginModel? get user => _user;

  Future<bool> login({
    required String username,
    required String password,
  }) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final response = await _apiService.post(
        endUrl: ApiUrl.LOGIN_END_POINT,
        data: {"username": username, "password": password},
      );
      if (response is ApiSuccess) {
        String? setCookieHeader = response.headers?['set-cookie'];
        String? csrfToken;
        String? connectSid;
        if (setCookieHeader != null) {
          List<String> rawCookies = setCookieHeader.split(',');
          for (var cookie in rawCookies) {
            String cookiePair = cookie.split(';').first.trim();
            int separatorIndex = cookiePair.indexOf('=');
            if (separatorIndex != -1) {
              String key = cookiePair.substring(0, separatorIndex).trim();
              String value = cookiePair.substring(separatorIndex + 1).trim();
              log("my crf token key:- $key and value:- $value");
              if (key == 'csrf_token') {
                csrfToken = value;
              } else if (key == 'connect.sid') {
                connectSid = value;
              }
            }
          }
        }
        debugPrint('CSRF Token: $csrfToken');
        debugPrint('Connect SID: $connectSid');
        debugPrint('userdata: ${jsonEncode(response.data['user'])}');
        await SessionManager.saveSession(
          csrfToken: csrfToken.toString(),
          connectSid: connectSid.toString(),
          userdata: jsonEncode(response.data['user']),
        );
        await fetchChannels();
        return true;
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? "Error in Login";
        log("Failed to loginController error:- $errorMessage");
        return false;
      }
    } catch (e) {
      log("Exception in loginController method login():- $e");
    } finally {
      isLoading = false;
      update();
    }
    return false;
  }

  Future<void> fetchChannels() async {
    try {
      isLoading = true;
      update();
      final response = await _apiService.get(endUrl: ApiUrl.CHANNELS);

      if (response is ApiSuccess) {
        final List<dynamic> rawChannelsList = response.data['data'] ?? [];
        channelsList = rawChannelsList
            .map((channelJson) => AllChannels.fromJson(channelJson))
            .toList();
      } else if (response is ApiFailure) {
        final error = response.message ?? "Error fetching channels";
        log("Failed to fetchChannels error:- $error");
      }
    } catch (e) {
      log("Exception in loginController method fetchChannels():- $e");
    } finally {
      isLoading = false;
      update();
    }
  }

  // Future<bool> login(String username, String password) async {
  //   print("login Controller ${username} passowrd:- ${password}");
  //   _isLoading = true;
  //   _errorMessage = null;
  //   notifyListeners(); // Tells the login button to show a circular progress indicator
  //   try {
  //     print("_networkService login api");
  //     final response = await _networkService.login(username, password);
  //     // http package returns body as a raw String, so we decode it here
  //     final Map<String, dynamic> responseData = jsonDecode(response.body);
  //     print("status code:- ${response.statusCode}");
  //     print("status data:- ${responseData}");
  //     if (response.statusCode == 200 || response.statusCode == 201) {
  //       final ApiCalls _networkService = ApiCalls();
  //       channelsList = await _networkService.fetchChannels();
  //       notifyListeners();
  //       Fluttertoast.showToast(
  //         msg: "login Success",
  //         toastLength: Toast.LENGTH_SHORT,
  //         gravity: ToastGravity.BOTTOM,
  //         timeInSecForIosWeb: 1,
  //         backgroundColor: Colors.green,
  //         textColor: Colors.white,
  //         fontSize: 16.0,
  //       );
  //       print("login sucess");
  //       return true;
  //     } else {
  //       print("error:- ${responseData}");

  //       Fluttertoast.showToast(
  //         msg: "${responseData['error']}",
  //         toastLength: Toast.LENGTH_SHORT,
  //         gravity: ToastGravity.BOTTOM,
  //         timeInSecForIosWeb: 1,
  //         backgroundColor: Colors.red,
  //         textColor: Colors.white,
  //         fontSize: 16.0,
  //       );
  //       // Safely grab error messages from your backend response payload
  //       final errorMessage = responseData['error'] ?? 'Failed to authenticate';
  //       return false;
  //     }
  //   } catch (e) {
  //     print("catch:- ${e}");
  //     _isLoading = false;
  //     // Cleans up standard raw exception prefixes for a user-friendly error message
  //     _errorMessage = e.toString().replaceAll('Exception: ', '');
  //     notifyListeners();
  //     return false; // Authentication failed
  //   }
  // }

  void logout() {
    _user = null;
  }
}
