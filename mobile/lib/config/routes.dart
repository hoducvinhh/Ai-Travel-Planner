import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/screens/auth/login_screen.dart';
import 'package:travel_planner/screens/auth/register_screen.dart';
import 'package:travel_planner/screens/chat/chat_screen.dart';
import 'package:travel_planner/screens/community/community_screen.dart';
import 'package:travel_planner/screens/community/create_post_screen.dart';
import 'package:travel_planner/screens/home/home_screen.dart';
import 'package:travel_planner/screens/main/main_shell_screen.dart';
import 'package:travel_planner/screens/messages/conversations_screen.dart';
import 'package:travel_planner/screens/messages/direct_chat_screen.dart';
import 'package:travel_planner/screens/onboarding/onboarding_screen.dart';
import 'package:travel_planner/screens/places/place_detail_screen.dart';
import 'package:travel_planner/screens/places/places_screen.dart';
import 'package:travel_planner/screens/profile/profile_screen.dart';
import 'package:travel_planner/screens/search/search_screen.dart';
import 'package:travel_planner/screens/trips/create_trip_screen.dart';
import 'package:travel_planner/screens/trips/trip_detail_screen.dart';
import 'package:travel_planner/screens/trips/trips_list_screen.dart';

class _RouterRefreshNotifier extends ChangeNotifier {
  _RouterRefreshNotifier(Ref ref) {
    ref.listen<AuthState>(authProvider, (_, __) => notifyListeners());
  }
}

CustomTransitionPage<void> _buildEditorialTransitionPage({
  required BuildContext context,
  required GoRouterState state,
  required Widget child,
}) {
  final disableMotion = MediaQuery.disableAnimationsOf(context);
  return CustomTransitionPage<void>(
    key: state.pageKey,
    child: child,
    transitionDuration:
        disableMotion ? Duration.zero : const Duration(milliseconds: 240),
    reverseTransitionDuration:
        disableMotion ? Duration.zero : const Duration(milliseconds: 180),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      if (disableMotion) return child;
      const curve = Cubic(0.16, 1.0, 0.3, 1.0);
      final curved = CurvedAnimation(parent: animation, curve: curve);
      return FadeTransition(
        opacity: curved,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0.0, 0.04),
            end: Offset.zero,
          ).animate(curved),
          child: child,
        ),
      );
    },
  );
}

/// App routing provider with StatefulShellRoute (5 bottom tabs) and Auth/Onboarding guards
final routerProvider = Provider<GoRouter>((ref) {
  final refreshNotifier = _RouterRefreshNotifier(ref);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: refreshNotifier,
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final location = state.matchedLocation;

      final isAuthRoute = location == '/login' || location == '/register';
      final isPublicRoute = isAuthRoute || location == '/chat';

      return authState.when(
        initial: () => null,
        loading: () => null,
        error: (_) => isPublicRoute ? null : '/login',
        unauthenticated: () => isPublicRoute ? null : '/login',
        authenticated: (user) {
          if (user.needsOnboarding && location != '/onboarding') {
            return '/onboarding';
          }
          if (!user.needsOnboarding && location == '/onboarding') {
            return '/';
          }
          if (isAuthRoute) {
            return user.needsOnboarding ? '/onboarding' : '/';
          }
          return null;
        },
      );
    },
    routes: [
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainShellScreen(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/',
                builder: (_, __) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/places',
                builder: (_, __) => const PlacesScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/trips',
                builder: (_, __) => const TripsListScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/community',
                builder: (_, __) => const CommunityScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (_, __) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: '/login',
        builder: (_, __) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (_, __) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        pageBuilder: (context, state) => _buildEditorialTransitionPage(
          context: context,
          state: state,
          child: const OnboardingScreen(),
        ),
      ),
      GoRoute(
        path: '/trips/create',
        pageBuilder: (context, state) => _buildEditorialTransitionPage(
          context: context,
          state: state,
          child: const CreateTripScreen(),
        ),
      ),
      GoRoute(
        path: '/trips/:id',
        builder: (_, state) =>
            TripDetailScreen(tripId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/places/:id',
        builder: (_, state) =>
            PlaceDetailScreen(placeId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/community/create',
        pageBuilder: (context, state) => _buildEditorialTransitionPage(
          context: context,
          state: state,
          child: const CreatePostScreen(),
        ),
      ),
      GoRoute(
        path: '/chat',
        pageBuilder: (context, state) => _buildEditorialTransitionPage(
          context: context,
          state: state,
          child: const ChatScreen(),
        ),
      ),
      GoRoute(
        path: '/messages',
        builder: (_, __) => const ConversationsScreen(),
      ),
      GoRoute(
        path: '/messages/:id',
        builder: (_, state) => DirectChatScreen(
          conversationId: state.pathParameters['id']!,
          seedMessage: state.uri.queryParameters['seed'],
        ),
      ),
      GoRoute(
        path: '/search',
        builder: (_, __) => const SearchScreen(),
      ),
    ],
  );
});
