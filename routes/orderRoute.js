const express = require("express");
const app = express();

const orderRoutes = express.Router();
const getOrders = require("../controller/orderController");

orderRoutes.route('/getdata')
.get(getOrders);


module.exports = orderRoutes