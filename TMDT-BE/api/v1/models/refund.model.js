const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
    {
        customerName: String,
        email: String,
        phone: String,
        description: String,
        products: [],
        returnType: String,
        purchaseDate: Date,
        reason: String,
        images: [],
        status: String,
    },
    {
        timestamps: true,
    }
);

const Refund = mongoose.model("Refund", refundSchema, "refunds");

module.exports = Refund;