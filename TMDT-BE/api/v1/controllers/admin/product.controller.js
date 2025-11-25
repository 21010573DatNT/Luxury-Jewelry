const Product = require("../../models/product.model");
const paginationHelper = require("../../../../helpers/pagination.helper");
const searchHelper = require("../../../../helpers/search.helper");
const axios = require("axios");

// [GET] /api/v1/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    if (req.query.material) {
        find.material = req.query.material;
    }

    if (req.query.productCategory) {
        find.product_category_id = req.query.productCategory;
    }

    if (req.query.priceRange) {
        const priceRange = req.query.priceRange.split("-");
        find.price = {
            $gte: parseInt(priceRange[0]),
            $lte: parseInt(priceRange[1]),
        };
    }
    // Search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    // Search

    //Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 9,
    };

    const countProducts = await Product.countDocuments(find);

    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countProducts
    );
    //Pagination

    // Sort

    let sort = {};

    if (req.query.sort) {
        const keysort = req.query.sort.split("-");
        sort[keysort[0]] = keysort[1] === "asc" ? 1 : -1;
    }
    // Sort
    let products = await Product.find(find).sort(sort);
    if (req.query.page) {
        products = await Product.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);
    }

    res.json({
        code: 200,
        products,
    });
};

//[GET] /api/v1/products/count
module.exports.count = async (req, res) => {
    try {
        const { category_id, material, priceRange, sort } = req.query;

        // Build filter object
        let filter = { deleted: false };

        if (category_id) {
            filter.product_category_id = category_id;
        }

        if (material) {
            filter.material = material;
        }

        if (priceRange) {
            const [min, max] = priceRange.split("-").map(Number);
            filter.price = { $gte: min, $lte: max };
        }

        const count = await Product.countDocuments(filter);

        res.status(200).json({
            count: count,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error counting products",
        });
    }
};

//[GET] /api/v1/products/popular
module.exports.popular = async (req, res) => {
    try {
        const productFeatured = await Product.find({
            featured: "1",
        });
        if (productFeatured) {
            res.status(200).json({
                productFeatured,
            });
        } else {
            res.status(400).json({
                message: "Không có sản phẩm nào nổi bật",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// [GET] /api/v1/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false,
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Không tìm thấy" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

//[PATCH] /api/v1/products/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Product.updateOne(
            {
                _id: id,
            },
            {
                status: status,
            }
        );

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại",
        });
    }
};

//[PATCH] /api/v1/admin/products/stock
module.exports.updateStock = async (req, res) => {
    try {
        const productsBuy = req.body;
        let hasError = false;

        for (const productBuy of productsBuy) {
            const result = await Product.updateOne(
                { _id: productBuy.product_id },
                { $inc: { stock: -productBuy.amount } }
            );

            if (result.modifiedCount === 0) {
                hasError = true;
                throw new Error(
                    `Cập nhật stock thất bại cho sản phẩm ${productBuy.product_id}`
                );
            }
        }

        if (!hasError) {
            res.json({
                code: 200,
                message: "Cập nhật stock thành công",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
        });
    }
};

//[POST] /api/v1/products/create

module.exports.create = async (req, res) => {
    try {
        const count = await Product.countDocuments();

        if (req.body.position) {
            req.body.position = count + 1;
        }


        const product = new Product({
            images: req.body.images || [],
            thumbnail: req.body.images && req.body.images.length > 0 ? req.body.images[0] : "",
            ...req.body,
        });

        const data = await product.save();

        res.json({
            code: 200,
            message: "Tạo sản phẩm thành công",
            data: data,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: error,
        });
        console.log(error);
    }
};

//[PATCH] /api/v1/products/edit/:id

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;


        // Nếu có images mới, cập nhật cả images và thumbnail
        const updateData = { ...req.body };
        if (req.body.images && req.body.images.length > 0) {
            updateData.images = req.body.images;
            updateData.thumbnail = req.body.images[0];
        }
        await Product.updateOne(
            {
                _id: id,
            },
            updateData
        );

        res.json({
            code: 200,
            message: "Cập nhật sản phẩm thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật sản phẩm thất bại",
        });
    }
};

//[DELETE] /api/v1/products/delete/:id

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Product.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
            }
        );

        res.json({
            code: 200,
            message: "Xoá sản phẩm thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xoá sản phẩm thất bại",
        });
    }
};

// [GET] /api/v1/products/recommend
module.exports.recommend = async (req, res) => {
    try {
        const userId = req.query.userId;
        const currentProductId = req.query.currentProductId;
        let products = [];
        let productIds = [];

        try {
            const response = await axios.get(
                `http://localhost:5001/recommend?user_id=${userId}`
            );
            productIds = response.data?.products || [];
        } catch (err) {
            console.warn("Không gọi được AI recommend:", err.message);
        }
        if (productIds.length > 0) {
            products = await Product.find({
                _id: { $in: productIds },
                deleted: false,
            });
        } else {
            const currentProduct = await Product.findOne({
                _id: currentProductId,
                deleted: false,
            });
            if (currentProduct) {
                products = await Product.find({
                    _id: { $ne: currentProductId },
                    product_category_id: currentProduct.product_category_id,
                    deleted: false,
                })
                    .sort({ rate_total: -1 })
                    .limit(4);
            }
        }

        res.json({ code: 200, products });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống AI" });
    }
};

//[POST] /api/v1/products/comment/:product_id
module.exports.comment = async (req, res) => {
    try {
        const product_id = req.params.product_id;
        const data = req.body;

        const comment = {
            user_id: data.user_id,
            userName: data.userName,
            comment: data.comment,
            rate: data.rate,
            createDate: data.createDate,
        };

        await Product.updateOne(
            { _id: product_id },
            {
                $push: { comments: comment },
            }
        );

        const product = await Product.findById(product_id);

        let rateTotal = 0;
        let cntComment = 0;

        product.comments.forEach((comment) => {
            rateTotal += comment.rate;
            cntComment += 1;
        });

        rateTotal = rateTotal / cntComment;

        await Product.updateOne(
            { _id: product_id },
            {
                rate_total: rateTotal,
            }
        );

        res.status(200).json({
            message: "Thêm comment thành công",
            product: product,
        });
    } catch (error) {
        console.log(error);
    }
};

//[GET] /api/products/search
module.exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");

        const products = await Product.find({
            title: { $regex: regex },
            deleted: false,
        }).limit(10);

        res.status(200).json({
            products: products,
        });
    } catch (error) {
        console.log(error);
    }
};
