import 'package:flutter/material.dart';

/// App color palette - Ocean Teal & Emerald Travel theme
class AppColors {
  // Neutral base
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textTertiary = Color(0xFF94A3B8);
  static const Color border = Color(0xFFE2E8F0);

  // Brand colors (Ocean Teal / Emerald Travel)
  static const Color primary = Color(0xFF0D9488); // Ocean Teal - primary CTA & active states
  static const Color secondary = Color(0xFF14B8A6); // Lagoon Emerald - secondary & map accents
  static const Color accent = Color(0xFFF59E0B); // Sand Gold - ratings, bookmarks & highlights

  // Category colors (harmonized with Ocean Teal)
  static const Color categoryBeach = Color(0xFF0D9488); // Ocean Teal
  static const Color categoryMountain = Color(0xFF34D399); // Emerald Mint
  static const Color categoryCulture = Color(0xFFF59E0B); // Sand Gold
  static const Color categoryFood = Color(0xFFFB923C); // Warm Sunset Orange
  static const Color categoryNature = Color(0xFF10B981); // Forest Emerald
  static const Color categoryCity = Color(0xFF6366F1); // Indigo

  // Semantic colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF0EA5E9);

  // Interactive colors (Coral strictly reserved for Like & Notifications)
  static const Color likeRed = Color(0xFFFF6B6B); // Coral - heart / like action
  static const Color notificationBadge = Color(0xFFFF6B6B); // Coral - unread badges
  static const Color bookmarkGold = Color(0xFFF59E0B); // Sand Gold - saved/wishlist
  static const Color rating = Color(0xFFF59E0B); // Sand Gold - star ratings
}
