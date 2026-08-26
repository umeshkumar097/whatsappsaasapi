import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get_core/src/get_main.dart';
import 'package:get/get_instance/src/extension_instance.dart';
import 'package:image_picker/image_picker.dart';
import 'package:waki/modules/chatRoomModule/selectTemplate.dart';

import '../../controllers/message_room_controller.dart';
import '../../controllers/templates_controller.dart';
import '../../models/template_model.dart';

class ConfigureTemplateDialog extends StatefulWidget {
int index;
String mobileNumber;
bool isFromContact;
   ConfigureTemplateDialog({Key? key, required this.index,required this.mobileNumber,this.isFromContact=false}) : super(key: key);

  @override
  State<ConfigureTemplateDialog> createState() => _ConfigureTemplateDialogState();
}

class _ConfigureTemplateDialogState extends State<ConfigureTemplateDialog> {
final templatesController = Get.find<TemplatesController>();

final messageRoomController = Get.find<MessageRoomController>();

// 1. STATE VARIABLES (Declare here)
final Map<int, String> _selectedFileNames = {};
 // Stores chosen image file names per card
final Map<int, String> _uploadedMediaIds = {};
  // Stores returned API mediaIds per card
final Map<int, bool> _isUploading = {};
         // Tracks loading spinner state per card
  Future<void> _pickAndUploadImage(int cardIndex, String templateId) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      File imageFile = File(image.path);

      setState(() {
        _selectedFileNames[cardIndex] = image.name;
        _isUploading[cardIndex] = true;
      });

      // 1. Trigger image upload
      String? mediaId = await messageRoomController.uploadTemplateImage(
        imageFile: imageFile,
        templateId: templateId,
      );

      // 2. Store returned mediaId
      setState(() {
        _isUploading[cardIndex] = false;
        if (mediaId != null && mediaId.isNotEmpty) {
          _uploadedMediaIds[cardIndex] = mediaId; // <-- Saved here
        } else {
          _selectedFileNames[cardIndex] = 'Upload failed. Tap to retry.';
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
      child: Container(
        width: mediaQuery.size.width > 900 ? 850 : mediaQuery.size.width * 0.9,
        height: mediaQuery.size.height * 0.9,
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Configuration Bar Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Configure Template',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.black54),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Text(
              'Upload images/videos for each card. The media from template creation will be used if you don\'t upload new ones.',
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.3),
            ),
            const SizedBox(height: 16),

            // Main Body Config Form Workspace List
            Expanded(
              child: ListView.builder(
                itemCount: templatesController.allTemplates[widget.index].carouselCards?.length??0,
                itemBuilder: (BuildContext context, int carouselCardsIndex) {
                  return   _buildCardConfigBlock(templatesController.allTemplates[widget.index].carouselCards![carouselCardsIndex],carouselCardsIndex,
                      templatesController.allTemplates[widget.index].id.toString()
                  );
                },


              ),
            ),

            const SizedBox(height: 16),
            const Divider(height: 1, color: Color(0xFFE2E8F0)),
            const SizedBox(height: 16),

            // NEW BOTTOM BUTTONS LAYOUT FROM SCREENSHOT
            Row(
              children: [
                // 1. BACK ACTION BUTTON
                SizedBox(
                  height: 44,
                  width: 100,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(context); // Close this config window
                      showDialog(
                        context: context,
                        builder: (context) =>  SelectTemplateDialog(mobileNumber: widget.mobileNumber,), // Reload the primary selection dialog
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.grey.shade300),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text(
                      'Back',
                      style: TextStyle(color: Colors.black87, fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                  ),
                ),
                const SizedBox(width: 12),

                // 2. SEND TEMPLATE ACTION BUTTON
                SizedBox(
                  height: 44,
                  child:
                  // Inside ConfigureTemplateDialog's build method:
                  ElevatedButton(
                    onPressed: () async {
                      // 1. Get current template details
                      final currentTemplate = templatesController.allTemplates[widget.index];

                      // 2. Extract ALL uploaded media IDs in exact order as a List<String>
                      // Example output for 2 cards: ["1601959741565283", "1702959741565284"]
                      List<String> mediaIdList = _uploadedMediaIds.values
                          .where((id) => id.trim().isNotEmpty)
                          .toList();

                      // 3. Determine single vs multi-image properties
                      String? singleMediaId = mediaIdList.length == 1 ? mediaIdList.first : null;

                      // 4. Send parameters
                      List<Map<String, dynamic>> templateParams = mediaIdList.isEmpty
                          ? []
                          : [
                        {"type": "custom", "value": "John Doe"}
                      ];

                      // 5. Call API method with the list of media IDs
                      bool success = await messageRoomController.sendTemplateMessage(
                        toPhone: widget.mobileNumber,
                        templateName: currentTemplate.name ?? '',
                        headerType: currentTemplate.headerType ?? 'IMAGE',
                        templateMessage: currentTemplate.body ?? '',
                        parameters: templateParams,
                        isFromContact: widget.isFromContact,
                        uploadedMediaIds: mediaIdList, // <-- Sends List<String> of all uploaded IDs
                        mediaId: singleMediaId,        // <-- Non-null ONLY if exactly 1 image was uploaded
                      );

                      if (success) {
                        Navigator.pop(context); // Close dialog
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E701E),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text(
                      'Send Template',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                    ),
                  )
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

Widget _buildCardConfigBlock(
    CarouselCard carouselCard,
    int carouselCardIndex,
    String templateId,
    ) {
  final bool uploading = _isUploading[carouselCardIndex] ?? false;
  final bool isUploaded = _uploadedMediaIds.containsKey(carouselCardIndex);
  final String fileName = _selectedFileNames[carouselCardIndex] ?? 'No file chosen';

  return Container(
    margin: const EdgeInsets.only(bottom: 12),
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: const Color(0xFFE2E8F0)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Card Title & Media Type Badge
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Card ${carouselCardIndex + 1}",
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                carouselCard.mediaType ?? "",
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
              ),
            )
          ],
        ),
        const SizedBox(height: 10),

        // Body Text
        Text(
          carouselCard.body ?? "",
          style: const TextStyle(color: Color(0xFF334155), fontSize: 13, height: 1.3),
        ),
        const SizedBox(height: 8),

        // Button Chip (if present)
        if (carouselCard.buttons != null && carouselCard.buttons!.isNotEmpty)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              carouselCard.buttons![0].text ?? "",
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black54),
            ),
          ),
        const SizedBox(height: 16),

        // Custom File Input Display Row Block
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Row(
            children: [
              // Choose File Button / Loader
              ElevatedButton(
                onPressed: uploading
                    ? null
                    : () => _pickAndUploadImage(carouselCardIndex, templateId),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black87,
                  elevation: 0,
                  side: BorderSide(color: Colors.grey.shade300),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                ),
                child: uploading
                    ? const SizedBox(
                  height: 14,
                  width: 14,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Color(0xFF1E701E),
                  ),
                )
                    : const Text('Choose file', style: TextStyle(fontSize: 12)),
              ),
              const SizedBox(width: 12),

              // Dynamic File Name / Upload Status Label
              Expanded(
                child: Text(
                  fileName,
                  style: TextStyle(
                    color: isUploaded ? const Color(0xFF1E701E) : Colors.grey,
                    fontSize: 13,
                    fontWeight: isUploaded ? FontWeight.w600 : FontWeight.normal,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Optional — template example media will be used if not provided',
          style: TextStyle(
            fontSize: 11,
            color: Colors.grey.shade400,
            fontStyle: FontStyle.italic,
          ),
        ),
      ],
    ),
  );
}
}