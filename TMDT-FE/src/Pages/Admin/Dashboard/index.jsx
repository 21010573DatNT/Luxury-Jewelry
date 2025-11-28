import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    DatePicker,
    Space,
    Table,
    Tag,
    Select,
    Progress,
    List,
    Avatar,
    Spin,
} from "antd";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";
import {
    ShoppingCart,
    DollarSign,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Star,
    CreditCard,
    ArrowUpRight,
    Box,
} from "lucide-react";
import * as DashboardService from "../../../Services/dashboardService";
import "./Dashboard.scss";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminDashboard = () => {
    // States cho dữ liệu
    const [stats, setStats] = useState(null);
    const [revenueChart, setRevenueChart] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowProducts, setLowProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [inventory, setInventory] = useState(null);
    const [customerStats, setCustomerStats] = useState(null);
    const [reviewStats, setReviewStats] = useState(null);
    const [categoryStats, setCategoryStats] = useState([]);

    // States cho filters
    const [period, setPeriod] = useState("all"); // Default: hiển thị tất cả
    const [dateRange, setDateRange] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load tất cả dữ liệu
    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Tạo params chung cho TẤT CẢ API
            const filterParams = {};

            if (dateRange && dateRange.length === 2) {
                // Custom date range
                filterParams.startDate = dateRange[0].format("YYYY-MM-DD");
                filterParams.endDate = dateRange[1].format("YYYY-MM-DD");
            } else {
                // Predefined period
                filterParams.period = period || "month";
            }

            console.log("🔍 Loading dashboard with filters:", filterParams);

            // Gọi TẤT CẢ API với cùng filterParams
            const [
                statsRes,
                revenueRes,
                topProductsRes,
                lowProductsRes,
                recentOrdersRes,
                inventoryRes,
                customerRes,
                reviewRes,
                categoryRes
            ] = await Promise.all([
                DashboardService.getStats(filterParams).catch(err => {
                    console.error("Error loading stats:", err);
                    return { data: null };
                }),
                DashboardService.getRevenueChart(filterParams).catch(err => {
                    console.error("Error loading revenue chart:", err);
                    return { data: [] };
                }),
                DashboardService.getTopProducts({
                    ...filterParams,
                    limit: 10,
                    type: "best-selling"
                }).catch(err => {
                    console.error("Error loading top products:", err);
                    return { data: [] };
                }),
                DashboardService.getTopProducts({
                    ...filterParams,
                    limit: 10,
                    type: "low-performance"
                }).catch(err => {
                    console.error("Error loading low products:", err);
                    return { data: [] };
                }),
                DashboardService.getRecentOrders({
                    ...filterParams,
                    limit: 5
                }).catch(err => {
                    console.error("Error loading recent orders:", err);
                    return { data: [] };
                }),
                DashboardService.getInventory(filterParams).catch(err => {
                    console.error("Error loading inventory:", err);
                    return { data: null };
                }),
                DashboardService.getCustomerStats(filterParams).catch(err => {
                    console.error("Error loading customer stats:", err);
                    return { data: null };
                }),
                DashboardService.getReviewStats(filterParams).catch(err => {
                    console.error("Error loading review stats:", err);
                    return { data: null };
                }),
                DashboardService.getProductCategoryStats(filterParams).catch(err => {
                    console.error("Error loading category stats:", err);
                    return { data: [] };
                })
            ]);

            // Set data với fallback values
            const statsData = statsRes.data || {
                revenue: { total: 0, byPayment: {} },
                orders: { total: 0, byStatus: { waiting: 0, shipping: 0, finish: 0, refund: 0 }, averageValue: 0, completionRate: 0 },
                customers: { total: 0, newThisMonth: 0 },
                products: { total: 0 }
            };
            statsData.hasRealData = statsData.orders && statsData.orders.total > 0;

            setStats(statsData);
            setRevenueChart(revenueRes.data || []);
            setTopProducts(topProductsRes.data || []);
            setLowProducts(lowProductsRes.data || []);
            setRecentOrders(recentOrdersRes.data || []);
            setInventory(inventoryRes.data);
            setCustomerStats(customerRes.data);
            setReviewStats(reviewRes.data);
            setCategoryStats(categoryRes.data || []);

            console.log("✅ Dashboard data loaded successfully");
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            // Set default data để không bị loading mãi
            setStats({
                revenue: { total: 0, byPayment: {} },
                orders: { total: 0, byStatus: { waiting: 0, shipping: 0, finish: 0, refund: 0 }, averageValue: 0, completionRate: 0 },
                customers: { total: 0, newThisMonth: 0 },
                products: { total: 0 }
            });
            setRevenueChart([]);
            setTopProducts([]);
            setLowProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, dateRange]);

    // Format số tiền
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    // Màu cho biểu đồ - màu sáng hài hòa
    const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"];

    if (loading || !stats) {
        return (
            <div style={{ textAlign: "center", padding: "100px" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                    <Text>Đang tải dữ liệu dashboard...</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} className="dashboard-title">
                            Thống Kê Doanh Thu - Luxury Jewelry
                        </Title>
                    </Col>
                    <Col>
                        <Space size="middle">
                            <Select
                                value={period}
                                onChange={(value) => {
                                    setPeriod(value);
                                    setDateRange(null); // Clear date range when selecting period
                                }}
                                style={{ width: 150 }}
                                placeholder="Chọn khoảng thời gian"
                            >
                                <Option value="all">Tất cả</Option>
                                <Option value="today">Hôm nay</Option>
                                <Option value="week">7 ngày qua</Option>
                                <Option value="month">Tháng này</Option>
                                <Option value="year">Năm nay</Option>
                            </Select>
                            <RangePicker
                                value={dateRange}
                                onChange={(dates) => {
                                    setDateRange(dates);
                                    if (dates) {
                                        setPeriod(null); // Clear period when selecting custom range
                                    }
                                }}
                                format="DD/MM/YYYY"
                                placeholder={["Từ ngày", "Đến ngày"]}
                            />
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* ===== SECTION 1: Thống kê tổng quan ===== */}
            <Row gutter={[16, 16]} className="stats-overview">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card stat-card-revenue">
                        <div className="stat-icon">
                            <DollarSign size={32} />
                        </div>
                        <Statistic
                            title="Tổng doanh thu"
                            value={stats.revenue.total}
                            formatter={(value) => value.toLocaleString('vi-VN')}
                        />
                        <div className="stat-footer">
                            <ArrowUpRight size={16} color="#52c41a" />
                            <Text type="success">Doanh thu tích luỹ</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card stat-card-orders">
                        <div className="stat-icon">
                            <ShoppingCart size={32} />
                        </div>
                        <Statistic
                            title="Tổng đơn hàng"
                            value={stats.orders.total}
                        />
                        <div className="stat-footer">
                            <Text>
                                Hoàn thành: {stats.orders.completionRate}%
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card stat-card-customers">
                        <div className="stat-icon">
                            <Users size={32} />
                        </div>
                        <Statistic
                            title="Khách hàng"
                            value={stats.customers.total}
                        />
                        <div className="stat-footer">
                            <Text>Mới: {stats.customers.newThisMonth}</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card stat-card-products">
                        <div className="stat-icon">
                            <Package size={32} />
                        </div>
                        <Statistic
                            title="Sản phẩm"
                            value={stats.products.total}
                        />
                        <div className="stat-footer">
                            <Text>Đang hoạt động</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* ===== SECTION 2: Thống kê đơn hàng chi tiết ===== */}
            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24} lg={6}>
                    <Card title="📦 Trạng thái đơn hàng" className="order-status-card">
                        <div className="order-status-item">
                            <div className="status-info">
                                <Tag color="gold">Chờ xử lý</Tag>
                                <Text strong>{stats.orders.byStatus.waiting}</Text>
                            </div>
                            <Progress
                                percent={
                                    ((stats.orders.byStatus.waiting / stats.orders.total) * 100) || 0
                                }
                                showInfo={false}
                                strokeColor="#faad14"
                            />
                        </div>

                        <div className="order-status-item">
                            <div className="status-info">
                                <Tag color="blue">Đang giao</Tag>
                                <Text strong>{stats.orders.byStatus.shipping}</Text>
                            </div>
                            <Progress
                                percent={
                                    ((stats.orders.byStatus.shipping / stats.orders.total) * 100) || 0
                                }
                                showInfo={false}
                                strokeColor="#1890ff"
                            />
                        </div>

                        <div className="order-status-item">
                            <div className="status-info">
                                <Tag color="green">Hoàn thành</Tag>
                                <Text strong>{stats.orders.byStatus.finish}</Text>
                            </div>
                            <Progress
                                percent={
                                    ((stats.orders.byStatus.finish / stats.orders.total) * 100) || 0
                                }
                                showInfo={false}
                                strokeColor="#52c41a"
                            />
                        </div>

                        <div className="order-status-item">
                            <div className="status-info">
                                <Tag color="red">Đổi Trả</Tag>
                                <Text strong>{stats.orders.byStatus.refund}</Text>
                            </div>
                            <Progress
                                percent={
                                    ((stats.orders.byStatus.refund / stats.orders.total) * 100) || 0
                                }
                                showInfo={false}
                                strokeColor="#ff4d4f"
                            />
                        </div>

                        <div className="order-summary">
                            <Text type="secondary">Giá trị TB/đơn:</Text>
                            <Text strong>
                                {Math.round(stats.orders.averageValue).toLocaleString('vi-VN')}
                            </Text>
                        </div>

                        {stats.orders.highestOrder && (
                            <div className="order-summary">
                                <Text type="secondary">Đơn cao nhất:</Text>
                                <Text strong>
                                    {stats.orders.highestOrder.totalPrice.toLocaleString('vi-VN')}
                                </Text>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={18}>
                    <Card title="📈 Biểu đồ doanh thu" className="revenue-chart-card">
                        <ResponsiveContainer width="100%" height={450}>
                            <AreaChart data={revenueChart}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey={revenueChart[0]?.date ? "date" : "month"}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1890ff"
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* ===== SECTION 3: Doanh thu theo phương thức & Top sản phẩm ===== */}
            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24} lg={12}>
                    <Card title="💳 Doanh thu theo phương thức thanh toán" className="payment-method-card">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={Object.entries(stats.revenue.byPayment).map(([key, value], index) => ({
                                        name: key === "COD" ? "COD" : key,
                                        value: value,
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {Object.entries(stats.revenue.byPayment).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString('vi-VN')} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="payment-method-summary">
                            {Object.entries(stats.revenue.byPayment).map(([key, value], index) => (
                                <div key={key} className="payment-item">
                                    <div className="payment-label">
                                        <div
                                            className="payment-color"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <Text>{key === "COD" ? "Thanh toán khi nhận" : key}</Text>
                                    </div>
                                    <Text strong>{value.toLocaleString('vi-VN')}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="📦 Tồn kho sản phẩm theo loại" className="category-inventory-card">
                        {inventory && inventory.byCategory && (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={Object.entries(inventory.byCategory).map(([key, value]) => ({
                                        name: key,
                                        stock: value.totalStock
                                    }))}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="name"
                                            style={{ fontSize: '14px', fontWeight: 500 }}
                                        />
                                        <YAxis
                                            style={{ fontSize: '14px' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'white',
                                                border: '1px solid #f0f0f0',
                                                borderRadius: '8px',
                                                padding: '12px'
                                            }}
                                        />
                                        <Bar
                                            dataKey="stock"
                                            fill="#1890ff"
                                            radius={[8, 8, 0, 0]}
                                            maxBarSize={80}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="payment-method-summary" style={{ marginTop: 16 }}>
                                    {Object.entries(inventory.byCategory).map(([key, value], index) => (
                                        <div key={key} className="payment-item">
                                            <div className="payment-label">
                                                <div
                                                    className="payment-color"
                                                    style={{ backgroundColor: '#1890ff' }}
                                                />
                                                <Text>{key}</Text>
                                            </div>
                                            <Text strong>{value.totalStock} sản phẩm</Text>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* ===== SECTION 4: Thống kê sản phẩm chi tiết ===== */}
            {inventory && (
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={24}>
                        <Card title="📦 Thống kê sản phẩm chi tiết" className="product-stats-card">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8} lg={4}>
                                    <Card className="inventory-card inventory-card-total">
                                        <Statistic
                                            title="Tổng sản phẩm"
                                            value={inventory.overview.total}
                                            valueStyle={{ color: '#3b82f6' }}
                                            prefix={<Package size={20} />}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={4}>
                                    <Card className="inventory-card inventory-card-selling">
                                        <Statistic
                                            title="Đang bán"
                                            value={inventory.overview.inStock}
                                            valueStyle={{ color: '#10b981' }}
                                            prefix={<Package size={20} />}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={4}>
                                    <Card className="inventory-card inventory-card-low">
                                        <Statistic
                                            title="Sắp hết (≤10)"
                                            value={inventory.overview.lowStock}
                                            valueStyle={{ color: '#f59e0b' }}
                                            prefix={<AlertCircle size={20} />}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={4}>
                                    <Card className="inventory-card inventory-card-out">
                                        <Statistic
                                            title="Hết hàng"
                                            value={inventory.overview.outOfStock}
                                            valueStyle={{ color: '#ef4444' }}
                                            prefix={<TrendingDown size={20} />}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={4}>
                                    <Card className="inventory-card inventory-card-old">
                                        <Statistic
                                            title="Tồn lâu >6 tháng"
                                            value={inventory.oldStock.count}
                                            valueStyle={{ color: '#8b5cf6' }}
                                            prefix={<Box size={20} />}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={4}>
                                    <Card className="inventory-card inventory-card-bestseller">
                                        <Statistic
                                            title="Bán chạy nhất"
                                            value={topProducts.length > 0 ? topProducts[0].totalSold : 0}
                                            valueStyle={{ color: '#ec4899' }}
                                            prefix={<Star size={20} />}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* ===== SECTION 5: Top sản phẩm & Danh mục ===== */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="🏆 Top 5 sản phẩm bán chạy nhất">
                        <List
                            itemLayout="horizontal"
                            dataSource={topProducts.slice(0, 5)}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <div className="product-rank">
                                                <Text strong>{index + 1}</Text>
                                            </div>
                                        }
                                        title={<Text strong>{item.name}</Text>}
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">
                                                    Đã bán: {item.totalSold} sản phẩm
                                                </Text>
                                                <Text strong style={{ color: '#10b981' }}>
                                                    {item.totalRevenue.toLocaleString('vi-VN')}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                    {item.image && (
                                        <Avatar src={item.image} size={64} shape="square" />
                                    )}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="⚠️ Top 5 sản phẩm bán chậm ">
                        <List
                            itemLayout="horizontal"
                            dataSource={lowProducts.slice(0, 5)}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <div className="product-rank low-rank">
                                                <Text>{index + 1}</Text>
                                            </div>
                                        }
                                        title={<Text>{item.name}</Text>}
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">
                                                    Chỉ bán: {item.totalSold} sp
                                                </Text>
                                                <Text type="secondary">
                                                    {item.totalRevenue.toLocaleString('vi-VN')}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                    {item.image && (
                                        <Avatar src={item.image} size={64} shape="square" />
                                    )}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ===== SECTION 6: Thống kê theo danh mục ===== */}
            {categoryStats && categoryStats.length > 0 && (
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={24}>
                        <Card title="📊 Thống kê theo danh mục sản phẩm">
                            <Table
                                dataSource={categoryStats}
                                rowKey="id"
                                columns={[
                                    {
                                        title: 'Danh mục',
                                        dataIndex: 'title',
                                        key: 'title',
                                        align: 'center',
                                        render: (text) => <Text strong>{text}</Text>
                                    },
                                    {
                                        title: 'Số sản phẩm',
                                        dataIndex: 'totalProducts',
                                        key: 'totalProducts',
                                        align: 'center',
                                        render: (value) => <Tag color="blue">{value}</Tag>
                                    },
                                    {
                                        title: 'Tồn kho',
                                        dataIndex: 'totalStock',
                                        key: 'totalStock',
                                        align: 'center',
                                        render: (value) => <Tag color="green">{value}</Tag>
                                    },
                                    {
                                        title: 'Đã bán',
                                        dataIndex: 'totalSold',
                                        key: 'totalSold',
                                        align: 'center',
                                        render: (value) => <Tag color="orange">{value}</Tag>
                                    },
                                    {
                                        title: 'Doanh thu',
                                        dataIndex: 'revenue',
                                        key: 'revenue',
                                        align: 'center',
                                        render: (value) => <Text strong style={{ color: '#10b981' }}>{value.toLocaleString('vi-VN')}</Text>
                                    },
                                ]}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* ===== SECTION 7: Thống kê khách hàng chi tiết ===== */}
            {customerStats && (
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={24}>
                        <Card title="👥 Thống kê khách hàng chi tiết">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8}>
                                    <Card className="customer-segment-card">
                                        <Statistic
                                            title="Tổng khách hàng"
                                            value={customerStats.total}
                                            prefix={<Users size={20} />}
                                            valueStyle={{ color: '#3b82f6' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Card className="customer-segment-card">
                                        <Statistic
                                            title="Khách mới tháng này"
                                            value={customerStats.newThisMonth}
                                            prefix={<TrendingUp size={20} />}
                                            valueStyle={{ color: '#10b981' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Card className="customer-segment-card">
                                        <Statistic
                                            title="Tỷ lệ quay lại"
                                            value={customerStats.returningRate}
                                            suffix="%"
                                            prefix={<Star size={20} />}
                                            valueStyle={{ color: '#f59e0b' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                                <Col xs={24} sm={12} md={8}>
                                    <Card className="customer-segment-card">
                                        <Statistic
                                            title="Khách VIP"
                                            value={customerStats.vipCustomers.length}
                                            prefix={<Star size={20} />}
                                            valueStyle={{ color: '#ec4899' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Card className="customer-behavior-card">
                                        <Statistic
                                            title="Khách mua 1 lần"
                                            value={customerStats.segments.oneTime}
                                            valueStyle={{ color: '#64748b' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Card className="customer-behavior-card">
                                        <Statistic
                                            title="Khách mua lặp lại"
                                            value={customerStats.segments.returning}
                                            valueStyle={{ color: '#10b981' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* ===== SECTION 8: Top khách hàng VIP & Mua nhiều nhất ===== */}
            {/* ===== SECTION 8: Top khách hàng VIP & Mua nhiều nhất ===== */}
            {customerStats && customerStats.vipCustomers.length > 0 && (
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={12}>
                        <Card title="💎 Top khách hàng chi tiêu cao">
                            <List
                                itemLayout="horizontal"
                                dataSource={customerStats.vipCustomers.slice(0, 5)}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    style={{
                                                        backgroundColor: '#faad14',
                                                        fontWeight: 'bold',
                                                        color: 'white'
                                                    }}
                                                >
                                                    {index + 1}
                                                </Avatar>
                                            }
                                            title={<Text strong>{item.name}</Text>}
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text type="secondary">
                                                        Email: {item.email}
                                                    </Text>
                                                    <Text strong style={{ color: '#10b981' }}>
                                                        Tổng chi: {item.totalRevenue.toLocaleString('vi-VN')}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                        <Star size={24} fill="#faad14" color="#faad14" />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title="🛍️ Top khách hàng mua nhiều nhất">
                            <List
                                itemLayout="horizontal"
                                dataSource={customerStats.vipCustomers
                                    .sort((a, b) => b.totalOrders - a.totalOrders)
                                    .slice(0, 5)}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    style={{
                                                        backgroundColor: '#1890ff',
                                                        fontWeight: 'bold',
                                                        color: 'white'
                                                    }}
                                                >
                                                    {index + 1}
                                                </Avatar>
                                            }
                                            title={<Text strong>{item.name}</Text>}
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text type="secondary">
                                                        Email: {item.email}
                                                    </Text>
                                                    <Text strong style={{ color: '#3b82f6' }}>
                                                        Số đơn hàng: {item.totalOrders}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                        <ShoppingCart size={24} color="#3b82f6" />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* ===== SECTION 9: Đơn hàng gần đây & Top sản phẩm yêu thích ===== */}
            <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="📋 Đơn hàng gần đây" className="recent-orders-card">
                        {recentOrders && recentOrders.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={recentOrders.slice(0, 5)}
                                renderItem={(order, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <div style={{
                                                    width: 40,
                                                    height: 40,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: order.status === 'finish' ? '#52c41a' :
                                                        order.status === 'shipping' ? '#1890ff' :
                                                            order.status === 'waiting' ? '#faad14' : '#ff4d4f',
                                                    borderRadius: '50%',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    <Text strong style={{ color: 'white' }}>
                                                        {index + 1}
                                                    </Text>
                                                </div>
                                            }
                                            title={<Text strong>{order.customerName || 'Khách hàng'}</Text>}
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text type="secondary">
                                                        {order.productCount || 0} sản phẩm
                                                    </Text>
                                                    <Text strong style={{ color: '#52c41a' }}>
                                                        {(order.totalPrice || 0).toLocaleString('vi-VN')}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                        <Space direction="vertical" align="end">
                                            <Tag color={
                                                order.status === 'finish' ? 'green' :
                                                    order.status === 'shipping' ? 'blue' :
                                                        order.status === 'waiting' ? 'orange' : 'red'
                                            }>
                                                {order.status === 'finish' ? 'Hoàn thành' :
                                                    order.status === 'shipping' ? 'Đang giao' :
                                                        order.status === 'waiting' ? 'Chờ xử lý' : 'Đã hủy'}
                                            </Tag>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                            </Text>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Text type="secondary">Chưa có đơn hàng nào</Text>
                            </div>
                        )}
                    </Card>
                </Col>

                {reviewStats && (
                    <Col xs={24} lg={12}>
                        <Card title="🌟 Top sản phẩm được yêu thích nhất" className="top-products-card">
                            <List
                                itemLayout="horizontal"
                                dataSource={reviewStats.topRated.slice(0, 6)}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    style={{ backgroundColor: '#fbbf24' }}
                                                    icon={<Star />}
                                                />
                                            }
                                            title={<Text strong>{item.title}</Text>}
                                            description={
                                                <Space>
                                                    <Text type="secondary">
                                                        {item.averageRating} ⭐
                                                    </Text>
                                                    <Text type="secondary">
                                                        ({item.totalReviews} đánh giá)
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default AdminDashboard;
