
import 'package:flutter/material.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/text_styles.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Travel Planner'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.travel_explore,
              size: 64,
              color: AppColors.primary,
            ),
            SizedBox(height: 16),
            Text(
              'Welcome to AI Travel Planner',
              style: AppTextStyles.displayMedium,
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 8),
            Text(
              'Setup in progress...',
              style: AppTextStyles.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}

// phải thiết kế lại giao diện của home screen làm cho nó đẹp hơn
// có thể xem thêm các app khác làm tham khảo
// - tạo 1 cái travel journal
// -




  

// import 'package:flutter/material.dart';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:lucide_icons_flutter/lucide_icons.dart';
// import 'package:travel_planner/config/colors.dart';
// import 'package:travel_planner/config/text_styles.dart';
// import 'package:travel_planner/config/spacing.dart';
// import 'package:travel_planner/config/radius.dart';
// import 'package:travel_planner/providers/auth_provider.dart';
// import 'package:travel_planner/providers/trips_provider.dart';
// import 'package:travel_planner/screens/trips/trips_list_screen.dart';
// import 'package:travel_planner/screens/profile/profile_screen.dart';

// /// Main screen with Bottom Navigation Bar
// class HomeScreen extends ConsumerStatefulWidget {
//   const HomeScreen({super.key});

//   @override
//   ConsumerState<HomeScreen> createState() => _HomeScreenState();
// }

// class _HomeScreenState extends ConsumerState<HomeScreen> {
//   int _currentIndex = 0;

//   @override
//   Widget build(BuildContext context) {
//     final List<Widget> pages = [
//       _buildHomeDashboard(context),
//       const TripsListScreen(),
//       const ProfileScreen(),
//     ];

//     return Scaffold(
//       body: IndexedStack(
//         index: _currentIndex,
//         children: pages,
//       ),
//       bottomNavigationBar: NavigationBar(
//         selectedIndex: _currentIndex,
//         onDestinationSelected: (index) {
//           setState(() {
//             _currentIndex = index;
//           });
//         },
//         backgroundColor: Colors.white,
//         indicatorColor: AppColors.primary.withValues(alpha: 0.15),
//         destinations: const [
//           NavigationDestination(
//             icon: Icon(LucideIcons.compass),
//             selectedIcon: Icon(LucideIcons.compass, color: AppColors.primary),
//             label: 'Khám phá',
//           ),
//           NavigationDestination(
//             icon: Icon(LucideIcons.plane),
//             selectedIcon: Icon(LucideIcons.plane, color: AppColors.primary),
//             label: 'Chuyến đi',
//           ),
//           NavigationDestination(
//             icon: Icon(LucideIcons.user),
//             selectedIcon: Icon(LucideIcons.user, color: AppColors.primary),
//             label: 'Tài khoản',
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildHomeDashboard(BuildContext context) {
//     final authState = ref.watch(authProvider);
//     final tripsAsync = ref.watch(tripsProvider);

//     final userName = authState.maybeWhen(
//       authenticated: (user) =>
//           user.name.isNotEmpty ? user.name : user.email.split('@').first,
//       orElse: () => 'bạn',
//     );

//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: AppBar(
//         backgroundColor: Colors.white,
//         elevation: 0,
//         title: Row(
//           children: [
//             Container(
//               padding: const EdgeInsets.all(AppSpacing.xs),
//               decoration: BoxDecoration(
//                 color: AppColors.primary.withValues(alpha: 0.1),
//                 borderRadius: BorderRadius.circular(AppRadius.sm),
//               ),
//               child: const Icon(
//                 LucideIcons.mapPin,
//                 color: AppColors.primary,
//                 size: 20,
//               ),
//             ),
//             const SizedBox(width: AppSpacing.sm),
//             const Text(
//               'AI Travel Planner',
//               style: AppTextStyles.headlineSmall,
//             ),
//           ],
//         ),
//         actions: [
//           IconButton(
//             icon: const Icon(LucideIcons.bell, size: 20),
//             onPressed: () {},
//             tooltip: 'Thông báo',
//           ),
//         ],
//       ),
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(AppSpacing.lg),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Welcome Header
//             Text(
//               'Xin chào, $userName! 👋',
//               style: AppTextStyles.headlineMedium.copyWith(
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//             const SizedBox(height: AppSpacing.xs),
//             Text(
//               'Hôm nay bạn muốn lên lịch trình đi đâu?',
//               style: AppTextStyles.bodyMedium.copyWith(
//                 color: AppColors.textSecondary,
//               ),
//             ),
//             const SizedBox(height: AppSpacing.lg),

//             // Hero AI Card
//             Container(
//               width: double.infinity,
//               padding: const EdgeInsets.all(AppSpacing.xl),
//               decoration: BoxDecoration(
//                 gradient: const LinearGradient(
//                   colors: [AppColors.primary, Color(0xFFFF8E8E)],
//                   begin: Alignment.topLeft,
//                   end: Alignment.bottomRight,
//                 ),
//                 borderRadius: BorderRadius.circular(AppRadius.xl),
//                 boxShadow: [
//                   BoxShadow(
//                     color: AppColors.primary.withValues(alpha: 0.3),
//                     blurRadius: 15,
//                     offset: const Offset(0, 8),
//                   ),
//                 ],
//               ),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Row(
//                     children: [
//                       Container(
//                         padding: const EdgeInsets.symmetric(
//                           horizontal: AppSpacing.sm,
//                           vertical: 4,
//                         ),
//                         decoration: BoxDecoration(
//                           color: Colors.white.withValues(alpha: 0.25),
//                           borderRadius: BorderRadius.circular(AppRadius.full),
//                         ),
//                         child: const Row(
//                           mainAxisSize: MainAxisSize.min,
//                           children: [
//                             Icon(LucideIcons.sparkles, size: 14, color: Colors.white),
//                             SizedBox(width: 4),
//                             Text(
//                               'AI TRỢ LÝ',
//                               style: TextStyle(
//                                 color: Colors.white,
//                                 fontSize: 11,
//                                 fontWeight: FontWeight.bold,
//                                 letterSpacing: 0.5,
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: AppSpacing.md),
//                   const Text(
//                     'Lên kế hoạch du lịch thông minh trong chớp mắt',
//                     style: TextStyle(
//                       color: Colors.white,
//                       fontSize: 18,
//                       fontWeight: FontWeight.bold,
//                       height: 1.3,
//                     ),
//                   ),
//                   const SizedBox(height: AppSpacing.sm),
//                   Text(
//                     'Tự động gợi ý điểm đến, lịch trình và ngân sách tối ưu theo sở thích của bạn.',
//                     style: TextStyle(
//                       color: Colors.white.withValues(alpha: 0.9),
//                       fontSize: 13,
//                     ),
//                   ),
//                   const SizedBox(height: AppSpacing.lg),
//                   ElevatedButton.icon(
//                     onPressed: () {
//                       setState(() {
//                         _currentIndex = 1; // Switch to Trips tab
//                       });
//                     },
//                     style: ElevatedButton.styleFrom(
//                       backgroundColor: Colors.white,
//                       foregroundColor: AppColors.primary,
//                       elevation: 0,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(AppRadius.lg),
//                       ),
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: AppSpacing.lg,
//                         vertical: AppSpacing.sm,
//                       ),
//                     ),
//                     icon: const Icon(LucideIcons.plane, size: 18),
//                     label: const Text(
//                       'Khám phá chuyến đi',
//                       style: TextStyle(fontWeight: FontWeight.bold),
//                     ),
//                   ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: AppSpacing.xl),

//             // Quick Actions Title
//             const Text(
//               'Tính năng nhanh',
//               style: AppTextStyles.headlineSmall,
//             ),
//             const SizedBox(height: AppSpacing.md),

//             // Action Grid
//             Row(
//               children: [
//                 Expanded(
//                   child: _buildActionCard(
//                     icon: LucideIcons.plane,
//                     title: 'Chuyến đi',
//                     subtitle: 'Quản lý lịch trình',
//                     color: AppColors.primary,
//                     onTap: () {
//                       setState(() {
//                         _currentIndex = 1;
//                       });
//                     },
//                   ),
//                 ),
//                 const SizedBox(width: AppSpacing.md),
//                 Expanded(
//                   child: _buildActionCard(
//                     icon: LucideIcons.user,
//                     title: 'Hồ sơ',
//                     subtitle: 'Cài đặt tài khoản',
//                     color: AppColors.secondary,
//                     onTap: () {
//                       setState(() {
//                         _currentIndex = 2;
//                       });
//                     },
//                   ),
//                 ),
//               ],
//             ),

//             const SizedBox(height: AppSpacing.xl),

//             // Recent Trips Header
//             Row(
//               mainAxisAlignment: MainAxisAlignment.spaceBetween,
//               children: [
//                 const Text(
//                   'Chuyến đi gần đây',
//                   style: AppTextStyles.headlineSmall,
//                 ),
//                 TextButton(
//                   onPressed: () {
//                     setState(() {
//                       _currentIndex = 1;
//                     });
//                   },
//                   child: const Text('Xem tất cả'),
//                 ),
//               ],
//             ),
//             const SizedBox(height: AppSpacing.sm),

//             // Trips Preview
//             tripsAsync.when(
//               loading: () => const Center(
//                 child: Padding(
//                   padding: EdgeInsets.all(AppSpacing.xl),
//                   child: CircularProgressIndicator(),
//                 ),
//               ),
//               error: (_, __) => Container(
//                 padding: const EdgeInsets.all(AppSpacing.lg),
//                 decoration: BoxDecoration(
//                   color: Colors.white,
//                   borderRadius: BorderRadius.circular(AppRadius.lg),
//                   border: Border.all(color: AppColors.border),
//                 ),
//                 child: Row(
//                   children: [
//                     const Icon(LucideIcons.info, color: AppColors.textSecondary),
//                     const SizedBox(width: AppSpacing.md),
//                     Expanded(
//                       child: Text(
//                         'Chưa có chuyến đi nào được tạo.',
//                         style: AppTextStyles.bodyMedium.copyWith(
//                           color: AppColors.textSecondary,
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//               data: (trips) {
//                 if (trips.isEmpty) {
//                   return Container(
//                     width: double.infinity,
//                     padding: const EdgeInsets.all(AppSpacing.xl),
//                     decoration: BoxDecoration(
//                       color: Colors.white,
//                       borderRadius: BorderRadius.circular(AppRadius.lg),
//                       border: Border.all(color: AppColors.border),
//                     ),
//                     child: Column(
//                       children: [
//                         Icon(
//                           LucideIcons.map,
//                           size: 40,
//                           color: AppColors.textTertiary,
//                         ),
//                         const SizedBox(height: AppSpacing.sm),
//                         const Text(
//                           'Bạn chưa có chuyến đi nào',
//                           style: AppTextStyles.bodyMedium,
//                         ),
//                         const SizedBox(height: AppSpacing.md),
//                         OutlinedButton.icon(
//                           onPressed: () {
//                             setState(() {
//                               _currentIndex = 1;
//                             });
//                           },
//                           icon: const Icon(LucideIcons.plus, size: 16),
//                           label: const Text('Tạo chuyến đi đầu tiên'),
//                         ),
//                       ],
//                     ),
//                   );
//                 }

//                 final trip = trips.first;
//                 return Container(
//                   width: double.infinity,
//                   padding: const EdgeInsets.all(AppSpacing.lg),
//                   decoration: BoxDecoration(
//                     color: Colors.white,
//                     borderRadius: BorderRadius.circular(AppRadius.lg),
//                     border: Border.all(color: AppColors.border),
//                   ),
//                   child: Row(
//                     children: [
//                       Container(
//                         padding: const EdgeInsets.all(AppSpacing.md),
//                         decoration: BoxDecoration(
//                           color: AppColors.primary.withValues(alpha: 0.1),
//                           shape: BoxShape.circle,
//                         ),
//                         child: const Icon(
//                           LucideIcons.mapPin,
//                           color: AppColors.primary,
//                         ),
//                       ),
//                       const SizedBox(width: AppSpacing.md),
//                       Expanded(
//                         child: Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               trip.destination,
//                               style: AppTextStyles.labelLarge.copyWith(
//                                 fontWeight: FontWeight.bold,
//                               ),
//                             ),
//                             const SizedBox(height: 2),
//                             Text(
//                               '${trip.startDate} - ${trip.endDate}',
//                               style: AppTextStyles.bodySmall.copyWith(
//                                 color: AppColors.textSecondary,
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                       IconButton(
//                         icon: const Icon(LucideIcons.chevronRight),
//                         onPressed: () {
//                           setState(() {
//                             _currentIndex = 1;
//                           });
//                         },
//                       ),
//                     ],
//                   ),
//                 );
//               },
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildActionCard({
//     required IconData icon,
//     required String title,
//     required String subtitle,
//     required Color color,
//     required VoidCallback onTap,
//   }) {
//     return Material(
//       color: Colors.white,
//       borderRadius: BorderRadius.circular(AppRadius.lg),
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(AppRadius.lg),
//         child: Container(
//           padding: const EdgeInsets.all(AppSpacing.lg),
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(AppRadius.lg),
//             border: Border.all(color: AppColors.border),
//           ),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               Container(
//                 padding: const EdgeInsets.all(AppSpacing.sm),
//                 decoration: BoxDecoration(
//                   color: color.withValues(alpha: 0.1),
//                   borderRadius: BorderRadius.circular(AppRadius.md),
//                 ),
//                 child: Icon(icon, color: color, size: 24),
//               ),
//               const SizedBox(height: AppSpacing.md),
//               Text(
//                 title,
//                 style: AppTextStyles.labelLarge.copyWith(
//                   fontWeight: FontWeight.bold,
//                 ),
//               ),
//               const SizedBox(height: 2),
//               Text(
//                 subtitle,
//                 style: AppTextStyles.bodySmall.copyWith(
//                   color: AppColors.textSecondary,
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
