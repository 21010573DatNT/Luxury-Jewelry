import { Button, Checkbox, Form, Input, message } from "antd";
import "./LoginAdmin.scss";
import { useDispatch } from "react-redux";
import * as AccountService from "../../../Services/accountService";
import { useNavigate } from "react-router-dom";
import { updateAccount } from "../../../Redux/reducers/accountReducer";

function Login_Admin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        try {
            const res = await AccountService.AccountLogin(values);

            if (res.code === 200) {
                const handleGetDetailAccount = async (res) => {
                    const account = res.account;
                    const permissions = res.permissions;

                    dispatch(
                        updateAccount({
                            ...account,
                            token: account.token,
                            permissions: permissions,
                        })
                    );
                };

                handleGetDetailAccount(res);

                message.success("Đăng nhập thành công!");

                navigate(`/admin`);
            } else {
                message.error("Email hoặc mật khẩu sai!");
            }
        } catch (error) {
            if (error.response) {
                console.log("Error response:", error.response);
                message.error(
                    `${error.response.data.message || "Không xác định"}`
                );
            } else {
                console.log("Error request:", error.request);
                message.error(
                    "Không thể kết nối với máy chủ. Vui lòng thử lại."
                );
            } 
        }
    };

    return (
        <div className="container-login-admin">
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: 500 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Tài khoản"
                    name="email"
                    rules={[{ required: true, message: "Nhập tên tài khoản!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Nhập mật khẩu!" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default Login_Admin;
