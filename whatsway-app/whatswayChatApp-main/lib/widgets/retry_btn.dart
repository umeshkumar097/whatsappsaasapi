import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';
import 'package:waki/theme/app_colors.dart';

class RetryButton extends StatelessWidget {
  final VoidCallback onRetry;
  const RetryButton({super.key, required this.onRetry});
  @override
  Widget build(BuildContext context) {
    final borderRadius = BorderRadius.circular(30.w);
    return Material(
      color: Colors.transparent,
      borderRadius: borderRadius,
      child: InkWell(
        onTap: () {
          onRetry();
          HapticFeedback.lightImpact();
        },
        borderRadius: borderRadius,
        splashColor: Colors.white.withValues(alpha: 0.2),
        highlightColor: Colors.white.withValues(alpha: 0.4),
        child: Ink(
          padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.w),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.primaryGreen, AppColors.black],
            ),
            borderRadius: borderRadius,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.refresh, color: Colors.white, size: 17.sp),
              SizedBox(width: 4),
              Text(
                'Retry',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16.sp,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
