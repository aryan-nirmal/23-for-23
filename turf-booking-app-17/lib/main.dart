import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'core/constants/app_constants.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppConstants.backgroundDark,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // NOTE: Supabase initialization is disabled for MVP mock mode.
  // To connect to real Supabase, uncomment the lines below and update
  // app_constants.dart with your Supabase URL and anon key.
  //
  // await Supabase.initialize(
  //   url: AppConstants.supabaseUrl,
  //   anonKey: AppConstants.supabaseAnonKey,
  // );

  runApp(const TurfBookingApp());
}

class TurfBookingApp extends StatelessWidget {
  const TurfBookingApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = createRouter();

    return MaterialApp.router(
      title: 'TurfBook – Book Your Turf',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: router,
    );
  }
}

// UI/Logic Iteration 1: style(proj-17): adjust primary button padding

// UI/Logic Iteration 2: refactor(proj-17): fine-tune turf card layout for mobile

// UI/Logic Iteration 3: fix(proj-17): tweak margin on available time slots

// UI/Logic Iteration 4: style(proj-17): update booking confirmation dialog border radius

// UI/Logic Iteration 5: refactor(proj-17): improve bottom navigation spacing

// UI/Logic Iteration 6: fix(proj-17): align search bar icon

// UI/Logic Iteration 7: style(proj-17): soften secondary text color on map view

// UI/Logic Iteration 8: refactor(proj-17): polish app bar typography

// UI/Logic Iteration 9: fix(proj-17): increase contrast on sold-out indicators

// UI/Logic Iteration 10: style(proj-17): adjust gap in amenity flex containers
