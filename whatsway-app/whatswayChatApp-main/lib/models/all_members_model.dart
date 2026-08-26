class AllMembersModel {
  List<AllMembers>? data;
  String? total;
  int? page;
  int? limit;
  int? totalPages;

  AllMembersModel({
    this.data,
    this.total,
    this.page,
    this.limit,
    this.totalPages,
  });

  factory AllMembersModel.fromJson(Map<String, dynamic> json) =>
      AllMembersModel(
        data: json["data"] == null
            ? []
            : List<AllMembers>.from(
                json["data"]!.map((x) => AllMembers.fromJson(x)),
              ),
        total: json["total"],
        page: json["page"],
        limit: json["limit"],
        totalPages: json["totalPages"],
      );

  Map<String, dynamic> toJson() => {
    "data": data == null
        ? []
        : List<dynamic>.from(data!.map((x) => x.toJson())),
    "total": total,
    "page": page,
    "limit": limit,
    "totalPages": totalPages,
  };
}

class AllMembers {
  String? id;
  String? username;
  String? email;
  String? firstName;
  String? lastName;
  String? role;
  String? status;
  List<String>? permissions;
  String? avatar;
  DateTime? lastLogin;
  DateTime? createdAt;
  DateTime? updatedAt;
  dynamic createdBy;
  dynamic channelId;

  AllMembers({
    this.id,
    this.username,
    this.email,
    this.firstName,
    this.lastName,
    this.role,
    this.status,
    this.permissions,
    this.avatar,
    this.lastLogin,
    this.createdAt,
    this.updatedAt,
    this.createdBy,
    this.channelId,
  });

  factory AllMembers.fromJson(Map<String, dynamic> json) => AllMembers(
    id: json["id"],
    username: json["username"],
    email: json["email"],
    firstName: json["firstName"],
    lastName: json["lastName"],
    role: json["role"],
    status: json["status"],
    permissions: json["permissions"] == null
        ? []
        : List<String>.from(json["permissions"]!.map((x) => x)),
    avatar: json["avatar"],
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
    channelId: json["channelId"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "username": username,
    "email": email,
    "firstName": firstName,
    "lastName": lastName,
    "role": role,
    "status": status,
    "permissions": permissions == null
        ? []
        : List<dynamic>.from(permissions!.map((x) => x)),
    "avatar": avatar,
    "lastLogin": lastLogin?.toIso8601String(),
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "createdBy": createdBy,
    "channelId": channelId,
  };
}
