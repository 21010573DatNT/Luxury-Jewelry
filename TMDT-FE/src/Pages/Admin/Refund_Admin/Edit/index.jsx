import { Form, Input, Select, Col, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as RefundService from "../../../../Services/refundService";
import TextArea from "antd/es/input/TextArea";
import { Image, message, Button } from "antd";
const { Option } = Select;

function Refund_Edit() {
    const { refund_id } = useParams();
    const navigate = useNavigate();
    const [refund, setRefund] = useState(null);
    const [images, setImages] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const RefundDetail = async () => {
        const res = await RefundService.RefundDetail(refund_id);
        setRefund(res.refund);
        setProducts(res.refund.products);
        setImages(res.refund.images);
        setLoading(false);
    };

    const handleFinish = async (data) => {
        const res = await RefundService.RefundEdit(refund_id, data);
        if (res.code === 200) {
            const res = await RefundService.RefundSendMail(refund.email)
            if (res.success === true) {
                message.success("Cập nhật thành công!");
                navigate(`/admin/refund`);
            }
        } else {
            message.error("Cập nhật thất bại!");
        }
    };

    useEffect(() => {
        RefundDetail();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2>Sửa đổi trả</h2>
            <Form
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    name: refund?.customerName,
                    phone: refund?.phone,
                    email: refund?.email,
                    description: refund?.description,
                    status: refund?.status || "",
                    reason: refund?.reason,
                    images: refund?.images,
                    products: products,
                }}
            >
                <Form.Item label="Tên khách hàng" name="name">
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Điện thoại" name="phone">
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Lý do" name="reason">
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Mô tả chi tiết" name="description">
                    <TextArea readOnly />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                    <Select>
                        <Option value="Refunding">Đang hoàn trả</Option>
                        <Option value="Refunded">Đã hoàn trả</Option>
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

                    {products.length === 0 ? (
                        <Row
                            className="product-grid-row"
                            style={{ textAlign: "center" }}
                        >
                            <Col span={24}>Không có sản phẩm nào.</Col>
                        </Row>
                    ) : (
                        products.map((item) => (
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
                <Form.Item
                    label="Ảnh lỗi sản phẩm"
                    name="images"
                    style={{ marginTop: 30 }}
                >
                    {images.length === 0 ? (
                        <span>Không có ảnh</span>
                    ) : (
                        images.map((item, idx) => (
                            <Image
                                key={idx}
                                src={item}
                                alt={`refund-img-${idx}`}
                                style={{
                                    width: 120,
                                    marginRight: 8,
                                    marginBottom: 8,
                                    marginRight: 40,
                                    marginTop: 30,
                                }}
                            />
                        ))
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginTop: 30 }}
                    >
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Refund_Edit;
