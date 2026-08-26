import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

sealed class ApiResult {}

class ApiSuccess extends ApiResult {
  final dynamic data;
  final Map<String, String>? headers;
  ApiSuccess({required this.data, this.headers});
}

class ApiFailure extends ApiResult {
  final String? message;
  final int? statusCode;
  ApiFailure({this.message, this.statusCode});
}

ApiResult getAPIResult(http.Response response) {
  dynamic body;
  try {
    body = json.decode(response.body);
  } catch (e) {
    body = response.body;
    debugPrint("Exception - getAPIResult():-  $e");
  }

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return ApiSuccess(data: body, headers: response.headers);
  } else {
    String? message;
    if (body is Map && body.containsKey('message')) {
      message = body['message'];
    } else if (body is Map && body.containsKey('error')) {
      message = body['error'];
    }
    return ApiFailure(message: message, statusCode: response.statusCode);
  }
}
