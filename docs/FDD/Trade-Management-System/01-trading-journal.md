# Trading Journal - Functional Design Document

## 1. Tổng quan (Overview)

### 1.1 Mục tiêu
Trading Journal là **trái tim** của hệ thống, nơi trader ghi chép và quản lý toàn bộ lịch sử giao dịch. Mục tiêu:
- Lưu trữ chi tiết từng lệnh (entry, exit, profit/loss, notes)
- Hỗ trợ import từ MT5 hoặc nhập thủ công
- Cho phép phân tích và review lại các lệnh đã thực hiện
- Cung cấp dữ liệu đầu vào cho Analytics và Alert System

### 1.2 Phạm vi (Scope)

#### In-scope (Làm)
- ✅ CRUD operations (Create, Read, Update, Delete) trades
- ✅ Import lệnh từ MT5 history file (CSV)
- ❌ ~~Upload screenshots~~ (Bỏ để tối ưu database)
- ✅ Tagging system (Setup type, Session, Emotion)
- ✅ Filter & Search (By pair, date range, profit/loss, tags)
- ✅ Bulk actions (Delete multiple, Export selected)

#### Out-scope (Không làm)
- ❌ Realtime sync với MT5 (sẽ có ở module MT5 Integration)
- ❌ Social sharing trades (không phải mạng xã hội trading)
- ❌ Trade copy / Signal service

---

## 2. User Stories & Acceptance Criteria

### Story 1: Thêm lệnh thủ công
**Là một trader**, tôi muốn **thêm lệnh thủ công**, để **lưu lại các giao dịch khi không có file history từ MT5**.

#### Acceptance Criteria (AC):
- [ ] Form có các trường bắt buộc: Symbol (cặp tiền), Entry Price, Exit Price, Lot Size, Open Time, Close Time, Lí do vào lệnh
- [ ] Tự động tính toán Profit/Loss (pips & money) dựa trên Entry/Exit
- [ ] Có dropdown chọn Direction: BUY hoặc SELL
- [ ] Validation:
  - Entry Price và Exit Price phải là số dương
  - Open Time không được sau Close Time
  - Lot Size phải > 0 và <= 10 (giới hạn hợp lý)
- [ ] Sau khi Submit thành công, hiển thị Toast "Trade added successfully" và redirect về Trade List

---

### Story 2: Import lệnh từ MT5 CSV
**Là một trader**, tôi muốn **import lịch sử lệnh từ file CSV của MT5**, để **tiết kiệm thời gian thay vì nhập thủ công từng lệnh**.

#### Acceptance Criteria (AC):
- [ ] Hỗ trợ upload file CSV chuẩn MT5 (format: Deal, Time, Type, Volume, Symbol, Price, S/L, T/P, Profit, v.v.)
- [ ] Hiển thị preview table với 5 lệnh đầu tiên trước khi import
- [ ] Cho phép user map các cột CSV sang fields trong DB (nếu format khác chuẩn)
- [ ] Kiểm tra duplicate: Nếu lệnh đã tồn tại (dựa vào Deal ID hoặc Open Time + Symbol), skip và báo warning
- [ ] Hiển thị kết quả: "Imported 45/50 trades. 5 duplicates skipped."
- [ ] Button "Download Sample CSV" để user tham khảo format

---

### Story 3: Xem danh sách lệnh
**Là một trader**, tôi muốn **xem danh sách tất cả lệnh đã giao dịch**, để **review và phân tích**.

#### Acceptance Criteria (AC):
- [ ] Danh sách hiển thị dạng bảng (Table) với các cột:
  - Date & Time
  - Symbol
  - Direction (BUY/SELL với màu xanh/đỏ)
  - Entry Price
  - Exit Price
  - Lot Size
  - Profit/Loss (pips)
  - Profit/Loss ($) - Màu xanh nếu > 0, đỏ nếu < 0
  - Actions (View Detail, Edit, Delete)
- [ ] Mặc định sắp xếp theo Close Time giảm dần (lệnh mới nhất trên cùng)
- [ ] Pagination: 20 lệnh/trang
- [ ] Empty State: Nếu chưa có lệnh nào, hiển thị illustration + text "No trades yet. Add your first trade!"

---

### Story 4: Filter & Search
**Là một trader**, tôi muốn **lọc và tìm kiếm lệnh**, để **dễ dàng tìm lại các lệnh cụ thể**.

#### Acceptance Criteria (AC):
- [ ] Filter panel bao gồm:
  - Date Range Picker (From - To)
  - Symbol dropdown (Multi-select: EURUSD, GBPUSD, v.v.)
  - Direction (BUY / SELL / All)
  - Profit/Loss status (Winning / Losing / Breakeven / All)
  - Tags (Multi-select: Breakout, Pullback, News, v.v.)
- [ ] Search box: Tìm kiếm theo Symbol hoặc Notes (Full-text search)
- [ ] Button "Clear Filters" để reset về mặc định
- [ ] URL query params được update khi filter (để có thể bookmark hoặc share link)

---

### Story 5: Xem chi tiết lệnh
**Là một trader**, tôi muốn **xem chi tiết một lệnh cụ thể**, để **review setup, kết quả, và notes**.

#### Acceptance Criteria (AC):
- [ ] Modal hoặc trang riêng hiển thị đầy đủ thông tin:
  - **Trade Info:** Symbol, Direction, Entry, Exit, SL, TP, Lot Size
  - **Timing:** Open Time, Close Time, Duration (hold time)
  - **Performance:** Profit/Loss (pips & $), Risk/Reward Ratio
  - **Charts:** Entry Screenshot, Exit Screenshot (clickable để zoom)
  - **Notes:** Free text field (markdown support)
  - **Tags:** Display chips (Breakout, Asian Session, Emotional, v.v.)
- [ ] Button "Edit" để chuyển sang form chỉnh sửa
- [ ] Button "Delete" (confirm dialog trước khi xóa)

---

### Story 6: Chỉnh sửa lệnh
**Là một trader**, tôi muốn **chỉnh sửa thông tin lệnh đã nhập**, để **sửa lỗi hoặc bổ sung notes sau này**.

#### Acceptance Criteria (AC):
- [ ] Tất cả các field có thể chỉnh sửa (trừ ID, Created At)
- [ ] Validation giống như form Thêm lệnh mới
- [ ] Hiển thị timestamp "Last updated: 15/01/2026 14:30"
- [ ] Toast notification "Trade updated successfully"

---

### Story 7: Xóa lệnh
**Là một trader**, tôi muốn **xóa lệnh không chính xác**, để **giữ journal sạch sẽ**.

#### Acceptance Criteria (AC):
- [ ] Click button Delete → Hiện confirmation dialog: "Are you sure you want to delete this trade? This action cannot be undone."
- [ ] Nếu Yes → Xóa khỏi DB và redirect về Trade List
- [ ] Toast notification "Trade deleted successfully"

---

### Story 8: Bulk Actions
**Là một trader**, tôi muốn **thực hiện thao tác hàng loạt**, để **tiết kiệm thời gian khi cần xóa hoặc export nhiều lệnh**.

#### Acceptance Criteria (AC):
- [ ] Checkbox ở đầu mỗi dòng để chọn nhiều lệnh
- [ ] "Select All" checkbox để chọn tất cả lệnh trên trang hiện tại
- [ ] Toolbar xuất hiện khi có ít nhất 1 lệnh được chọn:
  - Button "Delete Selected" (confirm trước khi xóa)
  - Button "Export to CSV" (download file CSV)
- [ ] Hiển thị số lượng đang chọn: "3 trades selected"

---

## 3. Business Logic & Flow

### 3.1 Luồng thêm lệnh thủ công

```
1. User click "Add New Trade"
   ↓
2. Hiển thị Form với các field:
   - Symbol (Dropdown hoặc Autocomplete)
   - Direction (Radio: BUY / SELL)
   - Entry Price, Exit Price, Lot Size
   - Open Time, Close Time (DateTime picker)
   - Stop Loss, Take Profit (Optional)
   - Notes (Textarea)
   - Tags (Multi-select)
   - Screenshots (Upload files)
   ↓
3. User điền đầy đủ và click "Submit"
   ↓
4. Frontend Validation:
   - Check required fields
   - Check Entry/Exit price > 0
   - Check Open Time < Close Time
   ↓
5. Backend Validation:
   - Check Lot Size <= Max allowed (từ Rules Engine)
   - Check nếu vượt quá số lệnh trong ngày → Trigger warning (không block)
   ↓
6. Tính toán tự động:
   - Profit/Loss (pips) = (Exit - Entry) * Direction multiplier
   - Profit/Loss ($) = Pips * Lot Size * Pip Value
   - Risk/Reward Ratio = (Exit - Entry) / (Entry - SL)
   ↓
7. Lưu vào MongoDB collection "trades"
   ↓
8. Trigger Rules Engine để check vi phạm (gọi Alert System nếu cần)
   ↓
9. Redirect về Trade List + Toast success
```

---

### 3.2 Luồng Import CSV

```
1. User click "Import from MT5"
   ↓
2. Upload CSV file
   ↓
3. Backend parse CSV (sử dụng Papa Parse hoặc csv-parser)
   ↓
4. Hiển thị preview table (5 dòng đầu)
   ↓
5. User xác nhận "Import All"
   ↓
6. Loop qua từng dòng:
   - Check duplicate (by Deal ID hoặc Open Time + Symbol)
   - Nếu duplicate → Skip, log vào array "skipped"
   - Nếu mới → Insert vào DB, log vào array "imported"
   ↓
7. Hiển thị kết quả: "Imported X trades. Y duplicates skipped."
   ↓
8. Trigger batch check Rules Engine (nếu có vi phạm → Alert)
```

---

### 3.3 Công thức tính toán

#### A. Profit/Loss (Pips)
```
Nếu BUY:  Pips = (Exit Price - Entry Price) / Pip Size
Nếu SELL: Pips = (Entry Price - Exit Price) / Pip Size

Pip Size tùy cặp tiền:
- JPY pairs (USDJPY): 0.01
- Others (EURUSD): 0.0001
```

#### B. Profit/Loss (Money)
```
P/L ($) = Pips × Lot Size × Contract Size × Pip Value

Standard Lot = 100,000 units
Pip Value (EURUSD) = $10 per lot per pip
```

#### C. Risk/Reward Ratio
```
R:R = |Exit Price - Entry Price| / |Entry Price - Stop Loss|

Ví dụ: Entry 1.1000, SL 1.0950, TP 1.1100
→ R:R = (1.1100 - 1.1000) / (1.1000 - 1.0950) = 100/50 = 2:1
```

---

## 4. UI/UX Description

### 4.1 Trade List Page (Desktop)

#### Layout
```
┌──────────────────────────────────────────────────────────────┐
│  Trading Journal                        [+ Add Trade] [Import]│
├──────────────────────────────────────────────────────────────┤
│  Filters: [Date Range] [Symbol ▼] [Direction ▼] [Tags ▼]     │
│  Search: [____________] 🔍                    [Clear Filters] │
├──────────────────────────────────────────────────────────────┤
│  [ ] Date       Symbol  Dir  Entry   Exit    Lot  P/L(pips) $ │
│  [ ] 15/01 14:30 EURUSD BUY  1.1000  1.1050  0.1  +50      +50│
│  [ ] 15/01 12:15 GBPUSD SELL 1.2700  1.2680  0.2  +20      +40│
│  [ ] 14/01 16:00 USDJPY BUY  148.50  148.30  0.1  -20      -20│
│  ...                                                           │
├──────────────────────────────────────────────────────────────┤
│  Showing 1-20 of 145 trades        < 1 2 3 ... 8 >           │
└──────────────────────────────────────────────────────────────┘
```

#### Interactions
- **Hover row:** Highlight background (subtle color change)
- **Click row:** Open Detail Modal
- **Click Edit icon:** Open Edit Form in modal
- **Click Delete icon:** Show confirmation dialog
- **Select checkbox:** Enable bulk actions toolbar

---

### 4.2 Add/Edit Trade Form (Modal)

#### Fields Layout
```
┌─────────────────────────────────────────┐
│  Add New Trade                     [X]  │
├─────────────────────────────────────────┤
│  Symbol*       [EURUSD       ▼]         │
│  Direction*    ( ) BUY  (●) SELL        │
│                                          │
│  Entry Price*  [1.10000]                │
│  Exit Price*   [1.10500]                │
│  Stop Loss     [1.09500]                │
│  Take Profit   [1.11000]                │
│                                          │
│  Lot Size*     [0.10]                   │
│  Open Time*    [📅 15/01/2026 10:30]   │
│  Close Time*   [📅 15/01/2026 14:45]   │
│                                          │
│  Tags          [Breakout] [Asian] [+]   │
│                                          │
│  Notes         [___________________]    │
│                [___________________]    │
│                                          │
│  Screenshots   [📤 Upload Entry Chart]  │
│                [📤 Upload Exit Chart]   │
│                                          │
│            [Cancel]     [Submit Trade]  │
└─────────────────────────────────────────┘
```

#### Validation Messages
- Entry Price phải là số dương
- Close Time không được trước Open Time
- Lot Size: Min 0.01, Max 10

---

### 4.3 Trade Detail Modal

```
┌───────────────────────────────────────────────────────┐
│  Trade Detail - EURUSD BUY              [Edit] [Delete]│
├───────────────────────────────────────────────────────┤
│  📊 Trade Info                                         │
│  Symbol: EURUSD           Direction: BUY ⬆️            │
│  Entry: 1.10000           Exit: 1.10500                │
│  Stop Loss: 1.09500       Take Profit: 1.11000         │
│  Lot Size: 0.10                                        │
│                                                        │
│  ⏱️ Timing                                             │
│  Opened: 15/01/2026 10:30    Closed: 15/01/2026 14:45 │
│  Duration: 4h 15m                                      │
│                                                        │
│  💰 Performance                                        │
│  Profit/Loss: +50 pips (+$50.00) ✅                    │
│  Risk/Reward: 2.0:1                                    │
│                                                        │
│  📸 Charts                                             │
│  [Entry Chart Image]    [Exit Chart Image]            │
│                                                        │
│  📝 Notes                                              │
│  Clean breakout from consolidation. Entered on retest.│
│                                                        │
│  🏷️ Tags                                               │
│  [Breakout] [London Session] [High Confidence]        │
│                                                        │
│                                          [Close]       │
└───────────────────────────────────────────────────────┘
```

---

### 4.4 Mobile Responsive (< 768px)

- Bảng chuyển thành Card list:
```
┌──────────────────────────┐
│ EURUSD BUY ⬆️             │
│ 15/01/2026 14:30         │
│                          │
│ Entry: 1.1000            │
│ Exit:  1.1050            │
│                          │
│ P/L: +50 pips (+$50) ✅  │
│ [View] [Edit] [Delete]   │
└──────────────────────────┘
```

---

## 5. Edge Cases & Error Handling

### 5.1 Import CSV Errors

| Tình huống | Xử lý |
|-----------|-------|
| File không phải CSV | Hiển thị error toast: "Invalid file format. Please upload CSV." |
| CSV thiếu cột bắt buộc (Symbol, Entry) | Hiển thị: "Missing required column: Symbol. Please check sample CSV." |
| Tất cả lệnh đều duplicate | "All 50 trades are duplicates. No new trades imported." |
| File quá lớn (> 10MB) | "File too large. Max size: 10MB. Please split into smaller files." |

---

### 5.2 Upload Screenshot Errors

| Tình huống | Xử lý |
|-----------|-------|
| File không phải ảnh (PNG, JPG) | "Only image files (PNG, JPG) are allowed." |
| File > 5MB | "Image too large. Max size: 5MB." Suggest compress tool. |
| Upload thất bại (network error) | Retry button + error message |

---

### 5.3 Empty States

| Tình huống | UI |
|-----------|---|
| Chưa có lệnh nào | Illustration + "No trades yet. Add your first trade or import from MT5!" |
| Filter không trả về kết quả | "No trades found for selected filters. Try adjusting filters." |
| Delete lệnh cuối cùng trong list | Quay về empty state |

---

### 5.4 Slow Loading (Large Dataset)

- Nếu user có > 1000 lệnh:
  - Dùng **Virtual Scrolling** (React Window) thay vì pagination
  - Load 50 lệnh đầu, lazy load khi scroll
  - Indexing MongoDB: `{ userId: 1, closeTime: -1 }`

---

## 6. Data Model (Preliminary)

### Collection: `trades`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),  // Ref to users collection
  
  // Trade Basic Info
  symbol: "EURUSD",         // Required
  direction: "BUY",         // BUY | SELL, Required
  entryPrice: 1.10000,      // Required
  exitPrice: 1.10500,       // Required
  lotSize: 0.10,            // Required
  
  // Timing
  openTime: ISODate("2026-01-15T10:30:00Z"),   // Required
  closeTime: ISODate("2026-01-15T14:45:00Z"),  // Required
  durationMinutes: 255,     // Auto-calculated
  
  // Risk Management (Optional)
  stopLoss: 1.09500,
  takeProfit: 1.11000,
  
  // Performance (Auto-calculated)
  profitLossPips: 50,
  profitLossMoney: 50.00,
  riskRewardRatio: 2.0,
  
  // Metadata
  notes: "Clean breakout setup...",
  tags: ["Breakout", "London Session"],
  screenshots: {
    entry: "https://storage.../entry_123.png",
    exit: "https://storage.../exit_123.png"
  },
  
  // Import Info
  importSource: "manual",   // manual | mt5-csv | mt5-api
  mt5DealId: 12345678,      // Nullable, for duplicate detection
  
  // Timestamps
  createdAt: ISODate("2026-01-15T15:00:00Z"),
  updatedAt: ISODate("2026-01-15T15:00:00Z")
}
```

### Indexes
```javascript
db.trades.createIndex({ userId: 1, closeTime: -1 });  // List query optimization
db.trades.createIndex({ userId: 1, symbol: 1 });      // Filter by pair
db.trades.createIndex({ userId: 1, mt5DealId: 1 });   // Duplicate check
```

---

## 7. Dependencies & Integration Points

### 7.1 Calls to Other Modules
- **Rules Engine:** Sau khi insert/update trade → Check vi phạm rules
- **Alert System:** Nếu Rules Engine phát hiện vi phạm → Trigger alert
- **Analytics:** Data source cho biểu đồ, statistics

### 7.2 External Services
- **Image Storage:** AWS S3 hoặc Cloudinary để lưu screenshots
- **CSV Parser:** Papa Parse (frontend) hoặc csv-parser (backend)

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Trade List phải load trong < 2 giây với 1000 lệnh
- Pagination hoặc Virtual Scrolling cho large dataset
- Upload screenshot có progress bar

### 8.2 Security
- Chỉ user sở hữu mới được view/edit/delete trades của mình
- Validate file type trước khi upload (prevent malicious files)
- Sanitize Notes field (prevent XSS)

### 8.3 Accessibility
- Form labels có `for` attribute
- Error messages có ARIA attributes
- Keyboard navigation cho table và modal

---

## 9. Open Questions (Cần xác nhận)

1. **Symbol List:** Có giới hạn danh sách cặp tiền không? Hay cho phép user tự nhập bất kỳ?
2. **Commission & Swap:** Có cần lưu commission và swap cost không? (Nhiều prop firm không tính)
3. **Partial Close:** Có hỗ trợ lệnh partial close (đóng từng phần) không?
4. **Trade Copy:** Có cho phép duplicate một lệnh (để tạo template) không?

---

**File tiếp theo: `02-capital-risk-management.md` - Bạn muốn tôi viết tiếp không?**
