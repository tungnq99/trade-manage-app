# Design System - Trade Management System

## 🎨 Color Palette

### Brand Colors
```css
/* Primary - Blue (Trading theme) */
--primary: 221.2 83.2% 53.3%;           /* #3b82f6 */
--primary-foreground: 210 40% 98%;      /* #f8fafc */

/* Secondary - Slate */
--secondary: 210 40% 96.1%;             /* #f1f5f9 */
--secondary-foreground: 222.2 47.4% 11.2%; /* #1e293b */
```

### Semantic Colors
```css
/* Success (Green) - Profit, Winning trades */
--success: 142 71% 45%;                 /* #22c55e */
--success-foreground: 144 61% 20%;      /* #166534 */

--primary: #5b68f5;        /* Primary purple-blue - Buttons, links, active states */
--primary-hover: #4954d9;  /* Darker primary for hover */
--primary-light: #7882ff;  /* Lighter primary for highlights */
```

### Semantic Colors (Trading Specific)
```css
/* Success / Profit / Long */
--success: #22c55e;        /* Green for profit, winning trades, LONG */
--success-light: #4ade80; /* Lighter green for highlights */
--success-dark: #16a34a;  /* Darker green for text on light bg */

/* Destructive / Loss / Short */
--destructive: #ef4444;    /* Red for loss, losing trades, SHORT */
--destructive-light: #f87171;
--destructive-dark: #dc2626;

/* Warning */
--warning: #f97316;        /* Orange for warnings, approaching limits */
--warning-light: #fb923c;

/* Info */
--info: #3b82f6;          /* Blue for informational messages */
--info-light: #60a5fa;
```

### Text Colors
```css
--text-primary: #e5e7eb;     /* Main text - Light gray */
--text-secondary: #9ca3af;   /* Secondary text, labels */
--text-tertiary: #6b7280;    /* Disabled, placeholder */
--text-inverse: #0a0f1e;     /* Text on light backgrounds */
```

### Border & Divider
```css
--border-primary: #2a2f3e;   /* Subtle borders */
--border-secondary: #1f2937; /* Very subtle dividers */
```

### Trading-Specific Colors
```css
/* P/L Colors */
--profit: #22c55e;      /* Profit green (same as success) */
--loss: #ef4444;        /* Loss red (same as destructive) */

/* Trade Direction */
--long-color: #22c55e;  /* LONG badge - Green */
--short-color: #ef4444; /* SHORT badge - Red */

/* Trade Outcome */
--tp-hit: #22c55e;      /* Take Profit hit - Green */
--sl-hit: #ef4444;      /* Stop Loss hit - Red */

/* Risk Management */
--drawdown-safe: #22c55e;      /* Drawdown < 50% - Green */
--drawdown-warning: #f97316;   /* Drawdown 50-80% - Orange */
--drawdown-critical: #ef4444;  /* Drawdown > 80% - Red */
```

---

## 🔤 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes
| Scale | Size | Usage |
|-------|------|-------|
| xs | 0.75rem (12px) | Small labels, badges |
| sm | 0.875rem (14px) | Secondary text, captions |
| base | 1rem (16px) | Body text, inputs |
| lg | 1.125rem (18px) | Large body text |
| xl | 1.25rem (20px) | Section titles |
| 2xl | 1.5rem (24px) | Card titles |
| 3xl | 1.875rem (30px) | Page headings |
| 4xl | 2.25rem (36px) | Hero text |

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Normal | 400 | Body text |
| Medium | 500 | Emphasized text, labels |
| Semibold | 600 | Headings, buttons |
| Bold | 700 | Important headings |

---

## 📐 Spacing System

Sử dụng hệ thống spacing 4px base:

| Token | Value | Usage |
|-------|-------|-------|
| 0 | 0px | Reset |
| 1 | 0.25rem (4px) | Tight spacing |
| 2 | 0.5rem (8px) | Small gaps |
| 3 | 0.75rem (12px) | Default gaps |
| 4 | 1rem (16px) | Medium spacing |
| 6 | 1.5rem (24px) | Section spacing |
| 8 | 2rem (32px) | Large spacing |
| 12 | 3rem (48px) | Page margins |

---

## 🧩 Component Styles

### Cards (KPI Cards, Stat Cards)
**Design:** Rounded corners, subtle elevation, dark background

```tsx
// Example: KPI Card
<div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 backdrop-blur-sm">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-medium text-slate-400 uppercase">Account Balance</span>
    <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full text-slate-300">LIVE</span>
  </div>
  <div className="text-3xl font-bold text-white">$184,250.00</div>
  <div className="mt-1 text-sm text-green-400">↑ 2.4%</div>
</div>
```

**Styling Rules:**
- Background: `bg-slate-800/50` with `backdrop-blur-sm`
- Border: Subtle `border-slate-700/50`
- Corner radius: `rounded-2xl` (16px)
- Padding: `p-6` (24px)
- Text hierarchy: Label (xs, uppercase, muted) → Value (3xl, bold, white) → Change (sm, colored)

### Buttons
// Primary - Main actions (Add Trade, Save, Submit)
<Button variant="default">Add Trade</Button>

// Outline - Secondary actions (Cancel, Back)
<Button variant="outline">Cancel</Button>

// Destructive - Dangerous actions (Delete, Remove)
<Button variant="destructive">Delete Trade</Button>

// Ghost - Minimal actions (Icons, Nav items)
<Button variant="ghost">
  <Bell />
</Button>
```

**Sizes:**
```typescript
<Button size="sm">Small</Button>      // 36px height
<Button size="default">Default</Button> // 40px height
<Button size="lg">Large</Button>      // 44px height
<Button size="icon">Icon</Button>     // 40x40 square
```

---

### Cards

**Structure:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Capital Overview</CardTitle>
    <CardDescription>Your current account status</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions or metadata */}
  </CardFooter>
</Card>
```

**Usage:**
- Dashboard widgets
- Analytics charts
- Settings sections
- Modal content

---

### Tables

**Style:**
```css
/* Header */
bg-muted
font-medium text-sm
border-b-2

/* Rows */
border-b
hover:bg-muted/50

/* Cells */
padding: 12px 16px
text-sm
```

**Color coding for Trading Journal:**
- Profit (+) → Green text
- Loss (-) → Red text
- Neutral → Default foreground

---

### Forms

**Input Fields:**
```tsx
<Input 
  type="text"
  placeholder="Enter symbol..."
  className="h-10 border-input"
/>
```

**Select Dropdowns:**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select symbol" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="EURUSD">EUR/USD</SelectItem>
  </SelectContent>
</Select>
```

**Validation States:**
- Error: `border-destructive text-destructive`
- Success: `border-success text-success`
- Default: `border-input`

---

## 🌓 Dark Mode

### Dark Theme Colors
```css
.dark {
  --background: 222.2 84% 4.9%;         /* #020617 */
  --foreground: 210 40% 98%;            /* #f8fafc */
  
  --primary: 217.2 91.2% 59.8%;         /* #60a5fa */
  --primary-foreground: 222.2 47.4% 11.2%; /* #1e293b */
  
  --muted: 217.2 32.6% 17.5%;           /* #1e293b */
  --muted-foreground: 215 20.2% 65.1%;  /* #94a3b8 */
  
  --border: 217.2 32.6% 17.5%;          /* #1e293b */
  --input: 217.2 32.6% 17.5%;           /* #1e293b */
}
```

**Toggle Implementation:**
```tsx
// Thêm class "dark" vào <html>
<html className="dark">
```

---

## 📊 Data Visualization

### Chart Colors

**Equity Curve:**
- Line: `--primary` (Blue)
- Area gradient: `--primary` with opacity
- Grid: `--border`

**Profit/Loss Bar Chart:**
- Profit bars: `--success` (Green)
- Loss bars: `--destructive` (Red)

**Drawdown Progress Bar:**
- Safe (0-50%): `--success`
- Warning (50-80%): `--warning`
- Critical (80-100%): `--destructive`

---

## 🔔 Alerts & Notifications

### Toast Notifications

**Variants:**
```tsx
// Success
<Toast variant="success">Trade added successfully</Toast>

// Error
<Toast variant="destructive">Failed to delete trade</Toast>

// Warning
<Toast variant="warning">Approaching daily loss limit (80%)</Toast>

// Info
<Toast variant="info">New economic event scheduled</Toast>
```

### Alert Badges

**Priority Levels:**
```tsx
// Low - Blue badge
<Badge variant="info">Low</Badge>

// Medium - Orange badge
<Badge variant="warning">Medium</Badge>

// High - Darker orange
<Badge variant="warning" className="bg-orange-600">High</Badge>

// Critical - Red badge
<Badge variant="destructive">Critical</Badge>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Tablets portrait */
md: 768px   /* Tablets landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

**Layout Behavior:**
- `< md`: Sidebar ẩn, menu hamburger
- `>= md`: Sidebar hiển thị fixed
- `< lg`: Cards stack vertically
- `>= lg`: Cards grid 2-3 columns

---

## ♿ Accessibility

### Focus States
```css
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-ring 
focus-visible:ring-offset-2
```

### Contrast Ratios
- Normal text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1

### ARIA Labels
- Buttons: `aria-label` cho icon-only buttons
- Forms: `aria-describedby` cho error messages
- Tables: `aria-label` cho sortable columns

---

## 🎭 Animation & Transitions

### Durations
```css
fast: 150ms     /* Hover effects */
normal: 200ms   /* Default transitions */
slow: 300ms     /* Modals, drawers */
```

### Easing
```css
ease-in-out     /* Default */
ease-out        /* Entering elements */
ease-in         /* Exiting elements */
```

### Common Animations
```tsx
// Accordion
animation: "accordion-down 0.2s ease-out"

// Modal fade
animation: "fade-in 0.2s ease-out"

// Slide in sidebar
animation: "slide-in-left 0.3s ease-out"
```

---

## 📋 Component Checklist

Khi tạo component mới, đảm bảo:

- [ ] Sử dụng design tokens (không hardcode colors)
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Dark mode support
- [ ] Focus states cho keyboard navigation
- [ ] Loading states (skeleton hoặc spinner)
- [ ] Error states với helpful messages
- [ ] Empty states với actionable CTAs
- [ ] Hover states cho interactive elements

---

## 🚀 Implementation Guidelines

### Component Naming
```
Button.tsx          ✅ PascalCase
button-component.tsx ❌ kebab-case
buttonComponent.tsx  ❌ camelCase
```

### Class Organization
```tsx
// Order: Layout → Spacing → Colors → Typography → Effects
<div className="
  flex items-center justify-between
  px-4 py-2
  bg-background border-b
  text-sm font-medium
  hover:bg-accent
">
```

### Utility First
```tsx
// ✅ Prefer Tailwind utilities
<div className="rounded-lg border bg-card shadow-sm">

// ❌ Avoid custom CSS when possible
<div className="custom-card-style">
```

---

**Reference:** Design system được áp dụng xuyên suốt dự án, sử dụng TailwindCSS + Shadcn/ui components.
