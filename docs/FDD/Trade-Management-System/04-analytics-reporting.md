# Analytics & Reporting - Functional Design Document

## 1. Tổng quan (Overview)

### 1.1 Mục tiêu
Module Analytics & Reporting giúp trader visualize và phân tích hiệu suất giao dịch qua các biểu đồ và số liệu thống kê. Mục tiêu:
- Hiển thị Profit/Loss theo thời gian (daily, weekly, monthly)
- Theo dõi Drawdown qua biểu đồ trực quan
- Phân tích Win Rate, Average Win/Loss, Risk/Reward Ratio
- Breakdown theo cặp tiền, session, setup type
- Export báo cáo dạng PDF hoặc CSV

### 1.2 Phạm vi (Scope)

#### In-scope (Làm)
- ✅ Biểu đồ Equity Curve (balance theo thời gian)
- ✅ Biểu đồ Drawdown Timeline
- ✅ Win Rate pie chart và statistics
- ✅ Performance breakdown (by pair, session, day of week)
- ✅ Export reports (CSV, PDF)
- ✅ Date range filtering

#### Out-scope (Không làm)
- ❌ Advanced ML predictions
- ❌ Correlation analysis giữa các cặp tiền
- ❌ Compare với other traders (leaderboard)

---

## 2. User Stories & Acceptance Criteria

### Story 1: Xem Equity Curve
**Là một trader**, tôi muốn **xem biểu đồ balance theo thời gian**, để **thấy xu hướng tăng/giảm vốn**.

#### Acceptance Criteria (AC):
- [ ] Line chart hiển thị balance (Y-axis) theo ngày (X-axis)
- [ ] Hover vào point → Hiện tooltip: "Date: 15/01/2026, Balance: $10,450"
- [ ] Màu xanh cho uptrend, đỏ cho downtrend
- [ ] Date range selector: Last 7 days, Last 30 days, Last 3 months, Custom
- [ ] Zoom in/out với mouse wheel

---

### Story 2: Xem Drawdown Chart
**Là một trader**, tôi muốn **thấy drawdown qua thời gian**, để **biết khi nào tôi rơi vào giai đoạn khó khăn**.

#### Acceptance Criteria (AC):
- [ ] Area chart hiển thị % drawdown so với peak
- [ ] Horizontal line đỏ đánh dấu Max DD limit (10%)
- [ ] Highlight các vùng drawdown > 5% (màu vàng)
- [ ] Hiển thị "Max DD" point với icon cảnh báo

---

### Story 3: Xem Statistics Summary
**Là một trader**, tôi muốn **thấy tổng quan số liệu**, để **đánh giá hiệu suất tổng thể**.

#### Acceptance Criteria (AC):
- [ ] Cards hiển thị:
  - **Total Trades:** 145
  - **Win Rate:** 62.5% (90W / 55L)
  - **Avg Win:** $45.20
  - **Avg Loss:** -$32.10
  - **Profit Factor:** 1.75 (Total win / Total loss)
  - **Best Trade:** +$120 (link to trade)
  - **Worst Trade:** -$85 (link to trade)
- [ ] Compare với tháng trước (VD: Win rate: 62.5% ↑ +5%)

---

### Story 4: Breakdown by Symbol
**Là một trader**, tôi muốn **phân tích hiệu suất theo từng cặp tiền**, để **biết cặp nào tôi trade tốt nhất**.

#### Acceptance Criteria (AC):
- [ ] Bảng hiển thị:
  - Symbol
  - Trades count
  - Win Rate
  - Total P/L
  - Avg P/L per trade
- [ ] Sort by P/L (cao nhất trước)
- [ ] Bar chart visualization
- [ ] Click vào symbol → Filter trades của cặp đó

---

### Story 5: Breakdown by Session
**Là một trader**, tôi muốn **xem tôi trade tốt nhất ở phiên nào**, để **tập trung thời gian hiệu quả**.

#### Acceptance Criteria (AC):
- [ ] Phân tích theo 4 sessions:
  - Asian (Tokyo, Sydney)
  - London
  - New York
  - Overlap (London + NY)
- [ ] Hiển thị Win Rate và P/L cho mỗi session
- [ ] Radar chart hoặc bar chart

---

### Story 6: Export Reports
**Là một trader**, tôi muốn **export báo cáo**, để **nộp cho prop firm hoặc lưu trữ**.

#### Acceptance Criteria (AC):
- [ ] Button "Export Report"
- [ ] Chọn format:
  - CSV (raw data, mở bằng Excel)
  - PDF (professional report với charts)
- [ ] CSV bao gồm tất cả trades trong date range
- [ ] PDF bao gồm:
  - Summary stats
  - Equity curve screenshot
  - Drawdown chart
  - Breakdown by symbol
- [ ] Filename: `TradingReport_2026-01-15.pdf`

---

## 3. Business Logic & Flow

### 3.1 Công thức tính toán Metrics

#### Win Rate
```
Win Rate = (Số lệnh win / Tổng số lệnh) × 100%

Example:
- Total trades: 100
- Winning trades: 65
→ Win Rate = 65 / 100 = 65%
```

#### Profit Factor
```
Profit Factor = Total Profit / |Total Loss|

Example:
- Total Profit: $2,500
- Total Loss: -$1,500
→ Profit Factor = 2500 / 1500 = 1.67

(> 1 là profitable, > 2 là excellent)
```

#### Average Win & Average Loss
```
Avg Win = Sum of winning trades / Number of winning trades
Avg Loss = Sum of losing trades / Number of losing trades

Example:
- Winning trades: +50, +30, +70 → Avg Win = 150/3 = $50
- Losing trades: -20, -40, -30 → Avg Loss = -90/3 = -$30
```

#### Risk/Reward Ratio (Overall)
```
R:R = Avg Win / |Avg Loss|

Example:
- Avg Win: $50
- Avg Loss: -$30
→ R:R = 50 / 30 = 1.67:1
```

---

### 3.2 Drawdown Timeline Calculation

```javascript
function calculateDrawdownTimeline(trades) {
  let balance = initialBalance;
  let peak = initialBalance;
  const timeline = [];
  
  trades.forEach(trade => {
    balance += trade.profitLoss;
    
    if (balance > peak) {
      peak = balance;
    }
    
    const drawdown = ((peak - balance) / peak) * 100;
    
    timeline.push({
      date: trade.closeTime,
      balance: balance,
      peak: peak,
      drawdown: drawdown  // %
    });
  });
  
  return timeline;
}
```

---

### 3.3 Session Classification

```javascript
function getTradeSession(closeTime) {
  const hour = closeTime.getUTCHours();
  
  // UTC hours for major sessions:
  // Asian: 23:00 - 08:00 (Tokyo + Sydney)
  // London: 08:00 - 16:00
  // New York: 13:00 - 22:00
  // Overlap: 13:00 - 16:00 (London + NY)
  
  if (hour >= 13 && hour < 16) {
    return "Overlap";
  } else if (hour >= 8 && hour < 16) {
    return "London";
  } else if (hour >= 13 && hour < 22) {
    return "New York";
  } else {
    return "Asian";
  }
}
```

---

## 4. UI/UX Description

### 4.1 Analytics Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  Analytics & Reporting    [Last 30 days ▼] [Export Report]  │
├─────────────────────────────────────────────────────────────┤
│  📊 Performance Summary                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Trades  │ │Win Rate │ │Profit   │ │Avg Win  │          │
│  │  145    │ │ 62.5%   │ │Factor   │ │ $45.20  │          │
│  │         │ │ 90W/55L │ │  1.75   │ │         │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
├─────────────────────────────────────────────────────────────┤
│  📈 Equity Curve                                            │
│  ┌───────────────────────────────────────────────────┐     │
│  │11000┤                                        /\    │     │
│  │10500┤                     /\        /\      /  \   │     │
│  │10000┤────/\──────/\──/───/  \/\────/  \────/    \ │     │
│  │ 9500┤   /  \    /  \/  \/            \__/      \_│     │
│  │     └─────────────────────────────────────────────│     │
│  │      Jan 1      Jan 10      Jan 20      Jan 30   │     │
│  └───────────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────────┤
│  📉 Drawdown Timeline                                       │
│  ┌───────────────────────────────────────────────────┐     │
│  │ 0% ┠──────────────────────────────────────────────│     │
│  │    │       ╱╲                                     │     │
│  │-5% ┼──────╱──╲───────────────────── Max Limit    │     │
│  │    │           ╲    ╱╲                            │     │
│  │-10%┼────────────╲──╱──────────────────────────── │     │
│  │     └─────────────────────────────────────────────│     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Breakdown by Symbol (Table + Chart)

```
┌──────────────────────────────────────────────────┐
│  Performance by Symbol              [Sort: P/L]  │
├──────────────────────────────────────────────────┤
│  Symbol   Trades  Win%   Total P/L   Avg P/L    │
│  EURUSD     45    68%    +$520       +$11.56    │
│  GBPUSD     30    60%    +$280       +$9.33     │
│  USDJPY     25    52%    -$120       -$4.80     │
│  XAUUSD     15    73%    +$380       +$25.33    │
│  ...                                             │
│                                                   │
│  [Bar Chart Visualization]                       │
│  EURUSD  ████████████ +$520                      │
│  XAUUSD  ████████ +$380                          │
│  GBPUSD  ██████ +$280                            │
│  USDJPY  ▓▓ -$120                                │
└──────────────────────────────────────────────────┘
```

---

### 4.3 PDF Export Preview

```
┌────────────────────────────────────────┐
│  Trading Performance Report           │
│  Period: Jan 1 - Jan 31, 2026         │
├────────────────────────────────────────┤
│  SUMMARY                               │
│  Total Trades: 145                     │
│  Win Rate: 62.5%                       │
│  Total P/L: +$1,060                    │
│  Profit Factor: 1.75                   │
│                                        │
│  EQUITY CURVE                          │
│  [Chart screenshot]                    │
│                                        │
│  DRAWDOWN ANALYSIS                     │
│  Max Drawdown: 4.2%                    │
│  [Chart screenshot]                    │
│                                        │
│  TOP PERFORMING PAIRS                  │
│  1. EURUSD: +$520 (45 trades)         │
│  2. XAUUSD: +$380 (15 trades)         │
│  ...                                   │
│                                        │
│  Generated on: 2026-01-31 15:30       │
└────────────────────────────────────────┘
```

---

## 5. Edge Cases & Error Handling

| Tình huống | Xử lý |
|-----------|-------|
| Chưa có trades nào | Hiển thị empty state: "No trades yet. Start trading to see analytics!" |
| Chỉ có 1-2 trades | Warning: "Limited data. Analytics are more accurate with at least 20 trades." |
| Tất cả trades đều win (100% win rate) | Hiển thị bình thường, nhưng note: "Perfect win rate! Keep it up but stay cautious." |
| Date range không có trades | "No trades found in this period. Select a different date range." |

---

## 6. Data Model (Aggregation Pipeline)

### Aggregation cho Statistics Summary

```javascript
db.trades.aggregate([
  { $match: { userId: ObjectId("..."), closeTime: { $gte: startDate, $lte: endDate } } },
  {
    $group: {
      _id: null,
      totalTrades: { $sum: 1 },
      winningTrades: { $sum: { $cond: [{ $gt: ["$profitLossMoney", 0] }, 1, 0] } },
      totalProfit: { $sum: { $cond: [{ $gt: ["$profitLossMoney", 0] }, "$profitLossMoney", 0] } },
      totalLoss: { $sum: { $cond: [{ $lt: ["$profitLossMoney", 0] }, "$profitLossMoney", 0] } },
      bestTrade: { $max: "$profitLossMoney" },
      worstTrade: { $min: "$profitLossMoney" }
    }
  },
  {
    $project: {
      totalTrades: 1,
      winRate: { $multiply: [{ $divide: ["$winningTrades", "$totalTrades"] }, 100] },
      profitFactor: { $divide: ["$totalProfit", { $abs: "$totalLoss" }] },
      avgWin: { $divide: ["$totalProfit", "$winningTrades"] },
      avgLoss: { $divide: ["$totalLoss", { $subtract: ["$totalTrades", "$winningTrades"] }] },
      bestTrade: 1,
      worstTrade: 1
    }
  }
]);
```

---

## 7. Dependencies & Integration Points

### 7.1 Data Sources
- **Trading Journal:** Raw trade data
- **Capital Module:** Initial balance, current balance

### 7.2 Export Tool
- **Charts:** Sử dụng Recharts hoặc ApexCharts (có API export to PNG)
- **PDF Generation:** jsPDF hoặc Puppeteer (screenshot HTML → PDF)

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Charts phải render < 2 giây với 500 trades
- Dùng data decimation cho large datasets (chỉ plot 100 points thay vì 500)

### 8.2 Chart Library
- Recharts (React-friendly, lightweight)
- hoặc ApexCharts (nhiều tùy chỉnh hơn)

---

**File tiếp theo: `05-news-market-sessions.md`**
