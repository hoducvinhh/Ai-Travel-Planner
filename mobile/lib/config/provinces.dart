import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

/// Province metadata matching web/src/lib/provinces.ts
class ProvinceInfo {
  final String key;
  final String label;
  final String shortLabel;

  const ProvinceInfo({
    required this.key,
    required this.label,
    required this.shortLabel,
  });
}

const List<ProvinceInfo> vietnamProvinces = [
  ProvinceInfo(key: 'Hanoi', label: 'Hà Nội', shortLabel: 'Hà Nội'),
  ProvinceInfo(key: 'Ho Chi Minh', label: 'TP. Hồ Chí Minh', shortLabel: 'TP.HCM'),
  ProvinceInfo(key: 'Da Nang', label: 'Đà Nẵng', shortLabel: 'Đà Nẵng'),
  ProvinceInfo(key: 'Quang Nam', label: 'Hội An (Quảng Nam)', shortLabel: 'Hội An'),
  ProvinceInfo(key: 'Thua Thien Hue', label: 'Huế (Thừa Thiên Huế)', shortLabel: 'Huế'),
  ProvinceInfo(key: 'Lam Dong', label: 'Đà Lạt (Lâm Đồng)', shortLabel: 'Đà Lạt'),
  ProvinceInfo(key: 'Khanh Hoa', label: 'Nha Trang (Khánh Hòa)', shortLabel: 'Nha Trang'),
  ProvinceInfo(key: 'Kien Giang', label: 'Phú Quốc (Kiên Giang)', shortLabel: 'Phú Quốc'),
  ProvinceInfo(key: 'Quang Ninh', label: 'Hạ Long (Quảng Ninh)', shortLabel: 'Hạ Long'),
  ProvinceInfo(key: 'Lao Cai', label: 'Sa Pa (Lào Cai)', shortLabel: 'Sa Pa'),
  ProvinceInfo(key: 'Ninh Binh', label: 'Ninh Bình', shortLabel: 'Ninh Bình'),
];

const List<String> placeCategories = [
  'Tất cả',
  'Thiên nhiên',
  'Văn hóa',
  'Lịch sử',
  'Ẩm thực',
  'Check-in',
  'Giải trí',
  'Mua sắm',
  'Tâm linh',
  'Nghỉ dưỡng',
];

const List<Map<String, String>> placeSortOptions = [
  {'value': 'popularity', 'label': 'Độ nổi tiếng (Mặc định)'},
  {'value': 'rating', 'label': 'Đánh giá cao nhất'},
  {'value': 'price_asc', 'label': 'Giá vé: Thấp đến cao'},
  {'value': 'price_desc', 'label': 'Giá vé: Cao đến thấp'},
  {'value': 'newest', 'label': 'Mới cập nhật'},
];

const List<Map<String, String>> popularQuickDestinations = [
  {'name': 'Đà Lạt', 'query': 'Đà Lạt'},
  {'name': 'Sa Pa', 'query': 'Sa Pa'},
  {'name': 'Đà Nẵng', 'query': 'Đà Nẵng'},
  {'name': 'Hội An', 'query': 'Hội An'},
  {'name': 'Ninh Bình', 'query': 'Ninh Bình'},
  {'name': 'Phú Quốc', 'query': 'Phú Quốc'},
];

const List<String> popularCommunityTags = [
  'Tất cả',
  'Tìm bạn đồng hành',
  'Đà Lạt',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Phượt',
  'Ẩm thực',
  'Kinh nghiệm du lịch',
  'Săn mây',
];

class TripPreferenceOption {
  final String id;
  final String label;
  final IconData icon;

  const TripPreferenceOption({
    required this.id,
    required this.label,
    required this.icon,
  });
}

const List<TripPreferenceOption> tripPreferencesList = [
  TripPreferenceOption(id: 'nature', label: 'Thiên nhiên', icon: LucideIcons.trees),
  TripPreferenceOption(id: 'beach', label: 'Biển & Đảo', icon: LucideIcons.waves),
  TripPreferenceOption(id: 'culture', label: 'Văn hóa', icon: LucideIcons.landmark),
  TripPreferenceOption(id: 'food', label: 'Ẩm thực', icon: LucideIcons.utensils),
  TripPreferenceOption(id: 'adventure', label: 'Phiêu lưu', icon: LucideIcons.mountain),
  TripPreferenceOption(id: 'photography', label: 'Chụp ảnh', icon: LucideIcons.camera),
  TripPreferenceOption(id: 'shopping', label: 'Mua sắm', icon: LucideIcons.shoppingBag),
  TripPreferenceOption(id: 'relax', label: 'Thư giãn', icon: LucideIcons.coffee),
  TripPreferenceOption(id: 'nightlife', label: 'Đời sống đêm', icon: LucideIcons.moon),
  TripPreferenceOption(id: 'historical', label: 'Lịch sử', icon: LucideIcons.history),
];

ProvinceInfo getProvinceMeta(String? province) {
  if (province == null || province.trim().isEmpty) {
    return const ProvinceInfo(key: 'VN', label: 'Việt Nam', shortLabel: 'Việt Nam');
  }

  final lower = province.trim().toLowerCase();
  for (final p in vietnamProvinces) {
    if (p.key.toLowerCase() == lower ||
        p.label.toLowerCase() == lower ||
        p.shortLabel.toLowerCase() == lower) {
      return p;
    }
  }

  if (lower.contains('ha noi') || lower.contains('hà nội')) return vietnamProvinces[0];
  if (lower.contains('ho chi minh') || lower.contains('hồ chí minh') || lower.contains('sài gòn')) {
    return vietnamProvinces[1];
  }
  if (lower.contains('da nang') || lower.contains('đà nẵng')) return vietnamProvinces[2];
  if (lower.contains('quang nam') || lower.contains('hội an')) return vietnamProvinces[3];
  if (lower.contains('hue') || lower.contains('huế')) return vietnamProvinces[4];
  if (lower.contains('lam dong') || lower.contains('lâm đồng') || lower.contains('đà lạt')) {
    return vietnamProvinces[5];
  }
  if (lower.contains('khanh hoa') || lower.contains('khánh hòa') || lower.contains('nha trang')) {
    return vietnamProvinces[6];
  }
  if (lower.contains('kien giang') || lower.contains('kiên giang') || lower.contains('phú quốc')) {
    return vietnamProvinces[7];
  }
  if (lower.contains('quang ninh') || lower.contains('quảng ninh') || lower.contains('hạ long')) {
    return vietnamProvinces[8];
  }
  if (lower.contains('lao cai') || lower.contains('lào cai') || lower.contains('sa pa') || lower.contains('sapa')) {
    return vietnamProvinces[9];
  }
  if (lower.contains('ninh binh') || lower.contains('ninh bình')) return vietnamProvinces[10];

  return ProvinceInfo(key: province, label: province, shortLabel: province);
}

class FeaturedDestinationBanner {
  final String provinceKey;
  final String title;
  final String subtitle;
  final String query;
  final String assetPath;

  const FeaturedDestinationBanner({
    required this.provinceKey,
    required this.title,
    required this.subtitle,
    required this.query,
    required this.assetPath,
  });
}

const List<FeaturedDestinationBanner> featuredDestinationBanners = [
  FeaturedDestinationBanner(
    provinceKey: 'Lam Dong',
    title: 'Đà Lạt sương sớm',
    subtitle: 'Đồi thông lặng gió, hồ Xuân Hương và những quán cà phê lưng đồi',
    query: 'Đà Lạt',
    assetPath: 'assets/images/provinces/dalat.jpg',
  ),
  FeaturedDestinationBanner(
    provinceKey: 'Lao Cai',
    title: 'Sa Pa mùa mây',
    subtitle: 'Ruộng bậc thang Mường Hoa và cung đèo chạm đỉnh Fansipan',
    query: 'Sa Pa',
    assetPath: 'assets/images/provinces/sapa.jpg',
  ),
  FeaturedDestinationBanner(
    provinceKey: 'Quang Ninh',
    title: 'Hạ Long kỳ quan',
    subtitle: 'Vịnh đá vôi xanh ngọc và hải trình bình minh trên du thuyền',
    query: 'Hạ Long',
    assetPath: 'assets/images/provinces/halong.jpg',
  ),
  FeaturedDestinationBanner(
    provinceKey: 'Quang Nam',
    title: 'Hội An phố cổ',
    subtitle: 'Dãy nhà tường vàng bên sông Hoài lung linh ánh đèn lồng',
    query: 'Hội An',
    assetPath: 'assets/images/provinces/hoian.jpg',
  ),
  FeaturedDestinationBanner(
    provinceKey: 'Ninh Binh',
    title: 'Ninh Bình non nước',
    subtitle: 'Chèo thuyền xuyên hang Tràng An giữa trùng điệp núi đá vôi',
    query: 'Ninh Bình',
    assetPath: 'assets/images/provinces/ninhbinh.jpg',
  ),
  FeaturedDestinationBanner(
    provinceKey: 'Kien Giang',
    title: 'Phú Quốc biển ngọc',
    subtitle: 'Bãi cát mịn, làn nước trong vắt và hoàng hôn phía Tây đảo',
    query: 'Phú Quốc',
    assetPath: 'assets/images/provinces/phuquoc.jpg',
  ),
];

const Map<String, String> _provinceAssetMap = {
  'Hanoi': 'assets/images/provinces/hanoi.jpg',
  'Ho Chi Minh': 'assets/images/provinces/danang.jpg',
  'Da Nang': 'assets/images/provinces/danang.jpg',
  'Quang Nam': 'assets/images/provinces/hoian.jpg',
  'Thua Thien Hue': 'assets/images/provinces/hue.jpg',
  'Lam Dong': 'assets/images/provinces/dalat.jpg',
  'Khanh Hoa': 'assets/images/provinces/nhatrang.jpg',
  'Kien Giang': 'assets/images/provinces/phuquoc.jpg',
  'Quang Ninh': 'assets/images/provinces/halong.jpg',
  'Lao Cai': 'assets/images/provinces/sapa.jpg',
  'Ninh Binh': 'assets/images/provinces/ninhbinh.jpg',
};

/// Resolve a bundled local asset path for any province or multi-province trip destination.
String provinceAssetPath(String? destinationOrProvince) {
  if (destinationOrProvince == null || destinationOrProvince.trim().isEmpty) {
    return 'assets/images/provinces/halong.jpg';
  }
  final firstSegment = destinationOrProvince.split(',').first.trim();
  final meta = getProvinceMeta(firstSegment);
  if (_provinceAssetMap.containsKey(meta.key)) {
    return _provinceAssetMap[meta.key]!;
  }
  final wholeMeta = getProvinceMeta(destinationOrProvince);
  return _provinceAssetMap[wholeMeta.key] ?? 'assets/images/provinces/halong.jpg';
}
