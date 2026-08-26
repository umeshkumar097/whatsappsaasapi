import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sizer/sizer.dart';
import 'package:waki/theme/app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: AppColors.white,
      scaffoldBackgroundColor: AppColors.white,
      textTheme: GoogleFonts.openSansTextTheme(ThemeData.light().textTheme)
          .copyWith(
            bodyMedium: GoogleFonts.openSans(
              color: AppColors.black,
              fontSize: 16.sp,
              fontWeight: FontWeight.w600,
            ),
            titleMedium: GoogleFonts.openSans(
              color: AppColors.black,
              fontSize: 17.sp,
              fontWeight: FontWeight.w700,
            ),
          ),
      iconTheme: IconThemeData(color: AppColors.black, size: 21.sp),
      appBarTheme: AppBarTheme(
        elevation: 0,
        titleTextStyle: GoogleFonts.openSans(
          fontSize: 17.sp,
          color: AppColors.black,
          fontWeight: FontWeight.w600,
        ),
        backgroundColor: AppColors.white,
        foregroundColor: AppColors.black,
        centerTitle: false,
        surfaceTintColor: AppColors.white,
        titleSpacing: 0,
        iconTheme: IconThemeData(color: AppColors.black, size: 19.sp),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: AppColors.black.withValues(alpha: 0.2),
          statusBarIconBrightness: Brightness.dark,
          statusBarBrightness: Brightness.light,
        ),
      ),
      colorScheme: ColorScheme.light(
        primary: AppColors.primaryGreen,
        secondary: AppColors.white,
        surface: AppColors.white,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.white,
        selectedItemColor: AppColors.primaryGreen,
        unselectedItemColor: AppColors.grey,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: AppColors.white,
      scaffoldBackgroundColor: AppColors.white,
      textTheme: GoogleFonts.latoTextTheme(ThemeData.dark().textTheme).copyWith(
        bodyMedium: GoogleFonts.openSans(
          color: Colors.white70,
          fontWeight: FontWeight.w500,
          fontSize: 16.sp,
        ),
        titleMedium: GoogleFonts.openSans(
          color: Colors.white70,
          fontSize: 17.sp,
          fontWeight: FontWeight.w700,
        ),
      ),
      iconTheme: IconThemeData(color: AppColors.white, size: 22.sp),
      appBarTheme: AppBarTheme(
        elevation: 0,
        titleSpacing: 0,
        backgroundColor: AppColors.primaryGreen,
        foregroundColor: AppColors.white,
        centerTitle: false,
        titleTextStyle: GoogleFonts.openSans(
          fontSize: 17.sp,
          fontWeight: FontWeight.w600,
        ),
        iconTheme: IconThemeData(color: AppColors.white, size: 22.sp),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Color(0xFF0C0B0B),
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
        ),
      ),
      colorScheme: ColorScheme.dark(
        primary: AppColors.primaryGreen,
        secondary: AppColors.white,
        surface: AppColors.white,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.white,
        selectedItemColor: AppColors.primaryGreen,
        unselectedItemColor: AppColors.grey,
      ),
    );
  }
}
