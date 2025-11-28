import { Form, Input, Select, message, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as AccountService from "../../../../Services/accountService";
import * as RoleService from "../../../../Services/roleService"
const { Option } = Select;

function Account_Create() {
    const [roles, setRoles] = useState(null);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const fetchRole = async () => {
        const res = await RoleService.RoleGet();
        setRoles(res.roles)
        setLoading(false)
    }

    useEffect(() => {
        fetchRole();
    }, []);


    if (loading) {
        return <div>Đang tải...</div>;
    }

    const handleSubmit = async (data) => {
        const res = await AccountService.AccountCreate(data);
        if (res.code === 200) {
            message.success("Tạo mới thành công!");
            navigate(`/admin/account`);
        } else {
            message.error("Tạo mới thất bại!");
        }
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2>Thêm mới tài khoản</h2>
            <Form
                layout="vertical"
                initialValues={{
                    fullName: "",
                    phone: "",
                    email: "",
                    role_id: "",
                    password: ""
                }}
                onFinish={handleSubmit}
            >
                <Form.Item label="Tên tài khoản" name="fullName" >
                    <Input />
                </Form.Item>
                <Form.Item label="Điện thoại" name="phone" >
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" >
                    <Input />
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password" >
                    <Input />
                </Form.Item>
                <Form.Item label="Quyền" name="role_id" >
                    <Select >
                        {roles?.map((item) => {
                            return (
                                <Option key={item._id} value={item._id}>{item.title}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo mới
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Account_Create;
