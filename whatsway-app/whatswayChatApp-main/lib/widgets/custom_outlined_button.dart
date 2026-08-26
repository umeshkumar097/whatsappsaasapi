import 'package:flutter/material.dart';
import 'package:waki/theme/app_colors.dart';

enum CustomButtonVariant { primary, danger, success, neutral }

class CustomOutlinedButton extends StatelessWidget {
  const CustomOutlinedButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.isEnabled = true,
    this.variant = CustomButtonVariant.primary,
    this.prefixIcon,
    this.fullWidth = false,
    this.borderRadius,
    this.borderWidth = 1,
    this.loadingText,
    this.textStyle,
    this.padding,
    this.height,
    this.fontSize,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isEnabled;
  final CustomButtonVariant variant;
  final Widget? prefixIcon;
  final bool fullWidth;
  final double? borderRadius;
  final double borderWidth;
  final String? loadingText;
  final TextStyle? textStyle;
  final EdgeInsetsGeometry? padding;
  final double? height;
  final double? fontSize;

  Color get _variantColor {
    switch (variant) {
      case CustomButtonVariant.primary:
        return AppColors.primaryGreen;
      case CustomButtonVariant.danger:
        return const Color(0xFFD32F2F);
      case CustomButtonVariant.success:
        return const Color(0xFF388E3C);
      case CustomButtonVariant.neutral:
        return const Color(0xFF888780);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool active = isEnabled && !isLoading;
    final color = _variantColor;
    final double resolvedFontSize = fontSize ?? 14;

    return Opacity(
      opacity: isEnabled ? 1.0 : 0.45,
      child: SizedBox(
        height: height ?? 40,
        width: fullWidth ? double.infinity : null,
        child: OutlinedButton(
          onPressed: active ? onPressed : null,
          style: OutlinedButton.styleFrom(
            foregroundColor: color,
            side: BorderSide(color: color, width: borderWidth),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius ?? 8),
            ),
            padding:
                padding ??
                const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
            backgroundColor: Colors.transparent,
            splashFactory: InkRipple.splashFactory,
          ),
          child: isLoading
              ? _buildLoader(color, resolvedFontSize)
              : _buildContent(color, resolvedFontSize),
        ),
      ),
    );
  }

  Widget _buildLoader(Color color, double fs) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(
          width: fs + 2,
          height: fs + 2,
          child: CircularProgressIndicator(strokeWidth: 2, color: color),
        ),
        if (loadingText != null) ...[
          const SizedBox(width: 8),
          Text(
            loadingText!,
            style: (textStyle ?? TextStyle(fontSize: fs)).copyWith(
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildContent(Color color, double fs) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (prefixIcon != null) ...[prefixIcon!, const SizedBox(width: 6)],
        Text(
          label,
          style: (textStyle ?? TextStyle(fontSize: fs)).copyWith(
            color: color,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
