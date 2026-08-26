import 'dart:math' as math;
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:toastification/toastification.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/theme/app_colors.dart';

class AppUtils {
  static Future<bool> checkNetwork() async {
    final results = await Connectivity().checkConnectivity();
    if (results.contains(ConnectivityResult.none)) {
      return false;
    }
    return true;
  }

  static bool isValidEmail(String email) {
    return RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    ).hasMatch(email);
  }

  static String getFullImageUrl(String imageUrl) {
    if (imageUrl.startsWith('https')) {
      return imageUrl;
    } else {
      return '${ApiUrl.IMAGE_BASE_URL}$imageUrl';
    }
  }

  static void showToast({
    required String message,
    String? description,
    ToastificationStyle? style,
    ToastificationType? type,
  }) {
    HapticFeedback.lightImpact();
    Toastification().show(
      title: Text(message),
      description: description != null ? Text(description) : null,
      type: type ?? ToastificationType.info,
      style: style ?? ToastificationStyle.minimal,
      backgroundColor: AppColors.black,
      foregroundColor: AppColors.white,
      dragToClose: true,
      alignment: Alignment.bottomCenter,
      autoCloseDuration: const Duration(seconds: 3),
    );
  }

  static Widget widgetLoader({double? strokeWidth}) {
    return CircularProgressIndicator(
      strokeWidth: strokeWidth ?? 3,
      strokeCap: StrokeCap.round,
      backgroundColor: Color(0xFFCAC9C9),
      valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryGreen),
    );
  }

  static Widget paginateLoader() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 15,
              width: 15,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                strokeCap: StrokeCap.round,
                backgroundColor: Color(0xFFCAC9C9),
                valueColor: AlwaysStoppedAnimation<Color>(
                  AppColors.primaryGreen,
                ),
              ),
            ),
            SizedBox(width: 5),
            Text(
              "Hold on Loading more...",
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
          ],
        ),
      ),
    );
  }

  static void showLoadingDialog() {
    showDialog(
      context: Get.context!,
      barrierDismissible: false,
      builder: (context) => Center(
        child: CircularProgressIndicator(
          strokeWidth: 4,
          strokeCap: StrokeCap.round,
          backgroundColor: Color(0xFFCAC9C9),
          valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryGreen),
        ),
      ),
    );
  }

  static void hideLoadingDialog() {
    Get.back();
  }

  static String formatDate(String date) {
    if (date.isEmpty) return "";
    final DateTime dateTime = DateTime.parse(date).toLocal();
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(dateTime);
    if (difference.inSeconds < 60) {
      return "Just now";
    } else if (difference.inMinutes < 60) {
      return "${difference.inMinutes} min ago";
    } else if (difference.inHours < 24) {
      return "${difference.inHours} hr ago";
    } else if (difference.inDays == 1) {
      return "Yesterday";
    } else {
      return DateFormat('dd-MMM-yyyy').format(dateTime);
    }
  }

  static Future<void> launchInBrowser(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.inAppBrowserView)) {
      throw Exception('Could not launch $url');
    }
  }

  static Color getRandomVibrantColor([int? seed]) {
    final List<Color> vibrantColors = [
      const Color(0xFF065C53),
      const Color(0xFF141414),
      const Color(0xFF10600A),
      const Color(0xFF860B25),
      const Color(0xFF25158D),
      const Color(0xFF5C1684),
      const Color(0xFF793906),
      const Color(0xFF120971),
      const Color(0xFF02023F),
      const Color(0xFF611D08),
    ];
    final random = seed != null ? math.Random(seed) : math.Random();
    return vibrantColors[random.nextInt(vibrantColors.length)];
  }
}
