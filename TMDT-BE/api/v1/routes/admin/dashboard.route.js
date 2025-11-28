const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/dashboard.controller");

router.get("/stats", controller.getStats);
router.get("/revenue-chart", controller.getRevenueChart);
router.get("/top-products", controller.getTopProducts);
router.get("/recent-orders", controller.getRecentOrders);
router.get("/inventory", controller.getInventory);
router.get("/customers", controller.getCustomerStats);
router.get("/financial", controller.getFinancialStats);
router.get("/reviews", controller.getReviewStats);
router.get("/product-category-stats", controller.getProductCategoryStats);

module.exports = router;
