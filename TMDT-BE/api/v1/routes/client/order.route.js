const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/order.controller");


router.get("/", controller.getOrder)

router.get("/refund", controller.getRefundProduct)

router.get("/new", controller.getNewOrder)

router.get("/search", controller.searchOrder)

router.post("/paypal-transaction-complete", controller.paypalComplete);

router.post("/cash-on-delivery", controller.cashOnDelivery);

router.get("/:userId", controller.getOrderOfUser)

router.get("/detail/:order_id", controller.getOrderDetail)

router.patch("/edit/:order_id", controller.getOrderEdit)

router.delete("/delete/:order_id", controller.getOrderDelete)

module.exports = router;