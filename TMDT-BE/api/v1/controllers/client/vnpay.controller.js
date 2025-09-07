const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const Order = require("../../models/order.model");

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
// Tạo link thanh toán VNPAY
module.exports.createPaymentUrl = async (req, res) => {
    const newOrder = new Order(req.body)

    await newOrder.save()
    process.env.TZ = "Asia/Ha_Noi";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    let config = require("../../../../config/default.json");

    let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    let orderId = moment(date).format("DDHHmmss");
    let amount = newOrder.totalPrice;


    let locale = "vn";
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + newOrder._id;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    if(vnpUrl){
        res.json({
            code: 200,
            vnpUrl
        })
    } else {
        res.json({
            code:500,
            Message: "Lỗi hệ thống"
        })
    }
};

// Nhận kết quả redirect từ VNPAY
module.exports.paymentReturn = async (req, res) => {
    let vnp_Params = req.query;

    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa hash khỏi params để so sánh
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp params theo thứ tự từ điển
    vnp_Params = sortObject(vnp_Params);

    const tmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const signed = crypto
        .createHmac("sha512", secretKey)
        .update(Buffer.from(signData, 'utf-8'))
        .digest("hex");

    if (secureHash === signed) {
        // TODO: Kiểm tra dữ liệu đơn hàng trong DB (vnp_Params['vnp_TxnRef'], 'vnp_ResponseCode'...)

        return res.status(200).json({
            success: true,
            message: 'Xác thực thành công',
            data: {
                vnp_ResponseCode: vnp_Params['vnp_ResponseCode'],
                vnp_Amount: vnp_Params['vnp_Amount'],
                vnp_TxnRef: vnp_Params['vnp_TxnRef']
            }
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Sai chữ ký hash',
            code: '97'
        });
    }
};

// Nhận IPN từ VNPAY
module.exports.ipnHandler = async (req, res) => {
    console.log("IPN received:", req.query);
    res.json({ RspCode: "00", Message: "Confirm Success" });
};
