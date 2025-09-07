const express = require("express")
const router = express.Router();
const controller = require("../../controllers/admin/product-category.controller");
const uploadToCloudinary = require("../../../../middleware/cloudinary.middleware")

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.get("/search", controller.search)

router.post("/create",uploadToCloudinary, controller.create);

router.patch("/edit/:id", uploadToCloudinary,controller.edit);

router.delete("/delete/:id", controller.delete);

module.exports = router;