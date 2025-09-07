import { Form, Input, Row, Col, Checkbox, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as RoleService from "../../../../Services/roleService";
import TextArea from "antd/es/input/TextArea";

function Role_Create() {
    const navigate = useNavigate();
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const allPermissions = [
        "product-category_view", "product-category_create", "product-category_detail", "product-category_deleted", "product-category_edit",
        "product_view", "product_create", "product_detail", "product_deleted", "product_edit",
        "role_view", "role_create", "role_detail", "role_edit", "role_deleted",
        "account_view", "account_create", "account_detail", "account_edit", "account_deleted",
        "user_view", "user_detail", "user_deleted",
        "order_view", "order_detail", "order_edit", "order_deleted",
    ];

    const handleSubmit = async (data) => {
        const updatedData = {
            ...data,
            permissions: selectedPermissions, // Thêm quyền đã chọn
        };
        
        const res = await RoleService.RoleCreate(updatedData)

        if (res.code === 200) {
            message.success("Cập nhật thành công!");
            navigate(`/admin/role`);
        } else {
            message.error("Cập nhật thất bại!");
        }
    };

    return (
        <Form
            layout="vertical"
            initialValues={{
                title: "",
                description: "",
            }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Tên quyền" name="title">
                <Input />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
                <TextArea />
            </Form.Item>

            <Form.Item label="Quyền" name="permissions">
                <div>
                    {/* Tạo bảng với Row và Col */}
                    {allPermissions.map((permission, index) => (
                        <Row gutter={16} key={index} style={{ marginBottom: 10 }}>
                            <Col span={12}>
                                <strong>{permission}</strong>
                            </Col>
                            <Col span={12}>
                                <Checkbox
                                    value={permission}
                                    onChange={() => {
                                        // Toggle khi chọn/deselect quyền
                                        const newSelectedPermissions = selectedPermissions.includes(permission)
                                            ? selectedPermissions.filter(item => item !== permission) // Xóa quyền khỏi danh sách
                                            : [...selectedPermissions, permission]; // Thêm quyền vào danh sách
                                        setSelectedPermissions(newSelectedPermissions);
                                    }}
                                />
                            </Col>
                        </Row>
                    ))}
                </div>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginTop: 30 }}>
                    Tạo mới
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Role_Create;
