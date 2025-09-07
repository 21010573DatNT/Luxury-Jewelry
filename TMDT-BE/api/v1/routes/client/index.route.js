const userRoutes = require("./user.route");
const orderRoutes = require("./order.route")
const cartRoutes = require("./cart.route")
const userActionRoutes = require("./userAction.route");
const refundRoutes = require("./refund.route")
const vnpayRoutes = require("./vnpay.route")

module.exports = (app) => {
    const PATH_API = "/api/v1/client";

    app.use(PATH_API + "/user", userRoutes)

    app.use(PATH_API + "/order", orderRoutes)

    app.use(PATH_API + "/cart", cartRoutes)

    app.use(PATH_API + "/user-action", userActionRoutes);

    app.use(PATH_API + "/refund", refundRoutes);

    app.use(PATH_API + "/vnpay", vnpayRoutes)

}