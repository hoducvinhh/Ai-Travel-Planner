export interface QAItem {
  id: string;
  province: string;
  title: string;
  question: string;
  answer: string;
}

export const ADVANCED_QA_PART1: QAItem[] = [
  // =========================================================================
  // CHỦ ĐỀ 1: TUYẾN CUNG ĐƯỜNG LIÊN TỈNH & LỘ TRÌNH KẾT HỢP (40 CÂU)
  // =========================================================================
  {
    id: 'qa_route_01',
    province: 'Tây Nguyên',
    title: 'Cung đường liên tỉnh: Pleiku (Gia Lai) - Măng Đen (Kon Tum) 4 ngày 3 đêm',
    question: 'Lịch trình 4 ngày 3 đêm kết hợp Gia Lai (Pleiku) và Kon Tum (Măng Đen) đi thế nào thuận tiện nhất?',
    answer: 'Ngày 1: Bay đến Pleiku, check-in Biển Hồ Tơ Nưng, hàng thông trăm tuổi, Biển Hồ Chè, tối ăn phở khô hai tô. Ngày 2: Sáng thăm Chùa Minh Thành, sau đó đi xe sang TP. Kon Tum (50km, 1 giờ) thăm Nhà thờ gỗ, Cầu treo Kon Klor, ăn gỏi lá Kon Tum; chiều lên Măng Đen (55km qua đèo Măng Đen), tối ăn lẩu xuyên tiêu. Ngày 3: Trọn ngày ở Măng Đen viếng Đức Mẹ Măng Đen, ngắm thác Pa Sỹ, hồ Đăk Ke, dạo đồi thông, ăn gà nướng cơm lam. Ngày 4: Săn mây sáng sớm Măng Đen, mua sâm Ngọc Linh rồi về sân bay Pleiku về lại Hà Nội/TP.HCM.'
  },
  {
    id: 'qa_route_02',
    province: 'Đông Bắc',
    title: 'Cung đường liên tỉnh: Hà Nội - Thái Nguyên - Bắc Kạn - Cao Bằng 4 ngày',
    question: 'Cung đường phượt Đông Bắc Hà Nội - Thái Nguyên - Ba Bể - Thác Bản Giốc nên đi theo lộ trình nào?',
    answer: 'Ngày 1: Hà Nội đi Thái Nguyên (thăm đồi chè Tân Cương), chạy tiếp lên hồ Ba Bể (Bắc Kạn), đi thuyền ngắm hồ, ngủ homestay người Tày. Ngày 2: Ba Bể vượt đèo Gió, đèo Khau Khang sang Cao Bằng, chiều thăm khu di tích Pác Bó, suối Lê-nin. Ngày 3: Cao Bằng đi đèo Mã Phục đến Thác Bản Giốc và Động Ngườm Ngao hoành tráng, tối về TP. Cao Bằng ăn bánh áp chao. Ngày 4: TP. Cao Bằng về Lạng Sơn (qua đèo Bông Lau) ghé chợ Đông Kinh, sau đó theo cao tốc Lạng Sơn - Hà Nội về lại thủ đô.'
  },
  {
    id: 'qa_route_03',
    province: 'Tây Bắc',
    title: 'Cung đường liên tỉnh: Sa Pa (Lào Cai) qua đèo Ô Quy Hồ sang Lai Châu',
    question: 'Từ Sa Pa sang Lai Châu qua đèo Ô Quy Hồ mất bao lâu và có những điểm dừng nào đẹp?',
    answer: 'Quãng đường từ thị xã Sa Pa sang TP. Lai Châu khoảng 70km theo quốc lộ 4D, chạy xe mất khoảng 1.5 - 2 giờ. Các điểm dừng ngoạn mục gồm: Thác Bạc, Thác Tình Yêu (Sa Pa), Cổng trời Ô Quy Hồ ngắm hoàng hôn biển mây, Cầu kính Rồng Mây (đỉnh đèo), thung lũng chè Tam Đường, bản du lịch Sin Suối Hồ và bản Sì Thâu Chải.'
  },
  {
    id: 'qa_route_04',
    province: 'Miền Tây',
    title: 'Cung đường liên tỉnh: TP.HCM - Cần Thơ - Sóc Trăng - Bạc Liêu - Cà Mau',
    question: 'Lộ trình khám phá miền Tây từ TP.HCM về Đất Mũi Cà Mau 4 ngày 3 đêm đi ra sao?',
    answer: 'Ngày 1: TP.HCM đi Cần Thơ (3 giờ cao tốc), dạo bến Ninh Kiều, chợ đêm. Ngày 2: Sáng đi chợ nổi Cái Răng, chạy quốc lộ 1A qua Sóc Trăng thăm Chùa Dơi, Chùa Chén Kiểu, trưa đến Bạc Liêu thăm Nhà Công tử Bạc Liêu, Cánh đồng điện gió, chiều tối về TP. Cà Mau. Ngày 3: TP. Cà Mau theo đường Hồ Chí Minh xuống Đất Mũi check-in Mốc tọa độ GPS 0001, Cột cờ Hà Nội, đi vỏ lãi xuyên rừng đước; chiều về lại TP. Cà Mau thưởng thức cua Năm Căn. Ngày 4: Sáng thăm rừng tràm U Minh Hạ, sau đó chạy xe về lại TP.HCM.'
  },
  {
    id: 'qa_route_05',
    province: 'Miền Trung',
    title: 'Cung đường liên tỉnh: Đà Nẵng - Hội An - Đảo Lý Sơn (Quảng Ngãi)',
    question: 'Từ Đà Nẵng / Hội An kết hợp đi đảo Lý Sơn (Quảng Ngãi) như thế nào?',
    answer: 'Từ Hội An/Đà Nẵng đi theo cao tốc Đà Nẵng - Quảng Ngãi hoặc quốc lộ 1A đến Cảng Sa Kỳ (khoảng 130km, mất 2.5 giờ). Tại cảng Sa Kỳ bắt tàu cao tốc (35 phút) ra Đảo Lớn Lý Sơn. Lịch trình lý tưởng là dành 2 ngày 1 đêm trên đảo Lý Sơn (thăm Hang Câu, Đỉnh Thới Lới, Cổng Tò Vò, cano sang Đảo Bé tắm biển lặn san hô), sau đó quay về đất liền tiếp tục nghỉ dưỡng tại Hội An và Đà Nẵng.'
  },
  {
    id: 'qa_route_06',
    province: 'Đông Nam Bộ & Tây Nguyên',
    title: 'Cung đường liên tỉnh: TP.HCM - Bình Phước - Đắk Nông (Hồ Tà Đùng)',
    question: 'Cung đường từ TP.HCM đi hồ Tà Đùng qua Bình Phước có gì trải nghiệm?',
    answer: 'Tuyến đường dài khoảng 250km: Từ TP.HCM đi Bình Dương, Bình Phước theo quốc lộ 13 và ĐT741 qua Đồng Xoài, Phước Long (ngắm núi Bà Rá, rừng cao su mùa thay lá). Tiếp tục theo quốc lộ 14 sang Gia Nghĩa (Đắk Nông), rẽ quốc lộ 28 đến Hồ Tà Đùng. Lịch trình 2 ngày 1 đêm hoặc 3 ngày 2 đêm rất thích hợp cho phượt thủ cắm trại ngắm "Vịnh Hạ Long Tây Nguyên" và săn mây.'
  },
  {
    id: 'qa_route_07',
    province: 'Tây Bắc',
    title: 'Cung đường liên tỉnh: Hà Nội - Mai Châu (Hòa Bình) - Mộc Châu (Sơn La) - Pù Luông (Thanh Hóa)',
    question: 'Cung đường tam giác Mai Châu - Mộc Châu - Pù Luông 3 ngày 2 đêm đi thế nào?',
    answer: 'Ngày 1: Hà Nội qua đèo Đá Trắng lên Mai Châu (Hòa Bình), đạp xe thăm bản Lác, bản Pom Coọng, trưa chạy tiếp lên cao nguyên Mộc Châu (Sơn La) thăm đồi chè trái tim, rừng thông Bản Áng. Ngày 2: Sáng ngắm thác Dải Yếm Mộc Châu, sau đó đi theo quốc lộ 6 quay lại ngã ba Co Lương rẽ quốc lộ 15 sang Khu bảo tồn Pù Luông (Thanh Hóa), chiều đi bè tre ngắm guồng nước sông Chàm, nghỉ resort/homestay bản Đôn. Ngày 3: Sáng trekking ruộng bậc thang bản Kho Mường ngắm hang Dơi, trưa về Hà Nội theo đường mòn Hồ Chí Minh (khoảng 4 giờ).'
  },
  {
    id: 'qa_route_08',
    province: 'Bắc Bộ',
    title: 'Cung đường văn hóa tâm linh: Hà Nội - Bắc Ninh - Hải Dương - Quảng Ninh',
    question: 'Tuyến du lịch văn hóa tâm linh Hà Nội - Bắc Ninh - Yên Tử đi theo trình tự nào?',
    answer: 'Ngày 1: Hà Nội sang Bắc Ninh viếng Đền Đô (thờ 8 vua Lý), Chùa Phật Tích, làng tranh Đông Hồ. Chiều sang Chí Linh (Hải Dương) viếng đền thờ Chu Văn An, quần thể Côn Sơn - Kiếp Bạc (thờ Nguyễn Trãi, Trần Hưng Đạo), tối nghỉ tại Uông Bí. Ngày 2: Sáng hành hương lên non thiêng Yên Tử (Quảng Ninh) chiêm bái Chùa Hoa Yên, Chùa Đồng trên đỉnh mây, chiều ghé vịnh Hạ Long hoặc trở về Hà Nội.'
  },
  {
    id: 'qa_route_09',
    province: 'Miền Tây',
    title: 'Cung đường hoa và sen: TP.HCM - Tiền Giang - Bến Tre - Đồng Tháp 2 ngày',
    question: 'Lịch trình kết hợp Bến Tre xứ dừa và Đồng Tháp sen hồng 2 ngày 1 đêm?',
    answer: 'Ngày 1: TP.HCM qua Mỹ Tho sang Bến Tre đi cồn Thới Sơn nghe đờn ca tài tử, chèo xuồng ba lá rợp bóng dừa nước, thăm lò kẹo dừa; chiều chạy sang Sa Đéc (Đồng Tháp) thăm làng hoa Sa Đéc, nhà cổ Huỳnh Thủy Lê, tối ăn hủ tiếu Sa Đéc. Ngày 2: Sáng đi Vườn quốc gia Tràm Chim hoặc khu sinh thái Xẻo Quýt chèo xuồng rừng tràm ăn cá lóc nướng trui cuốn lá sen non, mua nem Lai Vung rồi về lại TP.HCM.'
  },
  {
    id: 'qa_route_10',
    province: 'Bắc Trung Bộ',
    title: 'Cung đường di sản: Ninh Bình - Thanh Hóa - Nghệ An - Hà Tĩnh',
    question: 'Hành trình khám phá di sản Bắc Trung Bộ từ Tràng An đến Ngã ba Đồng Lộc 3 ngày 2 đêm?',
    answer: 'Ngày 1: Hà Nội xuống Ninh Bình khám phá Tràng An, Hang Múa; chiều xuôi cao tốc vào Thanh Hóa thăm Di sản thế giới Thành Nhà Hồ, tối ngủ TP. Thanh Hóa ăn nem chua, chả tôm. Ngày 2: Thanh Hóa vào Nghệ An thăm Khu di tích Kim Liên Nam Đàn (quê Bác), bãi biển Cửa Lò. Ngày 3: Nghệ An sang Hà Tĩnh viếng Khu lưu niệm Nguyễn Du, dâng hương Ngã ba Đồng Lộc, chiều vãn cảnh Chùa Hương Tích núi Hồng Lĩnh rồi quay về.'
  },
  {
    id: 'qa_route_11',
    province: 'Tây Nguyên',
    title: 'Cung đường 5 tỉnh Tây Nguyên (Kon Tum - Gia Lai - Đắk Lắk - Đắk Nông - Lâm Đồng)',
    question: 'Hành trình xuyên trọn vẹn 5 tỉnh Tây Nguyên bằng xe máy/ô tô cần bao nhiêu ngày?',
    answer: 'Hành trình xuyên 5 tỉnh Tây Nguyên cần tối thiểu 6 đến 7 ngày theo trục quốc lộ 14 và quốc lộ 20: Bắt đầu từ Măng Đen / TP. Kon Tum (nhà thờ gỗ) -> Pleiku Gia Lai (Biển Hồ, Chư Đăng Ya) -> Buôn Ma Thuột Đắk Lắk (Bảo tàng cà phê, thác Dray Nur) -> Gia Nghĩa / Tà Đùng Đắk Nông (hồ Tà Đùng) -> Đà Lạt Lâm Đồng (thành phố ngàn hoa, đồi thông) -> xuống đèo về TP.HCM hoặc Nha Trang.'
  },
  {
    id: 'qa_route_12',
    province: 'Đông Bắc',
    title: 'Cung đường biên cương: Lạng Sơn - Cao Bằng theo quốc lộ 4A huyền thoại',
    question: 'Tuyến quốc lộ 4A từ Lạng Sơn sang Cao Bằng có gì đặc sắc trong lịch sử?',
    answer: 'Quốc lộ 4A nối Lạng Sơn qua Thất Khê, Đông Khê lên Cao Bằng là con đường số 4 lịch sử gắn liền Chiến dịch Biên giới Thu Đông 1950. Cung đường uốn lượn qua những hẻm núi đá vôi hùng vĩ, qua cụm cứ điểm Đông Khê lịch sử và rừng hồi ngát hương thơm.'
  },
  {
    id: 'qa_route_13',
    province: 'Miền Tây',
    title: 'Cung đường sông nước: Cần Thơ - Hậu Giang - Kiên Giang (Rạch Giá - Phú Quốc)',
    question: 'Từ Cần Thơ đi Hậu Giang rồi ra đảo Phú Quốc sắp xếp lộ trình thế nào?',
    answer: 'Ngày 1: Khám phá Cần Thơ (chợ nổi Cái Răng), chạy sang Hậu Giang (45 phút) thăm Lung Ngọc Hoàng chèo thuyền ngắm chim, thăm vùng khóm Cầu Đúc. Chiều chạy sang TP. Rạch Giá (Kiên Giang, khoảng 1.5 giờ) ngủ đêm. Ngày 2: Tại cảng Rạch Giá đi tàu cao tốc Superdong hoặc Phú Quốc Express (2.5 giờ) ra đảo Phú Quốc bắt đầu kỳ nghỉ biển đảo.'
  },
  {
    id: 'qa_route_14',
    province: 'Tây Bắc',
    title: 'Cung đường Tây Bắc: Lai Châu - Điện Biên theo quốc lộ 12',
    question: 'Quãng đường từ TP. Lai Châu đi TP. Điện Biên Phủ đi qua những cảnh đẹp nào?',
    answer: 'Tuyến quốc lộ 12 từ TP. Lai Châu đi TP. Điện Biên Phủ dài khoảng 190km chạy men theo dòng sông Nậm Na hùng vĩ, qua thị xã Mường Lay - nơi giao thoa của sông Đà, sông Nậm Na và nậm Mức với những nếp nhà sàn người Thái trắng soi bóng lòng hồ thủy điện Sơn La tráng lệ, trước khi đến thung lũng Mường Thanh Điện Biên.'
  },
  {
    id: 'qa_route_15',
    province: 'Bắc Bộ',
    title: 'Cung đường làng cổ: Hà Nội - Bắc Giang - Bắc Ninh 2 ngày cuối tuần',
    question: 'Lịch trình 2 ngày cuối tuần khám phá văn hóa Kinh Bắc (Bắc Ninh - Bắc Giang)?',
    answer: 'Ngày 1: Hà Nội - Chùa Dâu - Chùa Bút Tháp - Làng tranh Đông Hồ (Bắc Ninh) - Chiều sang Chùa Vĩnh Nghiêm (Bắc Giang) chiêm bái mộc bản kinh Phật, tối nghỉ TP. Bắc Giang ăn gà đồi Yên Thế. Ngày 2: Sáng thăm Chùa Bổ Đà với vườn tháp đất nung cổ lớn nhất VN, ghé làng cổ Thổ Hà ngắm đình cổ ven sông Cầu và nghề làm bánh đa nem, chiều mua rượu làng Vân rồi về Hà Nội.'
  },
  {
    id: 'qa_route_16',
    province: 'Duyên hải Nam Trung Bộ',
    title: 'Cung đường ven biển: Quảng Ngãi - Bình Định (Quy Nhơn) - Phú Yên 3 ngày',
    question: 'Tuyến du lịch biển kết hợp Quảng Ngãi - Quy Nhơn - Phú Yên có thuận tiện không?',
    answer: 'Rất thuận tiện vì 3 tỉnh liền kề nhau dọc theo duyên hải Nam Trung Bộ và quốc lộ 1A / đường sắt Bắc Nam. Ngày 1: Đảo Lý Sơn (Quảng Ngãi). Ngày 2: Về đất liền chạy vào Quy Nhơn (Bình Định) tham quan Kỳ Co, Eo Gió, tháp Đôi Chăm Pa. Ngày 3: Từ Quy Nhơn chạy vào Phú Yên ngắm Ghềnh Đá Đĩa, Bãi Xép hoa vàng trên cỏ xanh, Mũi Điện cực Đông.'
  },
  {
    id: 'qa_route_17',
    province: 'Đồng bằng sông Hồng',
    title: 'Cung đường chùa cổ: Hà Nam - Nam Định - Thái Bình 2 ngày',
    question: 'Lịch trình hành hương văn hóa tâm linh Hà Nam - Nam Định 2 ngày 1 đêm?',
    answer: 'Ngày 1: Hà Nội xuống Hà Nam vãn cảnh Chùa Tam Chúc đi thuyền hồ Lục Nhạc, Chùa Địa Tạng Phi Lai Tự thanh tịnh, ăn bánh cuốn chả Phủ Lý; chiều sang Nam Định viếng Đền Trần, tháp Phổ Minh thời Trần. Ngày 2: Sáng ăn phở bò Nam Định, xuống Hải Hậu đón bình minh nhà thờ đổ Hải Lý, chiêm ngưỡng Vương cung thánh đường Phú Nhai nguy nga, mua nem nắm Giao Thủy rồi về.'
  },
  {
    id: 'qa_route_18',
    province: 'Tây Nguyên',
    title: 'Cung đường thác nước: Buôn Ma Thuột (Đắk Lắk) - Đắk Nông',
    question: 'Từ Buôn Ma Thuột sang Đắk Nông tham quan cụm thác Đray Sáp - Gia Long thế nào?',
    answer: 'Cụm thác Đray Sáp - Gia Long chỉ cách TP. Buôn Ma Thuột khoảng 30km về phía nam theo quốc lộ 14. Thác nằm ngay ranh giới hai tỉnh. Du khách có thể đi xe máy hoặc ô tô trong ngày: Sáng khám phá thác Đray Sáp tung bọt trắng xóa, đi bộ xuyên rừng bazan sang thác Gia Long tắm hồ bơi tự nhiên trong vắt, thưởng thức gà nướng cơm lam rồi chiều chạy tiếp về Gia Nghĩa / hồ Tà Đùng.'
  },
  {
    id: 'qa_route_19',
    province: 'Miền Tây',
    title: 'Cung đường Đất ngập nước: Long An - Đồng Tháp (Đồng Tháp Mười)',
    question: 'Tuyến du lịch mùa nước nổi Đồng Tháp Mười kết hợp Long An và Đồng Tháp?',
    answer: 'Theo tuyến quốc lộ 62 và N2: Bắt đầu từ Làng nổi Tân Lập (Long An) ngắm con đường xuyên rừng tràm và khu dược liệu Cánh Đồng Bất Tận. Sau đó chạy thẳng vào huyện Tam Nông (Đồng Tháp) khám phá Vườn quốc gia Tràm Chim mùa chim về và khu di tích Gò Tháp. Đây là hành trình trọn vẹn nhất để cảm nhận vẻ đẹp hoang dại của rốn lũ Đồng Tháp Mười.'
  },
  {
    id: 'qa_route_20',
    province: 'Đông Bắc',
    title: 'Cung đường chè và gió: Hà Nội - Thái Nguyên - Lạng Sơn',
    question: 'Phượt xe máy Hà Nội - Thái Nguyên - Lạng Sơn cuối tuần nên chia chặng ra sao?',
    answer: 'Thứ 7: Sáng Hà Nội lên Thái Nguyên theo quốc lộ 3 cũ hoặc cao tốc (75km) thăm đồi chè Tân Cương, Không gian văn hóa Trà, Bảo tàng Dân tộc học; chiều rẽ quốc lộ 1B sang Lạng Sơn qua đèo Đình Cả ngắm cảnh núi đá vôi Võ Nhai kỳ vĩ, tối dạo chợ đêm Kỳ Lừa ăn vịt quay mắc mật. Chủ nhật: Thăm động Tam Thanh, núi Tô Thị, lên đỉnh Mẫu Sơn săn mây rồi chiều xuôi cao tốc Lạng Sơn - Bắc Giang về Hà Nội.'
  },
  {
    id: 'qa_route_21',
    province: 'Tây Bắc',
    title: 'Cung đường phượt mạo hiểm: Mù Cang Chải (Yên Bái) sang Than Uyên (Lai Châu)',
    question: 'Vượt đèo Khau Phạ từ Mù Cang Chải sang Lai Châu có trải nghiệm gì đẹp?',
    answer: 'Đèo Khau Phạ (Yên Bái) là một trong Tứ đại đỉnh đèo. Qua đỉnh đèo Khau Phạ hùng vĩ, bạn sẽ tiến vào thung lũng Than Uyên (Lai Châu) - nơi có cánh đồng Mường Than rộng bao la. Cung đường này đẹp mê hồn vào tháng 9 - 10 khi cả thung lũng lúa bậc thang chuyển sang màu vàng rực rỡ dưới nắng thu.'
  },
  {
    id: 'qa_route_22',
    province: 'Bắc Bộ',
    title: 'Tuyến du lịch di sản ven sông Hồng: Hà Nội - Hưng Yên - Nam Định',
    question: 'Tuyến đường đê sông Hồng từ Hà Nội qua Hưng Yên về Nam Định có điểm tham quan nào?',
    answer: 'Cung đường đê sông Hồng thanh bình rợp bóng nhãn và phù sa: Xuất phát từ Hà Nội qua làng gốm Bát Tràng, đến Hưng Yên thăm đền Chử Đồng Tử (Khoái Châu), cụm di tích Phố Hiến (Chùa Chuông, Đền Mẫu ven hồ Bán Nguyệt), làng đan đó Thủ Sỹ; tiếp tục theo đê qua cầu Triều Dương sang Nam Định thưởng thức phở bò và thăm quần thể Đền Trần.'
  },
  {
    id: 'qa_route_23',
    province: 'Miền Trung',
    title: 'Tuyến hành hương lịch sử: Quảng Trị (DMZ) - Hà Tĩnh (Đồng Lộc) - Nghệ An',
    question: 'Cung đường "Về chiến trường xưa" Bắc Trung Bộ từ Quảng Trị ra Hà Tĩnh gồm những điểm nào?',
    answer: 'Hành trình tri ân lịch sử hào hùng: Bắt đầu từ Quảng Trị (Nghĩa trang Trường Sơn, Thành Cổ Quảng Trị, Địa đạo Vịnh Mốc) -> vượt Đèo Ngang sang Hà Tĩnh viếng mộ Đại tướng Võ Nguyên Giáp (Vũng Chùa - Quảng Bình sát ranh Hà Tĩnh) -> dâng hương Khu di tích Ngã ba Đồng Lộc -> sang Nghệ An thăm Khu di tích Kim Liên Nam Đàn.'
  },
  {
    id: 'qa_route_24',
    province: 'Tây Nguyên',
    title: 'Tuyến chinh phục biên giới: Kon Tum (Ngã ba Đông Dương) sang Gia Lai',
    question: 'Từ TP. Kon Tum đi Cột mốc Ngã ba Đông Dương Bờ Y bao xa?',
    answer: 'Từ TP. Kon Tum lên Cửa khẩu quốc tế Bờ Y (huyện Ngọc Hồi) khoảng 80km theo quốc lộ 14. Tại đây xin phép biên phòng leo bậc thang đá lên Cột mốc ba biên giới Việt - Lào - Campuchia check-in. Sau đó quay về ngã ba Plei Kần theo quốc lộ 14C chạy về Chư Păh và Pleiku (Gia Lai).'
  },
  {
    id: 'qa_route_25',
    province: 'Miền Tây',
    title: 'Tuyến biển Tây Nam: Cà Mau - Kiên Giang (Hà Tiên)',
    question: 'Từ Cà Mau đi Hà Tiên (Kiên Giang) theo tuyến hành lang ven biển phía Nam thế nào?',
    answer: 'Tuyến đường hành lang ven biển phía Nam nối TP. Cà Mau qua Rạch Giá đến thị xã Hà Tiên dài khoảng 180km đường nhựa êm ái. Du khách được ngắm sông nước miệt vườn U Minh, đầm rừng ngập mặn rồi đến với phong cảnh "Hà Tiên thập cảnh" (Thạch Động, Mũi Nai, Chùa Hang).'
  },
  {
    id: 'qa_route_26',
    province: 'Bắc Bộ',
    title: 'Tuyến tránh nóng mùa hè: Hà Nội - Vĩnh Phúc (Tam Đảo) - Thái Nguyên (Hồ Núi Cốc)',
    question: 'Lịch trình 2 ngày 1 đêm trốn nóng mùa hè kết hợp Tam Đảo và Hồ Núi Cốc?',
    answer: 'Ngày 1: Hà Nội lên Tam Đảo (Vĩnh Phúc, 75km) hưởng không khí 4 mùa trong 1 ngày, check-in Nhà thờ đá, Cầu Mây, Quán Gió, tối ăn ngọn su su xào tỏi, thịt nướng. Ngày 2: Sáng xuống núi theo ĐT261 sang Đại Từ (Thái Nguyên, khoảng 40km) thăm đồi chè và đi du thuyền ngắm lòng hồ Núi Cốc mát rượi, chiều mua trà Tân Cương rồi về lại Hà Nội.'
  },
  {
    id: 'qa_route_27',
    province: 'Đông Nam Bộ',
    title: 'Cung đường đất đỏ: TP.HCM - Bình Dương - Bình Phước - Tây Ninh',
    question: 'Cung đường phượt khám phá miền Đông Nam Bộ 2 ngày?',
    answer: 'Ngày 1: TP.HCM lên Bình Phước thăm Vườn quốc gia Bù Gia Mập tắm thác hoặc cắm trại trảng cỏ Bù Lạch, ăn gà nướng cơm lam, đọt mây. Ngày 2: Từ Đồng Xoài chạy theo ĐT744 cắt qua Dầu Tiếng sang Tây Ninh chinh phục Núi Bà Đen bằng cáp treo chiêm bái tượng Phật Bà Tây Bổ Đà Sơn, viếng Tòa Thánh Cao Đài rồi về TP.HCM.'
  },
  {
    id: 'qa_route_28',
    province: 'Bắc Bộ',
    title: 'Tuyến tâm linh Mẫu: Đền Mẫu Đồng Đăng (Lạng Sơn) - Đền Mẫu Hưng Yên - Phủ Dầy (Nam Định)',
    question: 'Tín đồ Đạo Mẫu thường hành hương qua những đền Mẫu lớn nào ở miền Bắc?',
    answer: 'Hành trình chiêm bái Đạo Mẫu Tam phủ: Đền Mẫu Đồng Đăng (Lạng Sơn - thờ Mẫu Liễu Hạnh nơi biên ải), Đền Mẫu Thoải Cầu Đền Hàn (Thanh Hóa), Đền Mẫu Hưng Yên (bên hồ Bán Nguyệt cây đa 700 năm) và trung tâm thực hành tín ngưỡng thờ Mẫu tại Quần thể di tích Phủ Dầy (Vụ Bản, Nam Định - nơi phát tích Thánh Mẫu Liễu Hạnh).'
  },
  {
    id: 'qa_route_29',
    province: 'Tây Nguyên',
    title: 'Tuyến khám phá cà phê: Đắk Nông - Đắk Lắk - Gia Lai',
    question: 'Tuyến đường "Thủ phủ cà phê Việt Nam" đi qua những địa danh nào?',
    answer: 'Hành trình khám phá văn hóa cà phê dọc quốc lộ 14: Bắt đầu từ những nương cà phê đất đỏ núi lửa Đắk Nông (Gia Nghĩa, Đắk Mil) -> thủ phủ cà phê Buôn Ma Thuột (Bảo tàng thế giới cà phê, làng cà phê Trung Nguyên) -> phố núi Pleiku Gia Lai (văn hóa cà phê phin đậm đặc, Biển Hồ Chè). Mùa đẹp nhất là tháng 2 - 3 khi hoa cà phê nở trắng muốt ngát hương thơm.'
  },
  {
    id: 'qa_route_30',
    province: 'Miền Tây',
    title: 'Tuyến ẩm thực bún: Trà Vinh (bún nước lèo) - Sóc Trăng (bún nước lèo) - Bạc Liêu (bún nước lèo)',
    question: 'Hành trình trải nghiệm "Con đường bún nước lèo" miền Tây có gì thú vị?',
    answer: 'Bún nước lèo là linh hồn ẩm thực giao thoa Kinh - Khmer - Hoa. Mỗi tỉnh có biến tấu độc đáo: Bún nước lèo Trà Vinh đậm đà mắm bò hóc; Bún nước lèo Sóc Trăng ngọt thanh mắm cá sặc và ngải bún ăn kèm cá lóc đồng và thịt heo quay giòn; Bún nước lèo Bạc Liêu chan nước dừa béo bùi ăn cùng bì heo và tôm đất tươi rói.'
  },
  {
    id: 'qa_route_31',
    province: 'Tây Bắc',
    title: 'Tuyến trekking đỉnh cao: Fansipan (Lào Cai) kết hợp Bạch Mộc Lương Tử (Lai Châu)',
    question: 'Dân trekking chuyên nghiệp thường kết hợp những đỉnh núi nào ở Lào Cai và Lai Châu?',
    answer: 'Dãy Hoàng Liên Sơn giáp ranh giữa 2 tỉnh sở hữu các đỉnh núi trekking hàng đầu: Fansipan (3.143m), Bạch Mộc Lương Tử / Kỳ Quan San (3.046m - điểm săn mây bình minh đỉnh Muối số 1 Việt Nam), Pu Ta Leng (3.049m - mùa hoa đỗ quyên) và Nhìu Cồ San. Cần người dẫn đường (porter) bản địa và chuẩn bị thể lực 2-3 ngày.'
  },
  {
    id: 'qa_route_32',
    province: 'Bắc Bộ',
    title: 'Cung đường cổ tích: Làng gốm Phù Lãng (Bắc Ninh) sang làng cổ Thổ Hà (Bắc Giang)',
    question: 'Khoảng cách giữa làng gốm Phù Lãng và làng Thổ Hà ven sông Cầu?',
    answer: 'Hai làng cổ này chỉ cách nhau khoảng 20km nằm bên dòng sông Cầu êm đềm. Du khách có thể đi xe máy hoặc ô tô kết hợp trong 1 ngày: Sáng ghé Phù Lãng (Bắc Ninh) ngắm lò gốm củi truyền thống màu men da lươn; chiều qua đò hoặc cầu sang Thổ Hà (Bắc Giang) ngắm cổng làng cổ và những giàn bánh đa nem phơi kín các ngõ ngách rêu phong.'
  },
  {
    id: 'qa_route_33',
    province: 'Miền Trung',
    title: 'Tuyến di sản thành quách: Thành Nhà Hồ (Thanh Hóa) - Hoàng thành Thăng Long - Cố đô Huế',
    question: 'Tuyến du lịch nghiên cứu kinh đô cổ Việt Nam có những điểm dừng nào?',
    answer: 'Tuyến tham quan các kinh đô cổ lịch sử: Hoàng thành Thăng Long (Hà Nội, kinh đô ngàn năm) -> Cổ Loa (Đông Anh) -> Cố đô Hoa Lư (Ninh Bình) -> Thành Nhà Hồ (Thanh Hóa, kinh đô đá UNESCO thế kỷ 14) -> Lam Kinh (Thanh Hóa) -> Quần thể Cố đô Huế (kinh đô triều Nguyễn).'
  },
  {
    id: 'qa_route_34',
    province: 'Tây Nguyên',
    title: 'Cung đường hoa dã quỳ: Gia Lai - Kon Tum tháng 11',
    question: 'Đi săn hoa dã quỳ Tây Nguyên vào tháng 11 nên đi những điểm nào?',
    answer: 'Tuyến săn hoa dã quỳ rực rỡ nhất: Miệng núi lửa Chư Đăng Ya (Chư Păh, Gia Lai) - nơi diễn ra Tuần lễ hoa dã quỳ -> cung đường đèo Chư Păh sang TP. Kon Tum -> cung đường đèo Măng Đen hoa dã quỳ mọc tự nhiên vàng rực hai bên rừng thông bát ngát.'
  },
  {
    id: 'qa_route_35',
    province: 'Miền Tây',
    title: 'Tuyến khám phá cù lao trái cây: Tiền Giang - Bến Tre - Vĩnh Long - Đồng Tháp',
    question: 'Hành trình phượt miệt vườn cây trái đồng bằng sông Cửu Long?',
    answer: 'Khám phá các cù lao trù phú giữa sông Tiền và sông Cổ Chiên: Cù lao Thới Sơn (Tiền Giang) -> Cù lao Phụng, Cù lao An Bình (Vĩnh Long) với những vườn sầu riêng, chôm chôm, nhãn chín trĩu cành -> sang làng hoa Sa Đéc và vườn quýt hồng Lai Vung (Đồng Tháp) thưởng thức trái cây bao bụng tại vườn.'
  },
  {
    id: 'qa_route_36',
    province: 'Đông Bắc',
    title: 'Tuyến cửa khẩu thương mại: Lạng Sơn (Hữu Nghị) sang Quảng Ninh (Móng Cái)',
    question: 'Tuyến quốc lộ 4B nối Lạng Sơn và Quảng Ninh có gì trải nghiệm?',
    answer: 'Quốc lộ 4B kết nối từ TP. Lạng Sơn qua huyện Lộc Bình, Đình Lập sang Tiên Yên và Móng Cái (Quảng Ninh). Tuyến đường đưa du khách từ vùng núi cao Mẫu Sơn xứ Lạng xuống biển đảo vùng vịnh Bái Tử Long và Cửa khẩu quốc tế Móng Cái sầm uất.'
  },
  {
    id: 'qa_route_37',
    province: 'Duyên hải Miền Trung',
    title: 'Cung đường biển đảo hoang sơ: Cù Lao Chàm (Quảng Nam) - Đảo Lý Sơn (Quảng Ngãi)',
    question: 'So sánh và kinh nghiệm đi 2 hòn đảo nổi tiếng Cù Lao Chàm và Lý Sơn?',
    answer: 'Cù Lao Chàm (Hội An) thích hợp đi tour về trong ngày lặn ngắm san hô và đi bộ dưới biển sinh thái; Đảo Lý Sơn (Quảng Ngãi) rộng lớn hơn với kỳ quan địa chất núi lửa độc nhất vô nhị, văn hóa hải đội Hoàng Sa và ẩm thực hải sản phong phú, cần dành tối thiểu 2 ngày 1 đêm để trải nghiệm trọn vẹn.'
  },
  {
    id: 'qa_route_38',
    province: 'Bắc Bộ',
    title: 'Tuyến du lịch suối nước nóng phục hồi sức khỏe: Vĩnh Phúc - Phú Thọ - Hòa Bình',
    question: 'Những điểm tắm khoáng nóng thư giãn tốt nhất quanh Hà Nội?',
    answer: 'Các điểm suối khoáng nóng thiên nhiên giàu khoáng chất cách Hà Nội 1-2 giờ di chuyển: Suối khoáng nóng Thanh Thủy (Phú Thọ) chứa radon quý hiếm; Suối khoáng nóng Kim Bôi (Hòa Bình); Tắm khoáng Onsen kiểu Nhật tại Quang Hanh (Quảng Ninh) hoặc Flamingo Đại Lải (Vĩnh Phúc).'
  },
  {
    id: 'qa_route_39',
    province: 'Miền Tây',
    title: 'Cung đường biên giới Tây Nam: Long An - Đồng Tháp - An Giang',
    question: 'Cung đường biên giới N1 chạy dọc miền Tây có gì thú vị?',
    answer: 'Tuyến quốc lộ N1 men theo biên giới Việt Nam - Campuchia từ Đức Huệ (Long An) qua Hồng Ngự, Tân Hồng (Đồng Tháp) đến Châu Đốc, Tịnh Biên (An Giang). Du khách được ngắm những cánh đồng lúa giáp biên mênh mông, rừng tràm Trà Sư và viếng Miếu Bà Chúa Xứ núi Sam.'
  },
  {
    id: 'qa_route_40',
    province: 'Tây Bắc & Đông Bắc',
    title: 'Vòng cung Đông - Tây Bắc trọn vẹn 10 ngày',
    question: 'Lịch trình tour Vòng cung Đông - Tây Bắc 10 ngày cho du khách phương Nam hoặc nước ngoài?',
    answer: 'Lịch trình trọn vẹn 10 ngày: Hà Nội -> Mai Châu -> Mộc Châu -> Điện Biên Phủ -> Lai Châu (đèo Ô Quy Hồ) -> Sa Pa (Fansipan) -> Hà Giang (Đồng Văn, Mã Pí Lèng) -> Cao Bằng (Thác Bản Giốc) -> Ba Bể -> Lạng Sơn -> Hà Nội. Đây là cung đường huyền thoại ngắm trọn vẹn vẻ đẹp non sông gấm vóc hùng vĩ nhất Việt Nam.'
  },

  // =========================================================================
  // CHỦ ĐỀ 2: DỰ TOÁN CHI PHÍ & BẢNG GIÁ THAM QUAN THỰC TẾ (40 CÂU)
  // =========================================================================
  {
    id: 'qa_cost_01',
    province: 'Kon Tum',
    title: 'Dự toán chi phí: Du lịch Măng Đen 3 ngày 2 đêm',
    question: 'Chi phí đi du lịch tự túc Măng Đen 3 ngày 2 đêm khoảng bao nhiêu tiền một người?',
    answer: 'Chi phí du lịch tự túc Măng Đen 3 ngày 2 đêm dao động từ 2.500.000 đến 3.500.000 VNĐ/người (chưa gồm vé máy bay đến Pleiku). Chi tiết: Khách sạn/Homestay rừng thông (350.000 - 600.000đ/đêm, chia đôi phòng còn 200.000 - 300.000đ/người); Thuê xe máy tại Măng Đen (150.000đ/ngày); Vé tham quan thác Pa Sỹ (20.000đ), hồ Đăk Ke (miễn phí); Ăn uống lẩu xuyên tiêu, gà nướng cơm lam, gỏi lá (300.000 - 450.000đ/ngày); Xe buýt/taxi Pleiku - Măng Đen (100.000 - 150.000đ/lượt).'
  },
  {
    id: 'qa_cost_02',
    province: 'Quảng Ngãi',
    title: 'Dự toán chi phí: Du lịch Đảo Lý Sơn 2 ngày 1 đêm',
    question: 'Đi du lịch đảo Lý Sơn 2 ngày 1 đêm tự túc hết khoảng bao nhiêu tiền?',
    answer: 'Chi phí trọn gói 2N1Đ tại đảo Lý Sơn khoảng 1.800.000 - 2.500.000 VNĐ/người (tính từ cảng Sa Kỳ). Chi tiết: Vé tàu cao tốc khứ hồi Sa Kỳ - Lý Sơn (khoảng 360.000 - 400.000đ/khứ hồi); Thuê xe máy trên đảo (150.000đ/ngày); Khách sạn/nhà nghỉ (300.000 - 500.000đ/phòng); Cano khứ hồi sang Đảo Bé (100.000 - 120.000đ); Xe điện Đảo Bé (30.000đ); Thuyền thúng lặn san hô (80.000 - 100.000đ); Ăn uống hải sản cua huỳnh đế, ốc cừ, don, tỏi Lý Sơn (600.000 - 800.000đ).'
  },
  {
    id: 'qa_cost_03',
    province: 'Hà Nam',
    title: 'Bảng giá vé: Khu du lịch tâm linh Chùa Tam Chúc',
    question: 'Bảng giá vé tham quan du thuyền và xe điện Chùa Tam Chúc hiện nay là bao nhiêu?',
    answer: 'Giá vé vào cửa chùa Tam Chúc là miễn phí. Giá dịch vụ di chuyển tham quan gồm: Gói xe điện khứ hồi (90.000đ/người); Gói du thuyền phổ thông ngắm lòng hồ Lục Nhạc khứ hồi (200.000đ/người); Gói du thuyền VIP kèm trà bánh buffet (250.000 - 270.000đ/người); Vé kết hợp du thuyền lượt đi + xe điện lượt về (khoảng 240.000đ/người).'
  },
  {
    id: 'qa_cost_04',
    province: 'Lai Châu',
    title: 'Bảng giá vé: Cầu kính Rồng Mây đèo Ô Quy Hồ',
    question: 'Giá vé tham quan thang máy và Cầu kính Rồng Mây ở Lai Châu là bao nhiêu?',
    answer: 'Giá vé tham quan Cầu kính Rồng Mây (gồm thang máy lồng kính ngoài trời cao 300m lên cầu kính): Người lớn là 400.000 VNĐ/vé; Trẻ em (1m - 1.4m) là 200.000 VNĐ/vé; Trẻ em dưới 1m miễn phí. Các trò chơi mạo hiểm tính phí riêng: Cầu độc mộc (150.000đ), Xích đu tử thần (150.000đ), Zipline trượt cáp (150.000đ), Dù lượn (khoảng 1.000.000đ/lượt).'
  },
  {
    id: 'qa_cost_05',
    province: 'Thanh Hóa',
    title: 'Dự toán chi phí: Du lịch Pù Luông 2 ngày 1 đêm',
    question: 'Du lịch Pù Luông 2 ngày 1 đêm ở homestay hoặc resort hết bao nhiêu?',
    answer: 'Nếu ở homestay nhà sàn bản Đôn/Kho Mường: Khoảng 1.200.000 - 1.600.000 VNĐ/người (ngủ nhà sàn cộng đồng 100.000 - 150.000đ/người, ăn vịt Cổ Lũng, măng rừng, thuê bè tre 50.000đ/người). Nếu ở resort cao cấp (Pù Luông Retreat, Puluong Bocbandi, Puluong Casa) có bể bơi vô cực ngắm ruộng bậc thang: Khoảng 2.200.000 - 3.200.000 VNĐ/người.'
  },
  {
    id: 'qa_cost_06',
    province: 'Đắk Nông',
    title: 'Bảng giá dịch vụ: Thuê thuyền tham quan Hồ Tà Đùng',
    question: 'Giá thuê thuyền hoặc cano ngắm cảnh lòng hồ Tà Đùng là bao nhiêu?',
    answer: 'Giá thuê thuyền du lịch tại bến thuyền Tà Đùng: Nếu đi ghép đoàn, giá vé thuyền khoảng 100.000 - 150.000 VNĐ/người cho chuyến dạo hồ 1.5 đến 2 giờ. Nếu thuê trọn gói nguyên thuyền riêng cho đoàn gia đình (10 - 20 người), giá dao động từ 1.000.000 đến 1.500.000 VNĐ/chuyến.'
  },
  {
    id: 'qa_cost_07',
    province: 'Vĩnh Phúc',
    title: 'Dự toán chi phí: Du lịch Tam Đảo 2 ngày 1 đêm từ Hà Nội',
    question: 'Chi phí đi du lịch Tam Đảo 2N1Đ tự túc bằng xe máy hoặc xe buýt/limousine?',
    answer: 'Chi phí khoảng 1.000.000 - 1.500.000 VNĐ/người: Xăng xe máy hoặc vé xe Limousine khứ hồi Hà Nội - Tam Đảo (250.000 - 300.000đ); Khách sạn/Homestay (400.000 - 700.000đ/phòng, chia đôi còn 200.000 - 350.000đ/người); Ăn uống ngọn su su xào, gà đồi, thịt nướng than quảng trường (400.000 - 500.000đ); Vé Cầu Mây (30.000đ), Thác Bạc (miễn phí hoặc 20.000đ).'
  },
  {
    id: 'qa_cost_08',
    province: 'Cà Mau',
    title: 'Bảng giá dịch vụ: Thuê vỏ lãi xuyên rừng ngập mặn Đất Mũi',
    question: 'Giá thuê cano vỏ lãi tham quan xuyên rừng đước tại Vườn quốc gia Mũi Cà Mau?',
    answer: 'Tại Khu du lịch Quốc gia Mũi Cà Mau, giá tuyến tham quan xuyên rừng ngập mặn bằng xuồng vỏ lãi hoặc cano dao động theo tuyến: Tuyến ngắn (khoảng 20 phút) giá khoảng 500.000 - 600.000 VNĐ/chuyến (chở 6 người); Tuyến dài xuyên rừng đước ra bãi bồi ven biển (khoảng 45 - 60 phút) giá khoảng 800.000 - 1.000.000 VNĐ/chuyến. Đi theo nhóm chia ra khoảng 100.000 - 150.000đ/người.'
  },
  {
    id: 'qa_cost_09',
    province: 'Bắc Giang',
    title: 'Bảng giá vé: Cáp treo Tây Yên Tử',
    question: 'Giá vé cáp treo Khu di tích danh thắng Tây Yên Tử Bắc Giang bao nhiêu?',
    answer: 'Giá vé cáp treo Tây Yên Tử (từ ga Chùa Hạ lên ga Chùa Thượng): Vé khứ hồi người lớn là 260.000 VNĐ/vé; Vé khứ hồi trẻ em (1m - 1.3m) là 180.000 VNĐ/vé; Vé một chiều là 150.000 VNĐ/vé. Trẻ em dưới 1m được miễn phí.'
  },
  {
    id: 'qa_cost_10',
    province: 'Vĩnh Phúc',
    title: 'Bảng giá vé: Cáp treo Tây Thiên',
    question: 'Giá vé cáp treo danh thắng Tây Thiên Vĩnh Phúc?',
    answer: 'Giá vé cáp treo Tây Thiên vượt suối lên Đền Quốc Mẫu: Người lớn khứ hồi là 240.000 VNĐ/vé (một chiều 150.000đ); Trẻ em (1m - 1.3m) khứ hồi là 160.000 VNĐ/vé (một chiều 100.000đ); Trẻ em dưới 1m miễn phí. Xe điện trung chuyển từ bãi xe vào chân ga cáp treo: 20.000đ/người/lượt.'
  },
  {
    id: 'qa_cost_11',
    province: 'Gia Lai',
    title: 'Dự toán chi phí: Du lịch Pleiku 3 ngày 2 đêm',
    question: 'Đi du lịch Pleiku Gia Lai 3 ngày 2 đêm tự túc tốn khoảng bao nhiêu?',
    answer: 'Khoảng 2.000.000 - 2.800.000 VNĐ/người (chưa vé máy bay). Chi tiết: Thuê xe máy Pleiku (120.000 - 150.000đ/ngày); Khách sạn trung tâm (300.000 - 500.000đ/đêm); Vé thắng cảnh Biển Hồ Tơ Nưng (10.000đ/người), thác Phú Cường (15.000đ); Ăn uống phở hai tô (40.000 - 50.000đ/bát), bò một nắng muối kiến vàng, gà nướng cơm lam (khoảng 300.000đ/ngày).'
  },
  {
    id: 'qa_cost_12',
    province: 'Đồng Tháp',
    title: 'Bảng giá vé: Vườn quốc gia Tràm Chim',
    question: 'Giá vé tham quan và đi xuồng máy tại Vườn quốc gia Tràm Chim?',
    answer: 'Vé vào cổng Vàm Tràm Chim: 20.000 VNĐ/người. Giá thuê xuồng máy (tắc ráng) luồn lách tham quan rừng tràm đồng cỏ: Tuyến ngắn 12km (khoảng 45 phút) giá 500.000đ/xuồng (tối đa 10 người); Tuyến dài 21km (khoảng 1.5 giờ) giá 800.000đ/xuồng. Đi nhóm chia ra chỉ khoảng 60.000 - 90.000đ/người.'
  },
  {
    id: 'qa_cost_13',
    province: 'Long An',
    title: 'Bảng giá vé: Khu du lịch Làng nổi Tân Lập',
    question: 'Giá vé tham quan Làng nổi Tân Lập và đi thuyền rồng/xuồng ba lá?',
    answer: 'Giá vé vào cổng tham quan đường xuyên rừng tràm: 60.000 VNĐ/người. Vé đi thuyền máy hoặc xuồng ba lá chèo tay trên dòng kênh hoa súng: 70.000 - 80.000 VNĐ/người. Gói combo vào cổng + đi thuyền khoảng 130.000 - 140.000 VNĐ/người.'
  },
  {
    id: 'qa_cost_14',
    province: 'Bạc Liêu',
    title: 'Bảng giá vé: Nhà Công tử Bạc Liêu và Cánh đồng điện gió',
    question: 'Giá vé tham quan Dinh thự Công tử Bạc Liêu và Cánh đồng quạt gió là bao nhiêu?',
    answer: 'Vé tham quan Dinh thự Công tử Bạc Liêu: Người lớn là 30.000 VNĐ/vé, trẻ em là 15.000 VNĐ/vé. Vé tham quan cầu dẫn ngắm Cánh đồng điện gió Bạc Liêu: 30.000 VNĐ/người lớn. Vé vào Khu lưu niệm nhạc sĩ Cao Văn Lầu: 20.000 VNĐ/người.'
  },
  {
    id: 'qa_cost_15',
    province: 'Thái Nguyên',
    title: 'Bảng giá vé: Khu du lịch Hồ Núi Cốc',
    question: 'Giá vé trọn gói vào cổng Khu du lịch Hồ Núi Cốc Thái Nguyên?',
    answer: 'Giá vé trọn gói vào cổng Hồ Núi Cốc: 130.000 VNĐ/người lớn (đã bao gồm tham quan Chùa Thác Vàng, Động Huyền Thoại Cung, Động Ba Cây Thông, xem nhạc nước nghệ thuật và công viên nước). Dịch vụ đi tàu du thuyền trên mặt hồ tính riêng: khoảng 30.000 - 50.000 VNĐ/người.'
  },
  {
    id: 'qa_cost_16',
    province: 'Thanh Hóa',
    title: 'Bảng giá vé: Di sản thế giới Thành Nhà Hồ và Lam Kinh',
    question: 'Giá vé tham quan Thành Nhà Hồ và Di tích Lam Kinh Thanh Hóa?',
    answer: 'Vé tham quan Di sản văn hóa thế giới Thành Nhà Hồ: Người lớn là 40.000 VNĐ/vé; Trẻ em là 20.000 VNĐ/vé. Vé tham quan Khu di tích quốc gia đặc biệt Lam Kinh: Người lớn là 30.000 VNĐ/vé; Trẻ em là 15.000 VNĐ/vé. Xe điện tham quan trong khuôn viên Lam Kinh: 20.000đ/người.'
  },
  {
    id: 'qa_cost_17',
    province: 'Bình Phước',
    title: 'Dự toán chi phí: Trekking Vườn quốc gia Bù Gia Mập 2 ngày 1 đêm',
    question: 'Chi phí đi tour trekking Bù Gia Mập 2N1Đ có người dẫn đường hết bao nhiêu?',
    answer: 'Chi phí tour tự túc hoặc ghép đoàn Bù Gia Mập khoảng 1.200.000 - 1.800.000 VNĐ/người. Đã bao gồm: Phí tham quan và bảo hiểm rừng (khoảng 70.000đ); Thuê kiểm lâm/hướng dẫn viên địa phương dẫn đường (khoảng 400.000 - 500.000đ/ngày/đoàn chia ra); Thuê lều trại ngủ rừng (100.000đ/lều); Ăn uống 4 bữa chính gà nướng, cơm lam, cá suối, canh thụt của người bản địa.'
  },
  {
    id: 'qa_cost_18',
    province: 'Nam Định',
    title: 'Bảng giá vé: Vườn quốc gia Xuân Thủy',
    question: 'Chi phí thuê thuyền ngắm chim và rừng ngập mặn Vườn quốc gia Xuân Thủy?',
    answer: 'Vé vào cửa Vườn quốc gia Xuân Thủy miễn phí. Chi phí thuê tàu thuyền máy tham quan cửa sông Ba Lạt và cồn Ngạn, cồn Lu ngắm chim di cư dao động từ 800.000 đến 1.500.000 VNĐ/chuyến thuyền (chở được đoàn 10 - 15 người, chia ra chỉ khoảng 80.000 - 100.000đ/người).'
  },
  {
    id: 'qa_cost_19',
    province: 'Hà Tĩnh',
    title: 'Bảng giá vé: Cáp treo Chùa Hương Tích núi Hồng Lĩnh',
    question: 'Giá vé cáp treo và thuyền hồ Nhà Đường lên Chùa Hương Tích Hà Tĩnh?',
    answer: 'Vé thuyền máy qua lòng hồ Nhà Đường lên chân núi: 50.000 VNĐ/người/khứ hồi. Vé cáp treo Chùa Hương Tích: Người lớn khứ hồi là 160.000 VNĐ/vé (một chiều 100.000đ); Trẻ em khứ hồi là 120.000 VNĐ/vé (một chiều 80.000đ). Du khách cũng có thể chọn đi bộ leo núi miễn phí qua rừng thông mất khoảng 1.5 - 2 giờ.'
  },
  {
    id: 'qa_cost_20',
    province: 'Hậu Giang',
    title: 'Bảng giá vé: Khu bảo tồn thiên nhiên Lung Ngọc Hoàng',
    question: 'Giá vé tham quan và dịch vụ thuyền tại Lung Ngọc Hoàng?',
    answer: 'Giá vé vào cổng tham quan Lung Ngọc Hoàng: 60.000 VNĐ/người lớn (trẻ em 30.000đ). Dịch vụ đi xuồng máy hoặc chèo xuồng ba lá lướt trên thảm bèo xanh: 50.000 VNĐ/người. Thuê xe điện nội khu: 30.000 VNĐ/người.'
  },
  {
    id: 'qa_cost_21',
    province: 'Cà Mau',
    title: 'Giá cua Cà Mau tại chỗ là bao nhiêu một ký?',
    question: 'Giá cua biển Cà Mau Năm Căn mua ăn tại địa phương khoảng bao nhiêu 1kg?',
    answer: 'Giá cua Cà Mau tại Năm Căn hoặc Đất Mũi tùy thời điểm: Cua thịt loại 1 (cua Y, khoảng 2-3 con/kg) giá dao động từ 250.000 đến 350.000 VNĐ/kg; Cua gạch son loại 1 (gạch đặc đỏ au) giá khoảng 450.000 đến 600.000 VNĐ/kg (vào dịp lễ tết có thể lên 650.000 - 700.000đ/kg). Dây trói cua tại các vựa uy tín rất mỏng không ăn gian trọng lượng.'
  },
  {
    id: 'qa_cost_22',
    province: 'Toàn quốc',
    title: 'Dự toán chi phí: Phượt xe máy xuyên Việt 1 tháng',
    question: 'Ngân sách phượt xe máy xuyên Việt trong 30 ngày cần khoảng bao nhiêu tiền?',
    answer: 'Ngân sách phượt xe máy 30 ngày tiết kiệm đến vừa phải dao động từ 15.000.000 đến 22.000.000 VNĐ/người. Chi tiết trung bình mỗi ngày: Xăng xe (70.000 - 100.000đ); Nhà nghỉ/Homestay bình dân (150.000 - 250.000đ); Ăn uống 3 bữa đặc sản địa phương (150.000 - 200.000đ); Vé tham quan danh lam thắng cảnh và phát sinh bảo dưỡng xe (100.000đ/ngày).'
  },
  {
    id: 'qa_cost_23',
    province: 'Lai Châu',
    title: 'Chi phí thuê porter dẫn đường leo núi Pu Ta Leng / Bạch Mộc Lương Tử',
    question: 'Thuê porter người Mông dẫn đường leo đỉnh Pu Ta Leng chi phí thế nào?',
    answer: 'Chi phí thuê 1 porter (người khuân vác kiêm dẫn đường, nấu ăn) người Mông hoặc Dao bản địa khoảng 400.000 - 500.000 VNĐ/ngày công. Thường một tour leo Pu Ta Leng 3 ngày 2 đêm chi phí porter khoảng 1.200.000 - 1.500.000đ (1 porter gùi được khoảng 15-20kg đồ đạc cho 2-3 khách).'
  },
  {
    id: 'qa_cost_24',
    province: 'Lạng Sơn',
    title: 'Giá vịt quay Lạng Sơn nguyên con bao nhiêu tiền?',
    question: 'Mua một con vịt quay lá mắc mật ở Lạng Sơn khoảng bao nhiêu?',
    answer: 'Vịt quay Thất Khê / Lạng Sơn nguyên con nướng mật ong lá mắc mật có giá dao động từ 280.000 đến 350.000 VNĐ/con (khoảng 2.2 - 2.6kg vịt hơi), ăn kèm nước chấm lòng vịt pha mắc mật sánh đậm và dưa góp rau thơm.'
  },
  {
    id: 'qa_cost_25',
    province: 'Kon Tum',
    title: 'Giá sâm Ngọc Linh thật là bao nhiêu tiền 1 lạng?',
    question: 'Giá sâm củ Ngọc Linh Kon Tum chuẩn nguồn gốc khoảng bao nhiêu?',
    answer: 'Sâm Ngọc Linh là loại dược liệu đắt giá hàng đầu thế giới: Củ sâm tươi loại 20-30 củ/kg giá khoảng 70 - 90 triệu đồng/kg (khoảng 7-9 triệu/lạng); Củ sâm to loại 10-15 củ/kg giá từ 100 - 150 triệu đồng/kg; Các củ sâm rừng lâu năm quý hiếm có thể lên đến hàng trăm triệu đến cả tỷ đồng. Du khách nên mua tại Trung tâm giới thiệu Sâm Ngọc Linh huyện Tu Mơ Rông để tránh sâm giả.'
  },
  {
    id: 'qa_cost_26',
    province: 'Bắc Ninh',
    title: 'Giá vé tham quan Chùa Dâu, Chùa Bút Tháp, Đền Đô',
    question: 'Giá vé vào cửa các di tích lịch sử lớn tại Bắc Ninh?',
    answer: 'Hầu hết các di tích lịch sử, đình chùa tại Bắc Ninh như Đền Đô, Chùa Dâu, Chùa Bút Tháp, Chùa Phật Tích, Lăng Kinh Dương Vương đều mở cửa đón khách tự do với mức vé mang tính tượng trưng hoặc miễn phí (vé vào cửa chùa Bút Tháp khoảng 10.000đ, Đền Đô miễn phí hoặc 10.000đ/người).'
  },
  {
    id: 'qa_cost_27',
    province: 'Hưng Yên',
    title: 'Giá nhãn lồng Hưng Yên chính gốc vào vụ bao nhiêu 1kg?',
    question: 'Giá nhãn lồng Hưng Yên mua tại vườn vào tháng 7 - 8 khoảng bao nhiêu?',
    answer: 'Nhãn lồng tiến vua Hưng Yên cùi dày ráo nước, ngọt thanh mua tại vườn vào chính vụ (tháng 7 - 8) dao động từ 40.000 đến 70.000 VNĐ/kg tùy chất lượng quả. Long nhãn sấy khô sạch tự nhiên làm quà giá khoảng 250.000 - 350.000 VNĐ/kg.'
  },
  {
    id: 'qa_cost_28',
    province: 'Bình Phước',
    title: 'Giá hạt điều rang muối Bình Phước loại A cồ',
    question: 'Hạt điều rang muối Bình Phước nguyên lụa loại 1 giá bao nhiêu?',
    answer: 'Hạt điều rang muối nguyên vỏ lụa Bình Phước (loại A cồ hạt to mẩy, không mẻ vỡ) đóng hộp tròn 500g có giá dao động từ 130.000 đến 170.000 VNĐ/hộp (tương đương 260.000 - 340.000 VNĐ/kg).'
  },
  {
    id: 'qa_cost_29',
    province: 'Thái Nguyên',
    title: 'Giá trà Tân Cương Thái Nguyên các loại',
    question: 'Giá Trà đinh, Trà tôm nõn, Trà móc câu Tân Cương Thái Nguyên?',
    answer: 'Bảng giá trà Tân Cương theo phân cấp: Trà búp / Trà móc câu truyền thống: 250.000 - 450.000 VNĐ/kg; Trà tôm nõn thượng hạng (1 tôm 1 lá): 600.000 - 1.200.000 VNĐ/kg; Trà đinh ngọc cao cấp nhất (chỉ hái 1 đọt đinh non sáng sớm): 2.500.000 đến 5.000.000 VNĐ/kg.'
  },
  {
    id: 'qa_cost_30',
    province: 'Quảng Ngãi',
    title: 'Giá tỏi cô đơn Lý Sơn chính hiệu',
    question: 'Tỏi cô đơn (tỏi một tép) đảo Lý Sơn có giá bao nhiêu 1kg?',
    answer: 'Tỏi thường Lý Sơn (nhiều tép) có giá khoảng 150.000 - 250.000 VNĐ/kg. Riêng Tỏi cô đơn Lý Sơn (tỏi 1 tép hình tròn giàu dược chất) cực kỳ quý hiếm, giá dao động từ 1.000.000 đến 1.500.000 VNĐ/kg tỏi khô.'
  },
  {
    id: 'qa_cost_31',
    province: 'Hà Nam',
    title: 'Giá niêu cá kho làng Vũ Đại',
    question: 'Một niêu cá kho làng Vũ Đại chính gốc có giá bao nhiêu?',
    answer: 'Cá kho Vũ Đại (cá trắm đen kho niêu đất 16 tiếng củi nhãn) có giá tính theo trọng lượng cá tươi trong niêu: Niêu nhỏ 1.5kg giá khoảng 500.000 - 600.000đ; Niêu 2kg - 3kg giá khoảng 700.000 - 900.000đ; Niêu lớn 4kg - 5kg giá từ 1.100.000 đến 1.400.000 VNĐ/niêu.'
  },
  {
    id: 'qa_cost_32',
    province: 'Đồng Tháp',
    title: 'Giá vé nhà cổ Huỳnh Thủy Lê và ngủ lại qua đêm',
    question: 'Giá vé tham quan và giá phòng ngủ đêm tại Nhà cổ Huỳnh Thủy Lê Sa Đéc?',
    answer: 'Vé tham quan ban ngày kèm hướng dẫn viên thuyết minh tiếng Việt/Pháp/Anh và trà mứt: 40.000 VNĐ/người. Giá thuê phòng ngủ qua đêm trong gian phòng cổ của gia tộc Huỳnh Thủy Lê khoảng 1.000.000 - 1.500.000 VNĐ/phòng/đêm (bao gồm ăn sáng và ăn tối).'
  },
  {
    id: 'qa_cost_33',
    province: 'Gia Lai',
    title: 'Giá tour trekking Thác K50 Kon Chư Răng',
    question: 'Chi phí đi tour trekking thác K50 Gia Lai 2 ngày 1 đêm?',
    answer: 'Chi phí tham gia tour trekking thác K50 trọn gói ghép đoàn (xuất phát từ Quy Nhơn hoặc Pleiku) khoảng 2.200.000 - 2.800.000 VNĐ/người, bao gồm xe đưa đón, giấy phép vào khu bảo tồn, kiểm lâm dẫn đường, lều trại ngủ rừng, ăn uống 4 bữa và áo phao bảo hộ.'
  },
  {
    id: 'qa_cost_34',
    province: 'Thanh Hóa',
    title: 'Giá vé vào suối cá thần Cẩm Lương',
    question: 'Vé tham quan Suối cá thần Cẩm Lương Thanh Hóa bao nhiêu tiền?',
    answer: 'Giá vé tham quan Suối cá thần Cẩm Lương: Người lớn là 20.000 VNĐ/vé; Trẻ em là 10.000 VNĐ/vé. Dịch vụ xe điện chở từ bãi đỗ xe vào chân suối: 10.000 VNĐ/người/lượt.'
  },
  {
    id: 'qa_cost_35',
    province: 'Vĩnh Phúc',
    title: 'Giá vé vào cổng Flamingo Đại Lải Resort',
    question: 'Giá vé vào tham quan trong ngày tại Flamingo Đại Lải là bao nhiêu?',
    answer: 'Khách không lưu trú mua vé vào tham quan trong ngày: Người lớn khoảng 280.000 - 330.000 VNĐ/vé; Trẻ em (5-12 tuổi) khoảng 190.000 - 230.000 VNĐ/vé. Đã bao gồm xe điện nội khu, tham quan công viên nghệ thuật Art in the Forest, câu lạc bộ bãi biển và khu vui chơi.'
  },
  {
    id: 'qa_cost_36',
    province: 'Nam Định',
    title: 'Giá bánh xíu páo và bánh gai Bà Thi',
    question: 'Giá bánh xíu páo Nam Định và bánh gai Bà Thi mua ăn tại chỗ?',
    answer: 'Bánh xíu páo nướng nóng giòn nhân thịt xá xíu trứng có giá rất bình dân: chỉ từ 8.000 đến 12.000 VNĐ/chiếc. Bánh gai Bà Thi truyền thống nhân đậu xanh sen dừa thịt mỡ giá từ 12.000 đến 18.000 VNĐ/chiếc.'
  },
  {
    id: 'qa_cost_37',
    province: 'Hà Tĩnh',
    title: 'Giá mực nhảy Vũng Áng ăn tại bè',
    question: 'Mực nhảy Vũng Áng Kỳ Anh giá bao nhiêu 1kg?',
    answer: 'Mực nhảy tươi sống vớt từ lồng bè tại chỗ giá dao động từ 450.000 đến 700.000 VNĐ/kg tùy kích cỡ và theo mùa (mùa rộ từ tháng 4 đến tháng 7). Mực được chế biến hấp gừng hoặc nướng ngay tại bàn ăn giòn ngọt thơm lừng.'
  },
  {
    id: 'qa_cost_38',
    province: 'Lai Châu',
    title: 'Bảng giá tắm lá thuốc người Dao Đỏ tại Sìn Hồ',
    question: 'Giá một lượt ngâm bồn tắm lá thuốc cổ truyền người Dao Đỏ ở Sìn Hồ?',
    answer: 'Dịch vụ ngâm bồn gỗ thông pơ-mu với nước lá thuốc thảo dược cổ truyền (nấu từ hơn 20 loại vỏ và rễ cây rừng) tại Sìn Hồ hoặc Tam Đường có giá dao động từ 80.000 đến 120.000 VNĐ/lượt ngâm 20-30 phút.'
  },
  {
    id: 'qa_cost_39',
    province: 'Đồng Tháp',
    title: 'Giá nem Lai Vung mua làm quà',
    question: 'Một xâu nem Lai Vung Đồng Tháp giá bao nhiêu tiền?',
    answer: 'Nem Lai Vung đóng gói theo xâu 10 chiếc bọc lá chuối hoặc hộp nhựa 10 chiếc có giá dao động từ 35.000 đến 50.000 VNĐ/chục tùy thương hiệu uy tín (như Nem Giáo Thơ, Nem Út Thẳng, Nem Hoàng Sơn).'
  },
  {
    id: 'qa_cost_40',
    province: 'Toàn quốc',
    title: 'Mẹo tiết kiệm chi phí du lịch tự túc tối đa',
    question: 'Những bí quyết vàng giúp tiết kiệm 30-40% chi phí khi du lịch tự túc?',
    answer: 'Bí quyết: 1) Săn vé máy bay/tàu xe trước 1-2 tháng và tránh các ngày cao điểm cuối tuần; 2) Đi theo nhóm từ 4-6 người để chia đều tiền phòng khách sạn, xe thuê và mâm cơm gia đình; 3) Ăn uống tại các quán ăn dân dã đông người bản địa thay vì nhà hàng du lịch ven đường; 4) Mua vé tham quan combo hoặc đặt qua các ứng dụng du lịch; 5) Thuê xe máy tự túc thay vì đi taxi đoạn đường dài.'
  },

  // =========================================================================
  // CHỦ ĐỀ 3 (PHẦN 1): DU LỊCH THEO ĐỐI TƯỢNG - GIA ĐÌNH & CẶP ĐÔI (20 CÂU)
  // =========================================================================
  {
    id: 'qa_style_01',
    province: 'Vĩnh Phúc',
    title: 'Du lịch gia đình: Nghỉ dưỡng Tam Đảo - Đại Lải cho người già và trẻ nhỏ',
    question: 'Gia đình có người cao tuổi và trẻ nhỏ đi Vĩnh Phúc nên chọn Tam Đảo hay Flamingo Đại Lải?',
    answer: 'Flamingo Đại Lải phù hợp hơn cho người cao tuổi và trẻ nhỏ nhờ địa hình bằng phẳng ven hồ, không phải leo dốc đèo quanh co, có xe điện đưa đón tận cửa villa, bể bơi nước ấm 4 mùa, bãi cỏ rộng rãi và khu vui chơi trẻ em an toàn. Tam Đảo thích hợp hơn nếu gia đình muốn đổi gió hưởng khí hậu lạnh, nhưng cần lưu ý đường dốc nhiều bậc thang đá dốc đứng.'
  },
  {
    id: 'qa_style_02',
    province: 'Kon Tum',
    title: 'Du lịch cặp đôi: Tuần trăng mật lãng mạn tại Măng Đen',
    question: 'Măng Đen có điểm gì hấp dẫn các cặp đôi đi trăng mật hoặc hẹn hò?',
    answer: 'Măng Đen sở hữu khí hậu se lạnh quanh năm dưới 20 độ C, sương mây bồng bềnh giữa rừng thông tĩnh lặng không xô bồ thương mại hóa như Đà Lạt. Các cặp đôi có thể dạo bước bên hồ Đăk Ke rợp bóng mai anh đào mùa xuân, sưởi ấm bên bếp lửa homestay gỗ xinh xắn, thưởng thức lẩu xuyên tiêu cay nồng và cà phê ngắm mây trôi bình yên.'
  },
  {
    id: 'qa_style_03',
    province: 'Miền Tây',
    title: 'Du lịch gia đình: Tour miệt vườn Sa Đéc - Cần Thơ cho cả gia đình',
    question: 'Lịch trình du lịch miền Tây 2 ngày 1 đêm thư giãn nhẹ nhàng cho gia đình 3 thế hệ?',
    answer: 'Ngày 1: Xe đưa đón từ TP.HCM về Sa Đéc (Đồng Tháp), ghé làng hoa Sa Đéc dạo ngắm hoa trên lối đi bê tông thoáng mát không phải lội bùn, thăm nhà cổ Huỳnh Thủy Lê nghe thuyết minh lịch sử; chiều sang Cần Thơ nghỉ khách sạn 4 sao ven sông Hậu, tối lên du thuyền bến Ninh Kiều ăn tối nghe đờn ca tài tử. Ngày 2: Sáng đi thuyền lớn tham quan chợ nổi Cái Răng nhẹ nhàng, vào vườn cây trái Chín Hồng hái trái cây ăn tại chỗ, trưa ăn bánh xèo miền Tây rồi về.'
  },
  {
    id: 'qa_style_04',
    province: 'Thanh Hóa',
    title: 'Du lịch gia đình: Biển Sầm Sơn và FLC Sầm Sơn',
    question: 'Đưa gia đình đi nghỉ mát Sầm Sơn nên chọn bãi tắm và khu vực nào để đỡ xô bồ?',
    answer: 'Nên chọn khu vực Bãi D Sầm Sơn hoặc quần thể nghỉ dưỡng FLC Sầm Sơn nằm ở phía nam đường Hồ Xuân Hương. Khu vực này bãi cát sạch sẽ, không gian thoáng đãng riêng tư, có bãi tắm riêng và hệ thống bể bơi nước mặn trong nhà ngoài trời rất an toàn cho trẻ nhỏ và người lớn tuổi nghỉ ngơi.'
  },
  {
    id: 'qa_style_05',
    province: 'Hà Nam',
    title: 'Du lịch người cao tuổi: Hành hương Chùa Tam Chúc và Địa Tạng Phi Lai',
    question: 'Người già đi chùa Tam Chúc và chùa Địa Tạng Phi Lai Tự có đi lại dễ dàng không?',
    answer: 'Cả 2 ngôi chùa đều có hạ tầng rất thuận lợi cho người cao tuổi: Chùa Tam Chúc có hệ thống xe điện và du thuyền di chuyển êm ái xuyên suốt giữa các cổng và tòa điện, các lối đi đều có bậc tam cấp thoải và đường dốc nhẹ. Chùa Địa Tạng Phi Lai Tự (Thanh Liêm) có khuôn viên rải sỏi trắng phẳng phiu, không gian thiền định yên tĩnh dưới chân núi.'
  },
  {
    id: 'qa_style_06',
    province: 'Đắk Nông',
    title: 'Du lịch cặp đôi: Hẹn hò ngắm hoàng hôn Hồ Tà Đùng',
    question: 'Trải nghiệm lãng mạn nhất cho các cặp đôi tại Hồ Tà Đùng?',
    answer: 'Trải nghiệm tuyệt vời nhất là đặt phòng tại các glamping/homestay trên triền đồi có ban công hoặc lều trong suốt view thẳng ra lòng hồ Tà Đùng. Cùng nhau thưởng thức bữa tiệc nướng BBQ ngoài trời ngắm hoàng hôn đỏ rực buông xuống mặt hồ, sáng thức dậy sớm săn biển mây cuồn cuộn phủ kín các ốc đảo ngay trước tầm mắt.'
  },
  {
    id: 'qa_style_07',
    province: 'Quảng Ngãi',
    title: 'Du lịch gia đình: Đưa trẻ nhỏ ra đảo Lý Sơn cần chuẩn bị gì?',
    question: 'Gia đình có trẻ em từ 3 - 6 tuổi đi đảo Lý Sơn cần lưu ý những điều gì?',
    answer: 'Lưu ý quan trọng: 1) Chọn đi tàu cao tốc lớn (chạy 35 phút) vào buổi sáng khi biển lặng sóng để bé không bị say sóng; 2) Chuẩn bị đầy đủ nón rộng vành, kem chống nắng, áo khoác mỏng vì nắng đảo Lý Sơn rất gắt; 3) Khi sang Đảo Bé tắm biển bãi cát thoai thoải cần mặc áo phao trẻ em chuyên dụng và có người lớn giám sát chặt chẽ; 4) Mang theo men vi sinh và thuốc hạ sốt phòng khi bé lạ nước lạ thức ăn.'
  },
  {
    id: 'qa_style_08',
    province: 'Thái Nguyên',
    title: 'Du lịch gia đình: Trải nghiệm giáo dục văn hóa tại Bảo tàng 54 Dân tộc và Làng Thái Hải',
    question: 'Điểm du lịch nào ở Thái Nguyên mang tính giáo dục trải nghiệm bổ ích cho học sinh, trẻ nhỏ?',
    answer: 'Bảo tàng Văn hóa các Dân tộc Việt Nam (TP. Thái Nguyên) với 5 phòng trưng bày hiện đại tái hiện sinh động trang phục, nhạc cụ, nhà ở của 54 dân tộc. Kế đó là Khu bảo tồn làng nhà sàn Thái Hải - nơi các bé được trải nghiệm làm nông dân, giã gạo, học hát then gảy đàn tính và học tinh thần đoàn kết cộng đồng.'
  },
  {
    id: 'qa_style_09',
    province: 'Bắc Ninh',
    title: 'Du lịch gia đình: Trải nghiệm in tranh Đông Hồ và nặn gốm cho trẻ nhỏ',
    question: 'Đưa con nhỏ về Bắc Ninh trải nghiệm làng nghề thủ công ở đâu?',
    answer: 'Đến Trung tâm bảo tồn tranh dân gian Đông Hồ (Thuận Thành), các bé được nghệ nhân hướng dẫn cầm chổi lá thông quét màu tự nhiên lên mộc bản gỗ rồi in tranh "Đám cưới chuột", "Chăn trâu thả diều" mang về làm kỷ niệm. Ghé làng gốm Phù Lãng (Quế Võ), các bé được tự tay nhào nặn đất sét trên bàn xoay làm chiếc cốc, con giống gốm ngộ nghĩnh.'
  },
  {
    id: 'qa_style_10',
    province: 'Hà Tĩnh',
    title: 'Du lịch người cao tuổi: Nghỉ dưỡng biển Thiên Cầm và suối khoáng Sơn Kim',
    question: 'Tuyến du lịch phục hồi sức khỏe cho người lớn tuổi tại Hà Tĩnh?',
    answer: 'Hành trình 3 ngày kết hợp: Bãi biển Thiên Cầm sóng êm cát phẳng thoai thoải đi dạo sáng sớm hít thở không khí i-ốt trong lành; sau đó lên khu du lịch suối nước khoáng nóng Nước Sốt Sơn Kim (Hương Sơn) ngâm tắm nước khoáng tự nhiên 40-50 độ C giữa rừng nguyên sinh giúp lưu thông khí huyết, trị đau khớp và thư giãn thần kinh.'
  },
  {
    id: 'qa_style_11',
    province: 'Cà Mau',
    title: 'Du lịch gia đình: Hành trình chinh phục Đất Mũi Cà Mau',
    question: 'Cả gia đình lái xe tự lái về Đất Mũi Cà Mau cần lưu ý điều gì?',
    answer: 'Tuyến đường Hồ Chí Minh từ TP. Cà Mau xuống Đất Mũi đã trải nhựa rất đẹp nhưng đường hẹp 2 làn xe và nhiều cầu bê tông dốc gù, cần lái xe đúng tốc độ 50-60km/h. Tại Đất Mũi, cả nhà đi xe điện dạo quanh công viên ngắm Cột mốc tọa độ và Cột cờ Hà Nội rất thong thả, thích hợp cho cả ông bà và trẻ nhỏ chụp ảnh kỷ niệm.'
  },
  {
    id: 'qa_style_12',
    province: 'Lai Châu',
    title: 'Du lịch cặp đôi: Cổng trời Ô Quy Hồ ngắm hoàng hôn',
    question: 'Điểm ngắm hoàng hôn lãng mạn nhất Tây Bắc dành cho các cặp đôi?',
    answer: 'Đỉnh đèo Ô Quy Hồ (phía Lai Châu) vào khoảng 17h00 - 17h45 chiều. Khi mặt trời đỏ ối như hòn than từ từ chìm xuống biển mây cuồn cuộn giữa dãy núi Hoàng Liên Sơn hùng vĩ, thưởng thức tách trà nóng và trứng nướng bên người thương là khoảnh khắc kỳ diệu khó quên.'
  },
  {
    id: 'qa_style_13',
    province: 'Thanh Hóa',
    title: 'Du lịch cặp đôi: Nghỉ dưỡng riêng tư Pù Luông Retreat',
    question: 'Trải nghiệm nghỉ dưỡng cho cặp đôi tại Pù Luông có gì đặc biệt?',
    answer: 'Các bungalow nhà sàn gỗ biệt lập lợp mái cọ với ban công kính mở toang nhìn thẳng ra thung lũng ruộng bậc thang xanh ngát. Cùng nhau bơi tại bể bơi vô cực tràn bờ soi bóng núi mây, ngắm đom đóm lập lòe đêm hè và thưởng thức bữa tối lãng mạn bên ánh nến lung linh giữa đại ngàn.'
  },
  {
    id: 'qa_style_14',
    province: 'Bắc Giang',
    title: 'Du lịch gia đình: Trải nghiệm hái vải thiều Lục Ngạn mùa hè',
    question: 'Gia đình đưa con nhỏ đi hái vải thiều Lục Ngạn vào thời điểm nào vui nhất?',
    answer: 'Nên đi vào khoảng giữa tháng 6 đến đầu tháng 7 dương lịch. Đến các nhà vườn sinh thái tại Lục Ngạn (xã Quý Sơn, Hồng Giang), các bé được tự tay trèo thang hái những chùm vải thiều đỏ rực mọng nước ngay trên cành, ăn vải ngọt lịm tại vườn và học cách đóng sọt vải cùng người nông dân.'
  },
  {
    id: 'qa_style_15',
    province: 'Gia Lai',
    title: 'Du lịch cặp đôi: Chụp ảnh đôi lãng mạn tại Hàng thông trăm tuổi Pleiku',
    question: 'Địa điểm chụp ảnh cưới hoặc ảnh đôi đẹp nhất tại Pleiku?',
    answer: 'Con đường Hàng thông trăm tuổi dẫn vào Biển Hồ Chè (huyện Chư Păh) với hai hàng thông cổ thụ vươn cao rợp bóng kim xanh rì, điểm xuyết hoa dã quỳ vàng ven đường vào mùa đông, được mệnh danh là "con đường tình yêu" đẹp như phim trường lãng mạn.'
  },
  {
    id: 'qa_style_16',
    province: 'Long An',
    title: 'Du lịch gia đình cuối tuần: Cắm trại dã ngoại Làng nổi Tân Lập',
    question: 'Gia đình từ TP.HCM đi chơi Làng nổi Tân Lập trong ngày có mệt không?',
    answer: 'Rất nhẹ nhàng vì chỉ cách TP.HCM hơn 2 giờ chạy xe. Các bé được đi xuồng ba lá len lỏi rừng tràm, ngắm hoa sen, hoa súng nở rộ, đi dạo trên con đường bê tông rợp bóng mát không có xe cộ nguy hiểm, thưởng thức bữa trưa cá lóc nướng trui và trở về TP.HCM trước 18h tối.'
  },
  {
    id: 'qa_style_17',
    province: 'Hưng Yên',
    title: 'Du lịch gia đình: Thăm làng đan đó Thủ Sỹ và nếm nhãn lồng',
    question: 'Trải nghiệm du lịch văn hóa làng quê cho gia đình tại Hưng Yên?',
    answer: 'Đưa con nhỏ về làng Thủ Sỹ ngắm các cụ già đan đó tre thoăn thoắt, xem cách đan ngư cụ bẫy cá truyền thống của cha ông; ghé vườn nhãn Phố Hiến tự tay bẻ chùm nhãn ngọt mát và thưởng thức bát chè sen long nhãn thanh tao bên hồ Bán Nguyệt.'
  },
  {
    id: 'qa_style_18',
    province: 'Bình Phước',
    title: 'Du lịch gia đình: Dã ngoại picnic Trảng cỏ Bù Lạch',
    question: 'Đi cắm trại dã ngoại gia đình tại Trảng cỏ Bù Lạch cần chuẩn bị gì?',
    answer: 'Trảng cỏ Bù Lạch là thảo nguyên cỏ tự nhiên bao quanh hồ nước ngọt. Gia đình nên mang theo thảm trải picnic, lều che nắng, đồ ăn nhẹ, xúc xích và thịt ướp sẵn để nướng BBQ. Trẻ nhỏ có thể thỏa thích chạy nhảy trên thảm cỏ xanh mịn màng, thả diều và ngắm đàn bò gặm cỏ thanh bình.'
  },
  {
    id: 'qa_style_19',
    province: 'Nam Định',
    title: 'Du lịch gia đình: Tour khám phá thánh đường nhà thờ và biển Hải Hậu',
    question: 'Gia đình đi Nam Định 1 ngày cuối tuần nên ghé những điểm nào?',
    answer: 'Buổi sáng ghé TP. Nam Định ăn phở bò Giao Cù, thăm Đền Trần; sau đó xuôi Hải Hậu chiêm ngưỡng Vương cung thánh đường Phú Nhai nguy nga cho các bé ngắm kiến trúc lâu đài châu Âu, chiều ghé nhà thờ đổ Hải Lý đón gió biển, ăn nem nắm và mua bánh xíu páo nóng hổi về làm quà.'
  },
  {
    id: 'qa_style_20',
    province: 'Đồng Tháp',
    title: 'Du lịch gia đình: Đứng trên lá sen khổng lồ tại Chùa Phước Kiển',
    question: 'Trẻ em và người lớn có thể đứng lên lá sen khổng lồ Chùa Lá Sen chụp ảnh thật không?',
    answer: 'Hoàn toàn có thật! Tại Chùa Phước Kiển (huyện Châu Thành, Đồng Tháp), lá sen vua khổng lồ có đường kính tới 2m. Nhà chùa đặt một chiếc mâm thiếc tròn mỏng lên trên mặt lá để phân tán đều trọng lượng, trẻ em và người lớn dưới 65-70kg có thể bước lên đứng hoặc ngồi tạo dáng chụp ảnh mà lá không hề bị chìm hay rách.'
  }
];
