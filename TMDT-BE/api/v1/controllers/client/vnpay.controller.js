const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const Order = require("../../models/order.model");
const config = require("../../../../config/default.json");

// Hàm sắp xếp Object đúng chuẩn VNPAY
function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    return sorted;
}

// -----------------------------
// TẠO LINK THANH TOÁN VNPAY
// -----------------------------
module.exports.createPaymentUrl = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();

        process.env.TZ = "Asia/Ho_Chi_Minh";

        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");

        const ipAddr =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress;

        const tmnCode = config.vnp_TmnCode;
        const secretKey = config.vnp_HashSecret;
        const vnpUrl = config.vnp_Url;
        const returnUrl = config.vnp_ReturnUrl;

        const orderId = moment(date).format("DDHHmmss");
        const amount = Math.round(Number(newOrder.totalPrice) * 100);

        const locale = "vn";
        const currCode = "VND";

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh toan cho ma GD:${newOrder._id}`,
            vnp_OrderType: "other",
            vnp_Amount: amount,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        vnp_Params = sortObject(vnp_Params);

        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;

        const paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

        return res.json({
            code: 200,
            vnpUrl: paymentUrl,
        });
    } catch (error) {
        console.error("Error creating payment URL:", error);
        return res.status(500).json({
            code: 500,
            message: "Lỗi hệ thống khi tạo link thanh toán",
        });
    }
};

// -----------------------------
// XỬ LÝ KHI NGƯỜI DÙNG ĐƯỢC REDIRECT VỀ TỪ VNPAY
// -----------------------------
module.exports.paymentReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        const secretKey = config.vnp_HashSecret;
        const signData = qs.stringify(vnp_Params, { encode: false });
        const signed = crypto
            .createHmac("sha512", secretKey)
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");

        if (secureHash === signed) {
            // TODO: kiểm tra đơn hàng thực tế trong DB nếu cần
            return res.status(200).json({
                success: true,
                message: "Xác thực thanh toán thành công",
                data: {
                    vnp_ResponseCode: vnp_Params["vnp_ResponseCode"],
                    vnp_Amount: vnp_Params["vnp_Amount"],
                    vnp_TxnRef: vnp_Params["vnp_TxnRef"],
                },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Sai chữ ký hash",
                code: "97",
            });
        }
    } catch (error) {
        console.error("Error in paymentReturn:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi xử lý phản hồi thanh toán",
        });
    }
};

// -----------------------------
// XỬ LÝ IPN (THÔNG BÁO TỰ ĐỘNG TỪ VNPAY)
// -----------------------------
module.exports.ipnHandler = async (req, res) => {
    try {
        console.log("IPN received:", req.query);
        res.json({ RspCode: "00", Message: "Confirm Success" });
    } catch (error) {
        console.error("Error handling IPN:", error);
        res.json({ RspCode: "99", Message: "Error" });
    }
};
