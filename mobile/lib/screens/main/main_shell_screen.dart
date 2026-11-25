import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/providers/messages_provider.dart';

/// Main application shell with 5-tab Bottom Navigation Bar
class MainShellScreen extends ConsumerWidget {
  final StatefulNavigationShell navigationShell;

  const MainShellScreen({
    super.key,
    required this.navigationShell,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Keep Socket.IO messaging hub & unread count alive while inside main shell
    ref.watch(unreadMessagesCountProvider);

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(
            top: BorderSide(color: AppColors.border, width: 1),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: navigationShell.currentIndex,
          onTap: (index) {
            navigationShell.goBranch(
              index,
              initialLocation: index == navigationShell.currentIndex,
            );
          },
          backgroundColor: AppColors.surface,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.textSecondary,
          type: BottomNavigationBarType.fixed,
          elevation: 0,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.home, size: 22),
              label: 'Trang chủ',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.compass, size: 22),
              label: 'Khám phá',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.calendar, size: 22),
              label: 'Lịch trình',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.users, size: 22),
              label: 'Cộng đồng',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.user, size: 22),
              label: 'Hồ sơ',
            ),
          ],
        ),
      ),
    );
  }
}
