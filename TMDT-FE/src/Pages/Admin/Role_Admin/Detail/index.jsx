import { Form, Input, Row, Col, Checkbox, Button, message } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as RoleService from "../../../../Services/roleService";
import TextArea from "antd/es/input/TextArea";

function Role_Detail() {
    const { role_id } = useParams();
    const [role, setRole] = useState(null);

    const allPermissions = [
        "product-category_view", "product-category_create", "product-category_detail", "product-category_deleted",
        "product_view", "product_create", "product_detail", "product_deleted",
        "role_view", "role_create", "role_detail", "role_deleted", "role_permissions",
        "account_view", "account_create", "account_detail", "account_deleted"
    ];

    const fetchRole = async () => {
        const res = await RoleService.RoleDetail(role_id);
        setRole(res.role);
    };

    useEffect(() => {
        fetchRole();
    }, []);

    if (!role) {
        return <div>Đang tải...</div>;
    }

    const handleSubmit = async (data) => {
        console.log(data);
        message.success("Cập nhật thành công!");
    };

    return (
        <Form
            layout="vertical"
            initialValues={{
                title: role?.title,
                description: role?.description,
                permissions: role?.permissions,  
            }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Tên quyền" name="title">
                <Input disabled />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
                <TextArea disabled />
            </Form.Item>

            <Form.Item label="Quyền" >
                <Row gutter={[16, 16]}>
                    {allPermissions.map((permission, index) => (
                        <Col span={12} key={index}>
                            <Row align="middle">
                                <Col span={12}>
                                    <strong>{permission}</strong>
                                </Col>
                                    <Col span={12}>
                                    <Checkbox
                                        value={permission}
                                        defaultChecked={role?.permissions.includes(permission)} 
                                        disabled
                                    />
                                </Col>
                            </Row>
                        </Col>
                    ))}
                </Row>
            </Form.Item>
        </Form>
    );
}

export default Role_Detail;
