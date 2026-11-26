/**
 * Shared human-readable label formatters for user preferences, budget levels, and place metadata.
 */

const STYLE_LABELS: Record<string, string> = {
  culture: 'Văn hóa & Lịch sử',
  nature: 'Thiên nhiên & Sinh thái',
  food: 'Ẩm thực & Đặc sản',
  relax: 'Nghỉ dưỡng & Biển đảo',
  beach: 'Biển & Đảo',
  photography: 'Check-in & Sống ảo',
  adventure: 'Khám phá & Mạo hiểm',
  nightlife: 'Vui chơi & Giải trí',
  historical: 'Lịch sử',
  shopping: 'Mua sắm',
};

const COMPANION_LABELS: Record<string, string> = {
  solo: 'Đi một mình',
  couple: 'Cặp đôi',
  family: 'Gia đình',
  friends: 'Nhóm bạn bè',
};

const BUDGET_LABELS: Record<string, string> = {
  budget: 'Tiết kiệm (< 1tr/ngày)',
  standard: 'Tiêu chuẩn (1tr - 3tr/ngày)',
  moderate: 'Tiêu chuẩn (1tr - 3tr/ngày)',
  luxury: 'Cao cấp (> 3tr/ngày)',
};

const INDOOR_OUTDOOR_LABELS: Record<string, string> = {
  both: 'Trong nhà & Ngoài trời',
  indoor: 'Trong nhà',
  outdoor: 'Ngoài trời',
};

export function isCompanionTag(value: string): boolean {
  return value.startsWith('companion:');
}

export function formatCompanionTag(value: string): string {
  const raw = value.replace(/^companion:/, '').trim().toLowerCase();
  return COMPANION_LABELS[raw] || raw;
}

export function formatStyleLabel(style: string): string {
  if (isCompanionTag(style)) {
    return `Đồng hành: ${formatCompanionTag(style)}`;
  }
  const key = style.trim().toLowerCase();
  return STYLE_LABELS[key] || style;
}

export function splitStylesAndCompanion(styles?: string[] | null): {
  styles: string[];
  companion: string | null;
} {
  if (!Array.isArray(styles)) {
    return { styles: [], companion: null };
  }
  const companionRaw = styles.find(isCompanionTag);
  const cleanStyles = styles.filter((s) => !isCompanionTag(s));
  return {
    styles: cleanStyles,
    companion: companionRaw ? formatCompanionTag(companionRaw) : null,
  };
}

export function normalizeBudgetKey(level?: string | null): 'BUDGET' | 'MODERATE' | 'LUXURY' {
  const raw = (level || '').trim().toLowerCase();
  if (raw === 'budget') return 'BUDGET';
  if (raw === 'luxury') return 'LUXURY';
  return 'MODERATE';
}

export function formatBudgetLabel(level?: string | null): string {
  if (!level) return 'Tiêu chuẩn';
  const key = level.trim().toLowerCase();
  return BUDGET_LABELS[key] || level;
}

export function formatIndoorOutdoor(value?: string | null): string {
  if (!value) return '';
  const key = value.trim().toLowerCase();
  return INDOOR_OUTDOOR_LABELS[key] || value;
}
