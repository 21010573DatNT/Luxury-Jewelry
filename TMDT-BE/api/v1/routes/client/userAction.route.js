const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user-action.controller");

router.post("/", controller.create);

module.exports = router;