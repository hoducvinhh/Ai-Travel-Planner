---
name: universal-ui-design
description: >-
  Universal UI Design System guidelines for building clean, modern, minimalist,
  and premium interfaces. Use this skill whenever designing, building, styling,
  or refactoring UI components, pages, web applications, dashboards, or websites
  following the neutral warm off-white, dark charcoal, subtle lime accent, and
  monochrome line icon system.
---

# Universal UI Design System Skill

This skill enforces a **clean, modern, minimalist, premium interface style** with a strong emphasis on usability, visual hierarchy, whitespace, consistency, readability, and intentional design.

It applies universally across any type of web application (SaaS, dashboards, CRM, ecommerce, booking, social, AI tools, etc.).

---

## 1. Core Visual Principles

- **Aesthetic**: Modern, sophisticated, calm, minimal, premium, spacious, functional, polished.
- **Hierarchy of Importance**: Usability → Hierarchy → Readability → Consistency → Whitespace → Aesthetics.
- **Simplicity First**: When choosing between a visually complex decorative solution and a simple usable one, always choose the simpler usable solution.
- **Strictly Avoid "AI Slop"**:
  - NO purple/blue AI gradients or glow effects.
  - NO excessive glassmorphism or blur blobs.
  - NO 3D icons, colorful icon sets, or emojis used as UI icons.
  - NO excessive nested cards or arbitrary decorative badges.
  - Interface must feel intentionally designed by a human product designer.

---

## 2. Color System & Design Tokens

### Primary Palette
| Role | HEX / Value | Tailwind Utility | Notes |
| :--- | :--- | :--- | :--- |
| **Main Background** | `#F9F9F8` or `#FAFAFA` | `bg-[#F9F9F8]` or `bg-[#FAFAFA]` | Warm off-white / soft neutral base |
| **Card / Surface** | `#FFFFFF` | `bg-white` | Lightweight, integrated surfaces |
| **Primary Text** | `#1A1A1A` | `text-[#1A1A1A]` | Dark charcoal for headings and body |
| **Secondary Text** | `#6B7280` | `text-[#6B7280]` | Muted gray for captions & metadata |
| **Borders** | `#E5E7EB` or `#F0F0EF` | `border-[#E5E7EB]` | Very subtle 1px light gray borders |

### Accent Color (Use Sparingly)
| Role | HEX / Value | Tailwind Recipe | Notes |
| :--- | :--- | :--- | :--- |
| **Subtle Lime Accent** | `#D4F066` / `#D9F99D` | `bg-[#F4FCE3] text-[#365314] border-[#D9F99D]` | Tags, badges, status highlights |
| **Lime Solid Highlight** | `#D4F066` | `bg-[#D4F066] text-[#1A1A1A]` | Special small indicators or pills |

> **Rule**: Keep the UI mostly neutral. Never use multiple competing accent colors. Only use semantic red/amber/green for actual errors, warnings, or statuses.

---

## 3. Component Design Rules

### A. Navigation & Pill Controls
- **Segmented Controls / Tabs**:
  - **Active Tab**: Dark charcoal background (`bg-[#1A1A1A] text-white shadow-xs`).
  - **Inactive Tab**: White/neutral background with subtle border (`bg-white text-[#1A1A1A] border border-[#E5E7EB] hover:bg-[#F5F5F4]`).
- **Sidebar**:
  - Clean white surface (`bg-white border-r border-[#E5E7EB]`), minimal padding, compact item lists.

### B. Cards & Surfaces
- Background: Pure white (`bg-white`).
- Border: 1px subtle gray (`border border-[#E5E7EB]`).
- Corner Radius: `rounded-xl` (12px) or `rounded-2xl` (16px).
- Shadow: Flat or minimal (`shadow-2xs` or `shadow-xs`). Avoid heavy drop shadows.
- Padding: Generous internal padding (`p-4` to `p-6`).

### C. Buttons
- **Primary CTA**: Dark charcoal (`bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white rounded-xl px-4 py-2 text-xs font-medium transition shadow-xs`).
- **Secondary / Ghost**: White surface (`bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs font-medium transition`).
- **Accent Badge / Pill**: Soft lime tint (`bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] rounded-full px-2.5 py-0.5 text-[10px] font-semibold`).

### D. Input Fields
- Container: White background with subtle border (`bg-white border border-[#E5E7EB] rounded-xl sm:rounded-2xl`).
- Focus State: Minimal dark charcoal ring (`focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10`).
- Text: Dark charcoal text (`text-[#1A1A1A]`), muted placeholder (`placeholder-[#9CA3AF]`).

---

## 4. Icon Guidelines

Follow these strict rules across all components:
1. **Library**: Use standard, default UI line icons from a single consistent library (primarily **Lucide** `lucide-react`).
2. **Monochrome by Default**:
   - Default: Dark charcoal (`text-[#1A1A1A]`) or muted gray (`text-[#6B7280]`).
   - Hover: Slightly darker (`group-hover:text-[#1A1A1A]`).
   - Active on dark surface: White (`text-white`).
3. **NEVER Use Emoji as UI Icons**: Replace all emojis with standard Lucide outline icons (e.g. `Route`, `Receipt`, `Compass`, `Utensils`, `HardDrive`).
4. **No Colorful or 3D Icons**: No gradient icons, no colored background glow boxes.
5. **Consistent Sizing**:
   - Inline metadata / chips: `w-3.5 h-3.5`.
   - Buttons / actions: `w-4 h-4`.
   - Featured topic / card icons: `w-4 h-4` inside a neutral `w-8 h-8 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB]`.

---

## 5. Implementation Workflow

When asked to design or refactor a page or component:
1. **Set the Canvas**: Ensure main wrapper has `bg-[#F9F9F8] text-[#1A1A1A]`.
2. **Structure with Grid & Whitespace**: Apply generous section spacing (`space-y-6`, `gap-4 sm:gap-6`, `py-8 sm:py-12`).
3. **Apply Component Cards**: Convert dense containers into lightweight white cards with `border border-[#E5E7EB] rounded-2xl shadow-xs`.
4. **Normalize Pill Controls**: Set active states to `bg-[#1A1A1A] text-white` and inactive to `bg-white text-[#1A1A1A] border border-[#E5E7EB]`.
5. **Verify Icons**: Verify that all icons are Lucide outline line icons, monochrome, and that no emojis are used as UI icons.
6. **Apply Subtle Lime Sparingly**: Only use `#F4FCE3` / `#D9F99D` for select badges, status indicators, or small highlights.

---

## References & Templates

- [Tailwind CSS Design Tokens & Cheatsheet](./references/tailwind-cheatsheet.md)
- [Component JSX Templates](./examples/component-templates.tsx)
