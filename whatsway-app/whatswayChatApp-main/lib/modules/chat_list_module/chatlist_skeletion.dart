import 'package:flutter/material.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:waki/theme/app_colors.dart';

Widget skeletionLoader() {
  return Skeletonizer(
    enabled: true,
    child: ListView.separated(
      itemCount: 10,
      separatorBuilder: (context, index) =>
          const Divider(color: AppColors.dividerColor),
      itemBuilder: (context, index) {
        return ListTile(
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 4,
          ),
          leading: CircleAvatar(
            radius: 24,
            backgroundColor: const Color(0xFFEEF2F6),
            child: Icon(Icons.person, color: Colors.grey.shade400, size: 26),
          ),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Unknown User Name',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0A192F),
                ),
              ),
              Text(
                '10:00 AM',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
            ],
          ),
          subtitle: const Padding(
            padding: EdgeInsets.only(top: 4),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'This is a dummy message for skeleton loader.',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 14, color: Color(0xFF64748B)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    ),
  );
}
