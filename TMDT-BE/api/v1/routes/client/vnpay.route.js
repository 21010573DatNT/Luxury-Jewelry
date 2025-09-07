const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/vnpay.controller");

router.post("/create_payment_url", controller.createPaymentUrl);

router.get("/payment-result", controller.paymentReturn);

router.get("/vnpay_ipn", controller.ipnHandler);

module.exports = router;