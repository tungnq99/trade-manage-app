# Rules & Constraints Engine - Functional Design Document

## 1. Tổng quan (Overview)

### 1.1 Mục tiêu
Rules & Constraints Engine là **bộ não kiểm soát** của hệ thống, đảm bảo trader tuân thủ các quy tắc của prop firm. Mục tiêu:
- Cung cấp templates quy tắc có sẵn cho FTMO, The5ers, và các prop firms phổ biến
- Cho phép user tùy chỉnh rules theo nhu cầu (với validation hợp lý)
- Tự động kiểm tra vi phạm sau mỗi trade
- Trigger alerts khi phát hiện vi phạm
- Lưu lại lịch sử vi phạm để review

### 1.2 Phạm vi (Scope)

#### In-scope (Làm)
- ✅ Template rules cho các prop firms phổ biến (FTMO, The5ers, Custom)
- ✅ Tùy chỉnh rules cá nhân (với validation không cho set quá lơ là)
- ✅ Auto-check rules sau mỗi trade (reactive)
- ✅ 5 loại rules cơ bản:
  - Max trades per day
  - Max risk % per trade
  - Daily Loss Limit
  - Max Total Drawdown
  - Trading time restrictions (optional)
- ✅ Rule violation logging
- ✅ Enable/Disable từng rule riêng lẻ

#### Out-scope (Không làm)
- ❌ Preventive blocking (chặn trước khi trade - vì app không tích hợp realtime MT5)
- ❌ Advanced rules (win rate requirement, profit target)
- ❌ Machine learning để gợi ý rules

---

## 2. User Stories & Acceptance Criteria

### Story 1: Chọn Prop Firm Template
**Là một trader**, tôi muốn **chọn template quy tắc của prop firm tôi đang tham gia**, để **nhanh chóng setup mà không cần nhập thủ công**.

#### Acceptance Criteria (AC):
- [ ] Trang Settings có section "Trading Rules"
- [ ] Dropdown chọn Prop Firm:
  - FTMO
  - The 5%ers
  - Custom (tự định nghĩa)
- [ ] Khi chọn FTMO, tự động điền:
  - Max Trades/Day: 3
  - Max Risk/Trade: 1%
  - Daily Loss Limit: 5%
  - Max Total Drawdown: 10%
- [ ] Khi chọn The 5%ers:
  - Max Trades/Day: 5
  - Max Risk/Trade: 2%
  - Daily Loss Limit: 4%
  - Max Total Drawdown: 6%
- [ ] Khi chọn Custom: Tất cả fields trống, user tự nhập
- [ ] Button "Save Rules"

---

### Story 2: Tùy chỉnh Rules
**Là một trader**, tôi muốn **tùy chỉnh quy tắc theo phong cách giao dịch của mình**, để **phù hợp hơn với chiến lược**.

#### Acceptance Criteria (AC):
- [ ] Cho phép chỉnh sửa tất cả parameters sau khi chọn template
- [ ] Validation khi save:
  - Max Trades/Day: Min 1, Max 20 (nếu > 10 → Warning: "Are you sure? This is risky.")
  - Max Risk/Trade: Min 0.1%, Max 5% (nếu > 2% → Warning: "Higher than recommended.")
  - Daily Loss Limit: Min 1%, Max 10%
  - Max Total Drawdown: Min 5%, Max 20%
- [ ] Nếu user set quá lơ là (ví dụ: 10 trades/day, 5% risk/trade):
  - Hiển thị error: "These rules are too risky and may not align with prop firm standards. Please review."
  - **KHÔNG CHO LƯU** nếu vượt quá ngưỡng danger (Max Trades > 20 hoặc Risk > 5%)
- [ ] Hiển thị comparison với template gốc (nếu có):
  ```
  FTMO Template:  Max 3 trades/day
  Your Setting:   Max 5 trades/day ⚠️
  ```

---

### Story 3: Enable/Disable từng Rule
**Là một trader**, tôi muốn **tạm tắt một rule cụ thể**, để **linh hoạt trong một số trường hợp đặc biệt** (ví dụ: không giới hạn trades trong charity trading day).

#### Acceptance Criteria (AC):
- [ ] Mỗi rule có toggle switch (ON/OFF)
- [ ] Khi tắt một rule → Confirm dialog: "Are you sure you want to disable this rule? You won't receive alerts for violations."
- [ ] Rules đã tắt hiển thị mờ trong danh sách và có label "Disabled"
- [ ] Log vào audit trail: "User disabled 'Max Trades/Day' rule at 15/01/2026 14:30"

---

### Story 4: Nhận Alert khi vi phạm Rule
**Là một trader**, tôi muốn **được cảnh báo ngay khi vi phạm quy tắc**, để **biết mình cần dừng lại hoặc điều chỉnh**.

#### Acceptance Criteria (AC):
- [ ] Trigger check sau mỗi lần:
  - Thêm trade mới
  - Sửa trade (nếu thay đổi lot size hoặc P/L)
- [ ] Nếu phát hiện vi phạm → Trigger alert:
  - In-app toast (màu đỏ, icon warning)
  - Push notification (nếu user enable)
- [ ] Nội dung alert cụ thể:
  - "🚨 Rule Violation: Max Trades/Day (3)"
  - "You've placed 4 trades today. Stop trading to avoid account issues."
- [ ] Log vào Violation History

---

### Story 5: Xem Violation History
**Là một trader**, tôi muốn **xem lại lịch sử các lần vi phạm**, để **học hỏi và tránh lặp lại sai lầm**.

#### Acceptance Criteria (AC):
- [ ] Trang "Violation History" hiển thị bảng:
  - Date & Time
  - Rule Violated
  - Details (VD: "4 trades / 3 max")
  - Trade ID (link to trade detail)
  - Status (Acknowledged / Ignored)
- [ ] Filter by rule type, date range
- [ ] Button "Acknowledge" để đánh dấu đã đọc và hiểu
- [ ] Export to CSV

---

### Story 6: Xem trạng thái Rules trên Dashboard
**Là một trader**, tôi muốn **thấy tổng quan quy tắc ngay trên dashboard**, để **luôn nhớ giới hạn của mình**.

#### Acceptance Criteria (AC):
- [ ] Dashboard widget "Rules Status" hiển thị:
  ```
  Today's Trading Limits:
  Trades: 2/3 [██████░░░░] 67%
  Risk:   0.8%/1% used
  Daily Loss: 0% / 5% limit ✅
  ```
- [ ] Màu sắc động:
  - Xanh: < 50% limit
  - Vàng: 50-80%
  - Đỏ: > 80% (gần vi phạm)
- [ ] Click vào widget → Mở trang Rules Settings

---

## 3. Business Logic & Flow

### 3.1 Prop Firm Templates

#### FTMO Rules
```javascript
{
  firmName: "FTMO",
  rules: {
    maxTradesPerDay: 3,
    maxRiskPerTrade: 1.0,        // %
    dailyLossLimit: 5.0,         // %
    maxTotalDrawdown: 10.0,      // %
    tradingTimeRestriction: null // Không giới hạn giờ
  }
}
```

#### The 5%ers Rules
```javascript
{
  firmName: "The 5%ers",
  rules: {
    maxTradesPerDay: 5,
    maxRiskPerTrade: 2.0,
    dailyLossLimit: 4.0,
    maxTotalDrawdown: 6.0,
    tradingTimeRestriction: null
  }
}
```

#### Custom Template
```javascript
{
  firmName: "Custom",
  rules: {
    maxTradesPerDay: null,       // User định nghĩa
    maxRiskPerTrade: null,
    dailyLossLimit: null,
    maxTotalDrawdown: null,
    tradingTimeRestriction: null
  }
}
```

---

### 3.2 Validation Logic khi Save Rules

```javascript
function validateRules(rules) {
  const errors = [];
  const warnings = [];

  // Max Trades/Day
  if (rules.maxTradesPerDay < 1 || rules.maxTradesPerDay > 20) {
    errors.push("Max Trades/Day must be between 1 and 20");
  } else if (rules.maxTradesPerDay > 10) {
    warnings.push("Max Trades/Day > 10 is very high. Are you sure?");
  }

  // Max Risk/Trade
  if (rules.maxRiskPerTrade < 0.1 || rules.maxRiskPerTrade > 5) {
    errors.push("Max Risk/Trade must be between 0.1% and 5%");
  } else if (rules.maxRiskPerTrade > 2) {
    warnings.push("Risk > 2% per trade is risky. Recommended: ≤ 1%");
  }

  // Daily Loss Limit
  if (rules.dailyLossLimit < 1 || rules.dailyLossLimit > 10) {
    errors.push("Daily Loss Limit must be between 1% and 10%");
  }

  // Max Total Drawdown
  if (rules.maxTotalDrawdown < 5 || rules.maxTotalDrawdown > 20) {
    errors.push("Max Total Drawdown must be between 5% and 20%");
  }

  return { errors, warnings };
}
```

**UI Behavior:**
- Nếu có `errors` → KHÔNG cho lưu, hiển thị error messages
- Nếu chỉ có `warnings` → Hiện confirm dialog, user có thể lưu nếu đồng ý

---

### 3.3 Rule Check Flow (Reactive)

```
Trigger: User thêm/sửa trade
  ↓
1. Load user's active rules
  ↓
2. Check từng rule:

   A. Max Trades/Day
      - Query: Count trades hôm nay (WHERE closeTime = today)
      - IF count > maxTradesPerDay:
          → Violation detected
   
   B. Max Risk/Trade
      - Get trade.lotSize và trade.pipsAtRisk
      - Calculate actual risk %
      - IF actualRisk > maxRiskPerTrade:
          → Violation detected
   
   C. Daily Loss Limit
      - Get dailyDrawdown từ Capital module
      - IF dailyDrawdown > dailyLossLimit:
          → Violation detected
   
   D. Max Total Drawdown
      - Get totalDrawdown từ Capital module
      - IF totalDrawdown > maxTotalDrawdown:
          → Violation detected
  ↓
3. Nếu có violation:
   - Create violation record
   - Trigger Alert System (toast + push)
   - Log to violation_history collection
  ↓
4. Update Dashboard widget "Rules Status"
```

---

### 3.4 Risk Calculation per Trade

```javascript
// Công thức tính risk % của 1 trade
function calculateTradeRisk(trade, accountBalance) {
  const { lotSize, pipsAtRisk, symbol } = trade;
  
  // Pip value tùy theo cặp tiền
  const pipValue = symbol.includes("JPY") ? 
    (lotSize * 1000) : (lotSize * 10);
  
  // Risk Amount = Pips × Pip Value
  const riskAmount = pipsAtRisk * pipValue;
  
  // Risk % = (Risk Amount / Account Balance) × 100
  const riskPercent = (riskAmount / accountBalance) * 100;
  
  return riskPercent;
}

// Example:
const trade = {
  symbol: "EURUSD",
  lotSize: 0.5,
  pipsAtRisk: 20  // Entry 1.1000, SL 1.0980 → 20 pips
};
const balance = 10000;

const risk = calculateTradeRisk(trade, balance);
// → 20 pips × (0.5 × 10) = 100 USD
// → (100 / 10000) × 100 = 1%
```

---

## 4. UI/UX Description

### 4.1 Rules Settings Page

```
┌─────────────────────────────────────────────────────────┐
│  Trading Rules                                [Save]     │
├─────────────────────────────────────────────────────────┤
│  Prop Firm Template                                     │
│  [FTMO                ▼]                                │
│  ℹ️ Selecting a template will auto-fill the rules below│
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ⚙️ Rule Configuration                                  │
│                                                          │
│  [ ✓ ] Max Trades per Day                              │
│        [3      ] trades                                 │
│        Default: FTMO = 3 trades                         │
│                                                          │
│  [ ✓ ] Max Risk per Trade                              │
│        [1.0    ]%                                       │
│        Default: FTMO = 1%                               │
│                                                          │
│  [ ✓ ] Daily Loss Limit                                │
│        [5.0    ]%                                       │
│        Current: 2% used ($200/$500)                     │
│                                                          │
│  [ ✓ ] Max Total Drawdown                              │
│        [10.0   ]%                                       │
│        Current: 1.5% used ($150/$1,000)                 │
│                                                          │
│  [ ✗ ] Trading Time Restriction (Optional)             │
│        From [09:00] to [17:00] (Disabled)              │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ⚠️ Warnings                                            │
│  • Max Trades/Day > 5 is higher than FTMO standard    │
│                                                          │
│                    [Cancel]         [Save Changes]      │
└─────────────────────────────────────────────────────────┘
```

**Interactions:**
- Toggle switch để enable/disable từng rule
- Khi tắt rule → Confirm dialog
- Input có tooltip giải thích ý nghĩa của rule

---

### 4.2 Dashboard - Rules Status Widget

```
┌─────────────────────────────────────┐
│  📋 Today's Trading Limits          │
├─────────────────────────────────────┤
│  Trades Taken                       │
│  [████████░░] 2 / 3                │
│                                     │
│  Risk per Trade (Avg)               │
│  0.85% / 1% max ✅                  │
│                                     │
│  Daily Loss                         │
│  [██░░░░░░░░] 1.2% / 5% ✅         │
│                                     │
│  Total Drawdown                     │
│  [█░░░░░░░░░] 1.5% / 10% ✅        │
│                                     │
│         [View Rules Settings]       │
└─────────────────────────────────────┘
```

---

### 4.3 Violation Alert (Toast)

```
┌────────────────────────────────────────┐
│ 🚨 Rule Violation Detected             │
├────────────────────────────────────────┤
│ Max Trades per Day (3)                 │
│                                        │
│ You've placed 4 trades today.         │
│ This violates FTMO rules.             │
│                                        │
│ Recommendation: Stop trading for      │
│ today to protect your account.        │
│                                        │
│        [View Details]     [Dismiss]    │
└────────────────────────────────────────┘
```

---

### 4.4 Violation History Page

```
┌──────────────────────────────────────────────────────────┐
│  Violation History            [Filter ▼] [Export CSV]    │
├──────────────────────────────────────────────────────────┤
│  Date         Rule            Details           Status   │
│  15/01 14:30  Max Trades/Day  4/3 trades       ⚠️ New    │
│  13/01 16:45  Max Risk/Trade  1.5% (max 1%)    ✓ Ack    │
│  11/01 12:00  Daily Loss      5.2% (max 5%)    ✓ Ack    │
│  ...                                                      │
└──────────────────────────────────────────────────────────┘
```

- Click vào row → Hiện detail modal với trade ID và recommended actions

---

## 5. Edge Cases & Error Handling

### 5.1 Template Switching

| Tình huống | Xử lý |
|-----------|-------|
| User switch từ FTMO sang The 5%ers khi đã có trades | Confirm: "Changing template will reset your rules. Continue?" → Recalculate violations dựa trên rules mới |
| User switch sang Custom và xóa hết rules | Warning: "At least one rule must be active for protection." |

---

### 5.2 Rule Check Errors

| Tình huống | Xử lý |
|-----------|-------|
| Capital module chưa có balance data | Skip Daily Loss và Total DD check, chỉ check Max Trades |
| Trade thiếu SL → Không tính được risk | Log warning, skip Max Risk check cho trade đó |

---

### 5.3 False Positives

| Tình huống | Xử lý |
|-----------|-------|
| User sửa trade cũ (ngày hôm trước) | Chỉ check rules của ngày trade đó, không trigger alert cho hôm nay |
| Timezone mismatch (user ở múi giờ khác) | Dùng user's timezone để count "today" |

---

## 6. Data Model (Preliminary)

### Collection: `rules_settings`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  propFirmTemplate: "FTMO",  // FTMO | The5ers | Custom
  
  rules: {
    maxTradesPerDay: {
      enabled: true,
      value: 3
    },
    maxRiskPerTrade: {
      enabled: true,
      value: 1.0  // %
    },
    dailyLossLimit: {
      enabled: true,
      value: 5.0  // %
    },
    maxTotalDrawdown: {
      enabled: true,
      value: 10.0  // %
    },
    tradingTimeRestriction: {
      enabled: false,
      startTime: null,
      endTime: null
    }
  },
  
  // Audit trail
  lastModified: ISODate("2026-01-15T14:00:00Z"),
  modificationHistory: [
    {
      timestamp: ISODate("2026-01-15T14:00:00Z"),
      action: "Updated maxTradesPerDay from 3 to 5",
      userId: ObjectId("...")
    }
  ],
  
  createdAt: ISODate("2026-01-10T00:00:00Z"),
  updatedAt: ISODate("2026-01-15T14:00:00Z")
}
```

---

### Collection: `violation_history`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  ruleType: "maxTradesPerDay",  // maxTradesPerDay | maxRiskPerTrade | dailyLossLimit | maxTotalDrawdown
  
  violation: {
    limit: 3,
    actual: 4,
    details: "4 trades placed today, exceeding limit of 3"
  },
  
  tradeId: ObjectId("..."),  // Trade gây ra vi phạm
  
  timestamp: ISODate("2026-01-15T14:30:00Z"),
  
  status: "new",  // new | acknowledged | ignored
  acknowledgedAt: null,
  
  alertSent: true  // Đã gửi alert chưa
}
```

**Index:**
```javascript
db.violation_history.createIndex({ userId: 1, timestamp: -1 });
db.violation_history.createIndex({ userId: 1, status: 1 });
```

---

## 7. Dependencies & Integration Points

### 7.1 Calls to Other Modules
- **Trading Journal:** Đọc số lượng trades trong ngày, lot size, risk
- **Capital Module:** Lấy Current Balance, Daily DD, Total DD
- **Alert System:** Trigger alert khi detect violation

### 7.2 Trigger Points
- Trade inserted/updated → Check rules
- Rules settings changed → Revalidate all recent trades (last 7 days)

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Rule check phải < 300ms (để không làm chậm việc thêm trade)
- Dùng indexing cho count trades query

### 8.2 Reliability
- Nếu rule check fail (error) → Log error nhưng KHÔNG block trade submission
- User vẫn có thể disable rules nếu cần

---

## 9. Open Questions (Cần xác nhận)

1. **Soft vs Hard Block:** Khi vi phạm Daily Loss Limit, có nên **hard block** (không cho thêm trade mới) không? Hay chỉ warning?
2. **Batch Import CSV:** Nếu user import 50 trades cùng lúc và 10 trades vi phạm, có gửi 10 alerts riêng lẻ không? Hay gộp thành 1 summary alert?
3. **Historical Violations:** Khi user thay đổi rules (ví dụ giảm từ 5 trades xuống 3), có cần recalculate violations cho các ngày trước không?

---

**File tiếp theo: `04-analytics-reporting.md` - Tiếp tục nhé?**
