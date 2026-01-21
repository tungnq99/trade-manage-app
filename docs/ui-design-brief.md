# UI/UX Design Brief - Trade Management System
**For AI Design Tool (Stitch AI)**

## 📋 Project Overview

**App Name:** TradeManager  
**Type:** Web Application (Desktop-first, responsive)  
**Theme:** Professional Trading Dashboard  
**Target Users:** Prop traders (FTMO, The5%ers)  
**Design Style:** Modern, Clean, Data-dense

---

## 🎨 Visual Direction

### Style References
- **Similar to:** TradingView, MetaTrader 5 dashboard
- **Mood:** Professional, trustworthy, focused on data
- **Aesthetic:** Modern SaaS dashboard with trading-specific elements

### Color Scheme
- **Primary:** Blue (#3b82f6) - Professional, trust
- **Success/Profit:** Green (#22c55e) - Winning trades
- **Danger/Loss:** Red (#ef4444) - Losing trades, violations
- **Warning:** Orange (#f97316) - Approaching limits
- **Background:** White (light mode), Dark slate (dark mode)

### Typography
- **Font:** Inter, clean sans-serif
- **Hierarchy:** Clear distinction between headings, body, data

---

## 📱 Screen Designs Needed

### 1. Dashboard (Home Screen)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Header: Logo | Notifications🔔 | User👤            │
├─────────┬───────────────────────────────────────────┤
│ Sidebar │ DASHBOARD PAGE                            │
│         │                                           │
│ [Icons] │ ┌─────────┬─────────┬─────────┐          │
│ Dashbrd │ │ Balance │ Profit  │ Win Rate│          │
│ Trades  │ │ $10,000 │ +$1,250 │ 65%     │          │
│ Capital │ └─────────┴─────────┴─────────┘          │
│ Rules   │                                           │
│ Analyt  │ ┌─────────────────────────────┐          │
│ Market  │ │  Equity Curve Chart         │          │
│ Alerts  │ │  [Line graph trending up]   │          │
│ Settings│ └─────────────────────────────┘          │
│         │                                           │
│         │ Recent Trades Table:                      │
│         │ Symbol | Type | P/L  | Time              │
│         │ EURUSD | BUY  | +$50 | 10:30             │
│         │ GBPUSD | SELL | -$20 | 11:45             │
└─────────┴───────────────────────────────────────────┘
```

**Components:**
1. **Top KPI Cards (3 cards in a row)**
   - Current Balance (large number, $ sign)
   - Total Profit/Loss (green if +, red if -)
   - Win Rate percentage (with small chart icon)
   - Each card: White bg, shadow, rounded corners

2. **Equity Curve Chart**
   - Full-width card
   - Blue line chart showing account growth
   - X-axis: dates, Y-axis: balance
   - Hover: show exact value

3. **Recent Trades Table**
   - 5 latest trades
   - Columns: Symbol, Direction (BUY/SELL), P/L, Time
   - P/L colored: green (+), red (-)
   - "View All" button at bottom

**Visual Details:**
- Cards have subtle shadows
- Charts use primary blue color
- Data is prominent, easy to scan
- Spacing: comfortable, not cramped

---

### 2. Trading Journal Page

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ TRADING JOURNAL                                     │
│                                                     │
│ [+ Add Trade] [Import CSV] [Filters▼]              │
│                                                     │
│ ┌─── Trades Table ──────────────────────────────┐  │
│ │ ☑ Symbol│Type│Entry│Exit│Lots│P/L  │Date    │  │
│ │ ☐ EURUSD│BUY │1.100│1.105│0.10│+$50 │Jan 15  │  │
│ │ ☐ GBPUSD│SELL│1.270│1.275│0.20│-$100│Jan 15  │  │
│ │ ☐ USDJPY│BUY │145.0│146.5│0.15│+$225│Jan 14  │  │
│ └───────────────────────────────────────────────┘  │
│                                                     │
│ Showing 3 of 150 trades    [< 1 2 3 ... 15 >]     │
└─────────────────────────────────────────────────────┘
```

**Components:**
1. **Action Bar**
   - Primary button: "+ Add Trade" (blue, prominent)
   - Secondary button: "Import CSV" (outline)
   - Dropdown: "Filters" (symbol, date range, P/L)

2. **Data Table**
   - Checkbox for bulk actions
   - Sortable columns (click header to sort)
   - P/L column: colored text (green/red)
   - Row hover: light gray bg
   - Row actions: Edit✏️, Delete🗑️ icons on hover

3. **Pagination**
   - Bottom center
   - Shows "X of Y trades"
   - Numbered pages + prev/next arrows

**Visual Details:**
- Table: clean, minimal borders
- Alternating row colors (subtle)
- Icons: simple, monochrome
- Responsive: scrollable on mobile

---

### 3. Add/Edit Trade Modal

**Layout:**
```
┌────────────────────────────────────┐
│ ✕  Add New Trade                   │
├────────────────────────────────────┤
│                                    │
│ Symbol*        [EURUSD ▼]          │
│                                    │
│ Direction*     ○ BUY  ● SELL       │
│                                    │
│ Entry Price*   [1.10000]           │
│ Exit Price*    [1.10500]           │
│ Lot Size*      [0.10   ]           │
│                                    │
│ Stop Loss      [1.09500]           │
│ Take Profit    [1.11000]           │
│                                    │
│ Open Time*     [2026-01-15 10:30]  │
│ Close Time*    [2026-01-15 14:45]  │
│                                    │
│ Notes          [                 ] │
│                [                 ] │
│                                    │
│      [Cancel]      [Save Trade]    │
└────────────────────────────────────┘
```

**Components:**
1. **Form Fields**
   - Labels: left-aligned, bold
   - Required fields: asterisk (*)
   - Inputs: clear borders, focus state (blue outline)
   - Dropdowns: chevron icon
   - Radio buttons: for BUY/SELL direction

2. **Validation**
   - Error messages: red text below field
   - Example: "Entry price must be positive"

3. **Actions**
   - Cancel: outline button (left)
   - Save: filled blue button (right)

**Visual Details:**
- Modal: centered, drop shadow
- Overlay: semi-transparent dark
- Width: 500px
- Padding: comfortable (24px)

---

### 4. Capital & Risk Management Page

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ CAPITAL & RISK MANAGEMENT                           │
│                                                     │
│ ┌── Account Balance ────────┐ ┌── Risk Calculator ─┐│
│ │ Initial: $10,000          │ │ Symbol: [EURUSD▼] ││
│ │ Current: $11,250          │ │ Entry:  [1.10000] ││
│ │ Profit:  +$1,250 (+12.5%)│ │ SL:     [1.09500] ││
│ └───────────────────────────┘ │ Risk %: [1%     ] ││
│                                │                   ││
│ ┌── Drawdown Monitor ───────┐ │ Recommended:      ││
│ │ Daily Loss Limit (5%)     │ │ 0.20 lots        ││
│ │ ████████░░ 80% used       │ │ [$100 risk]      ││
│ │ $400 / $500               │ │ [Copy] [Calculate]││
│ │                           │ └──────────────────┘│
│ │ Max Total Drawdown (10%)  │                     │
│ │ ███░░░░░░░ 30% used       │                     │
│ │ $300 / $1,000             │                     │
│ └───────────────────────────┘                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
1. **Balance Card**
   - Large numbers
   - Profit in green with % change
   - Clean, card format

2. **Risk Calculator** (Right sidebar style)
   - Form inputs
   - Output: large recommended lot size
   - "Copy" button to clipboard

3. **Drawdown Progress Bars**
   - Color-coded: Green (<50%), Orange (50-80%), Red (>80%)
   - Percentage and absolute values shown
   - Label above each bar

**Visual Details:**
- 2-column grid on desktop
- Progress bars: thick (16px height), rounded
- Numbers: prominent, easy to read
- Warning state: orange/red when approaching limits

---

### 5. Analytics Page

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ ANALYTICS & REPORTING                               │
│                                                     │
│ Date Range: [Last 30 days ▼]  [Export PDF]        │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │         Equity Curve                        │   │
│ │  $12k ┤                          ╱          │   │
│ │  $11k ┤                    ╱─────           │   │
│ │  $10k ┤──────────╱─────────                 │   │
│ │       └─────────────────────────────        │   │
│ │        Jan 1    Jan 15    Jan 30            │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌── Performance Metrics ─┐ ┌── Win/Loss Breakdown ─┐│
│ │ Total Trades: 150      │ │   ████ 65% Win       ││
│ │ Win Rate: 65%          │ │   ██   35% Loss      ││
│ │ Avg Win: $75           │ └──────────────────────┘│
│ │ Avg Loss: -$40         │                         │
│ │ Best Trade: +$225      │                         │
│ │ Worst Trade: -$150     │                         │
│ └────────────────────────┘                         │
└─────────────────────────────────────────────────────┘
```

**Components:**
1. **Equity Curve Chart** (Full width)
   - Line chart with area gradient
   - Smooth curve
   - Grid lines (subtle)
   - Hover tooltips

2. **Metrics Card** (Left)
   - List of key stats
   - Icons next to each metric
   - Numbers highlighted

3. **Donut Chart** (Right)
   - Win/Loss ratio
   - Green and red segments
   - Percentage labels

**Visual Details:**
- Charts: professional, clean
- Grid: light gray, not distracting
- Export button: top right, outline style

---

## 🎯 Key UI Patterns

### Navigation
- **Sidebar:** Fixed left, icons + labels
- **Active state:** Blue background, white text
- **Hover:** Light gray background

### Data Tables
- **Headers:** Sticky on scroll, bold text
- **Rows:** Hover effect, clickable
- **Actions:** Icons appear on row hover

### Forms
- **Labels:** Above inputs, required = asterisk
- **Focus:** Blue ring
- **Error:** Red text + icon

### Buttons
- **Primary:** Blue, white text, shadow
- **Secondary:** Outline, blue text
- **Icon buttons:** Ghost style, circular

### Cards
- **Background:** White (light), Dark gray (dark mode)
- **Shadow:** Subtle drop shadow
- **Padding:** 24px
- **Radius:** 8px rounded corners

---

## 📐 Layout Specifications

### Grid System
- **Desktop:** 12-column grid
- **Sidebar:** 256px fixed width
- **Top header:** 64px height
- **Content padding:** 24px

### Spacing
- **Between cards:** 24px (1.5rem)
- **Card padding:** 24px
- **Button padding:** 12px 24px
- **Input padding:** 10px 16px

### Breakpoints
- Mobile: < 768px (sidebar hidden, hamburger menu)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🌙 Dark Mode

**Background Colors:**
- Primary bg: Very dark blue-gray (#0a0f1e)
- Card bg: Slightly lighter (#1a1f2e)
- Borders: Dark gray (#2a2f3e)

**Text Colors:**
- Primary text: Light gray (#e5e7eb)
- Secondary text: Medium gray (#9ca3af)

**Same accent colors:** Keep green, red, blue, orange

---

## ✅ Design Checklist

When creating designs, ensure:
- [ ] Professional trading aesthetic
- [ ] Clear data hierarchy
- [ ] Color-coded profit/loss (green/red)
- [ ] Hover states on interactive elements
- [ ] Responsive layout (mobile/desktop)
- [ ] Dark mode variant
- [ ] Consistent spacing and alignment
- [ ] Prominent CTAs (Add Trade, Save, etc.)
- [ ] Loading states (skeleton screens)
- [ ] Empty states (no data yet)

---

**Output Format:** High-fidelity mockups in Figma/PNG format for each screen listed above.
