# Kế Hoạch Hoàn Thiện Web Platform & Giải Trình Phản Biện Giảng Viên (ĐATN)

Kế hoạch này được điều chỉnh theo định hướng: **Tập trung hoàn thiện 100% trên nền tảng Web Frontend (`web/`), Backend Core (`backend/`), ML Recommendation Service (`recommendation-service/`) và Tài liệu Báo cáo ĐATN (`docs/`)**. Tạm thời không can thiệp mã nguồn `mobile/` để dồn toàn lực tối ưu hóa trải nghiệm và chuẩn hóa thuật toán trên Web trước.

---

## 1. Tổng Quan Mục Tiêu & Định Hướng Triển Khai

| STT | Ý kiến của Giảng viên | Định hướng kỹ thuật & học thuật trên Web |
| :---: | :--- | :--- |
| **1** | Cần có mô-đun/phần App Mobile hỗ trợ lập kế hoạch | **Chiến lược giai đoạn (Phased Delivery)**: Hoàn thiện Web Platform làm bản quy chuẩn chuẩn mực (Web Reference Implementation), tối ưu Responsive chuẩn di động (Mobile-friendly PWA view), đóng gói toàn bộ API Contracts sẵn sàng cho Mobile App ở giai đoạn mở rộng tiếp theo. Tài liệu hóa luận chứng học thuật này vào báo cáo. |
| **2** | Cần cơ chế/bước đánh giá tính hợp lý/khả thi của lịch trình sinh bởi LLM | Xây dựng bộ công cụ `ItineraryFeasibilityValidator` trên NestJS Backend lượng hóa 5 chỉ số ($S_{\text{geo}}, S_{\text{time}}, S_{\text{budget}}, S_{\text{pref}}, S_{\text{div}}$, $\text{OFS}$), tự động sửa lỗi vi phạm và hiển thị trực quan thẻ **Feasibility Score Card** trên trang chi tiết chuyến đi Web. |
| **3** | Cơ chế Cold-start dựa trên độ phổ biến không thể hiện tính cá nhân hóa gợi ý | Xây dựng **Onboarding Preference Survey Modal** ngay trên Web khi người mới đăng nhập, kết hợp thuật toán **Multi-Attribute Content-Based Personalization** trên Python FastAPI (Khớp sở thích 50% + Ngân sách 25% + Nhóm đi 15% + Phổ biến 10%). |
| **4** | RAG Chatbot: Thông tin tri thức không còn phù hợp (đóng cửa, giá vé đổi, nguồn không tin cậy) cần cơ chế kiểm chứng | Xây dựng **Kiến trúc Phân Luồng Tri Thức Kép (Dual-Mode Knowledge Routing)**: Thông tin lịch sử/văn hóa chung bền vững tra cứu siêu tốc trong CSDL nội bộ; thông tin số liệu (giá vé, giờ mở, quy mô) hoặc nhạy cảm rủi ro (đóng/mở cửa, sự cố) tự động chuyển sang **Agentic Web Search (Google Search Grounding)** tra cứu trực tuyến thời gian thực kèm link kiểm chứng. |

---

## 2. Kiến Trúc Hệ Thống Tập Trung Web Platform

```mermaid
flowchart TD
    subgraph WebFrontend["🌐 Web Frontend (Next.js 16 + Tailwind CSS)"]
        UI_Onboarding["Onboarding Survey Modal (Bắt buộc)\n(Khảo sát sở thích cho người mới)"]
        UI_Wizard["Wizard Lập Tour (trips/new)"]
        UI_TripDetail["Trang Chi Tiết Lịch Trình (trips/[id])"]
        UI_FeasCard["Thẻ Đánh Giá Tính Khả Thi (Feasibility Card)"]
        UI_Chat["RAG Chatbot (question-answer)\n+ Disclaimer Giá Vé + Nút Báo Cáo Lỗi"]
    end

    subgraph BackendNest["⚙️ NestJS Backend Core"]
        TripService["Trips Service"]
        Validator["Itinerary Feasibility Validator\n(Chấm điểm 5 chiều & Cảnh báo)"]
        LocalRepair["Local Spatial Repair / 2-Opt TSP"]
        RagService["RAG Service + Entity Grounding (Bảng places)"]
        FeedbackController["Knowledge Feedback Endpoint"]
    end

    subgraph MLService["🐍 Python FastAPI (Recommendation)"]
        PersonalizedColdStart["Personalized Cold-Start Engine\n(Multi-Attribute Content-Based + Persona Matching)"]
        LightFMModel["LightFM Hybrid Model (Warm Users)"]
    end

    subgraph Database["🗄️ PostgreSQL 16 + pgvector"]
        DB_Places["Bảng places (Giá vé niêm yết, Tọa độ, Trạng thái)"]
        DB_Chunks["Bảng tourism_chunks (Vector BGE-M3 1024 dims)"]
        DB_Feedback["Bảng knowledge_feedback (Phản hồi cộng đồng)"]
        DB_Users["Bảng users (preferredStyles, budgetLevel)"]
    end

    UI_Onboarding -->|Lưu khảo sát ban đầu| DB_Users
    UI_Wizard -->|Yêu cầu tạo tour| TripService
    TripService -->|Lấy gợi ý ứng viên| PersonalizedColdStart
    PersonalizedColdStart -->|Top 50 địa điểm cá nhân hóa| TripService
    TripService -->|Prompt xếp ngày| GeminiLLM["Google Gemini LLM"]
    GeminiLLM -->|Lịch trình thô| Validator
    Validator -->|Kiểm định 5 chỉ số| LocalRepair
    LocalRepair -->|Lịch trình tối ưu + OFS Score| UI_TripDetail
    UI_TripDetail --> UI_FeasCard

    UI_Chat -->|Câu hỏi du lịch| Router{"Intelligent Knowledge Router"}
    Router -->|1. Lịch sử / Văn hóa chung| RagService["RAG Service (BGE-M3 + pgvector)"]
    Router -->|2. Số liệu giá vé / Giờ mở / Đóng cửa| WebSearchAgent["🌐 Live Web Search Agent (Google Search Grounding)"]
    
    RagService --> DB_Chunks
    WebSearchAgent --> LiveInternet["Tra cứu Internet Thời Gian Thực (Google)"]
    
    RagService --> GeminiLLM2["Google Gemini LLM"]
    LiveInternet --> GeminiLLM2
    GeminiLLM2 -->|Câu trả lời xác thực + Link nguồn| UI_Chat
    UI_Chat -->|Báo cáo giá vé/địa điểm đổi| FeedbackController
    FeedbackController -->|Lưu báo cáo kiểm tra| DB_Feedback
```

---

## 3. Chi Tiết Phương Án Kỹ Thuật

---

### 🎯 Điểm 1: Luận Chứng Học Thuật & Chiến Lược Phát Triển Web Trước (Mobile Phase 2)

#### A. Định hướng giải trình với Giảng viên
Trong đồ án tốt nghiệp kỹ thuật phần mềm / khoa học máy tính:
1. **Trọng tâm đề tài**: Cốt lõi của đề tài là **Hệ thống Trí tuệ Nhân tạo Du lịch Thông minh** (kết hợp Machine Learning LightFM, Multi-Attribute Personalization, LLM Itinerary Planning với cơ chế kiểm định khả thi, và RAG Chatbot kiểm chứng nguồn).
2. **Web-First Strategy**: Nền tảng Web (Next.js 16) được hoàn thiện toàn diện với thiết kế **Responsive Design 100% chuẩn di động** (hoạt động trơn tru trên mọi kích thước màn hình smartphone/tablet như một Web App di động).
3. **Sẵn sàng cho Mobile**: Toàn bộ kiến trúc Backend (NestJS REST API, WebSocket Gateway, Data Contracts) đã được chuẩn hóa và kiểm thử nghiêm ngặt, cho phép module ứng dụng di động bản địa (Native/Flutter) cắm vào sử dụng ngay mà không cần thay đổi bất kỳ logic cốt lõi nào.

---

### 🎯 Điểm 2: Cơ Chế Đánh Giá Tính Hợp Lý & Khả Thi Của Lịch Trình Sinh Bởi LLM

#### A. Công thức tính toán Bộ Đánh Giá Tính Khả Thi (`ItineraryFeasibilityValidator`)
Hệ thống chấm điểm lịch trình theo thang điểm 100 dựa trên 5 chiều kích:

1. **Chỉ số Khả thi Địa lý & Di chuyển ($S_{\text{geo}} \in [0, 100]$)**:
   - Khoảng cách Haversine giữa 2 điểm liên tiếp $d_k = \text{haversine}(P_k, P_{k+1})$.
   - Thời gian di chuyển trong đô thị: $t_{\text{transit}} = \frac{d_k}{25\text{ km/h}} + 0.15\text{h}$.
   - Nếu $d_k \le 12\text{km}$: Điểm tối đa (100).
   - Nếu $12\text{km} < d_k \le 25\text{km}$: $S_{\text{geo}} = 100 - (d_k - 12) \times 3$.
   - Nếu $d_k > 25\text{km}$: Trừ 50 điểm; nếu $> 40\text{km}$ gắn cảnh báo nghiêm trọng (*Critical Warning: Quãng đường di chuyển quá lớn*).

2. **Chỉ số Khả thi Khung giờ & Nhịp độ ($S_{\text{time}} \in [0, 100]$)**:
   - Số điểm lý tưởng mỗi ngày $N \in [2, 4]$. Nếu $N > 5$: Trừ 15 điểm/điểm thừa.
   - Kiểm tra logic buổi: Điểm nightlife (bar, chợ đêm, phố đi bộ) bắt buộc ở `evening`; điểm thiên nhiên/trekking ưu tiên `morning` hoặc `afternoon`.

3. **Chỉ số Phù hợp Ngân sách ($S_{\text{budget}} \in [0, 100]$)**:
   - Ngân sách ngày cho phép: $B_{\text{day}} = \frac{B_{\text{total}}}{\text{days}}$.
   - Tổng chi phí các điểm trong ngày: $C_{\text{day}} = \sum \text{priceEstimate}$.
   - Nếu $C_{\text{day}} \le B_{\text{day}}$: $S_{\text{budget}} = 100$. Nếu vượt $> 30\%$: Phạt điểm và kèm cảnh báo.

4. **Chỉ số Khớp Sở thích Cá nhân ($S_{\text{pref}} \in [0, 100]$)**:
   - Tỷ lệ các điểm trong chuyến đi trùng khớp với `explicitPreferences` của người dùng:
     $$S_{\text{pref}} = \frac{|\{p \in \text{Trip} \mid \text{categories}(p) \cap \text{Preferences} \neq \emptyset\}|}{|\text{Trip}|} \times 100$$

5. **Chỉ số Đa dạng Trải nghiệm ($S_{\text{div}} \in [0, 100]$)**:
   - Tránh việc trong 1 ngày xếp liên tiếp $> 2$ điểm cùng thể loại (ví dụ 3 bảo tàng liên tiếp).

**Điểm Khả Thi Tổng Thể (Overall Feasibility Score - OFS)**:
$$\text{OFS} = 0.30 \cdot S_{\text{geo}} + 0.25 \cdot S_{\text{time}} + 0.20 \cdot S_{\text{budget}} + 0.15 \cdot S_{\text{pref}} + 0.10 \cdot S_{\text{div}}$$

#### B. Hiển thị trên Web (`web/src/app/trips/[id]/page.tsx`)
- Thêm khối **`TripFeasibilityCard`** (Bảng đánh giá tính khả thi lịch trình):
  - Điểm số tổng thể $\text{OFS}$ (thang điểm 100).
  - Thanh tiến trình phân tích 4 tiêu chuẩn kỹ thuật: Khoảng cách di chuyển, Phù hợp ngân sách, Khung giờ hoạt động, Đúng sở thích yêu cầu.
  - Danh sách cảnh báo/lưu ý di chuyển thực tế (ví dụ: *"Ngày 2: Chặng di chuyển giữa Điểm A và Điểm B cách nhau 28km, dự kiến mất ~45 phút di chuyển"*).

---

### 🎯 Điểm 3: Cơ Chế Gợi Ý Cold-Start Cá Nhân Hóa Đa Thuộc Tính (Web Onboarding)

#### A. Khảo sát Khởi tạo Bắt Buộc trên Web (`OnboardingModal.tsx`)
Khi người dùng mới đăng ký thành công (hoặc đăng nhập mà `preferredStyles` rỗng):
- **Bật Modal Khảo Sát Bắt Buộc (Mandatory Blocking Modal)**:
  - **Không giới hạn thời gian**: Người dùng thoải mái suy nghĩ và lựa chọn kỹ lưỡng.
  - **Không cho tắt**: Không có nút đóng (X), khóa click ra ngoài backdrop, không cho chuyển trang nếu chưa hoàn tất khảo sát (đảm bảo 100% người dùng trên hệ thống đều có vector sở thích ban đầu, xóa bỏ hoàn toàn trạng thái cold-start trống).
  - **Nội dung 3 câu hỏi khảo sát cụ thể**:
    1. **Câu 1 - Gu du lịch yêu thích (chọn tối thiểu $\ge 3$ thẻ)**:
       - 🏛️ *Văn hóa & Lịch sử*: Bảo tàng, di tích, đền chùa, phố cổ, làng nghề.
       - 🌿 *Thiên nhiên & Sinh thái*: Rừng núi, thác nước, thung lũng, cắm trại.
       - 🍜 *Ẩm thực & Đặc sản*: Chợ đêm, street food, món ngon bản địa, quán cafe view đẹp.
       - 🏖️ *Nghỉ dưỡng & Biển đảo*: Resort, tắm khoáng onsen, bãi biển, spa.
       - 📸 *Check-in & Sống ảo*: Cung đường view đẹp, quán cafe săn mây, kiến trúc độc lạ.
       - 🧗 *Khám phá & Mạo hiểm*: Trekking, chèo SUP, khám phá hang động.
       - 🎡 *Vui chơi & Giải trí*: Công viên chủ đề, khu giải trí cảm giác mạnh, phố đi bộ.
    2. **Câu 2 - Đối tượng đồng hành thường xuyên nhất (chọn 1)**:
       - 🎒 *Đi một mình (Solo)*: Tự do, linh hoạt, trải nghiệm cá nhân.
       - 👫 *Cặp đôi (Couple)*: Lãng mạn, riêng tư, nhẹ nhàng.
       - 👨‍👩‍👧‍👦 *Gia đình (Family)*: An toàn, khuôn viên thoáng mát, phù hợp trẻ nhỏ và người lớn tuổi.
       - 👥 *Nhóm bạn bè (Friends)*: Sôi động, trải nghiệm tập thể, ăn uống vui chơi.
    3. **Câu 3 - Mức ngân sách chi tiêu thông thường (chọn 1)**:
       - 💰 *Tiết kiệm (Budget)*: Ưu tiên điểm miễn phí vé hoặc giá rẻ, homestay bình dân (< 500k/ngày).
       - 💳 *Tiêu chuẩn (Standard)*: Chi tiêu cân bằng, trải nghiệm vừa đủ (500k - 1.5tr/ngày).
       - 💎 *Cao cấp (Luxury)*: Trải nghiệm nghỉ dưỡng sang trọng, vé VIP, resort 4-5 sao (> 1.5tr/ngày).
- Bấm "Hoàn tất & Khám phá" $\rightarrow$ Lưu vào CSDL qua `PATCH /api/users/profile` và kích hoạt ngay danh sách gợi ý cá nhân hóa trên trang chủ.

#### B. Mối Quan Hệ Giữa Khảo Sát Tài Khoản (Onboarding) và Khảo Sát Khi Tạo Chuyến Đi (`/trips/new`)
Hệ thống kết hợp 2 cấp độ sở thích theo cơ chế **"Tự động điền (Smart Pre-fill) & Ưu tiên chuyến đi (Contextual Override)"**:
1. **Hồ sơ tài khoản (Long-term Profile)**: Đại diện cho *gu du lịch chung* của người dùng, dùng để cá nhân hóa Trang chủ và các đề xuất mặc định.
2. **Ý định chuyến đi (Trip-specific Context)**: Đại diện cho *nhu cầu cụ thể của từng lần đi*.
3. **Cơ chế phối hợp cụ thể**:
   - **Tự động điền sẵn (Smart Pre-fill)**: Khi người dùng mở trang tạo tour (`/trips/new`), các ô chọn "Mức ngân sách" và "Sở thích" sẽ **tự động được tick sẵn** theo dữ liệu khảo sát Onboarding. Người dùng không cần bấm lại nếu chuyến đi này vẫn theo gu quen thuộc.
   - **Quyền ưu tiên chuyến đi (Contextual Override)**: Nếu chuyến này người dùng thay đổi (ví dụ: tài khoản là phượt bụi tiết kiệm, nhưng chuyến này đưa gia đình đi nghỉ dưỡng cao cấp) $\rightarrow$ **Hệ thống ưu tiên 100% lựa chọn tại chuyến đi đó để sinh lịch trình**, trong khi hồ sơ tài khoản gốc vẫn được giữ nguyên vẹn.

#### C. Mô Hình Toán Học & Công Thức Tính Điểm Xếp Hạng Cold-Start

Quá trình tính toán điểm gợi ý từ 2 lần khảo sát được giải quyết bằng **Phép dung hợp Vector đặc trưng theo trọng số (Weighted Linear Feature Fusion)** và **Phép nhân Ma trận - Vector (Matrix-Vector Multiplication)**:

1. **Biểu diễn Vector của 2 lần khảo sát ($M$ chiều danh mục)**:
   Giả sử hệ thống có không gian $M$ thể loại du lịch (ví dụ $M = 7$: Ẩm thực, Văn hóa, Check-in, Thiên nhiên, Nghỉ dưỡng, Mạo hiểm, Giải trí).
   - Khảo sát tài khoản: $\mathbf{u}_{\text{onboard}} \in \{0, 1\}^M$
   - Nhu cầu chuyến đi cụ thể: $\mathbf{t}_{\text{trip}} \in \{0, 1\}^M$

2. **Dung hợp thành Vector Người Dùng Động ($\mathbf{u}_{\text{final}}$)**:
   $$\mathbf{u}_{\text{final}} = \alpha \cdot \mathbf{t}_{\text{trip}} + (1 - \alpha) \cdot \mathbf{u}_{\text{onboard}}$$
   - $\alpha = 0.75$: Nhu cầu chuyến đi $\mathbf{t}_{\text{trip}}$ chiếm **75% trọng số** quyết định; gu sở thích tài khoản $\mathbf{u}_{\text{onboard}}$ chiếm **25% trọng số** làm nền tảng.
   - Nếu người dùng giữ nguyên mặc định $\rightarrow \mathbf{t}_{\text{trip}} = \mathbf{u}_{\text{onboard}} \Rightarrow \mathbf{u}_{\text{final}} = \mathbf{u}_{\text{onboard}}$.

3. **Phép nhân Ma trận - Vector tính điểm Tương thích Sở thích hàng loạt ($\mathbf{S}_{\text{content}}$)**:
   Với ma trận thuộc tính của $N$ địa điểm ứng viên $\mathbf{P} \in \mathbb{R}^{N \times M}$:
   $$\mathbf{S}_{\text{content}} = \mathbf{P} \times (\mathbf{u}_{\text{final}})^T \quad (\in \mathbb{R}^{N \times 1})$$

4. **Công thức Tổng Hợp Điểm Xếp Hạng Cuối Cùng ($Score$)**:
   $$Score(p_j) = 0.50 \cdot \hat{\mathbf{S}}_{\text{content}}[j] + 0.25 \cdot \text{Fit}_{\text{budget}}(B_{\text{trip}}, price_j) + 0.15 \cdot \text{Fit}_{\text{group}}(G_{\text{trip}}, attr_j) + 0.10 \cdot \text{NormPop}(p_j)$$

---

#### D. Ví Dụ Tính Toán Bằng Số Cụ Thể (Minh Họa Trực Quan)

* **Khách hàng:** Anh Nam chuẩn bị đi Đà Lạt.
  - $\mathbf{u}_{\text{onboard}} = [1, 1, 1, 0, 0, 0, 0]$ (Lúc lập nick chọn: Ẩm thực, Văn hóa, Check-in).
  - $\mathbf{t}_{\text{trip}} = [0, 0, 0, 1, 1, 0, 0]$ (Chuyến này đi với Gia đình chọn: Thiên nhiên, Nghỉ dưỡng).
  - Ngân sách: $500.000$ VNĐ/người/ngày.
* **Vector động sau dung hợp ($\alpha = 0.75$):**
  $$\mathbf{u}_{\text{final}} = [0.25, \; 0.25, \; 0.25, \; \mathbf{0.75}, \; \mathbf{0.75}, \; 0, \; 0]$$

**So sánh chấm điểm cho 2 địa điểm ứng viên tại Đà Lạt:**

| Thành phần tính toán | KDL Thung Lũng Vàng (Địa điểm A) | Quán Bar Acoustic & Pub đêm (Địa điểm B) |
| :--- | :--- | :--- |
| **Đặc trưng địa điểm** | Thiên nhiên, Nghỉ dưỡng, Check-in | Ẩm thực, Giải trí náo nhiệt |
| **Điểm sở thích (50%)** | $\mathbf{S}_{\text{content}} = 0.75 + 0.75 + 0.25 = 1.75 \rightarrow \mathbf{1.00}$ (100%) | $\mathbf{S}_{\text{content}} = 0.25 \rightarrow \mathbf{0.14}$ (Rất thấp) |
| **Điểm ngân sách (25%)** | Vé 70.000đ $\ll$ 500.000đ $\rightarrow \mathbf{1.00}$ | Đồ uống 200.000đ $\le$ 500.000đ $\rightarrow \mathbf{0.90}$ |
| **Điểm nhóm đi (15%)** | Hợp gia đình có trẻ em/người già $\rightarrow \mathbf{1.00}$ | Nhóm gia đình đi Bar $\rightarrow$ Phạt nặng $\rightarrow \mathbf{0.10}$ |
| **Độ phổ biến (10%)** | $85/100 \rightarrow \mathbf{0.85}$ | $95/100 \rightarrow \mathbf{0.95}$ |
| **CÔNG THỨC TÍNH** | $0.50(1.0) + 0.25(1.0) + 0.15(1.0) + 0.10(0.85)$ | $0.50(0.14) + 0.25(0.90) + 0.15(0.10) + 0.10(0.95)$ |
| **TỔNG ĐIỂM SCORE** | $\mathbf{0.985} \quad (\mathbf{98.5} / 100 \text{ điểm})$ | $\mathbf{0.405} \quad (\mathbf{40.5} / 100 \text{ điểm})$ |
| **KẾT LUẬN XẾP HẠNG** | 🥇 **Được gợi ý lên Top 1** | ❌ **Bị loại khỏi danh sách gợi ý** |

> [!TIP]
> **Ý nghĩa học thuật:** Nếu chỉ dựa vào độ phổ biến đơn thuần, Quán Bar (95 điểm) sẽ bị gợi ý nhầm cho gia đình Nam. Nhờ công thức dung hợp đa thuộc tính, hệ thống đã nhận diện chính xác Thung Lũng Vàng đạt 98.5 điểm và đưa lên đầu!

---

### 🎯 Điểm 4: Cơ Chế Kiểm Chứng & Phân Luồng Tri Thức Kép (Dual-Mode Knowledge Architecture)

Để giải quyết bài toán thông tin tri thức tĩnh bị lỗi thời hoặc không đáng tin cậy, hệ thống nâng cấp Chatbot thành kiến trúc **Corrective RAG (CRAG) kết hợp Bộ Định Tuyến Ý Định Thông Minh (Intelligent Knowledge Router)** tự động phân loại và chuyển hướng linh hoạt giữa 2 chế độ:

```mermaid
flowchart TD
    UserQ["Người Dùng Nhập Câu Hỏi"] --> Router{"Bộ Định Tuyến Ý Định Thông Minh\n(Intelligent Knowledge Router)"}

    Router -->|1. THÔNG TIN LỊCH SỬ / CHUNG\n- Lịch sử hình thành, niên đại\n- Bản sắc văn hóa, phong tục\n- Giới thiệu đặc sản, ẩm thực\n- Cảnh quan thiên nhiên, mẹo du lịch| InternalMode["⚡ CHẾ ĐỘ 1: TRI THỨC NỘI BỘ (Local Fast RAG)\n─────────────────────────────────────\n- Tìm kiếm vector BGE-M3 trên bảng tourism_chunks\n- Phản hồi siêu tốc (< 200ms)\n- Không tốn tài nguyên mạng ngoài"]

    Router -->|2. SỐ LIỆU & THÔNG TIN RỦI RO / NHẠY CẢM\n- Số liệu: Giá vé tham quan, phụ thu, giá cáp treo\n- Khung giờ: Giờ mở cửa, giờ đóng cửa, lịch diễn\n- Quy mô: Diện tích, sức chứa, hạ tầng\n- Rủi ro/Trạng thái: Có đang mở cửa không? Tạm đóng?\n- Thời sự: Cấm đường, sạt lở, thời tiết, quy định mới| ExternalMode["🌐 CHẾ ĐỘ 2: AGENT TÌM KIẾM TRỰC TUYẾN (Live Web Search)\n─────────────────────────────────────\n- Kích hoạt Google Search Grounding (Gemini Tool)\n- Tự động tra cứu website tin tức/ban quản lý mới nhất\n- Lấy dữ liệu thực tế năm 2026\n- Trích dẫn trực tiếp đường link web nguồn để kiểm chứng"]

    InternalMode --> LLM_Synthesis["Mô hình Google Gemini Tổng Hợp & Phản Hồi"]
    ExternalMode --> LLM_Synthesis

    LLM_Synthesis --> Output["Giao Diện Web Chatbot:\n- Trả lời rõ ràng, chính xác\n- Huy hiệu nguồn (CSDL Nội Bộ hoặc Live Web)\n- Nút 🚩 Báo cáo sai lệch nếu thực tế có biến động"]
```

#### A. Chi tiết 2 Chế độ Tra cứu & Cơ chế Switch tự động
1. **Chế độ 1 - Tri thức Nội bộ CSDL (Internal Fast Vector Retrieval)**:
   - *Áp dụng cho:* Các câu hỏi mang tính bền vững vĩnh cửu theo thời gian (Evergreen Knowledge) như: *"Kinh thành Huế xây dựng vào năm nào?", "Sự tích Hồ Gươm", "Đặc sản mì Quảng bắt nguồn từ đâu?", "Những bãi biển đẹp nhất Phú Quốc"*.
   - *Cơ chế:* Dùng mô hình BGE-M3 local nhúng câu hỏi $\rightarrow$ Quét cosine similarity trong `tourism_chunks` $\rightarrow$ Gemini sinh câu trả lời trong tích tắc (< 1.2 giây) với chi phí tối ưu nhất.
2. **Chế độ 2 - Agent Tìm kiếm Trực tuyến Thời gian thực (Live Google Search Grounding)**:
   - *Áp dụng cho:* Các câu hỏi có số liệu biến động hoặc trạng thái nhạy cảm (Dynamic & Real-time Sensitive Knowledge):
     - **Số liệu cụ thể:** Giá vé vào cổng, giá vé combo, chi phí tour, giờ mở cửa/đóng cửa, quy mô diện tích.
     - **Rủi ro & Trạng thái vận hành:** *"Địa điểm X có đang mở cửa không?", "Đèo Prenn có đang cấm đường không?", "Thời tiết Fansipan hôm nay thế nào?"*.
   - *Cơ chế Switch tự động:*
     - Hàm phân loại ý định `classifyQueryIntent(question)` phát hiện từ khóa số liệu/thời sự (`giá vé`, `vé vào cổng`, `bao nhiêu tiền`, `giờ mở cửa`, `đóng cửa`, `tạm dừng`, `tu sửa`, `cấm đường`, `quy mô`, `sức chứa`, `hôm nay`, `mới nhất`, `2026`...).
     - Backend lập tức bật cấu hình `tools: [{ googleSearch: {} }]` khi gọi Gemini API.
     - Gemini tự động đóng vai trò **Search Agent**: Gửi truy vấn lên Google Search, đọc các bài báo/website mới nhất được đăng tải trong thời gian thực, tổng hợp câu trả lời chính xác nhất và trả về kèm đường link web dẫn chứng.
   - *Chi tiết Nguồn Tra Cứu & Chiến Lược Lọc Nguồn Uy Tín (Source Whitelist & Verification):*
     - **Cỗ máy tìm kiếm:** Sử dụng trực tiếp Google Search Engine thông qua tính năng Google Search Grounding của Gemini SDK.
     - **3 nhóm nguồn được Agent ưu tiên cao nhất:**
       1. 🏛️ *Website chính thức của Ban quản lý & Cổng thông tin Sở Du Lịch:* `dinhdoclap.gov.vn`, `banahills.sunworld.vn`, `vinwonders.com`, `vietnamtourism.gov.vn`, `dulichdanang.gov.vn`, `sodulich.hanoi.gov.vn`...
       2. 📰 *Báo chí chính thống lớn của Việt Nam:* Chuyên mục Du lịch/Thời sự của VnExpress (`vnexpress.net/du-lich`), Báo Tuổi Trẻ (`tuoitre.vn`), Báo Thanh Niên, Báo Du Lịch Việt Nam.
       3. 🎫 *Cổng niêm yết vé du lịch chính thống:* Klook, Traveloka, MoMo Travel (nơi cập nhật giá vé bán thực tế theo ngày).
     - **Rào chắn lọc nguồn (Source Guardrail Directive):** Cài đặt trong System Prompt chỉ đạo Agent:
       - Bắt buộc ưu tiên bài viết có mốc thời gian gần nhất (năm 2026/2025).
       - Loại trừ và không trích dẫn thông tin từ blog cá nhân không ghi ngày tháng hoặc các diễn đàn thảo luận tự do không kiểm chứng.
     - **Trích dẫn minh bạch trên Web:** Trả về danh sách URL có thể click trực tiếp:  
       🔗 `[Cổng thông tin Di tích Dinh Độc Lập - dinhdoclap.gov.vn]`  
       🔗 `[Báo VnExpress Du lịch]`  
       để người dùng và Hội đồng chấm thi có thể bấm trực tiếp vào nguồn web gốc để đối chứng!
3. **Cơ chế Dự phòng & Kiểm chứng Bổ sung**:
   - Tự động kèm **Disclaimer** khuyến cáo thời điểm cho mọi thông tin giá vé/giờ mở.
   - Nút cờ 🚩 *"Báo cáo thông tin sai / lỗi thời"* trên Web lưu vào bảng `knowledge_feedback` để Quản trị viên theo dõi.

---

## 4. Kế Hoạch Thay Đổi Chi Tiết Theo Từng Thành Phần

### Thành phần 1: Backend (`backend/`)

#### [NEW] `backend/src/trips/optimizer/feasibility-validator.service.ts`
- Triển khai thuật toán tính toán 5 chỉ số $S_{\text{geo}}, S_{\text{time}}, S_{\text{budget}}, S_{\text{pref}}, S_{\text{div}}$, tổng hợp điểm $\text{OFS}$ và tạo danh sách khuyến cáo.

#### [MODIFY] `backend/src/trips/trips.service.ts`
- Tích hợp `FeasibilityValidatorService`.
- Sau khi LLM sinh lịch trình: Chạy kiểm định tính khả thi, áp dụng sửa lỗi cục bộ nếu vi phạm nghiêm trọng và lưu `feasibilityReport` vào đối tượng `TripItinerary`.

#### [MODIFY] `backend/src/recommendation/recommendation.service.ts`
- Cập nhật hàm fallback cold-start sử dụng công thức kết hợp đa thuộc tính (Sở thích 50% + Ngân sách 25% + Nhóm đi 15% + Phổ biến 10%).

#### [MODIFY] `backend/src/gemini/gemini.service.ts`
- Bổ sung cấu hình công cụ `tools: [{ googleSearch: {} }]` cho Google Gemini API để hỗ trợ tra cứu trực tuyến thời gian thực (Google Search Grounding).
- Hỗ trợ trích xuất `groundingMetadata` (danh sách đường link bài viết web thực tế từ kết quả tìm kiếm Google).

#### [MODIFY] `backend/src/rag/rag.service.ts`
- Cài đặt bộ định tuyến ý định `classifyQueryIntent(question)`:
  - Nếu câu hỏi lịch sử / văn hóa chung $\rightarrow$ Truy xuất nhanh qua `tourism_chunks` (BGE-M3 vector cosine).
  - Nếu câu hỏi số liệu (giá vé, giờ mở, quy mô) hoặc trạng thái nhạy cảm (đóng/mở cửa, sạt lở, thời tiết) $\rightarrow$ Kích hoạt `googleSearch` tool trên Gemini để lấy dữ liệu thực tế mới nhất năm 2026 kèm web links.
- Tự động bổ sung Disclaimer cảnh báo thời điểm cho các thông tin số liệu.

#### [NEW] `backend/src/chat/dto/feedback.dto.ts` & [MODIFY] `backend/src/chat/chat.controller.ts`
- Endpoint `POST /api/chat/feedback` tiếp nhận báo cáo từ người dùng.

#### [MODIFY] `backend/prisma/schema.prisma`
- Thêm bảng `KnowledgeFeedback`:
```prisma
model KnowledgeFeedback {
  id           String   @id @default(uuid())
  sessionId    String?  @map("session_id")
  userQuestion String   @map("user_question") @db.Text
  botAnswer    String   @map("bot_answer") @db.Text
  reason       String   // "OUTDATED_PRICE", "CLOSED", "INCORRECT_INFO"
  userNote     String?  @map("user_note") @db.Text
  status       String   @default("PENDING") // PENDING, VERIFIED, RESOLVED
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("knowledge_feedback")
}
```

---

### Thành phần 2: Recommendation Service (`recommendation-service/`)

#### [MODIFY] `recommendation-service/app/model.py`
- Nâng cấp `_cold_start_recommend` nhận diện các thuộc tính cá nhân của user thay vì chỉ dùng popularity.

#### [MODIFY] `recommendation-service/app/main.py`
- Tiếp nhận payload đầy đủ từ backend và gọi logic cold-start cá nhân hóa mới.

---

### Thành phần 3: Web Frontend (`web/`)

#### [NEW] `web/src/components/onboarding/OnboardingModal.tsx`
- Dialog Modal khảo sát bắt buộc (Mandatory Blocking Dialog - Không giới hạn thời gian, không có nút đóng X, không cho click backdrop thoát) hiển thị cho người dùng mới khi đăng ký hoặc đăng nhập mà chưa có `preferredStyles`.
- Giao diện chip tags hiện đại: Chọn $\ge 3$ phong cách, đối tượng đi cùng và mức chi tiêu.
- Chỉ khi chọn đủ và bấm "Hoàn tất & Khám phá" thì Modal mới đóng, đồng thời cập nhật CSDL và nạp lại gợi ý trang chủ.

#### [NEW] `web/src/components/trips/TripFeasibilityCard.tsx`
- Component hiển thị phân tích tính khả thi lịch trình:
  - Điểm số tổng thể OFS (thang điểm 100).
  - Thanh tiến trình phân tích 4 tiêu chuẩn kỹ thuật (Khoảng cách, Ngân sách, Khung giờ, Sở thích).
  - Khối danh sách cảnh báo/lưu ý di chuyển và chi phí thực tế nếu có.

#### [MODIFY] `web/src/app/trips/[id]/page.tsx`
- Tích hợp `TripFeasibilityCard` vào trang chi tiết lịch trình.

#### [MODIFY] `web/src/app/question-answer/page.tsx`
- Hiển thị nhãn nguồn phân biệt:
  - 📚 *"Nguồn Tri Thức Du Lịch Bản Địa"* (khi trả lời từ CSDL nội bộ).
  - 🌐 *"Nguồn Kiểm Chứng Trực Tuyến Thời Gian Thực"* (khi chuyển chế độ Google Search kèm đường link bài báo gốc).
- Thêm Disclaimer hiển thị dưới câu trả lời RAG.
- Thêm nút cờ 🚩 *"Báo cáo thông tin chưa chính xác / lỗi thời"* và Dialog gửi phản hồi.

---

### Thành phần 4: Tài Liệu Luận Văn & Báo Cáo ĐATN (`docs/`)

#### [NEW] `docs/lecturer-feedback-resolution.md`
- Bản tổng hợp học thuật đầy đủ:
  1. **Luận chứng chiến lược Web-First**: Lý giải học thuật về việc hoàn thiện nền tảng Web quy chuẩn, đáp ứng chuẩn di động responsive và chuẩn hóa API contract trước khi mở rộng Native Mobile.
  2. **Mô hình định lượng Tính Khả thi Lịch trình LLM**: Công thức toán học 5 chiều, cơ chế tự sửa lỗi và bảng kết quả thực nghiệm.
  3. **Mô hình Cold-Start Cá Nhân Hóa Đa Thuộc Tính**: So sánh với baseline chỉ dùng độ phổ biến, phân tích độ đa dạng gợi ý (Diversity & Novelty).
  4. **Khung Kiểm Chứng Tri Thức RAG Chatbot**: Sơ đồ kiểm chứng thực thể CSDL thời gian thực và quản lý tri thức lỗi thời.
  5. **Kịch bản Trả lời Vấn đáp (Q&A Defense Script)**: Hướng dẫn chi tiết cách trả lời tự tin từng câu hỏi của giảng viên khi bảo vệ.

---

## 5. Kế Hoạch Kiểm Thử & Xác Minh (Verification Plan)

### A. Kiểm thử Tự động (Automated Verification)
1. **Kiểm thử Feasibility Validator**: Chạy test kiểm tra tính toán OFS với các kịch bản khoảng cách xa (>30km), vượt ngân sách (>130%) và lịch trình cân bằng lý tưởng.
2. **Kiểm thử Cold-Start Cá nhân hóa**: So sánh gợi ý giữa 2 người dùng mới với 2 phong cách khác nhau (Ẩm thực vs Nghỉ dưỡng) đảm bảo Jaccard similarity giữa 2 danh sách gợi ý $< 0.40$.
3. **Kiểm thử RAG Entity Grounding**: Gửi câu hỏi về giá vé và kiểm tra phản hồi chứa dữ liệu xác thực từ bảng `places` kèm disclaimer.

### B. Kiểm thử Thủ công trên Giao diện Web (Manual Verification)
1. **Kiểm tra Onboarding Modal**: Đăng ký tài khoản mới $\rightarrow$ Popup khảo sát xuất hiện $\rightarrow$ Chọn tags $\rightarrow$ Bấm lưu $\rightarrow$ Kiểm tra thông tin đã cập nhật trong hồ sơ.
2. **Kiểm tra Lập Lịch Trình & Feasibility Card**: Tạo chuyến đi 3 ngày $\rightarrow$ Mở trang chi tiết chuyến đi $\rightarrow$ Quan sát thẻ điểm Feasibility Card hiển thị rõ ràng điểm số và các cảnh báo (nếu có).
3. **Kiểm tra Chatbot RAG**: Hỏi câu hỏi về giá vé địa điểm $\rightarrow$ Xem phản hồi kèm cảnh báo $\rightarrow$ Bấm nút 🚩 báo cáo thông tin $\rightarrow$ Gửi báo cáo thành công.
