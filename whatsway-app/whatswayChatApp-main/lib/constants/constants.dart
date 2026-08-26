class AppConstants {
  static const String appName = 'Waki';
  static const String keyCsrfToken = 'token';
  static const String keyConnectSid = 'sid';
  static const String userdata = 'userdata';
  static const String userId = 'userId';
  static const String channelId = 'channelId';
}

class ApiUrl {
  static const String BASE_URL = 'https://app.waki.in/api';
  static const String IMAGE_BASE_URL = 'https://app.waki.in';
  static const String LOGIN_END_POINT = '/auth/login';
  static const String CHANNELS = '/channels';
  static const String CONVERSATION = '/conversations';
  static const String CONTACTS = '/contacts';
  static const String GROUPS = '/groups';
  static const String TEMPLATES = '/templates';
  static const String SEND_WHATSAPP_MESSAGE = '/messages/send';
  static const String GET_MEMBERS = '/team/members';
  static const String PROFILE = '/auth/me';
  static const String LOGOUT_USER = '/auth/logout';
  static const String PINNED_CONVERSATION = '/conversations/pins';
  static const String FORGOT_PASSWORD = '/auth/forgot-password';
  static const String VERIFY_OTP = '/auth/verify-otp';
  static const String RESET_PASSWORD = '/auth/reset-password';
  static const String MEDIA_PROXY = '/messages/media-proxy';
  static const String SETTINGS = '/brand-settings';
  static const String UPDATE_USER = '/users';
}
