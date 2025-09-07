const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/refund.controller");
const uploadToCloudinary = require("../../../../middleware/cloudinary.middleware")

router.get("/", controller.getRefund)

router.post("/send-mail", controller.SendMail)

router.post("/create",uploadToCloudinary, controller.postRefund)

router.get("/detail/:refund_id", controller.RefundDetail)

router.patch("/edit/:refund_id", controller.RefundEdit)

router.delete("/delete/:refund_id", controller.RefundDelete)

module.exports = router;