const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Refund = require("../../models/refund.model");
const { createDateFilter } = require("../../../../helpers/dateFilter.helper");

// [GET] /api/v1/admin/dashboard/stats
module.exports.getStats = async (req, res) => {
    try {
        const dateFilter = createDateFilter(req);
        const now = new Date();

        // Lấy đơn hàng theo filter
        const filteredOrders = await Order.find({ deleted: false, ...dateFilter });

        // Tính tổng doanh thu
        const totalRevenue = filteredOrders
            .filter(order => order.status === 'finish')
            .reduce((sum, order) => sum + order.totalPrice, 0);

        // Tính doanh thu theo phương thức thanh toán
        const revenueByPayment = filteredOrders
            .filter(order => order.status === 'finish')
            .reduce((acc, order) => {
                const payment = order.payment || 'COD';
                if (!acc[payment]) acc[payment] = 0;
                acc[payment] += order.totalPrice;
                return acc;
            }, {});

        // Thống kê đơn hàng theo trạng thái
        const ordersByStatus = {
            waiting: filteredOrders.filter(o => o.status === 'waiting').length,
            shipping: filteredOrders.filter(o => o.status === 'shipping').length,
            finish: filteredOrders.filter(o => o.status === 'finish').length,
            refund: await Refund.countDocuments({ ...dateFilter })
        };

        // Tổng số đơn hàng
        const totalOrders = filteredOrders.length;

        // Giá trị trung bình mỗi đơn hàng
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Đơn hàng có giá trị cao nhất
        const highestOrder = filteredOrders.reduce((max, order) =>
            order.totalPrice > (max?.totalPrice || 0) ? order : max,
            null
        );

        // Tỷ lệ hoàn thành đơn hàng
        const completionRate = totalOrders > 0
            ? ((ordersByStatus.finish / totalOrders) * 100).toFixed(2)
            : 0;

        // Thống kê khách hàng
        const totalCustomers = await User.countDocuments({ deleted: false });

        // Khách hàng mới trong tháng
        const newCustomersThisMonth = await User.countDocuments({
            deleted: false,
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1)
            }
        });

        // Lấy số sản phẩm
        const totalProducts = await Product.countDocuments({ deleted: false });

        res.json({
            code: 200,
            message: "Thành công",
            data: {
                revenue: {
                    total: totalRevenue,
                    byPayment: revenueByPayment
                },
                orders: {
                    total: totalOrders,
                    byStatus: ordersByStatus,
                    averageValue: averageOrderValue,
                    highestOrder: highestOrder,
                    completionRate: parseFloat(completionRate)
                },
                customers: {
                    total: totalCustomers,
                    newThisMonth: newCustomersThisMonth
                },
                products: {
                    total: totalProducts
                }
            }
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/revenue-chart
module.exports.getRevenueChart = async (req, res) => {
    try {
        const { period } = req.query;
        const dateFilter = createDateFilter(req);
        const now = new Date();
        let chartData = [];

        // Nếu có filter custom, tính theo ngày trong khoảng đó
        if (req.query.startDate && req.query.endDate) {
            const start = new Date(req.query.startDate);
            const end = new Date(req.query.endDate);
            const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

            for (let i = 0; i < diffDays; i++) {
                const date = new Date(start);
                date.setDate(date.getDate() + i);
                date.setHours(0, 0, 0, 0);

                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const orders = await Order.find({
                    deleted: false,
                    status: 'finish',
                    createdAt: {
                        $gte: date,
                        $lt: nextDate
                    }
                });

                const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

                chartData.push({
                    date: date.toISOString().split('T')[0],
                    revenue: revenue,
                    orders: orders.length
                });
            }
        } else if (period === 'daily' || period === 'today' || period === 'week') {
            // Doanh thu 30 ngày gần nhất
            const days = period === 'week' ? 7 : 30;
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const orders = await Order.find({
                    deleted: false,
                    status: 'finish',
                    createdAt: {
                        $gte: date,
                        $lt: nextDate
                    }
                });

                const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

                chartData.push({
                    date: date.toISOString().split('T')[0],
                    revenue: revenue,
                    orders: orders.length
                });
            }
        } else {
            // Mặc định: Doanh thu 12 tháng gần nhất
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

                const orders = await Order.find({
                    deleted: false,
                    status: 'finish',
                    createdAt: {
                        $gte: date,
                        $lt: nextMonth
                    }
                });

                const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

                chartData.push({
                    month: `${date.getMonth() + 1}/${date.getFullYear()}`,
                    revenue: revenue,
                    orders: orders.length
                });
            }
        }

        res.json({
            code: 200,
            message: "Thành công",
            data: chartData
        });
    } catch (error) {
        console.error("Error getting revenue chart:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/top-products
module.exports.getTopProducts = async (req, res) => {
    try {
        const { limit = 10, type = 'best-selling' } = req.query;
        const dateFilter = createDateFilter(req);

        const orders = await Order.find({
            deleted: false,
            status: 'finish',
            ...dateFilter
        });

        // Tổng hợp sản phẩm đã bán
        const productStats = {};

        orders.forEach(order => {
            order.product.forEach(item => {
                if (!productStats[item.product_id]) {
                    productStats[item.product_id] = {
                        product_id: item.product_id,
                        name: item.name,
                        image: item.image,
                        totalSold: 0,
                        totalRevenue: 0
                    };
                }
                productStats[item.product_id].totalSold += item.amount;
                productStats[item.product_id].totalRevenue += item.price * item.amount;
            });
        });

        // Chuyển đổi thành mảng và sắp xếp
        let productsArray = Object.values(productStats);

        if (type === 'best-selling') {
            // Sản phẩm bán chạy nhất
            productsArray.sort((a, b) => b.totalSold - a.totalSold);
        } else if (type === 'low-performance') {
            // Sản phẩm bán chậm
            productsArray.sort((a, b) => a.totalSold - b.totalSold);
        } else if (type === 'highest-revenue') {
            // Sản phẩm doanh thu cao nhất
            productsArray.sort((a, b) => b.totalRevenue - a.totalRevenue);
        }

        const topProducts = productsArray.slice(0, parseInt(limit));

        res.json({
            code: 200,
            message: "Thành công",
            data: topProducts
        });
    } catch (error) {
        console.error("Error getting top products:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/inventory
module.exports.getInventory = async (req, res) => {
    try {
        console.log("🔍 [INVENTORY] Start fetching...");
        const products = await Product.find({ deleted: false });
        console.log("📦 [INVENTORY] Products found:", products.length);
        const ProductCategory = require("../../models/product-category.model");
        const categories = await ProductCategory.find({ deleted: false });
        console.log("📂 [INVENTORY] Categories found:", categories.length);

        // Thống kê tồn kho
        const totalProducts = products.length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const inStock = products.filter(p => p.stock > 10).length;

        // Thống kê theo danh mục sản phẩm (nhẫn, dây chuyền, lắc tay, lắc chân)
        const byCategory = {};
        for (const product of products) {
            if (product.product_category_id) {
                const category = categories.find(c => c._id.toString() === product.product_category_id);
                const categoryName = category ? category.title : 'Khác';

                if (!byCategory[categoryName]) {
                    byCategory[categoryName] = { count: 0, totalStock: 0 };
                }
                byCategory[categoryName].count++;
                byCategory[categoryName].totalStock += product.stock || 0;
            }
        }
        console.log("🏷️ [INVENTORY] byCategory:", JSON.stringify(byCategory));

        // Thống kê theo màu sắc
        const byColor = products.reduce((acc, product) => {
            const color = product.color || 'Không xác định';
            if (!acc[color]) acc[color] = { count: 0, totalStock: 0 };
            acc[color].count++;
            acc[color].totalStock += product.stock || 0;
            return acc;
        }, {});

        // Thống kê theo chất liệu
        const byMaterial = products.reduce((acc, product) => {
            const material = product.material || 'Không xác định';
            if (!acc[material]) acc[material] = { count: 0, totalStock: 0 };
            acc[material].count++;
            acc[material].totalStock += product.stock || 0;
            return acc;
        }, {});

        // Sản phẩm tồn kho lâu (tạo từ 6 tháng trước trở lại)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const oldStock = products.filter(p =>
            p.createdBy?.createdAt &&
            new Date(p.createdBy.createdAt) < sixMonthsAgo &&
            p.stock > 0
        );

        res.json({
            code: 200,
            message: "Thành công",
            data: {
                overview: {
                    total: totalProducts,
                    inStock: inStock,
                    lowStock: lowStock,
                    outOfStock: outOfStock
                },
                byCategory: byCategory,
                byColor: byColor,
                byMaterial: byMaterial,
                oldStock: {
                    count: oldStock.length,
                    products: oldStock.slice(0, 10).map(p => ({
                        id: p._id,
                        title: p.title,
                        stock: p.stock,
                        createdAt: p.createdBy?.createdAt
                    }))
                }
            }
        });
        console.log("✅ [INVENTORY] Response sent successfully with byCategory");
    } catch (error) {
        console.error("❌ [INVENTORY] Error:", error);
        console.error("Error getting inventory:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/customers
module.exports.getCustomerStats = async (req, res) => {
    try {
        const dateFilter = createDateFilter(req);

        const users = await User.find({ deleted: false });
        const orders = await Order.find({
            deleted: false,
            status: 'finish',
            ...dateFilter
        });

        // Tính số đơn hàng cho từng khách hàng
        const customerOrderCount = {};
        const customerRevenue = {};

        orders.forEach(order => {
            const userId = order.userId;
            if (userId) {
                customerOrderCount[userId] = (customerOrderCount[userId] || 0) + 1;
                customerRevenue[userId] = (customerRevenue[userId] || 0) + order.totalPrice;
            }
        });

        // Khách hàng VIP (top 10 chi tiêu cao nhất)
        const vipCustomers = Object.entries(customerRevenue)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([userId, revenue]) => {
                const user = users.find(u => u._id.toString() === userId);
                return {
                    userId,
                    name: user?.fullName || 'N/A',
                    email: user?.email,
                    totalRevenue: revenue,
                    totalOrders: customerOrderCount[userId]
                };
            });

        // Top 10 khách hàng mua nhiều nhất (theo số đơn hàng)
        const topBuyers = Object.entries(customerOrderCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([userId, orderCount]) => {
                const user = users.find(u => u._id.toString() === userId);
                return {
                    userId,
                    name: user?.fullName || 'N/A',
                    email: user?.email,
                    totalOrders: orderCount,
                    totalRevenue: customerRevenue[userId] || 0
                };
            });

        // Tỷ lệ khách quay lại
        const returningCustomers = Object.values(customerOrderCount).filter(count => count > 1).length;
        const oneTimeCustomers = Object.values(customerOrderCount).filter(count => count === 1).length;
        const returningRate = users.length > 0
            ? ((returningCustomers / users.length) * 100).toFixed(2)
            : 0;

        // Khách hàng mới trong tháng
        const now = new Date();
        const newCustomersThisMonth = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt.getMonth() === now.getMonth() &&
                createdAt.getFullYear() === now.getFullYear();
        }).length;

        // Phân nhóm khách hàng
        const customerSegments = {
            oneTime: oneTimeCustomers,
            returning: returningCustomers,
            vip: vipCustomers.length
        };

        res.json({
            code: 200,
            message: "Thành công",
            data: {
                total: users.length,
                newThisMonth: newCustomersThisMonth,
                returningRate: parseFloat(returningRate),
                vipCustomers: vipCustomers,
                topBuyers: topBuyers,
                segments: customerSegments
            }
        });
    } catch (error) {
        console.error("Error getting customer stats:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/financial
module.exports.getFinancialStats = async (req, res) => {
    try {
        const orders = await Order.find({ deleted: false });
        const refunds = await Refund.find({});

        // Doanh thu từ đơn hàng hoàn thành
        const totalRevenue = orders
            .filter(o => o.status === 'finish')
            .reduce((sum, o) => sum + o.totalPrice, 0);

        // Chi phí vận chuyển (giả định 30,000đ mỗi đơn đang giao và đã hoàn thành)
        const shippingOrders = orders.filter(o =>
            o.status === 'shipping' || o.status === 'finish'
        );
        const shippingCost = shippingOrders.length * 30000;

        // Chi phí hoàn trả
        const refundCost = refunds.reduce((sum, refund) => {
            if (refund.products && Array.isArray(refund.products)) {
                return sum + refund.products.reduce((productSum, product) =>
                    productSum + (product.price || 0) * (product.amount || 1), 0
                );
            }
            return sum;
        }, 0);

        // Tổng chi phí
        const totalCosts = shippingCost + refundCost;

        // Lợi nhuận (giả định tỷ suất lợi nhuận 40% trên giá bán)
        const grossProfit = totalRevenue * 0.4;
        const netProfit = grossProfit - totalCosts;

        // Lợi nhuận theo kênh thanh toán
        const profitByPayment = orders
            .filter(o => o.status === 'finish')
            .reduce((acc, order) => {
                const payment = order.payment || 'COD';
                if (!acc[payment]) acc[payment] = 0;
                acc[payment] += order.totalPrice * 0.4; // 40% lợi nhuận
                return acc;
            }, {});

        res.json({
            code: 200,
            message: "Thành công",
            data: {
                revenue: totalRevenue,
                costs: {
                    shipping: shippingCost,
                    refund: refundCost,
                    total: totalCosts
                },
                profit: {
                    gross: grossProfit,
                    net: netProfit,
                    byPayment: profitByPayment
                }
            }
        });
    } catch (error) {
        console.error("Error getting financial stats:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/reviews
module.exports.getReviewStats = async (req, res) => {
    try {
        const dateFilter = createDateFilter(req);
        const products = await Product.find({ deleted: false });

        let totalReviews = 0;
        let totalRating = 0;
        let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        const productRatings = [];

        products.forEach(product => {
            if (product.comments && product.comments.length > 0) {
                // Filter comments by date if dateFilter exists
                let filteredComments = product.comments;
                if (dateFilter.createdAt) {
                    filteredComments = product.comments.filter(comment => {
                        const commentDate = new Date(comment.createdAt || comment.date);
                        if (dateFilter.createdAt.$gte && commentDate < dateFilter.createdAt.$gte) {
                            return false;
                        }
                        if (dateFilter.createdAt.$lte && commentDate > dateFilter.createdAt.$lte) {
                            return false;
                        }
                        return true;
                    });
                }

                filteredComments.forEach(comment => {
                    totalReviews++;
                    totalRating += comment.rate || 0;
                    ratingDistribution[comment.rate] = (ratingDistribution[comment.rate] || 0) + 1;
                });

                if (filteredComments.length > 0) {
                    // Tính điểm trung bình cho từng sản phẩm
                    const avgRating = filteredComments.reduce((sum, c) => sum + (c.rate || 0), 0) / filteredComments.length;

                    productRatings.push({
                        productId: product._id,
                        title: product.title,
                        averageRating: avgRating.toFixed(2),
                        totalReviews: filteredComments.length
                    });
                }
            }
        });

        // Sắp xếp sản phẩm theo đánh giá
        const topRatedProducts = productRatings
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 10);

        const lowRatedProducts = productRatings
            .sort((a, b) => a.averageRating - b.averageRating)
            .slice(0, 10);

        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : 0;

        res.json({
            code: 200,
            message: "Thành công",
            data: {
                total: totalReviews,
                averageRating: parseFloat(averageRating),
                distribution: ratingDistribution,
                topRated: topRatedProducts,
                lowRated: lowRatedProducts
            }
        });
    } catch (error) {
        console.error("Error getting review stats:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/product-category-stats
module.exports.getProductCategoryStats = async (req, res) => {
    try {
        const dateFilter = createDateFilter(req);
        const products = await Product.find({ deleted: false });
        const orders = await Order.find({
            deleted: false,
            status: 'finish',
            ...dateFilter
        });

        // Lấy thông tin danh mục
        const ProductCategory = require("../../models/product-category.model");
        const categories = await ProductCategory.find({ deleted: false });

        // Thống kê theo danh mục
        const categoryStats = {};

        categories.forEach(category => {
            categoryStats[category._id] = {
                id: category._id,
                title: category.title,
                totalProducts: 0,
                totalStock: 0,
                totalSold: 0,
                revenue: 0
            };
        });

        // Đếm sản phẩm và tồn kho theo danh mục
        products.forEach(product => {
            const catId = product.product_category_id;
            if (categoryStats[catId]) {
                categoryStats[catId].totalProducts++;
                categoryStats[catId].totalStock += product.stock || 0;
            }
        });

        // Tính số lượng bán và doanh thu theo danh mục
        orders.forEach(order => {
            order.product.forEach(item => {
                const product = products.find(p => p._id.toString() === item.product_id);
                if (product && product.product_category_id) {
                    const catId = product.product_category_id;
                    if (categoryStats[catId]) {
                        categoryStats[catId].totalSold += item.amount;
                        categoryStats[catId].revenue += item.price * item.amount;
                    }
                }
            });
        });

        const categoryArray = Object.values(categoryStats);

        res.json({
            code: 200,
            message: "Thành công",
            data: categoryArray
        });
    } catch (error) {
        console.error("Error getting product category stats:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /api/v1/admin/dashboard/recent-orders
module.exports.getRecentOrders = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const dateFilter = createDateFilter(req);

        const orders = await Order.find({
            deleted: false,
            ...dateFilter
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('userId', 'fullName email');

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderCode: order._id.toString().slice(-8).toUpperCase(),
            customerName: order.infoUser?.name || order.userId?.fullName || 'N/A',
            totalPrice: order.totalPrice,
            status: order.status,
            payment: order.payment,
            createdAt: order.createdAt,
            productCount: order.product?.length || 0
        }));

        res.json({
            code: 200,
            message: "Thành công",
            data: formattedOrders
        });
    } catch (error) {
        console.error("Error getting recent orders:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};
