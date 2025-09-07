import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, DatePicker, Space } from "antd";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts"; // Đảm bảo các import này có sẵn
import { ShoppingCart, DollarSign, Users, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as OrderService from "../../../Services/orderService";
import * as ProductService from "../../../Services/productService";
import * as UserService from "../../../Services/userService";

const { Title } = Typography;

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [categories, setCategory] = useState([]);
    const [products, setProduct] = useState([]);
    const [users, setUser] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const categoryGet = async () => {
        const res = await ProductService.productCategoryGet();
        setCategory(res);
    };

    const OrdersGet = async () => {
        const res = await OrderService.OrderGet();
        setOrders(res.orders);
        setFilteredOrders(res.orders);
    };

    const ProductsGet = async () => {
        const res = await ProductService.productGet();
        setProduct(res.products);
    };

    const UsersGet = async () => {
        const res = await UserService.UserGet();
        setUser(res.users);
    };

    // Hàm để lọc đơn hàng theo thời gian
    const handleDateFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            const filtered = orders.filter((order) => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= start && orderDate <= end;
            });
            setFilteredOrders(filtered);
        }
    };

    // Hàm để lấy 4 tháng gần nhất nếu không có filter
    const getLastFourMonths = () => {
        const months = [];
        const currentDate = new Date();
        
        // Lặp lại 4 lần để lấy các tháng gần nhất
        for (let i = 0; i < 4; i++) {
            const month = currentDate.getMonth() + 1 - i; // Lấy tháng hiện tại và lùi dần
            const year = currentDate.getFullYear();
            if (month <= 0) {
                // Nếu tháng là 0 hoặc âm, quay lại năm trước
                months.push(`${12 + month}-${year - 1}`);
            } else {
                months.push(`${month}-${year}`);
            }
        }

        return months.reverse(); // Đảm bảo mảng tháng theo thứ tự từ cũ nhất đến mới nhất
    };

    // Dữ liệu doanh thu theo tháng cho 4 tháng gần nhất
    const revenueData = getLastFourMonths().map((monthLabel) => {
        const monthRevenue = filteredOrders.reduce((total, order) => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = `${orderDate.getMonth() + 1}-${orderDate.getFullYear()}`;

            if (orderMonth === monthLabel) {
                return total + order.totalPrice;
            }
            return total;
        }, 0);

        return {
            name: monthLabel,
            revenue: monthRevenue,
        };
    });

    // Tính doanh thu tổng
    let revenueSale = 0;
    for (const order of filteredOrders) {
        revenueSale += order.totalPrice;
    }

    // Giới hạn số lượng đơn hàng hiển thị (10 đơn hàng gần nhất)
    const recentOrders = filteredOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp đơn hàng từ mới nhất đến cũ nhất
        .slice(0, 10); // Chỉ lấy 10 đơn hàng đầu tiên

    useEffect(() => {
        OrdersGet();
        categoryGet();
        ProductsGet();
        UsersGet();
    }, []);

    // Dữ liệu mẫu cho thống kê
    const statsData = {
        totalRevenue: revenueSale,
        totalOrders: orders.length,
        totalCustomers: users.length,
        totalProducts: products.length,
    };

    // Dữ liệu biểu đồ danh mục sản phẩm
    const categoryData = categories.map((category, index) => {
        const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];
        return {
            name: category.title,
            value: category.quantity,
            color: colors[index % colors.length], // Chọn màu tương ứng từ mảng colors
        };
    });

    useEffect(() => {
        OrdersGet();
        categoryGet();
    }, []);

    return (
        <div
            style={{
                padding: "24px",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title
                            level={2}
                            style={{ margin: 0, color: "#1a1a1a" }}
                        >
                            📊 Trang tổng quan
                        </Title>
                    </Col>
                </Row>
            </div>

            {/* Thống kê tổng quan */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={statsData.totalRevenue.toLocaleString()}
                            prefix={<DollarSign size={20} color="#52c41a" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng đơn hàng"
                            value={statsData.totalOrders}
                            prefix={<ShoppingCart size={20} color="#1890ff" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Khách hàng"
                            value={statsData.totalCustomers}
                            prefix={<Users size={20} color="#722ed1" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Sản phẩm"
                            value={statsData.totalProducts}
                            prefix={<Package size={20} color="#fa8c16" />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ doanh thu theo tháng */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} lg={16}>
                    <Card title="📈 Doanh thu theo tháng">
                        <Col style={{ marginBottom: 20 }}>
                            <Space>
                                {/* Chọn ngày bắt đầu và kết thúc */}
                                <DatePicker.RangePicker
                                    format="YYYY-MM-DD"
                                    onChange={handleDateFilter}
                                />
                            </Space>
                        </Col>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `${value / 1000000}M`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) => [
                                        value.toLocaleString(),
                                        "Doanh thu",
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1890ff"
                                    fill="url(#colorRevenue)"
                                />
                                <defs>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#1890ff"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#1890ff"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="🏷️ Phân bố danh mục">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Bảng và thống kê chi tiết */}
            <Card title="📦 Đơn hàng gần đây">
                <div className="order-grid">
                    <Row className="order-grid-header" gutter={0}>
                        <Col span={2}>
                            <b>STT</b>
                        </Col>
                        <Col span={5}>
                            <b>Tên khách hàng</b>
                        </Col>
                        <Col span={5}>
                            <b>Tổng tiền</b>
                        </Col>
                        <Col span={6}>
                            <b>Ngày mua</b>
                        </Col>
                        <Col span={6}>
                            <b>Trạng thái</b>
                        </Col>
                    </Row>

                    {recentOrders.length === 0 ? (
                        <Row
                            className="order-grid-row"
                            style={{ textAlign: "center" }}
                        >
                            <Col span={24}>Không có đơn hàng.</Col>
                        </Row>
                    ) : (
                        recentOrders.map((item, index) => (
                            <Row
                                className="order-grid-row"
                                key={item.key}
                                gutter={0}
                                align="middle"
                            >
                                <Col span={2}>{(index += 1)}</Col>
                                <Col span={5}>{item.infoUser?.name}</Col>
                                <Col span={5}>
                                    {item.totalPrice.toLocaleString()} đ
                                </Col>
                                <Col span={6}>
                                    {new Date(
                                        item.createdAt
                                    ).toLocaleDateString()}
                                </Col>
                                <Col span={6}>{item.status || ""}</Col>
                            </Row>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
