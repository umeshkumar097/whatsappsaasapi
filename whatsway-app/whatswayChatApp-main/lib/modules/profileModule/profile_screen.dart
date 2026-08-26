import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:waki/controllers/profile_controller.dart';
import 'package:waki/theme/app_colors.dart';
import 'package:waki/widgets/common_text_field.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _roleController = TextEditingController();
  final _statusController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final profile = Get.find<ProfileController>().profileDataModel;
    if (profile != null) {
      _firstNameController.text = profile.firstName ?? '';
      _lastNameController.text = profile.lastName ?? '';
      _usernameController.text = profile.username ?? '';
      _emailController.text = profile.email ?? '';
      _roleController.text = profile.role ?? '';
      _statusController.text = profile.status ?? '';
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _usernameController.dispose();
    _emailController.dispose();
    _roleController.dispose();
    _statusController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'My Profile',
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold),
        ),
      ),
      body: GetBuilder<ProfileController>(
        builder: (controller) {
          if (controller.isLoading && controller.profileDataModel == null) {
            return const Center(child: CircularProgressIndicator());
          }

          final profile = controller.profileDataModel;
          if (profile == null) {
            return const Center(child: Text('Profile data not available'));
          }

          final name = '${profile.firstName ?? ''} ${profile.lastName ?? ''}'
              .trim();
          final displayName = name.isNotEmpty
              ? name
              : (profile.username ?? 'Unknown');
          final initial = displayName.isNotEmpty
              ? displayName[0].toUpperCase()
              : '?';

          return SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 32),
                // Avatar Section
                Center(
                  child: Stack(
                    children: [
                      Container(
                        decoration: BoxDecoration(shape: BoxShape.circle),
                        child: CircleAvatar(
                          radius: 56,
                          backgroundColor: AppColors.primaryGreen.withValues(
                            alpha: 0.15,
                          ),
                          backgroundImage:
                              profile.avatar != null &&
                                  profile.avatar!.isNotEmpty
                              ? NetworkImage(profile.avatar!)
                              : null,
                          child:
                              profile.avatar == null || profile.avatar!.isEmpty
                              ? Text(
                                  initial,
                                  style: TextStyle(
                                    fontSize: 44,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primaryGreen,
                                  ),
                                )
                              : null,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  displayName,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  profile.email ?? '',
                  style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
                ),
                const SizedBox(height: 20),

                // Form Container
                Container(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Account Information",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 24),

                      Row(
                        children: [
                          Expanded(
                            child: CommonTextField(
                              controller: _firstNameController,
                              labelText: "First Name",
                              readOnly: true,
                              prefixIcon: Icon(
                                Icons.person_outline,
                                color: AppColors.primaryGreen,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: CommonTextField(
                              controller: _lastNameController,
                              labelText: "Last Name",
                              readOnly: true,
                              prefixIcon: Icon(
                                Icons.person_outline,
                                color: AppColors.primaryGreen,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      CommonTextField(
                        controller: _usernameController,
                        labelText: "Username",
                        readOnly: true,
                        prefixIcon: Icon(
                          Icons.badge_outlined,
                          color: AppColors.primaryGreen,
                        ),
                      ),
                      const SizedBox(height: 20),
                      CommonTextField(
                        controller: _emailController,
                        labelText: "Email",
                        readOnly: true,
                        prefixIcon: Icon(
                          Icons.email_outlined,
                          color: AppColors.primaryGreen,
                        ),
                      ),
                      const SizedBox(height: 20),
                      CommonTextField(
                        controller: _roleController,
                        labelText: "Role",
                        readOnly: true,
                        prefixIcon: Icon(
                          Icons.admin_panel_settings_outlined,
                          color: AppColors.primaryGreen,
                        ),
                      ),
                      const SizedBox(height: 20),
                      CommonTextField(
                        controller: _statusController,
                        labelText: "Status",
                        readOnly: true,
                        prefixIcon: Icon(
                          Icons.check_circle_outline,
                          color: AppColors.primaryGreen,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          );
        },
      ),
    );
  }
}
