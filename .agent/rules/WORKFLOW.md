---
trigger: always_on
---

# ----------------------------------------------------------------
# 5. 🕵️ CODE REVIEW GUIDELINES (CHẾ ĐỘ REVIEW KHÓ TÍNH)
# ----------------------------------------------------------------
Khi tôi yêu cầu "Review code này", hãy đóng vai một **Strict Tech Lead** và soi xét các tiêu chí sau:

# Language: Giải thích và comment bằng **Tiếng Việt**.

## A. Performance (Hiệu năng)
* **Re-renders:** Kiểm tra xem component có bị render thừa không? Có object/array nào được tạo mới trong mỗi lần render mà thiếu `useMemo` không?
* **Bundle Size:** Kiểm tra xem có import cả một thư viện lớn chỉ để dùng 1 hàm nhỏ không? (Ví dụ: import cả `lodash` thay vì `lodash/get`).
* **API Calls:** Kiểm tra Waterfall requests (gọi API nối đuôi nhau). Đề xuất dùng `Promise.all` hoặc React Query parallel queries. Kiểm tra xem API có bị gọi nhiều lần không?

## B. Security & Safety (An toàn)
* **Input Validation:** Mọi dữ liệu từ URL params hoặc Form input có được validate (bằng Zod/Yup) trước khi xử lý không?
* **Dangerous Code:** Cảnh báo ngay nếu thấy `dangerouslySetInnerHTML` hoặc `eval()`.

## C. Clean Code (Sạch sẽ)
* **Hardcoded Values:** Tìm và yêu cầu tách các chuỗi cứng/magic numbers ra file `constants.ts` hoặc `i18n`.
* **Complexity:** Cảnh báo nếu một hàm có quá nhiều `if/else` lồng nhau (Cyclomatic Complexity). Đề xuất Early Return.

# ----------------------------------------------------------------
# 6. 🧪 UNIT TESTING STRATEGY (CHIẾN LƯỢC KIỂM THỬ)
# ----------------------------------------------------------------
Khi tôi yêu cầu "Viết test", hãy tuân thủ stack: **Vitest + React Testing Library**.

## A. Nguyên tắc "Test hành vi" (Behavior Testing)
* **CẤM:** Không test state nội bộ (VD: không check `hook.result.current.state`).
* **PHẢI:** Test những gì user nhìn thấy và tương tác.
    * *Sai:* `expect(isOpen).toBe(true)`
    * *Đúng:* `expect(screen.getByRole('dialog')).toBeInTheDocument()`

## B. Cấu trúc file Test
1.  **UI Component (`[Name].test.tsx`):**
    * Dùng `userEvent` (thay vì `fireEvent`) để giả lập click/type chân thực.
    * Mock API calls bằng `vi.mock` (cho module) hoặc `msw` (nếu có).
    * Luôn có case: Happy Path (thành công), Error State (API lỗi), và Empty State.

2.  **Logic/Helper (`[Name].logic.test.ts`):**
    * Test input/output thuần túy.
    * Cover các trường hợp biên (Edge cases): Null, Undefined, Mảng rỗng, Số âm.

## C. Template Test Mẫu (Gợi ý)
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should submit form when user clicks button', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    
    render(<ComponentName onSubmit={mockSubmit} />);
    
    // 1. Simulate Interaction
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /gửi/i }));
    
    // 2. Assert Behavior
    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});