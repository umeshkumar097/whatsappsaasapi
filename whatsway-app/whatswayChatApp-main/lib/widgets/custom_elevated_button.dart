import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';
import 'package:waki/theme/app_colors.dart';
import 'package:waki/utiles/app_utils.dart';

class CustomElevatedButton extends StatelessWidget {
  final String? text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final String loadingText;
  final Color? foregroundColor;
  final Color? backgroundColor;
  final EdgeInsetsGeometry? padding;
  final BorderRadius? borderRadius;
  final double? width;
  final double? height;

  const CustomElevatedButton({
    super.key,
    this.text,
    this.onPressed,
    this.isLoading = false,
    this.loadingText = 'Please wait...',
    this.foregroundColor = Colors.white,
    this.backgroundColor,
    this.padding,
    this.borderRadius,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLoading ? null : onPressed,
      child: Container(
        width: width,
        height: height ?? 45,
        alignment: Alignment.center,
        padding: padding ?? EdgeInsets.symmetric(horizontal: 4.w),
        decoration: BoxDecoration(
          color: isLoading ? AppColors.grey : null,
          borderRadius: borderRadius ?? BorderRadius.circular(8),
          gradient: isLoading
              ? null
              : LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    backgroundColor ?? AppColors.buttonColor,
                    AppColors.black,
                  ],
                ),
        ),
        child: isLoading
            ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    height: 5.w,
                    width: 5.w,
                    child: AppUtils.widgetLoader(strokeWidth: 2),
                  ),
                  SizedBox(width: 8),
                  Text(
                    loadingText,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      fontSize: 15.sp,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                ],
              )
            : Text(
                text ?? 'Proceed',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontSize: 15.sp,
                  fontWeight: FontWeight.bold,
                  color: foregroundColor,
                ),
              ),
      ),
    );
  }
}
