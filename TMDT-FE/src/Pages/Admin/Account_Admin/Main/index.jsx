import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./AccountAdmin.scss";
import * as AccountService from "../../../../Services/accountService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function AccountAdmin() {
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const permissions = TakePermissions();

    useEffect(() => {
        const AccountsGet = async () => {
            const res = await AccountService.AccountGet();
            setAccounts(res);
            setLoading(false);
        };
        AccountsGet();
    }, []);

    const handleDelete = async (id) => {
        const res = await AccountService.AccountDelete(id);
        if (res.code === 200) {
            setAccounts((prevAccount) =>
                prevAccount.filter((account) => account._id !== id)
            );
            message.success("Xóa tài khoản thành công!");
        } else {
            message.error("Xóa tài khoản thất bại!");
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="account-admin">
            {permissions.includes("account_view") ? (
                <>
                    <div className="account-admin__header">
                        <h2>Quản lý tài khoản</h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate("/admin/account/create")}
                        >
                            Thêm mới
                        </Button>
                    </div>
                    <div className="account-grid">
                        {/* Header */}
                        <Row className="account-grid-header" gutter={0}>
                            <Col span={2}>
                                <b>STT</b>
                            </Col>
                            <Col span={4}>
                                <b>Tên tài khoản</b>
                            </Col>
                            <Col span={4}>
                                <b>Email</b>
                            </Col>
                            <Col span={4}>
                                <b>Điện thoại</b>
                            </Col>
                            <Col span={4}>
                                <b>Quyền</b>
                            </Col>
                            <Col span={6}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {accounts.length === 0 ? (
                            <Row
                                className="account-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có tài khoản.</Col>
                            </Row>
                        ) : (
                            accounts.map((item, index) => (
                                <Row
                                    className="account-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={2}>{(index += 1)}</Col>
                                    <Col span={4}>{item.fullName}</Col>
                                    <Col span={4}>{item.email}</Col>
                                    <Col span={4}>{item.phone}</Col>
                                    <Col span={4}>{item.role_name}</Col>
                                    <Col span={6}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/account/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        <Button
                                            icon={<EditOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/account/edit/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Sửa
                                        </Button>
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
                                    </Col>
                                </Row>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <><p>Không có quyền hạn</p></>
            )}
        </div>
    );
}

export default AccountAdmin;
