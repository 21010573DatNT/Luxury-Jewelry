import { Form, Input, Select, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as AccountService from "../../../../Services/accountService";
const { Option } = Select;

function Account_Detail() {
    const { account_id } = useParams();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true)

    const fetchAccount = async () => {
        const res = await AccountService.AccountDetail(account_id);
        setAccount(res[0])
        setLoading(false)
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2>Xem tài khoản</h2>
            <Form
                layout="vertical"
                initialValues={{
                    name: account?.fullName,
                    phone: account?.phone,
                    email: account?.email,
                    role: account?.role_name,
                    password: "********"
                }}
            >
                <Form.Item label="Tên tài khoản" name="name" >
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Điện thoại" name="phone" >
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Email" name="email" >
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password" >
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Quyền" name="role" >
                    <Input readOnly />
                </Form.Item>
            </Form>
        </div>
    );
}

export default Account_Detail;
