import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:pinput/pinput.dart';
import 'package:sizer/sizer.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/constants/image_path.dart';
import 'package:waki/theme/app_colors.dart';
import 'package:waki/utiles/app_utils.dart';
import 'package:waki/widgets/common_text_field.dart';
import 'package:waki/widgets/custom_elevated_button.dart';
import '../../controllers/forgot_password_controller.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailFormKey = GlobalKey<FormState>();
  final _passwordFormKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();
  final _otpController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isNewPasswordObscured = true;
  bool _isConfirmPasswordObscured = true;

  @override
  void dispose() {
    _emailController.dispose();
    _otpController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.black),
          onPressed: () => Get.back(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: GetBuilder<ForgotPasswordController>(
          init: ForgotPasswordController(),
          builder: (controller) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: 5.h),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(ImagePath.applogo, height: 40, width: 40),
                    const SizedBox(width: 8),
                    Text(
                      AppConstants.appName.toUpperCase(),
                      style: TextStyle(
                        fontSize: 20.sp,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryGreen,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  "Reset Your Password",
                  style: TextStyle(
                    fontSize: 21.sp,
                    fontWeight: FontWeight.bold,
                    color: AppColors.black,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 32),
                Container(
                  padding: const EdgeInsets.all(24.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: _buildPhaseContent(controller),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildPhaseContent(ForgotPasswordController controller) {
    switch (controller.currentPhase) {
      case ForgotPasswordPhase.enterEmail:
        return _buildEnterEmailPhase(controller);
      case ForgotPasswordPhase.verifyOtp:
        return _buildVerifyOtpPhase(controller);
      case ForgotPasswordPhase.resetPassword:
        return _buildResetPasswordPhase(controller);
    }
  }

  Widget _buildEnterEmailPhase(ForgotPasswordController controller) {
    return Form(
      key: _emailFormKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Enter your registered email address to receive an OTP.",
            style: TextStyle(color: AppColors.textGrey, fontSize: 14),
          ),
          const SizedBox(height: 20),
          CommonTextField(
            controller: _emailController,
            hintText: 'Email Address',
            labelText: 'Enter Email',
            prefixIcon: const Icon(Icons.email_outlined, size: 20),
            onChanged: (val) {
              if (controller.errorMessage != null) {
                controller.errorMessage = null;
                controller.update();
              }
            },
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              if (!GetUtils.isEmail(value)) {
                return 'Please enter a valid email address';
              }
              if (controller.errorMessage != null) {
                return controller.errorMessage;
              }
              return null;
            },
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: CustomElevatedButton(
              isLoading: controller.isLoading,
              loadingText: 'Sending OTP...',
              onPressed: () async {
                HapticFeedback.lightImpact();
                if (_emailFormKey.currentState!.validate()) {
                  bool success = await controller.sendOtp(
                    _emailController.text.trim(),
                  );
                  if (success) {
                    AppUtils.showToast(
                      message:
                          'OTP sent successfully to ${_emailController.text.trim()}',
                    );
                  } else {
                    _emailFormKey.currentState!.validate();
                  }
                }
              },
              text: 'Send OTP',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVerifyOtpPhase(ForgotPasswordController controller) {
    final defaultPinTheme = PinTheme(
      width: 50,
      height: 50,
      textStyle: const TextStyle(
        fontSize: 20,
        color: AppColors.black,
        fontWeight: FontWeight.w600,
      ),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(10),
      ),
    );

    final focusedPinTheme = defaultPinTheme.copyDecorationWith(
      border: Border.all(color: AppColors.primaryGreen),
      borderRadius: BorderRadius.circular(10),
    );

    final submittedPinTheme = defaultPinTheme.copyWith(
      decoration: defaultPinTheme.decoration?.copyWith(
        color: const Color(0xFFF3F4F6),
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Text(
          "Enter the 6-digit OTP sent to your email.",
          textAlign: TextAlign.center,
          style: TextStyle(color: AppColors.textGrey, fontSize: 14),
        ),
        const SizedBox(height: 24),
        Pinput(
          length: 6,
          controller: _otpController,
          defaultPinTheme: defaultPinTheme,
          focusedPinTheme: focusedPinTheme,
          submittedPinTheme: submittedPinTheme,
          showCursor: true,
          onCompleted: (pin) async {
            HapticFeedback.lightImpact();
            bool success = await controller.verifyOtp(pin);
            if (success) {
              AppUtils.showToast(message: 'OTP verified successfully');
            } else {
              AppUtils.showToast(
                message: controller.errorMessage ?? 'Invalid OTP',
              );
              _otpController.clear();
            }
          },
        ),
        const SizedBox(height: 24),
        if (controller.isLoading)
          Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  height: 20,
                  width: 20,
                  child: AppUtils.widgetLoader(strokeWidth: 2),
                ),
                SizedBox(width: 10),
                Text(
                  'Please wait...',
                  style: TextStyle(
                    fontSize: 15.sp,
                    color: AppColors.primaryGreen,
                  ),
                ),
              ],
            ),
          )
        else ...[
          if (controller.timerSeconds > 0)
            Text(
              "Resend OTP in ${controller.timerSeconds}s",
              style: const TextStyle(color: AppColors.textGrey, fontSize: 14),
            )
          else
            GestureDetector(
              onTap: () async {
                HapticFeedback.lightImpact();
                bool success = await controller.sendOtp(controller.email);
                if (success) {
                  AppUtils.showToast(message: 'OTP resent successfully');
                }
              },
              child: Text(
                "Resend OTP",
                style: TextStyle(
                  color: AppColors.primaryGreen,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
        ],
      ],
    );
  }

  Widget _buildResetPasswordPhase(ForgotPasswordController controller) {
    return Form(
      key: _passwordFormKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Enter your new password below.",
            style: TextStyle(color: AppColors.textGrey, fontSize: 14),
          ),
          const SizedBox(height: 20),
          CommonTextField(
            controller: _newPasswordController,
            obscureText: _isNewPasswordObscured,
            hintText: 'New Password',
            labelText: 'Enter New Password',
            prefixIcon: const Icon(Icons.lock_outline, size: 20),
            suffixIcon: IconButton(
              icon: Icon(
                _isNewPasswordObscured
                    ? Icons.visibility_outlined
                    : Icons.visibility_off_outlined,
                size: 20,
                color: AppColors.textGrey,
              ),
              onPressed: () {
                setState(() {
                  _isNewPasswordObscured = !_isNewPasswordObscured;
                });
              },
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a new password';
              }
              if (value.length < 6) {
                return 'Password must be at least 6 characters long';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          CommonTextField(
            controller: _confirmPasswordController,
            obscureText: _isConfirmPasswordObscured,
            hintText: 'Confirm Password',
            labelText: 'Re-enter New Password',
            prefixIcon: const Icon(Icons.lock_outline, size: 20),
            suffixIcon: IconButton(
              icon: Icon(
                _isConfirmPasswordObscured
                    ? Icons.visibility_outlined
                    : Icons.visibility_off_outlined,
                size: 20,
                color: AppColors.textGrey,
              ),
              onPressed: () {
                setState(() {
                  _isConfirmPasswordObscured = !_isConfirmPasswordObscured;
                });
              },
            ),
            onChanged: (val) {
              if (controller.errorMessage != null) {
                controller.errorMessage = null;
                controller.update();
              }
            },
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please confirm your new password';
              }
              if (value != _newPasswordController.text) {
                return 'Passwords do not match';
              }
              if (controller.errorMessage != null) {
                return controller.errorMessage;
              }
              return null;
            },
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: CustomElevatedButton(
              isLoading: controller.isLoading,
              loadingText: 'Resetting...',
              onPressed: () async {
                HapticFeedback.lightImpact();
                if (_passwordFormKey.currentState!.validate()) {
                  bool success = await controller.resetPassword(
                    _newPasswordController.text,
                  );
                  if (success) {
                    AppUtils.showToast(message: 'Password reset successfully');
                    Get.back();
                  } else {
                    _passwordFormKey.currentState!.validate();
                  }
                }
              },
              text: 'Reset Password',
            ),
          ),
        ],
      ),
    );
  }
}
