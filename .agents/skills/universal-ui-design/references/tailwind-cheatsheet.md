# Universal UI Design System - Tailwind CSS Cheatsheet

Quick reference for copy-paste Tailwind CSS utility classes adhering to the Universal UI Design System.

---

## 1. Palette & Surface Tokens

### Backgrounds
```html
<!-- Page Main Background -->
<div class="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] font-sans">

<!-- Clean White Card / Surface -->
<div class="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs p-5">

<!-- Muted Surface / Secondary Card -->
<div class="bg-[#F5F5F4] border border-[#E5E7EB] rounded-xl p-3.5">
```

### Typography Hierarchy
```html
<!-- Page Heading -->
<h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">

<!-- Section Heading -->
<h2 class="text-lg font-semibold text-[#1A1A1A]">

<!-- Component / Card Title -->
<h3 class="text-sm font-semibold text-[#1A1A1A]">

<!-- Body Text -->
<p class="text-sm text-[#1A1A1A] leading-relaxed">

<!-- Caption / Secondary Text -->
<p class="text-xs text-[#6B7280]">

<!-- Metadata / Microcopy -->
<span class="text-[11px] text-[#9CA3AF]">
```

---

## 2. Navigation & Pill Controls

### Segmented Control
```html
<div class="inline-flex items-center p-1 rounded-full bg-[#F0F0EF] border border-[#E5E7EB] text-xs">
  <!-- Active Tab -->
  <button class="px-3.5 py-1.5 rounded-full font-medium bg-[#1A1A1A] text-white shadow-xs transition-all">
    Tab Đang Chọn
  </button>
  <!-- Inactive Tab -->
  <button class="px-3.5 py-1.5 rounded-full font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-all">
    Tab Khác
  </button>
</div>
```

### Filter Pill Carousel
```html
<!-- Active Pill -->
<button class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xs transition-all">
  <Compass class="w-3.5 h-3.5 text-white" />
  <span>Khám phá</span>
</button>

<!-- Inactive Pill -->
<button class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border border-[#E5E7EB] transition-all">
  <Compass class="w-3.5 h-3.5 text-[#6B7280]" />
  <span>Khám phá</span>
</button>
```

---

## 3. Badges & Status Indicators

### Subtle Lime Accent Badges
```html
<!-- Lime Badge (Small) -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] text-[10px] font-semibold">
  Mới cập nhật
</span>

<!-- Status Online Dot (Semantic) -->
<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-[11px] text-[#4B5563] shadow-2xs">
  <span class="w-1.5 h-1.5 rounded-full bg-[#65A30D]"></span>
  <span>Đang hoạt động</span>
</div>
```

---

## 4. Buttons

```html
<!-- Primary Button (Dark Charcoal) -->
<button class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] active:scale-[0.99] text-white font-medium text-xs sm:text-sm transition-all shadow-xs">
  <Plus class="w-4 h-4 text-white" />
  <span>Tạo mới</span>
</button>

<!-- Secondary Button (White / Subtle Border) -->
<button class="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border border-[#E5E7EB] text-xs font-medium transition shadow-2xs">
  <span>Hủy bỏ</span>
</button>

<!-- Subtle Icon Action Button -->
<button class="p-2 rounded-xl bg-white hover:bg-[#F5F5F4] text-[#6B7280] hover:text-[#1A1A1A] border border-[#E5E7EB] transition shadow-2xs">
  <PanelLeft class="w-4 h-4" />
</button>
```

---

## 5. Input Fields

```html
<!-- Text Input Container with Focus Ring -->
<div class="relative flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-2xs focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10 transition-all">
  <Search class="w-4 h-4 text-[#9CA3AF] mr-2 shrink-0" />
  <input
    type="text"
    placeholder="Tìm kiếm nội dung..."
    class="w-full bg-transparent text-xs sm:text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none"
  />
</div>
```

---

## 6. Icon Formatting Rules

| Context | Class | Color Rule |
| :--- | :--- | :--- |
| Action Button | `w-4 h-4 text-white` | White on dark button |
| Muted Icon | `w-4 h-4 text-[#6B7280]` | Monochrome gray |
| Active Icon | `w-4 h-4 text-[#1A1A1A]` | Dark charcoal |
| Inline Chip | `w-3.5 h-3.5 text-[#6B7280]` | Standard micro size |
| Icon Wrapper | `w-8 h-8 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A]` | Neutral box, no color glow |
