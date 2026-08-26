import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sizer/sizer.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:flutter_contacts/flutter_contacts.dart' as fc hide PermissionStatus;
import 'package:permission_handler/permission_handler.dart';

import 'package:waki/modules/contactModule/add_to_group.dart';
import 'package:waki/utiles/app_utils.dart';
import '../../controllers/contact_controller.dart';
import '../../controllers/templates_controller.dart';
import '../../models/contact_model.dart';
import '../../theme/app_colors.dart';
import '../chatRoomModule/chat_room_screen.dart';
import '../../controllers/chat_controller.dart';
import '../../models/chat_conversation_model.dart' as chat_model;
import '../chatRoomModule/selectTemplate.dart';
import 'edit_contact_screen.dart';

class ContactsScreen extends StatefulWidget {
  const ContactsScreen({super.key});
  @override
  State<ContactsScreen> createState() => _ContactsScreenState();
}

class _ContactsScreenState extends State<ContactsScreen> {
  final ContactController controller = Get.put(ContactController());
  final TemplatesController templatesController = Get.find<TemplatesController>();
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  // Device Contacts State variables
  List<fc.Contact>? _contacts;
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    controller.allContact();
    _scrollController.addListener(_onScroll);
    _fetchContacts();
    templatesController.getTemplates();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 100) {
      if (!controller.isLoading &&
          !controller.isLoadMore &&
          controller.hasMore) {
        controller.allContact(
          loadMore: true,
          searchQuery: _searchController.text,
        );
      }
    }
  }

  Future<void> _fetchContacts() async {
    try {
      PermissionStatus permissionStatus = await Permission.contacts.request();

      if (permissionStatus.isGranted) {
        List<fc.Contact> rawContacts = await fc.FlutterContacts.getAll(
          properties: {
            fc.ContactProperty.phone,
            fc.ContactProperty.name,
          },
        );

        List<fc.Contact> filteredContacts = rawContacts.where((contact) {
          if (contact.displayName.toString().trim().isEmpty) {
            return false;
          }
          return contact.metadata!.accounts.any((account) =>
          account.type == 'com.whatsapp' || account.type == 'com.whatsapp.w4b');
        }).toList();

        setState(() {
          _contacts = filteredContacts;
          _isLoading = false;
        });
      } else if (permissionStatus.isPermanentlyDenied) {
        setState(() {
          _errorMessage = 'Permission permanently denied. Please enable it in system settings.';
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Permission to access contacts was denied.';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load contacts: $e';
        _isLoading = false;
      });
    }
  }

  void _shareTemplateMenu(String phoneNumber) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) =>  SelectTemplateDialog(mobileNumber: phoneNumber,isFromContact:true),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: const Text(
            'Contacts',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
          // Custom Container Layout for a Modern, Pill-Shaped Fancy TabBar
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(58),
            child: Container(
              height: 46,
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9), // Subdued neutral background
                borderRadius: BorderRadius.circular(12),
              ),
              child: TabBar(
                dividerColor: Colors.transparent, // Removes standard line divider
                indicatorSize: TabBarIndicatorSize.tab,
                labelColor: Colors.white,
                unselectedLabelColor: const Color(0xFF64748B),
                labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
                // Premium indicator pill highlight decoration
                indicator: BoxDecoration(
                  color: AppColors.primaryGreen,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryGreen.withOpacity(0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                tabs: const [
                  Tab(text: 'Account Contacts'),
                  Tab(text: 'Device Contacts'),
                ],
              ),
            ),
          ),
        ),
        body: TabBarView(
          children: [
            _buildAccountContactsTab(),
            _buildDeviceContactsTab(),
          ],
        ),
      ),
    );
  }

  // --- TAB 1: ACCOUNT CONTACTS ---
  Widget _buildAccountContactsTab() {
    return Column(
      children: [
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 2.0),
          child: TextField(
            controller: _searchController,
            onChanged: (value) {
              _searchController.text.isEmpty
                  ? controller.allContact()
                  : controller.allContact(searchQuery: value);
            },
            decoration: InputDecoration(
              hintText: 'Search chats, numbers...',
              hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
              prefixIcon: const Icon(Icons.search, color: Color(0xFF64748B), size: 20),
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
        const SizedBox(height: 8),
        Expanded(
          child: GetBuilder<ContactController>(
            builder: (controller) {
              if (controller.errorMessage != null && controller.contacts.isEmpty) {
                return Center(
                  child: Text(
                    "Error loading contacts: ${controller.errorMessage}",
                    style: const TextStyle(color: Colors.red),
                  ),
                );
              }

              if (controller.contacts.isEmpty && !controller.isLoading) {
                return const Center(child: Text("No contacts found for this channel."));
              }

              final displayList = (controller.isLoading && controller.isFirstLoad)
                  ? List.generate(
                8,
                    (index) => ContactsList(
                  name: "Mock Full Name Here",
                  phone: "9999999999",
                  createdAt: DateTime(2002),
                ),
              )
                  : controller.contacts;

              return RefreshIndicator(
                color: AppColors.primaryGreen,
                onRefresh: () async {
                  await controller.allContact(searchQuery: _searchController.text);
                  await controller.getAllGroups();
                },
                child: Skeletonizer(
                  enabled: controller.isLoading && controller.isFirstLoad,
                  child: ListView.separated(
                    controller: _scrollController,
                    itemCount: displayList.length + (controller.isLoadMore ? 1 : 0),
                    separatorBuilder: (context, index) => const Divider(
                      height: 1,
                      indent: 76,
                      endIndent: 16,
                      color: Color(0xFFF1F5F9),
                    ),
                    itemBuilder: (context, index) {
                      if (index == displayList.length) {
                        return AppUtils.paginateLoader();
                      }

                      final contact = displayList[index];
                      final Color avatarColor = AppUtils.getRandomVibrantColor(
                        contact.phone?.hashCode ?? index,
                      );

                      return ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
                        leading: CircleAvatar(
                          radius: 24,
                          backgroundColor: avatarColor.withValues(alpha: 0.2),
                          child: Icon(Icons.person_2_rounded, color: avatarColor, size: 27),
                        ),
                        title: Text(
                          contact.name ?? "",
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF0A192F)),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Wrap(
                                spacing: 4,
                                runSpacing: 4,
                                children: [
                                  Chip(
                                    avatar: const Icon(Icons.source_outlined, size: 16, color: Color(0xFF2563EB)),
                                    label: Text(
                                      contact.source?.name ?? "Unknown",
                                      style: TextStyle(fontSize: 13.sp, fontWeight: FontWeight.w700),
                                    ),
                                    backgroundColor: const Color(0xFFEFF6FF),
                                    side: BorderSide.none,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.w)),
                                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    visualDensity: VisualDensity.compact,
                                  ),
                                  Chip(
                                    avatar: Icon(
                                      Icons.circle,
                                      size: 10,
                                      color: (contact.status ?? "").toLowerCase() == "active" ? Colors.green : Colors.red,
                                    ),
                                    label: Text(
                                      contact.status?.toUpperCase() ?? "UNKNOWN",
                                      style: TextStyle(fontSize: 13.sp, fontWeight: FontWeight.w700),
                                    ),
                                    backgroundColor: (contact.status ?? "").toLowerCase() == "active"
                                        ? Colors.green.withValues(alpha: 0.2)
                                        : Colors.red.withValues(alpha: 0.2),
                                    side: BorderSide.none,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.w)),
                                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    visualDensity: VisualDensity.compact,
                                  ),
                                ],
                              ),
                              if (contact.groups != null && contact.groups!.isNotEmpty)
                                Padding(
                                  padding: const EdgeInsets.only(top: 2.0),
                                  child: Text(
                                    "Groups: ${contact.groups!.map((e) => e.replaceAll('_', ' ')).join(', ')}",
                                    style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        onTap: () {
                          final chatController = Get.find<ChatController>();
                          chat_model.ChatConversation? existingConv;
                          try {
                            existingConv = chatController.conversations.firstWhere(
                                  (conv) => conv.contactPhone == contact.phone,
                            );
                          } catch (e) {
                            existingConv = chat_model.ChatConversation(
                              id: "",
                              contactPhone: contact.phone,
                              contactName: contact.name,
                              type: contact.source?.name ?? "whatsapp",
                              contact: chat_model.Contact(name: contact.name, phone: contact.phone),
                            );
                          }

                          Get.to(() => ChatRoomScreen(
                            conversationId: existingConv?.id ?? "",
                            mobileNumber: contact.phone ?? "",
                            messageType: (contact.source?.name ?? "whatsapp").toLowerCase(),
                            chatConversation: existingConv,
                            chatPined: existingConv!.bucket?.toLowerCase() == 'pinned',
                            archivechat: existingConv.status?.toLowerCase() == 'archived',
                          ));
                        },
                        trailing: PopupMenuButton<String>(
                          icon: const Icon(Icons.more_vert, color: Colors.black38, size: 20),
                          position: PopupMenuPosition.under,
                          onSelected: (value) {
                            if (value == 'edit') {
                              Get.to(() => EditContactScreen(contact: contact));
                            } else if (value == 'add_group') {
                              showDialog(
                                context: context,
                                builder: (context) => AddToGroupDialog(contact: contact),
                              );
                            } else if (value == 'block') {
                              final isBlocked = contact.status?.toLowerCase() == 'blocked';
                              final newStatus = isBlocked ? "active" : "blocked";
                              controller.updateContact(contact.id ?? '', {"status": newStatus}).then((success) {
                                if (success) {
                                  AppUtils.showToast(
                                    message: 'Contact ${isBlocked ? 'unblocked' : 'blocked'} successfully',
                                  );
                                  controller.allContact();
                                }
                              });
                            }
                          },
                          itemBuilder: (context) => [
                            const PopupMenuItem(
                              value: 'edit',
                              child: Row(
                                children: [
                                  Icon(Icons.edit_outlined, color: Colors.black54, size: 20),
                                  SizedBox(width: 10),
                                  Text('Edit Contact'),
                                ],
                              ),
                            ),
                            const PopupMenuItem(
                              value: 'add_group',
                              child: Row(
                                children: [
                                  Icon(Icons.group_add_outlined, color: Colors.black54, size: 20),
                                  SizedBox(width: 10),
                                  Text('Add to Group'),
                                ],
                              ),
                            ),
                            PopupMenuItem(
                              value: 'block',
                              child: Row(
                                children: [
                                  Icon(
                                    contact.status?.toLowerCase() == 'blocked' ? Icons.check_circle_outline : Icons.block,
                                    color: contact.status?.toLowerCase() == 'blocked' ? Colors.green : Colors.red,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    contact.status?.toLowerCase() == 'blocked' ? 'Unblock Contact' : 'Block Contact',
                                    style: TextStyle(color: contact.status?.toLowerCase() == 'blocked' ? Colors.green : Colors.red),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // --- TAB 2: DEVICE CONTACTS ---
  Widget _buildDeviceContactsTab() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF1E701E)));
    }

    if (_errorMessage.isNotEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(_errorMessage, textAlign: TextAlign.center, style: const TextStyle(color: Colors.red)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => openAppSettings(),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E701E)),
                child: const Text('Open Settings', style: TextStyle(color: Colors.white)),
              )
            ],
          ),
        ),
      );
    }

    if (_contacts == null || _contacts!.isEmpty) {
      return const Center(child: Text('No contacts found on this device.'));
    }

    return ListView.separated(
      itemCount: _contacts!.length,
      separatorBuilder: (context, index) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
      itemBuilder: (context, index) {
        final contact = _contacts![index];
        final String phoneNumber = contact.phones.isNotEmpty ? contact.phones.first.number : 'No phone number';
        final memoryImage = contact.photo != null ? MemoryImage(contact.photo as Uint8List) : null;

        return ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          leading: CircleAvatar(
            radius: 22,
            backgroundColor: const Color(0xFF1E701E).withAlpha(30),
            backgroundImage: memoryImage,
            child: memoryImage == null ? const Icon(Icons.person, color: Color(0xFF1E701E)) : null,
          ),
          title: Text(
            contact.displayName.toString(),
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
          ),
          subtitle: Text(
            phoneNumber,
            style: const TextStyle(color: Colors.grey, fontSize: 13),
          ),
          trailing: ElevatedButton(
            onPressed: (){
              _shareTemplateMenu(contact.phones.first.number);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E701E),
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Send', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          ),
          onTap: () {
            print('Selected: ${contact.displayName}');
          },
        );
      },
    );
  }
}