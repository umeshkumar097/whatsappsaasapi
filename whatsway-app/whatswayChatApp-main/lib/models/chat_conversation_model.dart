// To parse this JSON data, do
//
//     final chatConversation = chatConversationFromJson(jsonString);

import 'dart:convert';

List<ChatConversation> chatConversationFromJson(String str) =>
    List<ChatConversation>.from(
      json.decode(str).map((x) => ChatConversation.fromJson(x)),
    );

String chatConversationToJson(List<ChatConversation> data) =>
    json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class ChatConversation {
  String? id;
  String? channelId;
  String? contactId;
  dynamic assignedTo;
  String? contactPhone;
  String? contactName;
  String? status;
  String? priority;
  String? type;
  dynamic chatbotId;
  dynamic sessionId;
  List<dynamic>? tags;
  int? unreadCount;
  DateTime? lastMessageAt;
  DateTime? lastIncomingMessageAt;
  String? lastMessageText;
  DateTime? createdAt;
  DateTime? updatedAt;
  dynamic assignedToName;
  Contact? contact;
  String? bucket;

  ChatConversation({
    this.id,
    this.channelId,
    this.contactId,
    this.assignedTo,
    this.contactPhone,
    this.contactName,
    this.status,
    this.priority,
    this.type,
    this.chatbotId,
    this.sessionId,
    this.tags,
    this.unreadCount,
    this.lastMessageAt,
    this.lastIncomingMessageAt,
    this.lastMessageText,
    this.createdAt,
    this.updatedAt,
    this.assignedToName,
    this.contact,
    this.bucket,
  });

  factory ChatConversation.fromJson(Map<String, dynamic> json) =>
      ChatConversation(
        id: json["id"],
        channelId: json["channelId"],
        contactId: json["contactId"],
        assignedTo: json["assignedTo"],
        contactPhone: json["contactPhone"],
        contactName: json["contactName"],
        status: json["status"],
        priority: json["priority"],
        type: json["type"],
        chatbotId: json["chatbotId"],
        sessionId: json["sessionId"],
        tags: json["tags"] == null
            ? []
            : List<dynamic>.from(json["tags"]!.map((x) => x)),
        unreadCount: json["unreadCount"],
        lastMessageAt: json["lastMessageAt"] == null
            ? DateTime.now()
            : DateTime.parse(json["lastMessageAt"]),
        lastIncomingMessageAt: json["lastIncomingMessageAt"] == null
            ? DateTime.now()
            : DateTime.parse(json["lastIncomingMessageAt"]),
        lastMessageText: json["lastMessageText"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        assignedToName: json["assignedToName"],
        contact: json["contact"] == null
            ? null
            : Contact.fromJson(json["contact"]),
        bucket: json["bucket"],
      );

  Map<String, dynamic> toJson() => {
    "id": id,
    "channelId": channelId,
    "contactId": contactId,
    "assignedTo": assignedTo,
    "contactPhone": contactPhone,
    "contactName": contactName,
    "status": status,
    "priority": priority,
    "type": type,
    "chatbotId": chatbotId,
    "sessionId": sessionId,
    "tags": tags == null ? [] : List<dynamic>.from(tags!.map((x) => x)),
    "unreadCount": unreadCount,
    "lastMessageAt": lastMessageAt?.toIso8601String(),
    "lastIncomingMessageAt": lastIncomingMessageAt?.toIso8601String(),
    "lastMessageText": lastMessageText,
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "assignedToName": assignedToName,
    "contact": contact?.toJson(),
    "bucket": bucket ?? "other",
  };
}

class Contact {
  String? id;
  String? channelId;
  String? tenantId;
  String? name;
  String? phone;
  String? email;
  List<Group>? groups;
  List<dynamic>? tags;
  String? status;
  String? source;
  dynamic storeId;
  dynamic externalId;
  dynamic lastContact;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? createdBy;

  Contact({
    this.id,
    this.channelId,
    this.tenantId,
    this.name,
    this.phone,
    this.email,
    this.groups,
    this.tags,
    this.status,
    this.source,
    this.storeId,
    this.externalId,
    this.lastContact,
    this.createdAt,
    this.updatedAt,
    this.createdBy,
  });

  factory Contact.fromJson(Map<String, dynamic> json) => Contact(
    id: json["id"],
    channelId: json["channelId"],
    tenantId: json["tenantId"],
    name: json["name"],
    phone: json["phone"],
    email: json["email"],
    groups: json["groups"] == null
        ? []
        : (json["groups"] as List)
              .map((e) => groupValues.map[e])
              .whereType<Group>()
              .toList(),
    tags: json["tags"] == null
        ? []
        : List<dynamic>.from(json["tags"]!.map((x) => x)),
    status: json["status"],
    source: json["source"],
    storeId: json["storeId"],
    externalId: json["externalId"],
    lastContact: json["lastContact"],
    createdAt: json["createdAt"] == null
        ? null
        : DateTime.parse(json["createdAt"]),
    updatedAt: json["updatedAt"] == null
        ? null
        : DateTime.parse(json["updatedAt"]),
    createdBy: json["createdBy"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "channelId": channelId,
    "tenantId": tenantId,
    "name": name,
    "phone": phone,
    "email": email,
    "groups": groups == null
        ? []
        : List<dynamic>.from(groups!.map((x) => groupValues.reverse[x])),
    "tags": tags == null ? [] : List<dynamic>.from(tags!.map((x) => x)),
    "status": status,
    "source": source,
    "storeId": storeId,
    "externalId": externalId,
    "lastContact": lastContact,
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "createdBy": createdBy,
  };
}

enum Group { NEW_LEADS, VIP }

final groupValues = EnumValues({
  "new_leads": Group.NEW_LEADS,
  "VIP": Group.VIP,
});

enum Type { WHATSAPP }

final typeValues = EnumValues({"whatsapp": Type.WHATSAPP});

enum Priority { NORMAL }

final priorityValues = EnumValues({"normal": Priority.NORMAL});

class EnumValues<T> {
  Map<String, T> map;
  late Map<T, String> reverseMap;

  EnumValues(this.map);

  Map<T, String> get reverse {
    reverseMap = map.map((k, v) => MapEntry(v, k));
    return reverseMap;
  }
}
