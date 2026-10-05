import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PlaceSeedItem {
  name: string;
  province: string;
  district?: string;
  categories: string[];
  priceEstimate: number;
  latitude: number;
  longitude: number;
  popularityScore: number;
  indoorOutdoor: string;
  activityLevel: string;
  description: string;
}

const NEW_PLACES: PlaceSeedItem[] = [
  // ==========================================
  // 1. ĐÀ NẴNG (Da Nang) - 10 Địa điểm
  // ==========================================
  {
    name: 'Cầu Rồng Đà Nẵng',
    province: 'Da Nang',
    district: 'Hải Châu - Sơn Trà',
    categories: ['Văn hóa', 'Check-in', 'Lịch sử', 'Giải trí'],
    priceEstimate: 0,
    latitude: 16.061,
    longitude: 108.2208,
    popularityScore: 98,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Biểu tượng kiến trúc độc đáo bắc qua sông Hàn với khả năng phun lửa và phun nước rực rỡ vào 21:00 các tối thứ Bảy, Chủ Nhật hàng tuần.',
  },
  {
    name: 'Sun World Bà Nà Hills & Cầu Vàng',
    province: 'Da Nang',
    district: 'Hòa Vang',
    categories: ['Nghỉ dưỡng', 'Check-in', 'Giải trí', 'Thiên nhiên'],
    priceEstimate: 900000,
    latitude: 15.9988,
    longitude: 107.9961,
    popularityScore: 99,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Khu du lịch nghỉ dưỡng trên đỉnh núi Chúa ở độ cao 1.487m với cây Cầu Vàng nổi tiếng thế giới nâng đỡ bởi hai bàn tay đá khổng lồ.',
  },
  {
    name: 'Bãi Biển Mỹ Khê',
    province: 'Da Nang',
    district: 'Sơn Trà',
    categories: ['Thiên nhiên', 'Nghỉ dưỡng', 'Check-in'],
    priceEstimate: 0,
    latitude: 16.0594,
    longitude: 108.2464,
    popularityScore: 96,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Một trong sáu bãi biển quyến rũ nhất hành tinh do tạp chí Forbes bình chọn, với bãi cát trắng mịn màng, sóng biển êm dịu và làn nước trong xanh.',
  },
  {
    name: 'Bán Đảo Sơn Trà & Chùa Linh Ứng',
    province: 'Da Nang',
    district: 'Sơn Trà',
    categories: ['Tâm linh', 'Thiên nhiên', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 16.1005,
    longitude: 108.2779,
    popularityScore: 95,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Lá phổi xanh của Đà Nẵng với tượng Phật Quan Thế Âm cao 67m hướng ra biển Đông, nơi sinh sống của loài voọc chà vá chân nâu quý hiếm.',
  },
  {
    name: 'Danh Thắng Ngũ Hành Sơn',
    province: 'Da Nang',
    district: 'Ngũ Hành Sơn',
    categories: ['Tâm linh', 'Thiên nhiên', 'Lịch sử'],
    priceEstimate: 40000,
    latitude: 16.0044,
    longitude: 108.2633,
    popularityScore: 92,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Cao',
    description:
      'Quần thể 5 ngọn núi đá vôi mang tên Kim - Mộc - Thủy - Hỏa - Thổ với nhiều hang động huyền bí (Động Huyền Không, Động Âm Phủ) và cổ tự linh thiêng.',
  },
  {
    name: 'Cầu Sông Hàn',
    province: 'Da Nang',
    district: 'Hải Châu',
    categories: ['Văn hóa', 'Lịch sử', 'Check-in'],
    priceEstimate: 0,
    latitude: 16.0722,
    longitude: 108.2244,
    popularityScore: 90,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Cây cầu quay đầu tiên tại Việt Nam do chính các kỹ sư và công nhân Việt Nam thiết kế thi công, có thể quay 90 độ phục vụ tàu bè qua lại giữa đêm.',
  },
  {
    name: 'Bảo Tàng Điêu Khắc Chăm Đà Nẵng',
    province: 'Da Nang',
    district: 'Hải Châu',
    categories: ['Lịch sử', 'Văn hóa'],
    priceEstimate: 60000,
    latitude: 16.0601,
    longitude: 108.2227,
    popularityScore: 88,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Thấp',
    description:
      'Bảo tàng lưu giữ bộ sưu tập hiện vật điêu khắc nghệ thuật tôn giáo Champa lớn nhất thế giới, thành lập từ thời Pháp thuộc năm 1915.',
  },
  {
    name: 'Chợ Cồn Đà Nẵng',
    province: 'Da Nang',
    district: 'Hải Châu',
    categories: ['Ẩm thực', 'Văn hóa', 'Khám phá'],
    priceEstimate: 0,
    latitude: 16.0694,
    longitude: 108.215,
    popularityScore: 91,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Trung bình',
    description:
      'Thiên đường ẩm thực miền Trung sầm uất bậc nhất Đà Nẵng với hàng trăm món ngon nức tiếng như mì Quảng, bánh tráng cuốn thịt heo, bún mắm nêm, chè sầu.',
  },
  {
    name: 'Đèo Hải Vân (Thiên Hạ Đệ Nhất Hùng Quan)',
    province: 'Da Nang',
    district: 'Liên Chiểu',
    categories: ['Thiên nhiên', 'Khám phá', 'Check-in'],
    priceEstimate: 0,
    latitude: 16.1911,
    longitude: 108.1311,
    popularityScore: 93,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Cung đèo ven biển hiểm trở và hùng vĩ bậc nhất Việt Nam nối liền Đà Nẵng và Huế, cung cấp góc nhìn toàn cảnh vịnh Lăng Cô và bán đảo Sơn Trà tuyệt mỹ.',
  },
  {
    name: 'Công Viên Châu Á - Asia Park Đà Nẵng',
    province: 'Da Nang',
    district: 'Hải Châu',
    categories: ['Giải trí', 'Check-in', 'Khám phá'],
    priceEstimate: 150000,
    latitude: 16.0354,
    longitude: 108.2267,
    popularityScore: 87,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Tổ hợp vui chơi giải trí ngoài trời nổi tiếng với vòng quay Mặt trời Sun Wheel nằm trong top 10 vòng quay cao nhất thế giới và các trò chơi cảm giác mạnh.',
  },

  // ==========================================
  // 2. QUẢNG NAM / HỘI AN (Quang Nam) - 10 Địa điểm
  // ==========================================
  {
    name: 'Phố Cổ Hội An',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Văn hóa', 'Lịch sử', 'Check-in', 'Ẩm thực'],
    priceEstimate: 120000,
    latitude: 15.8801,
    longitude: 108.3262,
    popularityScore: 99,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Đô thị cổ thương cảng truyền thống Đông Nam Á được bảo tồn gần như nguyên vẹn từ thế kỷ 16-17, Di sản Văn hóa Thế giới UNESCO với nhà cổ mái ngói rêu phong.',
  },
  {
    name: 'Chùa Cầu Hội An (Lai Viễn Kiều)',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Lịch sử', 'Văn hóa', 'Check-in'],
    priceEstimate: 0,
    latitude: 15.8771,
    longitude: 108.3258,
    popularityScore: 98,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Thấp',
    description:
      'Cây cầu ngói cổ kính do các thương gia Nhật Bản xây dựng vào đầu thế kỷ 17 vắt qua lạch nước nhỏ, biểu tượng di sản lịch sử vô giá in trên tờ tiền polymer 20.000đ.',
  },
  {
    name: 'Rừng Dừa Bảy Mẫu Cẩm Thanh',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Thiên nhiên', 'Khám phá', 'Giải trí'],
    priceEstimate: 150000,
    latitude: 15.8722,
    longitude: 108.3694,
    popularityScore: 94,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Trải nghiệm chèo thuyền thúng len lỏi giữa rừng dừa nước bạt ngàn tựa miền Tây Nam Bộ, thưởng thức màn múa thúng xoay tít điệu nghệ và câu cua dân dã.',
  },
  {
    name: 'Thánh Địa Mỹ Sơn',
    province: 'Quang Nam',
    district: 'Duy Xuyên',
    categories: ['Lịch sử', 'Văn hóa', 'Tâm linh'],
    priceEstimate: 150000,
    latitude: 15.7644,
    longitude: 108.1244,
    popularityScore: 93,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Quần thể di tích đền đài Ấn Độ giáo của vương quốc Champa cổ đại ẩn mình trong thung lũng khép kín, Di sản Thế giới UNESCO chứa đựng kỹ thuật xây gạch kỳ bí.',
  },
  {
    name: 'Làng Gốm Thanh Hà',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Văn hóa', 'Lịch sử', 'Khám phá'],
    priceEstimate: 35000,
    latitude: 15.8803,
    longitude: 108.3039,
    popularityScore: 87,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Làng nghề gốm đất nung truyền thống hơn 500 năm tuổi ven sông Thu Bồn, nơi du khách được nghệ nhân hướng dẫn tự tay vuốt nặn các món đồ gốm lưu niệm mộc mạc.',
  },
  {
    name: 'Làng Rau Trà Quế',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Thiên nhiên', 'Văn hóa', 'Ẩm thực'],
    priceEstimate: 20000,
    latitude: 15.9067,
    longitude: 108.3378,
    popularityScore: 86,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Làng nông nghiệp xanh nổi tiếng với các loại rau thơm gia vị hữu cơ chăm bón bằng rong vớt từ đầm Trà Quế, mang đến không gian đồng quê an yên dịu mát.',
  },
  {
    name: 'Bãi Biển An Bàng',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Thiên nhiên', 'Nghỉ dưỡng', 'Check-in'],
    priceEstimate: 0,
    latitude: 15.9122,
    longitude: 108.3417,
    popularityScore: 91,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Bãi biển bình yên lọt top 50 bãi biển đẹp nhất thế giới do CNN bình chọn, nơi có nhiều quán cafe bar ven biển phong cách bohemian cực chill đón gió biển.',
  },
  {
    name: 'Đảo Cù Lao Chàm',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Thiên nhiên', 'Khám phá', 'Nghỉ dưỡng'],
    priceEstimate: 450000,
    latitude: 15.9619,
    longitude: 108.5117,
    popularityScore: 92,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Khu dự trữ sinh quyển thế giới gồm 8 hòn đảo hoang sơ với biển xanh màu ngọc bích, rạn san hô nguyên sinh quý giá và bãi biển cát trắng tinh khôi.',
  },
  {
    name: 'Nhà Cổ Tấn Ký',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Lịch sử', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 15.8778,
    longitude: 108.3283,
    popularityScore: 89,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Thấp',
    description:
      'Ngôi nhà cổ trên 200 năm tuổi kết hợp tinh tế giữa kiến trúc 3 nền văn hóa Việt - Nhật - Hoa, bảo tồn nguyên vẹn nội thất gỗ quý và nhiều cổ vật quý hiếm.',
  },
  {
    name: 'Chợ Đêm Hội An',
    province: 'Quang Nam',
    district: 'TP. Hội An',
    categories: ['Ẩm thực', 'Check-in', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 15.8767,
    longitude: 108.3242,
    popularityScore: 95,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Khu chợ đêm rực rỡ sắc màu bên bờ sông Hoài với hàng ngàn đèn lồng lung linh, ẩm thực đường phố cao lầu, mì Quảng, chè bắp và đồ thủ công tinh xảo.',
  },

  // ==========================================
  // 3. THỪA THIÊN HUẾ (Thua Thien Hue) - 10 Địa điểm
  // ==========================================
  {
    name: 'Đại Nội Huế (Hoàng Thành & Tử Cấm Thành)',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Lịch sử', 'Văn hóa', 'Check-in'],
    priceEstimate: 200000,
    latitude: 16.4697,
    longitude: 107.5786,
    popularityScore: 99,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Trung tâm quyền lực triều Nguyễn - triều đại phong kiến cuối cùng của Việt Nam, Di sản Văn hóa Thế giới UNESCO với Ngọ Môn, Điện Thái Hòa và Cung Diên Thọ nguy nga.',
  },
  {
    name: 'Chùa Thiên Mụ (Linh Mụ Tự)',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Tâm linh', 'Lịch sử', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 16.4528,
    longitude: 107.545,
    popularityScore: 97,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Ngôi cổ tự hơn 400 năm tuổi gắn liền với tháp Phước Duyên 7 tầng hình bát giác soi bóng bên dòng sông Hương thơ mộng, biểu tượng tâm linh xứ Huế.',
  },
  {
    name: 'Lăng Khải Định (Ứng Lăng)',
    province: 'Thua Thien Hue',
    district: 'Hương Thủy',
    categories: ['Lịch sử', 'Văn hóa', 'Check-in'],
    priceEstimate: 150000,
    latitude: 16.3989,
    longitude: 107.5906,
    popularityScore: 96,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Kiệt tác kiến trúc lăng tẩm giao thoa văn hóa Đông - Tây với nghệ thuật cẩn ghép sành sứ và thủy tinh tinh xảo tuyệt mỹ trên sườn núi Châu Chữ.',
  },
  {
    name: 'Lăng Tự Đức (Khiêm Lăng)',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Lịch sử', 'Văn hóa', 'Thiên nhiên'],
    priceEstimate: 150000,
    latitude: 16.4328,
    longitude: 107.5658,
    popularityScore: 94,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Khu lăng tẩm mang phong cách thi vị, hữu tình bậc nhất với hồ Lưu Khiêm, nhà tạ ngắm hoa ngâm vịnh thơ ca giữa rừng thông xanh ngát và hồ sen thơm mát.',
  },
  {
    name: 'Lăng Minh Mạng (Hiếu Lăng)',
    province: 'Thua Thien Hue',
    district: 'Hương Trà',
    categories: ['Lịch sử', 'Văn hóa', 'Tâm linh'],
    priceEstimate: 150000,
    latitude: 16.3889,
    longitude: 107.5714,
    popularityScore: 93,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Quần thể kiến trúc đăng đối nghiêm ngặt trên một trục thần đạo uy nghiêm nằm giữa hồ Trừng Minh và rừng thông trầm mặc thâm nghiêm.',
  },
  {
    name: 'Cầu Tràng Tiền & Sông Hương',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Văn hóa', 'Check-in', 'Lịch sử'],
    priceEstimate: 0,
    latitude: 16.4686,
    longitude: 107.5936,
    popularityScore: 95,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Cây cầu thép 6 vài 12 nhịp bắc qua sông Hương thơ mộng do hãng Eiffel thiết kế, lung linh sắc màu ánh đèn mỗi khi màn đêm buông xuống cố đô.',
  },
  {
    name: 'Chợ Đông Ba Huế',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Ẩm thực', 'Văn hóa', 'Khám phá'],
    priceEstimate: 0,
    latitude: 16.4719,
    longitude: 107.5878,
    popularityScore: 92,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Trung bình',
    description:
      'Ngôi chợ truyền thống lâu đời nhất cố đô, nơi quy tụ bún bò Huế chuẩn vị, bánh bèo, nậm, lọc và đặc sản kẹo mè xửng, nón bài thơ trứ danh.',
  },
  {
    name: 'Đồi Vọng Cảnh Huế',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Thiên nhiên', 'Check-in', 'Nghỉ dưỡng'],
    priceEstimate: 0,
    latitude: 16.4344,
    longitude: 107.5511,
    popularityScore: 90,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Điểm ngắm khúc uốn sông Hương đẹp nhất xứ Huế được bao bọc bởi đồi thông lãng mạn, nơi các vua chúa xưa thường đến ngắm cảnh hoàng hôn buông lơi.',
  },
  {
    name: 'Trường Quốc Học Huế',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Lịch sử', 'Văn hóa', 'Check-in'],
    priceEstimate: 0,
    latitude: 16.4611,
    longitude: 107.5886,
    popularityScore: 91,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Ngôi trường trung học cổ kính hơn 120 năm tuổi với tường gạch đỏ au đặc trưng kiến trúc Pháp cổ và hàng cây râm mát soi bóng bờ nam sông Hương.',
  },
  {
    name: 'Làng Hương Thủy Xuân',
    province: 'Thua Thien Hue',
    district: 'TP. Huế',
    categories: ['Văn hóa', 'Check-in', 'Khám phá'],
    priceEstimate: 0,
    latitude: 16.4397,
    longitude: 107.5614,
    popularityScore: 93,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Làng nghề làm hương trầm truyền thống rực rỡ sắc màu với những bó chân hương bung xòe như những đóa hoa khổng lồ, điểm check-in đậm chất hoài niệm.',
  },

  // ==========================================
  // 4. KHÁNH HÒA / NHA TRANG (Khanh Hoa) - 10 Địa điểm
  // ==========================================
  {
    name: 'VinWonders Nha Trang (Hòn Tre)',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Giải trí', 'Check-in', 'Nghỉ dưỡng'],
    priceEstimate: 800000,
    latitude: 12.2189,
    longitude: 109.2433,
    popularityScore: 99,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Cao',
    description:
      'Công viên giải trí của những kỷ lục trên đảo Hòn Tre với vịnh phao nổi khổng lồ, cáp treo vượt biển và hàng trăm trò chơi mạo hiểm đỉnh cao hàng đầu thế giới.',
  },
  {
    name: 'Tháp Bà Ponagar Nha Trang',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Lịch sử', 'Văn hóa', 'Tâm linh'],
    priceEstimate: 30000,
    latitude: 12.2653,
    longitude: 109.1958,
    popularityScore: 96,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Quần thể đền tháp Chăm Pa cổ xây dựng từ thế kỷ 8 đến thế kỷ 13 thờ nữ thần Mẹ Xứ Sở Yan Po Nagar trên đồi Cù Lao nhìn ra dòng sông Cái trong xanh.',
  },
  {
    name: 'Viện Hải Dương Học Nha Trang',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Khám phá', 'Văn hóa', 'Thiên nhiên'],
    priceEstimate: 40000,
    latitude: 12.2072,
    longitude: 109.2158,
    popularityScore: 94,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Cơ sở nghiên cứu biển lớn nhất Đông Dương thành lập năm 1922 với thủy cung sinh động và bộ xương cá voi lưng gù khổng lồ dài 26m được bảo tồn nguyên vẹn.',
  },
  {
    name: 'Bãi Biển Trần Phú Nha Trang',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Thiên nhiên', 'Nghỉ dưỡng', 'Check-in'],
    priceEstimate: 0,
    latitude: 12.2388,
    longitude: 109.1967,
    popularityScore: 95,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Cung đường biển uốn cong tuyệt đẹp ôm trọn vịnh Nha Trang với hàng dừa xanh ngút ngàn, công viên ven biển và bờ cát vàng rực rỡ cùng làn nước biển xanh trong vắt.',
  },
  {
    name: 'Chùa Long Sơn (Chùa Phật Trắng)',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Tâm linh', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 12.2508,
    longitude: 109.1803,
    popularityScore: 91,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Ngôi chùa cổ kính hơn trăm năm tuổi nổi tiếng với bức tượng Phật Kim Thân Phật Tổ màu trắng cao 24m tọa lạc uy nghiêm trên đỉnh đồi Trại Thủy.',
  },
  {
    name: 'Nhà Thờ Núi Nha Trang (Nhà Thờ Đá)',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Văn hóa', 'Lịch sử', 'Check-in'],
    priceEstimate: 0,
    latitude: 12.2472,
    longitude: 109.1894,
    popularityScore: 92,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Thấp',
    description:
      'Kiệt tác kiến trúc Gothic Pháp cổ điển xây dựng từ năm 1928 trên mỏm núi Bông với tháp chuông cao vút và cửa kính màu hoa văn lung linh tuyệt mỹ.',
  },
  {
    name: 'Đảo Hòn Mun Nha Trang',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Thiên nhiên', 'Khám phá', 'Nghỉ dưỡng'],
    priceEstimate: 250000,
    latitude: 12.1694,
    longitude: 109.3039,
    popularityScore: 93,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Khu bảo tồn biển đầu tiên của Việt Nam với các vách đá đen tuyền như gỗ mun và hệ sinh thái rạn san hô phong phú bậc nhất Đông Nam Á thích hợp lặn ngắm san hô.',
  },
  {
    name: 'Hòn Chồng - Hòn Vợ Nha Trang',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Thiên nhiên', 'Check-in', 'Văn hóa'],
    priceEstimate: 30000,
    latitude: 12.2725,
    longitude: 109.2056,
    popularityScore: 89,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Quần thể khối đá tự nhiên kỳ thú xếp chồng lên nhau ven bờ biển, gắn liền với vết lõm bàn tay khổng lồ kỳ bí và truyền thuyết tình yêu thủy chung son sắt.',
  },
  {
    name: 'Khu Du Lịch Suối Khoáng Nóng I-Resort',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Nghỉ dưỡng', 'Giải trí'],
    priceEstimate: 250000,
    latitude: 12.2858,
    longitude: 109.1672,
    popularityScore: 90,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Thiên đường nghỉ dưỡng tắm bùn khoáng nóng thiên nhiên đẳng cấp giữa không gian làng quê mộc mạc lợp mái lá sen thanh bình giúp phục hồi sức khỏe.',
  },
  {
    name: 'Chợ Đầm Nha Trang',
    province: 'Khanh Hoa',
    district: 'TP. Nha Trang',
    categories: ['Ẩm thực', 'Mua sắm', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 12.2547,
    longitude: 109.1928,
    popularityScore: 88,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Trung bình',
    description:
      'Chợ trung tâm kiến trúc hình hoa sen độc đáo, nơi buôn bán hải sản khô mực, yến sào Khánh Hòa, nem nướng và quà lưu niệm nổi tiếng xứ trầm biển yến.',
  },

  // ==========================================
  // 5. KIÊN GIANG / PHÚ QUỐC (Kien Giang) - 10 Địa điểm
  // ==========================================
  {
    name: 'Grand World Phú Quốc (Thành Phố Không Ngủ)',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Giải trí', 'Check-in', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 10.3297,
    longitude: 103.8617,
    popularityScore: 98,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Trung tâm giải trí sầm uất 24/7 với dòng kênh Venice lãng mạn, bảo tàng Gấu Teddy, công trình Huyền thoại Tre khổng lồ và show diễn thực cảnh hoành tráng.',
  },
  {
    name: 'VinWonders & Vinpearl Safari Phú Quốc',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Giải trí', 'Thiên nhiên', 'Khám phá'],
    priceEstimate: 650000,
    latitude: 10.3347,
    longitude: 103.8569,
    popularityScore: 99,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Cao',
    description:
      'Công viên chăm sóc và bảo tồn động vật bán hoang dã đầu tiên tại Việt Nam và công viên chủ đề quy mô hàng đầu châu Á với thủy cung hình rùa khổng lồ.',
  },
  {
    name: 'Cáp Treo Hòn Thơm Sun World',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Giải trí', 'Check-in', 'Thiên nhiên'],
    priceEstimate: 650000,
    latitude: 10.0275,
    longitude: 104.0092,
    popularityScore: 97,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Tuyến cáp treo ba dây vượt biển dài nhất thế giới (7.899m) đưa du khách chiêm ngưỡng toàn cảnh quần đảo An Thới xanh màu ngọc bích từ độ cao choáng ngợp.',
  },
  {
    name: 'Bãi Sao Phú Quốc',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Thiên nhiên', 'Nghỉ dưỡng', 'Check-in'],
    priceEstimate: 0,
    latitude: 10.0528,
    longitude: 104.0333,
    popularityScore: 96,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Bãi biển cát trắng mịn màng như kem dài hơn 7km ôm trọn làn nước biển trong vắt không chút gợn sóng, hàng dừa nghiêng bóng nên thơ bậc nhất đảo ngọc.',
  },
  {
    name: 'Cầu Hôn (Kiss Bridge) Sunset Town',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Check-in', 'Văn hóa', 'Nghỉ dưỡng'],
    priceEstimate: 100000,
    latitude: 10.0319,
    longitude: 104.0117,
    popularityScore: 95,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Công trình kiến trúc điêu khắc trên biển lừng danh tại thị trấn Hoàng Hôn, nơi hai đầu cầu chạm mặt ở khoảng cách 30cm đón hoàng hôn kỳ ảo.',
  },
  {
    name: 'Chợ Đêm Phú Quốc',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Ẩm thực', 'Mua sắm', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 10.2189,
    longitude: 103.9592,
    popularityScore: 94,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Trung tâm ẩm thực hải sản đêm tại phường Dương Đông với tôm hùm, nhum nướng mỡ hành, ghẹ Hàm Ninh tươi rói và kẹo chỉ ngọt ngào.',
  },
  {
    name: 'Dinh Cậu Phú Quốc',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Tâm linh', 'Văn hóa', 'Lịch sử'],
    priceEstimate: 0,
    latitude: 10.2167,
    longitude: 103.9556,
    popularityScore: 92,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Miếu thờ linh thiêng tọa lạc trên mỏm đá nhô ra biển đón sóng, nơi ngư dân đảo ngọc cầu mong mưa thuận gió hòa trước mỗi chuyến ra khơi.',
  },
  {
    name: 'Di Tích Lịch Sử Nhà Tù Phú Quốc',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Lịch sử', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 10.0439,
    longitude: 104.0189,
    popularityScore: 93,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Di tích lịch sử quốc gia đặc biệt minh chứng cho ý chí kiên cường bất khuất của các chiến sĩ cách mạng trước những đòn tra tấn dã man trong chiến tranh.',
  },
  {
    name: 'Làng Chài Hàm Ninh',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Ẩm thực', 'Văn hóa', 'Thiên nhiên'],
    priceEstimate: 0,
    latitude: 10.1806,
    longitude: 104.0489,
    popularityScore: 90,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Làng chài cổ kính dưới chân núi Hàm Ninh nổi tiếng với đặc sản ghẹ thịt chắc ngọt thơm ngon và cảnh bình minh rực rỡ tráng lệ trên biển cả.',
  },
  {
    name: 'Suối Tranh Phú Quốc',
    province: 'Kien Giang',
    district: 'TP. Phú Quốc',
    categories: ['Thiên nhiên', 'Khám phá'],
    priceEstimate: 30000,
    latitude: 10.1983,
    longitude: 104.0206,
    popularityScore: 88,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Con suối róc rách uốn lượn giữa cánh rừng nguyên sinh xanh mát với những ghềnh đá trắng và hồ nước tự nhiên mát lạnh sảng khoái.',
  },

  // ==========================================
  // 6. QUẢNG NINH / HẠ LONG (Quang Ninh) - 10 Địa điểm
  // ==========================================
  {
    name: 'Vịnh Hạ Long (Kỳ Quan Thiên Nhiên Thế Giới UNESCO)',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Thiên nhiên', 'Nghỉ dưỡng', 'Check-in'],
    priceEstimate: 290000,
    latitude: 20.9101,
    longitude: 107.1839,
    popularityScore: 100,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Kỳ quan thiên nhiên thế giới với gần 2.000 hòn đảo đá vôi kỳ vĩ nổi trên mặt biển xanh ngọc lục bảo trải qua hàng triệu năm kiến tạo địa chất.',
  },
  {
    name: 'Sun World Hạ Long Complex',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Giải trí', 'Check-in'],
    priceEstimate: 350000,
    latitude: 20.9547,
    longitude: 107.0544,
    popularityScore: 97,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Cao',
    description:
      'Tổ hợp công viên giải trí quy mô ven biển Bãi Cháy kết nối bằng Cáp treo Nữ Hoàng đạt 2 kỷ lục Guinness thế giới và vòng quay Mặt Trời Sun Wheel ngắm vịnh.',
  },
  {
    name: 'Bảo Tàng Quảng Ninh',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Văn hóa', 'Lịch sử', 'Check-in'],
    priceEstimate: 40000,
    latitude: 20.9506,
    longitude: 107.0983,
    popularityScore: 98,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Thấp',
    description:
      'Tòa nhà kiến trúc kính đen huyền bí tựa như viên ngọc trai đen bên bờ vịnh Bái Tử Long, lưu giữ lịch sử ngành than và văn hóa vùng mỏ kiên cường.',
  },
  {
    name: 'Đảo Ti Tốp Vịnh Hạ Long',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Thiên nhiên', 'Check-in', 'Nghỉ dưỡng'],
    priceEstimate: 0,
    latitude: 20.8594,
    longitude: 107.0811,
    popularityScore: 94,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Hòn đảo hình vầng trăng khuyết với bãi tắm cát trắng thoai thoải và đài quan sát trên đỉnh núi ngắm trọn góc nhìn 360 độ vịnh kỳ quan từ trên cao.',
  },
  {
    name: 'Hang Sửng Sốt Vịnh Hạ Long',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Thiên nhiên', 'Khám phá'],
    priceEstimate: 0,
    latitude: 20.8456,
    longitude: 107.0911,
    popularityScore: 95,
    indoorOutdoor: 'Trong nhà',
    activityLevel: 'Trung bình',
    description:
      'Hang động rộng lớn và lộng lẫy bậc nhất vịnh Hạ Long với hàng triệu thạch nhũ lung linh huyền ảo biến hóa muôn hình vạn trạng khiến du khách sững sờ.',
  },
  {
    name: 'Khu Danh Thắng Tâm Linh Yên Tử',
    province: 'Quang Ninh',
    district: 'TP. Uông Bí',
    categories: ['Tâm linh', 'Lịch sử', 'Thiên nhiên'],
    priceEstimate: 40000,
    latitude: 21.1578,
    longitude: 106.7189,
    popularityScore: 96,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Cái nôi của Phật giáo Thiền phái Trúc Lâm do Phật hoàng Trần Nhân Tông sáng lập trên đỉnh núi mây phủ cao 1.068m với Chùa Đồng đúc bằng đồng nguyên chất.',
  },
  {
    name: 'Bãi Biển Bãi Cháy',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Thiên nhiên', 'Giải trí', 'Nghỉ dưỡng'],
    priceEstimate: 0,
    latitude: 20.9542,
    longitude: 107.0456,
    popularityScore: 91,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Bãi biển nhân tạo hiện đại trải dài hơn 4km với làn nước trong xanh, rặng phi lao xanh mướt và phố đi bộ ẩm thực sôi động rực rỡ ánh đèn về đêm.',
  },
  {
    name: 'Bán Đảo Tuần Châu',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Nghỉ dưỡng', 'Giải trí', 'Check-in'],
    priceEstimate: 0,
    latitude: 20.9328,
    longitude: 106.9856,
    popularityScore: 90,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Hòn đảo du lịch sầm uất với bến cảng du thuyền nhân tạo lớn nhất Việt Nam, sân golf đẳng cấp và công viên biểu diễn cá heo hiện đại.',
  },
  {
    name: 'Chùa Ba Vàng (Bảo Quang Tự)',
    province: 'Quang Ninh',
    district: 'TP. Uông Bí',
    categories: ['Tâm linh', 'Văn hóa'],
    priceEstimate: 0,
    latitude: 21.0856,
    longitude: 106.7725,
    popularityScore: 89,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Ngôi chùa tọa lạc trên núi Thành Đẳng với tòa chính điện trên núi lớn nhất Đông Dương, kiến trúc tráng lệ giữa non nước thanh tịnh trang nghiêm.',
  },
  {
    name: 'Chợ Đêm Hạ Long (Bazaar)',
    province: 'Quang Ninh',
    district: 'TP. Hạ Long',
    categories: ['Ẩm thực', 'Mua sắm'],
    priceEstimate: 0,
    latitude: 20.9572,
    longitude: 107.0389,
    popularityScore: 92,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Khu chợ đêm sầm uất quy tụ hàng trăm quầy hàng đặc sản chả mực giã tay nóng hổi, đồ mỹ nghệ ngọc trai và quà lưu niệm vùng biển Đông Bắc.',
  },

  // ==========================================
  // 7. LÀO CAI / SA PA (Lao Cai) - 10 Địa điểm
  // ==========================================
  {
    name: 'Đỉnh Fansipan (Nóc Nhà Đông Dương)',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Thiên nhiên', 'Check-in', 'Tâm linh', 'Khám phá'],
    priceEstimate: 850000,
    latitude: 22.3033,
    longitude: 103.7753,
    popularityScore: 100,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Đỉnh núi cao nhất bán đảo Đông Dương (3.143m) với quần thể công trình tâm linh sừng sững giữa biển mây bồng bềnh và hệ thống cáp treo Sun World kỷ lục.',
  },
  {
    name: 'Bản Cát Cát Sa Pa',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Văn hóa', 'Check-in', 'Khám phá'],
    priceEstimate: 150000,
    latitude: 22.3278,
    longitude: 103.8344,
    popularityScore: 97,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Bản làng cổ của người H Mông bên dòng thác Tiên Sa với những guồng nước khổng lồ, nghề dệt thổ cẩm truyền thống và cầu gỗ lãng mạn nên thơ.',
  },
  {
    name: 'Nhà Thờ Đá Sa Pa',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Lịch sử', 'Văn hóa', 'Check-in'],
    priceEstimate: 0,
    latitude: 22.3353,
    longitude: 103.8417,
    popularityScore: 95,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Dấu ấn kiến trúc Gothic La Mã toàn vẹn nhất của người Pháp xây dựng từ năm 1935 tọa lạc ngay trung tâm quảng trường thị xã Sa Pa sương mù.',
  },
  {
    name: 'Khu Du Lịch Núi Hàm Rồng',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Thiên nhiên', 'Check-in', 'Khám phá'],
    priceEstimate: 70000,
    latitude: 22.3339,
    longitude: 103.8456,
    popularityScore: 92,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Khu vườn hoa ôn đới rực rỡ với vườn lan, vườn đào và Sân Mây trên đỉnh Hàm Rồng ngắm trọn toàn cảnh thung lũng Sa Pa thơ mộng chìm trong mây phủ.',
  },
  {
    name: 'Thung Lũng Mường Hoa & Bãi Đá Cổ',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Thiên nhiên', 'Văn hóa', 'Lịch sử'],
    priceEstimate: 80000,
    latitude: 22.3056,
    longitude: 103.8778,
    popularityScore: 94,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Kiệt tác ruộng bậc thang uốn lượn ngoạn mục qua dòng suối Hoa cùng bãi đá cổ khắc chạm hàng trăm hình vẽ bí ẩn của người tiền sử chưa có lời giải đáp.',
  },
  {
    name: 'Đèo Ô Quy Hồ & Cầu Kính Rồng Mây',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Thiên nhiên', 'Check-in', 'Khám phá'],
    priceEstimate: 400000,
    latitude: 22.3556,
    longitude: 103.7583,
    popularityScore: 96,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Một trong Tứ đại đỉnh đèo hùng vĩ bậc nhất miền Bắc với Cổng Trời lộng gió và cầu kính nhìn xuyên đáy vực sâu ngắm cảnh hoàng hôn huyền ảo trên mây.',
  },
  {
    name: 'Thác Bạc Sa Pa',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Thiên nhiên', 'Khám phá'],
    priceEstimate: 20000,
    latitude: 22.3619,
    longitude: 103.7806,
    popularityScore: 89,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Ngọn thác đổ từ độ cao hơn 200m bọt tung trắng xóa như dải lụa bạc giữa đại ngàn Hoàng Liên Sơn hoang sơ và kỳ vĩ bên quốc lộ 4D.',
  },
  {
    name: 'Bản Tả Phìn Sa Pa',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Văn hóa', 'Nghỉ dưỡng', 'Khám phá'],
    priceEstimate: 40000,
    latitude: 22.3833,
    longitude: 103.8833,
    popularityScore: 90,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Bản làng của đồng bào người Dao Đỏ nổi tiếng với trải nghiệm ngâm mình trong bồn tắm lá thuốc thảo mộc bí truyền và tu viện cổ rêu phong bí ẩn.',
  },
  {
    name: 'Chợ Đêm Sa Pa',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Ẩm thực', 'Văn hóa', 'Mua sắm'],
    priceEstimate: 0,
    latitude: 22.3361,
    longitude: 103.8444,
    popularityScore: 93,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Không gian ẩm thực đêm náo nhiệt ngập tràn khói thơm của thịt lợn cắp nách nướng, ngô khoai nướng, cá hồi, cá tầm và rượu ngô nồng ấm xứ lạnh.',
  },
  {
    name: 'Bản Lao Chải - Tả Van',
    province: 'Lao Cai',
    district: 'Thị xã Sa Pa',
    categories: ['Thiên nhiên', 'Khám phá', 'Nghỉ dưỡng'],
    priceEstimate: 75000,
    latitude: 22.3089,
    longitude: 103.8928,
    popularityScore: 91,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Cung đường trekking lý tưởng nhất Sa Pa men theo ruộng bậc thang vàng óng mùa lúa chín, nghỉ ngơi tại các homestay mộc mạc bản địa nhìn ra thung lũng.',
  },

  // ==========================================
  // 8. NINH BÌNH (Ninh Binh) - 10 Địa điểm
  // ==========================================
  {
    name: 'Quần Thể Danh Thắng Tràng An (UNESCO)',
    province: 'Ninh Binh',
    district: 'Hoa Lư',
    categories: ['Thiên nhiên', 'Văn hóa', 'Check-in'],
    priceEstimate: 250000,
    latitude: 20.2547,
    longitude: 105.9083,
    popularityScore: 100,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Di sản Văn hóa và Thiên nhiên Thế giới kép đầu tiên của Đông Nam Á với hành trình ngồi thuyền lướt qua các hang động thủy xuyên kỳ ảo giữa non xanh nước biếc.',
  },
  {
    name: 'Chùa Bái Đính (Quần Thể Tâm Linh Kỷ Lục)',
    province: 'Ninh Binh',
    district: 'Gia Viễn',
    categories: ['Tâm linh', 'Văn hóa', 'Lịch sử'],
    priceEstimate: 0,
    latitude: 20.2725,
    longitude: 105.8672,
    popularityScore: 98,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Trung bình',
    description:
      'Ngôi chùa xác lập hàng loạt kỷ lục châu Á và Việt Nam với tượng Phật Thích Ca bằng đồng lớn nhất, hành lang 500 vị La Hán đá xanh dài nhất khu vực.',
  },
  {
    name: 'Hang Múa & Đỉnh Ngọa Long',
    province: 'Ninh Binh',
    district: 'Hoa Lư',
    categories: ['Check-in', 'Thiên nhiên', 'Khám phá'],
    priceEstimate: 100000,
    latitude: 20.2319,
    longitude: 105.9417,
    popularityScore: 97,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Vạn Lý Trường Thành thu nhỏ của Việt Nam với 486 bậc thang đá dẫn lên đỉnh núi rồng uốn lượn ngắm trọn thung lũng Tam Cốc lúa vàng tuyệt mỹ.',
  },
  {
    name: 'Tam Cốc - Bích Động',
    province: 'Ninh Binh',
    district: 'Hoa Lư',
    categories: ['Thiên nhiên', 'Tâm linh', 'Văn hóa'],
    priceEstimate: 250000,
    latitude: 20.2189,
    longitude: 105.9367,
    popularityScore: 96,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Vịnh Hạ Long trên cạn với dòng sông Ngô Đồng uốn lượn qua ba hang đá tự nhiên và Chùa Bích Động mệnh danh Nam thiên đệ nhị động cổ kính rêu phong.',
  },
  {
    name: 'Cố Đô Hoa Lư',
    province: 'Ninh Binh',
    district: 'Hoa Lư',
    categories: ['Lịch sử', 'Văn hóa'],
    priceEstimate: 20000,
    latitude: 20.2839,
    longitude: 105.9039,
    popularityScore: 94,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Kinh đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam thế kỷ 10 thờ vua Đinh Tiên Hoàng và vua Lê Đại Hành giữa thế núi hiểm trở vững như bàn thạch.',
  },
  {
    name: 'Vườn Quốc Gia Cúc Phương',
    province: 'Ninh Binh',
    district: 'Nho Quan',
    categories: ['Thiên nhiên', 'Khám phá'],
    priceEstimate: 60000,
    latitude: 20.3167,
    longitude: 105.6083,
    popularityScore: 91,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Cao',
    description:
      'Vườn quốc gia đầu tiên của Việt Nam với hệ sinh thái rừng mưa nhiệt đới cổ sinh, cây chò ngàn năm tuổi và mùa bướm bay rợp trời tuyệt sắc vào đầu hè.',
  },
  {
    name: 'Đầm Vân Long (Khu Bảo Tồn Đất Ngập Nước)',
    province: 'Ninh Binh',
    district: 'Gia Viễn',
    categories: ['Thiên nhiên', 'Nghỉ dưỡng', 'Khám phá'],
    priceEstimate: 100000,
    latitude: 20.3639,
    longitude: 105.8694,
    popularityScore: 90,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Vùng đất ngập nước tự nhiên lớn nhất đồng bằng Bắc Bộ với mặt nước phẳng lặng như tấm gương khổng lồ soi bóng núi Mèo Cào và loài voọc mông trắng quý hiếm.',
  },
  {
    name: 'Tuyệt Tình Cốc (Động Am Tiên)',
    province: 'Ninh Binh',
    district: 'Hoa Lư',
    categories: ['Check-in', 'Lịch sử', 'Thiên nhiên'],
    priceEstimate: 50000,
    latitude: 20.2806,
    longitude: 105.9183,
    popularityScore: 92,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    description:
      'Thung lũng ngập nước trong vắt khép kín giữa bốn bề vách núi đá sừng sững, nơi thái hậu Dương Vân Nga từng tu hành những năm tháng cuối đời.',
  },
  {
    name: 'Nhà Thờ Đá Phát Diệm',
    province: 'Ninh Binh',
    district: 'Kim Sơn',
    categories: ['Văn hóa', 'Lịch sử', 'Tâm linh'],
    priceEstimate: 0,
    latitude: 20.0928,
    longitude: 106.0794,
    popularityScore: 93,
    indoorOutdoor: 'Cả hai',
    activityLevel: 'Thấp',
    description:
      'Quần thể thánh đường công giáo bằng đá và gỗ lim độc đáo bậc nhất thế giới mang đậm nét kiến trúc đình chùa mái cong truyền thống phương Đông.',
  },
  {
    name: 'Phố Cổ Hoa Lư Ninh Bình',
    province: 'Ninh Binh',
    district: 'TP. Ninh Bình',
    categories: ['Văn hóa', 'Ẩm thực', 'Check-in'],
    priceEstimate: 0,
    latitude: 20.2589,
    longitude: 105.975,
    popularityScore: 92,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Thấp',
    description:
      'Điểm hẹn văn hóa và ẩm thực đêm lung linh bên hồ Kỳ Lân tái hiện không gian cung đình xưa với hàng ngàn đèn lồng và các món dê núi đặc sản nức tiếng.',
  },
];

async function main() {
  console.log(`Starting to seed ${NEW_PLACES.length} authentic places across 8 provinces...`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const item of NEW_PLACES) {
    const existing = await prisma.place.findFirst({
      where: {
        name: item.name,
        province: item.province,
      },
    });

    if (existing) {
      skippedCount++;
      continue;
    }

    await prisma.place.create({
      data: {
        name: item.name,
        description: item.description,
        province: item.province,
        district: item.district || null,
        categories: item.categories,
        priceEstimate: item.priceEstimate,
        latitude: item.latitude,
        longitude: item.longitude,
        popularityScore: item.popularityScore,
        indoorOutdoor: item.indoorOutdoor,
        activityLevel: item.activityLevel,
        imageUrl: null,
      },
    });
    createdCount++;
  }

  console.log('--------------------------------------------------');
  console.log(`Seeding complete!`);
  console.log(`- Created: ${createdCount} places`);
  console.log(`- Skipped (already exist): ${skippedCount} places`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error seeding places:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
