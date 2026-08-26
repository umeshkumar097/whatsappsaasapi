import 'package:get/get.dart';
import 'package:waki/controllers/chat_controller.dart';
import 'package:waki/controllers/login_controller.dart';
import 'package:waki/controllers/network_controller.dart';
import 'package:waki/controllers/profile_controller.dart';
import 'package:waki/controllers/settings_controller.dart';

import '../controllers/contact_controller.dart';
import '../controllers/message_room_controller.dart';
import '../controllers/templates_controller.dart';

class NetworkBinding extends Bindings {
  @override
  void dependencies() {
    Get.put(NetworkController(), permanent: true);
    Get.put(ProfileController(), permanent: true);
    Get.put(SettingController(), permanent: true);

    // ---------Create Object Only When Needed---------------
    Get.lazyPut(() => ChatController(), fenix: true);
    Get.lazyPut(() => LoginController(), fenix: true);
    Get.lazyPut(() => ContactController(), fenix: true);
    Get.lazyPut(() => TemplatesController(), fenix: true);
    Get.lazyPut(() => MessageRoomController(), fenix: true);
  }
}
