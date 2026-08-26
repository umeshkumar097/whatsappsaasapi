import 'dart:convert' show base64Decode;
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sizer/sizer.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:waki/controllers/message_room_controller.dart';
import 'package:waki/controllers/profile_controller.dart';
import 'package:waki/modules/chatRoomModule/web_socket.dart';
import 'package:waki/models/chat_conversation_model.dart';
import 'package:waki/modules/chatRoomModule/selectTemplate.dart';
import 'package:waki/theme/app_colors.dart';
import 'package:waki/utiles/app_utils.dart';
import 'package:get/get.dart';
import 'package:waki/controllers/chat_controller.dart';
import 'package:waki/widgets/common_text_field.dart';
import 'package:waki/widgets/retry_btn.dart';
import '../../controllers/templates_controller.dart';
import '../../widgets/image_viewer_dialog.dart';
import '../../notification/notification_handeler.dart';

class ChatRoomScreen extends StatefulWidget {
  final String conversationId;
  final String mobileNumber;
  final String messageType;
  final ChatConversation? chatConversation;

  final String? agentId;
  final String? agentName;
  final bool chatPined;
  final bool archivechat;

  const ChatRoomScreen({
    super.key,
    required this.conversationId,
    required this.mobileNumber,
    required this.messageType,
    this.agentId,
    this.agentName,
    this.chatConversation,
    this.chatPined = false,
    this.archivechat = false,
  });

  @override
  State<ChatRoomScreen> createState() => _ChatRoomScreenState();
}

class _ChatRoomScreenState extends State<ChatRoomScreen> {
  final TextEditingController _messageController = TextEditingController();
  final templatesController = Get.find<TemplatesController>();
  final messageRoomController = Get.find<MessageRoomController>();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    print("messages:- ${widget.conversationId}");
    NotificationHandler.instance.activeConversationId = widget.conversationId;
    if (Get.isRegistered<WebSocketService>()) {
      final role = Get.isRegistered<ProfileController>()
          ? Get.find<ProfileController>().profileDataModel?.role
          : null;
      print("role:- $role");
      Get.find<WebSocketService>().joinConversationRoomEvent(
        widget.conversationId,
        role,
      );
    }

    messageRoomController
        .getRoomMessages(conversationId: widget.conversationId)
        .then((_) {
          templatesController.getTemplates();
          messageRoomController.chatPin = widget.chatPined;
          messageRoomController.archivechat = widget.archivechat;
          _scrollToBottom();
        });
  }

  @override
  void dispose() {
    NotificationHandler.instance.activeConversationId = null;
    if (Get.isRegistered<WebSocketService>()) {
      Get.find<WebSocketService>().leaveConversationRoomEvent(
        widget.conversationId,
      );
    }
    messageRoomController.activeConversationId = null;
    _scrollController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  /// 24-HOUR CUSTOMER WINDOW LOGIC CHECKER
  /// Returns `true` if:
  /// 1. The user has NEVER sent an inbound message to this chat yet.
  /// 2. The user's LAST inbound message was received more than 24 hours ago.
  bool _isSessionExpired(MessageRoomController controller) {
    // Find all messages sent BY THE USER (inbound direction)
    final inboundMessages = controller.roomMessageList
        .where(
          (msg) => msg.direction != "outbound", // or msg.direction == "inbound"
        )
        .toList();

    // Rule 1: If the user has NEVER sent a message, disable regular chat & images
    if (inboundMessages.isEmpty) {
      return true;
    }

    // Grab the latest inbound message from the user
    final lastUserMessage = inboundMessages.last;
    if (lastUserMessage.createdAt == null) return true;

    // Rule 2: Check if 24 hours have passed since the user's last message
    final DateTime lastMsgTime = DateTime.parse(
      lastUserMessage.createdAt.toString(),
    );
    final Duration difference = DateTime.now().difference(lastMsgTime);

    return difference.inHours >= 24;
  }

  void _assignChatToTeam() {
    final chatController = Get.find<ChatController>();
    chatController.getAllMembers();

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(0)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        height: 300,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    'Assign Chat to Team Member',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Expanded(
              child: GetBuilder<ChatController>(
                builder: (controller) {
                  if (controller.isLoading && controller.allMembers.isEmpty) {
                    return Center(child: AppUtils.widgetLoader());
                  }

                  if (controller.allMembers.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const Text("No members found."),
                          const SizedBox(height: 10),
                          RetryButton(
                            onRetry: () async {
                              await chatController.getAllMembers();
                            },
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    itemCount: controller.allMembers.length,
                    itemBuilder: (context, index) {
                      final member = controller.allMembers[index];
                      final name =
                          member.firstName ?? member.username ?? 'Unknown';
                      final initial = name.isNotEmpty
                          ? name[0].toUpperCase()
                          : '?';

                      final isAssignedToThisMember =
                          widget.chatConversation?.assignedTo == member.id ||
                          widget.chatConversation?.assignedTo == name ||
                          widget.chatConversation?.assignedToName == name;

                      return ListTile(
                        leading: CircleAvatar(child: Text(initial)),
                        title: Text(
                          name,
                          style: TextStyle(
                            color: AppColors.black,
                            fontSize: 16.sp,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        subtitle: Text(
                          member.email ?? '',
                          style: TextStyle(
                            color: AppColors.black.withValues(alpha: 0.5),
                            fontSize: 13.sp,
                          ),
                        ),
                        trailing: isAssignedToThisMember
                            ? TextButton(
                                onPressed: () {
                                  messageRoomController.unassignChat(
                                    conversationId: widget.conversationId,
                                  );
                                  Navigator.pop(context);
                                },
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 4,
                                  ),
                                  minimumSize: const Size(50, 30),
                                  backgroundColor: Colors.red.withOpacity(0.1),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                child: const Text(
                                  'Unassign',
                                  style: TextStyle(
                                    color: Colors.red,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 12,
                                  ),
                                ),
                              )
                            : null,
                        onTap: () {
                          messageRoomController.assigedChatTo(
                            conversationId: widget.conversationId,
                            userId: member.id ?? '',
                            userName: name,
                          );
                          Navigator.pop(context);
                        },
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: AppColors.primaryGreen.withValues(alpha: 0.3),
              child: Icon(
                Icons.person_2_rounded,
                color: AppColors.primaryGreen,
                size: 22,
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      widget.chatConversation?.contact?.name ?? 'Anonymous',
                      style: const TextStyle(
                        color: Colors.black87,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8F5E9),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF81C784),
                      width: 0.5,
                    ),
                  ),
                  child: const Text(
                    'open',
                    style: TextStyle(
                      color: Color(0xFF2E7D32),
                      fontSize: 8,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: OutlinedButton.icon(
              onPressed: _assignChatToTeam,
              icon: const Icon(
                Icons.person_add_alt_1_outlined,
                size: 16,
                color: Colors.black87,
              ),
              label: const Text(
                'Assign',
                style: TextStyle(color: Colors.black87, fontSize: 13),
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.grey.shade300),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12),
              ),
            ),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert, color: Colors.black54),
            onSelected: (value) async {
              if (value == 'pin') {
                await messageRoomController.togglePinChat(
                  conversationId: widget.conversationId,
                  isPinned: true,
                );
              } else if (value == 'archive') {
                await messageRoomController.archiveChat(
                  conversationId: widget.conversationId,
                  archivedstatus: "archived",
                );
              } else if (value == "unpin") {
                final msgCtrl = Get.find<MessageRoomController>();
                await msgCtrl.togglePinChat(
                  conversationId: widget.conversationId,
                  isPinned: false,
                );
              } else if (value == 'unarchive') {
                await messageRoomController.archiveChat(
                  conversationId: widget.conversationId,
                  archivedstatus: "open",
                );
              }
            },
            itemBuilder: (BuildContext context) {
              return [
                messageRoomController.chatPin
                    ? const PopupMenuItem<String>(
                        value: 'unpin',
                        child: Row(
                          children: [
                            Icon(
                              Icons.push_pin_outlined,
                              color: Colors.black54,
                              size: 20,
                            ),
                            SizedBox(width: 10),
                            Text('Unpin'),
                          ],
                        ),
                      )
                    : const PopupMenuItem<String>(
                        value: 'pin',
                        child: Row(
                          children: [
                            Icon(
                              Icons.push_pin_outlined,
                              color: Colors.black54,
                              size: 20,
                            ),
                            SizedBox(width: 10),
                            Text('Pin Chat'),
                          ],
                        ),
                      ),
                messageRoomController.archivechat
                    ? const PopupMenuItem<String>(
                        value: 'unarchive',
                        child: Row(
                          children: [
                            Icon(
                              Icons.archive_outlined,
                              color: Colors.black54,
                              size: 20,
                            ),
                            SizedBox(width: 10),
                            Text('Unarchive Chat'),
                          ],
                        ),
                      )
                    : const PopupMenuItem<String>(
                        value: 'archive',
                        child: Row(
                          children: [
                            Icon(
                              Icons.archive_outlined,
                              color: Colors.black54,
                              size: 20,
                            ),
                            SizedBox(width: 10),
                            Text('Archive Chat'),
                          ],
                        ),
                      ),
                const PopupMenuDivider(),
              ];
            },
          ),
        ],
      ),
      body: GetBuilder<MessageRoomController>(
        builder: (controller) {
          final bool isExpired = _isSessionExpired(controller);

          return Column(
            children: [
              Expanded(
                child:
                    controller.isLoading && controller.roomMessageList.isEmpty
                    ? const Center(
                        child: CircularProgressIndicator(
                          color: Color(0xFF1E701E),
                        ),
                      )
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.all(16),
                        itemCount: controller.roomMessageList.length,
                        itemBuilder: (context, index) {
                          final msg = controller.roomMessageList[index];
                          final isMe = msg.direction == "outbound";
                          final time = msg.createdAt != null
                              ? AppUtils.formatDate(msg.createdAt.toString())
                              : '';

                          if ((msg.content == null || msg.content!.isEmpty) &&
                              (msg.mediaUrl == null || msg.mediaUrl!.isEmpty)) {
                            return _buildUnknownTypeFallbackBubble(
                              time,
                              isMe: isMe,
                            );
                          }

                          return _buildMessageBubble(
                            content: msg.content ?? '',
                            time: time,
                            isMe: isMe,
                            mediaUrl: msg.mediaUrl,
                            messageId: msg.id,
                          );
                        },
                      ),
              ),

              // 24-Hour Expiration Warning Banner
              if (isExpired)
                Container(
                  width: double.infinity,
                  color: const Color(0xFFFFF3CD),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    children: const [
                      Icon(
                        Icons.info_outline,
                        color: Color(0xFF856404),
                        size: 18,
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          '24-hour window has expired. You can only send a template message.',
                          style: TextStyle(
                            color: Color(0xFF856404),
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

              // Bottom Input Bar
              Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                child: SafeArea(
                  child: Row(
                    children: [
                      IconButton(
                        icon: Icon(
                          Icons.attach_file,
                          color: isExpired
                              ? Colors.grey.shade300
                              : Colors.black54,
                        ),
                        onPressed: isExpired ? null : () => _pickImageAndSend(),
                      ),

                      // Template Button - ALWAYS Enabled
                      IconButton(
                        icon: Icon(
                          Icons.description_outlined,
                          color: AppColors.buttonColor,
                        ),
                        onPressed: () => _shareTemplateMenu(),
                      ),
                      const SizedBox(width: 4),

                      // Message Input Field - Disabled when expired
                      Expanded(
                        child: TextField(
                          controller: _messageController,
                          enabled: !isExpired,
                          decoration: InputDecoration(
                            hintText: isExpired
                                ? 'Messaging disabled (24h passed)...'
                                : 'Type a message...',
                            hintStyle: TextStyle(
                              color: isExpired
                                  ? Colors.grey.shade400
                                  : const Color(0xFF94A3B8),
                              fontSize: 14,
                            ),
                            fillColor: isExpired
                                ? Colors.grey.shade100
                                : const Color(0xFFF8FAFC),
                            filled: true,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 10,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide(
                                color: Colors.grey.shade200,
                                width: 1,
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide(
                                color: Colors.grey.shade200,
                                width: 1,
                              ),
                            ),
                            disabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide(
                                color: Colors.grey.shade200,
                                width: 1,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Send Button - Disabled when expired
                      Container(
                        decoration: BoxDecoration(
                          color: isExpired
                              ? Colors.grey.shade300
                              : AppColors.buttonColor,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: const Icon(
                            Icons.send,
                            color: Colors.white,
                            size: 18,
                          ),
                          onPressed: isExpired
                              ? null
                              : () {
                                  if (_messageController.text
                                      .trim()
                                      .isNotEmpty) {
                                    final msgText = _messageController.text
                                        .trim();

                                    if (widget.messageType == 'whatsapp') {
                                      messageRoomController.sendTextMessage(
                                        mobileNumber: widget.mobileNumber,
                                        message: msgText,
                                      );
                                    } else if (widget.messageType ==
                                        'chatbot') {
                                      messageRoomController
                                          .sendWidgetTextMessage(
                                            message: msgText,
                                            conversationId:
                                                widget.conversationId,
                                            agentId: widget.agentId ?? '',
                                            agentName: widget.agentName ?? '',
                                          );
                                    }

                                    _messageController.clear();
                                    _scrollToBottom();
                                  }
                                },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _shareTemplateMenu() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) =>
          SelectTemplateDialog(mobileNumber: widget.mobileNumber),
    );
  }

  Widget _buildMessageBubble({
    required String content,
    required String time,
    required bool isMe,
    String? mediaUrl,
    String? messageId,
  }) {
    final bool hasMediaUrl = mediaUrl != null && mediaUrl.isNotEmpty;
    final String? fallbackImageUrl =
        (!hasMediaUrl &&
            ((content.toLowerCase().startsWith('http://') ||
                    content.toLowerCase().startsWith('https://')) &&
                (content.toLowerCase().endsWith('.png') ||
                    content.toLowerCase().endsWith('.jpg') ||
                    content.toLowerCase().endsWith('.jpeg') ||
                    content.toLowerCase().endsWith('.gif') ||
                    content.toLowerCase().endsWith('.webp'))))
        ? content
        : null;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: isMe
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isMe) ...[
            const CircleAvatar(
              radius: 16,
              backgroundColor: Color(0xFFE2E8F0),
              child: Text(
                'C',
                style: TextStyle(color: Colors.black87, fontSize: 12),
              ),
            ),
            const SizedBox(width: 8),
          ],
          Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.65,
            ),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isMe ? const Color(0xFFDCF8C6) : const Color(0xFFDFEFFD),
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(12),
                topRight: const Radius.circular(12),
                bottomLeft: isMe
                    ? const Radius.circular(12)
                    : const Radius.circular(0),
                bottomRight: isMe
                    ? const Radius.circular(0)
                    : const Radius.circular(12),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 2,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (hasMediaUrl && messageId != null) ...[
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: FutureBuilder<String>(
                      future: messageRoomController.getUploadedImage(
                        messageID: messageId,
                      ),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return Container(
                            height: 150,
                            width: 150,
                            color: Colors.grey.shade200,
                            child: const Center(
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          );
                        }
                        if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                          try {
                            final base64String = snapshot.data!.split(',').last;
                            final Uint8List imageBytes = base64Decode(
                              base64String,
                            );
                            return GestureDetector(
                              onTap: () => ImageViewerDialog.show(
                                context,
                                imageBytes: imageBytes,
                              ),
                              child: MouseRegion(
                                cursor: SystemMouseCursors.click,
                                child: Image.memory(
                                  imageBytes,
                                  height: 150,
                                  width: 150,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            );
                          } catch (e) {
                            return Container(
                              height: 150,
                              width: 150,
                              color: Colors.grey.shade200,
                              child: const Icon(
                                Icons.broken_image,
                                color: Colors.grey,
                              ),
                            );
                          }
                        }
                        return Container(
                          height: 150,
                          width: 150,
                          color: Colors.grey.shade200,
                          child: const Icon(
                            Icons.broken_image,
                            color: Colors.grey,
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 6),
                ] else if (fallbackImageUrl != null) ...[
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: GestureDetector(
                      onTap: () => ImageViewerDialog.show(
                        context,
                        imageUrl: fallbackImageUrl,
                      ),
                      child: MouseRegion(
                        cursor: SystemMouseCursors.click,
                        child: CachedNetworkImage(
                          imageUrl: fallbackImageUrl,
                          placeholder: (context, url) => Container(
                            height: 150,
                            width: 150,
                            color: Colors.grey.shade200,
                            child: const Center(
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          ),
                          errorWidget: (context, url, error) => Container(
                            height: 150,
                            width: 150,
                            color: Colors.grey.shade200,
                            child: const Icon(
                              Icons.broken_image,
                              color: Colors.grey,
                            ),
                          ),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                ],
                if (content.isNotEmpty && content != fallbackImageUrl)
                  Text(
                    content,
                    style: const TextStyle(
                      color: Colors.black87,
                      fontSize: 14,
                      height: 1.3,
                    ),
                  ),
                const SizedBox(height: 4),
                Align(
                  alignment: Alignment.bottomRight,
                  child: Text(
                    time,
                    style: const TextStyle(color: Colors.grey, fontSize: 10),
                  ),
                ),
              ],
            ),
          ),
          if (isMe) ...[
            const SizedBox(width: 8),
            const CircleAvatar(
              radius: 16,
              backgroundColor: Color(0xFFCFD8DC),
              child: Text(
                'ME',
                style: TextStyle(
                  color: Colors.black87,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildUnknownTypeFallbackBubble(String time, {required bool isMe}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: isMe
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isMe) ...[
            const CircleAvatar(
              radius: 16,
              backgroundColor: Color(0xFFE2E8F0),
              child: Text(
                'C',
                style: TextStyle(color: Colors.black87, fontSize: 12),
              ),
            ),
            const SizedBox(width: 8),
          ],
          Container(
            width: 220,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isMe ? const Color(0xFFEFEBE9) : Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(12),
                topRight: const Radius.circular(12),
                bottomLeft: isMe
                    ? const Radius.circular(12)
                    : const Radius.circular(0),
                bottomRight: isMe
                    ? const Radius.circular(0)
                    : const Radius.circular(12),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.help_outline,
                      color: Colors.grey.shade500,
                      size: 18,
                    ),
                    const SizedBox(width: 6),
                    const Text(
                      'Message type unknown',
                      style: TextStyle(
                        color: Colors.black54,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Padding(
                  padding: const EdgeInsets.only(left: 24.0),
                  child: Text(
                    'Error code: 131051',
                    style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
                  ),
                ),
                const SizedBox(height: 6),
                Align(
                  alignment: Alignment.bottomRight,
                  child: Text(
                    time,
                    style: const TextStyle(color: Colors.grey, fontSize: 10),
                  ),
                ),
              ],
            ),
          ),
          if (isMe) ...[
            const SizedBox(width: 8),
            const CircleAvatar(
              radius: 16,
              backgroundColor: Color(0xFFCFD8DC),
              child: Text(
                'ME',
                style: TextStyle(color: Colors.black87, fontSize: 11),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Future<void> _pickImageAndSend() async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(source: ImageSource.gallery);

      if (image != null) {
        final File imageFile = File(image.path);
        final TextEditingController captionController = TextEditingController();

        if (mounted) {
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.vertical(top: Radius.circular(0)),
            ),
            builder: (BuildContext context) {
              return Padding(
                padding: EdgeInsets.only(
                  bottom: MediaQuery.of(context).viewInsets.bottom,
                ),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Image Preview",
                            style: TextStyle(
                              fontSize: 16.sp,
                              fontWeight: FontWeight.w600,
                              color: AppColors.black,
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              Get.back();
                            },
                            child: Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: Colors.grey.shade200,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.close,
                                size: 20,
                                color: Colors.black54,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Image.file(imageFile, height: 200, fit: BoxFit.contain),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: CommonTextField(
                              controller: captionController,
                              hintText: "Add a caption...",
                            ),
                          ),
                          const SizedBox(width: 10),
                          CircleAvatar(
                            radius: 24,
                            backgroundColor: AppColors.primaryGreen,
                            child: GetBuilder<MessageRoomController>(
                              builder: (controller) {
                                return controller.isImageSending
                                    ? SizedBox(
                                        height: 20,
                                        width: 20,
                                        child: AppUtils.widgetLoader(
                                          strokeWidth: 2,
                                        ),
                                      )
                                    : IconButton(
                                        icon: const Icon(Icons.send_rounded),
                                        onPressed: () async {
                                          final success =
                                              await messageRoomController
                                                  .shareImageInChat(
                                                    conversationId:
                                                        widget.conversationId,
                                                    imageFile: imageFile,
                                                    caption: captionController
                                                        .text
                                                        .trim(),
                                                  );
                                          if (success) {
                                            Get.back();
                                            _scrollToBottom();
                                          }
                                        },
                                      );
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                    ],
                  ),
                ),
              );
            },
          );
        }
      }
    } catch (e) {
      debugPrint("Error picking image: $e");
    }
  }
}
