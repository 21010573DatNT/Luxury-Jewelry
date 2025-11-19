import { useEffect, useState } from "react";
import {
    Card,
    Button,
    Table,
    Tag,
    Space,
    Modal,
    Row,
    Col,
    Divider,
} from "antd";
import * as OrderService from "../../../Services/orderService";
import "./OrderUser.scss"
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const OrderUser = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const user = useSelector((state) => state.user);

    const translateStatus = (status) => {
        const statusMap = {
            'finish': 'Hoàn thành',
            'shipping': 'Đang giao',
            'waiting': 'Chờ xử lý',
            'refund': 'Hoàn trả'
        };
        return statusMap[status] || status;
    };
    let decode = null;
    try {
        if (user && user.token && user.token.split('.').length === 3) {
            decode = jwtDecode(user.token);
        }
    } catch (e) {
        decode = null;
    }
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const OrderUser = async () => {
            const res = await OrderService.OrderOfUser(decode.id);
            setOrders(res.listOrderUser);
        };
        OrderUser();
    }, [decode?.id]);

    const showOrderDetail = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

    const itemColumns = [
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "amount",
            key: "amount",
            width: 100,
            align: "center",
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
            width: 120,
            align: "right",
            render: (price) => `${price.toLocaleString("vi-VN")} đ`,
        },
    ];

    return (
        <div className="orders-container">
            <Card title="Đơn hàng của tôi" className="orders-card">
                <div
                    className="orders-header"
                    style={{ fontWeight: "bold", padding: "8px 0", textAlign: "center" }}
                >
                    <Row gutter={16}>
                        <Col span={6}>Ngày đặt</Col>
                        <Col span={6}>Tổng tiền</Col>
                        <Col span={6}>Trạng thái</Col>
                        <Col span={6}>Thao tác</Col>
                    </Row>
                </div>
                <Divider style={{ margin: 0 }} />
                {orders.map((order, index) => (
                    <div
                        key={order.orderCode}
                        style={{
                            padding: "8px 0",
                            borderBottom: "1px solid #f0f0f0",
                        }}
                    >
                        <Row gutter={16} align="middle" style={{ textAlign: "center" }}>
                            <Col span={6}>{new Date(order.createdAt).toLocaleDateString()}</Col>
                            <Col span={6}>
                                <span className="order-amount">
                                    {order.totalPrice.toLocaleString("vi-VN")} đ
                                </span>
                            </Col>
                            <Col span={6}>
                                <Tag
                                    color={
                                        order.status === "finish"
                                            ? "green"
                                            : order.status === "shipping"
                                                ? "blue"
                                                : order.status === "refund"
                                                    ? "red"
                                                    : "orange"
                                    }
                                >
                                    {translateStatus(order.status)}
                                </Tag>
                            </Col>
                            <Col span={6}>
                                <Space>
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={() => showOrderDetail(order)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                ))}
            </Card>

            {/* Modal chi tiết đơn hàng */}
            <Modal
                title={`Chi tiết đơn hàng`}
                onCancel={handleCancel}
                open={isModalVisible}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Đóng
                    </Button>,
                ]}
                width={800}
                className="order-detail-modal"
            >
                {selectedOrder && (
                    <div className="order-detail-content">
                        {/* Thông tin đơn hàng */}
                        <Card
                            size="small"
                            title="Thông tin đơn hàng"
                            className="detail-section"
                        >
                            <div className="order-info-grid">
                                <div className="info-row">
                                    <span className="info-label">
                                        Mã đơn hàng:
                                    </span>
                                    <span className="info-value order-code">
                                        {selectedOrder._id}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">
                                        Ngày đặt hàng:
                                    </span>
                                    <span className="info-value">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">
                                        Trạng thái:
                                    </span>
                                    <Tag
                                        color={
                                            selectedOrder.status === "finish"
                                                ? "green"
                                                : selectedOrder.status ===
                                                    "shipping"
                                                    ? "blue"
                                                    : selectedOrder.status ===
                                                        "refund"
                                                        ? "red"
                                                        : "orange"
                                        }
                                    >
                                        {translateStatus(selectedOrder.status)}
                                    </Tag>
                                </div>
                            </div>
                        </Card>

                        {/* Thông tin khách hàng */}
                        <Card
                            size="small"
                            title="Thông tin giao hàng"
                            className="detail-section"
                        >
                            <div className="order-info-grid">
                                <div className="info-row">
                                    <span className="info-label">
                                        Tên khách hàng:
                                    </span>
                                    <span className="info-value">
                                        {selectedOrder.infoUser.name}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">
                                        Số điện thoại:
                                    </span>
                                    <span className="info-value">
                                        {selectedOrder.infoUser.phone}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">
                                        Địa chỉ giao hàng:
                                    </span>
                                    <span className="info-value">
                                        {selectedOrder.infoUser.address}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">
                                        Phương thức thanh toán:
                                    </span>
                                    <span className="info-value">
                                        {selectedOrder.payment}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Chi tiết sản phẩm */}
                        <Card
                            size="small"
                            title="Chi tiết sản phẩm"
                            className="detail-section"
                        >
                            <Table
                                columns={itemColumns}
                                dataSource={selectedOrder.product}
                                pagination={false}
                                size="small"
                                className="items-table"
                            />
                            <div className="order-summary">
                                <div className="summary-row">
                                    <span className="summary-label">
                                        Tổng tiền:
                                    </span>
                                    <span className="summary-value order-amount">
                                        {selectedOrder.totalPrice.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        đ
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderUser;
