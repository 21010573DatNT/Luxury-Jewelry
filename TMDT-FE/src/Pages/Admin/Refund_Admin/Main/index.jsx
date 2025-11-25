import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message, Pagination } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./RefundAdmin.scss";
import * as RefundService from "../../../../Services/refundService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function RefundAdmin() {
    const [refunds, setRefunds] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15);
    const navigate = useNavigate();
    const permissions = TakePermissions();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const translateStatus = (status) => {
        const statusMap = {
            'Refunded': 'Đã hoàn trả',
            'Pending': 'Chờ xử lý',
            'Rejected': 'Từ chối',
            'Refunding': 'Đang hoàn trả',
            'refunding': 'Đang hoàn trả',
            'pending': 'Chờ xử lý',
            'refunded': 'Đã hoàn trả',
            'rejected': 'Từ chối'
        };
        return statusMap[status] || status;
    };

    useEffect(() => {
        const RefundsGet = async () => {
            const res = await RefundService.RefundGet();
            // Sắp xếp theo thời gian tạo mới nhất
            const sortedRefunds = res.refunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRefunds(sortedRefunds);
        };
        RefundsGet();
    }, []);

    const handleDelete = async (id) => {
        const res = await RefundService.RefundDelete(id);
        if (res.code === 200) {
            setRefunds((prevRefund) =>
                prevRefund.filter((refund) => refund._id !== id)
            );
            message.success("Xóa thành công!");
        } else {
            message.error("Xóa thất bại!");
        }
    };

    // Filter refunds based on search
    const filteredRefunds = refunds.filter((item) => {
        const searchLower = search.toLowerCase();
        return (
            item.customerName?.toLowerCase().includes(searchLower) ||
            item.returnType?.toLowerCase().includes(searchLower) ||
            translateStatus(item.status)?.toLowerCase().includes(searchLower)
        );
    });

    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentRefunds = filteredRefunds.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="refund-admin">
            {permissions.includes("refund_view") ? (
                <>
                    <div className="order-admin__header">
                        <h2>Quản lý đổi trả</h2>
                    </div>
                    <div className="order-admin__search">
                        <Input
                            placeholder="Tìm kiếm đơn hàng..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className="order-grid">
                        {/* Header */}
                        <Row className="order-grid-header" gutter={0}>
                            <Col span={2}>
                                <b>STT</b>
                            </Col>
                            <Col span={5}>
                                <b>Tên khách hàng</b>
                            </Col>
                            <Col span={3}>
                                <b>Hình thức</b>
                            </Col>
                            <Col span={4}>
                                <b>Ngày gửi</b>
                            </Col>
                            <Col span={4}>
                                <b>Trạng thái</b>
                            </Col>
                            <Col span={6}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {refunds.length === 0 ? (
                            <Row
                                className="order-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có dữ liệu</Col>
                            </Row>
                        ) : (
                            currentRefunds.map((item, index) => (
                                <Row
                                    className="order-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={2}>{startIndex + index + 1}</Col>
                                    <Col span={5}>{item.customerName}</Col>
                                    <Col span={3}>{item.returnType}</Col>
                                    <Col span={4}>
                                        {formatDate(item.createdAt)}
                                    </Col>
                                    <Col span={4}>{translateStatus(item.status) || ""}</Col>
                                    <Col span={6}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/refund/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        {permissions.includes("refund_edit") ? (
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/refund/edit/${item._id}`
                                                    )
                                                }
                                                style={{ marginRight: 4 }}
                                            >
                                                Sửa
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                        {permissions.includes(
                                            "refund_deleted"
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

                    {/* Pagination */}
                    {filteredRefunds.length > 0 && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredRefunds.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} của ${total} đơn hàng`
                                }
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p>Không có quyền hạn</p>
                </>
            )}
        </div>
    );
}

export default RefundAdmin;
