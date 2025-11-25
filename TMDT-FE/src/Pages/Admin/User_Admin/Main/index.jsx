import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./UserAdmin.scss";
import * as UserService from "../../../../Services/userService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function UserAdmin() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const permissions = TakePermissions();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getUserSearch = async (val) => {
        const res = await UserService.UserSearch(val);
        setUsers(res.users);
    };

    const onSearchChange = async (e) => {
        const val = e.target.value;
        getUserSearch(val);
    };

    useEffect(() => {
        const UsersGet = async () => {
            const res = await UserService.UserGet();
            // Sắp xếp theo thời gian tạo mới nhất
            const sortedUsers = res.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUsers(sortedUsers);
        };
        UsersGet();
    }, []);

    const handleDelete = async (id) => {
        const res = await UserService.UserDelete(id);
        if (res.code === 200) {
            setUsers((prevUser) => prevUser.filter((user) => user._id !== id));
            message.success("Xóa khách hàng thành công!");
        } else {
            message.error("Xóa khách hàng thất bại!");
        }
    };

    return (
        <div className="user-admin">
            {permissions.includes("user_view") ? (
                <>
                    <div className="user-admin__header">
                        <h2>Quản lý khách hàng</h2>
                    </div>
                    <div className="user-admin__search">
                        <Input
                            placeholder="Tìm kiếm khách hàng..."
                            prefix={<SearchOutlined />}
                            onChange={onSearchChange}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className="user-grid">
                        {/* Header */}
                        <Row className="user-grid-header" gutter={0}>
                            <Col span={2}>
                                <b>STT</b>
                            </Col>
                            <Col span={3}>
                                <b>Tên khách hàng</b>
                            </Col>
                            <Col span={3}>
                                <b>Email</b>
                            </Col>
                            <Col span={4}>
                                <b>Điện thoại</b>
                            </Col>
                            <Col span={6}>
                                <b>Địa chỉ</b>
                            </Col>
                            <Col span={3}>
                                <b>Ngày tạo</b>
                            </Col>
                            <Col span={3}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {users.length === 0 ? (
                            <Row
                                className="user-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có khách hàng.</Col>
                            </Row>
                        ) : (
                            users.map((item, index) => (
                                <Row
                                    className="user-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={2}>{(index += 1)}</Col>
                                    <Col span={3}>{item.fullName}</Col>
                                    <Col span={3}>{item.email}</Col>
                                    <Col span={4}>{item.phone}</Col>
                                    <Col span={6}>{item.address}</Col>
                                    <Col span={3}>{formatDate(item.createdAt)}</Col>
                                    <Col span={3}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/customer/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        {permissions.includes(
                                            "user_deleted"
                                        ) ? (
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                danger
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Xóa
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                    </Col>
                                </Row>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p>Không có quyền hạn</p>
                </>
            )}
        </div>
    );
}

export default UserAdmin;
