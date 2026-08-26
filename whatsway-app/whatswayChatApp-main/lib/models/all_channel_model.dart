// To parse this JSON data, do
//
//     final channelsModel = channelsModelFromJson(jsonString);

import 'dart:convert';

ChannelsModel channelsModelFromJson(String str) => ChannelsModel.fromJson(json.decode(str));

String channelsModelToJson(ChannelsModel data) => json.encode(data.toJson());

class ChannelsModel {
  List<AllChannels>? data;
  Pagination? pagination;

  ChannelsModel({
    this.data,
    this.pagination,
  });

  factory ChannelsModel.fromJson(Map<String, dynamic> json) => ChannelsModel(
    data: json["data"] == null ? [] : List<AllChannels>.from(json["data"]!.map((x) => AllChannels.fromJson(x))),
    pagination: json["pagination"] == null ? null : Pagination.fromJson(json["pagination"]),
  );

  Map<String, dynamic> toJson() => {
    "data": data == null ? [] : List<dynamic>.from(data!.map((x) => x.toJson())),
    "pagination": pagination?.toJson(),
  };
}

class AllChannels {
  String? id;
  String? name;
  String? phoneNumberId;
  String? accessToken;
  String? whatsappBusinessAccountId;
  String? phoneNumber;
  String? appId;
  bool? isActive;
  bool? isCoexistence;
  String? healthStatus;
  DateTime? lastHealthCheck;
  HealthDetails? healthDetails;
  String? connectionMethod;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? createdBy;

  AllChannels({
    this.id,
    this.name,
    this.phoneNumberId,
    this.accessToken,
    this.whatsappBusinessAccountId,
    this.phoneNumber,
    this.appId,
    this.isActive,
    this.isCoexistence,
    this.healthStatus,
    this.lastHealthCheck,
    this.healthDetails,
    this.connectionMethod,
    this.createdAt,
    this.updatedAt,
    this.createdBy,
  });

  factory AllChannels.fromJson(Map<String, dynamic> json) => AllChannels(
    id: json["id"],
    name: json["name"],
    phoneNumberId: json["phoneNumberId"],
    accessToken: json["accessToken"],
    whatsappBusinessAccountId: json["whatsappBusinessAccountId"],
    phoneNumber: json["phoneNumber"],
    appId: json["appId"],
    isActive: json["isActive"],
    isCoexistence: json["isCoexistence"],
    healthStatus: json["healthStatus"],
    lastHealthCheck: json["lastHealthCheck"] == null ? null : DateTime.parse(json["lastHealthCheck"]),
    healthDetails: json["healthDetails"] == null ? null : HealthDetails.fromJson(json["healthDetails"]),
    connectionMethod: json["connectionMethod"],
    createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
    updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
    createdBy: json["createdBy"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "name": name,
    "phoneNumberId": phoneNumberId,
    "accessToken": accessToken,
    "whatsappBusinessAccountId": whatsappBusinessAccountId,
    "phoneNumber": phoneNumber,
    "appId": appId,
    "isActive": isActive,
    "isCoexistence": isCoexistence,
    "healthStatus": healthStatus,
    "lastHealthCheck": lastHealthCheck?.toIso8601String(),
    "healthDetails": healthDetails?.toJson(),
    "connectionMethod": connectionMethod,
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "createdBy": createdBy,
  };
}

class HealthDetails {
  String? status;
  String? nameStatus;
  String? phoneNumber;
  HealthStatus? healthStatus;
  String? platformType;
  QualityScore? qualityScore;
  String? verifiedName;
  bool? isPinEnabled;
  String? qualityRating;
  String? messagingLimit;
  String? throughputLevel;
  String? searchVisibility;
  String? verificationStatus;
  MessagingLimitInfo? messagingLimitInfo;
  bool? isPreverifiedNumber;
  String? codeVerificationStatus;
  bool? isOfficialBusinessAccount;

  HealthDetails({
    this.status,
    this.nameStatus,
    this.phoneNumber,
    this.healthStatus,
    this.platformType,
    this.qualityScore,
    this.verifiedName,
    this.isPinEnabled,
    this.qualityRating,
    this.messagingLimit,
    this.throughputLevel,
    this.searchVisibility,
    this.verificationStatus,
    this.messagingLimitInfo,
    this.isPreverifiedNumber,
    this.codeVerificationStatus,
    this.isOfficialBusinessAccount,
  });

  factory HealthDetails.fromJson(Map<String, dynamic> json) => HealthDetails(
    status: json["status"],
    nameStatus: json["name_status"],
    phoneNumber: json["phone_number"],
    healthStatus: json["health_status"] == null ? null : HealthStatus.fromJson(json["health_status"]),
    platformType: json["platform_type"],
    qualityScore: json["quality_score"] == null ? null : QualityScore.fromJson(json["quality_score"]),
    verifiedName: json["verified_name"],
    isPinEnabled: json["is_pin_enabled"],
    qualityRating: json["quality_rating"],
    messagingLimit: json["messaging_limit"],
    throughputLevel: json["throughput_level"],
    searchVisibility: json["search_visibility"],
    verificationStatus: json["verification_status"],
    messagingLimitInfo: json["messaging_limit_info"] == null ? null : MessagingLimitInfo.fromJson(json["messaging_limit_info"]),
    isPreverifiedNumber: json["is_preverified_number"],
    codeVerificationStatus: json["code_verification_status"],
    isOfficialBusinessAccount: json["is_official_business_account"],
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "name_status": nameStatus,
    "phone_number": phoneNumber,
    "health_status": healthStatus?.toJson(),
    "platform_type": platformType,
    "quality_score": qualityScore?.toJson(),
    "verified_name": verifiedName,
    "is_pin_enabled": isPinEnabled,
    "quality_rating": qualityRating,
    "messaging_limit": messagingLimit,
    "throughput_level": throughputLevel,
    "search_visibility": searchVisibility,
    "verification_status": verificationStatus,
    "messaging_limit_info": messagingLimitInfo?.toJson(),
    "is_preverified_number": isPreverifiedNumber,
    "code_verification_status": codeVerificationStatus,
    "is_official_business_account": isOfficialBusinessAccount,
  };
}

class HealthStatus {
  List<Entity>? entities;
  String? canSendMessage;

  HealthStatus({
    this.entities,
    this.canSendMessage,
  });

  factory HealthStatus.fromJson(Map<String, dynamic> json) => HealthStatus(
    entities: json["entities"] == null ? [] : List<Entity>.from(json["entities"]!.map((x) => Entity.fromJson(x))),
    canSendMessage: json["can_send_message"],
  );

  Map<String, dynamic> toJson() => {
    "entities": entities == null ? [] : List<dynamic>.from(entities!.map((x) => x.toJson())),
    "can_send_message": canSendMessage,
  };
}

class Entity {
  String? id;
  List<Error>? errors;
  String? entityType;
  String? canSendMessage;
  String? canReceiveCallSip;

  Entity({
    this.id,
    this.errors,
    this.entityType,
    this.canSendMessage,
    this.canReceiveCallSip,
  });

  factory Entity.fromJson(Map<String, dynamic> json) => Entity(
    id: json["id"],
    errors: json["errors"] == null ? [] : List<Error>.from(json["errors"]!.map((x) => Error.fromJson(x))),
    entityType: json["entity_type"],
    canSendMessage: json["can_send_message"],
    canReceiveCallSip: json["can_receive_call_sip"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "errors": errors == null ? [] : List<dynamic>.from(errors!.map((x) => x.toJson())),
    "entity_type": entityType,
    "can_send_message": canSendMessage,
    "can_receive_call_sip": canReceiveCallSip,
  };
}

class Error {
  int? errorCode;
  String? errorDescription;
  String? possibleSolution;

  Error({
    this.errorCode,
    this.errorDescription,
    this.possibleSolution,
  });

  factory Error.fromJson(Map<String, dynamic> json) => Error(
    errorCode: json["error_code"],
    errorDescription: json["error_description"],
    possibleSolution: json["possible_solution"],
  );

  Map<String, dynamic> toJson() => {
    "error_code": errorCode,
    "error_description": errorDescription,
    "possible_solution": possibleSolution,
  };
}

class MessagingLimitInfo {
  String? tier;
  String? label;
  int? dailyLimit;

  MessagingLimitInfo({
    this.tier,
    this.label,
    this.dailyLimit,
  });

  factory MessagingLimitInfo.fromJson(Map<String, dynamic> json) => MessagingLimitInfo(
    tier: json["tier"],
    label: json["label"],
    dailyLimit: json["dailyLimit"],
  );

  Map<String, dynamic> toJson() => {
    "tier": tier,
    "label": label,
    "dailyLimit": dailyLimit,
  };
}

class QualityScore {
  String? score;

  QualityScore({
    this.score,
  });

  factory QualityScore.fromJson(Map<String, dynamic> json) => QualityScore(
    score: json["score"],
  );

  Map<String, dynamic> toJson() => {
    "score": score,
  };
}

class Pagination {
  int? total;
  int? page;
  int? limit;
  int? totalPages;

  Pagination({
    this.total,
    this.page,
    this.limit,
    this.totalPages,
  });

  factory Pagination.fromJson(Map<String, dynamic> json) => Pagination(
    total: json["total"],
    page: json["page"],
    limit: json["limit"],
    totalPages: json["totalPages"],
  );

  Map<String, dynamic> toJson() => {
    "total": total,
    "page": page,
    "limit": limit,
    "totalPages": totalPages,
  };
}
