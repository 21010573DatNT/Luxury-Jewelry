const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product_id: String,
                name: String,
                image:String,
                amount: Number,
                price:Number
            }
        ],
        user_id: String
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;