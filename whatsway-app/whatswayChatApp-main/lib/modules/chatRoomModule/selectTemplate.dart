import 'package:flutter/material.dart';
import 'package:get/get_core/src/get_main.dart';
import 'package:get/get_instance/src/extension_instance.dart';
import 'package:waki/modules/chatRoomModule/template_detail_screen.dart';

import '../../controllers/templates_controller.dart';
import '../../models/template_model.dart';

class SelectTemplateDialog extends StatefulWidget {
  String mobileNumber;
  bool isFromContact;
   SelectTemplateDialog({Key? key,required this.mobileNumber, this.isFromContact=false}) : super(key: key);

  @override
  State<SelectTemplateDialog> createState() => _SelectTemplateDialogState();
}


class _SelectTemplateDialogState extends State<SelectTemplateDialog> {
  String _activeCategory = 'All';
  final TextEditingController _searchTemplate = TextEditingController();
  final templatesController = Get.find<TemplatesController>();
  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
      child: Container(
        // Responsive scaling limits for high-res screens
        width: mediaQuery.size.width > 900 ? 850 : mediaQuery.size.width * 0.9,
        height: mediaQuery.size.height * 0.85,
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Header Frame
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Select Template',
                        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Choose an approved template to send',
                        style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.black54),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Search Bar Input
            TextField(
              controller: _searchTemplate,
              onChanged: (value) {
                // Hits the endpoint reactively with your search param formatting
                _searchTemplate.text.isEmpty?
                templatesController.getTemplates():
                templatesController.getTemplates(searchQuery: "name=$value");

              },
              decoration: InputDecoration(
                hintText: 'Search templates...',
                hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                prefixIcon: const Icon(Icons.search, color: Color(0xFF64748B), size: 20),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Color(0xFF22C55E), width: 1.5),
                ),

                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Color(0xFF22C55E), width: 1.5),
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
            ),
            const SizedBox(height: 16),

            // Filter Badges Horizontal Wrap Row
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('All', isSelected: _activeCategory == 'All'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Marketing', icon: Icons.campaign_outlined, isSelected: _activeCategory == 'Marketing'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Utility', icon: Icons.build_outlined, isSelected: _activeCategory == 'Utility'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Auth', icon: Icons.lock_outline, isSelected: _activeCategory == 'Auth'),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // RESPONSIVE GRID WRAPPER
            Expanded(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  // Calculate dynamic aspect ratios depending on space availability to avoid text overflow
                  double dynamicChildAspectRatio = constraints.maxWidth > 600 ? 1.4 : 1.2;

                  return GridView.builder(
                    itemCount: templatesController.allTemplates.length, // Number of templates
                    gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
                      maxCrossAxisExtent: 420, // Forces multi-column on desktop/tablets, single column on phones
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: dynamicChildAspectRatio,
                    ),
                    itemBuilder: (context, index) {

                        return _buildTemplateCard(
                          title: '${templatesController.allTemplates[index].name}',
                          category: '${templatesController.allTemplates[index].category}',
                          body: '${templatesController.allTemplates[index].body}',
                          tags: templatesController.allTemplates[index].buttons,
                          language: '${templatesController.allTemplates[index].language}',
                          onTap: () => _openConfigureDialog(index),
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

  void _openConfigureDialog(int index) {
    Navigator.pop(context);
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => ConfigureTemplateDialog(index: index, mobileNumber: widget.mobileNumber,isFromContact:widget.isFromContact),
    );
  }

  Widget _buildFilterChip(String label, {IconData? icon, required bool isSelected}) {
    return ChoiceChip(
      label: Row(
        children: [
          if (icon != null) Icon(icon, size: 16, color: isSelected ? Colors.white : const Color(0xFF64748B)),
          if (icon != null) const SizedBox(width: 4),
          Text(label),
        ],
      ),
      selected: isSelected,
      onSelected: (val) {
        setState(() => _activeCategory = label);
      },
      selectedColor: const Color(0xFF1E701E),
      backgroundColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : const Color(0xFF64748B),
        fontSize: 13,
        fontWeight: FontWeight.w500,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: isSelected ? Colors.transparent : Colors.grey.shade300),
      ),
    );
  }

  Widget _buildTemplateCard({
    required String title,
    required String category,
    required String body,
    List<Button>? tags,
    bool isGreenBorder = false,
    required VoidCallback onTap,
    required String language
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isGreenBorder ? const Color(0xFF22C55E) : Colors.grey.shade200,
            width: isGreenBorder ? 1.5 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
            const SizedBox(height: 6),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: category == 'Utility' ? const Color(0xFFEFF6FF) : const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    category,
                    style: TextStyle(
                      color: category == 'Utility' ? const Color(0xFF2563EB) : const Color(0xFF7C3AED),
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.language, size: 14, color: Colors.grey),
                const SizedBox(width: 4),
                 Text(language, style: TextStyle(color: Colors.grey, fontSize: 11)),
              ],
            ),
            const SizedBox(height: 10),
            Expanded(
              child: Text(
                body,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: Color(0xFF475569), fontSize: 13, height: 1.3),
              ),
            ),
            if (tags != null) ...[
              const SizedBox(height: 6),
              Row(
                children: tags.map((t) => Padding(
                  padding: const EdgeInsets.only(right: 6.0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                    child: Text(t.text.toString(), style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                  ),
                )).toList(),
              )
            ]
          ],
        ),
      ),
    );
  }
}