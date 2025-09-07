import { Form, Input,Select,Col,Row } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as AccountService from "../../../../Services/accountService";
const { Option } = Select;

function Account_Detail() {
    const { account_id } = useParams();
    const [account, setAccount] = useState(null);
    const [loading,setLoading] = useState(true)

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
        <Form
            layout="vertical"
            initialValues={{
                name: account?.fullName,
                phone: account?.phone,
                email: account?.email,
                role: account?.role_name,
                password: account?.password
            }}
        >
            <Form.Item label="Tên tài khoản" name="name" >
                <Input disabled />
            </Form.Item>
            <Form.Item label="Điện thoại" name="phone" >
                <Input disabled />
            </Form.Item>
            <Form.Item label="Email" name="email" >
                <Input disabled />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password" >
                <Input disabled />
            </Form.Item>
            <Form.Item label="Quyền" name="role" >
                <Input disabled />
            </Form.Item>
        </Form>
    );
}

export default Account_Detail;
