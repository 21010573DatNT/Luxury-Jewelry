const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: "",
    },
    color: String,
    material: String,
    stone: String,
    sex: String,
    description: String,
    price: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    rate_total: Number,
    featured: String,
    position: Number,
    comments:[
        {   
            user_id: String,
            userName: String,
            comment: String,
            rate: Number,
            createDate: { type: Date, default: Date.now }
        }
    ],
    slug: {
        type: String,
        slug: "title",
        unique: true, //check slug không bị trùng
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedBy: {
        account_id: String,
        deletedBy: Date,
    },
    updatedBy: [
        {
            account_id: String,
            updatedBy: Date,
        },
    ],
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
