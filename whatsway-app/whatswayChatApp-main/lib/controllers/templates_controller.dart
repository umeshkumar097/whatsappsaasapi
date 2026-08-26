
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/api_service.dart';
import '../models/template_model.dart';

class TemplatesController extends GetxController {
  final ApiService _apiService = ApiService();

  bool isLoading = false;
  List<AllTemplates> allTemplates = [];
  String? errorMessage;
  bool isFirstLoad = true;

  @override
  void onInit() {
    super.onInit();
    getTemplates();
  }


  Future<bool> getTemplates({String searchQuery = ''}) async {
    try {
      isLoading = true;
      errorMessage = null;
      update();

      final prefs = await SharedPreferences.getInstance();
      String channelId = prefs.getString(AppConstants.channelId) ?? '';

      String targetUrl = "${ApiUrl.TEMPLATES}?channelId=$channelId";
      if (searchQuery.isNotEmpty) {
        targetUrl += "&search=$searchQuery";
      }
      final response = await _apiService.get(endUrl: targetUrl);

      if (response is ApiSuccess) {
        final List<dynamic> responseData = response.data['data'] is List
            ? response.data['data']
            : [];

        allTemplates = responseData
            .map((jsonItem) => AllTemplates.fromJson(jsonItem as Map<String, dynamic>))
            .toList();

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
      update();
    }
  }
}
