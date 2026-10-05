export interface ProvinceInfo {
  key: string;
  label: string;
  shortLabel: string;
  icon: string;
  bg: string;
}

export const VIETNAM_PROVINCES: ProvinceInfo[] = [
  {
    key: 'Hanoi',
    label: 'Hà Nội',
    shortLabel: 'Hà Nội',
    icon: '🏛️',
    bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    key: 'Ho Chi Minh',
    label: 'TP. Hồ Chí Minh',
    shortLabel: 'TP.HCM',
    icon: '🏙️',
    bg: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30',
  },
  {
    key: 'Da Nang',
    label: 'Đà Nẵng',
    shortLabel: 'Đà Nẵng',
    icon: '🌉',
    bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  {
    key: 'Quang Nam',
    label: 'Hội An (Quảng Nam)',
    shortLabel: 'Hội An',
    icon: '🏮',
    bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  {
    key: 'Thua Thien Hue',
    label: 'Huế (Thừa Thiên Huế)',
    shortLabel: 'Huế',
    icon: '🏯',
    bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  {
    key: 'Lam Dong',
    label: 'Đà Lạt (Lâm Đồng)',
    shortLabel: 'Đà Lạt',
    icon: '🌲',
    bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    key: 'Khanh Hoa',
    label: 'Nha Trang (Khánh Hòa)',
    shortLabel: 'Nha Trang',
    icon: '🏖️',
    bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
  {
    key: 'Kien Giang',
    label: 'Phú Quốc (Kiên Giang)',
    shortLabel: 'Phú Quốc',
    icon: '🏝️',
    bg: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  },
  {
    key: 'Quang Ninh',
    label: 'Hạ Long (Quảng Ninh)',
    shortLabel: 'Hạ Long',
    icon: '⛵',
    bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  },
  {
    key: 'Lao Cai',
    label: 'Sa Pa (Lào Cai)',
    shortLabel: 'Sa Pa',
    icon: '🏔️',
    bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  },
  {
    key: 'Ninh Binh',
    label: 'Ninh Bình',
    shortLabel: 'Ninh Bình',
    icon: '🚣',
    bg: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
  },
];

export const PROVINCE_MAP: Record<string, ProvinceInfo> = VIETNAM_PROVINCES.reduce(
  (acc, item) => {
    acc[item.key.toLowerCase()] = item;
    acc[item.label.toLowerCase()] = item;
    acc[item.shortLabel.toLowerCase()] = item;
    return acc;
  },
  {} as Record<string, ProvinceInfo>
);

export function getProvinceMeta(province?: string | null): ProvinceInfo {
  if (!province) {
    return {
      key: 'VN',
      label: 'Việt Nam',
      shortLabel: 'Việt Nam',
      icon: '📍',
      bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    };
  }

  const pLower = province.trim().toLowerCase();

  // Exact or partial match in map
  if (PROVINCE_MAP[pLower]) {
    return PROVINCE_MAP[pLower];
  }

  // Substring checks
  if (pLower.includes('ha noi') || pLower.includes('hà nội')) return PROVINCE_MAP['hanoi'];
  if (pLower.includes('ho chi minh') || pLower.includes('hồ chí minh') || pLower.includes('sài gòn'))
    return PROVINCE_MAP['ho chi minh'];
  if (pLower.includes('da nang') || pLower.includes('đà nẵng')) return PROVINCE_MAP['da nang'];
  if (pLower.includes('quang nam') || pLower.includes('hội an')) return PROVINCE_MAP['quang nam'];
  if (pLower.includes('hue') || pLower.includes('huế')) return PROVINCE_MAP['thua thien hue'];
  if (pLower.includes('lam dong') || pLower.includes('lâm đồng') || pLower.includes('đà lạt'))
    return PROVINCE_MAP['lam dong'];
  if (pLower.includes('khanh hoa') || pLower.includes('khánh hòa') || pLower.includes('nha trang'))
    return PROVINCE_MAP['khanh hoa'];
  if (pLower.includes('kien giang') || pLower.includes('kiên giang') || pLower.includes('phú quốc'))
    return PROVINCE_MAP['kien giang'];
  if (pLower.includes('quang ninh') || pLower.includes('quảng ninh') || pLower.includes('hạ long'))
    return PROVINCE_MAP['quang ninh'];
  if (pLower.includes('lao cai') || pLower.includes('lào cai') || pLower.includes('sa pa') || pLower.includes('sapa'))
    return PROVINCE_MAP['lao cai'];
  if (pLower.includes('ninh binh') || pLower.includes('ninh bình')) return PROVINCE_MAP['ninh binh'];

  return {
    key: province,
    label: province,
    shortLabel: province,
    icon: '📍',
    bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };
}
