class SettingsModel {
  String? title;
  String? tagline;
  String? currency;
  String? country;
  String? supportEmail;
  String? logo;
  String? logo2;
  String? favicon;
  String? primaryColor;
  String? backgroundColor;
  String? fontFamily;
  String? buttonColor;
  String? lightModeColor;
  DateTime? updatedAt;

  SettingsModel({
    this.title,
    this.tagline,
    this.currency,
    this.country,
    this.supportEmail,
    this.logo,
    this.logo2,
    this.favicon,
    this.primaryColor,
    this.backgroundColor,
    this.fontFamily,
    this.buttonColor,
    this.lightModeColor,
    this.updatedAt,
  });

  factory SettingsModel.fromJson(Map<String, dynamic> json) => SettingsModel(
    title: json["title"],
    tagline: json["tagline"],
    currency: json["currency"],
    country: json["country"],
    supportEmail: json["supportEmail"],
    logo: json["logo"],
    logo2: json["logo2"],
    favicon: json["favicon"],
    primaryColor: json["primaryColor"],
    backgroundColor: json["backgroundColor"],
    fontFamily: json["fontFamily"],
    buttonColor: json["buttonColor"],
    lightModeColor: json["lightModeColor"],
    updatedAt: json["updatedAt"] == null
        ? null
        : DateTime.parse(json["updatedAt"]),
  );

  Map<String, dynamic> toJson() => {
    "title": title,
    "tagline": tagline,
    "currency": currency,
    "country": country,
    "supportEmail": supportEmail,
    "logo": logo,
    "logo2": logo2,
    "favicon": favicon,
    "primaryColor": primaryColor,
    "backgroundColor": backgroundColor,
    "fontFamily": fontFamily,
    "buttonColor": buttonColor,
    "lightModeColor": lightModeColor,
    "updatedAt": updatedAt?.toIso8601String(),
  };
}
