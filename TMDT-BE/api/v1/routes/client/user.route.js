const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const authenticateToken = require("../../../../middleware/auth.middleware");

router.get("/", controller.userGet);

router.get("/search", controller.search)

router.get("/detail/:user_id", controller.detail);

router.patch("/edit/:user_id", controller.edit);

router.delete("/delete/:user_id", controller.delete);

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

router.patch("/update/:id", controller.update)

router.get("/profile/:id", authenticateToken, controller.profile);

router.post("/refresh_token", controller.refreshToken)

router.post("/password/forgot", controller.forgotPassword)

router.post("/password/otp", controller.otpPassword)

router.post("/password/reset/:user_id", controller.resetPassword) //sdas

module.exports = router;