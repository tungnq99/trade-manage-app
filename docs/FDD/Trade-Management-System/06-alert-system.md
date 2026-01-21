# Alert System - Functional Design Document

## 1. Tổng quan (Overview)

### 1.1 Mục tiêu
Hệ thống cảnh báo realtime giúp trader nhận thông báo khi:
- Vi phạm quy tắc trading (Max trades, Risk, Drawdown)
- Đạt milestone quan trọng (profit target, new peak)
- Cần attention (lệnh đang chạy quá lâu, unusual loss streak)

### 1.2 Phạm vi (Scope)

#### In-scope (Làm)
- ✅ In-app popup alerts (toast notifications)
- ✅ Push notifications (PWA - Progressive Web App)
- ✅ 3 loại alerts chính:
  - **Rule Violations** (từ Rules Engine)
  - **Drawdown Warnings** (từ Capital Module)
  - **Achievement Alerts** (milestone: 100 trades, profit target)
- ✅ Alert History log
- ✅ Alert Settings (enable/disable từng loại)

#### Out-scope (Không làm)
- ❌ Email alerts (có thể add sau)
- ❌ SMS alerts (tốn phí)
- ❌ Custom alert builder (user tự định nghĩa conditions)

---

## 2. User Stories & Acceptance Criteria

### Story 1: Nhận Alert khi vi phạm Rules
**Là một trader**, tôi muốn **được cảnh báo ngay khi vi phạm quy tắc**, để **dừng trading kịp thời**.

#### Acceptance Criteria (AC):
- [ ] Trigger sau khi Rules Engine detect violation
- [ ] In-app toast hiển thị:
  - Icon warning 🚨
  - Title: "Rule Violation Detected"
  - Message: "Max Trades/Day (3) exceeded. You've placed 4 trades."
  - Actions: [View Details] [Dismiss]
- [ ] Toast tự động dismiss sau 10 giây (hoặc user click Dismiss)
- [ ] Nếu PWA push enabled → Gửi push notification (ngay cả khi app không mở)

---

### Story 2: Nhận Alert Drawdown Warning
**Là một trader**, tôi muốn **được cảnh báo khi drawdown cao**, để **tránh vi phạm giới hạn của quỹ**.

#### Acceptance Criteria (AC):
- [ ] Trigger khi:
  - Daily Drawdown đạt 80% của limit
  - Total Drawdown đạt 80% của limit
- [ ] Alert content:
  - "⚠️ Daily Drawdown Warning"
  - "You've reached 4% drawdown (Limit: 5%)"
  - "Remaining: $100 before violation"
- [ ] Severity levels:
  - Warning (80%): Màu vàng
  - Critical (90%+): Màu đỏ, không tự dismiss

---

### Story 3: Nhận Achievement Alerts
**Là một trader**, tôi muốn **được chúc mừng khi đạt milestone**, để **có động lực tiếp tục**.

#### Acceptance Criteria (AC):
- [ ] Trigger khi:
  - Đạt 100 trades (và các mốc 200, 500, 1000)
  - Đạt profit target (VD: +10%, +20%)
  - New peak balance
- [ ] Alert content:
  - "🎉 Milestone Achieved!"
  - "You've completed 100 trades. Keep up the great work!"
- [ ] Màu xanh, icon celebration

---

### Story 4: Xem Alert History
**Là một trader**, tôi muốn **xem lại các alert đã nhận**, để **review và học hỏi**.

#### Acceptance Criteria (AC):
- [ ] Trang "Alert History" với bảng:
  - Timestamp
  - Type (Violation / Warning / Achievement)
  - Message
  - Status (New / Read / Dismissed)
- [ ] Filter by type, date
- [ ] Mark as Read / Clear All
- [ ] Badge số lượng unread alerts trên sidebar

---

### Story 5: Tùy chỉnh Alert Settings
**Là một trader**, tôi muốn **tắt một số loại alert không cần thiết**, để **không bị spam**.

#### Acceptance Criteria (AC):
- [ ] Trang Settings → Notifications
- [ ] Toggle switches cho từng loại:
  - [ ] Rule Violations
  - [ ] Drawdown Warnings
  - [ ] Achievement Alerts
  - [ ] Daily Summary (end of day report)
- [ ] Toggle cho Push Notifications (PWA)
- [ ] Sound enable/disable

---

## 3. Business Logic & Flow

### 3.1 Alert Trigger Flow

```
Trigger Source (Rules Engine, Capital Module)
  ↓
1. Check Alert Settings:
   - IF user disabled this alert type → SKIP
  ↓
2. Create Alert Record in DB
  ↓
3. Dispatch Alert:
   A. In-app: Emit Socket.io event → Frontend toast
   B. Push: Send via Push API (nếu enabled và user subscribed)
  ↓
4. Log to alert_history collection
```

---

### 3.2 Alert Priority Levels

```javascript
const ALERT_PRIORITIES = {
  INFO: {
    color: 'blue',
    icon: 'ℹ️',
    autoDismiss: 5000,  // 5 seconds
    sound: false
  },
  WARNING: {
    color: 'yellow',
    icon: '⚠️',
    autoDismiss: 10000,
    sound: true
  },
  CRITICAL: {
    color: 'red',
    icon: '🚨',
    autoDismiss: false,  // Không tự tắt
    sound: true
  },
  SUCCESS: {
    color: 'green',
    icon: '🎉',
    autoDismiss: 7000,
    sound: false
  }
};
```

---

### 3.3 Push Notification (PWA)

```javascript
// Service Worker để handle push
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      alertId: data.alertId,
      url: '/alerts'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// User click notification → Open app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

---

## 4. UI/UX Description

### 4.1 In-app Toast (Bottom-right)

```
┌─────────────────────────────────────┐
│ 🚨 Rule Violation                   │
├─────────────────────────────────────┤
│ Max Trades/Day (3) exceeded.       │
│ You've placed 4 trades today.      │
│                                     │
│ [View Rules]         [Dismiss]     │
└─────────────────────────────────────┘
```

**Animation:** Slide in từ phải sang, shake nhẹ nếu critical

---

### 4.2 Alert History Page

```
┌──────────────────────────────────────────────────────┐
│  Alerts              [Filter: All ▼] [Clear Read]    │
├──────────────────────────────────────────────────────┤
│  🔴 15/01 14:30 - Rule Violation                     │
│     Max Trades/Day exceeded (4/3)          [Dismiss] │
│                                                       │
│  ⚠️ 15/01 12:00 - Drawdown Warning                  │
│     Daily DD: 4% (Limit: 5%)               [Mark Read]│
│                                                       │
│  🎉 14/01 16:00 - Achievement Unlocked               │
│     Completed 100 trades!                  ✓ Read    │
│  ...                                                  │
└──────────────────────────────────────────────────────┘
```

---

### 4.3 Push Notification (Desktop/Mobile)

```
┌─────────────────────────────┐
│ 🚨 Trade Manager App        │
├─────────────────────────────┤
│ Rule Violation Detected     │
│ Max trades exceeded (4/3).  │
│ Tap to view details.        │
└─────────────────────────────┘
```

---

## 5. Edge Cases & Error Handling

| Tình huống | Xử lý |
|-----------|-------|
| User không cho phép push notifications | Chỉ hiện in-app toast, không gửi push |
| Multiple alerts cùng lúc (spam) | Batch thành 1 alert: "3 new violations detected. View details." |
| User offline khi alert trigger | Lưu vào DB, hiện khi user login lại (badge số lượng unread) |
| Browser không hỗ trợ PWA push | Gracefully degrade → Chỉ dùng in-app toast |

---

## 6. Data Model

### Collection: `alerts`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  type: "rule_violation",  // rule_violation | drawdown_warning | achievement
  priority: "critical",     // info | warning | critical | success
  
  title: "Rule Violation Detected",
  message: "Max Trades/Day (3) exceeded. You've placed 4 trades.",
  
  metadata: {
    ruleType: "maxTradesPerDay",
    limit: 3,
    actual: 4,
    tradeId: ObjectId("...")
  },
  
  status: "new",  // new | read | dismissed
  readAt: null,
  dismissedAt: null,
  
  pushSent: true,
  
  createdAt: ISODate("2026-01-15T14:30:00Z")
}
```

**Index:**
```javascript
db.alerts.createIndex({ userId: 1, status: 1, createdAt: -1 });
```

---

### Collection: `user_alert_settings`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  enabledAlerts: {
    ruleViolations: true,
    drawdownWarnings: true,
    achievements: true,
    dailySummary: false
  },
  
  pushNotificationsEnabled: true,
  soundEnabled: true,
  
  updatedAt: ISODate("2026-01-15T10:00:00Z")
}
```

---

## 7. Dependencies & Integration Points

### 7.1 Trigger Sources
- **Rules Engine:** Khi detect violation
- **Capital Module:** Khi DD đạt ngưỡng
- **Trading Journal:** Khi đạt milestone (100 trades, v.v.)

### 7.2 Tech Stack
- **Frontend:** React Toastify hoặc Sonner (toast library)
- **Push Notifications:** Web Push API (PWA)
- **Realtime:** Socket.io (để push alerts từ server → client ngay lập tức)

---

## 8. Non-Functional Requirements

### 8.1 Reliability
- Alert KHÔNG ĐƯỢC miss → Implement retry mechanism nếu push fail
- Log tất cả alerts vào DB để audit

### 8.2 Performance
- Toast render < 100ms
- Push notification delivery < 2 seconds

---

## 9. Open Questions

1. **Frequency Limiting:** Nếu user vi phạm liên tục (5 lần trong 10 phút), có gộp thành 1 alert không? Hay vẫn gửi từng cái?
2. **Daily Summary:** Có cần gửi email/push tổng kết cuối ngày (trades count, P/L) không?

---

**XONG RỒI! 🎉 Tất cả 6 FDD modules đã hoàn thành.**
