import { Button, Form, Input, Typography, message } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./LoginAdmin.scss";
import { useDispatch } from "react-redux";
import * as AccountService from "../../../Services/accountService";
import { useNavigate, Link } from "react-router-dom";
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
        <div className="admin-auth-page">
            <div className="admin-bg-shape shape-1" />
            <div className="admin-bg-shape shape-2" />
            <div className="admin-auth-card">
                <div className="admin-auth-header">
                    <Typography.Title level={2} className="title">Đăng nhập quản trị viên</Typography.Title>
                    <Typography.Text className="subtitle">Vui lòng đăng nhập để tiếp tục</Typography.Text>
                </div>

                <Form
                    name="adminLogin"
                    layout="vertical"
                    className="admin-auth-form"

                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tài khoản"
                        name="email"
                        rules={[{ required: true, message: "Nhập tên tài khoản!" }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nhập email quản trị"
                            size="large"
                            className="auth-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Nhập mật khẩu!" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                            size="large"
                            className="auth-input"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Removed remember me and forgot password as requested */}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block className="admin-auth-submit">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>

                <div className="admin-auth-footer">
                    <Typography.Text>Quay lại <Link to="/">trang chủ</Link></Typography.Text>
                </div>
            </div>
        </div>
    );
}
export default Login_Admin;
