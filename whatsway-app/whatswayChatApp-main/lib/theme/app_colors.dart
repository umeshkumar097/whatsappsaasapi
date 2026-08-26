import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:waki/controllers/settings_controller.dart';

class AppColors {
  AppColors._();

  // Helper method to parse HEX strings to Color
  static Color _fromHex(String? hexString, Color fallback) {
    if (hexString == null || hexString.isEmpty) return fallback;
    try {
      final buffer = StringBuffer();
      if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
      buffer.write(hexString.replaceFirst('#', ''));
      return Color(int.parse(buffer.toString(), radix: 16));
    } catch (_) {
      return fallback;
    }
  }

  // Helper getter to fetch the setting controller safely
  static SettingController? get _settingsController {
    if (Get.isRegistered<SettingController>()) {
      return Get.find<SettingController>();
    }
    return null;
  }

  static Color get primaryGreen => _fromHex(
    _settingsController?.settingsData?.primaryColor,
    const Color(0xFF25D366),
  );

  static Color get background => _fromHex(
    _settingsController?.settingsData?.backgroundColor,
    const Color(0xFFF8FAFC),
  );

  static Color get buttonColor => _fromHex(
    _settingsController?.settingsData?.buttonColor,
    const Color(0xFF128C7E),
  );

  static const Color textDark = Color(0xFF0A192F);
  static const Color textGrey = Color(0xFF64748B);
  static const Color inputBg = Color(0xFFEEF2F6);
  // Footer colors
  static const Color secureGreen = Colors.green;
  static const Color gdprBlue = Colors.blue;
  static const Color supportPurple = Colors.purple;
  static const Color black = Colors.black;
  static const Color white = Colors.white;
  static const Color grey = Colors.grey;
  static const Color dividerColor = Color(0xFFEAEEF3);
  static const Color hintColor = Color(0xFFB2B5B9);
}
