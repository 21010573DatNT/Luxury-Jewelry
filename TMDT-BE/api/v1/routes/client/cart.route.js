const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");


router.get("/:userId", controller.cart);

router.patch("/update/:userId", controller.update);

router.patch("/update_quantity/:userId", controller.updateQuantity)

router.delete("/delete/:userId", controller.delete);

router.delete("/delete/item_cart/:userId", controller.deleteItemCart);

module.exports = router;