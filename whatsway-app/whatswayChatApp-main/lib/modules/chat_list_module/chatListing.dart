import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:toastification/toastification.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/constants/image_path.dart';
import 'package:waki/modules/chat_list_module/chatlist_skeletion.dart';
import 'package:waki/network/brand_settings_storage.dart';
import 'package:waki/theme/app_colors.dart';
import 'package:waki/utiles/app_utils.dart';
import 'package:waki/widgets/retry_btn.dart';
import '../../controllers/chat_controller.dart';
import '../../controllers/profile_controller.dart';
import '../../controllers/message_room_controller.dart';
import '../../controllers/settings_controller.dart';
import '../../widgets/logout_dialog.dart';
import '../chatRoomModule/chat_room_screen.dart';
import '../contactModule/all_contact_screen.dart';
import '../profileModule/profile_screen.dart';

class Chatlisting extends StatefulWidget {
  const Chatlisting({super.key});

  @override
  State<Chatlisting> createState() => _ChatlistingState();
}

class _ChatlistingState extends State<Chatlisting> {
  String _selectedTag = 'All';
  final TextEditingController _searchController = TextEditingController();
  FocusNode focusNode = FocusNode();
  String _searchQuery = '';
  final chatController = Get.find<ChatController>();
  final List<String> _filterTags = [
    'All',
    'Archived',
    'WhatsApp',
    'Widget',
    'Assigned',
    'Unread',
    'Open',
    'Resolved',
  ];

  String? _brandLogo;
  String? _brandTitle;

  @override
  void initState() {
    super.initState();
    _loadBrandSettings();
  }

  Future<void> _loadBrandSettings() async {
    final logo = await BrandSettingsStorage.getLogo();
    final title = await BrandSettingsStorage.getTitle();
    if (mounted) {
      setState(() {
        _brandLogo = logo;
        _brandTitle = title;
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        titleSpacing: 15,
        title: GetBuilder<SettingController>(
          init: Get.isRegistered<SettingController>()
              ? null
              : Get.put(SettingController()),
          builder: (controller) {
            final logoUrl = controller.settingsData?.favicon ?? _brandLogo;
            final titleText =
                controller.settingsData?.title ??
                _brandTitle ??
                AppConstants.appName;

            return Row(
              children: [
                if (logoUrl != null && logoUrl.isNotEmpty)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: Image.network(
                      AppUtils.getFullImageUrl(logoUrl),
                      height: 30,
                      width: 30,
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) =>
                          Image.asset(ImagePath.applogo, height: 30, width: 30),
                    ),
                  )
                else
                  Image.asset(ImagePath.applogo, height: 30, width: 30),
                const SizedBox(width: 8),
                ShaderMask(
                  blendMode: BlendMode.srcIn,
                  shaderCallback: (bounds) =>
                      LinearGradient(
                        colors: [AppColors.primaryGreen, Colors.black],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ).createShader(
                        Rect.fromLTWH(0, 0, bounds.width, bounds.height),
                      ),
                  child: Text(
                    titleText.toUpperCase(),
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Colors.black.withValues(alpha: 0.85),
                      letterSpacing: -0.5,
                    ),
                  ),
                ),
              ],
            );
          },
        ),
        // Top Right Hand Side: Custom Dropdown / Options Menu Icon
        actions: [
          GetBuilder<ProfileController>(
            builder: (profileCtrl) {
              final profile = profileCtrl.profileDataModel;
              final name = profile?.firstName ?? profile?.username ?? 'U';
              final initial = name.isNotEmpty ? name[0].toUpperCase() : 'U';

              return PopupMenuButton<String>(
                position: PopupMenuPosition.under,
                onSelected: (value) async {
                  focusNode.unfocus();
                  if (value == 'account') {
                    final profileController = Get.find<ProfileController>();
                    await profileController.getProfileData();
                    Get.to(() => const ProfileScreen());
                  } else if (value == 'logout') {
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return const LogoutDialog();
                      },
                    );
                  }
                },
                itemBuilder: (BuildContext context) {
                  return [
                    const PopupMenuItem<String>(
                      value: 'account',
                      child: Row(
                        children: [
                          Icon(Icons.person, color: Colors.black54),
                          SizedBox(width: 8),
                          Text('Account'),
                        ],
                      ),
                    ),
                    const PopupMenuItem<String>(
                      value: 'logout',
                      child: Row(
                        children: [
                          Icon(Icons.logout, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Logout', style: TextStyle(color: Colors.red)),
                        ],
                      ),
                    ),
                  ];
                },
                child: Padding(
                  padding: const EdgeInsets.only(right: 16.0),
                  child: CircleAvatar(
                    radius: 18,
                    backgroundColor: AppColors.primaryGreen.withValues(
                      alpha: 0.2,
                    ),
                    child: Text(
                      initial,
                      style: TextStyle(
                        color: AppColors.primaryGreen,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Search Bar Wrapper Area
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 16.0,
              vertical: 8.0,
            ),
            child: TextField(
              controller: _searchController,
              focusNode: focusNode,
              onChanged: (value) {
                setState(() {
                  _searchQuery = value.toLowerCase();
                });
              },
              decoration: InputDecoration(
                hintText: 'Search chats, numbers...',
                hintStyle: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 14,
                ),
                prefixIcon: const Icon(
                  Icons.search,
                  color: Color(0xFF64748B),
                  size: 20,
                ),
                fillColor: const Color(0xFFF1F5F9),
                filled: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // 2. Filter Status Badges Row Listing
          SizedBox(
            height: 48,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 6.0,
              ),
              itemCount: _filterTags.length,
              itemBuilder: (context, index) {
                final tag = _filterTags[index];
                final isSelected = _selectedTag == tag;

                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ChoiceChip(
                    label: Text(tag),
                    selected: isSelected,
                    onSelected: (bool selected) {
                      focusNode.unfocus();
                      setState(() {
                        if (selected) _selectedTag = tag;
                      });
                    },
                    selectedColor: const Color(0xFFE8F5E9),
                    backgroundColor: const Color(0xFFF1F5F9),
                    labelStyle: TextStyle(
                      color: isSelected
                          ? const Color(0xFF2E7D32)
                          : const Color(0xFF64748B),
                      fontSize: 13,
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.w500,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: BorderSide(
                        color: isSelected
                            ? const Color(0xFF2E7D32).withOpacity(0.3)
                            : Colors.transparent,
                      ),
                    ),
                    showCheckmark: false,
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 2),

          GetBuilder<ChatController>(
            builder: (chatController) {
              if (chatController.isLoading &&
                  chatController.conversations.isEmpty) {
                return Expanded(child: skeletionLoader());
              }
              if (chatController.errorMessage != null &&
                  chatController.errorMessage!.isNotEmpty &&
                  chatController.conversations.isEmpty) {
                return Expanded(
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text("${chatController.errorMessage}"),
                        SizedBox(height: 10),
                        RetryButton(
                          onRetry: () async {
                            await chatController.loadConversations();
                            await chatController.loadPinedConversations();
                          },
                        ),
                      ],
                    ),
                  ),
                );
              }

              // 3. Show empty state
              if (chatController.conversations.isEmpty) {
                return Expanded(
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Text("No conversations found for this channel."),
                        const SizedBox(height: 10),
                        RetryButton(
                          onRetry: () async {
                            focusNode.unfocus();
                            await chatController.loadConversations();
                            await chatController.loadPinedConversations();
                          },
                        ),
                      ],
                    ),
                  ),
                );
              }

              // Apply filtering
              final filteredConversations = chatController.conversations.where((
                conv,
              ) {
                bool matchesSearch = true;
                if (_searchQuery.isNotEmpty) {
                  final name = (conv.contact?.name ?? '').toLowerCase();
                  final phone = (conv.contactPhone ?? '').toLowerCase();
                  matchesSearch =
                      name.contains(_searchQuery) ||
                      phone.contains(_searchQuery);
                }

                if (!matchesSearch) return false;

                if (_selectedTag.toLowerCase() != 'archived' &&
                    conv.status?.toLowerCase() == 'archived') {
                  return false;
                }

                switch (_selectedTag.toLowerCase()) {
                  case 'all':
                    return true;
                  case 'whatsapp':
                    return (conv.type?.toLowerCase() == 'whatsapp');
                  case 'widget':
                    return (conv.type?.toLowerCase() == 'chatbot');
                  case 'assigned':
                    return (conv.assignedToName != null &&
                        conv.assignedToName.toString().isNotEmpty);
                  case 'unread':
                    return ((conv.unreadCount ?? 0) > 0);
                  case 'open':
                    return (conv.status?.toLowerCase() == 'open');
                  case 'resolved':
                    return (conv.status?.toLowerCase() == 'resolved');
                  case 'archived':
                    return (conv.status?.toLowerCase() == 'archived');
                  default:
                    return true;
                }
              }).toList();

              filteredConversations.sort((a, b) {
                bool aIsPinned = a.bucket?.toLowerCase() == 'pinned';
                bool bIsPinned = b.bucket?.toLowerCase() == 'pinned';

                if (aIsPinned && !bIsPinned) return -1;
                if (!aIsPinned && bIsPinned) return 1;

                DateTime aTime =
                    a.lastMessageAt ?? DateTime.fromMillisecondsSinceEpoch(0);
                DateTime bTime =
                    b.lastMessageAt ?? DateTime.fromMillisecondsSinceEpoch(0);
                return bTime.compareTo(aTime);
              });

              if (filteredConversations.isEmpty) {
                return Expanded(
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Text("No results found for your search/filter."),
                      ],
                    ),
                  ),
                );
              }

              // 4. Render data list`
              return Expanded(
                child: RefreshIndicator(
                  onRefresh: () async {
                    focusNode.unfocus();
                    await chatController.loadConversations();
                    await chatController.loadPinedConversations();
                  },
                  child: ListView.separated(
                    itemCount: filteredConversations.length,
                    separatorBuilder: (context, index) =>
                        const Divider(color: AppColors.dividerColor),
                    itemBuilder: (context, index) {
                      final conversation = filteredConversations[index];
                      final Color avatarColor = AppUtils.getRandomVibrantColor(
                        index,
                      );

                      return ListTile(
                        contentPadding: EdgeInsets.fromLTRB(
                          16,
                          4,
                          conversation.status?.toLowerCase() == 'archived' ||
                                  conversation.bucket?.toLowerCase() == 'pinned'
                              ? 10
                              : 16,
                          4,
                        ),
                        leading: CircleAvatar(
                          radius: 24,
                          backgroundColor: avatarColor.withValues(alpha: 0.2),
                          child: Icon(
                            Icons.person_2_rounded,
                            color: avatarColor,
                            size: 27,
                          ),
                        ),
                        title: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                conversation.contact?.name ?? 'Anonymous',
                                style: const TextStyle(
                                  fontSize: 15,

                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF0A192F),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Text(
                              AppUtils.formatDate(
                                conversation.lastMessageAt.toString(),
                              ),
                              style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4.0),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  conversation.lastMessageText ?? '',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ),
                              if ((conversation.unreadCount ?? 0) > 0)
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryGreen,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Text(
                                    '${conversation.unreadCount ?? 0}',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        onTap: () {
                          focusNode.unfocus();
                          Get.to(
                            () => ChatRoomScreen(
                              conversationId: conversation.id ?? "",
                              mobileNumber: conversation.contactPhone ?? "",
                              messageType: conversation.type ?? "whatsapp",
                              chatConversation: conversation,
                              chatPined:
                                  conversation.bucket?.toLowerCase() ==
                                  'pinned',
                              archivechat:
                                  conversation.status?.toLowerCase() ==
                                  'archived',
                            ),
                          )?.then((_) {
                            chatController.loadConversations();
                            chatController.loadPinedConversations();
                          });
                        },
                        trailing:
                            (conversation.bucket?.toLowerCase() == 'pinned' ||
                                conversation.status?.toLowerCase() ==
                                    'archived')
                            ? Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (conversation.bucket?.toLowerCase() ==
                                      'pinned')
                                    GestureDetector(
                                      child: Icon(
                                        Icons.push_pin,
                                        color: AppColors.primaryGreen
                                            .withValues(alpha: 0.7),
                                        size: 20,
                                      ),
                                      onTap: () async {
                                        HapticFeedback.lightImpact();
                                        final msgCtrl =
                                            Get.find<MessageRoomController>();
                                        await msgCtrl.togglePinChat(
                                          conversationId: conversation.id ?? "",
                                          isPinned: false,
                                        );
                                        chatController.loadConversations();
                                        chatController.loadPinedConversations();
                                      },
                                    ),
                                  SizedBox(height: 5),
                                  if (conversation.status?.toLowerCase() ==
                                      'archived')
                                    GestureDetector(
                                      child: const Icon(
                                        Icons.unarchive_outlined,
                                        color: Colors.black54,
                                        size: 20,
                                      ),
                                      onTap: () {
                                        showDialog(
                                          context: context,
                                          builder: (context) => AlertDialog(
                                            title: const Text('Unarchive Chat'),
                                            content: const Text(
                                              'Are you sure you want to remove this chat from archive?',
                                            ),
                                            actions: [
                                              TextButton(
                                                onPressed: () =>
                                                    Navigator.pop(context),
                                                child: const Text(
                                                  'Cancel',
                                                  style: TextStyle(
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                              ),
                                              TextButton(
                                                onPressed: () async {
                                                  Navigator.pop(context);
                                                  final msgCtrl =
                                                      Get.find<
                                                        MessageRoomController
                                                      >();
                                                  await msgCtrl.archiveChat(
                                                    conversationId:
                                                        conversation.id ?? "",
                                                    archivedstatus: "open",
                                                  );
                                                },
                                                child: Text(
                                                  'Confirm',
                                                  style: TextStyle(
                                                    color:
                                                        AppColors.primaryGreen,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                                ],
                              )
                            : null,
                      );
                    },
                  ),
                ),
              );
            },
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Get.to(() => const ContactsScreen());
          // Get.to(() => const DeviceContactsScreen());
        },

        backgroundColor: AppColors.buttonColor,

        foregroundColor: Colors.white,

        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),

        elevation: 4,

        child: const Icon(Icons.chat_rounded, size: 24),
      ),
    );
  }
}
