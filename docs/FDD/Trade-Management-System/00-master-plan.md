# Trade Management System - Master Plan

## 1. Tổng quan hệ thống (System Overview)

### 1.1 Bài toán nghiệp vụ (Business Problem)
Các trader tham gia chương trình funded account (FTMO, The5ers, v.v.) cần:
- Theo dõi chặt chẽ từng lệnh giao dịch để đảm bảo tuân thủ các quy tắc cứng nhắc của quỹ
- Tính toán và quản lý rủi ro trên mỗi lệnh và tổng vốn
- Nhận cảnh báo kịp thời khi vi phạm điều kiện (số lệnh, rủi ro, drawdown)
- Phân tích hiệu suất giao dịch qua biểu đồ và số liệu thống kê
- Theo dõi tin tức kinh tế và giờ phiên giao dịch để đưa ra quyết định tốt hơn

### 1.2 Mục tiêu giải pháp (Solution Goals)
Xây dựng ứng dụng web giúp trader:
1. **Ghi chép** - Nhập và lưu trữ tất cả giao dịch một cách có cấu trúc
2. **Kiểm soát** - Thiết lập và tự động kiểm tra các quy tắc trading (max daily trades, risk per trade)
3. **Phân tích** - Visualize profit/loss, drawdown, win rate qua biểu đồ
4. **Thông tin** - Xem lịch tin tức Forex và giờ hoạt động của các phiên thị trường
5. **Cảnh báo** - Nhận thông báo realtime khi sắp hoặc đã vi phạm quy tắc
6. **Tích hợp** - (Optional) Kết nối với MetaTrader 5 để tự động sync lệnh

---

## 2. Phạm vi dự án (Project Scope)

### 2.1 In-scope (Làm)
- ✅ Giao diện web responsive (Desktop + Mobile)
- ✅ Hệ thống xác thực người dùng (Authentication)
- ✅ 7 modules chính (xem phần 3)
- ✅ Lưu trữ dữ liệu bằng MongoDB
- ✅ Dashboard tổng quan với các chỉ số quan trọng

### 2.2 Out-scope (Không làm ở phiên bản đầu)
- ❌ Social trading / Copy trading features
- ❌ Automated trading bot execution
- ❌ Payment gateway (nếu app miễn phí)
- ❌ Multi-language support (chỉ Tiếng Việt + English)
- ❌ Mobile app native (iOS/Android) - chỉ Web PWA

---

## 3. Sơ đồ Module (Sitemap)

```
Trade Management System
│
├─ 🏠 Dashboard (Tổng quan)
│   ├─ Profit/Loss hôm nay
│   ├─ Số lệnh đã đánh / Giới hạn
│   ├─ Drawdown hiện tại
│   └─ Cảnh báo nhanh (nếu có)
│
├─ 📒 Trading Journal (Nhật ký giao dịch)
│   ├─ Danh sách tất cả lệnh
│   ├─ Thêm lệnh mới (Manual / Import)
│   ├─ Chi tiết từng lệnh (Screenshots, Notes)
│   └─ Filter & Search
│
├─ 💰 Capital & Risk Management
│   ├─ Nhập vốn ban đầu / Current balance
│   ├─ Calculator: Lot size dựa trên % risk
│   ├─ Risk summary (Daily, Weekly, Total)
│   └─ Max drawdown tracking
│
├─ ⚙️ Rules & Constraints (Điều kiện giao dịch)
│   ├─ Thiết lập quy tắc (Max 3 lệnh/ngày, 0.5%-1% risk/lệnh)
│   ├─ Danh sách quy tắc đang áp dụng
│   ├─ Lịch sử vi phạm (Rule Violation Log)
│   └─ Enable/Disable quy tắc cụ thể
│
├─ 📊 Analytics & Reporting (Biểu đồ & Báo cáo)
│   ├─ Biểu đồ Profit/Loss theo thời gian
│   ├─ Biểu đồ Drawdown (Daily, Max DD)
│   ├─ Win Rate & Risk/Reward Ratio
│   ├─ Phân tích theo cặp tiền, session, setup
│   └─ Export báo cáo PDF
│
├─ 📰 News & Market Sessions
│   ├─ Economic Calendar (như ForexFactory)
│   ├─ Session Clock (London, New York, Tokyo, Sydney)
│   ├─ Filter tin tức theo độ ưu tiên (High/Medium/Low)
│   └─ Timezone customization
│
├─ 🔔 Alert System (Hệ thống cảnh báo)
│   ├─ Cảnh báo vượt số lệnh trong ngày
│   ├─ Cảnh báo lot size quá lớn (vượt risk %)
│   ├─ Cảnh báo gần đạt max drawdown
│   ├─ Lịch sử thông báo
│   └─ Cài đặt (Push notification, Email, In-app)
│

│
└─ ⚙️ Settings (Cài đặt)
    ├─ Profile quản lý (User info, Avatar)
    ├─ Chọn prop firm (FTMO, The5ers, Custom)
    ├─ Timezone & Currency preference
    └─ Notification preferences
```

---

## 4. Danh sách tính năng chi tiết (Feature List)

Mỗi tính năng sẽ được viết trong file FDD riêng:

| STT | File Name | Tính năng | Mức độ ưu tiên |
|-----|-----------|-----------|----------------|
| 1 | `01-trading-journal.md` | Nhật ký giao dịch | 🔴 Critical |
| 2 | `02-capital-risk-management.md` | Quản lý vốn & Rủi ro | 🔴 Critical |
| 3 | `03-rules-constraints.md` | Engine kiểm tra điều kiện | 🔴 Critical |
| 4 | `04-analytics-reporting.md` | Biểu đồ Drawdown, Profit | 🟡 High |
| 5 | `05-news-market-sessions.md` | Tin tức & Giờ phiên | 🟡 High |
| 6 | `06-alert-system.md` | Hệ thống cảnh báo | 🟡 High |

---

## 5. Tech Stack đề xuất (Preliminary)

> **Lưu ý:** Phần này chỉ mang tính tham khảo, sẽ được xác định chi tiết ở giai đoạn Technical Design.

- **Frontend:** React + TypeScript + TailwindCSS (hoặc Ant Design)
- **Backend:** Node.js + Express (hoặc NestJS)
- **Database:** MongoDB (đã có kết nối)
- **Real-time:** Socket.io (cho alerts)
- **Charts:** Recharts hoặc ApexCharts
- **MT5 Integration:** MetaTrader 5 API / Custom EA (Expert Advisor)

---

## 6. User Personas (Người dùng mục tiêu)

### Persona 1: Minh - Prop Trader Mới
- **Nhu cầu:** Cần ghi chép cẩn thận để pass FTMO Challenge, sợ vi phạm quy tắc
- **Pain points:** Hay quên đã đánh bao nhiêu lệnh trong ngày, tính risk thủ công dễ sai
- **Mục tiêu:** Có tool tự động cảnh báo và tính toán lot size

### Persona 2: Hương - Trader có kinh nghiệm
- **Nhu cầu:** Phân tích sâu hiệu suất trading, tối ưu chiến lược
- **Pain points:** Excel chart thủ công mất thời gian, khó nhìn xu hướng
- **Mục tiêu:** Dashboard với biểu đồ trực quan, export được báo cáo

---

## 7. Các câu hỏi cần làm rõ (Clarification Questions)

Trước khi viết chi tiết từng module, tôi cần xác nhận một số điểm:

### ✅ ĐÃ ĐƯỢC LÀM RÕ (Clarified)

#### A. Prop Firm Rules
1. **Quy tắc mặc định:** ✅ App có template rules sẵn (FTMO, The5ers). User có thể tùy chỉnh, nhưng validate để không cho vượt quá xa (ví dụ: nếu set 3%/lệnh hoặc 10 lệnh/ngày → cảnh báo không cho lưu)
2. **Max Drawdown:** ✅ Tính theo **Total Account**. Cần phân biệt rõ **Daily Loss Limit** và **Max Total Drawdown**

#### B. Trading Journal
3. **Nhập lệnh:** ✅ Cả manual entry và import CSV từ MT5
4. **Screenshot:** ❌ KHÔNG cần upload ảnh (tối ưu DB miễn phí)
5. **Tags:** ✅ User tự nhập tags (không có predefined list)

#### C. MT5 Integration
6-7. **Quyết định:** ❌ BỎ module MT5 Integration. Chỉ giữ import CSV thủ công.

#### D. Alert System
8. **Notification channel:** ✅ Ưu tiên **In-app popup** + Push notification (PWA)
9. **Timing:** ✅ **Reactive alerts** (cảnh báo sau khi vi phạm, vì cần có data để phát hiện)

---

## 8. Lộ trình triển khai (MVP Roadmap)

### Phase 1 - MVP Core (4-6 tuần)
- ✅ Authentication & User profile
- ✅ Trading Journal (CRUD trades)
- ✅ Capital & Risk Calculator
- ✅ Rules Engine với 2 rule cơ bản (Max trades, Max risk)
- ✅ Basic Dashboard

### Phase 2 - Analytics (2-3 tuần)
- ✅ Charts: Profit/Loss, Drawdown
- ✅ Win rate & R:R metrics
- ✅ Filter by date range, pairs

### Phase 3 - External Data (2 tuần)
- ✅ Economic Calendar integration
- ✅ Market Session Clock

### Phase 4 - Advanced Features (2-3 tuần)
- ✅ Alert System (In-app + Push notification)
- ✅ Export reports (PDF, CSV)

---

## 9. Tiếp theo (Next Steps)

Sau khi bạn review master plan này và trả lời các clarification questions ở mục 7, tôi sẽ:

1. ✍️ Viết chi tiết 6 file FDD con với đầy đủ:
   - User Stories & Acceptance Criteria
   - Business Logic & Flow
   - UI/UX Description
   - Edge Cases
   - Data Model (preliminary)

2. 📋 Tạo file `99-glossary.md` định nghĩa các thuật ngữ trading (Lot, Pip, Drawdown, v.v.)

3. 🎨 (Optional) Mockup wireframe nếu bạn cần visual representation

---

**Bạn có muốn tôi tiếp tục viết chi tiết từng module ngay, hay cần điều chỉnh gì ở master plan này trước?**
