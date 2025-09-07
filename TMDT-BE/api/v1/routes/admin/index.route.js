const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const accountRoutes = require("./account.route");
const roleRoutes = require("./role.route");

module.exports = (app) => {
    const PATH_API = "/api/v1/admin";

    app.use(PATH_API + "/products", productRoutes)

    app.use(PATH_API + "/product-category", productCategoryRoutes)

    app.use(PATH_API + "/accounts", accountRoutes)

    app.use(PATH_API + "/roles", roleRoutes)
}