# Capital & Risk Management - Functional Design Document

## 1. Tổng quan (Overview)

### 1.1 Mục tiêu
Module Capital & Risk Management giúp trader:
- Quản lý vốn ban đầu và theo dõi số dư hiện tại
- Tính toán lot size dựa trên % risk mong muốn
- Theo dõi rủi ro theo ngày, tuần, và tổng vốn
- Đảm bảo không vượt quá Max Drawdown (Daily và Total)

### 1.2 Phạm vi (Scope)

#### In-scope (Làm)
- ✅ Nhập và cập nhật vốn ban đầu (Initial Balance)
- ✅ Tự động tính Current Balance từ P/L của các lệnh
- ✅ Risk Calculator: Tính lot size dựa trên % risk
- ✅ Theo dõi Daily Loss Limit và Max Total Drawdown
- ✅ Thống kê rủi ro theo thời gian (Daily, Weekly)
- ✅ Cảnh báo khi gần đạt drawdown limit

#### Out-scope (Không làm)
- ❌ Quản lý multiple accounts (chỉ 1 account/user trong MVP)
- ❌ Advanced portfolio management (hedge positions, correlation)
- ❌ Compound interest calculator (sẽ có ở phiên bản sau)

---

## 2. User Stories & Acceptance Criteria

### Story 1: Nhập vốn ban đầu
**Là một trader**, tôi muốn **nhập vốn ban đầu của tài khoản**, để **hệ thống tính toán rủi ro và drawdown chính xác**.

#### Acceptance Criteria (AC):
- [ ] Form có field "Initial Balance" (USD)
- [ ] Validation: Balance phải > 0 và <= 1,000,000 (giới hạn hợp lý)
- [ ] Cho phép chọn currency (USD, EUR, GBP) - Default: USD
- [ ] Sau khi lưu, hiển thị toast "Capital settings saved"
- [ ] Nếu đã có trades, cảnh báo: "Changing initial balance will affect all historical calculations. Continue?"

---

### Story 2: Xem tổng quan vốn và rủi ro
**Là một trader**, tôi muốn **xem tổng quan tình hình vốn hiện tại**, để **biết mình đang ở vị thế nào**.

#### Acceptance Criteria (AC):
- [ ] Dashboard hiển thị các card:
  - **Initial Balance:** $10,000
  - **Current Balance:** $10,450 (màu xanh nếu > Initial, đỏ nếu <)
  - **Total P/L:** +$450 (+4.5%)
  - **Daily P/L:** +$120 (+1.2%) - Reset về 0 mỗi ngày
  - **Peak Balance:** $10,600 (số dư cao nhất đã đạt được)
- [ ] Hiển thị progress bar cho:
  - Daily Loss Limit: $50 / $500 used (10%)
  - Max Total Drawdown: 2% / 10% (màu xanh < 50%, vàng 50-80%, đỏ > 80%)
- [ ] Update realtime khi thêm/sửa/xóa trade

---

### Story 3: Sử dụng Risk Calculator
**Là một trader**, tôi muốn **tính lot size dựa trên % risk**, để **không bao giờ rủi ro quá mức cho phép**.

#### Acceptance Criteria (AC):
- [ ] Calculator có các input:
  - Account Balance (tự động lấy từ Current Balance)
  - Risk % per trade (slider: 0.1% - 5%, default: 1%)
  - Symbol (dropdown)
  - Entry Price
  - Stop Loss Price
- [ ] Output hiển thị:
  - Risk Amount ($): Tự động tính = Balance × Risk %
  - Pips at Risk: |Entry - Stop Loss|
  - **Recommended Lot Size:** Tự động tính và highlight
- [ ] Button "Copy Lot Size" để copy vào clipboard
- [ ] Validation:
  - Entry và SL không được bằng nhau
  - Risk % không vượt quá rule đã setup (ví dụ: max 2%/trade)

---

### Story 4: Theo dõi Drawdown
**Là một trader**, tôi muốn **theo dõi drawdown (sụt giảm vốn)**, để **đảm bảo không vi phạm quy tắc của prop firm**.

#### Acceptance Criteria (AC):
- [ ] Hiển thị 2 loại drawdown:
  - **Daily Drawdown:** Loss trong ngày so với balance đầu ngày
  - **Total Drawdown:** Loss so với Peak Balance (đỉnh cao nhất từng đạt)
- [ ] Formula:
  - Daily DD = (Balance lúc 00:00 - Current Balance) / Balance lúc 00:00 × 100%
  - Total DD = (Peak Balance - Current Balance) / Peak Balance × 100%
- [ ] Visual representation:
  - Progress bar với màu sắc (xanh/vàng/đỏ)
  - Icon cảnh báo nếu > 80% limit
- [ ] Hiển thị còn bao nhiêu $ có thể loss trước khi vi phạm

---

### Story 5: Xem lịch sử rủi ro theo thời gian
**Là một trader**, tôi muốn **xem biểu đồ rủi ro theo ngày/tuần**, để **phân tích xu hướng quản lý vốn của mình**.

#### Acceptance Criteria (AC):
- [ ] Tab "Risk History" với date range picker
- [ ] Bảng hiển thị:
  - Date
  - Starting Balance
  - Ending Balance
  - Daily P/L ($)
  - Daily P/L (%)
  - Daily Drawdown (%)
  - Số lệnh trong ngày
- [ ] Export to CSV
- [ ] Filter by: Profitable days only / Loss days only / All

---

### Story 6: Nhận cảnh báo Drawdown
**Là một trader**, tôi muốn **được cảnh báo khi gần đạt drawdown limit**, để **kịp thời dừng trading**.

#### Acceptance Criteria (AC):
- [ ] Trigger cảnh báo khi:
  - Daily Drawdown đạt 80% của Daily Loss Limit
  - Total Drawdown đạt 80% của Max Drawdown
- [ ] Alert hiển thị:
  - In-app popup (toast màu đỏ, icon warning)
  - Push notification (nếu user enable)
- [ ] Nội dung: "⚠️ Daily Loss Limit Warning: You've used 80% ($400/$500). Stop trading for today!"
- [ ] Log vào Alert History

---

## 3. Business Logic & Flow

### 3.1 Tính toán Current Balance

```
Current Balance = Initial Balance + Sum of All P/L

Example:
- Initial Balance: $10,000
- Trade 1: +$50
- Trade 2: -$20
- Trade 3: +$120
→ Current Balance = $10,000 + ($50 - $20 + $120) = $10,150
```

**Edge Case:** Nếu user xóa một trade → Recalculate toàn bộ balance

---

### 3.2 Tính toán Peak Balance

```
Peak Balance = Max value của Current Balance từ trước đến nay

Update khi:
- Thêm trade có profit → Check if new Current Balance > Peak
- Xóa trade → Recalculate peak từ đầu (query max)

Example:
Day 1: Balance = $10,000 → Peak = $10,000
Day 2: Balance = $10,500 → Peak = $10,500
Day 3: Balance = $10,200 → Peak vẫn = $10,500 (không giảm)
```

---

### 3.3 Tính toán Daily P/L

```
1. Lấy balance lúc 00:00 hôm nay (từ snapshot hoặc tính backward)
2. So sánh với Current Balance

Daily P/L = Current Balance - Balance at 00:00 today

Auto-reset:
- Chạy cronjob mỗi 00:00 (hoặc check khi user login lần đầu trong ngày)
- Lưu snapshot vào collection "daily_snapshots"
```

---

### 3.4 Risk Calculator - Lot Size Formula

```javascript
// Input:
const accountBalance = 10000; // USD
const riskPercentage = 1; // %
const entryPrice = 1.10000;
const stopLoss = 1.09500;
const symbol = "EURUSD";

// Step 1: Calculate Risk Amount
const riskAmount = accountBalance * (riskPercentage / 100);
// → $10,000 × 1% = $100

// Step 2: Calculate Pips at Risk
const pipSize = symbol.includes("JPY") ? 0.01 : 0.0001;
const pipsAtRisk = Math.abs(entryPrice - stopLoss) / pipSize;
// → |1.10000 - 1.09500| / 0.0001 = 50 pips

// Step 3: Calculate Lot Size
const pipValue = 10; // Standard: $10 per pip per lot for major pairs
const lotSize = riskAmount / (pipsAtRisk * pipValue);
// → $100 / (50 × $10) = 0.2 lots

// Round to 2 decimal places
const recommendedLotSize = Math.round(lotSize * 100) / 100;
// → 0.20 lots
```

---

### 3.5 Drawdown Formulas

#### Daily Drawdown
```
Daily DD (%) = [(Balance at 00:00 - Current Balance) / Balance at 00:00] × 100

Example:
- Balance at 00:00: $10,000
- Current Balance: $9,700
→ Daily DD = [($10,000 - $9,700) / $10,000] × 100 = 3%

Nếu Daily Loss Limit = 5% → Đã dùng 60% (3/5)
```

#### Total Drawdown
```
Total DD (%) = [(Peak Balance - Current Balance) / Peak Balance] × 100

Example:
- Peak Balance: $10,500 (highest ever)
- Current Balance: $9,975
→ Total DD = [($10,500 - $9,975) / $10,500] × 100 = 5%

Nếu Max Total Drawdown = 10% → Đã dùng 50% (5/10)
```

---

### 3.6 Luồng cảnh báo Drawdown

```
Trigger mỗi khi:
1. User thêm/sửa/xóa trade
   ↓
2. Recalculate Current Balance
   ↓
3. Check Daily Drawdown:
   IF (Daily DD >= Daily Loss Limit × 0.8):
     → Trigger Alert: "Daily Loss Warning"
   ↓
4. Check Total Drawdown:
   IF (Total DD >= Max Total Drawdown × 0.8):
     → Trigger Alert: "Max Drawdown Warning"
   ↓
5. IF (Daily DD >= Daily Loss Limit × 1.0):
     → Trigger Critical Alert + Block thêm trade mới (UI disable)
   ↓
6. Save to Alert History collection
```

---

## 4. UI/UX Description

### 4.1 Capital Overview Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  Capital & Risk Management                                   │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Initial    │  │ Current    │  │ Total P/L  │            │
│  │ Balance    │  │ Balance    │  │            │            │
│  │ $10,000    │  │ $10,450 ⬆️ │  │ +$450      │            │
│  │            │  │            │  │ (+4.5%)    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  ┌────────────┐  ┌────────────┐                            │
│  │ Daily P/L  │  │ Peak       │                            │
│  │ +$120      │  │ Balance    │                            │
│  │ (+1.2%)    │  │ $10,600    │                            │
│  └────────────┘  └────────────┘                            │
├─────────────────────────────────────────────────────────────┤
│  📊 Drawdown Status                                         │
│                                                              │
│  Daily Loss Limit (5% max)                                  │
│  [████░░░░░░░░░░░░░░] 2% used ($200/$500)                  │
│  ✅ Safe - $300 remaining                                   │
│                                                              │
│  Max Total Drawdown (10% max)                               │
│  [███░░░░░░░░░░░░░░░] 1.43% used ($150/$1,050)             │
│  ✅ Safe - $900 remaining                                   │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Risk Calculator (Modal / Side Panel)

```
┌──────────────────────────────────────┐
│  💰 Risk Calculator            [X]   │
├──────────────────────────────────────┤
│  Account Balance                     │
│  $10,450 (Current)                   │
│                                      │
│  Risk per Trade                      │
│  [━━━●━━━━━━━━] 1.0%                │
│  0.5%      1.5%      2.0%            │
│                                      │
│  Symbol        [EURUSD       ▼]     │
│                                      │
│  Entry Price   [1.10000]            │
│  Stop Loss     [1.09500]            │
│                                      │
├──────────────────────────────────────┤
│  📊 Calculation Results              │
│                                      │
│  Risk Amount:    $104.50             │
│  Pips at Risk:   50 pips             │
│                                      │
│  ✨ RECOMMENDED LOT SIZE              │
│  ┌──────────────────────────────┐   │
│  │   0.21 lots (21,000 units)   │   │
│  └──────────────────────────────┘   │
│                                      │
│  [Copy to Clipboard] 📋              │
└──────────────────────────────────────┘
```

---

### 4.3 Risk History Table

```
┌─────────────────────────────────────────────────────────────┐
│  Risk History           [Date Range: Last 30 days ▼] [Export]│
├─────────────────────────────────────────────────────────────┤
│  Date       Start    End      P/L($)  P/L(%)  DD(%)  Trades │
│  15/01/26  $10,330  $10,450   +$120   +1.16%  0%     3      │
│  14/01/26  $10,280  $10,330   +$50    +0.49%  0%     2      │
│  13/01/26  $10,400  $10,280   -$120   -1.15%  1.15%  5      │
│  12/01/26  $10,350  $10,400   +$50    +0.48%  0%     1      │
│  ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.4 Alert Example (In-app Toast)

```
┌────────────────────────────────────────┐
│ ⚠️  Daily Loss Limit Warning           │
├────────────────────────────────────────┤
│ You've reached 4.2% daily drawdown.   │
│ Limit: 5%                              │
│ Remaining: $80 before violation        │
│                                        │
│ Consider stopping trading for today.  │
│                              [Dismiss] │
└────────────────────────────────────────┘
```

---

## 5. Edge Cases & Error Handling

### 5.1 Initial Balance Changes

| Tình huống | Xử lý |
|-----------|-------|
| User thay đổi Initial Balance khi đã có trades | Confirm dialog: "This will recalculate all historical metrics. Continue?" → Nếu Yes, recompute toàn bộ |
| User set Initial Balance < Current Balance (có profit rồi) | Warning: "Initial balance should be set to your starting capital, not current balance." |

---

### 5.2 Peak Balance Edge Cases

| Tình huống | Xử lý |
|-----------|-------|
| User xóa trade có profit cao → Peak giảm | Recalculate peak từ đầu (query max balance trong history) |
| User import CSV với lệnh cũ có peak cao hơn | Update peak nếu discover balance cao hơn |

---

### 5.3 Daily Snapshot Missing

| Tình huống | Xử lý |
|-----------|-------|
| User không login cả ngày → Không có snapshot 00:00 | Backward calculate: Lấy balance cuối ngày hôm qua làm starting balance hôm nay |
| Server downtime lúc 00:00 | Cronjob retry sau 5 phút, nếu fail → manual trigger khi user login |

---

### 5.4 Negative Balance (Extreme Loss)

| Tình huống | Xử lý |
|-----------|-------|
| Balance xuống âm (edge case: nhiều lệnh loss liên tiếp) | Hiển thị warning: "Account balance is negative. Please review your trades for errors." |

---

## 6. Data Model (Preliminary)

### Collection: `capital_settings`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  initialBalance: 10000.00,
  currency: "USD",  // USD, EUR, GBP
  
  // Auto-calculated fields
  currentBalance: 10450.00,
  peakBalance: 10600.00,
  totalProfitLoss: 450.00,
  
  // Timestamps
  createdAt: ISODate("2026-01-10T00:00:00Z"),
  updatedAt: ISODate("2026-01-15T14:30:00Z")
}
```

---

### Collection: `daily_snapshots`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  date: ISODate("2026-01-15T00:00:00Z"),  // Start of day
  
  startingBalance: 10330.00,
  endingBalance: 10450.00,
  
  dailyProfitLoss: 120.00,
  dailyProfitLossPercent: 1.16,
  
  dailyDrawdown: 0,  // % (max intraday loss)
  
  numberOfTrades: 3,
  winningTrades: 2,
  losingTrades: 1,
  
  createdAt: ISODate("2026-01-15T00:00:01Z")
}
```

**Index:**
```javascript
db.daily_snapshots.createIndex({ userId: 1, date: -1 });
```

---

## 7. Dependencies & Integration Points

### 7.1 Calls to Other Modules
- **Trading Journal:** Đọc tất cả trades để tính Current Balance
- **Rules Engine:** Lấy Daily Loss Limit, Max Total Drawdown từ rules
- **Alert System:** Trigger alert khi drawdown đạt ngưỡng

### 7.2 Auto-update Triggers
- Mỗi khi thêm/sửa/xóa trade → Recalculate Balance & Drawdown
- Cronjob 00:00 mỗi ngày → Create daily snapshot

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Balance calculation phải < 500ms (với 1000 trades)
- Dùng indexing và aggregation pipeline để tối ưu

### 8.2 Data Accuracy
- Financial calculations phải chính xác đến 2 chữ số thập phân
- Sử dụng `Decimal128` trong MongoDB cho tiền (không dùng `Number`)

---

## 9. Open Questions (Cần xác nhận)

1. **Currency Conversion:** Nếu user trade nhiều cặp tiền khác nhau (EURUSD, GBPJPY), có cần convert về base currency không? Hay cứ giả định tất cả là USD?
2. **Compounding:** Có cần tính compound (tái đầu tư profit) cho risk calculator không? Ví dụ: ngày 1 risk 1% của $10K, ngày 2 risk 1% của $10.5K?
3. **Reset Daily Limit:** Daily Loss Limit có reset vào lúc 00:00 theo timezone nào? User's timezone hay UTC?

---

**File tiếp theo: `03-rules-constraints.md` - Tiếp tục viết nhé?**
