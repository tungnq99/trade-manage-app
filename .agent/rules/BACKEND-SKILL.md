---
trigger: always_on
---

# ⚙️ Backend Engineering Standards

## 1. API Design Principles (RESTful)
- **Resource Naming:** Danh từ, số nhiều, chữ thường (`/products`, `/users`, `/orders`).
- **HTTP Methods:** Sử dụng đúng ngữ nghĩa:
    - `GET`: Đọc dữ liệu (Idempotent).
    - `POST`: Tạo mới (Non-idempotent).
    - `PUT`: Ghi đè toàn bộ.
    - `PATCH`: Cập nhật một phần.
    - `DELETE`: Xóa.
- **Response Format:** Thống nhất cấu trúc JSON trả về:
    ```json
    {
      "success": true,
      "data": { ... },       // Dữ liệu chính
      "meta": {              // Chỉ dùng cho list
        "page": 1,
        "total_pages": 10
      },
      "message": "Optional human readable message"
    }
    ```

## 2. Security & Auth
- **Authentication:** Stateless với JWT (Access Token ngắn hạn + Refresh Token dài hạn).
- **Token Storage:** Refresh Token lưu trong **HttpOnly Cookie** (chống XSS). Access Token lưu trong memory client.
- **Input Validation:**
    - Sử dụng Schema Validator (Zod cho Node.js, Pydantic cho Python).
    - Validate cả `params`, `query`, và `body`.
- **Rate Limiting:** Áp dụng giới hạn request cho các route nhạy cảm (Login, Register, OTP).

## 3. Error Handling
- **Operational Errors (4xx):** Lỗi do client (sai input, thiếu quyền). Trả về message rõ ràng để hiển thị.
- **System Errors (5xx):** Lỗi do server (DB chết, code bug).
    - **Log:** Ghi đầy đủ Stack Trace vào hệ thống log.
    - **Response:** Trả về "Internal Server Error" chung chung. KHÔNG lộ chi tiết lỗi kỹ thuật ra ngoài.

## 4. Coding Structure (Clean Architecture)
- **Controller:** Chỉ tiếp nhận request, validate input, gửi sang Service.
- **Service:** Chứa toàn bộ Business Logic. Không được gọi trực tiếp DB query ở đây (nếu dùng Repository Pattern) hoặc dùng ORM nhưng phải tách biệt.
- **Repository/Data Layer:** Chịu trách nhiệm giao tiếp với Database.