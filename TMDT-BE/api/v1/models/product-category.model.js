const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
    {
        title: String,
        position: Number,
        thumbnail: String,
        quantity: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true, 
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
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const ProductCategory = mongoose.model(
    "ProductCategory",
    productCategorySchema,
    "products-catgeory"
);

module.exports = ProductCategory;
