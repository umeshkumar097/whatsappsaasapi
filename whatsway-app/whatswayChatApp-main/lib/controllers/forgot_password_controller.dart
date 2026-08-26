import 'dart:async';
import 'package:get/get.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/api_service.dart';

enum ForgotPasswordPhase { enterEmail, verifyOtp, resetPassword }

class ForgotPasswordController extends GetxController {
  final ApiService _apiService = ApiService();

  bool isLoading = false;
  bool isResendOtpLoading = false;
  ForgotPasswordPhase currentPhase = ForgotPasswordPhase.enterEmail;
  String? errorMessage;

  String email = '';
  String otp = '';

  // Timer logic
  int timerSeconds = 0;
  Timer? _timer;

  @override
  void onClose() {
    _timer?.cancel();
    super.onClose();
  }

  void startTimer() {
    _timer?.cancel();
    timerSeconds = 90;
    update();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (timerSeconds > 0) {
        timerSeconds--;
        update();
      } else {
        timer.cancel();
      }
    });
  }

  Future<bool> sendOtp(String inputEmail) async {
    isLoading = true;
    errorMessage = null;
    update();

    try {
      final response = await _apiService.post(
        endUrl: ApiUrl.FORGOT_PASSWORD,
        data: {"email": inputEmail},
      );

      if (response is ApiSuccess) {
        if (response.data != null && response.data['success'] == true) {
          email = inputEmail;
          currentPhase = ForgotPasswordPhase.verifyOtp;
          startTimer();
          return true;
        }
        errorMessage = response.data?['message'] ?? 'Failed to send OTP';
        return false;
      } else {
        errorMessage = response.message ?? 'Failed to send OTP';
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

  Future<bool> verifyOtp(String inputOtp) async {
    isLoading = true;
    errorMessage = null;
    update();

    try {
      final response = await _apiService.post(
        endUrl: ApiUrl.VERIFY_OTP,
        data: {"email": email, "otpCode": inputOtp},
      );

      if (response is ApiSuccess) {
        if (response.data != null && response.data['success'] == true) {
          otp = inputOtp;
          currentPhase = ForgotPasswordPhase.resetPassword;
          return true;
        }
        errorMessage = response.data?['message'] ?? 'Invalid OTP';
        return false;
      } else {
        errorMessage = response.message ?? 'Invalid OTP';
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

  Future<bool> resetPassword(String newPassword) async {
    isLoading = true;
    errorMessage = null;
    update();

    try {
      final response = await _apiService.post(
        endUrl: ApiUrl.RESET_PASSWORD,
        data: {"email": email, "otpCode": otp, "newPassword": newPassword},
      );

      if (response is ApiSuccess) {
        if (response.data != null && response.data['success'] == true) {
          return true;
        }
        errorMessage = response.data?['message'] ?? 'Failed to reset password';
        return false;
      } else {
        errorMessage = response.message ?? 'Failed to reset password';
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
