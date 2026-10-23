import 'package:go_router/go_router.dart';
import 'package:travel_planner/screens/home/home_screen.dart';
import 'package:travel_planner/screens/auth/login_screen.dart';
import 'package:travel_planner/screens/auth/register_screen.dart';
import 'package:travel_planner/screens/profile/profile_screen.dart';
import 'package:travel_planner/screens/trips/trips_list_screen.dart';
import 'package:travel_planner/screens/trips/trip_detail_screen.dart';
import 'package:travel_planner/screens/trips/create_trip_screen.dart';
import 'package:travel_planner/screens/places/places_screen.dart';
import 'package:travel_planner/screens/places/place_detail_screen.dart';
import 'package:travel_planner/screens/chat/chat_screen.dart';

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
    GoRoute(
      path: '/trips/create',
      builder: (context, state) => const CreateTripScreen(),
    ),
    GoRoute(
      path: '/trips/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return TripDetailScreen(tripId: id);
      },
    ),
    GoRoute(
      path: '/places',
      builder: (context, state) => const PlacesScreen(),
    ),
    GoRoute(
      path: '/places/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return PlaceDetailScreen(placeId: id);
      },
    ),
    GoRoute(
      path: '/chat',
      builder: (context, state) => const ChatScreen(),
    ),
  ],
);
