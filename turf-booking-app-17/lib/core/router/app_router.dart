import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/home/presentation/screens/main_shell.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/venues/presentation/screens/venue_detail_screen.dart';
import '../../features/venues/presentation/screens/venue_list_screen.dart';
import '../../features/booking/presentation/screens/booking_screen.dart';
import '../../features/booking/presentation/screens/booking_confirmation_screen.dart';
import '../../features/booking/presentation/screens/my_bookings_screen.dart';
import '../../features/owner/presentation/screens/owner_dashboard_screen.dart';
import '../../features/owner/presentation/screens/owner_venue_screen.dart';
import '../../features/owner/presentation/screens/slot_manager_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';

GoRouter createRouter() {
  return GoRouter(
    initialLocation: '/splash',
    debugLogDiagnostics: false,
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/venues',
            builder: (context, state) => const VenueListScreen(),
          ),
          GoRoute(
            path: '/bookings',
            builder: (context, state) => const MyBookingsScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/venue/:id',
        builder: (context, state) {
          final venueId = state.pathParameters['id']!;
          return VenueDetailScreen(venueId: venueId);
        },
      ),
      GoRoute(
        path: '/booking/:slotId',
        builder: (context, state) {
          final slotId = state.pathParameters['slotId']!;
          final extra = state.extra as Map<String, dynamic>?;
          return BookingScreen(slotId: slotId, extra: extra);
        },
      ),
      GoRoute(
        path: '/booking-confirmation/:bookingId',
        builder: (context, state) {
          final bookingId = state.pathParameters['bookingId']!;
          return BookingConfirmationScreen(bookingId: bookingId);
        },
      ),
      GoRoute(
        path: '/owner/dashboard',
        builder: (context, state) => const OwnerDashboardScreen(),
      ),
      GoRoute(
        path: '/owner/venue/:id',
        builder: (context, state) {
          final venueId = state.pathParameters['id']!;
          return OwnerVenueScreen(venueId: venueId);
        },
      ),
      GoRoute(
        path: '/owner/slots/:venueId',
        builder: (context, state) {
          final venueId = state.pathParameters['venueId']!;
          return SlotManagerScreen(venueId: venueId);
        },
      ),
    ],
  );
}
