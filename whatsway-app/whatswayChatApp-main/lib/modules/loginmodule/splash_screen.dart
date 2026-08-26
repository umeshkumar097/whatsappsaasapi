import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waki/controllers/profile_controller.dart';
import 'package:waki/controllers/settings_controller.dart';
import 'package:waki/models/chat_conversation_model.dart' as chat_model;
import 'package:waki/modules/chatRoomModule/chat_room_screen.dart';
import 'package:waki/modules/chat_list_module/chatListing.dart';
import 'package:waki/network/brand_settings_storage.dart';
import 'package:waki/utiles/app_utils.dart';
import '../../theme/app_colors.dart';
import 'login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final settingsController = Get.put(SettingController());
  final profileController = Get.put(ProfileController());

  String? _brandLogo;
  String? _brandTitle;

  @override
  void initState() {
    super.initState();
    _loadBrandSettings();
    Timer(const Duration(seconds: 1), () async {
      if (mounted) {
        final prefs = await SharedPreferences.getInstance();
        String token = prefs.getString('token').toString();
        if (token.isEmpty ||
            token == "null" ||
            profileController.errorMessage != null) {
          Get.offAll(() => LoginScreen());
        } else {
          Get.offAll(() => Chatlisting());
          Future.delayed(
            const Duration(seconds: 1),
            () => appKillStateNotification(),
          );
        }
      }
    });
  }

  Future<void> appKillStateNotification() async {
    FirebaseMessaging.instance.getInitialMessage().then((
      RemoteMessage? message,
    ) {
      if (message != null && message.data.isNotEmpty) {
        try {
          final data = message.data;
          final conversationId = data['conversationId']?.toString();
          if (conversationId != null && conversationId.isNotEmpty) {
            final messageType = data['messageType']?.toString() ?? 'whatsapp';
            final mobileNumber = data['mobileNumber']?.toString() ?? '';

            bool chatPined = false;
            if (data['chatPined'] != null) {
              if (data['chatPined'] is bool) {
                chatPined = data['chatPined'] as bool;
              } else {
                chatPined =
                    data['chatPined'].toString().toLowerCase() == 'true';
              }
            }

            bool archivechat = false;
            if (data['archivechat'] != null) {
              if (data['archivechat'] is bool) {
                archivechat = data['archivechat'] as bool;
              } else {
                archivechat =
                    data['archivechat'].toString().toLowerCase() == 'true';
              }
            }

            chat_model.ChatConversation? chatConversation;
            if (data['chatConversation'] != null &&
                data['chatConversation'] is String &&
                (data['chatConversation'] as String).isNotEmpty) {
              try {
                final decoded = jsonDecode(data['chatConversation'] as String);
                chatConversation = chat_model.ChatConversation.fromJson(
                  decoded,
                );
              } catch (e) {
                log('Error parsing chatConversation string: $e');
              }
            } else if (data['chatConversation'] is Map<String, dynamic>) {
              try {
                chatConversation = chat_model.ChatConversation.fromJson(
                  data['chatConversation'] as Map<String, dynamic>,
                );
              } catch (e) {
                log('Error parsing chatConversation map: $e');
              }
            }

            // Parse direct properties or populate fallback minimal ChatConversation
            if (chatConversation == null) {
              final assignedTo = data['assignedTo'];
              final assignedToName = data['assignedToName'];
              final contactName = data['contactName'] ?? data['title'];
              chatConversation = chat_model.ChatConversation(
                id: conversationId,
                assignedTo: assignedTo,
                assignedToName: assignedToName,
                contactName: contactName,
                contact: chat_model.Contact(name: contactName ?? 'Anonymous'),
              );
            } else {
              if (chatConversation.assignedTo == null &&
                  data['assignedTo'] != null) {
                chatConversation.assignedTo = data['assignedTo'];
              }
              if (chatConversation.assignedToName == null &&
                  data['assignedToName'] != null) {
                chatConversation.assignedToName = data['assignedToName'];
              }
              if (chatConversation.contact == null) {
                final contactName =
                    chatConversation.contactName ??
                    data['contactName'] ??
                    data['title'] ??
                    'Anonymous';
                chatConversation.contact = chat_model.Contact(
                  name: contactName,
                );
              }
            }

            Get.to(
              () => ChatRoomScreen(
                conversationId: conversationId,
                mobileNumber: mobileNumber,
                messageType: messageType,
                chatPined: chatPined,
                archivechat: archivechat,
                chatConversation: chatConversation,
              ),
            );
          }
        } catch (e) {
          log('Error handling appKillStateNotification navigation: $e');
        }
      }
    });
  }

  Future<void> _loadBrandSettings() async {
    final logo = await BrandSettingsStorage.getLogo();
    final title = await BrandSettingsStorage.getTitle();
    if (mounted) {
      setState(() {
        _brandLogo = logo;
        _brandTitle = title;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
          child: Column(
            children: [
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Brand Identity
                    GetBuilder<SettingController>(
                      builder: (controller) {
                        final logoUrl =
                            controller.settingsData?.favicon ?? _brandLogo;
                        final titleText =
                            controller.settingsData?.title ??
                            _brandTitle ??
                            'Waki';

                        return Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (logoUrl != null && logoUrl.isNotEmpty)
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.network(
                                  AppUtils.getFullImageUrl(logoUrl),
                                  height: 40,
                                  width: 40,
                                  fit: BoxFit.contain,
                                  errorBuilder: (context, error, stackTrace) =>
                                      const Icon(
                                        Icons.chat_bubble_outline_rounded,
                                        color: Color(0xFF34A853),
                                        size: 40,
                                      ),
                                ),
                              )
                            else
                              const Icon(
                                Icons.chat_bubble_outline_rounded,
                                color: Color(0xFF34A853),
                                size: 40,
                              ),
                            const SizedBox(width: 10),
                            Text(
                              titleText,
                              style: TextStyle(
                                fontSize: 36,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textDark,
                                letterSpacing: -0.8,
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                    const SizedBox(height: 16),

                    // Value Proposition Headings
                    RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textDark,
                          height: 1.3,
                        ),
                        children: [
                          TextSpan(text: 'Scale Your Business with\n'),
                          TextSpan(
                            text: 'Customer Engagement',
                            style: TextStyle(color: AppColors.primaryGreen),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Subtitle
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16.0),
                      child: Text(
                        'Unlock powerful automation, bulk messaging, and advanced analytics via Meta WhatsApp Business API.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textGrey,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Bottom Section: Relocated Mobile Metrics
              Column(
                children: [
                  Divider(color: Colors.grey.withOpacity(0.15), thickness: 1),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildBottomMetric('50,000+', 'Active Users'),
                      _buildBottomMetric('98%', 'Delivery Rate'),
                      _buildBottomMetric('5x', 'Engagement'),
                    ],
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper builder for native, clean mobile metrics layout
  Widget _buildBottomMetric(String value, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: AppColors.textGrey,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
