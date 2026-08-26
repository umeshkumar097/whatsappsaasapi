class ProfileDataModel {
  String? id;
  String? username;
  String? email;
  String? firstName;
  String? lastName;
  String? role;
  String? avatar;
  String? status;
  List<String>? permissions;
  dynamic channelId;
  DateTime? lastLogin;
  DateTime? createdAt;
  DateTime? updatedAt;
  dynamic createdBy;
  dynamic fcmToken;
  bool? isEmailVerified;
  dynamic stripeCustomerId;
  dynamic razorpayCustomerId;
  dynamic paypalCustomerId;
  dynamic paystackCustomerCode;
  dynamic mercadopagoCustomerId;

  ProfileDataModel({
    this.id,
    this.username,
    this.email,
    this.firstName,
    this.lastName,
    this.role,
    this.avatar,
    this.status,
    this.permissions,
    this.channelId,
    this.lastLogin,
    this.createdAt,
    this.updatedAt,
    this.createdBy,
    this.fcmToken,
    this.isEmailVerified,
    this.stripeCustomerId,
    this.razorpayCustomerId,
    this.paypalCustomerId,
    this.paystackCustomerCode,
    this.mercadopagoCustomerId,
  });

  factory ProfileDataModel.fromJson(Map<String, dynamic> json) =>
      ProfileDataModel(
        id: json["id"],
        username: json["username"],
        email: json["email"],
        firstName: json["firstName"],
        lastName: json["lastName"],
        role: json["role"],
        avatar: json["avatar"],
        status: json["status"],
        permissions: json["permissions"] == null
            ? []
            : List<String>.from(json["permissions"]!.map((x) => x)),
        channelId: json["channelId"],
        lastLogin: json["lastLogin"] == null
            ? null
            : DateTime.parse(json["lastLogin"]),
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        createdBy: json["createdBy"],
        fcmToken: json["fcmToken"],
        isEmailVerified: json["isEmailVerified"],
        stripeCustomerId: json["stripeCustomerId"],
        razorpayCustomerId: json["razorpayCustomerId"],
        paypalCustomerId: json["paypalCustomerId"],
        paystackCustomerCode: json["paystackCustomerCode"],
        mercadopagoCustomerId: json["mercadopagoCustomerId"],
      );

  Map<String, dynamic> toJson() => {
    "id": id,
    "username": username,
    "email": email,
    "firstName": firstName,
    "lastName": lastName,
    "role": role,
    "avatar": avatar,
    "status": status,
    "permissions": permissions == null
        ? []
        : List<dynamic>.from(permissions!.map((x) => x)),
    "channelId": channelId,
    "lastLogin": lastLogin?.toIso8601String(),
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "createdBy": createdBy,
    "fcmToken": fcmToken,
    "isEmailVerified": isEmailVerified,
    "stripeCustomerId": stripeCustomerId,
    "razorpayCustomerId": razorpayCustomerId,
    "paypalCustomerId": paypalCustomerId,
    "paystackCustomerCode": paystackCustomerCode,
    "mercadopagoCustomerId": mercadopagoCustomerId,
  };
}
