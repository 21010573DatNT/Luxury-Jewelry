import { Form, Input, Select, message, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as AccountService from "../../../../Services/accountService";
import * as RoleService from "../../../../Services/roleService";
import Password from "antd/es/input/Password";
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
        // Gửi request cập nhật tài khoản, sử dụng role_id thay vì role_name
        const res = await AccountService.AccountEdit(account_id, {
            ...data,
            role_id: data.role_id // Chỉ gửi role_id thực sự
        });
        if (res.code === 200) {
            message.success("Cập nhật thành công!");
            navigate(`/admin/account`);
        } else {
            message.error("Cập nhật thất bại!");
        }
    };

    return (
        <Form
            layout="vertical"
            initialValues={{
                name: account?.fullName,
                phone: account?.phone,
                email: account?.email,
                role_id: account?.role_id, 
                password: account?.password,
            }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Tên tài khoản" name="name">
                <Input />
            </Form.Item>
            <Form.Item label="Điện thoại" name="phone">
                <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password">
                <Input />
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
    );
}

export default Account_Edit;
