import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:waki/controllers/contact_controller.dart';
import 'package:waki/models/contact_model.dart';
import 'package:waki/utiles/app_utils.dart';
import 'package:waki/widgets/custom_elevated_button.dart';

class AddToGroupDialog extends StatefulWidget {
  final ContactsList contact;

  const AddToGroupDialog({super.key, required this.contact});

  @override
  State<AddToGroupDialog> createState() => _AddToGroupDialogState();
}

class _AddToGroupDialogState extends State<AddToGroupDialog> {
  String? selectedGroup;
  bool isSaving = false;
  bool isRemoving = false;

  @override
  Widget build(BuildContext context) {
    bool isContactInSelectedGroup = false;
    if (selectedGroup != null && widget.contact.groups != null) {
      final groupNames = widget.contact.groups!
          .map((e) => e.toLowerCase().replaceAll('_', ' '))
          .toList();
      isContactInSelectedGroup = groupNames.contains(
        selectedGroup!.toLowerCase().replaceAll('_', ' '),
      );
    }

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Manage Groups',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  onPressed: () => Get.back(),
                  icon: const Icon(Icons.close, color: Colors.grey),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppUtils.getRandomVibrantColor(
                    widget.contact.phone?.hashCode ?? 0,
                  ).withValues(alpha: 0.2),
                  child: Icon(
                    Icons.person_2_rounded,
                    color: AppUtils.getRandomVibrantColor(
                      widget.contact.phone?.hashCode ?? 0,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.contact.name ?? "Unknown",
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        widget.contact.phone ?? "",
                        style: const TextStyle(
                          fontSize: 13,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (widget.contact.groups != null &&
                widget.contact.groups!.isNotEmpty) ...[
              const SizedBox(height: 20),
              const Text(
                'Current Groups',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF334155),
                ),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: widget.contact.groups!.map((groupName) {
                  return Chip(
                    label: Text(
                      groupName.replaceAll('_', ' '),
                      style: const TextStyle(fontSize: 12),
                    ),
                    deleteIcon: const Icon(Icons.close, size: 16),
                    onDeleted: isRemoving || isSaving
                        ? null
                        : () async {
                            setState(() => isRemoving = true);
                            final controller = Get.find<ContactController>();
                            bool success = await controller.removeFromGroup(
                              widget.contact.id ?? '',
                              groupName,
                            );
                            setState(() => isRemoving = false);

                            if (success) {
                              AppUtils.showToast(
                                message: 'Removed from group successfully',
                              );
                              setState(() {
                                widget.contact.groups?.remove(groupName);
                              });
                              controller.allContact();
                            }
                          },
                  );
                }).toList(),
              ),
            ],
            const SizedBox(height: 20),
            const Text(
              'Select Group',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF334155),
              ),
            ),
            const SizedBox(height: 8),
            GetBuilder<ContactController>(
              builder: (contactController) {
                final groups = contactController.allGroups ?? [];

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
                      value: selectedGroup,
                      items: groups.map((g) {
                        return DropdownMenuItem<String>(
                          value: g.name,
                          child: Text(g.name ?? ''),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedGroup = value;
                        });
                      },
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            CustomElevatedButton(
              width: double.infinity,
              isLoading: isSaving,
              loadingText: "Adding...",
              onPressed: isSaving
                  ? null
                  : () async {
                      if (selectedGroup == null) {
                        AppUtils.showToast(message: 'Please select a group');
                        return;
                      }
                      setState(() => isSaving = true);
                      final controller = Get.find<ContactController>();
                      bool success = await controller.addToGroup(
                        widget.contact.id ?? '',
                        selectedGroup!,
                      );
                      setState(() => isSaving = false);

                      if (success) {
                        AppUtils.showToast(
                          message: 'Added to group successfully',
                        );
                        setState(() {
                          widget.contact.groups ??= [];
                          widget.contact.groups!.add(selectedGroup!);
                        });
                        controller.allContact();
                      }
                    },
              text: 'Add',
            ),
          ],
        ),
      ),
    );
  }
}
