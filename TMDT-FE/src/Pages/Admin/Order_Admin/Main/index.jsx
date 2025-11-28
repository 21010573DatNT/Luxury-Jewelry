import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message, DatePicker, Pagination } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./OrderAdmin.scss";
import * as OrderService from "../../../../Services/orderService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

function OrderAdmin() {
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const navigate = useNavigate();
    const permissions = TakePermissions();

    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getTotalQuantity = (products) => {
        if (!products || products.length === 0) return 0;
        return products.reduce((total, product) => total + (product.amount || 0), 0);
    };

    const translatePayment = (payment) => {
        const paymentMap = {
            'cash': 'Tiền mặt',
            'vnpay': 'VNPay',
            'momo': 'MoMo',
            'banking': 'Chuyển khoản'
        };
        return paymentMap[payment] || payment;
    };

    const translateStatus = (status) => {
        const statusMap = {
            'finish': 'Hoàn thành',
            'shipping': 'Đang giao',
            'waiting': 'Chờ xử lý',
            'refund': 'Hoàn trả'
        };
        return statusMap[status] || status;
    };

    useEffect(() => {
        const OrdersGet = async () => {
            const res = await OrderService.OrderGet();
            const result = [];
            if (startDate && endDate) {
                for (const order of res.orders) {
                    const date = new Date(order.createdAt);
                    if (date > startDate && date < endDate) {
                        result.push(order);
                    }
                }
                // Sắp xếp theo thời gian tạo mới nhất
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(result);
                setAllOrders(result);
            } else {
                // Sắp xếp theo thời gian tạo mới nhất
                const sortedOrders = res.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
                setAllOrders(sortedOrders);
            }
        };
        OrdersGet();
    }, [startDate, endDate]);

    const handleDelete = async (id) => {
        const res = await OrderService.OrderDelete(id);
        if (res.code === 200) {
            setOrders((prevOrder) =>
                prevOrder.filter((order) => order._id !== id)
            );
            message.success("Xóa đơn hàng thành công!");
        } else {
            message.error("Xóa đơn hàng thất bại!");
        }
    };

    const handleChangeDate = (e) => {
        if (e) {
            setStartDate(new Date(e[0]?.$d));
            setEndDate(new Date(e[1]?.$d));
            const result = [];
            for (const order of orders) {
                const date = new Date(order.createdAt);
                if (date > startDate && date < endDate) {
                    result.push(order);
                }
            }
            setOrders(result);
        }
    };

    const onSearchChange = async (e) => {
        const val = e.target.value;
        setSearch(val);
        setCurrentPage(1);
    };

    // Lọc đơn hàng theo tìm kiếm
    const filteredOrders = orders.filter((order) => {
        const searchLower = search.toLowerCase();
        const customerName = order.infoUser?.name?.toLowerCase() || "";
        const customerPhone = order.infoUser?.phone?.toLowerCase() || "";
        const status = translateStatus(order.status)?.toLowerCase() || "";

        return (
            customerName.includes(searchLower) ||
            customerPhone.includes(searchLower) ||
            status.includes(searchLower)
        );
    });

    // Tính toán các đơn hàng hiển thị trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="order-admin">
            {permissions.includes("order_view") ? (
                <>
                    <div className="order-admin__header">
                        <h2>Quản lý đơn hàng</h2>
                    </div>
                    <div className="order-admin__search">
                        <Input
                            placeholder="Tìm kiếm theo tên, số điện thoại, trạng thái..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={onSearchChange}
                            style={{ width: 400, marginRight: 30 }}
                        />
                        <RangePicker onChange={handleChangeDate} />
                    </div>
                    <div className="order-grid">
                        {/* Header */}
                        <Row className="order-grid-header" gutter={0}>
                            <Col span={1}>
                                <b>STT</b>
                            </Col>
                            <Col span={3}>
                                <b>Tên khách hàng</b>
                            </Col>
                            <Col span={3}>
                                <b>Số điện thoại</b>
                            </Col>
                            <Col span={2} style={{ textAlign: 'center' }}>
                                <b>Tổng tiền</b>
                            </Col>
                            <Col span={2}>
                                <b>Số lượng SP</b>
                            </Col>
                            <Col span={3}>
                                <b>Ngày mua</b>
                            </Col>
                            <Col span={3}>
                                <b>Phương thức TT</b>
                            </Col>
                            <Col span={2}>
                                <b>Trạng thái</b>
                            </Col>
                            <Col span={5}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {orders.length === 0 ? (
                            <Row
                                className="order-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có đơn hàng.</Col>
                            </Row>
                        ) : (
                            currentOrders.map((item, index) => (
                                <Row
                                    className="order-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={1}>{startIndex + index + 1}</Col>
                                    <Col span={3}>
                                        <span
                                            style={{
                                                cursor: 'pointer',
                                                color: '#000000ff'
                                            }}
                                            onClick={() => navigate(`/admin/order/detail/${item._id}`)}
                                        >
                                            {item.infoUser?.name}
                                        </span>
                                    </Col>
                                    <Col span={3}>{item.infoUser?.phone}</Col>
                                    <Col span={2} style={{ textAlign: 'right', paddingRight: '20px' }}>{formatPrice(item.totalPrice)}</Col>
                                    <Col span={2}>{getTotalQuantity(item.product)}</Col>
                                    <Col span={3}>
                                        {formatDate(item.createdAt)}
                                    </Col>
                                    <Col span={3}>{translatePayment(item.payment) || ""}</Col>
                                    <Col span={2}>{translateStatus(item.status) || ""}</Col>
                                    <Col span={5}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/order/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        {permissions.includes("order_edit") ? (
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/order/edit/${item._id}`
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
                                            "order_deleted"
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
                    <div className="order-admin__pagination">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredOrders.length}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`}
                        />
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

export default OrderAdmin;
