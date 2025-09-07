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
import { useNavigate, useParams } from "react-router-dom";
import "./SuccessPayment.scss";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const SuccessOrder = () => {
    const {vnp_BankCode} = useParams()
    const {user_id} = useParams()
    const navigate = useNavigate();
    const [order, setOrder] = useState("");
    const [user, setUser] = useState("");
    const [products, setProducts] = useState([]);

    const NewOrder = async () => {
        const res = await OrderService.NewOrderGet()
        console.log(res)
        setOrder(res.latestOrder)
        setUser(res.latestOrder.infoUser)
        setProducts(res.latestOrder.product)
    }

    useEffect(() => {
        console.log("OKK")
        NewOrder();
    },[user_id])

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
                            {user?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {user?.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {user?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ giao hàng">
                            {user?.address}
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
                                        {formatCurrency(item?.amount*item?.price)}
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
