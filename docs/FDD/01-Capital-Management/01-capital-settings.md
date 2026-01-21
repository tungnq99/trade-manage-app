# 👔 Feature 1.1: Capital Settings (Cấu hình Vốn)

## 1. Tổng quan
Cho phép User thiết lập hoặc thay đổi số vốn khởi điểm. Đây là con số "Gốc" để tính toán mọi chỉ số lợi nhuận sau này.

## 2. User Stories
*   Là một **Trader**, tôi muốn **nhập số vốn ban đầu (ví dụ $10,000)**, để **hệ thống biết tài khoản tôi lớn cỡ nào**.
*   Là một **Trader**, tôi muốn **reset lại vốn**, để **bắt đầu lại quy trình quản lý vốn mới (khi nạp thêm tiền hoặc cháy tk)**.

## 3. Acceptance Criteria (AC)
*   [ ] Field "Initial Balance" bắt buộc phải là số dương (> 0).
*   [ ] Field "Currency" (Tiền tệ) mặc định là USD (Sprint này chỉ làm USD).
*   [ ] Khi lưu thành công -> Hiển thị Toast "Updated successfully".
*   [ ] Khi lưu xong -> Dashboard phải cập nhật ngay lập tức con số Balance mới.

## 4. Giao diện (UI Description)
*   **Vị trí:** Trang Settings -> Tab "Capital".
*   **Form:**
    *   Input: `Initial Balance` (Type: Number, Placeholder: 10000).
    *   Select: `Currency` (Disabled: USD).
    *   Button: `Save Changes`.

## 5. Logic Nghiệp vụ & Flows
### A. Normal Mode (Trong trang Settings)
*   User vào Settings -> Sửa số -> Lưu.
*   Hệ thống update lại `InitialBalance` trong DB.

### B. Onboarding Mode (Sau khi đăng ký)
*   **Trigger:** Khi user login, nếu hệ thống check thấy `user.hasConfiguredCapital == false` (hoặc chưa có record trong collection `capital_settings`).
*   **Action:** Redirect sang trang/modal `/onboarding/capital`.
*   **UX:**
    *   Không cho tắt Modal/Back.
    *   Input mặc định 0 hoặc 1000.
    *   Nút "Start Trading" chỉ enable khi nhập số > 0.
*   **Lý do:** Đảm bảo data cho Dashboard không bị lỗi chia cho 0 (Drawdown/Growth).

*   **Formula:** `Current Balance` (Hiển thị) = `Initial Balance` (User nhập) + `Total Realized P/L` (Tính từ DB).
