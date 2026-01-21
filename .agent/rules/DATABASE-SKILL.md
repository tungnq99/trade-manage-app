---
trigger: always_on
---

# 🗄️ Database Design Standards

## 1. Naming Conventions
- **Format:** `snake_case` cho toàn bộ (bảng, cột, index).
    - ✅ `order_items`, `user_id`, `created_at`
    - ❌ `OrderItems`, `userId`, `CreatedAt`
- **Tables:** Tên số nhiều (`users`, `products`).
- **Primary Key:** `id`.
- **Foreign Key:** `[tên_bảng_số_ít]_id` (ví dụ: `product_id`).

## 2. Data Types Guidelines
- **ID:**
    - Dùng `UUID` (v4/v7) hoặc `CUID` cho các dự án public, cần bảo mật ID.
    - Dùng `BigInt` (Auto Increment) cho các bảng nội bộ cần hiệu năng cực cao.
- **Timestamps:** Luôn lưu `created_at`, `updated_at`. Thời gian lưu chuẩn **UTC**.
- **Money/Currency:**
    - Với E-commerce/Finance: Dùng `DECIMAL(precision, scale)` hoặc lưu Integer (cents).
    - Với Analytics/Scoring: Có thể dùng `FLOAT/DOUBLE`.

## 3. Performance & Integrity
- **Indexing:**
    - Đánh index cho Foreign Keys (`user_id` trong bảng `orders`).
    - Đánh index cho các cột hay filter/sort (`status`, `email`, `created_at`).
    - Dùng Composite Index cho các query nhiều điều kiện.
- **Foreign Keys:** Bắt buộc khai báo khóa ngoại cứng trong DB (Reference Integrity).
- **Transactions:** Các thao tác ghi đè lên nhiều bảng liên quan (ví dụ: Tạo đơn hàng + Trừ kho + Trừ tiền) phải nằm trong Transaction.

## 4. Migrations
- Không bao giờ sửa schema trực tiếp trên Database Production.
- Sử dụng công cụ Migration (Prisma Migrate, TypeORM, Knex, Alembic...) để version control cấu trúc Database.