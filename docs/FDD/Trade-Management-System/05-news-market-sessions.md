# News & Market Sessions - Functional Design Document

## 1. Tổng quan (Overview)

### 1.1 Mục tiêu
Cung cấp thông tin realtime về:
- Lịch tin tức kinh tế (Economic Calendar như ForexFactory)
- Giờ hoạt động của các phiên giao dịch chính (Session Clock)
- Giúp trader đưa ra quyết định đúng thời điểm

### 1.2 Phạm vi (Scope)

#### In-scope (Làm)
- ✅ Economic Calendar với ít nhất 3 mức impact (High, Medium, Low)
- ✅ Session Clock hiển thị 4 phiên: Asian, London, New York, Sydney
- ✅ Timezone customization
- ✅ Filter tin tức theo currency và impact level
- ✅ Integration với API miễn phí (ví dụ: ForexFactory scraper hoặc free economic calendar API)

#### Out-scope (Không làm)
- ❌ News sentiment analysis bằng AI
- ❌ Custom alerts cho từng tin tức cụ thể
- ❌ Historical news archive (chỉ hiện upcoming events)

---

## 2. User Stories & Acceptance Criteria

### Story 1: Xem Economic Calendar
**Là một trader**, tôi muốn **xem lịch tin tức kinh tế sắp tới**, để **tránh trade trong thời điểm biến động mạnh**.

#### Acceptance Criteria (AC):
- [ ] Bảng hiển thị các event trong 7 ngày tới:
  - Time (theo user's timezone)
  - Currency (USD, EUR, GBP, v.v.)
  - Event Name (VD: "Non-Farm Payrolls", "CPI")
  - Impact (High 🔴 / Medium 🟠 / Low 🟢)
  - Forecast (dự báo)
  - Previous (số liệu trước đó)
- [ ] Highlight events High Impact bằng màu đỏ
- [ ] Filter by:
  - Currency (Multi-select)
  - Impact Level (High only / All)
- [ ] Auto-refresh mỗi 1 giờ

---

### Story 2: Xem Session Clock
**Là một trader**, tôi muốn **thấy phiên nào đang mở**, để **trade vào thời điểm thanh khoản cao**.

#### Acceptance Criteria (AC):
- [ ] Hiển thị 4 phiên chính với status:
  - Asian (Tokyo + Sydney): Open/Closed
  - London: Open/Closed
  - New York: Open/Closed
  - Overlap (London + NY): Open/Closed
- [ ] Màu sắc:
  - Xanh dương: Open
  - Xám: Closed
- [ ] Countdown timer: "London opens in 2h 15m"
- [ ] Visual clock (vòng tròn 24h với các phiên được highlight)

---

### Story 3: Chọn Timezone
**Là một trader**, tôi muốn **chọn timezone của mình**, để **thấy giờ chính xác theo múi giờ địa phương**.

#### Acceptance Criteria (AC):
- [ ] Dropdown chọn timezone:
  - GMT+7 (Vietnam)
  - GMT+0 (UTC)
  - GMT-5 (New York)
  - v.v. (danh sách phổ biến)
- [ ] Lưu vào user settings
- [ ] Tất cả thời gian trong app hiển thị theo timezone đã chọn

---

## 3. Business Logic & Flow

### 3.1 Session Times (UTC)

```javascript
const sessions = {
  sydney: { open: 22, close: 7 },    // 22:00 - 07:00 UTC
  tokyo: { open: 0, close: 9 },      // 00:00 - 09:00 UTC
  london: { open: 8, close: 16 },    // 08:00 - 16:00 UTC
  newYork: { open: 13, close: 22 }   // 13:00 - 22:00 UTC
};

function isSessionOpen(sessionName, currentHourUTC) {
  const session = sessions[sessionName];
  
  if (session.close > session.open) {
    return currentHourUTC >= session.open && currentHourUTC < session.close;
  } else {
    // Wrap around midnight
    return currentHourUTC >= session.open || currentHourUTC < session.close;
  }
}

// Example:
isSessionOpen('tokyo', 5);  // true (5 AM UTC = Tokyo open)
isSessionOpen('london', 10); // true (10 AM UTC = London open)
```

---

### 3.2 Economic Calendar Data Source

**Option 1: Free API**
- Sử dụng API từ: https://www.fxstreet.com/economic-calendar hoặc tương tự
- Rate limit: ~100 requests/day (đủ cho app cá nhân)

**Option 2: Web Scraping (Backup)**
- Scrape ForexFactory.com (cẩn thận với rate limiting)
- Cache data trong 1 giờ để giảm requests

**Data Format:**
```javascript
{
  date: "2026-01-16T14:30:00Z",
  currency: "USD",
  event: "Retail Sales",
  impact: "High",  // High | Medium | Low
  forecast: "0.5%",
  previous: "0.3%",
  actual: null     // null trước khi công bố
}
```

---

## 4. UI/UX Description

### 4.1 Economic Calendar Page

```
┌──────────────────────────────────────────────────────────┐
│  Economic Calendar     Filter: [USD,EUR ▼] [High ▼]     │
├──────────────────────────────────────────────────────────┤
│  📅 Today - 16/01/2026                                   │
│  Time    Cur   Event                    Impact  Forecast │
│  14:30   USD   Retail Sales             🔴      0.5%     │
│  16:00   EUR   ECB Speech               🟠      -        │
│  20:00   GBP   BoE Interest Rate        🔴      4.75%    │
│                                                           │
│  📅 Tomorrow - 17/01/2026                                │
│  09:30   GBP   Unemployment Rate        🟠      4.2%     │
│  14:30   USD   Initial Jobless Claims  🟢      220K     │
│  ...                                                      │
└──────────────────────────────────────────────────────────┘
```

---

### 4.2 Session Clock (Visual)

```
┌────────────────────────────────────┐
│  Market Sessions                   │
│  Current Time: 10:30 AM (GMT+7)   │
├────────────────────────────────────┤
│  [○○○○●●●●○○○○] 24-Hour Clock      │
│   Asian  London  NewYork           │
│                                    │
│  ✅ London Session (OPEN)          │
│     Closes in 5h 30m               │
│                                    │
│  ⏸️ New York Session (CLOSED)      │
│     Opens in 2h 30m                │
│                                    │
│  ⏸️ Asian Session (CLOSED)         │
│     Opens in 11h 30m               │
│                                    │
│  🔥 Overlap (London+NY)            │
│     Opens in 2h 30m                │
└────────────────────────────────────┘
```

---

## 5. Edge Cases & Error Handling

| Tình huống | Xử lý |
|-----------|-------|
| API down hoặc rate limit | Hiển thị cached data (nếu có) + banner warning: "Calendar may be outdated. Using cached data." |
| User ở timezone lạ (GMT+12) | Tự động convert tất cả thời gian. Test với multiple timezones |
| Daylight Saving Time | Sử dụng thư viện moment-timezone để handle DST tự động |

---

## 6. Data Model

### Collection: `economic_events` (Cache)

```javascript
{
  _id: ObjectId("..."),
  date: ISODate("2026-01-16T14:30:00Z"),
  currency: "USD",
  event: "Retail Sales",
  impact: "High",
  forecast: "0.5%",
  previous: "0.3%",
  actual: null,
  
  lastUpdated: ISODate("2026-01-16T10:00:00Z"),
  source: "fxstreet-api"  // Tracking data source
}
```

**Index:**
```javascript
db.economic_events.createIndex({ date: 1, impact: 1 });
```

---

## 7. Dependencies & Integration Points

### 7.1 External APIs
- Economic Calendar API: FXStreet, Forex Factory, hoặc custom scraper
- Timezone library: moment-timezone hoặc date-fns-tz

### 7.2 Auto-update
- Cronjob chạy mỗi 1 giờ để fetch events mới
- Frontend poll mỗi 5 phút để update session clock

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Calendar load < 1 second
- Session clock update realtime (không lag)

### 8.2 Caching
- Cache economic events trong 1 giờ (localStorage + backend)

---

**File tiếp theo: `06-alert-system.md` (cuối cùng!)**
