# Universal UI Design System - Cheatsheet & Code Snippets

Quick reference for copy-paste shadcn/ui components, Lucide icons, and Tailwind utility classes adhering to the Universal UI Design System.

---

## 1. Core Tokens & CSS Variables

```css
/* src/app/globals.css */
:root {
  --background: #F9F9F8;
  --foreground: #1A1A1A;
  --card: #FFFFFF;
  --card-foreground: #1A1A1A;
  --popover: #FFFFFF;
  --popover-foreground: #1A1A1A;
  --primary: #1A1A1A;
  --primary-foreground: #FFFFFF;
  --secondary: #F5F5F4;
  --secondary-foreground: #1A1A1A;
  --muted: #F5F5F4;
  --muted-foreground: #6B7280;
  --accent: #F4FCE3;
  --accent-foreground: #365314;
  --destructive: #EF4444;
  --destructive-foreground: #FFFFFF;
  --border: #E5E7EB;
  --input: #E5E7EB;
  --ring: #1A1A1A;
  --radius: 0.875rem;
}
```

---

## 2. shadcn/ui Component Recipes

### Buttons (`src/components/ui/button.tsx`)
```tsx
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, Trash2 } from "lucide-react"

// Primary CTA (Dark Charcoal)
<Button variant="default" className="rounded-xl">
  <Plus className="w-4 h-4 text-white" />
  <span>Tạo lịch trình mới</span>
</Button>

// Secondary / Neutral Button
<Button variant="secondary" className="rounded-xl">
  <span>Xem chi tiết</span>
</Button>

// Outline Button
<Button variant="outline" className="rounded-xl border-[#E5E7EB]">
  <span>Hủy bỏ</span>
</Button>
```

### Badges (`src/components/ui/badge.tsx`)
```tsx
import { Badge } from "@/components/ui/badge"

// Subtle Lime Accent Badge (Status, active, tags)
<Badge variant="lime">
  10.856 Chunks
</Badge>

// Dark Charcoal Badge
<Badge variant="default">
  Admin
</Badge>

// Outline Badge
<Badge variant="outline" className="border-[#E5E7EB] text-[#1A1A1A]">
  63 Tỉnh thành
</Badge>
```

### Cards (`src/components/ui/card.tsx`)
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Route } from "lucide-react"

<Card className="rounded-2xl border-[#E5E7EB] bg-white shadow-2xs">
  <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
    <div className="w-9 h-9 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A]">
      <Route className="w-4 h-4 text-[#1A1A1A]" />
    </div>
    <div>
      <CardTitle className="text-sm font-semibold text-[#1A1A1A]">Tuyến Liên Tỉnh</CardTitle>
      <CardDescription className="text-xs text-[#6B7280]">40+ lộ trình tối ưu</CardDescription>
    </div>
  </CardHeader>
  <CardContent className="text-xs text-[#4B5563]">
    Khám phá các cung đường phượt đẹp nhất nối liền các tỉnh thành Việt Nam.
  </CardContent>
</Card>
```

### Segmented Tabs (`src/components/ui/tabs.tsx`)
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ListFilter, Grid } from "lucide-react"

<Tabs defaultValue="list">
  <TabsList className="rounded-full bg-[#F0F0EF] border border-[#E5E7EB] p-1">
    <TabsTrigger
      value="list"
      className="rounded-full px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white shadow-xs"
    >
      <ListFilter className="w-3.5 h-3.5 mr-1.5" />
      <span>Chi tiết</span>
    </TabsTrigger>
    <TabsTrigger
      value="grid"
      className="rounded-full px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white shadow-xs"
    >
      <Grid className="w-3.5 h-3.5 mr-1.5" />
      <span>Lưới</span>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="list">...</TabsContent>
  <TabsContent value="grid">...</TabsContent>
</Tabs>
```

---

## 3. Lucide Icons Catalog Quick-Reference

```tsx
import {
  // Navigation & Places
  Compass, MapPin, Calendar, Users, Route, Landmark, Mountain, Waves, Hotel, Utensils,
  // Actions & Controls
  Plus, Send, Search, Trash2, Edit3, Check, X, RotateCcw, ArrowRight, ArrowUpRight,
  // State & Feedback
  Sparkles, Clock, BookOpen, HardDrive, Database, Loader2, HelpCircle, AlertCircle
} from "lucide-react";
```

### Icon Sizing Rules:
- Inline Metadata / Chips: `w-3.5 h-3.5`
- Button / Actions: `w-4 h-4`
- Icon Box Wrapper: `w-8 h-8 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A]`
- Colors: Always monochrome (`text-[#1A1A1A]`, `text-[#6B7280]`, or `text-white` on dark surface).
