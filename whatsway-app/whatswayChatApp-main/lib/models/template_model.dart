// To parse this JSON data, do
//
//     final templateModel = templateModelFromJson(jsonString);

import 'dart:convert';

TemplateModel templateModelFromJson(String str) => TemplateModel.fromJson(json.decode(str));

String templateModelToJson(TemplateModel data) => json.encode(data.toJson());

class TemplateModel {
  bool? success;
  List<AllTemplates>? data;

  TemplateModel({
    this.success,
    this.data,
  });

  factory TemplateModel.fromJson(Map<String, dynamic> json) => TemplateModel(
    success: json["success"],
    data: json["data"] == null ? [] : List<AllTemplates>.from(json["data"]!.map((x) => AllTemplates.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "success": success,
    "data": data == null ? [] : List<dynamic>.from(data!.map((x) => x.toJson())),
  };
}

class AllTemplates {
  String? id;
  String? channelId;
  String? createdBy;
  String? name;
  String? category;
  String? language;
  String? header;
  String? body;
  String? footer;
  List<Button>? buttons;
  List<dynamic>? variables;
  String? status;
  dynamic rejectionReason;
  String? mediaType;
  String? mediaUrl;
  dynamic mediaHandle;
  List<CarouselCard>? carouselCards;
  String? whatsappTemplateId;
  int? usageCount;
  DateTime? createdAt;
  DateTime? updatedAt;
  dynamic headerType;
  dynamic bodyVariables;

  AllTemplates({
    this.id,
    this.channelId,
    this.createdBy,
    this.name,
    this.category,
    this.language,
    this.header,
    this.body,
    this.footer,
    this.buttons,
    this.variables,
    this.status,
    this.rejectionReason,
    this.mediaType,
    this.mediaUrl,
    this.mediaHandle,
    this.carouselCards,
    this.whatsappTemplateId,
    this.usageCount,
    this.createdAt,
    this.updatedAt,
    this.headerType,
    this.bodyVariables,
  });

  factory AllTemplates.fromJson(Map<String, dynamic> json) => AllTemplates(
    id: json["id"],
    channelId: json["channelId"],
    createdBy: json["createdBy"],
    name: json["name"],
    category: json["category"],
    language: json["language"],
    header: json["header"],
    body: json["body"],
    footer: json["footer"],
    buttons: json["buttons"] == null ? [] : List<Button>.from(json["buttons"]!.map((x) => Button.fromJson(x))),
    variables: json["variables"] == null ? [] : List<dynamic>.from(json["variables"]!.map((x) => x)),
    status: json["status"],
    rejectionReason: json["rejectionReason"],
    mediaType: json["mediaType"],
    mediaUrl: json["mediaUrl"],
    mediaHandle: json["mediaHandle"],
    carouselCards: json["carouselCards"] == null ? [] : List<CarouselCard>.from(json["carouselCards"]!.map((x) => CarouselCard.fromJson(x))),
    whatsappTemplateId: json["whatsappTemplateId"],
    usageCount: json["usage_count"],
    createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
    updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
    headerType: json["headerType"],
    bodyVariables: json["bodyVariables"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "channelId": channelId,
    "createdBy": createdBy,
    "name": name,
    "category": category,
    "language": language,
    "header": header,
    "body": body,
    "footer": footer,
    "buttons": buttons == null ? [] : List<dynamic>.from(buttons!.map((x) => x.toJson())),
    "variables": variables == null ? [] : List<dynamic>.from(variables!.map((x) => x)),
    "status": status,
    "rejectionReason": rejectionReason,
    "mediaType": mediaType,
    "mediaUrl": mediaUrl,
    "mediaHandle": mediaHandle,
    "carouselCards": carouselCards == null ? [] : List<dynamic>.from(carouselCards!.map((x) => x.toJson())),
    "whatsappTemplateId": whatsappTemplateId,
    "usage_count": usageCount,
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "headerType": headerType,
    "bodyVariables": bodyVariables,
  };
}

class Button {
  String? text;
  String? type;
  String? url;
  List<String>? example;

  Button({
    this.text,
    this.type,
    this.url,
    this.example,
  });

  factory Button.fromJson(Map<String, dynamic> json) => Button(
    text: json["text"],
    type: json["type"],
    url: json["url"],
    example: json["example"] == null ? [] : List<String>.from(json["example"]!.map((x) => x)),
  );

  Map<String, dynamic> toJson() => {
    "text": text,
    "type": type,
    "url": url,
    "example": example == null ? [] : List<dynamic>.from(example!.map((x) => x)),
  };
}

class CarouselCard {
  String? body;
  List<Button>? buttons;
  String? mediaUrl;
  String? mediaType;

  CarouselCard({
    this.body,
    this.buttons,
    this.mediaUrl,
    this.mediaType,
  });

  factory CarouselCard.fromJson(Map<String, dynamic> json) => CarouselCard(
    body: json["body"],
    buttons: json["buttons"] == null ? [] : List<Button>.from(json["buttons"]!.map((x) => Button.fromJson(x))),
    mediaUrl: json["mediaUrl"],
    mediaType: json["mediaType"],
  );

  Map<String, dynamic> toJson() => {
    "body": body,
    "buttons": buttons == null ? [] : List<dynamic>.from(buttons!.map((x) => x.toJson())),
    "mediaUrl": mediaUrl,
    "mediaType": mediaType,
  };
}
