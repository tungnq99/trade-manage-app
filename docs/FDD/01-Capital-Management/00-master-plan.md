# 👔 Module 01: Capital & Risk Management

## 1. Tổng quan (Overview)
Module này tập trung vào việc quản lý sức khỏe tài khoản của Trader. Giúp Trader biết mình còn bao nhiêu tiền, đang lãi hay lỗ, và chiu rủi ro bao nhiêu.

## 2. Sitemap (Danh sách tính năng)
1.  **Cấu hình Vốn (Capital Settings):** Nơi user nhập số vốn ban đầu (Initial Balance).
2.  **Dashboard Widget:** Hiển thị 3 chỉ số quan trọng (Balance, Equity, Total P/L).
3.  **Risk Calculator (Update sau):** Công cụ tính Lot size.

## 3. Quy trình nghiệp vụ (Business Flow)
1.  User đăng ký/đăng nhập lần đầu -> Hệ thống yêu cầu nhập "Vốn ban đầu" (Onboarding).
2.  Nếu user bỏ qua -> Mặc định 0 hoặc nhắc nhở sau.
3.  Khi User thêm Trade (Sprint 1) -> Hệ thống tự động tính lại Balance hiện tại.
4.  Current Balance = Initial Balance + Tổng P/L của các lệnh đã đóng.
