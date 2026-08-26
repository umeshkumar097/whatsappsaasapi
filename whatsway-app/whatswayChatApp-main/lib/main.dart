import 'dart:io';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sizer/sizer.dart';
import 'package:toastification/toastification.dart';
import 'package:waki/binding/network_bindings.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/controllers/chat_controller.dart';
import 'package:waki/controllers/login_controller.dart';
import 'package:waki/firebase_options.dart';
import 'package:waki/theme/app_theme.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:waki/notification/notification_handeler.dart';
// Import your new websocket service here:
import 'modules/chatRoomModule/web_socket.dart';
import 'modules/loginmodule/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await NotificationHandler.instance.initialize();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  // Injecting controllers and global services
  final loginCtrl = Get.put(LoginController());
  final chatCtrl = Get.put(ChatController());
  final wsService = Get.put(
    WebSocketService(),
  ); // <--- Starts socket lifecycle immediately

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      left: false,
      right: false,
      bottom: Platform.isIOS ? false : true,
      child: ToastificationWrapper(
        child: Sizer(
          builder: (context, orientation, screenType) => GetMaterialApp(
            title: AppConstants.appName,
            debugShowCheckedModeBanner: false,
            defaultTransition: Transition.rightToLeftWithFade,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.light,
            home: const SplashScreen(),
            initialBinding: NetworkBinding(),
          ),
        ),
      ),
    );
  }
}
