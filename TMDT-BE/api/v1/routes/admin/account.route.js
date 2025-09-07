const express = require("express")
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index)

router.get("/detail/:id", controller.detail)

router.post("/create", controller.create)

router.patch("/edit/:id", controller.edit)

router.delete("/delete/:id", controller.delete)

router.post("/login", controller.loginAdmin)

module.exports = router;