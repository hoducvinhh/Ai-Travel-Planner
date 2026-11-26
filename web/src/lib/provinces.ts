export interface ProvinceInfo {
  key: string;
  label: string;
  shortLabel: string;
  tagline: string;
  image: string;
  icon: string;
  bg: string;
}

export interface FeaturedDestinationBanner {
  provinceKey: string;
  regionLabel: string;
  title: string;
  subtitle: string;
  query: string;
  image: string;
}

const MONOCHROME_BADGE_CLASS = 'bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]';

export const VIETNAM_PROVINCES: ProvinceInfo[] = [
  { key: 'Lam Dong', label: 'Đà Lạt (Lâm Đồng)', shortLabel: 'Đà Lạt', tagline: 'Đồi thông & sương sớm', image: '/images/provinces/dalat.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Lao Cai', label: 'Sa Pa (Lào Cai)', shortLabel: 'Sa Pa', tagline: 'Mây núi & ruộng bậc thang', image: '/images/provinces/sapa.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Quang Ninh', label: 'Hạ Long (Quảng Ninh)', shortLabel: 'Hạ Long', tagline: 'Kỳ quan vịnh đá vôi', image: '/images/provinces/halong.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Quang Nam', label: 'Hội An (Quảng Nam)', shortLabel: 'Hội An', tagline: 'Phố cổ đèn lồng', image: '/images/provinces/hoian.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Ninh Binh', label: 'Ninh Bình', shortLabel: 'Ninh Bình', tagline: 'Tràng An non nước', image: '/images/provinces/ninhbinh.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Kien Giang', label: 'Phú Quốc (Kiên Giang)', shortLabel: 'Phú Quốc', tagline: 'Đảo ngọc & hoàng hôn', image: '/images/provinces/phuquoc.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Da Nang', label: 'Đà Nẵng', shortLabel: 'Đà Nẵng', tagline: 'Thành phố biển & Cầu Vàng', image: '/images/provinces/danang.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Hanoi', label: 'Hà Nội', shortLabel: 'Hà Nội', tagline: 'Nghìn năm văn hiến', image: '/images/provinces/hanoi.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Thua Thien Hue', label: 'Huế (Thừa Thiên Huế)', shortLabel: 'Huế', tagline: 'Cố đô bên dòng Hương', image: '/images/provinces/hue.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Khanh Hoa', label: 'Nha Trang (Khánh Hòa)', shortLabel: 'Nha Trang', tagline: 'Vịnh biển xanh ngắt', image: '/images/provinces/nhatrang.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
  { key: 'Ho Chi Minh', label: 'TP. Hồ Chí Minh', shortLabel: 'TP.HCM', tagline: 'Đô thị năng động', image: '/images/provinces/danang.jpg', icon: '', bg: MONOCHROME_BADGE_CLASS },
];

export const FEATURED_DESTINATION_BANNERS: FeaturedDestinationBanner[] = [
  {
    provinceKey: 'Quang Ninh',
    regionLabel: 'Hạ Long • Quảng Ninh',
    title: 'Hạ Long kỳ quan xanh ngọc',
    subtitle: 'Vịnh đá vôi hùng vĩ và hải trình bình minh giữa di sản thiên nhiên thế giới.',
    query: 'Hạ Long',
    image: '/images/provinces/halong.jpg',
  },
  {
    provinceKey: 'Lam Dong',
    regionLabel: 'Đà Lạt • Lâm Đồng',
    title: 'Đà Lạt sương sớm cao nguyên',
    subtitle: 'Đồi thông lặng gió, hồ Xuân Hương và những quán cà phê ôm trọn thung lũng mây.',
    query: 'Đà Lạt',
    image: '/images/provinces/dalat.jpg',
  },
  {
    provinceKey: 'Lao Cai',
    regionLabel: 'Sa Pa • Lào Cai',
    title: 'Sa Pa chạm đỉnh mây trời',
    subtitle: 'Ruộng bậc thang Mường Hoa uốn lượn và cung đèo hùng vĩ vùng Tây Bắc.',
    query: 'Sa Pa',
    image: '/images/provinces/sapa.jpg',
  },
  {
    provinceKey: 'Quang Nam',
    regionLabel: 'Hội An • Quảng Nam',
    title: 'Hội An phố cổ bên sông Hoài',
    subtitle: 'Dãy nhà tường vàng rực rỡ nắng chiều và đêm thả hoa đăng lung linh.',
    query: 'Hội An',
    image: '/images/provinces/hoian.jpg',
  },
  {
    provinceKey: 'Ninh Binh',
    regionLabel: 'Ninh Bình • Tràng An',
    title: 'Ninh Bình non nước hữu tình',
    subtitle: 'Xuôi mái chèo xuyên hang động Tràng An giữa trùng điệp núi đá vôi.',
    query: 'Ninh Bình',
    image: '/images/provinces/ninhbinh.jpg',
  },
  {
    provinceKey: 'Kien Giang',
    regionLabel: 'Phú Quốc • Kiên Giang',
    title: 'Phú Quốc biển ngọc phương Nam',
    subtitle: 'Bãi cát mịn, làn nước trong vắt và ráng chiều vàng rực phía Tây đảo.',
    query: 'Phú Quốc',
    image: '/images/provinces/phuquoc.jpg',
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
      tagline: 'Khám phá khắp Việt Nam',
      image: '/images/provinces/halong.jpg',
      icon: '',
      bg: MONOCHROME_BADGE_CLASS,
    };
  }

  const pLower = province.trim().toLowerCase();

  if (PROVINCE_MAP[pLower]) {
    return PROVINCE_MAP[pLower];
  }

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
    tagline: 'Điểm đến Việt Nam',
    image: '/images/provinces/halong.jpg',
    icon: '',
    bg: MONOCHROME_BADGE_CLASS,
  };
}
