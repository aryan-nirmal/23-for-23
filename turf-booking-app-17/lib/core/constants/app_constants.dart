import 'package:flutter/material.dart';

class AppConstants {
  AppConstants._();

  // Supabase (Free Tier)
  static const String supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

  // Razorpay Test Keys (MVP - Mock)
  static const String razorpayTestKey = 'rzp_test_YOUR_RAZORPAY_KEY';
  static const String razorpayCurrency = 'INR';
  static const String razorpayCompanyName = 'TurfBook';
  static const String razorpayDescription = 'Turf Slot Booking';

  // App Colors - Turf Theme
  static const Color primaryGreen = Color(0xFF00E676);      // Vibrant lime green
  static const Color primaryGreenDark = Color(0xFF00C853);  // Darker green
  static const Color accentGreen = Color(0xFF69F0AE);       // Soft mint accent
  static const Color backgroundDark = Color(0xFF0A0E14);    // Very dark navy
  static const Color surfaceDark = Color(0xFF111827);       // Card surface
  static const Color surfaceCard = Color(0xFF1A2332);       // Elevated card
  static const Color borderColor = Color(0xFF1E293B);       // Subtle border
  static const Color textPrimary = Color(0xFFF1F5F9);       // Near white
  static const Color textSecondary = Color(0xFF94A3B8);     // Muted gray
  static const Color textMuted = Color(0xFF475569);         // Very muted
  static const Color errorRed = Color(0xFFFF5252);          // Error
  static const Color warningAmber = Color(0xFFFFD740);      // Warning
  static const Color successGreen = Color(0xFF00E676);      // Success

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00E676), Color(0xFF00C853)],
  );

  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF0A0E14), Color(0xFF0A1628)],
  );

  static const LinearGradient turfGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF003D1A), Color(0xFF00521F), Color(0xFF006826)],
  );

  // Spacing
  static const double spacingXS = 4.0;
  static const double spacingSM = 8.0;
  static const double spacingMD = 16.0;
  static const double spacingLG = 24.0;
  static const double spacingXL = 32.0;
  static const double spacingXXL = 48.0;

  // Border Radius
  static const double radiusSM = 8.0;
  static const double radiusMD = 12.0;
  static const double radiusLG = 16.0;
  static const double radiusXL = 24.0;
  static const double radiusXXL = 32.0;
  static const double radiusCircle = 999.0;

  // Elevation / Shadows
  static List<BoxShadow> cardShadow = [
    BoxShadow(
      color: Colors.black.withOpacity(0.4),
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> glowShadow = [
    BoxShadow(
      color: primaryGreen.withOpacity(0.3),
      blurRadius: 20,
      offset: const Offset(0, 4),
    ),
  ];

  // Sports
  static const List<String> sportTypes = [
    'Football',
    'Cricket',
    'Basketball',
    'Badminton',
    'Tennis',
    'Box Cricket',
  ];

  static const Map<String, String> sportIcons = {
    'Football': '⚽',
    'Cricket': '🏏',
    'Basketball': '🏀',
    'Badminton': '🏸',
    'Tennis': '🎾',
    'Box Cricket': '🏏',
  };

  // Cities
  static const List<String> cities = [
    'Pune',
    'Mumbai',
    'Nashik',
    'Nagpur',
    'Aurangabad',
  ];

  // Booking Status
  static const String bookingStatusPending = 'pending';
  static const String bookingStatusConfirmed = 'confirmed';
  static const String bookingStatusCancelled = 'cancelled';
  static const String bookingStatusCompleted = 'completed';

  // Slot Status
  static const String slotStatusAvailable = 'available';
  static const String slotStatusBooked = 'booked';
  static const String slotStatusLocked = 'locked';
  static const String slotStatusBlocked = 'blocked';
}
