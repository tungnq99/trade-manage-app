---
trigger: always_on
---

# 🎨 Frontend Engineering Standards

## 1. Tech Stack & Architecture
- **Framework:** Ưu tiên React.
    - *Next.js (App Router):* Ưu tiên **Server Components** mặc định. Chỉ dùng `'use client'` khi cần `useState`, `useEffect` hoặc Event Listeners.
    - *Vite:* Cho SPA thuần túy.
- **Styling:** Tailwind CSS.
    - **Class Merging:** BẮT BUỘC sử dụng hàm utility `cn()` (`clsx` + `tailwind-merge`) để xử lý conditional classes và tránh xung đột style.
    - ❌ Không cộng chuỗi thủ công: ``className={`btn ${active ? 'active' : ''}`}``
    - ✅ Dùng: `className={cn("btn", active && "active")}`
- **Component Design:**
    - Chia nhỏ UI thành: `atoms` (button, input), `molecules` (search bar), `organisms` (header, sidebar).
   
    ```
## 2. Logic Separation Strategy (Tư duy tách code)
- **View (`.tsx`):** Chỉ làm nhiệm vụ hiển thị. Logic trong này chỉ được phép là logic UI đơn giản (toggle modal, handle input).
- **Custom Hook**: Chỉ tách ra **Custom Hook (`src/hooks/use...ts`)** khi: Logic React (useEffect, State) quá phức tạp hoặc cần tái sử dụng ở component khác.
- **Helper Logic (`.logic.ts`):** Logic tính toán thuần túy, xử lý dữ liệu (không dính React hook). Dùng mô hình **Co-location** (đặt ngay cạnh file .tsx). *Lợi ích: Dễ viết Unit Test.*
- **Structure (Feature-based Co-location):**
    - Gom nhóm code theo tính năng, không gom theo loại file.
    ```text
    src/features/ProductList/
    ├── index.ts              (Public API của module)
    ├── ProductList.tsx       (View - Chỉ chứa JSX & UI logic)
    ├── ProductList.logic.ts  (Pure Logic - Tính toán, format, không dính React)
    └── ProductList.types.ts  (Interfaces nội bộ)

## 3. State & Data Management Strategy
- **Server State:** BẮT BUỘC dùng **React Query** (TanStack Query) hoặc **SWR**.
    - ❌ Cấm `useEffect` để fetch data thủ công.
- **Service Layer (Anti-Corruption Layer):**
    - UI Component **KHÔNG ĐƯỢC** gọi trực tiếp API/SDK (axios, fetch, firebaseSDK).
    - Tất cả phải đi qua `src/services/` (ví dụ: `auth.service.ts`, `product.service.ts`).
    - *Mục tiêu:* UI không cần biết backend là REST API, GraphQL hay Firebase.
- **Form:** Dùng `react-hook-form` + `zod` resolver.

## 4. Utils vs Helpers
- **`src/utils/` (Technical - Vô tri):** Hàm dùng được cho MỌI dự án (`formatCurrency`, `clsx`, `sleep`). Không chứa import liên quan đến business logic.
- **`src/helpers/` (Domain - Có tri):** Hàm dính nghiệp vụ dự án (`getUserDisplayName`, `checkOrderPermission`, `transformProductData`).

## 5. TypeScript Rules
- **No Explicit Any:** Cấm dùng `any`. Nếu kiểu dữ liệu chưa rõ, dùng `unknown` và validate lại.
- **Props Interface:** Mọi Component phải define rõ Interface cho Props.
- **No Enums:** Ưu tiên dùng `const object` hoặc `Union Types` thay vì `enum` của TS (để tối ưu bundle size).

## 6. Performance & UX
- **Web Vitals:** Chú ý LCP (Largest Contentful Paint) và CLS (Cumulative Layout Shift).
    - Luôn set `width/height` hoặc `aspect-ratio` cho ảnh/video.
- **Feedback:** Mọi hành động (Click, Submit) đều phải có phản hồi UI (Loading Spinner, Disabled Button, Toast Notification).
- **Error Handling:** Sử dụng Error Boundary để bắt lỗi UI crash.

## 8. 🧠 CODING MINDSET (TƯ DUY)
* **Pragmatic (Thực dụng):** Đừng tách file nếu component chỉ có 20 dòng. Đừng dùng Zustand cho cái nút bật tắt menu (dùng local state).
* **Explicit Naming:** Không đặt tên chung chung (`data`, `item`, `utils.ts`). Phải đặt tên cụ thể (`userData`, `cartItem`, `auth.helper.ts`).
* **Clean Code:** Tự động xóa `console.log` và code comment thừa trước khi hoàn thành task.

## 7. Modern UI Trends (Linear/Vercel Style)
- **Design:** Minimalist, High Density (Mật độ thông tin cao, ít khoảng trắng thừa).
- **Borders:** Dùng viền mờ (`border-border` hoặc `border-white/10`) thay vì Shadow.
- **Interactive:** Active states, Hover states phải rõ ràng.