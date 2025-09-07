import { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "./Login.scss";
import * as UserService from "../../../Services/userService";
import { useMutationHook } from "../../../Hooks/useMutationHook";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; 
import { useDispatch } from "react-redux";
import { updateUser } from "../../../Redux/reducers/userReducer";

const { Title, Text } = Typography;

function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mutation = useMutationHook((data) => UserService.loginUser(data));

    const {data, isSuccess, isError} = mutation;
    
    useEffect(() => {
        if(data?.code === 200){
            navigate("/");
            localStorage.setItem("token", JSON.stringify(data?.token))
            const tokenFromHeader = data?.headers?.authorization;

            if (tokenFromHeader) {
                console.log("Token from header:", tokenFromHeader);
            }
        }
        if(data?.token){
            const decode = jwtDecode(data?.token);

            if(decode?.id){
                handleGetDetailUser(decode?.id, data?.token)
            }
        }
    },[isSuccess, isError, navigate, data])

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.ProfileUser(id, token)
        dispatch(updateUser({...res, token: token}))
    }

    const handleLogin = (values) => {
        mutation.mutate({
            email: values.email,
            password: values.password,
        });
    };

    useEffect(() => {
        if(data?.code === 400) {
            message.error(data.message);
        }
    }, [data]);

    return (
        <div className="auth-page-container">
            <div className="auth-form-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <Title level={2} className="auth-title">Đăng nhập</Title>
                        <Text className="auth-subtitle">Chào mừng bạn quay trở lại</Text>
                    </div>
                    
                    <Form
                        form={form}
                        name="loginForm"
                        onFinish={handleLogin}
                        autoComplete="off"
                        layout="vertical"
                        className="auth-form"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined />}
                                placeholder="Nhập địa chỉ email"
                                size="large"
                                className="auth-input"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                                size="large"
                                className="auth-input"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="auth-submit-btn"
                                size="large"
                                loading={mutation.isLoading}
                                block
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="auth-footer">
                        <Text className="auth-footer-text">
                            Chưa có tài khoản? 
                            <a href="/register" className="auth-link"> Đăng ký ngay</a>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;