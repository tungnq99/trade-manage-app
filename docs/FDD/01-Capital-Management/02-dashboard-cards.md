# 👔 Feature 1.2: Capital Dashboard Cards

## 1. Tổng quan
Widget hiển thị ở ngay đầu trang Dashboard (Home), cung cấp cái nhìn tức thì về tiền của User.

## 2. User Stories
*   Là một **Trader**, tôi muốn **nhìn thấy số dư hiện tại ngay khi mở app**, để **biết mình đang giàu hay nghèo đi**.

## 3. Acceptance Criteria (AC)
*   [ ] Hiển thị đủ 3 thẻ: **Initial Balance**, **Current Balance**, **Total Profit/Loss**.
*   [ ] Thẻ **Current Balance**:
    *   Màu Xanh nếu > Initial Balance.
    *   Màu Đỏ nếu < Initial Balance.
*   [ ] Thẻ **Total Profit/Loss**:
    *   Hiển thị số tiền (+/-).
    *   Hiển thị % tăng trưởng (Growth %).

## 4. Giao diện (UI Description)
*   Layout: Grid 3 cột (Desktop) hoặc Stack dọc (Mobile).
*   **Card 1: Initial Balance:**
    *   Label: "Starting Capital".
    *   Value: $10,000.
*   **Card 2: Current Balance:**
    *   Label: "Current Equity".
    *   Value: $10,500.
    *   Color: Green-600.
*   **Card 3: Net Profit:**
    *   Label: "Net P/L".
    *   Value: +$500 (+5.0%).

## 5. Edge Cases
*   **Trường hợp User chưa nhập Vốn:**
    *   Hiển thị Warning/Alert yêu cầu setup vốn.
    *   Hoặc hiển thị Dashboard với số liệu tính toán dựa trên vốn = 0 (P/L vẫn hiện đúng, nhưng Growth % sẽ là N/A hoặc vô cực). -> **Quyết định:** Hiển thị nút "Setup Capital" to đùng.
