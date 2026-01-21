# Trade Management System - Glossary

## Thuật ngữ Trading

### A
**Account Balance**: Số dư tài khoản trading hiện tại, bao gồm cả profit/loss đã đóng.

**Achievement**: Cột mốc quan trọng trong quá trình trading (100 trades, +10% profit, v.v.)

**Aggregation Pipeline**: Chuỗi các thao tác xử lý dữ liệu trong MongoDB để tính toán metrics phức tạp.

**Alert**: Thông báo cảnh báo gửi đến trader khi có sự kiện quan trọng (vi phạm rules, drawdown cao, v.v.)

**Asian Session**: Phiên giao dịch châu Á (Tokyo + Sydney), thường từ 23:00 - 08:00 UTC.

---

### B
**Breakout**: Setup giao dịch khi giá phá vỡ mức hỗ trợ/kháng cự.

**Bulk Action**: Thao tác hàng loạt (xóa nhiều trades cùng lúc, export nhiều records).

---

### C
**Capital**: Vốn giao dịch ban đầu hoặc hiện tại.

**CSV (Comma-Separated Values)**: Định dạng file chứa dữ liệu dạng bảng, dùng để import/export trades.

**Current Balance**: Số dư hiện tại = Initial Balance + Tổng P/L.

---

### D
**Daily Drawdown**: Phần trăm sụt giảm vốn trong ngày so với số dư đầu ngày.
- Formula: `(Balance at 00:00 - Current Balance) / Balance at 00:00 × 100%`

**Daily Loss Limit**: Giới hạn thua lỗ tối đa trong 1 ngày (VD: 5% theo quy tắc FTMO).

**Drawdown**: Sụt giảm vốn so với đỉnh cao nhất (peak balance).

---

### E
**Economic Calendar**: Lịch công bố các sự kiện kinh tế quan trọng (CPI, NFP, lãi suất, v.v.)

**Entry Price**: Giá vào lệnh.

**Equity Curve**: Biểu đồ balance theo thời gian, thể hiện xu hướng tăng/giảm vốn.

**Exit Price**: Giá đóng lệnh.

---

### F
**ForexFactory**: Website cung cấp tin tức và lịch kinh tế Forex phổ biến.

**FTMO**: Công ty prop trading (funded account) nổi tiếng, có quy tắc nghiêm ngặt.

---

### L
**London Session**: Phiên giao dịch London, 08:00 - 16:00 UTC, thanh khoản cao nhất.

**Lot Size**: Khối lượng giao dịch (0.01 lot = 1,000 units, 1 lot = 100,000 units).

---

### M
**Max Drawdown**: Drawdown tối đa cho phép (VD: 10% theo FTMO).

**MT5 (MetaTrader 5)**: Phần mềm trading phổ biến, có thể export lịch sử lệnh dạng CSV.

---

### N
**New York Session**: Phiên giao dịch New York, 13:00 - 22:00 UTC.

**Non-Farm Payrolls (NFP)**: Chỉ số việc làm Mỹ, tin tức impact cao, gây biến động mạnh.

---

### O
**Overlap Session**: Thời gian cả London và New York cùng mở (13:00 - 16:00 UTC), thanh khoản cực cao.

---

### P
**Peak Balance**: Số dư cao nhất từng đạt được trong lịch sử trading.

**Pip (Point in Percentage)**: Đơn vị nhỏ nhất biến động giá.
- EUR/USD: 0.0001 = 1 pip
- USD/JPY: 0.01 = 1 pip

**Profit Factor**: Tỷ lệ tổng profit / tổng loss. > 1 là profitable, > 2 là excellent.
- Formula: `Total Profit / |Total Loss|`

**Prop Firm (Proprietary Trading Firm)**: Công ty cho trader dùng vốn của họ để giao dịch, chia lợi nhuận.

**Pullback**: Setup giao dịch khi giá điều chỉnh về vùng hỗ trợ/kháng cự trước khi tiếp tục xu hướng.

**PWA (Progressive Web App)**: Ứng dụng web có thể cài đặt như app native, hỗ trợ push notifications.

---

### R
**Reactive Alert**: Cảnh báo sau khi sự kiện đã xảy ra (ngược lại với preventive).

**Risk Calculator**: Công cụ tính lot size dựa trên % risk muốn chấp nhận.

**Risk/Reward Ratio (R:R)**: Tỷ lệ lợi nhuận kỳ vọng / rủi ro.
- Formula: `|Exit - Entry| / |Entry - Stop Loss|`
- VD: R:R = 2:1 nghĩa là kiếm được $2 cho mỗi $1 rủi ro.

**Rule Violation**: Vi phạm quy tắc trading (vượt quá số lệnh, risk quá cao, v.v.)

---

### S
**Session**: Phiên giao dịch (Asian, London, New York, Sydney).

**Setup Type**: Loại chiến lược giao dịch (Breakout, Pullback, News Trading, v.v.)

**Stop Loss (SL)**: Lệnh cắt lỗ tự động khi giá chạm mức định trước.

**Symbol**: Cặp tiền tệ hoặc tài sản giao dịch (VD: EURUSD, XAUUSD).

---

### T
**Take Profit (TP)**: Lệnh chốt lời tự động khi giá đạt mục tiêu.

**The 5%ers**: Công ty prop trading khác, quy tắc linh hoạt hơn FTMO.

**Timezone**: Múi giờ (GMT, UTC, GMT+7, v.v.)

**Total Drawdown**: Drawdown tính từ peak balance (cao nhất từng đạt).
- Formula: `(Peak Balance - Current Balance) / Peak Balance × 100%`

**Trading Journal**: Nhật ký giao dịch, ghi chép chi tiết từng lệnh.

---

### W
**Win Rate**: Tỷ lệ thắng.
- Formula: `(Số lệnh win / Tổng số lệnh) × 100%`

---

## Thuật ngữ Kỹ thuật

**Acknowledgement**: Đánh dấu đã đọc/xác nhận alert hoặc violation.

**API (Application Programming Interface)**: Giao diện lập trình để kết nối với dịch vụ bên ngoài.

**CRUD**: Create, Read, Update, Delete - 4 thao tác cơ bản với dữ liệu.

**Cronjob**: Tác vụ tự động chạy theo lịch (VD: mỗi ngày 00:00).

**Empty State**: Giao diện hiển thị khi chưa có dữ liệu.

**Index**: Cấu trúc dữ liệu trong database giúp tìm kiếm nhanh hơn.

**MongoDB**: Database NoSQL dạng document, dùng để lưu trades, alerts, v.v.

**Pagination**: Chia dữ liệu thành nhiều trang (VD: 20 records/trang).

**Snapshot**: Ảnh chụp trạng thái tại một thời điểm (VD: balance lúc 00:00).

**Socket.io**: Thư viện realtime communication giữa server và client.

**Toast**: Thông báo popup nhỏ xuất hiện ở góc màn hình.

**Validation**: Kiểm tra tính hợp lệ của dữ liệu trước khi lưu.

**Virtual Scrolling**: Kỹ thuật render chỉ phần dữ liệu đang hiển thị để tối ưu performance.

---

## Công thức Quan trọng

### 1. Lot Size Calculation
```
Lot Size = Risk Amount / (Pips at Risk × Pip Value)

Example:
- Account: $10,000
- Risk: 1% = $100
- Entry: 1.1000, SL: 1.0950 → 50 pips
- Pip Value: $10/pip/lot
→ Lot = 100 / (50 × 10) = 0.2 lots
```

### 2. Profit/Loss (Pips)
```
BUY:  Pips = (Exit - Entry) / Pip Size
SELL: Pips = (Entry - Exit) / Pip Size
```

### 3. Profit/Loss (Money)
```
P/L ($) = Pips × Lot Size × Pip Value
```

### 4. Win Rate
```
Win Rate = (Winning Trades / Total Trades) × 100%
```

### 5. Profit Factor
```
Profit Factor = Total Profit / |Total Loss|
```

### 6. Daily Drawdown
```
Daily DD (%) = (Balance 00:00 - Current) / Balance 00:00 × 100%
```

### 7. Total Drawdown
```
Total DD (%) = (Peak Balance - Current) / Peak × 100%
```

---

**End of Glossary** 📚
