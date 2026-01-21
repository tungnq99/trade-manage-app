---
description: E2E Testing Workflows for Trade Management System
---

# E2E Test Workflows - Trade Management System

## Prerequisites

Before running E2E tests, ensure:
1. Frontend dev server running: `npm run dev` (port 5173)
2. Backend API server running: `npm run dev` (port 3000)
3. MongoDB test database accessible
4. Environment variable set: `TEST_USER_EMAIL=your-email@gmail.com`

## Setup Test Environment

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Create test environment file
cp .env.example .env.test
```

**.env.test:**
```
TEST_USER_EMAIL=your-test-email@gmail.com
TEST_BASE_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000
```

---

## Workflow 1: Authentication Flow

### Step 1: Test User Registration
```bash
npx playwright test e2e/auth/register.spec.ts
```

**What it tests:**
- New user can register with email (provided via env variable)
- Password validation (min 8 chars, 1 uppercase, 1 number)
- Successful redirect to dashboard
- Welcome message appears

**Expected result:** User registered and logged in

---

### Step 2: Test User Login
```bash
npx playwright test e2e/auth/login.spec.ts
```

**What it tests:**
- Existing user can login
- Token stored in localStorage
- Dashboard loads with user info

---

## Workflow 2: Trading Journal - CRUD Operations

### Step 1: Add Trade Manually
```bash
npx playwright test e2e/trading-journal/add-trade.spec.ts
```

**What it tests:**
- User can fill trade form
- Auto-calculation of P/L and pips
- Trade appears in list
- Success toast notification

---

### Step 2: Import Trades from CSV
```bash
npx playwright test e2e/trading-journal/import-csv.spec.ts
```

**What it tests:**
- CSV file upload
- Preview shows correct data
- Duplicate detection works
- Import success message

---

### Step 3: Filter and Search Trades
```bash
npx playwright test e2e/trading-journal/filters.spec.ts
```

**What it tests:**
- Symbol filter works
- Date range filter works
- Search by notes
- Clear filters resets view

---

## Workflow 3: Capital & Risk Management

### Step 1: Setup Initial Balance
```bash
npx playwright test e2e/capital/setup-capital.spec.ts
```

**What it tests:**
- Onboarding modal appears for new user
- Can set initial balance
- Balance displays on dashboard

---

### Step 2: Use Risk Calculator
```bash
npx playwright test e2e/capital/risk-calculator.spec.ts
```

**What it tests:**
- Calculator recommends correct lot size
- Formula accuracy (1% risk = 0.20 lots for 50 pips)
- Copy to clipboard works

---

### Step 3: Trigger Drawdown Warning
```bash
npx playwright test e2e/capital/drawdown-alert.spec.ts
```

**What it tests:**
- Alert triggers at 80% of daily loss limit
- Progress bar updates correctly
- Critical alert when exceeds limit

---

## Workflow 4: Rules Engine

### Step 1: Select Prop Firm Template
```bash
npx playwright test e2e/rules/setup-rules.spec.ts
```

**What it tests:**
- FTMO template auto-fills (3 trades/day, 1% risk, 5% daily loss, 10% max DD)
- The5ers template different values
- Can customize after selecting template

---

### Step 2: Detect Rule Violations
```bash
npx playwright test e2e/rules/violation-detection.spec.ts
```

**What it tests:**
- Adding 4th trade triggers "Max Trades/Day" violation
- Alert appears with critical priority
- Violation logged in history

---

## Workflow 5: Analytics & Reporting

### Step 1: View Equity Curve Chart
```bash
npx playwright test e2e/analytics/equity-curve.spec.ts
```

**What it tests:**
- Chart renders with trade data
- Tooltip shows balance on hover
- Chart updates after adding new trade

---

### Step 2: Export PDF Report
```bash
npx playwright test e2e/analytics/export-pdf.spec.ts
```

**What it tests:**
- PDF download triggers
- Filename format correct (TradingReport_YYYY-MM-DD.pdf)
- File contains charts and summary

---

## Workflow 6: Alert System

### Step 1: In-App Toast Alerts
```bash
npx playwright test e2e/alerts/toast-alerts.spec.ts
```

**What it tests:**
- Toast appears for rule violations
- Auto-dismisses after 10 seconds
- Can manually dismiss

---

### Step 2: Alert History
```bash
npx playwright test e2e/alerts/alert-history.spec.ts
```

**What it tests:**
- All alerts listed
- Can dismiss individual alerts
- Unread count updates

---

## Workflow 7: Mobile Responsive

### Step 1: Mobile Navigation
```bash
npx playwright test e2e/mobile/navigation.spec.ts --project=mobile
```

**What it tests:**
- Hamburger menu visible on mobile
- Sidebar slides in/out
- All pages accessible
- Forms usable on small screens

---

## Running All Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific workflow
npm run test:e2e -- auth/

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run with UI mode (debugging)
npx playwright test --ui

# Generate HTML report
npm run test:e2e -- --reporter=html
```

---

## Test Data Management

### Seed Test Database
```bash
# Reset and seed test database
npm run test:db:seed
```

### Clean Up After Tests
```bash
# Delete test user and data
npm run test:db:cleanup
```

---

## Success Criteria

- ✅ Authentication: 100% pass
- ✅ Trading Journal: 100% pass
- ✅ Capital Management: 95% pass
- ✅ Rules Engine: 95% pass
- ✅ Analytics: 90% pass
- ✅ Alerts: 95% pass
- ✅ Mobile: 85% pass

**Target:** 95% overall pass rate

---

## Troubleshooting

**Tests hang or timeout:**
- Check dev servers are running
- Increase timeout in playwright.config.ts

**Database errors:**
- Reset test database: `npm run test:db:reset`
- Check MongoDB connection string

**Element not found:**
- Add `data-testid` attributes to components
- Use more specific selectors

---

## CI/CD Integration

Add to GitHub Actions (`.github/workflows/e2e.yml`):

```yaml
name: E2E Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
        env:
          TEST_USER_EMAIL: test@example.com
```
