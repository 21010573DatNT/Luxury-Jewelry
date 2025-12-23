const Order = require("../../models/order.model");
const Refund = require("../../models/refund.model");
const sendMail = require("../../../../helpers/sendMail");
const orderEmailHelper = require("../../../../helpers/orderEmail.helper");

//[POST] /api/v1/client/order/paypal-transaction-complete
module.exports.paypalComplete = async (req, res) => {
    const order = new Order(req.body);
    await order.save();

    // Debug: Log agreeMarketing value
    console.log("🔍 PayPal - agreeMarketing value:", req.body.agreeMarketing);
    console.log("🔍 PayPal - agreeMarketing type:", typeof req.body.agreeMarketing);

    // Send order confirmation email ONLY if customer agreed to marketing
    if (req.body.agreeMarketing === true && req.body.infoUser && req.body.infoUser.email) {
        try {
            const emailData = {
                infoUser: req.body.infoUser,
                product: req.body.product || [],
                totalPrice: req.body.totalPrice || 0,
                orderID: order._id,
                payment: req.body.payment || 'PayPal',
                status: req.body.status || 'waiting'
            };
            const emailHtml = orderEmailHelper.generateOrderConfirmationEmail(emailData);
            const subject = `✅ Xác nhận đơn hàng #${order._id} - Luxury Jewelry`;
            sendMail.sendMail(req.body.infoUser.email, subject, emailHtml);
            console.log("✅ PayPal - Email sent successfully to:", req.body.infoUser.email);
        } catch (error) {
            console.log("❌ PayPal - Error sending email:", error);
            // Continue without failing the order
        }
    } else {
        console.log("⏭️ PayPal - Email NOT sent (agreeMarketing is false or email missing)");
    }

    res.status(200).json({
        code: 200,
        message: "Lưu thông tin đơn hàng thành công",
    });
};

//[POST] /api/v1/client/order/cash-on-delivery
module.exports.cashOnDelivery = async (req, res) => {
    const order = new Order(req.body);
    await order.save();

    // Debug: Log agreeMarketing value
    console.log("🔍 COD - agreeMarketing value:", req.body.agreeMarketing);
    console.log("🔍 COD - agreeMarketing type:", typeof req.body.agreeMarketing);

    // Send order confirmation email ONLY if customer agreed to marketing
    if (req.body.agreeMarketing === true && req.body.infoUser && req.body.infoUser.email) {
        try {
            const emailData = {
                infoUser: req.body.infoUser,
                product: req.body.product || [],
                totalPrice: req.body.totalPrice || 0,
                orderID: order._id,
                payment: req.body.payment || 'Cash-on-delivery',
                status: req.body.status || 'waiting'
            };
            const emailHtml = orderEmailHelper.generateOrderConfirmationEmail(emailData);
            const subject = `✅ Xác nhận đơn hàng #${order._id} - Luxury Jewelry`;
            sendMail.sendMail(req.body.infoUser.email, subject, emailHtml);
            console.log("✅ COD - Email sent successfully to:", req.body.infoUser.email);
        } catch (error) {
            console.log("❌ Error sending email:", error);
            // Continue without failing the order
        }
    } else {
        console.log("⏭️ COD - Email NOT sent (agreeMarketing is false or email missing)");
    }

    res.status(200).json({
        code: 200,
        message: "Lưu thông tin đơn hàng thành công",
    });
};

//[GET] /api/products/search
module.exports.searchOrder = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");

        const orders = await Order.find({
            "infoUser.name": { $regex: regex },
        })

        res.status(200).json({
            orders: orders,
        });
    } catch (error) {
        console.log(error);
    }
};


//[GET] /api/v1/client/order/new
module.exports.getNewOrder = async (req, res) => {
    try {
        const latestOrder = await Order.findOne().sort({ createdAt: -1 });

        if (!latestOrder) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng nào",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy đơn hàng mới nhất thành công",
            latestOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lội hệ thống",
        });
    }
};

//[GET] /api/v1/client/order/:userId
module.exports.getOrderOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const email = req.params.email;
        const phone = req.params.phone;
        let find = {};
        if (userId) {
            find = {
                userId: userId,
            };
        } else {
            find = {
                "infoUser.name": email,
                "infoUser.phone": phone,
            };
        }
        const listOrderUser = await Order.find(find);

        res.status(200).json({
            listOrderUser: listOrderUser,
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[GET] /api/v1/client/order/refund
module.exports.getRefundProduct = async (req, res) => {
    try {
        const { email, phone, purchaseDate } = req.query;

        if (!email || !phone || !purchaseDate) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        const dayjs = require("dayjs");
        const utc = require("dayjs/plugin/utc");
        const timezone = require("dayjs/plugin/timezone");
        dayjs.extend(utc);
        dayjs.extend(timezone);

        // Diễn giải purchaseDate theo múi giờ Việt Nam để khớp ngày người dùng chọn
        const tz = "Asia/Ho_Chi_Minh";
        const startOfDay = dayjs.tz(purchaseDate, tz).startOf("day").utc().toDate();
        const endOfDay = dayjs.tz(purchaseDate, tz).endOf("day").utc().toDate();

        // Lọc theo trạng thái hoàn thành
        const orders = await Order.find({
            "infoUser.email": email,
            "infoUser.phone": phone,
            status: "finish",
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        }).lean();

        if (orders && orders.length > 0) {
            // Lấy các sản phẩm đã được yêu cầu hoàn trả trong ngày để loại trừ
            const existingRefunds = await Refund.find({
                email,
                phone,
                purchaseDate: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            }).lean();

            const refundedSet = new Set();
            for (const rf of existingRefunds) {
                for (const p of (rf.products || [])) {
                    if (p && p.product_id) {
                        refundedSet.add(p.product_id);
                    }
                }
            }

            const products = orders.flatMap((o) =>
                (o.product || []).map((p) => ({
                    ...p,
                    order_id: o._id,
                    orderCreatedAt: o.createdAt,
                }))
            );

            const availableProducts = products.filter((p) => !refundedSet.has(p.product_id));

            if (availableProducts.length === 0) {
                return res.status(400).json({ message: "Không có đơn hàng" });
            }

            return res.status(200).json({ products: availableProducts });
        }

        return res.status(400).json({ message: "Không có đơn hàng trong ngày đó" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống", error: String(error) });
    }
};

//[GET] /api/v1/client/order
module.exports.getOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders) {
            res.status(400).json({
                message: "Chưa có đơn hàng",
            });
        } else {
            res.status(200).json({
                orders,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[GET] /api/v1/client/order/detail/:order_id
module.exports.getOrderDetail = async (req, res) => {
    try {
        const { order_id } = req.params;
        const order = await Order.findById(order_id);
        if (order) {
            res.status(200).json({
                order,
            });
        } else {
            res.status(400).json({
                message: "Đơn hàng không tồn tại",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[PATCH] /api/v1/client/order/edit/:order_id
module.exports.getOrderEdit = async (req, res) => {
    try {
        const { order_id } = req.params;
        const status = req.body.status;
        await Order.updateOne(
            { _id: order_id },
            {
                status: status,
            }
        );
        const order = await Order.findById(order_id);
        res.status(200).json({
            code: 200,
            message: "Cập nhật thành công",
            order,
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};

//[DELETE] /api/v1/client/order/delete/:order_id
module.exports.getOrderDelete = async (req, res) => {
    try {
        const { order_id } = req.params;
        await Order.deleteOne({ _id: order_id });
        res.status(200).json({
            code: 200,
            message: "Xóa đơn hàng thành công",
        });
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
};
