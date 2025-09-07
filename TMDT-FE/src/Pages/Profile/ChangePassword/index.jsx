import { Card, Form, Input, Button, message} from 'antd';
import { LockOutlined} from '@ant-design/icons';
import * as UserSerivce from '../../../Services/userService'
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user);
    const decode = jwtDecode(user.token);

    const handleSubmit = async (values) => {
        const res = await UserSerivce.UserChangePassword(decode.id,values)
        if(res.code === 400) {
            message.error("Mật khẩu cũ không chính xác")
        } else if(res.code === 401) {
            message.error("Mật khẩu mới không được giống mật khẩu cũ")
        } else {
            message.success("Đổi mật khẩu thành công")
            form.resetFields();
        }
    };

    return (
        <div className="password-container">
            <Card title="Đổi mật khẩu" className="password-card">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="password-form"
                >
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu hiện tại!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu mới!",
                            },
                            {
                                min: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={["newPassword"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng xác nhận mật khẩu mới!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Mật khẩu xác nhận không khớp!"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="submit-btn"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePassword;
