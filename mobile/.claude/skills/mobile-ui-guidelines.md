---
skill: mobile-ui-guidelines
description: UI/UX design guidelines for mobile app - colors, icons, components, avoiding AI slop
triggerWords: [UI, design, component, button, card, icon, color, style, theme]
---

# Mobile UI/UX Design Guidelines

**READ THIS BEFORE implementing any UI component in the mobile app.**

## Core Principles

1. **Dễ nhìn, dễ dùng** - Clean, minimalist với visual hierarchy rõ ràng
2. **Thân thiện với người dùng** - Intuitive navigation, familiar patterns
3. **Icons trắng đen only** - NO colored icons, consistent stroke width
4. **Màu sắc phù hợp đề tài du lịch** - Warm, inviting, vacation vibes
5. **Rounded corners** - Tất cả components bo góc tròn (8-16dp)
6. **Tránh AI slop** - Purposeful design, không generic/over-designed

## Color System

```dart
// ============ USE THESE EXACT VALUES ============
class AppColors {
  // Neutral base
  static const Color background = Color(0xFFFAFAFA);      // Main background
  static const Color surface = Color(0xFFFFFFFF);         // Cards, modals
  static const Color textPrimary = Color(0xFF1A1A1A);     // Headings, body
  static const Color textSecondary = Color(0xFF6B7280);   // Descriptions
  static const Color textTertiary = Color(0xFF9CA3AF);    // Placeholders
  static const Color border = Color(0xFFE5E7EB);          // Borders
  
  // Brand colors (travel theme)
  static const Color primary = Color(0xFFFF6B6B);         // Coral - vacation vibes
  static const Color secondary = Color(0xFF4ECDC4);       // Turquoise - beach/ocean
  static const Color accent = Color(0xFFFFA500);          // Golden - sunset/premium
  
  // Category colors
  static const Color categoryBeach = Color(0xFF4ECDC4);   // Turquoise
  static const Color categoryMountain = Color(0xFF95E1D3); // Mint
  static const Color categoryCulture = Color(0xFFFFAA85); // Peach
  static const Color categoryFood = Color(0xFFFFA500);    // Orange
  static const Color categoryNature = Color(0xFF7DCE82);  // Green
  static const Color categoryCity = Color(0xFF9C88FF);    // Purple
  
  // Semantic
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFFBBF24);
  static const Color error = Color(0xFFEF4444);
}
```

**Color Usage Rules:**
```
✅ DO:
- Background: #FAFAFA (light gray)
- Cards/surfaces: #FFFFFF (white)
- Text: #1A1A1A on light (high contrast)
- Primary actions: Coral buttons with white text/icons
- Icons: Black/gray on light, white on colored backgrounds
- Active states: Coral for selected items

❌ DON'T:
- Use >2-3 colors in same screen
- Colored icons on light backgrounds (black/white/gray only)
- Low contrast text (must be WCAG AA: 4.5:1 ratio)
- Colored backgrounds for entire screen
```

## Icon System

**Package:** `lucide_icons_flutter: ^1.1.0`

**Icon Rules:**
```dart
// ✅ CORRECT - Black/white/gray only
Icon(LucideIcons.mapPin, color: AppColors.textPrimary, size: 24)     // Black on light
Icon(LucideIcons.heart, color: Colors.white, size: 20)               // White on button
Icon(LucideIcons.home, color: isActive ? AppColors.primary : AppColors.textSecondary)  // Gray→Coral on select

// ❌ WRONG - NO colored icons
Icon(LucideIcons.mapPin, color: Colors.blue)  // NO
Icon(LucideIcons.star, color: Colors.yellow)  // NO - use white icon, colored background instead
```

**Icon Sizes:**
- 16dp: Very small (inline with text)
- 20dp: Small (input prefix, compact buttons)
- 24dp: Default (most icons)
- 28dp: Medium (emphasis)
- 32dp: Large (category icons, empty states)

## Border Radius (Rounded Corners)

```dart
class AppRadius {
  static const double sm = 8.0;    // Badges, chips
  static const double md = 12.0;   // Buttons, inputs
  static const double lg = 16.0;   // Cards
  static const double xl = 20.0;   // Modals
  static const double full = 999.0; // Avatar, icon buttons
}
```

**ALL components MUST have rounded corners. No sharp corners (borderRadius: 0).**

## Component Templates

### Button

```dart
// ✅ PRIMARY BUTTON - Solid coral
ElevatedButton(
  style: ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    foregroundColor: Colors.white,
    elevation: 0,  // Flat design
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),  // 12dp
    ),
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
  ),
  child: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(LucideIcons.plus, size: 20, color: Colors.white),
      SizedBox(width: 8),
      Text('Tạo chuyến đi'),
    ],
  ),
  onPressed: () {},
)

// ✅ SECONDARY BUTTON - Outline
OutlinedButton(
  style: OutlinedButton.styleFrom(
    foregroundColor: AppColors.primary,
    side: BorderSide(color: AppColors.primary, width: 1.5),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
    ),
  ),
  child: Text('Xem thêm'),
  onPressed: () {},
)

// ❌ WRONG - No rounded corners, wrong colors
ElevatedButton(
  style: ElevatedButton.styleFrom(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(0)),  // NO sharp corners
    backgroundColor: Colors.blue,  // NO - use AppColors.primary
  ),
)
```

### Card

```dart
// ✅ CORRECT CARD
Container(
  decoration: BoxDecoration(
    color: AppColors.surface,
    borderRadius: BorderRadius.circular(AppRadius.lg),  // 16dp
    border: Border.all(color: AppColors.border, width: 1),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.04),  // Very subtle shadow
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Title', style: AppTextStyles.headlineMedium),
        SizedBox(height: 8),
        Text('Content', style: AppTextStyles.bodyMedium),
      ],
    ),
  ),
)

// ❌ WRONG - Over-designed
Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(...),  // NO gradient backgrounds everywhere
    borderRadius: BorderRadius.circular(32),  // NO - too rounded (24dp+ is excessive)
    boxShadow: [
      BoxShadow(blurRadius: 20, spreadRadius: 5),  // NO - shadow too heavy
    ],
  ),
)
```

### Input Field

```dart
// ✅ CORRECT INPUT
TextField(
  decoration: InputDecoration(
    labelText: 'Điểm đến',
    hintText: 'Ví dụ: Đà Nẵng',
    prefixIcon: Icon(LucideIcons.mapPin, size: 20, color: AppColors.textSecondary),
    filled: true,
    fillColor: AppColors.surface,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: BorderSide(color: AppColors.border),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.md),
      borderSide: BorderSide(color: AppColors.primary, width: 2),
    ),
  ),
)

// ❌ WRONG
TextField(
  decoration: InputDecoration(
    prefixIcon: Icon(Icons.map, color: Colors.blue),  // NO - wrong icon package & colored
    border: OutlineInputBorder(borderRadius: BorderRadius.zero),  // NO - no sharp corners
  ),
)
```

## Anti-Patterns (Avoiding "AI Slop")

### ❌ DON'T DO THESE:

```dart
// 1. NO glass morphism
Container(
  decoration: BoxDecoration(
    color: Colors.white.withOpacity(0.2),
    backdropFilter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),  // NO
  ),
)

// 2. NO gradient overload
Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(colors: [coral, turquoise, golden]),  // NO - gradient on everything
  ),
)

// 3. NO giant emojis as UI elements
Text('🎉', style: TextStyle(fontSize: 64))  // NO

// 4. NO generic empty states
Column(
  children: [
    Text('Nothing here yet! 🎉'),  // NO - too generic
    Text('Start exploring'),
  ],
)

// 5. NO over-animation
AnimatedOpacity(duration: Duration(seconds: 1), child: EveryWidget())  // NO
Hero(tag: 'random', child: NormalElement())  // NO - hero everywhere is distracting

// 6. NO colored icons on light backgrounds
Icon(LucideIcons.star, color: Colors.yellow)  // NO
Icon(LucideIcons.heart, color: Colors.red)    // NO
```

### ✅ DO THESE INSTEAD:

```dart
// 1. Flat design with subtle shadows
Container(
  decoration: BoxDecoration(
    color: AppColors.surface,
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.04),
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  ),
)

// 2. Solid colors, purposeful accents
Container(
  decoration: BoxDecoration(
    color: AppColors.surface,  // White background
    border: Border.all(color: AppColors.border),
  ),
  child: Row(
    children: [
      Container(
        padding: EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.categoryBeach,  // Colored background for icon
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(LucideIcons.waves, color: Colors.white, size: 20),  // White icon
      ),
    ],
  ),
)

// 3. Simple icons, not emojis
Icon(LucideIcons.mapPin, size: 48, color: AppColors.textTertiary)

// 4. Travel-specific empty states
Column(
  children: [
    Icon(LucideIcons.mapPin, size: 48, color: AppColors.textTertiary),
    SizedBox(height: 16),
    Text('Chưa có chuyến đi nào', style: AppTextStyles.headlineMedium),
    Text('Bắt đầu lên kế hoạch cho chuyến du lịch đầu tiên'),
    SizedBox(height: 24),
    ElevatedButton.icon(
      icon: Icon(LucideIcons.plus, size: 20),
      label: Text('Tạo chuyến đi mới'),
      onPressed: () {},
    ),
  ],
)

// 5. Subtle animations (150-250ms), purposeful only
AnimatedScale(
  scale: isLiked ? 1.2 : 1.0,
  duration: Duration(milliseconds: 150),
  child: Icon(LucideIcons.heart),
)

// 6. Black/gray icons, colored only on interaction
Icon(
  isLiked ? LucideIcons.heart : LucideIcons.heartOff,
  color: isLiked ? AppColors.primary : AppColors.textSecondary,
)
```

## Loading States

```dart
// ✅ SIMPLE - Unobtrusive
CircularProgressIndicator(
  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
  strokeWidth: 2,
)

// ✅ PULL-TO-REFRESH
RefreshIndicator(
  color: AppColors.primary,
  onRefresh: () async {},
  child: ListView(...),
)

// ❌ WRONG - Over-complicated
Shimmer.fromColors(
  baseColor: Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: ComplexShimmerEverywhere(),  // NO - shimmer overload
)
```

## Typography

```dart
class AppTextStyles {
  // Display (headings)
  static const TextStyle displayLarge = TextStyle(
    fontSize: 32, fontWeight: FontWeight.w700, color: AppColors.textPrimary,
  );
  static const TextStyle displayMedium = TextStyle(
    fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.textPrimary,
  );
  
  // Body
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.textPrimary,
  );
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary,
  );
  
  // Labels
  static const TextStyle labelLarge = TextStyle(
    fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary,
  );
}
```

## Bottom Navigation

```dart
// ✅ CORRECT
BottomNavigationBar(
  backgroundColor: AppColors.surface,
  selectedItemColor: AppColors.primary,        // Coral when active
  unselectedItemColor: AppColors.textSecondary, // Gray when inactive
  type: BottomNavigationBarType.fixed,
  elevation: 0,
  items: [
    BottomNavigationBarItem(
      icon: Icon(LucideIcons.home, size: 24),
      label: 'Trang chủ',
    ),
    // ... more items
  ],
)

// ❌ WRONG
BottomNavigationBar(
  selectedItemColor: Colors.blue,  // NO - use AppColors.primary
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),  // NO - use LucideIcons
    ),
  ],
)
```

## Quick Checklist

Before committing any UI code, verify:

- [ ] Icons are black/white/gray (no colored icons on light backgrounds)
- [ ] All components have rounded corners (8-16dp, not 0 or 24dp+)
- [ ] Using AppColors constants (not hardcoded hex colors)
- [ ] Using LucideIcons (not Material Icons or custom colored icons)
- [ ] Text has proper contrast (WCAG AA: 4.5:1 minimum)
- [ ] No glass morphism, gradient overload, or over-animation
- [ ] Animations are subtle (150-250ms) and purposeful
- [ ] Empty states are travel-specific with suggestions
- [ ] Loading states are simple (CircularProgressIndicator)
- [ ] Touch targets are 48x48dp minimum

## When in Doubt

**Ask yourself:**
1. Does this look like generic AI-generated UI? → Simplify
2. Is this color/animation necessary? → Remove if no purpose
3. Would a user understand this without explanation? → If no, redesign
4. Does this match travel app vibes (warm, inviting)? → If no, adjust colors

**Golden rule:** Purpose over decoration. Every visual element must have a reason.
