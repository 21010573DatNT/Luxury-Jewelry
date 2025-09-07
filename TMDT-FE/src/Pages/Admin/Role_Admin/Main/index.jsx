import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./RoleAdmin.scss";
import * as RoleService from "../../../../Services/roleService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function RoleAdmin() {
    const [roles, setRole] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const permissions = TakePermissions();

    useEffect(() => {
        const roleGet = async () => {
            const res = await RoleService.RoleGet();
            setRole(res.roles);
        };
        roleGet();
    }, []);

    const handleDelete = async (id) => {
        const res = await RoleService.RoleDelete(id);
        if (res.code === 200) {
            setRole((prevRole) => prevRole.filter((role) => role._id !== id));
            message.success("Xóa thành công!");
        } else {
            message.error("Xóa thất bại!");
        }
    };

    return (
        <div className="role-admin">
            {permissions.includes("role_view") ? (
                <>
                    <div className="role-admin__header">
                        <h2>Quản lý quyền</h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate("/admin/role/create")}
                        >
                            Thêm quyền
                        </Button>
                    </div>
                    <div className="role-grid">
                        {/* Header */}
                        <Row className="role-grid-header" gutter={0}>
                            <Col span={5}>
                                <b>STT</b>
                            </Col>
                            <Col span={8}>
                                <b>Tên</b>
                            </Col>
                            <Col span={11}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {roles.length === 0 ? (
                            <Row
                                className="role-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có quyền.</Col>
                            </Row>
                        ) : (
                            roles.map((item, index) => (
                                <Row
                                    className="role-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={5}>{(index += 1)}</Col>
                                    <Col span={8}>{item.title}</Col>
                                    <Col span={11}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/role/detail/${item._id}`
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
                                                    `/admin/role/edit/${item._id}`
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
                <>
                    <p>Không có quyền hạn</p>
                </>
            )}
        </div>
    );
}

export default RoleAdmin;
