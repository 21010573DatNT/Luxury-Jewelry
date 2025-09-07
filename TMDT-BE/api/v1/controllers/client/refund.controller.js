const Refund = require("../../models/refund.model");
const Order = require("../../models/order.model");
const {sendMail} = require('../../../../helpers/sendMail');

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
module.exports.SendMail = async(req,res) => {
    const { to, subject, text } = req.body;
    try {
        sendMail(to,subject,text)
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

        const dayjs = require("dayjs");

        const startOfDay = dayjs(purchaseDate).startOf("day").toDate();
        const endOfDay = dayjs(purchaseDate).endOf("day").toDate();

        const order = await Order.findOne({
            "infoUser.email": email,
            "infoUser.phone": phone,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });
        let products = [];
        for (const productId of productIds) {
            for (const product of order.product) {
                if (product.product_id === productId){
                    products.push(product);
                }
            }
        }

        purchaseDate = Date(purchaseDate);
        const refund = new Refund({
            ...req.body,
            products: products,
            images: req.body.images,
            purchaseDate: purchaseDate,
            status: "Refunding",
        });

        await refund.save();

        res.status(200).json({
            refund,
        });
    } catch (error) {
        res.status(500).json({
            message: console.log(error),
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
            code:200,
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
