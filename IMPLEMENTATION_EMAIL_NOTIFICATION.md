# Triển khai Gửi Email Xác Nhận Đơn Hàng

## Tổng quan
Hệ thống đã được cập nhật để gửi email xác nhận đơn hàng tự động đến khách hàng khi họ chọn đồng ý nhận email/SMS về ưu đãi và khuyến mãi của Luxury Jewelry.

## Các thay đổi đã thực hiện

### 1. Backend - Model (Database)

#### File: `TMDT-BE/api/v1/models/user.model.js`
- **Thêm field mới**: `agreeMarketing` (Boolean, default: false)
- Lưu trữ trạng thái đồng ý nhận email marketing của khách hàng

### 2. Backend - Email Helper

#### File: `TMDT-BE/helpers/sendMail.js`
- **Cập nhật**: Thay đổi từ `text` sang `html` để hỗ trợ gửi email với định dạng HTML đẹp mắt
- Cho phép gửi email có màu sắc, logo, và bố cục chuyên nghiệp

#### File: `TMDT-BE/helpers/orderEmail.helper.js` (MỚI)
- **Tạo mới**: Helper function để tạo email template xác nhận đơn hàng
- Nội dung email bao gồm:
  - Logo và header của Luxury Jewelry
  - Thông báo đặt hàng thành công
  - Thông tin đơn hàng (mã đơn hàng, trạng thái, phương thức thanh toán)
  - Thông tin khách hàng (họ tên, email, số điện thoại, địa chỉ giao hàng, ghi chú)
  - Chi tiết sản phẩm với hình ảnh, số lượng và giá
  - Tổng giá trị đơn hàng
  - Thông tin liên hệ và footer

### 3. Backend - Controllers

#### File: `TMDT-BE/api/v1/controllers/client/order.controller.js`

**Cập nhật 2 endpoints:**

1. **`cashOnDelivery` (Thanh toán khi nhận hàng)**
   - Kiểm tra `req.body.agreeMarketing`
   - Nếu `true` và có email, gửi email xác nhận đơn hàng
   - Xử lý lỗi gửi email mà không ảnh hưởng đến việc tạo đơn hàng

2. **`paypalComplete` (Thanh toán qua PayPal)**
   - Tương tự như COD
   - Gửi email sau khi xác nhận thanh toán PayPal thành công

#### File: `TMDT-BE/api/v1/controllers/client/vnpay.controller.js`

**Cập nhật IPN Handler:**
- **`ipnHandler`**: Xử lý thông báo từ VNPay sau khi thanh toán
- Khi nhận mã phản hồi `00` (thành công):
  - Tìm đơn hàng trong database
  - Kiểm tra `agreeMarketing`
  - Gửi email xác nhận nếu khách hàng đồng ý

### 4. Frontend - Order Form

#### File: `TMDT-FE/src/Pages/InfoOrder/index.jsx`

**Cập nhật 3 luồng thanh toán:**

1. **Cash-on-Delivery (COD)**
   - Thêm `agreeMarketing: agreeMarketing` vào data object
   - Gửi giá trị checkbox đến backend

2. **VNPay**
   - Thêm `agreeMarketing` vào data trước khi tạo link thanh toán
   - Lưu vào database để sử dụng khi xử lý IPN

3. **PayPal**
   - Thêm `agreeMarketing` vào body request khi gọi API xác nhận giao dịch

## Quy trình hoạt động

### Luồng thanh toán COD:
1. Khách hàng điền thông tin và chọn checkbox "Tôi đồng ý nhận email / SMS..."
2. Nhấn "Đặt hàng ngay"
3. Backend tạo đơn hàng trong database
4. **Nếu `agreeMarketing = true`**: Gửi email xác nhận ngay lập tức
5. Trả về response thành công cho frontend
6. Chuyển hướng đến trang `/success-order`

### Luồng thanh toán VNPay:
1. Khách hàng chọn VNPay và tick checkbox marketing
2. Backend lưu đơn hàng với `agreeMarketing`
3. Tạo link thanh toán VNPay
4. Khách hàng thanh toán trên cổng VNPay
5. VNPay gửi IPN (notification) về server
6. **Backend xử lý IPN**: Nếu thanh toán thành công và `agreeMarketing = true`, gửi email
7. Khách hàng được redirect về trang thành công

### Luồng thanh toán PayPal:
1. Khách hàng chọn PayPal và tick checkbox
2. Thanh toán qua PayPal
3. PayPal callback về server với transaction details
4. Backend lưu đơn hàng với `agreeMarketing`
5. **Nếu `agreeMarketing = true`**: Gửi email xác nhận
6. Chuyển hướng đến trang thành công

## Email Template

Email được thiết kế với:
- ✨ Giao diện chuyên nghiệp, responsive
- 🎨 Màu sắc thương hiệu Luxury Jewelry (đỏ #c41e3a)
- 📱 Tương thích với mọi thiết bị (mobile, desktop)
- 🖼️ Hiển thị hình ảnh sản phẩm
- 💰 Định dạng số tiền theo chuẩn Việt Nam
- 📋 Thông tin chi tiết, dễ đọc

## Cấu hình cần thiết

### Environment Variables (.env)
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Lưu ý**: 
- Sử dụng Gmail App Password (không phải mật khẩu thông thường)
- Hướng dẫn tạo App Password: https://support.google.com/accounts/answer/185833

## Testing

### Test Case 1: COD với opt-in marketing
1. Đăng nhập/Không đăng nhập
2. Thêm sản phẩm vào giỏ hàng
3. Vào trang thanh toán
4. Điền đầy đủ thông tin (email hợp lệ)
5. ✅ Tick checkbox "Tôi đồng ý nhận email / SMS..."
6. Chọn "Thanh toán khi nhận hàng"
7. Nhấn "Đặt hàng ngay"
8. **Kết quả**: Nhận email xác nhận đơn hàng

### Test Case 2: COD không opt-in
1. Thực hiện tương tự Test Case 1
2. ❌ Không tick checkbox marketing
3. **Kết quả**: Đơn hàng được tạo nhưng KHÔNG gửi email

### Test Case 3: VNPay với opt-in
1. Chọn phương thức VNPay
2. Tick checkbox marketing
3. Thanh toán thành công trên cổng VNPay
4. **Kết quả**: Nhận email sau khi VNPay xác nhận thanh toán

### Test Case 4: PayPal với opt-in
1. Chọn PayPal
2. Tick checkbox marketing
3. Hoàn tất thanh toán PayPal
4. **Kết quả**: Nhận email xác nhận

## Xử lý lỗi

- Nếu gửi email thất bại, đơn hàng vẫn được tạo thành công
- Lỗi gửi email chỉ được log ra console, không ảnh hưởng đến trải nghiệm người dùng
- Email sẽ được gửi từ địa chỉ `process.env.EMAIL_USER`

## Bảo mật & GDPR Compliance

- ✅ Khách hàng phải chủ động đồng ý (opt-in)
- ✅ Không bắt buộc phải tick checkbox để đặt hàng
- ✅ Lưu trữ trạng thái đồng ý trong database
- ✅ Có thể mở rộng thêm chức năng unsubscribe sau này

## Mở rộng trong tương lai

1. **Unsubscribe Link**: Thêm link hủy đăng ký trong email
2. **Email Templates**: Tạo nhiều loại email khác nhau (shipping confirmation, delivery confirmation)
3. **SMS Integration**: Tích hợp gửi SMS ngoài email
4. **Admin Dashboard**: Quản lý danh sách khách hàng đăng ký nhận marketing
5. **Email Campaign**: Gửi email khuyến mãi hàng loạt cho khách hàng đã opt-in

## Liên hệ hỗ trợ

Nếu có vấn đề kỹ thuật, kiểm tra:
1. File `.env` có đúng EMAIL_USER và EMAIL_PASSWORD
2. Gmail App Password còn hiệu lực
3. Console log để xem lỗi chi tiết
4. Database có field `agreeMarketing` chưa

---

**Ngày triển khai**: 24/11/2025
**Version**: 1.0.0
