import { Form, Input, Select, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as UserService from "../../../../Services/userService";
import * as OrderService from "../../../../Services/orderService";
const { Option } = Select;

function User_Detail() {
    const { user_id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        const res = await UserService.UserDetail(user_id);
        setUser(res.user)
        setLoading(false)
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <Form
            layout="vertical"
            initialValues={{
                name: user?.fullName,
                address: user?.address,
                phone: user?.phone,
                email: user?.email,
                createdAt: formatDate(user?.createdAt)
            }}
        >
            <Form.Item label="Tên khách hàng" name="name" >
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address" >
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Điện thoại" name="phone" >
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Email" name="email" >
                <Input readOnly />
            </Form.Item>
            <Form.Item label="Ngày tạo" name="createdAt" >
                <Input readOnly />
            </Form.Item>
            {/* <div> 
                <p style={{marginBottom:20}}>Danh sách đơn hàng đã mua</p>
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
            </div> */}
        </Form>
    );
}

export default User_Detail;
