import { Form, Input, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as OrderService from "../../../../Services/orderService";

function Order_Detail() {
    const { order_id } = useParams();
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true)

    const fetchOrder = async () => {
        const res = await OrderService.OrderDetail(order_id);
        setOrder(res.order);
        setUser(res.order.infoUser)
        setLoading(false)
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const translateStatus = (status) => {
        const statusMap = {
            waiting: "Đang chờ vận chuyển",
            shipping: "Đang vận chuyển",
            finish: "Hoàn thành",
            refund: "Hoàn trả",
        };
        return statusMap[status] || status;
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2>Xem đơn hàng</h2>
            <Form
                layout="vertical"
                initialValues={{
                    name: user?.name,
                    address: user?.address,
                    phone: user?.phone,
                    email: user?.email,
                    note: user?.note,
                    status: translateStatus(order?.status) || "",
                    totalPrice: formatPrice(order?.totalPrice),
                    payment: order?.payment,
                }}
            >
                <Form.Item label="Tên khách hàng" name="name">
                    <Input readOnly value={user?.name} />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                    <Input readOnly value={user?.address} />
                </Form.Item>
                <Form.Item label="Điện thoại" name="phone">
                    <Input readOnly value={user?.phone} />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input readOnly value={user?.email} />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                    <Input readOnly />
                </Form.Item>
                <div>
                    <p style={{ marginBottom: 20 }}>Danh sách sản phẩm</p>
                    <Row className="product-grid-header" gutter={0}>
                        <Col span={6}>
                            <b>Ảnh</b>
                        </Col>
                        <Col span={12}>
                            <b>Tên sản phẩm</b>
                        </Col>
                        <Col span={6}>
                            <b>Số lượng</b>
                        </Col>
                    </Row>

                    {order.product.length === 0 ? (
                        <Row
                            className="product-grid-row"
                            style={{ textAlign: "center" }}
                        >
                            <Col span={24}>Không có danh mục sản phẩm nào.</Col>
                        </Row>
                    ) : (
                        order.product.map((item) => (
                            <Row
                                className="product-grid-row"
                                key={item.key}
                                gutter={0}
                                align="middle"
                            >
                                <Col span={6}>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt="product"
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 6,
                                            }}
                                        />
                                    ) : (
                                        <span>Không có ảnh</span>
                                    )}
                                </Col>
                                <Col span={12}>{item.name}</Col>
                                <Col span={6}>{item.amount}</Col>

                            </Row>
                        ))
                    )}
                </div>

                <Form.Item label="Tổng hóa đơn" name="totalPrice" style={{ marginTop: 20 }}>
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Phương thức thanh toán" name="payment">
                    <Input readOnly value={order?.payment} />
                </Form.Item>
            </Form>
        </div>
    );
}

export default Order_Detail;
