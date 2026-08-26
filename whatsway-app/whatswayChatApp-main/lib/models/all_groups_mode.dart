class AllGroupsModel {
  bool? success;
  List<Group>? groups;

  AllGroupsModel({this.success, this.groups});

  factory AllGroupsModel.fromJson(Map<String, dynamic> json) => AllGroupsModel(
    success: json["success"],
    groups: json["groups"] == null
        ? []
        : List<Group>.from(json["groups"]!.map((x) => Group.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "success": success,
    "groups": groups == null
        ? []
        : List<dynamic>.from(groups!.map((x) => x.toJson())),
  };
}

class Group {
  String? id;
  String? channelId;
  String? name;
  String? description;
  String? createdBy;
  DateTime? createdAt;
  int? contactCount;

  Group({
    this.id,
    this.channelId,
    this.name,
    this.description,
    this.createdBy,
    this.createdAt,
    this.contactCount,
  });

  factory Group.fromJson(Map<String, dynamic> json) => Group(
    id: json["id"],
    channelId: json["channelId"],
    name: json["name"],
    description: json["description"],
    createdBy: json["createdBy"],
    createdAt: json["createdAt"] == null
        ? null
        : DateTime.parse(json["createdAt"]),
    contactCount: json["contact_count"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "channelId": channelId,
    "name": name,
    "description": description,
    "createdBy": createdBy,
    "createdAt": createdAt?.toIso8601String(),
    "contact_count": contactCount,
  };
}
