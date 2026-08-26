import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:waki/controllers/chat_controller.dart';

class NetworkController extends GetxController {
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription<List<ConnectivityResult>> _subscription;

  // Observable so any widget can react
  final RxBool isConnected = true.obs;
  bool _bannerShown = false;

  @override
  void onInit() {
    super.onInit();
    _checkInitial();
    _subscription = _connectivity.onConnectivityChanged.listen(
      _onConnectivityChanged,
    );
  }

  Future<void> _checkInitial() async {
    final result = await _connectivity.checkConnectivity();
    _handleResult(result);
  }

  void _onConnectivityChanged(List<ConnectivityResult> results) {
    _handleResult(results);
  }

  void _handleResult(List<ConnectivityResult> results) async {
    final connected = !results.contains(ConnectivityResult.none);
    isConnected.value = connected;
    if (!connected) {
      _showBanner();
    } else {
      _hideBanner();
      final chatController = Get.find<ChatController>();
      await chatController.loadConversations();
      await chatController.loadPinedConversations();
    }
  }

  void _showBanner() {
    if (_bannerShown) return;
    _bannerShown = true;

    final context = Get.context;
    if (context == null) return;

    ScaffoldMessenger.of(context).showMaterialBanner(
      MaterialBanner(
        backgroundColor: Colors.red,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        leading: const Icon(
          Icons.wifi_off_rounded,
          color: Colors.white,
          size: 28,
        ),
        content: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: const [
            Text(
              'No Internet Connection',
              style: TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 2),
            Text(
              'Please check your network and try again.',
              style: TextStyle(color: Colors.white70, fontSize: 12),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => _hideBanner(),
            child: const Text(
              'DISMISS',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _hideBanner() {
    if (!_bannerShown) return;
    _bannerShown = false;
    final context = Get.context;
    if (context == null) return;
    ScaffoldMessenger.of(context).hideCurrentMaterialBanner();
  }

  @override
  void onClose() {
    _subscription.cancel();
    super.onClose();
  }
}
