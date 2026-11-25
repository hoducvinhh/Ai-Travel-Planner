# Design System — AI Travel Planner Mobile

## 1. Visual Identity: Ocean Teal / Emerald Travel

Designed for high outdoor legibility, calm visual hierarchy, and zero decorative slop (`impeccable` + `universal-ui-design` craft rules adapted to Flutter).

### Color Tokens (`lib/config/colors.dart`)

| Token | Hex | Role |
| --- | --- | --- |
| `AppColors.primary` | `#0D9488` | Primary CTAs, active tabs, selected filters, hero accents |
| `AppColors.secondary` | `#14B8A6` | Secondary accents, map location pin, subtle suggestion banners |
| `AppColors.accent` | `#F59E0B` | Sand Gold — star ratings (`rating`), wishlist (`bookmarkGold`), highlights |
| `AppColors.likeRed` | `#FF6B6B` | Coral — strictly reserved for Like heart active state |
| `AppColors.notificationBadge` | `#FF6B6B` | Coral — strictly reserved for unread message/notification counts |
| `AppColors.background` | `#F8FAFC` | Screen scaffold canvas |
| `AppColors.surface` | `#FFFFFF` | Cards, sheets, app bars, inputs |
| `AppColors.textPrimary` | `#0F172A` | Primary headings & body text |
| `AppColors.textSecondary` | `#64748B` | Captions, metadata, placeholders |
| `AppColors.border` | `#E2E8F0` | Crisp 1px card & divider borders (elevation declared once) |

## 2. Typography, Spacing & Radius

- **Typography (`lib/config/text_styles.dart`)**: `displayLarge/Medium/Small`, `headlineLarge/Medium/Small`, `titleMedium`, `bodyLarge/Medium/Small`, `labelLarge/Medium/Small`.
- **Spacing (`lib/config/spacing.dart`)**: `xs (4)`, `sm (8)`, `md (16)`, `lg (24)`, `xl (32)`, `xxl (48)`.
- **Radius (`lib/config/radius.dart`)**: `sm (8dp)` badges/chips, `md (12dp)` buttons/inputs, `lg (16dp)` cards, `xl (20dp)` hero banners/modals, `full (999dp)` pills/avatars.
- **Iconography**: Strictly `lucide_icons_flutter` outline strokes; never emojis as UI icons.

## 3. Bundled Visual Assets (`assets/images/`)

- `assets/images/provinces/*.jpg`: Editorial Vietnam destination banners (`dalat`, `sapa`, `halong`, `hoian`, `ninhbinh`, `phuquoc`, `hanoi`, `danang`, `hue`, `nhatrang`), mapped dynamically via `provinceAssetPath()` in `lib/config/provinces.dart` for `HomeScreen` hero carousel, destination story strip, `TripCard` headers, and `PlaceCard` / `PlaceDetailScreen` offline/imageless fallbacks.
- `assets/images/illustrations/*.jpg`: Minimalist `#F8FAFC`-ground illustrations (`empty_trips`, `empty_places`, `empty_community`, `empty_messages`) rendered by `EmptyStateView`.

## 4. Motion Grammar (`lib/widgets/common/animations.dart` & `lib/config/routes.dart`)

- **Shared-element Hero**: `Hero(tag: 'place-hero-${place.id}')` morphs `PlaceCard` images into `PlaceDetailScreen`'s `SliverAppBar`.
- **Natural Deceleration**: `Cubic(0.16, 1.0, 0.3, 1.0)` over `180–280ms` (`EditorialArrival`, route transitions, onboarding progress, day selectors) without elastic bounce clichés.
- **Tactile Press Feedback**: `TactilePressScale` (`0.97` over `110ms`) on interactive cards and banners.
- **Skeleton Loading**: Slate neutral `ShimmerEffect` (`PlaceCardSkeleton`, `TripCardSkeleton`).
- **Reduce Motion Compliance**: All animations check `MediaQuery.disableAnimationsOf(context)` and degrade cleanly to static/instant states without hiding content or breaking state feedback.
