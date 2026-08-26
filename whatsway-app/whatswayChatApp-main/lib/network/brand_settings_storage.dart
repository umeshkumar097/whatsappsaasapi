import 'package:shared_preferences/shared_preferences.dart';

class BrandSettingsStorage {
  static const String _keyLogo = 'brand_logo';
  static const String _keyTitle = 'brand_title';
  static const String _keyTagline = 'brand_tagline';

  static Future<void> saveBrandSettings({
    required String? logo,
    required String? title,
    required String? tagline,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    if (logo != null) await prefs.setString(_keyLogo, logo);
    if (title != null) await prefs.setString(_keyTitle, title);
    if (tagline != null) await prefs.setString(_keyTagline, tagline);
  }

  static Future<String?> getLogo() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyLogo);
  }

  static Future<String?> getTitle() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyTitle);
  }

  static Future<String?> getTagline() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyTagline);
  }

  static Future<void> clearBrandSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyLogo);
    await prefs.remove(_keyTitle);
    await prefs.remove(_keyTagline);
  }
}
