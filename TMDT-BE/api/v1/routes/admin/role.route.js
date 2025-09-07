const express = require("express")
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.roleGet)

router.get("/detail/:role_id", controller.roleDetail)

router.patch("/edit/:role_id", controller.roleEdit)

router.post("/create", controller.roleCreate)

router.delete("/delete/:role_id", controller.roleDelete)

module.exports = router;