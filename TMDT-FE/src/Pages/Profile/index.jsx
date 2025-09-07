import { useState } from "react";
import { Layout, Menu, Avatar } from "antd";
import {
    UserOutlined,
    LockOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";
import UserProfile from "./User";
import "./Profile.scss";
import OrderUser from "./OrderUser";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import ChangePassword from "./ChangePassword";

const { Sider, Content } = Layout;

const Profile = () => {
    const [selectedKey, setSelectedKey] = useState("profile");
    const user = useSelector((state) => state.user);
    const decode = jwtDecode(user.token);

    const menuItems = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Hồ sơ cá nhân",
        },
        {
            key: "password",
            icon: <LockOutlined />,
            label: "Đổi mật khẩu",
        },
        {
            key: "orders",
            icon: <ShoppingOutlined />,
            label: "Đơn hàng",
        },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case "profile":
                return <UserProfile />;
            case 'password':
                return <ChangePassword />;
            case "orders":
                return <OrderUser />;
            default:
                return <UserProfile />;
        }
    };

    return (
        <div className="user-dashboard">
            <Layout className="dashboard-layout">
                <Sider width={280} className="dashboard-sider">
                    <div className="sider-content">
                        <div className="user-welcome">
                            <Avatar
                                size={64}
                                icon={<UserOutlined />}
                                className="welcome-avatar"
                            />
                            <p className="welcome-name">{user?.fullName}</p>
                            <p className="welcome-role">Khách hàng</p>
                        </div>

                        <Menu
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            items={menuItems}
                            onClick={({ key }) => setSelectedKey(key)}
                            className="dashboard-menu"
                        />
                    </div>
                </Sider>

                <Layout>
                    <Content className="dashboard-content">
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default Profile;
