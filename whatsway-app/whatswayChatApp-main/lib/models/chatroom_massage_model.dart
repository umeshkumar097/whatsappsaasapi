class RoomMessageModel {
  String? id;
  String? conversationId;
  String? whatsappMessageId;
  bool? fromUser;
  String? direction;
  String? content;
  String? type;
  String? fromType;
  String? messageType;
  String? mediaId;
  String? mediaUrl;
  String? mediaMimeType;
  String? mediaSha256;
  String? status;
  String? timestamp;
  Metadata? metadata;
  String? deliveredAt;
  String? readAt;
  int? errorCode;
  String? errorMessage;
  String? errorDetails;
  String? campaignId;
  String? createdAt;
  String? updatedAt;

  RoomMessageModel({
    this.id,
    this.conversationId,
    this.whatsappMessageId,
    this.fromUser,
    this.direction,
    this.content,
    this.type,
    this.fromType,
    this.messageType,
    this.mediaId,
    this.mediaUrl,
    this.mediaMimeType,
    this.mediaSha256,
    this.status,
    this.timestamp,
    this.metadata,
    this.deliveredAt,
    this.readAt,
    this.errorCode,
    this.errorMessage,
    this.errorDetails,
    this.campaignId,
    this.createdAt,
    this.updatedAt,
  });

  factory RoomMessageModel.fromJson(Map<String, dynamic> json) {
    return RoomMessageModel(
      id: json['id'],
      conversationId: json['conversationId'],
      whatsappMessageId: json['whatsappMessageId'],
      fromUser: json['fromUser'],
      direction: json['direction'],
      content: json['content'],
      type: json['type'],
      fromType: json['fromType'],
      messageType: json['messageType'],
      mediaId: json['mediaId'],
      mediaUrl: json['mediaUrl'],
      mediaMimeType: json['mediaMimeType'],
      mediaSha256: json['mediaSha256'],
      status: json['status'],
      timestamp: json['timestamp'],
      metadata: json['metadata'] != null
          ? Metadata.fromJson(json['metadata'])
          : null,
      deliveredAt: json['deliveredAt'],
      readAt: json['readAt'],
      errorCode: json['errorCode'],
      errorMessage: json['errorMessage'],
      errorDetails: json['errorDetails'],
      campaignId: json['campaignId'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'conversationId': conversationId,
      'whatsappMessageId': whatsappMessageId,
      'fromUser': fromUser,
      'direction': direction,
      'content': content,
      'type': type,
      'fromType': fromType,
      'messageType': messageType,
      'mediaId': mediaId,
      'mediaUrl': mediaUrl,
      'mediaMimeType': mediaMimeType,
      'mediaSha256': mediaSha256,
      'status': status,
      'timestamp': timestamp,
      'metadata': metadata?.toJson(),
      'deliveredAt': deliveredAt,
      'readAt': readAt,
      'errorCode': errorCode,
      'errorMessage': errorMessage,
      'errorDetails': errorDetails,
      'campaignId': campaignId,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}

class Metadata {
  Pricing? pricing;
  List<Button>? buttons;
  String? interactiveType;
  String? type;
  double? latitude;
  double? longitude;
  String? name;
  String? address;
  String? url;
  List<Reaction>? reactions;
  int? errorCode;
  String? errorTitle;
  String? errorDetails;
  String? originalType;
  List<String>? messageKeys;
  RawWebhook? rawWebhook;

  Metadata({
    this.pricing,
    this.buttons,
    this.interactiveType,
    this.type,
    this.latitude,
    this.longitude,
    this.name,
    this.address,
    this.url,
    this.reactions,
    this.errorCode,
    this.errorTitle,
    this.errorDetails,
    this.originalType,
    this.messageKeys,
    this.rawWebhook,
  });

  factory Metadata.fromJson(Map<String, dynamic> json) {
    return Metadata(
      pricing: json['pricing'] != null
          ? Pricing.fromJson(json['pricing'])
          : null,
      buttons: (json['buttons'] as List?)
          ?.map((e) => Button.fromJson(e))
          .toList(),
      interactiveType: json['interactiveType'],
      type: json['type'],
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      name: json['name'],
      address: json['address'],
      url: json['url'],
      reactions: (json['reactions'] as List?)
          ?.map((e) => Reaction.fromJson(e))
          .toList(),
      errorCode: json['errorCode'],
      errorTitle: json['errorTitle'],
      errorDetails: json['errorDetails'],
      originalType: json['originalType'],
      messageKeys: (json['messageKeys'] as List?)?.cast<String>(),
      rawWebhook: json['rawWebhook'] != null
          ? RawWebhook.fromJson(json['rawWebhook'])
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'pricing': pricing?.toJson(),
    'buttons': buttons?.map((e) => e.toJson()).toList(),
    'interactiveType': interactiveType,
    'type': type,
    'latitude': latitude,
    'longitude': longitude,
    'name': name,
    'address': address,
    'url': url,
    'reactions': reactions?.map((e) => e.toJson()).toList(),
    'errorCode': errorCode,
    'errorTitle': errorTitle,
    'errorDetails': errorDetails,
    'originalType': originalType,
    'messageKeys': messageKeys,
    'rawWebhook': rawWebhook?.toJson(),
  };
}

class Pricing {
  String? type;
  bool? billable;
  String? category;
  String? pricingModel;

  Pricing({this.type, this.billable, this.category, this.pricingModel});

  factory Pricing.fromJson(Map<String, dynamic> json) => Pricing(
    type: json['type'],
    billable: json['billable'],
    category: json['category'],
    pricingModel: json['pricing_model'],
  );

  Map<String, dynamic> toJson() => {
    'type': type,
    'billable': billable,
    'category': category,
    'pricing_model': pricingModel,
  };
}

class Button {
  String? id;
  String? text;
  String? action;

  Button({this.id, this.text, this.action});

  factory Button.fromJson(Map<String, dynamic> json) =>
      Button(id: json['id'], text: json['text'], action: json['action']);

  Map<String, dynamic> toJson() => {'id': id, 'text': text, 'action': action};
}

class Reaction {
  String? from;
  String? emoji;
  String? timestamp;

  Reaction({this.from, this.emoji, this.timestamp});

  factory Reaction.fromJson(Map<String, dynamic> json) => Reaction(
    from: json['from'],
    emoji: json['emoji'],
    timestamp: json['timestamp'],
  );

  Map<String, dynamic> toJson() => {
    'from': from,
    'emoji': emoji,
    'timestamp': timestamp,
  };
}

class RawWebhook {
  String? from;
  String? fromUserId;
  String? id;
  String? timestamp;
  String? type;
  Unsupported? unsupported;
  List<WebhookError>? errors;

  RawWebhook({
    this.from,
    this.fromUserId,
    this.id,
    this.timestamp,
    this.type,
    this.unsupported,
    this.errors,
  });

  factory RawWebhook.fromJson(Map<String, dynamic> json) => RawWebhook(
    from: json['from'],
    fromUserId: json['from_user_id'],
    id: json['id'],
    timestamp: json['timestamp'],
    type: json['type'],
    unsupported: json['unsupported'] != null
        ? Unsupported.fromJson(json['unsupported'])
        : null,
    errors: (json['errors'] as List?)
        ?.map((e) => WebhookError.fromJson(e))
        .toList(),
  );

  Map<String, dynamic> toJson() => {
    'from': from,
    'from_user_id': fromUserId,
    'id': id,
    'timestamp': timestamp,
    'type': type,
    'unsupported': unsupported?.toJson(),
    'errors': errors?.map((e) => e.toJson()).toList(),
  };
}

class Unsupported {
  String? type;

  Unsupported({this.type});

  factory Unsupported.fromJson(Map<String, dynamic> json) =>
      Unsupported(type: json['type']);

  Map<String, dynamic> toJson() => {'type': type};
}

class WebhookError {
  int? code;
  String? title;
  String? message;
  ErrorData? errorData;

  WebhookError({this.code, this.title, this.message, this.errorData});

  factory WebhookError.fromJson(Map<String, dynamic> json) => WebhookError(
    code: json['code'],
    title: json['title'],
    message: json['message'],
    errorData: json['error_data'] != null
        ? ErrorData.fromJson(json['error_data'])
        : null,
  );

  Map<String, dynamic> toJson() => {
    'code': code,
    'title': title,
    'message': message,
    'error_data': errorData?.toJson(),
  };
}

class ErrorData {
  String? details;

  ErrorData({this.details});

  factory ErrorData.fromJson(Map<String, dynamic> json) =>
      ErrorData(details: json['details']);

  Map<String, dynamic> toJson() => {'details': details};
}
