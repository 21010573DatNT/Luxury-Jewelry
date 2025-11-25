import {
    Card,
    Button,
    Descriptions,
    Typography,
    Divider,
    Space,
    Tag,
} from "antd";
import {
    CheckCircleOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import * as OrderService from "../../Services/orderService"
import * as VnpayService from "../../Services/vnpayService"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./SuccessPayment.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { deleteAllCart } from "../../Redux/reducers/cartUserReducer";
import { deleteAllOrder } from "../../Redux/reducers/orderReducer";
import * as CartService from "../../Services/cartService";

const { Title, Text } = Typography;

const SuccessOrder = () => {
    const { vnp_BankCode } = useParams()
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.user);
    const [order, setOrder] = useState("");
    const [customer, setCustomer] = useState("");
    const [products, setProducts] = useState([]);

    const NewOrder = async () => {
        const res = await OrderService.NewOrderGet()
        console.log(res)
        setOrder(res.latestOrder)
        setCustomer(res.latestOrder.infoUser)
        setProducts(res.latestOrder.product)
    }

    useEffect(() => {
        console.log('🔍 SuccessOrder - Location:', location);
        console.log('🔍 SuccessOrder - Search params:', location.search);

        // Kiểm tra nếu có query params từ VNPay (thanh toán VNPay)
        const queryParams = new URLSearchParams(location.search);
        console.log('🔍 Has vnp_ResponseCode?', queryParams.has('vnp_ResponseCode'));

        if (queryParams.has('vnp_ResponseCode')) {
            console.log('✅ Detected VNPay payment, calling verification API...');
            // Gọi API để xác thực và gửi email
            const verifyVnpayPayment = async () => {
                try {
                    const params = Object.fromEntries(queryParams.entries());
                    console.log('📤 Sending params to backend:', params);
                    const result = await VnpayService.VnPayReturn(params);
                    console.log('📥 VNPay verification result:', result);

                    if (result.success) {
                        // Sau khi xác thực thành công, lấy thông tin order
                        await NewOrder();
                    }
                } catch (error) {
                    console.error('❌ Error verifying VNPay payment:', error);
                    // Vẫn lấy thông tin order dù có lỗi
                    await NewOrder();
                }
            };
            verifyVnpayPayment();
        } else {
            console.log('ℹ️ No VNPay params, using regular order fetch (COD/PayPal)');
            // Thanh toán COD hoặc PayPal
            NewOrder();
        }

        // Xóa giỏ hàng sau khi thanh toán thành công (trang thành công là điểm chung cho COD/VNPay/PayPal)
        const clearCart = async () => {
            try {
                if (authUser.token) {
                    const id = jwtDecode(authUser.token).id;
                    await CartService.cartDeleteItem(id);
                    dispatch(deleteAllCart());
                } else {
                    dispatch(deleteAllOrder());
                }
            } catch (e) {
                // Không chặn UI nếu có lỗi, chỉ log
                console.error("Clear cart after success failed:", e);
            }
        };
        clearCart();
        // chạy một lần khi vào trang
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const handleBackToHome = () => {
        navigate("/")
    };


    return (
        <div className="success-payment-container">
            <div className="success-content">
                {/* Success Icon và Title */}
                <div className="success-header">
                    <CheckCircleOutlined className="success-icon" />
                    <Title level={2} className="success-title">
                        Thanh Toán Thành Công!
                    </Title>
                    <Text className="success-subtitle">
                        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý
                        thành công.
                    </Text>
                </div>

                {/* Thông tin đơn hàng */}
                <Card className="order-info-card" title="Thông Tin Đơn Hàng">
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Mã đơn hàng">
                            <Text strong>{order?._id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt hàng">
                            {new Date(order?.createdAt).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color="success">Đã thanh toán</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Thông tin khách hàng */}
                <Card
                    className="customer-info-card"
                    title="Thông Tin Khách Hàng"
                >
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Họ tên">
                            {customer?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {customer?.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {customer?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ giao hàng">
                            {customer?.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phương thức thanh toán">
                            {order?.payment} {vnp_BankCode}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Chi tiết sản phẩm */}
                <Card className="products-card" title="Chi Tiết Sản Phẩm">
                    <div className="products-list">
                        {products?.map((item, index) => (
                            <div key={index} className="product-item">
                                <div className="product-info">
                                    <Text strong>{item?.name}</Text>
                                    <Text type="secondary">
                                        Số lượng: {item?.amount} ×{" "}
                                        {formatCurrency(item?.price)}
                                    </Text>
                                </div>
                                <div className="product-total">
                                    <Text strong>
                                        {formatCurrency(item?.amount * item?.price)}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Divider />

                    <div className="order-summary">
                        <Divider />
                        <div className="summary-row total-row">
                            <Text strong size="large">
                                Tổng cộng:
                            </Text>
                            <Text strong size="large" className="total-amount">
                                {formatCurrency(order?.totalPrice)}
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Action buttons */}
                <div className="action-buttons">
                    <Space size="large">
                        <Button
                            type="primary"
                            icon={<HomeOutlined />}
                            size="large"
                            onClick={handleBackToHome}
                        >
                            Quay về trang chủ
                        </Button>
                    </Space>
                </div>

                {/* Thông báo bổ sung */}
                <div className="additional-info">
                    <Text type="secondary">
                        Chúng tôi sẽ gửi email xác nhận và thông tin theo dõi
                        đơn hàng đến địa chỉ email của bạn. Đơn hàng sẽ được xử
                        lý và giao trong vòng 2-3 ngày làm việc.
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default SuccessOrder;
