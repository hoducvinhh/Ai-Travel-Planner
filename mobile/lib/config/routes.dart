import 'package:go_router/go_router.dart';
import 'package:travel_planner/screens/home/home_screen.dart';
import 'package:travel_planner/screens/auth/login_screen.dart';
import 'package:travel_planner/screens/auth/register_screen.dart';
import 'package:travel_planner/screens/profile/profile_screen.dart';
import 'package:travel_planner/screens/trips/trips_list_screen.dart';

/// App routing configuration
final GoRouter router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
    GoRoute(
      path: '/trips',
      builder: (context, state) => const TripsListScreen(),
    ),
  ],
);
