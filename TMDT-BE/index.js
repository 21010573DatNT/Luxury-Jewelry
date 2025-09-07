const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const database = require("./config/database");
const routeAdmin = require("./api/v1/routes/admin/index.route");
const routeClient = require("./api/v1/routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));



routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
})
