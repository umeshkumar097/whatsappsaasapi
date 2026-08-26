import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;

      default:
        return android;
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: "AIzaSyCOtsoZq_bIne",
    projectId: "whatsway-prod",
    storageBucket: "whatsway-prod.firebasestorage.app",
    messagingSenderId: "whatsway-prod",
    appId: "1:664686430068:android:369f03ad",
  );
}
