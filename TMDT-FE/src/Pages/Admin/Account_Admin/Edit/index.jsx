import { Form, Input, Select, message, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as AccountService from "../../../../Services/accountService";
import * as RoleService from "../../../../Services/roleService";
const { Option } = Select;

function Account_Edit() {
    const { account_id } = useParams();
    const [account, setAccount] = useState(null);
    const [roles, setRoles] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAccount = async () => {
        const res = await AccountService.AccountDetail(account_id);
        setAccount(res[0]);
        setLoading(false);
    };

    const fetchRole = async () => {
        const res = await RoleService.RoleGet();
        setRoles(res.roles);
        setLoading(false);
    };

    useEffect(() => {
        fetchAccount();
        fetchRole();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    const handleSubmit = async (data) => {
        const payload = {
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            role_id: data.role_id,
        };

        // Only send password when user actually enters a new one
        if (String(data.password || "").trim()) {
            payload.password = data.password;
        }

        const res = await AccountService.AccountEdit(account_id, payload);
        if (res.code === 200) {
            message.success("Cập nhật thành công!");
            navigate(`/admin/account`);
        } else {
            message.error("Cập nhật thất bại!");
        }
    };

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2>Sửa tài khoản</h2>
            <Form
                layout="vertical"
                initialValues={{
                    fullName: account?.fullName,
                    phone: account?.phone,
                    email: account?.email,
                    role_id: account?.role_id,
                    password: "",
                }}
                onFinish={handleSubmit}
            >
                <Form.Item label="Tên tài khoản" name="fullName">
                    <Input />
                </Form.Item>
                <Form.Item label="Điện thoại" name="phone">
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password">
                    <Input.Password placeholder="Để trống nếu không đổi" />
                </Form.Item>
                <Form.Item label="Quyền" name="role_id">
                    <Select>
                        {roles?.map((item) => (
                            <Option key={item._id} value={item._id}>
                                {item.title}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Account_Edit;
