import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:sizer/sizer.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/constants/image_path.dart';
import 'package:waki/modules/chat_list_module/chatListing.dart';
import 'package:waki/widgets/custom_elevated_button.dart';
import '../../controllers/chat_controller.dart';
import '../../controllers/login_controller.dart';
import '../../models/all_channel_model.dart';
import 'forgot_password_screen.dart';
import '../../network/session_manager.dart';
import '../../theme/app_colors.dart';
import '../../widgets/common_text_field.dart';
import '../../widgets/typing_text_animator.dart';
import '../chatRoomModule/web_socket.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final loginCtrl = Get.find<LoginController>();
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isPasswordObscured = false;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background, // Used here
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: GetBuilder<LoginController>(
              builder: (loginCtrl) {
                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
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
                            color: AppColors.primaryGreen, // Used here
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text(
                      "Scale Your Business with",
                      style: TextStyle(
                        fontSize: 21.sp,
                        fontWeight: FontWeight.bold,
                        color: AppColors.black, // Used here
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 20),

                    ShaderMask(
                      blendMode: BlendMode.srcIn,
                      shaderCallback: (bounds) =>
                          LinearGradient(
                            colors: [AppColors.primaryGreen, Colors.black],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ).createShader(
                            Rect.fromLTWH(0, 0, bounds.width, bounds.height),
                          ),
                      child: TypingTextAnimator(
                        texts: const [
                          'Business Growth',
                          'WhatsApp Marketing',
                          'Customer Engagement',
                        ],
                        textAlign: TextAlign.center,
                        speed: const Duration(milliseconds: 80),
                        style: const TextStyle(
                          fontSize: 23,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
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
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 20),
                            CommonTextField(
                              controller: _usernameController,
                              hintText: 'Username',
                              labelText: 'Enter Username',
                              prefixIcon: const Icon(
                                Icons.person_outline,
                                size: 20,
                              ),
                              onChanged: (val) {
                                if (loginCtrl.errorMessage != null) {
                                  loginCtrl.errorMessage = null;
                                  loginCtrl.update();
                                }
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter username';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 20),

                            CommonTextField(
                              controller: _passwordController,
                              obscureText: _isPasswordObscured,
                              hintText: 'Password',
                              labelText: 'Enter Password',
                              prefixIcon: const Icon(
                                Icons.lock_outline,
                                size: 20,
                              ),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _isPasswordObscured
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  size: 20,
                                  color: AppColors.textGrey, // Used here
                                ),
                                onPressed: () {
                                  setState(() {
                                    _isPasswordObscured = !_isPasswordObscured;
                                  });
                                },
                              ),
                              onChanged: (val) {
                                if (loginCtrl.errorMessage != null) {
                                  loginCtrl.errorMessage = null;
                                  loginCtrl.update();
                                }
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter password';
                                }
                                if (loginCtrl.errorMessage != null) {
                                  return loginCtrl.errorMessage;
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 12),
                            Align(
                              alignment: Alignment.centerRight,
                              child: GestureDetector(
                                onTap: () {
                                  Get.to(() => const ForgotPasswordScreen());
                                },
                                child: Text(
                                  'Forgot Password?',
                                  style: TextStyle(
                                    color: AppColors.primaryGreen,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                            SizedBox(
                              width: double.infinity,
                              child: CustomElevatedButton(
                                isLoading: loginCtrl.isLoading,
                                onPressed: () async {
                                  HapticFeedback.lightImpact();
                                  if (_formKey.currentState!.validate()) {
                                    await loginCtrl
                                        .login(
                                          username: _usernameController.text
                                              .trim(),
                                          password: _passwordController.text
                                              .trim(),
                                        )
                                        .then((value) {
                                          if (value == true) {
                                            if (mounted) {
                                              showChannelSelectionDialog(
                                                context: context,
                                                channels:
                                                    loginCtrl.channelsList,
                                              );
                                            }
                                          } else {
                                            _formKey.currentState!.validate();
                                          }
                                        });
                                  }
                                },
                                loadingText: 'Loging in...',
                                text: 'Sign in',
                              ),
                            ),
                            const SizedBox(height: 24),

                            // Row(
                            //   mainAxisAlignment: MainAxisAlignment.center,
                            //   children: [
                            //     const Text(
                            //       "Don't have an account? ",
                            //       style: TextStyle(
                            //         color: AppColors.textGrey,
                            //         fontSize: 14,
                            //       ), // Used here
                            //     ),
                            //     GestureDetector(
                            //       onTap: () {},
                            //       child: const Text(
                            //         'Sign up for free',
                            //         style: TextStyle(
                            //           color: AppColors
                            //               .activeBorderGreen, // Used here
                            //           fontWeight: FontWeight.bold,
                            //           fontSize: 14,
                            //         ),
                            //       ),
                            //     ),
                            //   ],
                            // ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildFooterBadge(
                          AppColors.secureGreen,
                          'Secure Login',
                        ), // Used here
                        const SizedBox(width: 16),
                        _buildFooterBadge(
                          AppColors.gdprBlue,
                          'GDPR Compliant',
                        ), // Used here
                        const SizedBox(width: 16),
                        _buildFooterBadge(
                          AppColors.supportPurple,
                          '24/7 Support',
                        ), // Used here
                      ],
                    ),
                    const SizedBox(height: 30),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFooterBadge(Color dotColor, String label) {
    return Row(
      children: [
        Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textGrey, // Used here
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}

void showChannelSelectionDialog({
  required BuildContext context,
  required List<AllChannels> channels, // Pass your list of API channels here
}) {
  showDialog(
    context: context,
    barrierDismissible: false, // Force selection or explicit redirect
    builder: (BuildContext context) {
      final bool hasChannels = channels.isNotEmpty;

      return Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        backgroundColor: Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icon Header
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: hasChannels
                      ? const Color(0xFFE8F5E9)
                      : const Color(0xFFFEF2F2),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  hasChannels ? Icons.hub_outlined : Icons.link_off_rounded,
                  color: hasChannels ? const Color(0xFF2E7D32) : Colors.red,
                  size: 28,
                ),
              ),
              const SizedBox(height: 16),

              // Title Text
              Text(
                hasChannels ? 'Select Channel' : 'No Channels Found',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0A192F),
                ),
              ),
              const SizedBox(height: 8),

              // Subtitle Text
              Text(
                hasChannels
                    ? 'Choose an active channel to launch your dashboard workspace.'
                    : 'You haven\'t linked any WhatsApp Business API channels yet. Please set one up on our web console.',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF64748B),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),

              // --- Conditional Body Layout ---
              if (hasChannels) ...[
                ConstrainedBox(
                  constraints: const BoxConstraints(maxHeight: 200),
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: channels.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: ListTile(
                          title: Text(
                            channels[index].name ?? "Name",
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          trailing: const Icon(Icons.chevron_right, size: 18),
                          tileColor: const Color(0xFFF8FAFC),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                            side: const BorderSide(color: Color(0xFFF1F5F9)),
                          ),
                          onTap: () async {
                            await SessionManager().savechannelId(
                              channelid: channels[index].id.toString(),
                            );

                            final wsService = Get.put(WebSocketService());
                            wsService.disconnect();
                            wsService.connect();
                            // ignore: use_build_context_synchronously
                            Navigator.of(context).pop();
                            final chatCtrl = Get.find<ChatController>();
                            bool isSuccess = await chatCtrl.loadConversations();
                            if (isSuccess) {
                              Get.offAll(() => const Chatlisting());
                            } else {
                              await SessionManager.clearSession();
                            }
                          },
                        ),
                      );
                    },
                  ),
                ),
              ] else ...[
                // Redirect Button Elements for Web Console Creation
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () async {
                      final Uri url = Uri.parse(
                        'https://yourplatform.com/create-channel',
                      );
                      if (await canLaunchUrl(url)) {
                        await launchUrl(
                          url,
                          mode: LaunchMode.externalApplication,
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E701E),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      elevation: 0,
                    ),
                    child: const Text(
                      'Create Channel on Web',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],

              // Explicit Cancel/Sign Out Option fallback
              TextButton(
                onPressed: () {
                  SessionManager.clearSession();
                  Navigator.pop(context);
                },
                child: const Text(
                  'Cancel',
                  style: TextStyle(color: Color(0xFF64748B), fontSize: 13),
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}
