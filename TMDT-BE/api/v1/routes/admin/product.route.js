const express = require("express")
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
const uploadToCloudinary = require("../../../../middleware/cloudinary.middleware")

router.get("/", controller.index)

router.get("/count", controller.count)

router.get("/popular", controller.popular)

router.patch("/stock", controller.updateStock)

router.get("/detail/:id", controller.detail)

router.patch("/change-status/:id", controller.changeStatus)

router.post("/create", uploadToCloudinary, controller.create)

router.patch("/edit/:id", controller.edit)

router.delete("/delete/:id", controller.delete)

router.get("/recommend", controller.recommend)

router.post("/comment/:product_id", controller.comment)

router.get("/search", controller.search)

module.exports = router;