import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mime/mime.dart';
import 'package:http_parser/http_parser.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/network/api_result.dart';
import 'package:waki/network/session_manager.dart';

class ApiService {
  Future<dynamic> post({
    required String endUrl,
    Map<String, dynamic>? data,
  }) async {
    try {
      debugPrint("Api endUrl from get Request:- $endUrl");
      final sessionHeaders = await SessionManager.getAuthHeaders();
      final response = await http
          .post(
            Uri.parse("${ApiUrl.BASE_URL}$endUrl"),
            headers: sessionHeaders,
            body: _encodeBody(data),
          )
          .timeout(const Duration(seconds: 10));
      log("adabdjabab $sessionHeaders");
      log("adabdjabab ${response.body}");
      return getAPIResult(response);
    } on TimeoutException {
      throw Exception('POST REQUEST TIMED OUT. PLEASE TRY AGAIN.');
    } on SocketException {
      throw Exception('NO INTERNET CONNECTION. PLEASE CHECK YOUR NETWORK.');
    } catch (e) {
      throw Exception('Exception error occurred POST() -: $e');
    }
  }

  Future<dynamic> get({required String endUrl}) async {
    final sessionHeaders = await SessionManager.getAuthHeaders();
    try {
      final response = await http
          .get(Uri.parse("${ApiUrl.BASE_URL}$endUrl"), headers: sessionHeaders)
          .timeout(const Duration(seconds: 10));
      debugPrint("Api endUrl from get Request:- $endUrl");
      return getAPIResult(response);
    } on TimeoutException {
      throw Exception('GET REQUEST TIMED OUT. PLEASE TRY AGAIN.');
    } on SocketException {
      throw Exception('NO INTERNET CONNECTION. PLEASE CHECK YOUR NETWORK.');
    } catch (e) {
      throw Exception('Exception error occurred GET() -: $e');
    }
  }

  Future<dynamic> put({
    required String endUrl,
    Map<String, dynamic>? data,
  }) async {
    final sessionHeaders = await SessionManager.getAuthHeaders();
    try {
      final response = await http
          .put(
            Uri.parse("${ApiUrl.BASE_URL}$endUrl"),
            headers: sessionHeaders,
            body: _encodeBody(data),
          )
          .timeout(const Duration(seconds: 10));
      debugPrint("Api endUrl from PUT Request:- $endUrl");
      return getAPIResult(response);
    } on TimeoutException {
      throw Exception('PUT REQUEST TIMED OUT. PLEASE TRY AGAIN.');
    } on SocketException {
      throw Exception('NO INTERNET CONNECTION. PLEASE CHECK YOUR NETWORK.');
    } catch (e) {
      throw Exception('Exception error occurred PUT() -: $e');
    }
  }

  // ----------------- ADDED PATCH METHOD -----------------
  Future<dynamic> patch({
    required String endUrl,
    Map<String, dynamic>? data,
  }) async {
    final sessionHeaders = await SessionManager.getAuthHeaders();
    try {
      final response = await http
          .patch(
            Uri.parse("${ApiUrl.BASE_URL}$endUrl"),
            headers: sessionHeaders,
            body: _encodeBody(data),
          )
          .timeout(const Duration(seconds: 10));
      debugPrint("Api endUrl from PATCH Request:- $endUrl");
      debugPrint("Api endUrl from PATCH body:- ${response.body}");
      debugPrint("Api endUrl from PATCH status:- ${response.statusCode}");
      return getAPIResult(response);
    } on TimeoutException {
      throw Exception('PATCH REQUEST TIMED OUT. PLEASE TRY AGAIN.');
    } on SocketException {
      throw Exception('NO INTERNET CONNECTION. PLEASE CHECK YOUR NETWORK.');
    } catch (e) {
      throw Exception('Exception error occurred PATCH() -: $e');
    }
  }

  // ----------------- ADDED DELETE METHOD -----------------
  Future<dynamic> delete({
    required String endUrl,
    Map<String, dynamic>? data, // Optional payload if required by your backend
  }) async {
    final sessionHeaders = await SessionManager.getAuthHeaders();
    try {
      final response = await http
          .delete(
            Uri.parse("${ApiUrl.BASE_URL}$endUrl"),
            headers: sessionHeaders,
            body: _encodeBody(data),
          )
          .timeout(const Duration(seconds: 10));
      debugPrint("Api endUrl from DELETE Request:- $endUrl");
      debugPrint("Api endUrl from DELETE status:- ${response.statusCode}");
      debugPrint("Api endUrl from DELETE body:- ${response.body}");
      return getAPIResult(response);
    } on TimeoutException {
      throw Exception('DELETE REQUEST TIMED OUT. PLEASE TRY AGAIN.');
    } on SocketException {
      throw Exception('NO INTERNET CONNECTION. PLEASE CHECK YOUR NETWORK.');
    } catch (e) {
      throw Exception('Exception error occurred DELETE() -: $e');
    }
  }

  // ----------------- ADDED MULTIPART POST METHOD -----------------
  Future<dynamic> postMultipart({
    required String endUrl,
    required File file,
    Map<String, String>? fields,
    required String fileField,
  }) async {
    try {
      debugPrint("Api endUrl from postMultipart Request:- ${ApiUrl.BASE_URL}$endUrl");
      final sessionHeaders = await SessionManager.getAuthHeaders();
      sessionHeaders.remove('Content-Type');
      var request = http.MultipartRequest(
        'POST',
        Uri.parse("${ApiUrl.BASE_URL}$endUrl"),
      );
      request.headers.addAll(sessionHeaders);
      log("postMultipart fields $fields");
      log("postMultipart endUrl $endUrl");
      log("postMultipart fileField $fileField");
      log("postMultipart file ${file.path}");
      if (fields != null) {
        request.fields.addAll(fields);
      }

      final mimeType = lookupMimeType(file.path) ?? 'image/jpeg';
      final mimeSplit = mimeType.split('/');
      final contentType = MediaType(mimeSplit[0], mimeSplit[1]);

      request.files.add(
        await http.MultipartFile.fromPath(
          fileField,
          file.path,
          contentType: contentType,
          filename: file.path.split('/').last.split(r'\').last,
        ),
      );

      var streamedResponse = await request.send().timeout(
        const Duration(seconds: 30),
      );
      var response = await http.Response.fromStream(streamedResponse);

      log("postMultipart response status ${response.statusCode}");
      log("postMultipart response body ${response.body}");
      return getAPIResult(response);
    } on TimeoutException {
      throw Exception('MULTIPART REQUEST TIMED OUT. PLEASE TRY AGAIN.');
    } on SocketException {
      throw Exception('NO INTERNET CONNECTION. PLEASE CHECK YOUR NETWORK.');
    } catch (e) {
      throw Exception('Exception error occurred postMultipart() -: $e');
    }
  }

  // ----- USE THIS TO PARSE THE API REQUEST BODY -------
  String? _encodeBody(Map<String, dynamic>? data) {
    if (data == null || data.isEmpty) {
      return null;
    }
    try {
      log("_encodeBody---> ${jsonEncode(data)}");
      return jsonEncode(data);
    } catch (e) {
      throw Exception('Failed to encode request data: $e');
    }
  }
}
