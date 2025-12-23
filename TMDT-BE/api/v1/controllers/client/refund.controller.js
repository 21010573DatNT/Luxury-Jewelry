const Refund = require("../../models/refund.model");
const Order = require("../../models/order.model");
const { sendMail } = require('../../../../helpers/sendMail');

//[GET] /api/vi/client/refund
module.exports.getRefund = async (req, res) => {
    try {
        const refunds = await Refund.find();
        if (refunds) {
            res.status(200).json({
                refunds,
            });
        } else {
            res.status(400).json({
                message: "Không thấy dữ liệu",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: console.log(error),
        });
    }
};

//[GET] /api/vi/client/refund/:refund_id
module.exports.RefundDetail = async (req, res) => {
    try {
        const refund = await Refund.findById(req.params.refund_id);
        if (refund) {
            res.status(200).json({
                refund,
            });
        } else {
            res.status(400).json({
                message: "Không thấy dữ liệu",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: console.log(error),
        });
    }
};

//[POST] /api/vi/client/refund/send-email
module.exports.SendMail = async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        sendMail(to, subject, text)
        res.json({ success: true, message: "Email sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Send mail failed", error: error.message });
    }
}

//[POST] /api/vi/client/refund/create
module.exports.postRefund = async (req, res) => {
    try {
        let { email, phone, purchaseDate, productIds } = req.body;

        if (!email || !phone || !purchaseDate || !Array.isArray(productIds)) {
            return res.status(400).json({ message: "Thiếu thông tin hoặc sản phẩm không hợp lệ" });
        }

        const dayjs = require("dayjs");
        const utc = require("dayjs/plugin/utc");
        const timezone = require("dayjs/plugin/timezone");
        dayjs.extend(utc);
        dayjs.extend(timezone);

        const tz = "Asia/Ho_Chi_Minh";
        const startOfDay = dayjs.tz(purchaseDate, tz).startOf("day").utc().toDate();
        const endOfDay = dayjs.tz(purchaseDate, tz).endOf("day").utc().toDate();

        // Lấy tất cả đơn hoàn thành trong ngày (không dùng fallback)
        const orders = await Order.find({
            "infoUser.email": email,
            "infoUser.phone": phone,
            status: "finish",
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        }).lean();

        if (!orders || orders.length === 0) {
            return res.status(400).json({ message: "Không có đơn hàng trong ngày đó" });
        }

        // Chặn trùng lặp: nếu sản phẩm đã có yêu cầu hoàn trả trong ngày
        const existingRefunds = await Refund.find({
            email,
            phone,
            purchaseDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        }).lean();
        const alreadyRefunded = new Set();
        for (const rf of existingRefunds) {
            for (const p of (rf.products || [])) {
                if (p && p.product_id) alreadyRefunded.add(p.product_id);
            }
        }
        const duplicateIds = productIds.filter((id) => alreadyRefunded.has(id));
        if (duplicateIds.length > 0) {
            return res.status(400).json({ message: "Sản phẩm đã được yêu cầu hoàn trả trước đó" });
        }

        // Gom các sản phẩm tương ứng với productIds từ nhiều đơn
        const products = [];
        const productIdSet = new Set(productIds);
        for (const o of orders) {
            for (const p of (o.product || [])) {
                if (productIdSet.has(p.product_id)) {
                    products.push({ ...p, order_id: o._id, orderCreatedAt: o.createdAt });
                }
            }
        }

        // Chuẩn hóa purchaseDate lưu theo Date
        const purchaseDateStored = new Date(purchaseDate);

        const refund = new Refund({
            ...req.body,
            products,
            images: req.body.images,
            purchaseDate: purchaseDateStored,
            status: "Refunding",
        });

        await refund.save();

        res.status(200).json({
            refund
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi hệ thống",
            error: String(error),
        });
    }
};

//[PATCH] /api/vi/client/refund/edit/:refund_id
module.exports.RefundEdit = async (req, res) => {
    try {
        const refund = await Refund.updateOne(
            {
                _id: req.params.refund_id,
            },
            req.body
        );
        res.status(200).json({
            code: 200,
            refund,
        });
    } catch (error) {
        res.status(500).json({
            message: console.log(error),
        });
    }
};

//[PATCH] /api/vi/client/refund/delete/:refund_id
module.exports.RefundDelete = async (req, res) => {
    try {
        const { refund_id } = req.params;
        await Refund.deleteOne({
            _id: refund_id,
        });
        res.status(200).json({
            code: 200,
            message: "Xóa thành công",
        });
    } catch (error) {
        res.status(500).json({
            message: console.log(error),
        });
    }
};
