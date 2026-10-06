---
name: universal-ui-design
description: >-
  Universal UI Design System guidelines for building clean, modern, minimalist,
  and premium interfaces with shadcn/ui and Lucide Icons. Use this skill whenever
  designing, building, styling, or refactoring UI components, pages, web applications,
  dashboards, or websites following the neutral warm off-white, dark charcoal, subtle
  lime accent, and monochrome line icon system.
---

# Universal UI Design System Skill

This skill enforces a **clean, modern, minimalist, premium interface style** with a strong emphasis on usability, visual hierarchy, whitespace, consistency, readability, and intentional design.

It integrates seamlessly with **shadcn/ui** components and the **Lucide Icons** library (`lucide-react`).

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
| Role | HEX / Value | Tailwind Utility | CSS Variable Token |
| :--- | :--- | :--- | :--- |
| **Main Background** | `#F9F9F8` or `#FAFAFA` | `bg-[#F9F9F8]` | `--background: #F9F9F8;` |
| **Card / Surface** | `#FFFFFF` | `bg-white` | `--card: #FFFFFF;` |
| **Primary Text** | `#1A1A1A` | `text-[#1A1A1A]` | `--foreground: #1A1A1A;` |
| **Secondary Text** | `#6B7280` | `text-[#6B7280]` | `--muted-foreground: #6B7280;` |
| **Borders** | `#E5E7EB` or `#F0F0EF` | `border-[#E5E7EB]` | `--border: #E5E7EB;` |

### Accent Color (Use Sparingly)
| Role | HEX / Value | Tailwind Recipe | Use Cases |
| :--- | :--- | :--- | :--- |
| **Subtle Lime Accent** | `#D4F066` / `#D9F99D` | `bg-[#F4FCE3] text-[#365314] border-[#D9F99D]` | Status badges, tags, active indicators |
| **Lime Solid Highlight** | `#D4F066` | `bg-[#D4F066] text-[#1A1A1A]` | Small key highlights or counters |

> **Rule**: Keep the UI mostly neutral. Never use multiple competing accent colors. Only use semantic red/amber/green for actual errors, warnings, or statuses.

---

## 3. Using shadcn/ui with Universal UI

All UI components across the frontend should utilize **shadcn/ui** (`src/components/ui/`), styled to match this design system.

### A. Installing Components via shadcn CLI
Whenever a new UI component is needed, add it directly via shadcn CLI:
```bash
pnpm dlx shadcn@latest add <component-name> -y
```
*Pre-installed core components in `src/components/ui/`:*
- `button`, `card`, `badge`, `input`, `textarea`, `dialog`, `tabs`, `accordion`, `avatar`, `dropdown-menu`, `select`, `separator`, `scroll-area`, `tooltip`.

### B. shadcn Component Usage Patterns

1. **Button (`src/components/ui/button.tsx`)**:
   - Primary: `<Button variant="default">` → Dark charcoal `#1A1A1A`, text white.
   - Secondary: `<Button variant="secondary">` → Neutral surface `#F5F5F4`, text `#1A1A1A`.
   - Outline: `<Button variant="outline">` → White background, border `#E5E7EB`, hover `#F5F5F4`.
   - Ghost: `<Button variant="ghost">` → Transparent, hover `#F5F5F4`.

2. **Badge (`src/components/ui/badge.tsx`)**:
   - Default: `<Badge variant="default">` → Dark charcoal `#1A1A1A`, text white.
   - Subtle Lime: `<Badge variant="lime">` → `bg-[#F4FCE3] text-[#365314] border-[#D9F99D]` (for tags, RAG chunks, active state).
   - Outline: `<Badge variant="outline">` → White background, border `#E5E7EB`.
   - Secondary: `<Badge variant="secondary">` → Neutral `#F5F5F4`, text `#6B7280`.

3. **Card (`src/components/ui/card.tsx`)**:
   - Use `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`.
   - Clean white background (`bg-white`), subtle 1px border (`border-[#E5E7EB]`), `rounded-2xl`, flat shadow (`shadow-2xs`).

4. **Tabs & Segmented Controls (`src/components/ui/tabs.tsx`)**:
   - `<TabsList>`: Pill container `rounded-full bg-[#F0F0EF] border border-[#E5E7EB] p-1`.
   - `<TabsTrigger>`: Active state gets dark charcoal `#1A1A1A` with white text `data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white rounded-full shadow-xs`.

5. **Dialog / Modal (`src/components/ui/dialog.tsx`)**:
   - Backdrop: `bg-black/40 backdrop-blur-xs`.
   - Container: `bg-white border-[#E5E7EB] rounded-2xl shadow-xl`.

6. **Input & Textarea (`src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`)**:
   - White surface, subtle border `#E5E7EB`, focus ring `#1A1A1A/10`, focus border `#1A1A1A`.

---

## 4. Lucide Icons System (`lucide-react`)

All icons throughout the application **must strictly use Lucide Icons** (`lucide-react`).

### A. Icon Styling Rules
1. **Monochrome by Default**:
   - Default state: Dark charcoal (`text-[#1A1A1A]`) or muted gray (`text-[#6B7280]`).
   - Hover state: Darker contrast (`group-hover:text-[#1A1A1A]`).
   - Active on dark surface: Pure white (`text-white`).
2. **Strictly NO Emojis as UI Icons**:
   - Replace any emoji in navigation, chips, cards, or buttons with standard Lucide outline icons.
3. **No 3D, Gradient, or Colorful Icons**:
   - No colorful icon sets or gradient fills. Keep stroke weight consistent (regular 2px or 1.75px outline).
4. **Consistent Sizing**:
   - Mini/inline metadata / chips: `w-3.5 h-3.5`.
   - Standard button / nav icons: `w-4 h-4`.
   - Featured card icon containers: `w-8 h-8 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A]` with inner icon `w-4 h-4`.

### B. Standard Lucide Icon Catalog for Common Concepts

| Concept | Recommended Lucide Icon | Usage |
| :--- | :--- | :--- |
| **Navigation & Explorer** | `Compass`, `MapPin`, `Calendar`, `Users` | Main navigation tabs, explorer links |
| **Travel & Routes** | `Route`, `Navigation`, `Map`, `Milestone` | Itinerary routes, transit, inter-provincial paths |
| **Costs & Budget** | `Receipt`, `Wallet`, `Coins`, `Ticket` | Pricing, estimated expenses, entrance tickets |
| **Stay & Hospitality** | `Hotel`, `Bed`, `Home` | Homestay, resorts, glamping |
| **Food & Dining** | `Utensils`, `Coffee` | Regional delicacies, restaurants, cafes |
| **Culture & History** | `Landmark`, `Scroll`, `Castle` | Heritage sites, temples, historical monuments |
| **Nature & Landscapes**| `Mountain`, `Trees`, `Waves`, `Sun` | Nature wonders, trekking, islands, beaches |
| **Safety & Tips** | `Lightbulb`, `ShieldCheck`, `AlertCircle`| Local tips, driving techniques, safety warnings |
| **Actions & Editing** | `Plus`, `Send`, `Search`, `Edit3`, `Trash2`, `Copy` | CRUD actions, query dispatch, searches |
| **Directional Links** | `ArrowRight`, `ArrowLeft`, `ArrowUpRight`, `ChevronRight` | Next step, outgoing links, drilldowns |
| **Interface Controls** | `Menu`, `X`, `Check`, `RotateCcw`, `PanelLeft`, `PanelLeftClose` | Drawer toggles, dialog close, refreshes |
| **Feedback & State** | `Sparkles`, `Clock`, `Heart`, `Bookmark`, `Database`, `HardDrive` | AI suggestions, timestamps, wishlist, storage |
| **Auth & Profile** | `LogIn`, `LogOut`, `UserPlus`, `User` | Authentication actions, profile drawer |
| **Loading** | `Loader2` (with `animate-spin`) | Async fetching, AI generation streaming |

---

## 5. Implementation Workflow

When asked to design or refactor a page or component:
1. **Import shadcn Components**: Always prefer importing from `@/components/ui/*` (`Button`, `Card`, `Badge`, `Dialog`, `Tabs`, `Input`, etc.).
2. **Import Lucide Icons**: Import standard outline icons from `lucide-react` (monochrome, no emojis).
3. **Set the Canvas**: Ensure main wrapper has `bg-[#F9F9F8] text-[#1A1A1A]`.
4. **Structure with Grid & Whitespace**: Apply generous spacing (`gap-4 sm:gap-6`, `p-6`).
5. **Apply Pill Controls**: Set active state to dark charcoal `#1A1A1A` with white text.
6. **Apply Subtle Lime Sparingly**: Only use `<Badge variant="lime">` for tags, active statuses, or small highlights.

---

## References & Templates

- [Tailwind CSS Design Tokens & Cheatsheet](./references/tailwind-cheatsheet.md)
- [Component JSX Templates](./examples/component-templates.tsx)
