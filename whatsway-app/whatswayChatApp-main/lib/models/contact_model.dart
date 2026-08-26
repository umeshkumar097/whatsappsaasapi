// To parse this JSON data, do
//
//     final contactModel = contactModelFromJson(jsonString);

import 'dart:convert';

ContactModel contactModelFromJson(String str) =>
    ContactModel.fromJson(json.decode(str));

String contactModelToJson(ContactModel data) => json.encode(data.toJson());

class ContactModel {
  List<ContactsList>? data;
  Pagination? pagination;

  ContactModel({this.data, this.pagination});

  factory ContactModel.fromJson(Map<String, dynamic> json) => ContactModel(
    data: json["data"] == null
        ? []
        : List<ContactsList>.from(
            json["data"]!.map((x) => ContactsList.fromJson(x)),
          ),
    pagination: json["pagination"] == null
        ? null
        : Pagination.fromJson(json["pagination"]),
  );

  Map<String, dynamic> toJson() => {
    "data": data == null
        ? []
        : List<dynamic>.from(data!.map((x) => x.toJson())),
    "pagination": pagination?.toJson(),
  };
}

class ContactsList {
  String? id;
  String? channelId;
  String? name;
  String? phone;
  String? email;
  List<String>? groups;
  List<dynamic>? tags;
  String? status;
  Source? source;
  dynamic lastContact;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? createdBy;
  CreatedByName? createdByName;

  ContactsList({
    this.id,
    this.channelId,
    this.name,
    this.phone,
    this.email,
    this.groups,
    this.tags,
    this.status,
    this.source,
    this.lastContact,
    this.createdAt,
    this.updatedAt,
    this.createdBy,
    this.createdByName,
  });

  factory ContactsList.fromJson(Map<String, dynamic> json) => ContactsList(
    id: json["id"],
    channelId: json["channelId"],
    name: json["name"],
    phone: json["phone"],
    email: json["email"],
    groups: json["groups"] == null
        ? []
        : (json["groups"] as List).map((e) => e.toString()).toList(),
    tags: json["tags"] == null
        ? []
        : List<dynamic>.from(json["tags"]!.map((x) => x)),
    status: json["status"],
    source: sourceValues.map[json["source"]],
    lastContact: json["lastContact"],
    createdAt: json["createdAt"] == null
        ? null
        : DateTime.parse(json["createdAt"]),
    updatedAt: json["updatedAt"] == null
        ? null
        : DateTime.parse(json["updatedAt"]),
    createdBy: json["createdBy"],
    createdByName: createdByNameValues.map[json["createdByName"]],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "channelId": channelId,
    "name": name,
    "phone": phone,
    "email": email,
    "groups": groups == null ? [] : List<dynamic>.from(groups!.map((x) => x)),
    "tags": tags == null ? [] : List<dynamic>.from(tags!.map((x) => x)),
    "status": status,
    "source": sourceValues.reverse[source],
    "lastContact": lastContact,
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "createdBy": createdBy,
    "createdByName": createdByNameValues.reverse[createdByName],
  };
}

enum CreatedByName { DIPLOY }

final createdByNameValues = EnumValues({"diploy": CreatedByName.DIPLOY});

enum Source { WHATSAPP }

final sourceValues = EnumValues({"whatsapp": Source.WHATSAPP});

class Pagination {
  int? page;
  int? limit;
  int? count;
  String? total;
  int? totalPages;

  Pagination({this.page, this.limit, this.count, this.total, this.totalPages});

  factory Pagination.fromJson(Map<String, dynamic> json) => Pagination(
    page: json["page"],
    limit: json["limit"],
    count: json["count"],
    total: json["total"],
    totalPages: json["totalPages"],
  );

  Map<String, dynamic> toJson() => {
    "page": page,
    "limit": limit,
    "count": count,
    "total": total,
    "totalPages": totalPages,
  };
}

class EnumValues<T> {
  Map<String, T> map;
  late Map<T, String> reverseMap;

  EnumValues(this.map);

  Map<T, String> get reverse {
    reverseMap = map.map((k, v) => MapEntry(v, k));
    return reverseMap;
  }
}
