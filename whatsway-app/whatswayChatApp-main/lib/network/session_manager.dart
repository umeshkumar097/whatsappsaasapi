import 'dart:convert';

import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/modules/loginmodule/login_screen.dart';

class SessionManager {
  static Future<void> saveSession({
    required String csrfToken,
    required String connectSid,
    required String userdata, // Specified type as String for safety
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.keyCsrfToken, csrfToken);
    await prefs.setString(AppConstants.keyConnectSid, connectSid);
    await prefs.setString(AppConstants.userdata, userdata);
  }

  Future<void> savechannelId({required String channelid}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.channelId, channelid);
  }

  static Future<void> saveUser({required String userjson}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.userdata, userjson);
    await prefs.setString(AppConstants.userId, json.decode(userjson)['id']);
  }

  /// Generates clean headers for HTTP REST APIs and WebSockets
  static Future<Map<String, String>> getAuthHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final csrfToken = prefs.getString(AppConstants.keyCsrfToken) ?? '';

    // 🛠️ CRITICAL FIX 1: URL Decode the session token string.
    // If the token contains '%3A', Uri.decodeComponent turns it back into a real ':'
    String connectSid = prefs.getString(AppConstants.keyConnectSid) ?? '';
    if (connectSid.contains('%')) {
      connectSid = Uri.decodeComponent(connectSid);
    }

    // Compile clean Cookie layout sequences safely
    final List<String> cookieParts = [];
    if (connectSid.isNotEmpty) cookieParts.add('connect.sid=$connectSid');
    if (csrfToken.isNotEmpty) cookieParts.add('csrf_token=$csrfToken');
    final String cleanCookieHeader = cookieParts.join('; ');

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-Token': csrfToken,
      'Cookie': cleanCookieHeader,
      // 🛠️ CRITICAL FIX 2: Anchor the origin and agent profile fingerprints
      // 'Origin': 'https://whatsway.diploy.in',
      // 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    };
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.keyCsrfToken);
    await prefs.remove(AppConstants.keyConnectSid);
    await prefs.remove(AppConstants.userdata);
    await prefs.remove(AppConstants.userId);
  }

  static Future<void> logOut() async {
    await clearSession();
    Get.offAll(() => LoginScreen());
  }
}