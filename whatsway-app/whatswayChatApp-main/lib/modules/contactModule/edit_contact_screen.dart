import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sizer/sizer.dart';
import 'package:waki/constants/constants.dart';
import 'package:waki/models/contact_model.dart';
import 'package:waki/utiles/app_utils.dart';
import 'package:waki/widgets/custom_elevated_button.dart';
import 'package:waki/widgets/common_text_field.dart';
import 'package:waki/models/all_groups_mode.dart' as group_model;
import '../../controllers/contact_controller.dart';

class EditContactScreen extends StatefulWidget {
  final ContactsList contact;

  const EditContactScreen({super.key, required this.contact});

  @override
  State<EditContactScreen> createState() => _EditContactScreenState();
}

class _EditContactScreenState extends State<EditContactScreen> {
  late TextEditingController nameController;
  late TextEditingController emailController;
  late TextEditingController phoneController;
  FocusNode nameFocusNode = FocusNode();
  FocusNode emailFocusNode = FocusNode();
  FocusNode phoneFocusNode = FocusNode();
  List<String> selectedGroups = [];
  bool isSubmitting = false;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.contact.name);
    emailController = TextEditingController(text: widget.contact.email);
    phoneController = TextEditingController(text: widget.contact.phone);
    if (widget.contact.groups != null && widget.contact.groups!.isNotEmpty) {
      selectedGroups = widget.contact.groups!.map((e) {
        return e;
      }).toList();
    }
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    nameFocusNode.dispose();
    emailFocusNode.dispose();
    phoneFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Edit Contact',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          centerTitle: false,
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Update contact information',
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
              const SizedBox(height: 20),

              _buildLabel('Name'),
              CommonTextField(
                controller: nameController,
                focusNode: nameFocusNode,
              ),
              const SizedBox(height: 16),

              _buildLabel('Email (Optional)'),
              CommonTextField(
                controller: emailController,
                focusNode: emailFocusNode,
              ),
              const SizedBox(height: 16),

              _buildLabel('Phone Number'),
              CommonTextField(
                controller: phoneController,
                focusNode: phoneFocusNode,
              ),
              const SizedBox(height: 16),

              _buildLabel('Groups'),
              GetBuilder<ContactController>(
                builder: (contactController) {
                  List<group_model.Group> groups = List<group_model.Group>.from(
                    contactController.allGroups ?? [],
                  );
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        isExpanded: true,
                        hint: contactController.isGroupsLoading
                            ? const Text(
                                'Loading groups...',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 14,
                                ),
                              )
                            : const Text(
                                'Select group',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 14,
                                ),
                              ),
                        icon: const Icon(
                          Icons.keyboard_arrow_down,
                          color: Colors.grey,
                        ),
                        items: groups.map((group_model.Group g) {
                          return DropdownMenuItem<String>(
                            value: g.name,
                            child: Text(g.name ?? ''),
                          );
                        }).toList(),
                        onChanged: (value) {
                          if (value != null &&
                              !selectedGroups.contains(value)) {
                            setState(() {
                              selectedGroups.add(value);
                            });
                          }
                        },
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 10),
              if (selectedGroups.isNotEmpty)
                Wrap(
                  spacing: 8,
                  children: selectedGroups.map((group) {
                    return Chip(
                      label: Text(
                        group,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      backgroundColor: const Color(0xFF1E701E),
                      deleteIcon: const Icon(
                        Icons.close,
                        color: Colors.white,
                        size: 16,
                      ),
                      onDeleted: () {
                        setState(() {
                          selectedGroups.remove(group);
                        });
                      },
                      padding: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: const BorderSide(color: Colors.transparent),
                      ),
                    );
                  }).toList(),
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
        bottomNavigationBar: Container(
          padding: EdgeInsets.symmetric(horizontal: 3.w, vertical: 5),
          child: CustomElevatedButton(
            onPressed: isSubmitting ? null : _updateContact,
            isLoading: isSubmitting,
            loadingText: "Updating...",
            text: 'Save Changes',
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        text,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
      ),
    );
  }

  void _updateContact() async {
    nameFocusNode.unfocus();
    emailFocusNode.unfocus();
    phoneFocusNode.unfocus();
    final contactController = Get.find<ContactController>();

    setState(() {
      isSubmitting = true;
    });

    List<String> payloadGroups = selectedGroups.map((g) {
      if (g == 'New Leads') return 'new_leads';
      return g.toUpperCase();
    }).toList();
    final prefs = await SharedPreferences.getInstance();
    final channelId = prefs.getString(AppConstants.channelId);
    Map<String, dynamic> payload = {
      "channelId": channelId,
      "name": nameController.text.trim(),
      "phone": phoneController.text.trim(),
      "email": emailController.text.trim(),
      "groups": payloadGroups,
      "tags": [],
      "status": "active",
    };
    bool success = await contactController.updateContact(
      widget.contact.id ?? '',
      payload,
    );
    if (mounted) {
      setState(() {
        isSubmitting = false;
      });
    }
    if (success) {
      AppUtils.showToast(message: 'Contact updated successfully');
      contactController.allContact();
      Get.back();
    }
  }
}
