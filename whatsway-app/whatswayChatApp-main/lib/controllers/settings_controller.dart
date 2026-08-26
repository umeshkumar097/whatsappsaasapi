import 'dart:developer';
import 'package:get/get.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/models/settings_model.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/api_service.dart';
import 'package:waki/network/brand_settings_storage.dart';

class SettingController extends GetxController {
  final ApiService apiService = ApiService();
  bool isLoading = false;
  bool? isSuccess;
  String? errorMessage;
  SettingsModel? settingsData;

  @override
  void onInit() {
    super.onInit();
    fetchSettings();
  }

  Future<void> fetchSettings() async {
    try {
      isLoading = true;
      errorMessage = null;
      update();
      final response = await apiService.get(endUrl: ApiUrl.SETTINGS);

      if (response is ApiSuccess) {
        settingsData = SettingsModel.fromJson(response.data);
        log("Settings fetched successfully: $settingsData");
        await BrandSettingsStorage.saveBrandSettings(
          logo: settingsData?.favicon,
          title: settingsData?.title,
          tagline: settingsData?.tagline,
        );
      } else if (response is ApiFailure) {
        errorMessage = response.message ?? 'Failed to fetch settings';
        log("Failed to fetch settings: $errorMessage");
      }
    } catch (e) {
      errorMessage = e.toString();
      log("Error fetching settings: $e");
    } finally {
      isLoading = false;
      update();
    }
  }
}
