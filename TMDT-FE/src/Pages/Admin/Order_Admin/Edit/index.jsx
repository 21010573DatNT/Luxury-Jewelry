import { Form, Input, Select, Col, Row, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as OrderService from "../../../../Services/orderService";
const { Option } = Select;

function Order_Edit() {
    const { order_id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true)

    const fetchOrder = async () => {
        const res = await OrderService.OrderDetail(order_id);
        setOrder(res.order);
        setUser(res.order.infoUser);
        setLoading(false);
    };

    const handleSubmit = async (values) => {
        // Chỉ cập nhật trạng thái để tránh gửi các trường readOnly đã format
        const payload = { status: values.status };
        const res = await OrderService.OrderEdit(order_id, payload);
        if (res.code === 200) {
            message.success("Cập nhật thành công!");
            navigate(`/admin/order`);
        } else {
            message.error("Cập nhật thất bại!");
        }
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <Form
            layout="vertical"
            initialValues={{
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
                email: user?.email,
                note: user?.note,
                status: order?.status || "",
                totalPrice: order?.totalPrice,
                payment: order?.payment,
            }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Tên khách hàng" name="name">
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Điện thoại" name="phone">
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Trạng thái" name="status" >
                <Select >
                    <Option value="waiting">Đang chờ vận chuyển</Option>
                    <Option value="shipping">Đang vận chuyển</Option>
                    <Option value="finish">Hoàn thành</Option>
                    <Option value="refund">Hoàn trả</Option>
                </Select>
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
                            key={item.name}
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
                <Input readOnly value={`${formatPrice(order?.totalPrice)} đ`} />
            </Form.Item>
            <Form.Item label="Phương thức thanh toán" name="payment">
                <Input readOnly />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Order_Edit;
