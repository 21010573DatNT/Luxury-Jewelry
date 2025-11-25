const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderID: String,
        userId: String,
        infoUser: {
            name: String,
            address: String,
            phone: String,
            email: String,
            note: String,
        },
        product: [
            {
                product_id: String,
                name: String,
                amount: Number,
                price: Number,
                image: String,
            }
        ],
        status: String,
        totalPrice: Number,
        payment: String,
        txnRef: Date,
        agreeMarketing: {
            type: Boolean,
            default: false,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;