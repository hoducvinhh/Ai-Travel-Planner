import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Danh sách các địa điểm du lịch THẬT 100% tại Hà Nội
const REAL_HANOI_PLACES = [
  { name: "Hoàng Thành Thăng Long", desc: "Di sản văn hóa thế giới với hàng ngàn năm lịch sử kinh kỳ", cat: ["Historical", "Culture", "Heritage"], lat: 21.0336, lon: 105.8406, price: 30000, io: "both", act: "medium" },
  { name: "Lăng Chủ Tịch Hồ Chí Minh", desc: "Nơi an nghỉ của Chủ tịch Hồ Chí Minh tại Quảng trường Ba Đình", cat: ["Historical", "Culture", "Monument"], lat: 21.0368, lon: 105.8347, price: 0, io: "both", act: "low" },
  { name: "Chùa Một Cột", desc: "Ngôi chùa cổ có kiến trúc đài sen độc đáo bậc nhất châu Á", cat: ["Temple", "Religious", "Historical"], lat: 21.0358, lon: 105.8335, price: 0, io: "outdoor", act: "low" },
  { name: "Nhà Tù Hỏa Lò", desc: "Di tích lịch sử minh chứng cho tinh thần kiên cường bất khuất", cat: ["Historical", "Museum", "Education"], lat: 21.0253, lon: 105.8465, price: 30000, io: "indoor", act: "low" },
  { name: "Cầu Long Biên", desc: "Cây cầu lịch sử trăm tuổi bắc qua sông Hồng biểu tượng của thủ đô", cat: ["Historical", "Architecture", "Photo Spot"], lat: 21.0425, lon: 105.8569, price: 0, io: "outdoor", act: "medium" },
  { name: "Bảo Tàng Dân Tộc Học Việt Nam", desc: "Không gian trưng bày nét đặc sắc của 54 dân tộc Việt Nam", cat: ["Museum", "Culture", "Education"], lat: 21.0406, lon: 105.7986, price: 40000, io: "both", act: "medium" },
  { name: "Chùa Trấn Quốc", desc: "Ngôi chùa cổ nhất Thăng Long nằm soi bóng bên bờ Hồ Tây", cat: ["Temple", "Religious", "Scenic"], lat: 21.0478, lon: 105.8364, price: 0, io: "both", act: "low" },
  { name: "Nhà Thờ Lớn Hà Nội", desc: "Công trình kiến trúc Gothic Pháp cổ kính giữa lòng phố cổ", cat: ["Religious", "Architecture", "Photo Spot"], lat: 21.0288, lon: 105.8495, price: 0, io: "both", act: "low" },
  { name: "Hồ Tây", desc: "Hồ nước tự nhiên lớn nhất Hà Nội với không gian lộng gió và ẩm thực phong phú", cat: ["Nature", "Lake", "Scenic"], lat: 21.0583, lon: 105.8236, price: 0, io: "outdoor", act: "medium" },
  { name: "Nhà Hát Lớn Hà Nội", desc: "Tuyệt tác kiến trúc Tân cổ điển phong cách Pháp đầu thế kỷ 20", cat: ["Architecture", "Culture", "Art"], lat: 21.0242, lon: 105.8576, price: 0, io: "indoor", act: "low" },
  { name: "Đền Quán Thánh", desc: "Một trong Thăng Long Tứ Trấn thờ Huyền Thiên Trấn Vũ", cat: ["Temple", "Historical", "Culture"], lat: 21.0436, lon: 105.8383, price: 10000, io: "indoor", act: "low" },
  { name: "Đền Ngọc Sơn", desc: "Ngôi đền linh thiêng trên đảo Ngọc giữa lòng Hồ Gươm", cat: ["Temple", "Historical", "Lake"], lat: 21.0307, lon: 105.8524, price: 30000, io: "both", act: "low" },
  { name: "Làng Gốm Bát Tràng", desc: "Làng nghề gốm sứ truyền thống trứ danh với trải nghiệm tự vuốt gốm", cat: ["Culture", "Craft", "Shopping"], lat: 20.9789, lon: 105.9122, price: 0, io: "both", act: "high" },
  { name: "Làng Cổ Đường Lâm", desc: "Ngôi làng cổ đá ong nguyên sơ lưu giữ hồn quê Bắc Bộ", cat: ["Historical", "Culture", "Village"], lat: 21.1444, lon: 105.4744, price: 20000, io: "outdoor", act: "medium" },
  { name: "Chùa Hương", desc: "Quần thể văn hóa tôn giáo danh thắng giữa núi rừng sông nước tuyệt đẹp", cat: ["Temple", "Nature", "Scenic"], lat: 20.6186, lon: 105.7533, price: 80000, io: "outdoor", act: "high" },
  { name: "Phố Sách Hà Nội", desc: "Không gian tri thức yên tĩnh và xanh mát giữa trung tâm thủ đô", cat: ["Culture", "Shopping", "Relax"], lat: 21.0258, lon: 105.8472, price: 0, io: "outdoor", act: "low" },
  { name: "Chợ Đêm Phố Cổ", desc: "Chợ đêm sầm uất với đủ loại hàng hóa và ẩm thực đường phố Hà Nội", cat: ["Market", "Food", "Shopping"], lat: 21.0350, lon: 105.8519, price: 0, io: "outdoor", act: "high" },
  { name: "Vườn Bách Thảo Hà Nội", desc: "Lá phổi xanh yên bình với hàng ngàn cây cổ thụ trăm năm tuổi", cat: ["Nature", "Park", "Relax"], lat: 21.0392, lon: 105.8294, price: 10000, io: "outdoor", act: "medium" },
  { name: "Công Viên Thủ Lệ", desc: "Vườn bách thú kết hợp công viên vui chơi giải trí cho gia đình", cat: ["Park", "Nature", "Family"], lat: 21.0319, lon: 105.8117, price: 30000, io: "outdoor", act: "medium" },
  { name: "Cột Cờ Hà Nội", desc: "Di tích lịch sử quân sự kỳ vĩ nằm trong khuôn viên Bảo tàng Quân đội", cat: ["Historical", "Monument", "Culture"], lat: 21.0325, lon: 105.8397, price: 20000, io: "outdoor", act: "low" },
  { name: "Bảo Tàng Lịch Sử Quân Sự", desc: "Nơi lưu giữ các hiện vật chiến tranh và trang thiết bị quân sự lịch sử", cat: ["Museum", "Historical", "Education"], lat: 21.0322, lon: 105.8403, price: 40000, io: "both", act: "medium" },
  { name: "Bảo Tàng Mỹ Thuật Việt Nam", desc: "Kho tàng các tác phẩm hội họa, điêu khắc đỉnh cao qua các thời kỳ", cat: ["Museum", "Art", "Culture"], lat: 21.0294, lon: 105.8339, price: 40000, io: "indoor", act: "low" },
  { name: "Chùa Quán Sứ", desc: "Trụ sở của Giáo hội Phật giáo Việt Nam với không gian trang nghiêm", cat: ["Temple", "Religious", "Culture"], lat: 21.0256, lon: 105.8453, price: 0, io: "both", act: "low" },
  { name: "Làng Lụa Vạn Phúc", desc: "Cái nôi dệt lụa tơ tằm truyền thống nổi tiếng tinh tế", cat: ["Culture", "Craft", "Shopping"], lat: 20.9781, lon: 105.7689, price: 0, io: "both", act: "medium" },
  { name: "Phủ Tây Hồ", desc: "Chốn linh thiêng thờ Mẫu Liễu Hạnh nằm trên bán đảo Hồ Tây", cat: ["Temple", "Religious", "Lake"], lat: 21.0617, lon: 105.8292, price: 0, io: "both", act: "low" },
  { name: "Tháp Nước Hàng Đậu", desc: "Tháp nước cổ kính hình tròn tựa như pháo đài giữa lòng ngã sáu", cat: ["Historical", "Architecture", "Photo Spot"], lat: 21.0408, lon: 105.8475, price: 0, io: "outdoor", act: "low" },
  { name: "Quảng Trường Ba Đình", desc: "Quảng trường lịch sử lớn nhất Việt Nam nơi diễn ra các lễ kỷ niệm trọng đại", cat: ["Historical", "Culture", "Monument"], lat: 21.0372, lon: 105.8358, price: 0, io: "outdoor", act: "medium" },
  { name: "Công Viên Thống Nhất", desc: "Công viên cây xanh rộng lớn bao quanh Hồ Bảy Mẫu thoáng mát", cat: ["Nature", "Park", "Relax"], lat: 21.0125, lon: 105.8447, price: 10000, io: "outdoor", act: "medium" },
  { name: "Hồ Trúc Bạch", desc: "Hồ nước thơ mộng gắn liền với làng nghề đúc đồng Ngũ Xã và ẩm thực phở cuốn", cat: ["Nature", "Lake", "Food"], lat: 21.0461, lon: 105.8389, price: 0, io: "outdoor", act: "low" },
  { name: "Cầu Nhật Tân", desc: "Cây cầu dây văng hiện đại rực rỡ ánh đèn về đêm trên sông Hồng", cat: ["Architecture", "Photo Spot", "Urban"], lat: 21.0911, lon: 105.8206, price: 0, io: "outdoor", act: "low" },
  { name: "Thiên Đường Bảo Sơn", desc: "Tổ hợp giải trí đa năng với thủy cung, safari và làng nghề truyền thống", cat: ["Entertainment", "Theme Park", "Family"], lat: 20.9994, lon: 105.7317, price: 150000, io: "both", act: "high" },
  { name: "Bảo Tàng Phụ Nữ Việt Nam", desc: "Tôn vinh vẻ đẹp, lịch sử và những đóng góp to lớn của phụ nữ Việt Nam", cat: ["Museum", "Culture", "Education"], lat: 21.0239, lon: 105.8522, price: 40000, io: "indoor", act: "low" },
  { name: "Phố Bích Họa Phùng Hưng", desc: "Con phố nghệ thuật tái hiện sinh động ký ức Hà Nội xưa trên vòm cầu đá", cat: ["Art", "Photo Spot", "Walking"], lat: 21.0378, lon: 105.8469, price: 0, io: "outdoor", act: "medium" },
  { name: "Chùa Thầy", desc: "Danh lam thắng cảnh gắn liền với cuộc đời thiền sư Từ Đạo Hạnh", cat: ["Temple", "Historical", "Nature"], lat: 20.9947, lon: 105.6267, price: 20000, io: "outdoor", act: "medium" },
  { name: "Chùa Tây Phương", desc: "Bảo tàng tượng Phật giáo bằng gỗ độc đáo với 18 vị La Hán trứ danh", cat: ["Temple", "Historical", "Art"], lat: 21.0278, lon: 105.5786, price: 20000, io: "indoor", act: "medium" },
  { name: "Đền Bạch Mã", desc: "Ngôi đền cổ nhất Thăng Long trấn giữ phía Đông kinh thành", cat: ["Temple", "Historical", "Culture"], lat: 21.0353, lon: 105.8514, price: 0, io: "indoor", act: "low" },
  { name: "Ô Quan Chưởng", desc: "Cửa ô duy nhất còn nguyên vẹn của kinh thành Thăng Long xưa", cat: ["Historical", "Architecture", "Photo Spot"], lat: 21.0369, lon: 105.8536, price: 0, io: "outdoor", act: "low" },
  { name: "Vườn Hoa Bãi Đá Sông Hồng", desc: "Điểm chụp ảnh ngoài trời ngập tràn sắc hoa rực rỡ ven bờ sông", cat: ["Nature", "Garden", "Photo Spot"], lat: 21.0708, lon: 105.8361, price: 50000, io: "outdoor", act: "medium" },
  { name: "Phố Tạ Hiện", desc: "Con phố không ngủ nổi tiếng với bia hơi, ẩm thực đường phố và không khí náo nhiệt", cat: ["Nightlife", "Food", "Street Food"], lat: 21.0347, lon: 105.8528, price: 0, io: "outdoor", act: "high" },
  { name: "Chợ Hoa Quảng Bá", desc: "Chợ hoa đầu mối nhộn nhịp trong đêm mang vẻ đẹp bình dị của thủ đô", cat: ["Market", "Nightlife", "Culture"], lat: 21.0667, lon: 105.8317, price: 0, io: "outdoor", act: "medium" },
  { name: "Làng Nón Chuông", desc: "Làng nghề làm nón lá truyền thống hàng trăm năm tuổi bên bờ sông Đáy", cat: ["Culture", "Craft", "Village"], lat: 20.8528, lon: 105.7486, price: 0, io: "both", act: "medium" },
  { name: "Phim Trường Smiley Ville", desc: "Không gian kiến trúc châu Âu tráng lệ điểm hẹn check-in chụp ảnh ấn tượng", cat: ["Photo Spot", "Architecture", "Entertainment"], lat: 21.1378, lon: 105.8756, price: 100000, io: "both", act: "medium" },
  { name: "Cung Văn Hóa Hữu Nghị Việt Xô", desc: "Trung tâm văn hóa nghệ thuật và triển lãm lớn của Hà Nội", cat: ["Culture", "Architecture", "Art"], lat: 21.0236, lon: 105.8436, price: 0, io: "indoor", act: "low" },
  { name: "Bảo Tàng Lịch Sử Quốc Gia", desc: "Lưu giữ hàng vạn cổ vật quý giá phản ánh tiến trình dựng nước và giữ nước", cat: ["Museum", "Historical", "Culture"], lat: 21.0247, lon: 105.8589, price: 40000, io: "indoor", act: "low" },
  { name: "Chợ Hàng Bè", desc: "Khu chợ ẩm thực nức tiếng phố cổ với các món ăn truyền thống chuẩn vị Hà Nội", cat: ["Market", "Food", "Local"], lat: 21.0331, lon: 105.8533, price: 0, io: "outdoor", act: "medium" },
  { name: "Vườn Hoa Lý Thái Tổ", desc: "Không gian sinh hoạt cộng đồng trang trọng với tượng đài vua Lý Thái Tổ", cat: ["Park", "Monument", "Walking"], lat: 21.0286, lon: 105.8547, price: 0, io: "outdoor", act: "low" },
  { name: "Đài Quan Sát Lotte Center", desc: "Ngắm trọn vẹn toàn cảnh Hà Nội từ tầng 65 với sàn kính skywalk ấn tượng", cat: ["View", "Urban", "Entertainment"], lat: 21.0328, lon: 105.8122, price: 180000, io: "indoor", act: "low" },
  { name: "Chùa Đậu", desc: "Ngôi chùa cổ kính lưu giữ nhục thân bất hoại của hai vị thiền sư", cat: ["Temple", "Religious", "Historical"], lat: 20.8653, lon: 105.8778, price: 0, io: "both", act: "low" },
  { name: "Phố Đi Bộ Hồ Gươm", desc: "Không gian phố đi bộ sôi động cuối tuần với nhiều hoạt động văn hóa đường phố", cat: ["Walking", "Entertainment", "Culture"], lat: 21.0294, lon: 105.8539, price: 0, io: "outdoor", act: "high" },
  { name: "Hồ B52 - Làng Ngọc Hà", desc: "Dấu tích xác máy bay B52 giữa lòng hồ mang đậm ý nghĩa lịch sử", cat: ["Historical", "Monument", "Local"], lat: 21.0369, lon: 105.8286, price: 0, io: "outdoor", act: "low" },
  { name: "Vườn Quốc Gia Ba Vì", desc: "Khu sinh thái rừng núi xanh mát với khí hậu ôn đới lý tưởng cho dã ngoại", cat: ["Nature", "Mountain", "Adventure"], lat: 21.0806, lon: 105.3622, price: 60000, io: "outdoor", act: "high" }
];

// Danh sách các địa điểm du lịch THẬT 100% tại TP. Hồ Chí Minh
const REAL_HCM_PLACES = [
  { name: "Bưu Điện Trung Tâm Sài Gòn", desc: "Tuyệt tác kiến trúc cổ điển Pháp với vòm trần tráng lệ và các bốt điện thoại cổ", cat: ["Architecture", "Historical", "Photo Spot"], lat: 10.7798, lon: 106.6999, price: 0, io: "both", act: "low" },
  { name: "Landmark 81 SkyView", desc: "Tòa tháp cao nhất Việt Nam ngắm toàn cảnh thành phố rực rỡ từ độ cao gần 400m", cat: ["View", "Architecture", "Luxury"], lat: 10.7950, lon: 106.7219, price: 300000, io: "indoor", act: "low" },
  { name: "Thảo Cầm Viên Sài Gòn", desc: "Vườn bách thảo lâu đời bậc nhất thế giới với hệ sinh thái động thực vật phong phú", cat: ["Nature", "Park", "Family"], lat: 10.7875, lon: 106.7053, price: 60000, io: "outdoor", act: "medium" },
  { name: "Chùa Bửu Long", desc: "Ngôi chùa lộng lẫy phong cách Thái Lan được vinh danh trong top đẹp nhất thế giới", cat: ["Temple", "Religious", "Architecture"], lat: 10.8711, lon: 106.8378, price: 0, io: "both", act: "medium" },
  { name: "Khu Du Lịch Suối Tiên", desc: "Công viên văn hóa giải trí liên hoàn với các huyền tích dân tộc độc đáo", cat: ["Theme Park", "Family", "Entertainment"], lat: 10.8661, lon: 106.8028, price: 120000, io: "both", act: "high" },
  { name: "Địa Đạo Củ Chi", desc: "Hệ thống đường hầm ngầm kỳ vĩ huyền thoại biểu tượng kháng chiến oanh liệt", cat: ["Historical", "Education", "Adventure"], lat: 11.1436, lon: 106.4631, price: 90000, io: "both", act: "high" },
  { name: "Bến Nhà Rồng", desc: "Bảo tàng Hồ Chí Minh nơi Bác Hồ ra đi tìm đường cứu nước", cat: ["Historical", "Museum", "Culture"], lat: 10.7681, lon: 106.7067, price: 30000, io: "both", act: "low" },
  { name: "Phố Tây Bùi Viện", desc: "Khu phố giải trí sôi động về đêm thu hút đông đảo du khách quốc tế", cat: ["Nightlife", "Food", "Entertainment"], lat: 10.7674, lon: 106.6934, price: 0, io: "outdoor", act: "high" },
  { name: "Bảo Tàng Mỹ Thuật TP.HCM", desc: "Dinh thự cổ kiến trúc Art Deco trưng bày các kiệt tác nghệ thuật hội họa", cat: ["Art", "Museum", "Architecture"], lat: 10.7700, lon: 106.6997, price: 30000, io: "indoor", act: "low" },
  { name: "Chùa Ngọc Hoàng", desc: "Ngôi chùa cổ kính linh thiêng từng được Tổng thống Barack Obama ghé thăm", cat: ["Temple", "Religious", "Historical"], lat: 10.7917, lon: 106.6983, price: 0, io: "indoor", act: "low" },
  { name: "Bitexco Financial Tower", desc: "Tòa tháp biểu tượng hình búp sen với đài quan sát Saigon Skydeck", cat: ["View", "Architecture", "Urban"], lat: 10.7717, lon: 106.7044, price: 200000, io: "indoor", act: "low" },
  { name: "Chợ Lớn - Chợ Bình Tây", desc: "Trung tâm buôn bán sầm uất mang đậm bản sắc văn hóa người Hoa Chợ Lớn", cat: ["Market", "Culture", "Shopping"], lat: 10.7508, lon: 106.6528, price: 0, io: "indoor", act: "medium" },
  { name: "Nhà Hát Thành Phố", desc: "Nhà hát cổ kính phong cách Gothic Pháp trung tâm các sự kiện nghệ thuật lớn", cat: ["Architecture", "Art", "Historical"], lat: 10.7767, lon: 106.7031, price: 0, io: "both", act: "low" },
  { name: "Công Viên Nước Đầm Sen", desc: "Tổ hợp trò chơi trượt nước cảm giác mạnh mát mẻ giữa lòng thành phố", cat: ["Theme Park", "Family", "Water Park"], lat: 10.7689, lon: 106.6372, price: 100000, io: "outdoor", act: "high" },
  { name: "Cầu Ánh Sao - Hồ Bán Nguyệt", desc: "Cầu đi bộ uốn lượn rực rỡ ánh đèn led cùng không gian lãng mạn tại Phú Mỹ Hưng", cat: ["Photo Spot", "Walking", "Nightlife"], lat: 10.7194, lon: 106.7214, price: 0, io: "outdoor", act: "medium" },
  { name: "Bảo Tàng Lịch Sử TP.HCM", desc: "Nơi gìn giữ di sản văn hóa từ thời tiền sử đến đầu thế kỷ 20", cat: ["Museum", "Historical", "Culture"], lat: 10.7878, lon: 106.7042, price: 30000, io: "indoor", act: "low" },
  { name: "Chùa Giác Lâm", desc: "Ngôi chùa cổ nhất Sài Gòn với hơn 300 năm lịch sử và kiến trúc chữ Tam", cat: ["Temple", "Religious", "Historical"], lat: 10.7783, lon: 106.6508, price: 0, io: "both", act: "low" },
  { name: "Khu Du Lịch Bình Quới", desc: "Không gian làng quê Nam Bộ yên ả với xuồng ba lá, cầu khỉ và ẩm thực khẩn hoang", cat: ["Nature", "Food", "Relax"], lat: 10.8358, lon: 106.7442, price: 0, io: "outdoor", act: "medium" },
  { name: "Nhà Thờ Tân Định", desc: "Nhà thờ màu hồng ngọt ngào nổi bật với kiến trúc Romanesque thu hút du khách", cat: ["Religious", "Architecture", "Photo Spot"], lat: 10.7886, lon: 106.6908, price: 0, io: "both", act: "low" },
  { name: "Snow Town Sài Gòn", desc: "Thị trấn tuyết nhân tạo trải nghiệm trượt tuyết mùa đông xứ lạnh", cat: ["Entertainment", "Theme Park", "Family"], lat: 10.7889, lon: 106.7583, price: 150000, io: "indoor", act: "high" },
  { name: "Thảo Điền Quận 2", desc: "Khu phố thời thượng với những quán cà phê nghệ thuật, nhà hàng sang trọng", cat: ["Cafe", "Dining", "Lifestyle"], lat: 10.8039, lon: 106.7328, price: 0, io: "both", act: "medium" },
  { name: "Phố Nhật Lê Thánh Tôn", desc: "Little Japan ẩn mình trong những con hẻm nhỏ với ramen, izakaya chuẩn vị", cat: ["Food", "Nightlife", "Culture"], lat: 10.7786, lon: 106.7039, price: 0, io: "both", act: "medium" },
  { name: "Công Viên Nóc Hầm Thủ Thiêm", desc: "Điểm ngắm hoàng hôn và skyline quận 1 lung linh tuyệt đẹp bên sông Sài Gòn", cat: ["View", "Nightlife", "Walking"], lat: 10.7675, lon: 106.7119, price: 0, io: "outdoor", act: "low" },
  { name: "Du Thuyền Sông Sài Gòn", desc: "Trải nghiệm thưởng thức bữa tối và ngắm cảnh đêm thành phố trên sông", cat: ["Cruise", "Romantic", "View"], lat: 10.7719, lon: 106.7061, price: 150000, io: "both", act: "medium" },
  { name: "Bảo Tàng Áo Dài", desc: "Tôn vinh trang phục truyền thống Việt Nam giữa không gian nhà vườn thanh tịnh", cat: ["Museum", "Culture", "Art"], lat: 10.8361, lon: 106.8406, price: 50000, io: "both", act: "low" },
  { name: "Hồ Con Rùa", desc: "Địa điểm ăn vặt đường phố quen thuộc của giới trẻ Sài Gòn", cat: ["Street Food", "Walking", "Youth"], lat: 10.7828, lon: 106.6961, price: 0, io: "outdoor", act: "low" },
  { name: "Chợ Đêm Hạnh Thông Tây", desc: "Khu chợ đêm sỉ và lẻ quần áo phụ kiện sầm uất bậc nhất Gò Vấp", cat: ["Market", "Nightlife", "Shopping"], lat: 10.8378, lon: 106.6606, price: 0, io: "outdoor", act: "high" },
  { name: "Tu Viện Khánh An", desc: "Ngôi chùa mang phong cách kiến trúc Nhật Bản thanh tịnh tại quận 12", cat: ["Temple", "Architecture", "Peaceful"], lat: 10.8653, lon: 106.6853, price: 0, io: "both", act: "low" },
  { name: "Saigon Waterbus - Bến Bạch Đằng", desc: "Chuyến buýt đường sông ngắm nhìn thành phố từ góc nhìn sông nước mới lạ", cat: ["Transportation", "View", "River"], lat: 10.7733, lon: 106.7069, price: 15000, io: "both", act: "medium" },
  { name: "Khu Đô Thị Sala", desc: "Khu đô thị sinh thái với công viên hoa và kiến trúc hiện đại thoáng đãng", cat: ["Park", "Architecture", "Photo Spot"], lat: 10.7714, lon: 106.7217, price: 0, io: "outdoor", act: "medium" },
  { name: "Chợ Tân Định", desc: "Ngôi chợ ẩm thực lâu đời nổi tiếng với các món chè, xôi gà và đồ ăn vặt Sài Gòn", cat: ["Market", "Food", "Local"], lat: 10.7897, lon: 106.6903, price: 0, io: "indoor", act: "medium" },
  { name: "Bảo Tàng Y Học Cổ Truyền Fito", desc: "Bảo tàng tư nhân độc đáo lưu giữ lịch sử ngành y dược cổ truyền Việt Nam", cat: ["Museum", "Culture", "Education"], lat: 10.7744, lon: 106.6719, price: 120000, io: "indoor", act: "low" },
  { name: "Chùa Vĩnh Nghiêm", desc: "Ngôi chùa Phật giáo lớn với tòa tháp 7 tầng uy nghiêm bên kênh Nhiêu Lộc", cat: ["Temple", "Religious", "Culture"], lat: 10.7919, lon: 106.6836, price: 0, io: "both", act: "low" },
  { name: "Công Viên Hoàng Văn Thụ", desc: "Khoảng xanh mát rượi với hồ nước và hàng cây rợp bóng gần sân bay", cat: ["Nature", "Park", "Relax"], lat: 10.7989, lon: 106.6631, price: 0, io: "outdoor", act: "medium" },
  { name: "Công Viên Gia Định", desc: "Công viên cây xanh rộng lớn điểm vui chơi dã ngoại lý tưởng cuối tuần", cat: ["Nature", "Park", "Family"], lat: 10.8144, lon: 106.6778, price: 0, io: "outdoor", act: "medium" },
  { name: "Chùa Bà Thiên Hậu", desc: "Ngôi miếu thờ Thiên Hậu Thánh Mẫu cổ xưa nhất của cộng đồng người Hoa", cat: ["Temple", "Religious", "Culture"], lat: 10.7539, lon: 106.6603, price: 0, io: "indoor", act: "low" },
  { name: "Chợ Đêm Bến Thành", desc: "Khu phố ăn đêm và mua sắm lưu niệm nhộn nhịp quanh chợ Bến Thành", cat: ["Market", "Nightlife", "Food"], lat: 10.7725, lon: 106.6983, price: 0, io: "outdoor", act: "high" },
  { name: "Phố Đi Bộ Bùi Viện", desc: "Con phố đi bộ nhộn nhịp âm nhạc đường phố và ẩm thực đa quốc gia", cat: ["Nightlife", "Music", "Entertainment"], lat: 10.7672, lon: 106.6931, price: 0, io: "outdoor", act: "high" },
  { name: "Trung Tâm Thương Mại Takashimaya", desc: "Trung tâm mua sắm và ẩm thực cao cấp sầm uất tại trung tâm quận 1", cat: ["Shopping", "Dining", "Luxury"], lat: 10.7739, lon: 106.7011, price: 0, io: "indoor", act: "medium" },
  { name: "Saigon Skydeck", desc: "Đài quan sát 360 độ từ tầng 49 tòa nhà Bitexco ngắm toàn cảnh Sài Gòn", cat: ["View", "Photo Spot", "City"], lat: 10.7717, lon: 106.7042, price: 200000, io: "indoor", act: "low" },
  { name: "Nhà Ga Metro Bến Thành", desc: "Nhà ga ngầm metro hiện đại trung tâm giao thông tương lai của thành phố", cat: ["Modern", "Urban", "Architecture"], lat: 10.7728, lon: 106.6978, price: 0, io: "indoor", act: "low" },
  { name: "Công Viên 23 Tháng 9", desc: "Dải công viên xanh trải dài giữa lòng trung tâm quận 1", cat: ["Park", "Walking", "Relax"], lat: 10.7686, lon: 106.6922, price: 0, io: "outdoor", act: "medium" },
  { name: "Cầu Ba Son", desc: "Cây cầu biểu tượng mới bắc qua sông Sài Gòn nối quận 1 với bán đảo Thủ Thiêm", cat: ["Architecture", "Photo Spot", "Bridge"], lat: 10.7783, lon: 106.7108, price: 0, io: "outdoor", act: "low" },
  { name: "Chùa Pháp Hoa", desc: "Ngôi chùa rực rỡ hoa đăng dịp lễ Phật Đản bên bờ kênh Nhiêu Lộc", cat: ["Temple", "Canal", "Lanterns"], lat: 10.7906, lon: 106.6853, price: 0, io: "both", act: "low" },
  { name: "Phố Ẩm Thực Vĩnh Khánh", desc: "Thiên đường hải sản và ốc tươi ngon nổi tiếng về đêm tại quận 4", cat: ["Food", "Seafood", "Nightlife"], lat: 10.7589, lon: 106.7003, price: 0, io: "outdoor", act: "high" },
  { name: "Nhà Thờ Cha Tam", desc: "Nhà thờ Công giáo cổ kính mang đậm dấu ấn kiến trúc Hoa - Gothique", cat: ["Religious", "Historical", "Architecture"], lat: 10.7511, lon: 106.6558, price: 0, io: "both", act: "low" },
  { name: "Bến Bạch Đằng", desc: "Công viên bờ sông thoáng đãng điểm dạo mát và ngắm thuyền bè tấp nập", cat: ["Park", "Walking", "River View"], lat: 10.7731, lon: 106.7064, price: 0, io: "outdoor", act: "medium" },
  { name: "Bảo Tàng Thành Phố Hồ Chí Minh", desc: "Tòa dinh thự cổ kiểu Pháp lộng lẫy nơi lưu giữ lịch sử phát triển Sài Gòn", cat: ["Historical", "Museum", "Architecture"], lat: 10.7758, lon: 106.6994, price: 30000, io: "both", act: "low" }
];

// Danh sách các địa điểm du lịch THẬT 100% tại Lâm Đồng (Đà Lạt)
const REAL_DALAT_PLACES = [
  { name: "Núi Langbiang", desc: "Nóc nhà Đà Lạt với truyền thuyết chàng K'lang và nàng H'biang hùng vĩ", cat: ["Nature", "Mountain", "Adventure"], lat: 12.0461, lon: 108.4358, price: 50000, io: "outdoor", act: "high" },
  { name: "Thác Prenn", desc: "Ngọn thác êm đềm duyên dáng ngay cửa ngõ vào thành phố ngàn hoa", cat: ["Nature", "Waterfall", "Park"], lat: 11.8797, lon: 108.4419, price: 50000, io: "outdoor", act: "medium" },
  { name: "Thung Lũng Vàng", desc: "Khu du lịch sinh thái bên hồ Đan Kia với bạt ngàn rừng thông xanh mát", cat: ["Nature", "Scenic", "Romantic"], lat: 11.9961, lon: 108.3814, price: 70000, io: "outdoor", act: "medium" },
  { name: "Đồi Mộng Mơ", desc: "Không gian thơ mộng tái hiện tiểu Vạn Lý Trường Thành và văn hóa Tây Nguyên", cat: ["Nature", "Garden", "Culture"], lat: 11.9686, lon: 108.4497, price: 50000, io: "outdoor", act: "medium" },
  { name: "Quảng Trường Lâm Viên", desc: "Biểu tượng nụ hoa atiso và hoa dã quỳ khổng lồ bên bờ hồ Xuân Hương", cat: ["Photo Spot", "Architecture", "Public"], lat: 11.9367, lon: 108.4447, price: 0, io: "outdoor", act: "medium" },
  { name: "Chợ Đêm Đà Lạt", desc: "Thưởng thức sữa đậu nành nóng, bánh tráng nướng giữa không khí se lạnh", cat: ["Market", "Food", "Nightlife"], lat: 11.9422, lon: 108.4367, price: 0, io: "outdoor", act: "high" },
  { name: "Dinh Bảo Đại - Dinh III", desc: "Biệt điện mùa hè xa hoa của vị hoàng đế cuối cùng triều Nguyễn", cat: ["Historical", "Architecture", "Culture"], lat: 11.9303, lon: 108.4286, price: 30000, io: "both", act: "low" },
  { name: "Chùa Linh Phước", desc: "Ngôi chùa độc đáo nắm giữ nhiều kỷ lục được khảm tinh xảo từ hàng triệu mảnh ve chai", cat: ["Temple", "Architecture", "Religious"], lat: 11.9442, lon: 108.4989, price: 0, io: "both", act: "medium" },
  { name: "Vườn Hoa Thành Phố Đà Lạt", desc: "Nơi hội tụ hàng trăm loài hoa rực rỡ khoe sắc quanh năm", cat: ["Garden", "Nature", "Photography"], lat: 11.9469, lon: 108.4489, price: 50000, io: "outdoor", act: "medium" },
  { name: "Rừng Lá Phong Đà Lạt", desc: "Khu du lịch độc đáo với vườn phong tự nhiên và kiến trúc mái nhà hình lá phong", cat: ["Nature", "Art", "Scenic"], lat: 11.9161, lon: 108.4478, price: 50000, io: "outdoor", act: "medium" },
  { name: "Tuyệt Tình Cốc", desc: "Hồ nước xanh ngọc bích ảo diệu giữa mỏ đá hoa cương hoang sơ", cat: ["Nature", "Lake", "Adventure"], lat: 12.0294, lon: 108.3494, price: 0, io: "outdoor", act: "high" },
  { name: "Cổng Trời Bali Đà Lạt", desc: "Điểm check-in mô phỏng cổng trời Bali thơ mộng giữa đồi thông", cat: ["Photo Spot", "View", "Cafe"], lat: 11.9214, lon: 108.4439, price: 90000, io: "outdoor", act: "low" },
  { name: "Puppy Farm - Nông Trại Cún", desc: "Nông trại cún thân thiện cùng vườn dâu tây và đồi hoa rực rỡ", cat: ["Animals", "Farm", "Family"], lat: 11.9706, lon: 108.3889, price: 100000, io: "both", act: "medium" },
  { name: "Kombi Land Coffee", desc: "Xứ sở xương rồng phong cách hoang mạc nhiệt đới độc nhất vô nhị", cat: ["Cafe", "Photo Spot", "Desert"], lat: 11.8975, lon: 108.4631, price: 90000, io: "outdoor", act: "medium" },
  { name: "Thác Pongour", desc: "Nam thiên đệ nhất thác hùng vĩ với 7 tầng đá bậc thang kỳ vĩ", cat: ["Nature", "Waterfall", "Magnificent"], lat: 11.6917, lon: 108.2639, price: 40000, io: "outdoor", act: "high" },
  { name: "Thác Voi - Elephant Falls", desc: "Ngọn thác hoang sơ dữ dội với dòng nước cuồn cuộn qua các tảng đá khổng lồ", cat: ["Nature", "Waterfall", "Adventure"], lat: 11.8239, lon: 108.3317, price: 30000, io: "outdoor", act: "high" },
  { name: "Nhà Thờ Domaine de Marie", desc: "Nhà thờ màu hồng mang phong cách kiến trúc châu Âu thế kỷ 17 giữa đồi thông", cat: ["Religious", "Architecture", "Photo Spot"], lat: 11.9483, lon: 108.4297, price: 0, io: "both", act: "low" },
  { name: "Đồi Đa Phú", desc: "Điểm cắm trại săn mây đón bình minh tuyệt đẹp của dân phượt Đà Lạt", cat: ["Nature", "Camping", "Sunrise"], lat: 11.9867, lon: 108.4069, price: 0, io: "outdoor", act: "high" },
  { name: "Thác Cam Ly", desc: "Ngọn thác đi vào thơ ca gắn liền với vẻ đẹp truyền thống của phố núi", cat: ["Nature", "Waterfall", "Historical"], lat: 11.9425, lon: 108.4183, price: 40000, io: "outdoor", act: "medium" },
  { name: "Chùa Tàu - Thiên Vương Cổ Sát", desc: "Ngôi chùa cổ kính với chiếc bàn xoay kỳ diệu và ba pho tượng Phật bằng gỗ trầm", cat: ["Temple", "Religious", "Culture"], lat: 11.9333, lon: 108.4689, price: 0, io: "both", act: "low" },
  { name: "Làng Cù Lần", desc: "Ngôi làng nhỏ xinh nép mình dưới chân núi Langbiang với suối reo thông reo", cat: ["Village", "Nature", "Culture"], lat: 12.0153, lon: 108.3308, price: 100000, io: "outdoor", act: "medium" },
  { name: "Đồi Cỏ Hồng Đan Kia", desc: "Mùa cỏ hồng tuyết lung linh phủ kín đồi thông vào đầu đông", cat: ["Nature", "Photography", "Seasonal"], lat: 12.0125, lon: 108.3756, price: 0, io: "outdoor", act: "medium" },
  { name: "Đường Hầm Điêu Khắc - Đất Sét", desc: "Công trình đất đỏ bazan tái hiện lịch sử hình thành Đà Lạt độc nhất vô nhị", cat: ["Art", "Architecture", "Culture"], lat: 11.8906, lon: 108.4111, price: 90000, io: "outdoor", act: "medium" },
  { name: "Hồ Tuyền Lâm", desc: "Khu du lịch quốc gia với hồ nước thơ mộng, du thuyền và chèo SUP", cat: ["Nature", "Lake", "Relax"], lat: 11.8986, lon: 108.4317, price: 0, io: "outdoor", act: "medium" },
  { name: "Fresh Garden Đà Lạt", desc: "Đồi hoa rực rỡ sắc màu với cối xay gió và ngôi nhà hoa khổng lồ", cat: ["Garden", "Photo Spot", "Flowers"], lat: 11.9419, lon: 108.4061, price: 100000, io: "outdoor", act: "medium" },
  { name: "Vườn Ánh Sáng Lumiere", desc: "Bảo tàng nghệ thuật kỹ thuật số tương tác ánh sáng 3D hiện đại bậc nhất", cat: ["Art", "Interactive", "Entertainment"], lat: 11.9678, lon: 108.4367, price: 150000, io: "indoor", act: "low" },
  { name: "Đồi Pinhatt", desc: "Đỉnh núi cao nhất phía nam hồ Tuyền Lâm cho tầm nhìn ôm trọn non nước", cat: ["Trekking", "Mountain", "View"], lat: 11.8847, lon: 108.4292, price: 0, io: "outdoor", act: "high" },
  { name: "Dinh I Đà Lạt - King Palace", desc: "Dinh thự sang trọng của vua Bảo Đại giữa rừng thông cổ thụ bạt ngàn", cat: ["Historical", "Architecture", "Garden"], lat: 11.9317, lon: 108.4681, price: 50000, io: "both", act: "medium" },
  { name: "Dinh II Đà Lạt", desc: "Dinh thự Toàn quyền Pháp cổ kính với đường hầm bí mật xuyên lòng đồi", cat: ["Historical", "Architecture", "View"], lat: 11.9344, lon: 108.4503, price: 30000, io: "both", act: "low" },
  { name: "Thác Bobla", desc: "Ngọn thác hùng vĩ giữa rừng nguyên sinh Di Linh ngập tràn sắc hoa", cat: ["Nature", "Waterfall", "Eco"], lat: 11.5647, lon: 108.1067, price: 50000, io: "outdoor", act: "high" },
  { name: "Đèo Prenn", desc: "Cung đèo uốn lượn tuyệt đẹp giữa rừng thông dẫn lối lên thành phố mộng mơ", cat: ["Scenic", "Road", "Nature"], lat: 11.8911, lon: 108.4472, price: 0, io: "outdoor", act: "low" },
  { name: "Đèo Mimosa", desc: "Cung đèo ngập tràn sắc vàng hoa mimosa nở rộ vào dịp cuối năm", cat: ["Scenic", "Road", "Flowers"], lat: 11.9056, lon: 108.4619, price: 0, io: "outdoor", act: "low" },
  { name: "Đồi Thiên Phúc Đức", desc: "Điểm cắm trại hoang sơ ngắm cây thông cô đơn và sương mù lãng đãng", cat: ["Camping", "View", "Pine"], lat: 11.9806, lon: 108.4319, price: 0, io: "outdoor", act: "medium" },
  { name: "Cổng Trời Đà Lạt View", desc: "Ngắm trọn mây trời và đèo Mimosa từ chiếc cổng đỏ biểu tượng", cat: ["Cafe", "View", "Photo Spot"], lat: 11.9289, lon: 108.4594, price: 80000, io: "outdoor", act: "low" },
  { name: "Dalat Camp", desc: "Khu cắm trại ẩn mình giữa thung lũng xanh mướt cho kỳ nghỉ chữa lành", cat: ["Camping", "Nature", "Relax"], lat: 12.0236, lon: 108.4217, price: 100000, io: "outdoor", act: "low" },
  { name: "Vườn Thượng Uyển Bay", desc: "Thiên đường hoa nghệ thuật với con đường hoa hồng rực rỡ", cat: ["Garden", "Photo Spot", "Flowers"], lat: 11.9297, lon: 108.4908, price: 100000, io: "outdoor", act: "medium" },
  { name: "Nông Trại Cừu Đà Lạt", desc: "Vui chơi chụp ảnh cùng những chú cừu trắng muốt giữa đồi cỏ xanh", cat: ["Farm", "Animals", "Family"], lat: 11.9753, lon: 108.4947, price: 80000, io: "outdoor", act: "medium" },
  { name: "Chùa Linh Ẩn", desc: "Nơi tọa lạc tượng Phật Bà Quan Âm lộ thiên cao nhất Việt Nam", cat: ["Temple", "Religious", "Statue"], lat: 11.8242, lon: 108.3325, price: 0, io: "both", act: "medium" },
  { name: "Tiệm Cà Phê Túi Mơ To", desc: "Quán cà phê ngắm hoàng hôn và nhà lồng lên đèn nổi tiếng nhất Đà Lạt", cat: ["Cafe", "View", "Sunset"], lat: 11.9567, lon: 108.4719, price: 60000, io: "both", act: "low" },
  { name: "Làng Hoa Vạn Thành", desc: "Làng hoa truyền thống lâu đời bậc nhất cung cấp hoa tươi khắp cả nước", cat: ["Garden", "Farm", "Flowers"], lat: 11.9453, lon: 108.4069, price: 60000, io: "both", act: "medium" },
  { name: "Suối Vàng - Suối Bạc", desc: "Hồ nước nhân tạo lớn nhất Đà Lạt với khung cảnh thiên nhiên thơ mộng", cat: ["Nature", "River", "Scenic"], lat: 12.0089, lon: 108.3683, price: 0, io: "outdoor", act: "medium" },
  { name: "Cây Thông Cô Đơn", desc: "Biểu tượng du lịch trải nghiệm đứng sừng sững bên hồ Suối Vàng", cat: ["Photo Spot", "Lake", "Camping"], lat: 12.0467, lon: 108.3692, price: 0, io: "outdoor", act: "high" },
  { name: "Đồi Chè Ô Long", desc: "Những đồi chè tròn vo xanh mướt xen lẫn hàng mai anh đào nở rộ", cat: ["Nature", "Tea", "Photography"], lat: 11.9719, lon: 108.4208, price: 30000, io: "outdoor", act: "medium" },
  { name: "Chùa Linh Quy Pháp Ấn", desc: "Cổng trời Bảo Lộc chốn bồng lai tiên cảnh ngắm bình minh trên biển mây", cat: ["Temple", "View", "Sunrise"], lat: 11.4589, lon: 107.8286, price: 0, io: "both", act: "high" },
  { name: "Vườn Cẩm Tú Cầu Trại Mát", desc: "Cánh đồng hoa cẩm tú cầu bạt ngàn bung nở rực rỡ quanh năm", cat: ["Garden", "Flowers", "Photo Spot"], lat: 11.9489, lon: 108.5022, price: 30000, io: "outdoor", act: "medium" },
  { name: "Khu Du Lịch Ma Rừng Lữ Quán", desc: "Chốn nghỉ dưỡng tĩnh lặng ẩn sâu giữa rừng thông hoang sơ Đạ Nghịt", cat: ["Eco", "Nature", "Forest"], lat: 12.0683, lon: 108.3619, price: 50000, io: "outdoor", act: "medium" },
  { name: "Thác Hang Cọp", desc: "Ngọn thác ẩn mình giữa rừng rậm với truyền thuyết chiếc hang cọp cổ", cat: ["Nature", "Waterfall", "Adventure"], lat: 11.9619, lon: 108.5283, price: 20000, io: "outdoor", act: "high" },
  { name: "Nhà Thờ Cam Ly", desc: "Nhà thờ mái nhà rông Tây Nguyên độc đáo dành cho đồng bào dân tộc thiểu số", cat: ["Religious", "Architecture", "Ethnic"], lat: 11.9439, lon: 108.4239, price: 0, io: "both", act: "low" },
  { name: "Viện Sinh Học Tây Nguyên", desc: "Lâu đài đá cổ kính lưu giữ hàng ngàn mẫu vật động thực vật quý hiếm", cat: ["Museum", "Architecture", "History"], lat: 11.9772, lon: 108.4317, price: 20000, io: "both", act: "low" },
  { name: "Vườn Dâu Tây Biofresh", desc: "Trải nghiệm hái dâu tây sạch công nghệ cao thủy canh tại vườn", cat: ["Farm", "Fruit", "Experience"], lat: 11.9647, lon: 108.4683, price: 30000, io: "both", act: "medium" },
  { name: "Thung Lũng Dasar", desc: "Điểm săn mây lý tưởng giữa biển mây bồng bềnh mỗi sớm mai", cat: ["Nature", "Cloud Hunting", "View"], lat: 11.9897, lon: 108.5528, price: 60000, io: "outdoor", act: "medium" },
  { name: "Đồi Cỏ Trắng Mũi Trâu", desc: "Cánh đồng cỏ đuôi chồn trắng tinh khôi phất phơ trong gió mùa đông", cat: ["Nature", "Trekking", "View"], lat: 11.9983, lon: 108.4892, price: 0, io: "outdoor", act: "medium" },
  { name: "Làng Gà Đơn Dương", desc: "Làng nghề dệt thổ cẩm truyền thống với bức tượng gà 9 cựa độc đáo", cat: ["Culture", "Ethnic", "Village"], lat: 11.7583, lon: 108.5117, price: 0, io: "both", act: "low" },
  { name: "Chợ Nông Sản Đà Lạt", desc: "Chợ đầu mối trái cây, rau củ quả tươi ngon giá gốc từ nhà vườn", cat: ["Market", "Local", "Produce"], lat: 11.9511, lon: 108.4722, price: 0, io: "indoor", act: "medium" },
  { name: "Thác Liêng Rowoa", desc: "Ngọn thác bí ẩn tuyệt đẹp giữa núi rừng Nam Ban hoang sơ", cat: ["Nature", "Waterfall", "Scenic"], lat: 11.8236, lon: 108.3314, price: 30000, io: "outdoor", act: "high" },
  { name: "Bảo Tàng Lâm Đồng", desc: "Nơi trưng bày các hiện vật lịch sử văn hóa các dân tộc bản địa Lâm Đồng", cat: ["Museum", "History", "Culture"], lat: 11.9372, lon: 108.4647, price: 20000, io: "both", act: "low" },
  { name: "Cà Phê Mê Linh Garden", desc: "Quán cà phê chồn view thung lũng 360 độ tuyệt mỹ giữa đồi cà phê bạt ngàn", cat: ["Cafe", "View", "Coffee Plantation"], lat: 11.8794, lon: 108.3444, price: 60000, io: "both", act: "medium" },
  { name: "Đồi Vô Ảnh Đà Lạt", desc: "Đồi gương nghệ thuật đầu tiên tại Việt Nam với hồ trái tim ảo diệu", cat: ["Photo Spot", "Art", "Mirror"], lat: 11.9889, lon: 108.3847, price: 50000, io: "outdoor", act: "medium" },
  { name: "Hồ Than Thở", desc: "Thắng cảnh gắn liền với câu chuyện tình buồn đẫm lệ giữa rừng thông reo", cat: ["Nature", "Lake", "Historical"], lat: 11.9542, lon: 108.4764, price: 40000, io: "outdoor", act: "medium" },
  { name: "Vườn Thú Zoodoo Đà Lạt", desc: "Sở thú thân thiện kiểu Úc giữa rừng thông với chuột túi, lạc đà alpaca", cat: ["Animals", "Zoo", "Family"], lat: 12.0794, lon: 108.6186, price: 100000, io: "outdoor", act: "medium" },
  { name: "Đồi Cừu Suối Nghệ", desc: "Khu trang trại cừu xinh xắn thả rông giữa thảo nguyên xanh mát", cat: ["Farm", "Photo Spot", "Animals"], lat: 11.9711, lon: 108.4878, price: 50000, io: "outdoor", act: "medium" },
  { name: "Tiệm Cà Phê Cheo Veooo", desc: "Ngắm thung lũng sương mù và hoàng hôn rực rỡ từ căn nhà gỗ cheo leo", cat: ["Cafe", "Sunset", "View"], lat: 11.9389, lon: 108.4789, price: 50000, io: "outdoor", act: "low" },
  { name: "Rừng Thông Đèo Tà Nung", desc: "Những vạt thông già xanh thẳm ngút ngàn trên cung đường đèo uốn lượn", cat: ["Nature", "Forest", "Scenic"], lat: 11.8953, lon: 108.3589, price: 0, io: "outdoor", act: "medium" },
  { name: "An Sơn Hồ Đà Lạt", desc: "Phượng Hoàng Cổ Trấn thu nhỏ với những căn nhà chòi trên mặt nước thơ mộng", cat: ["Dining", "Photo Spot", "Water"], lat: 11.9169, lon: 108.4189, price: 0, io: "both", act: "low" },
  { name: "Vườn Hồng Nhà Tom", desc: "Vườn hồng chín trĩu quả trĩu cành cho du khách tự tay hái và thưởng thức", cat: ["Garden", "Fruit", "Seasonal"], lat: 11.9689, lon: 108.4911, price: 50000, io: "outdoor", act: "medium" },
  { name: "Chùa Vạn Hạnh", desc: "Tôn tượng Phật Thích Ca Mâu Ni niêm hoa vi tiếu bằng đồng đồ sộ", cat: ["Temple", "Religious", "Statue"], lat: 11.9583, lon: 108.4406, price: 0, io: "both", act: "low" },
  { name: "Đồi Mây Cầu Đất", desc: "Điểm đón bình minh và mây cuồn cuộn lãng đãng bên những cánh quạt gió", cat: ["Cloud Hunting", "Sunrise", "View"], lat: 11.9758, lon: 108.5389, price: 50000, io: "outdoor", act: "medium" },
  { name: "Trang Trại Cà Phê Chồn Trại Mát", desc: "Khám phá quy trình sản xuất cà phê chồn đắt đỏ bậc nhất thế giới", cat: ["Coffee", "Experience", "Farm"], lat: 11.9417, lon: 108.4958, price: 100000, io: "both", act: "low" },
  { name: "XQ Sử Quán Đà Lạt", desc: "Làng tranh thêu nghệ thuật truyền thống với không gian cổ kính như cố đô", cat: ["Art", "Embroidery", "Culture"], lat: 11.9672, lon: 108.4486, price: 50000, io: "both", act: "low" },
  { name: "Nhà Ga Xe Lửa Cổ", desc: "Ga tàu hỏa cổ kính nhất Đông Dương với đầu tàu hơi nước độc đáo", cat: ["Historical", "Architecture", "Train"], lat: 11.9408, lon: 108.4422, price: 10000, io: "both", act: "low" },
  { name: "Thác Bảo Đại", desc: "Ngọn thác ẩn sâu giữa đại ngàn từng là nơi vua Bảo Đại dừng chân nghỉ dưỡng", cat: ["Nature", "Waterfall", "Historical"], lat: 11.7167, lon: 108.3667, price: 30000, io: "outdoor", act: "high" },
  { name: "Thung Lũng Tình Yêu", desc: "Thắng cảnh danh tiếng biểu tượng cho tình yêu lãng mạn giữa ngàn hoa phố núi", cat: ["Theme Park", "Nature", "Romantic"], lat: 11.9661, lon: 108.4144, price: 250000, io: "both", act: "high" },
  { name: "Cà Phê Horizon Đà Lạt", desc: "Khu vườn trên mây ngắm rừng thông bạt ngàn từ cột khinh khí cầu rực rỡ", cat: ["Cafe", "View", "Mist"], lat: 11.9236, lon: 108.4489, price: 60000, io: "both", act: "low" },
  { name: "Vườn Lavender Hồ Tuyền Lâm", desc: "Cánh đồng hoa oải hương tím biếc tỏa hương ngào ngạt bên hồ thơ mộng", cat: ["Garden", "Flowers", "Photo Spot"], lat: 11.8958, lon: 108.4236, price: 50000, io: "outdoor", act: "medium" },
  { name: "Đồi Cỏ May Tuyền Lâm", desc: "Đồi cỏ vàng ươm trong nắng chiều hoang hoải soi bóng hồ nước trong xanh", cat: ["Nature", "Trekking", "Scenic"], lat: 11.8931, lon: 108.4278, price: 0, io: "outdoor", act: "medium" },
  { name: "Cà Phê F Cánh Đồng Hoa", desc: "Quán cà phê lọt thỏm giữa thung lũng hoa ngập tràn sắc hương rực rỡ", cat: ["Cafe", "Flowers", "Valley"], lat: 11.9108, lon: 108.4739, price: 60000, io: "outdoor", act: "medium" },
  { name: "Cổng Trời Chuồn Chuồn", desc: "Khu du lịch sinh thái cà phê view thung lũng Tà Nung ngút tầm mắt", cat: ["View", "Photo Spot", "Cafe"], lat: 11.8667, lon: 108.3389, price: 100000, io: "both", act: "medium" },
  { name: "Khu Dã Ngoại Phương Nam", desc: "Điểm dã ngoại cắm trại bên suối nước mát rượi giữa tán rừng thông reo", cat: ["Camping", "Nature", "Picnic"], lat: 11.9058, lon: 108.4319, price: 40000, io: "outdoor", act: "medium" },
  { name: "Phố Đi Bộ Hoà Bình", desc: "Khu phố trung tâm nhộn nhịp ẩm thực và mua sắm về đêm của Đà Lạt", cat: ["Walking", "Shopping", "Food"], lat: 11.9414, lon: 108.4361, price: 0, io: "outdoor", act: "high" },
  { name: "Vườn Hoa Bất Tử Tà Nung", desc: "Vườn hoa cúc bất tử rực rỡ sắc màu tượng trưng cho tình yêu vĩnh cửu", cat: ["Flowers", "Garden", "Photo Spot"], lat: 11.8833, lon: 108.3417, price: 40000, io: "outdoor", act: "medium" },
  { name: "Đồi Robin - Cáp Treo Đà Lạt", desc: "Tuyến cáp treo ngắm toàn cảnh thành phố Đà Lạt và hồ Tuyền Lâm từ trên cao", cat: ["Cable Car", "View", "Pine"], lat: 11.9228, lon: 108.4442, price: 100000, io: "both", act: "medium" },
  { name: "Vườn Bí Ngô Khổng Lồ", desc: "Tham quan những quả bí ngô nặng cả tạ độc đáo tại làng hoa Thái Phiên", cat: ["Farm", "Unique", "Family"], lat: 11.9589, lon: 108.4556, price: 30000, io: "both", act: "low" },
  { name: "Tiệm Cà Phê Bình Minh Ơi", desc: "Điểm săn mây và đón tia nắng đầu ngày ấm áp giữa đồi thông thơ mộng", cat: ["Cafe", "Sunrise", "View"], lat: 11.9311, lon: 108.4533, price: 60000, io: "both", act: "low" }
];

async function cleanAndEnrichPlaces() {
  console.log("🚀 Bắt đầu làm sạch dữ liệu bảng places...");

  // 1. Chặn toàn bộ giá âm
  const fixedPrices = await prisma.$executeRawUnsafe(
    `UPDATE places SET price_estimate = GREATEST(0, price_estimate);`
  );
  console.log(`✅ Đã chuẩn hóa giá âm thành 0đ (affected rows query executed).`);

  // 2. Lấy danh sách địa điểm có chứa chữ 'Branch'
  const branchPlaces = await prisma.place.findMany({
    where: {
      name: { contains: "Branch" },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`🔍 Tìm thấy ${branchPlaces.length} địa điểm cần thay thế chữ 'Branch'.`);

  let hanoiIdx = 0;
  let hcmIdx = 0;
  let dalatIdx = 0;
  let updatedCount = 0;

  for (const place of branchPlaces) {
    let realData = null;

    if (place.province === "Hanoi") {
      realData = REAL_HANOI_PLACES[hanoiIdx % REAL_HANOI_PLACES.length];
      hanoiIdx++;
    } else if (place.province === "Ho Chi Minh") {
      realData = REAL_HCM_PLACES[hcmIdx % REAL_HCM_PLACES.length];
      hcmIdx++;
    } else if (place.province === "Lam Dong") {
      realData = REAL_DALAT_PLACES[dalatIdx % REAL_DALAT_PLACES.length];
      dalatIdx++;
    }

    if (realData) {
      await prisma.place.update({
        where: { id: place.id },
        data: {
          name: realData.name,
          description: realData.desc,
          categories: realData.cat,
          latitude: realData.lat,
          longitude: realData.lon,
          priceEstimate: realData.price,
          indoorOutdoor: realData.io,
          activityLevel: realData.act,
        },
      });
      updatedCount++;
    }
  }

  console.log(`🎉 Hoàn tất cập nhật ${updatedCount} địa điểm bằng danh lam thắng cảnh THẬT của Việt Nam!`);

  // 3. Xuất lại file mock_places.json đồng bộ cho recommendation-service
  const allPlaces = await prisma.place.findMany();
  const datasetsMockPath = path.resolve(__dirname, '../../../datasets/mock_places.json');
  
  const formattedJson = allPlaces.map(p => ({
    name: p.name,
    province: p.province,
    categories: p.categories,
    price: p.priceEstimate,
    lat: p.latitude,
    lon: p.longitude,
    id: p.id,
    description: p.description,
    price_estimate: p.priceEstimate,
    popularity_score: p.popularityScore,
    indoor_outdoor: p.indoorOutdoor,
    activity_level: p.activityLevel,
    latitude: p.latitude,
    longitude: p.longitude
  }));

  fs.writeFileSync(datasetsMockPath, JSON.stringify(formattedJson, null, 2), 'utf-8');
  console.log(`📁 Đã đồng bộ file datasets/mock_places.json (${formattedJson.length} places).`);

  const recPlacesPath = path.resolve(__dirname, '../../../recommendation-service/mock_places.json');
  if (fs.existsSync(recPlacesPath)) {
    fs.writeFileSync(recPlacesPath, JSON.stringify(formattedJson, null, 2), 'utf-8');
  }

  await prisma.$disconnect();
}

cleanAndEnrichPlaces().catch(e => {
  console.error("❌ Lỗi khi làm sạch dữ liệu:", e);
  process.exit(1);
});
