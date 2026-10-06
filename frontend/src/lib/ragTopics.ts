export interface SuggestedQuestion {
  question: string;
  badge?: string;
}

export interface RagTopic {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string; // Tailwind gradient / border color class
  bgGradient: string;
  badge?: string;
  description: string;
  chunkCountEstimate: string;
  sampleQuestions: SuggestedQuestion[];
}

export const RAG_TOPICS: RagTopic[] = [
  {
    id: 'routes',
    name: 'Tuyến Cung Đường & Lộ Trình Liên Tỉnh',
    shortName: 'Tuyến liên tỉnh',
    icon: '🛣️',
    color: 'emerald',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    badge: 'Mới cập nhật',
    description: 'Lộ trình kết hợp nhiều tỉnh thành liền kề, tối ưu thời gian di chuyển, điểm dừng chân ngắm cảnh.',
    chunkCountEstimate: '40+ lộ trình',
    sampleQuestions: [
      {
        question: 'Lịch trình 4 ngày 3 đêm kết hợp Gia Lai (Pleiku) và Kon Tum (Măng Đen) đi thế nào thuận tiện nhất?',
        badge: 'Hot',
      },
      {
        question: 'Cung đường phượt Đông Bắc Hà Nội - Thái Nguyên - Ba Bể - Thác Bản Giốc nên đi theo lộ trình nào?',
      },
      {
        question: 'Từ Sa Pa sang Lai Châu qua đèo Ô Quy Hồ mất bao lâu và có những điểm dừng nào đẹp?',
      },
      {
        question: 'Lộ trình khám phá miền Tây từ TP.HCM về Đất Mũi Cà Mau 4 ngày 3 đêm đi ra sao?',
      },
      {
        question: 'Từ Đà Nẵng / Hội An kết hợp đi đảo Lý Sơn (Quảng Ngãi) như thế nào?',
      },
      {
        question: 'Lộ trình kết hợp Buôn Ma Thuột (Đắk Lắk) và Hồ Tà Đùng (Đắk Nông) 3 ngày 2 đêm?',
      },
    ],
  },
  {
    id: 'costs',
    name: 'Dự Toán Chi Phí & Bảng Giá Vé Thực Tế',
    shortName: 'Chi phí & Giá vé',
    icon: '💰',
    color: 'amber',
    bgGradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    badge: 'Mới cập nhật',
    description: 'Dự toán ngân sách du lịch tự túc theo ngày và bảng giá vé các khu vui chơi, cáp treo, danh lam thắng cảnh.',
    chunkCountEstimate: '40+ bảng giá',
    sampleQuestions: [
      {
        question: 'Chi phí đi du lịch tự túc Măng Đen 3 ngày 2 đêm khoảng bao nhiêu tiền một người?',
        badge: 'Phổ biến',
      },
      {
        question: 'Bảng giá vé cáp treo Fansipan (Sa Pa) và Sun World Ba Na Hills (Đà Nẵng) hiện tại là bao nhiêu?',
      },
      {
        question: 'Chi phí đi phượt đảo Phú Quý (Bình Thuận) tự túc 3 ngày 2 đêm gồm những khoản nào?',
      },
      {
        question: 'Giá vé thuyền tham quan danh thắng Tràng An Ninh Bình và giá vé Thác Bản Giốc?',
      },
      {
        question: 'Dự toán chi phí du lịch tự túc Côn Đảo 3 ngày 2 đêm từ TP.HCM hoặc Hà Nội?',
      },
      {
        question: 'Chi phí đi phượt săn mây Tà Xùa (Sơn La) 2 ngày 1 đêm từ Hà Nội?',
      },
    ],
  },
  {
    id: 'styles',
    name: 'Du Lịch Theo Phong Cách & Đối Tượng',
    shortName: 'Phong cách & Đối tượng',
    icon: '🎒',
    color: 'indigo',
    bgGradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    badge: 'Mới cập nhật',
    description: 'Gợi ý điểm đến và kinh nghiệm chuẩn bị riêng cho gia đình có trẻ nhỏ/người lớn tuổi, cặp đôi, trekking hay solo.',
    chunkCountEstimate: '40+ chủ đề',
    sampleQuestions: [
      {
        question: 'Gia đình có trẻ nhỏ và người lớn tuổi nên chọn điểm du lịch nào ở Việt Nam vừa an toàn vừa tiện nghi?',
        badge: 'Gia đình',
      },
      {
        question: 'Những điểm đến lãng mạn và yên bình nhất dành cho các cặp đôi đi trăng mật tại Việt Nam?',
        badge: 'Cặp đôi',
      },
      {
        question: 'Top các cung trekking leo núi Tây Bắc xếp theo độ khó từ cơ bản đến nâng cao?',
        badge: 'Trekking',
      },
      {
        question: 'Kinh nghiệm du lịch một mình (Solo Travel) bằng xe máy an toàn và tiết kiệm chi phí?',
        badge: 'Solo',
      },
      {
        question: 'Nhóm bạn trẻ yêu thích mạo hiểm nên chọn những trải nghiệm du lịch nào tại Việt Nam?',
      },
      {
        question: 'Nữ du khách đi phượt một mình cần lưu ý những nguyên tắc an toàn gì?',
      },
    ],
  },
  {
    id: 'stays',
    name: 'Cẩm Nang Lưu Trú, Nghỉ Dưỡng & Glamping',
    shortName: 'Lưu trú & Nghỉ dưỡng',
    icon: '🏡',
    color: 'teal',
    bgGradient: 'from-teal-500/10 via-cyan-500/5 to-transparent',
    badge: 'Mới cập nhật',
    description: 'Kinh nghiệm chọn homestay bản làng, khu tắm khoáng nóng Onsen, địa điểm Glamping và resort sinh thái.',
    chunkCountEstimate: '40+ cẩm nang',
    sampleQuestions: [
      {
        question: 'Kinh nghiệm ở homestay nhà sàn bản làng người Tày, người Thái vùng cao cần chú ý những gì?',
        badge: 'Homestay',
      },
      {
        question: 'Các khu nghỉ dưỡng tắm khoáng nóng Onsen phong cách Nhật Bản nổi tiếng nhất ở miền Bắc?',
        badge: 'Khoáng nóng',
      },
      {
        question: 'Những địa điểm cắm trại và Glamping có view đồi thông săn mây đẹp nhất ở Đà Lạt?',
        badge: 'Glamping',
      },
      {
        question: 'Trải nghiệm ngủ đêm trên du thuyền Vịnh Hạ Long và Lan Hạ có gì đặc sắc?',
      },
      {
        question: 'Homestay view ruộng bậc thang đẹp nhất ở Sa Pa, Y Tý và Mù Cang Chải?',
      },
      {
        question: 'Mô hình du lịch sinh thái nông nghiệp Farmstay ở miền Tây Nam Bộ có gì thú vị?',
      },
    ],
  },
  {
    id: 'tips',
    name: 'Mẹo Bản Địa, Kỹ Thuật Đèo Dốc & An Toàn',
    shortName: 'Mẹo bản địa & An toàn',
    icon: '💡',
    color: 'rose',
    bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    badge: 'Mới cập nhật',
    description: 'Kỹ thuật phanh hãm số đèo dốc, chống say tàu cao tốc, kiêng cữ văn hóa bản làng, chống vắt khi đi rừng.',
    chunkCountEstimate: '40+ mẹo phượt',
    sampleQuestions: [
      {
        question: 'Kỹ thuật lái xe máy và ô tô khi đổ đèo dốc quanh co ở Tây Bắc và Hà Giang để tránh cháy phanh?',
        badge: 'Cực quan trọng',
      },
      {
        question: 'Bí quyết chống say sóng khi đi tàu cao tốc ra đảo Phú Quý, Côn Đảo hoặc Lý Sơn?',
        badge: 'Biển đảo',
      },
      {
        question: 'Những điều kiêng cữ và quy tắc văn hóa cần tránh khi vào thăm bản làng người Mông, Dao, Thái?',
        badge: 'Văn hóa',
      },
      {
        question: 'Cách phòng chống và xử lý vắt cắn khi đi trekking trong rừng Cúc Phương, Cát Tiên hay Bù Gia Mập?',
      },
      {
        question: 'Kinh nghiệm xử lý khi xe bị thủng lốp hoặc hết xăng giữa đèo dốc vắng vẻ?',
      },
      {
        question: 'Cần chuẩn bị những loại thuốc men y tế cá nhân nào trong túi sơ cứu khi đi du lịch vùng cao?',
      },
    ],
  },
  {
    id: 'food',
    name: 'Ẩm Thực & Món Ngon Đặc Sản Vùng Miền',
    shortName: 'Ẩm thực & Món ngon',
    icon: '🍜',
    color: 'orange',
    bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    description: 'Khám phá tinh hoa ẩm thực 3 miền, các quán ăn gia truyền, món ăn đường phố và đặc sản mùa nước nổi.',
    chunkCountEstimate: '2.000+ chunks',
    sampleQuestions: [
      {
        question: 'Top những món ăn đường phố và quán ăn gia truyền không thể bỏ qua ở Hà Nội?',
      },
      {
        question: 'Đặc sản Tây Nguyên: Phở khô hai tô Gia Lai, gà nướng cơm lam và gỏi lá Kon Tum có gì đặc biệt?',
      },
      {
        question: 'Ẩm thực cố đô Huế: Bún bò, cơm hến và các loại bánh cung đình nên ăn ở đâu chuẩn vị nhất?',
      },
      {
        question: 'Những món ngon miền Tây mùa nước nổi: Lẩu cá linh bông điên điển, cá lóc nướng trui?',
      },
      {
        question: 'Các món ốc và hải sản ngon trứ danh tại Nha Trang, Phú Quốc và Quy Nhơn?',
      },
      {
        question: 'Bánh mì Sài Gòn, cơm tấm và hủ tiếu Nam Vang: Nét văn hóa ẩm thực đặc trưng phương Nam?',
      },
    ],
  },
  {
    id: 'heritage',
    name: 'Di Sản Lịch Sử, Văn Hóa & Tâm Linh',
    shortName: 'Di sản & Văn hóa',
    icon: '🏛️',
    color: 'violet',
    bgGradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    description: 'Các di sản văn hóa thế giới UNESCO, đền chùa cổ kính, lăng tẩm triều đình và công trình kiến trúc cổ.',
    chunkCountEstimate: '1.500+ chunks',
    sampleQuestions: [
      {
        question: 'Quần thể di tích Cố đô Huế có những lăng tẩm hoàng gia nào nổi bật và giá trị kiến trúc ra sao?',
      },
      {
        question: 'Nét kiến trúc độc đáo của Phố cổ Hội An và Thánh địa Mỹ Sơn (Quảng Nam)?',
      },
      {
        question: 'Quần thể danh thắng Tràng An và Cố đô Hoa Lư (Ninh Bình) có giá trị di sản kép như thế nào?',
      },
      {
        question: 'Kiến trúc chùa cổ miền Bắc: Chùa Dâu, Chùa Phật Tích (Bắc Ninh), Chùa Hương (Hà Nội)?',
      },
      {
        question: 'Nét độc đáo của các ngôi chùa Khmer Nam Bộ như Chùa Dơi (Sóc Trăng), Chùa Hang (Trà Vinh)?',
      },
      {
        question: 'Di tích Chiến trường Điện Biên Phủ và Đền Hùng Phú Thọ: Ý nghĩa lịch sử đối với dân tộc?',
      },
    ],
  },
  {
    id: 'nature',
    name: 'Danh Lam Thắng Cảnh & Kỳ Quan Thiên Nhiên',
    shortName: 'Kỳ quan thiên nhiên',
    icon: '🏔️',
    color: 'sky',
    bgGradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
    description: 'Hệ thống hang động thạch nhũ, thác nước kỳ vĩ, đệ nhất hùng đèo và các công viên địa chất toàn cầu.',
    chunkCountEstimate: '2.500+ chunks',
    sampleQuestions: [
      {
        question: 'Vịnh Hạ Long được UNESCO công nhận là di sản thế giới vì những giá trị địa chất và cảnh quan nào?',
      },
      {
        question: 'Vẻ đẹp kỳ vĩ của Thác Bản Giốc và Động Ngườm Ngao tại Cao Bằng?',
      },
      {
        question: 'Vườn quốc gia Phong Nha - Kẻ Bàng có những hang động thạch nhũ nào nổi tiếng nhất?',
      },
      {
        question: 'Tứ đại đỉnh đèo miền Bắc: Mã Pí Lèng, Ô Quy Hồ, Khau Phạ, Pha Đin có gì hấp dẫn phượt thủ?',
      },
      {
        question: 'Hồ Ba Bể (Bắc Kạn) và Hồ Tà Đùng (Đắk Nông) có đặc điểm sinh thái cảnh quan như thế nào?',
      },
      {
        question: 'Cao nguyên đá Đồng Văn (Hà Giang) - Công viên địa chất toàn cầu UNESCO có gì đặc sắc?',
      },
    ],
  },
  {
    id: 'islands',
    name: 'Biển Đảo, Vịnh Biển & Thể Thao Nước',
    shortName: 'Biển đảo & Vịnh biển',
    icon: '🏖️',
    color: 'cyan',
    bgGradient: 'from-cyan-500/10 via-teal-500/5 to-transparent',
    description: 'Các hòn đảo thiên đường nhiệt đới, bãi biển cát trắng, lặn ngắm san hô và chèo kayak vượt vịnh.',
    chunkCountEstimate: '1.800+ chunks',
    sampleQuestions: [
      {
        question: 'Top các hòn đảo hoang sơ, nước biển trong vắt đẹp nhất Việt Nam nên ghé thăm mùa hè?',
      },
      {
        question: 'Kinh nghiệm du lịch Phú Quốc: Đi cáp treo Hòn Thơm, lặn ngắm san hô Nam Đảo và ngắm hoàng hôn Sunset Sanato?',
      },
      {
        question: 'Thời điểm lý tưởng nhất trong năm để du lịch Côn Đảo và đảo Lý Sơn tránh bão gió?',
      },
      {
        question: 'Các bãi biển đẹp và hải sản tươi ngon nổi tiếng tại Quy Nhơn, Phú Yên và Nha Trang?',
      },
      {
        question: 'Trải nghiệm lặn biển ngắm rạn san hô tự nhiên tại Cù Lao Chàm (Quảng Nam) và Vịnh Vĩnh Hy (Ninh Thuận)?',
      },
      {
        question: 'Kinh nghiệm cắm trại qua đêm trên bãi biển đảo Cô Tô và đảo Quan Lạn (Quảng Ninh)?',
      },
    ],
  },
  {
    id: 'provinces',
    name: 'Cẩm Nang Toàn Diện 63 Tỉnh Thành',
    shortName: '63 Tỉnh thành',
    icon: '🗺️',
    color: 'emerald',
    bgGradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
    badge: '100% Phủ sóng',
    description: 'Kho thông tin du lịch hoàn chỉnh cho mọi tỉnh thành từ Hà Giang địa đầu đến Mũi Cà Mau cuối trời Nam.',
    chunkCountEstimate: '10.856 chunks',
    sampleQuestions: [
      {
        question: 'Du lịch Gia Lai có những danh lam thắng cảnh và đặc sản gì nổi tiếng?',
      },
      {
        question: 'Bắc Ninh có những di tích lịch sử và làn điệu dân ca nào nổi tiếng?',
      },
      {
        question: 'Cẩm nang du lịch Cà Mau: Điểm cực Nam Tổ quốc, rừng đước Đất Mũi và thưởng thức cua Năm Căn?',
      },
      {
        question: 'Đắk Nông có gì đẹp ngoài Hồ Tà Đùng và hệ thống hang động núi lửa Chư Blúk?',
      },
      {
        question: 'Kinh nghiệm du lịch Lai Châu: Bản Sin Suối Hồ, đèo Ô Quy Hồ và cao nguyên Sìn Hồ?',
      },
      {
        question: 'Khám phá Đồng Tháp Mười: Làng hoa Sa Đéc, Vườn quốc gia Tràm Chim mùa sếu đầu đỏ?',
      },
    ],
  },
];
