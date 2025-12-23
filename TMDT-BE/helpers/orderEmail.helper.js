// Helper function to generate order confirmation email HTML
module.exports.generateOrderConfirmationEmail = (orderData) => {
    const { infoUser, product, totalPrice, orderID, payment, status } = orderData;

    // Generate product rows HTML
    const productRows = product.map(item => `
        <tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 15px; text-align: left;">
                <div style="display: flex; align-items: center;">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 10px;">` : ''}
                    <div>
                        <strong style="color: #333; font-size: 14px;">${item.name}</strong>
                        <div style="color: #666; font-size: 12px;">Số lượng: ${item.amount}</div>
                    </div>
                </div>
            </td>
            <td style="padding: 15px; text-align: right; color: #c41e3a; font-weight: bold;">
                ${(item.price * item.amount).toLocaleString('vi-VN')} đ
            </td>
        </tr>
    `).join('');

    // Payment method display
    const paymentMethod = payment === 'Cash-on-delivery' ?
        '💰 Thanh toán khi nhận hàng (COD)' :
        payment === 'Vnpay' ? '🏦 VNPay' :
            payment === 'paypal' ? '💳 PayPal' : payment;

    // Status display
    const statusDisplay = status === 'waiting' ?
        '⏳ Đang chờ xử lý' :
        status === 'shipping' ? '🚚 Đang vận chuyển' :
            status === 'finish' ? '✅ Hoàn thành' : status;

    // Generate HTML email
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                ✨ Luxury Jewelry
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                                Cảm ơn bạn đã đặt hàng
                            </p>
                        </td>
                    </tr>

                    <!-- Success Message -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center;">
                            <div style="background-color: #e8f5e9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                <h2 style="margin: 0; color: #2e7d32; font-size: 20px;">
                                    🎉 Đặt hàng thành công!
                                </h2>
                                <p style="margin: 10px 0 0 0; color: #4caf50; font-size: 14px;">
                                    Đơn hàng của bạn đã được xác nhận và đang được xử lý
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Order Info -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px;">
                                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; border-bottom: 2px solid #c41e3a; padding-bottom: 10px;">
                                    📋 Thông tin đơn hàng
                                </h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Mã đơn hàng:</td>
                                        <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right; font-size: 14px;">${orderID || 'Đang cập nhật'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Trạng thái:</td>
                                        <td style="padding: 8px 0; text-align: right; font-size: 14px;">${statusDisplay}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Phương thức thanh toán:</td>
                                        <td style="padding: 8px 0; text-align: right; font-size: 14px;">${paymentMethod}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Customer Info -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px;">
                                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; border-bottom: 2px solid #c41e3a; padding-bottom: 10px;">
                                    👤 Thông tin khách hàng
                                </h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Họ tên:</td>
                                        <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right; font-size: 14px;">${infoUser.name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Email:</td>
                                        <td style="padding: 8px 0; color: #333; text-align: right; font-size: 14px;">${infoUser.email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Số điện thoại:</td>
                                        <td style="padding: 8px 0; color: #333; text-align: right; font-size: 14px;">${infoUser.phone}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Địa chỉ giao hàng:</td>
                                        <td style="padding: 8px 0; color: #333; text-align: right; font-size: 14px; max-width: 300px;">${infoUser.address}</td>
                                    </tr>
                                    ${infoUser.note ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Ghi chú:</td>
                                        <td style="padding: 8px 0; color: #333; text-align: right; font-size: 14px; font-style: italic;">${infoUser.note}</td>
                                    </tr>
                                    ` : ''}
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Products -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                                🛍️ Chi tiết sản phẩm
                            </h3>
                            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
                                <thead>
                                    <tr style="background-color: #f8f9fa;">
                                        <th style="padding: 12px 15px; text-align: left; color: #666; font-size: 13px; font-weight: 600;">Sản phẩm</th>
                                        <th style="padding: 12px 15px; text-align: right; color: #666; font-size: 13px; font-weight: 600;">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productRows}
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Total -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%); border-radius: 12px; padding: 20px; text-align: center;">
                                <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 5px;">Tổng cộng</div>
                                <div style="color: #ffffff; font-size: 32px; font-weight: bold;">
                                    ${totalPrice.toLocaleString('vi-VN')} đ
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px; line-height: 1.6;">
                                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline:
                            </p>
                            <p style="margin: 0 0 10px 0; color: #c41e3a; font-weight: bold; font-size: 14px;">
                                📧 ${process.env.EMAIL_USER || 'support@luxuryjewelry.com'}
                            </p>
                            <p style="margin: 0 0 20px 0; color: #c41e3a; font-weight: bold; font-size: 14px;">
                                📞 Hotline: 0912145568
                            </p>
                            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
                                <p style="margin: 0; color: #999; font-size: 12px;">
                                    © 2025 Luxury Jewelry. All rights reserved.
                                </p>
                                <p style="margin: 10px 0 0 0; color: #999; font-size: 11px;">
                                    Bạn nhận được email này vì đã đặt hàng tại Luxury Jewelry
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    return html;
};
