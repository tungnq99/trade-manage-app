---
trigger: always_on
---

# 🎬 UI Animation & Motion Standards

## 1. Philosophy (Triết lý chuyển động)
- **Functional, not Decorative:** Animation sinh ra để dẫn dắt mắt người dùng (User Focus), không phải để trang trí cho đẹp.
- **Subtle & Fast:**
    - Thời gian chạy (Duration): **200ms - 400ms**. Không được chậm hơn.
    - Animation quá chậm = Cảm giác App bị lag.
- **Physics-based:** Ưu tiên dùng vật lý (Spring) thay vì đường cong thời gian (Easing curves) để tạo cảm giác tự nhiên như vật thật.

## 2. Tech Stack
- **Library:**
    - **Framer Motion:** Chuẩn mực cho React Animation (dùng cho layout animation, gestures, complex sequence).
    - **Tailwind Animate (`tailwindcss-animate`):** Dùng cho các hiệu ứng đơn giản (Fade in, Zoom in) của Dropdown/Dialog.
    - **CSS Transitions:** Dùng cho hover state đơn giản (`hover:bg-gray-100`).

## 3. Core Patterns (Các mẫu bắt buộc)

### A. Micro-interactions (Tương tác nhỏ)
- **Hover:** Không chỉ đổi màu nền.
    - Scale nhẹ: `scale-[1.02]`.
    - Active (Click): `scale-[0.98]`.
    - Transition: `transition-all duration-200 ease-out`.

### B. Layout Animation (Framer Motion)
- Khi List thay đổi (thêm/xóa item), các item còn lại phải trượt mượt mà vào vị trí mới (dùng prop `layout` của Framer Motion).
- **Tab Switching:** Phải có "Indicator" trượt từ Tab A sang Tab B (Magic Motion).

### C. Skeleton Loading
- Không dùng Spinner xoay giữa màn hình khi load nội dung.
- Bắt buộc dùng **Skeleton Pulse** (Khung xương nhấp nháy) mô phỏng cấu trúc nội dung sắp hiện ra.

## 4. Performance Rules (Chống Lag)
- **GPU Acceleration:** Chỉ animate các thuộc tính `transform` (x, y, scale, rotate) và `opacity`.
- **Forbidden:** TUYỆT ĐỐI KHÔNG animate `width`, `height`, `top`, `left`, `margin`, `padding`. (Gây Layout Thrashing - tính toán lại bố cục, làm tụt FPS).
    - *Bad:* `transition: width 0.3s`
    - *Good:* `transition: transform 0.3s` (Scale X)

## 5. Accessibility (A11y)
- Tôn trọng setting `prefers-reduced-motion` của hệ điều hành. Nếu User tắt hiệu ứng chuyển động, App phải tắt theo (dùng `useReducedMotion`).