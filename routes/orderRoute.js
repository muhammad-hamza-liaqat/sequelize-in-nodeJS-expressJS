const express = require("express");
const app = express();

const orderRoutes = express.Router();
const { getOrderData, deleteFile } = require("../controller/orderController");


orderRoutes.route('/getdata')
.get(getOrderData);

orderRoutes.route('/getfile/:uuid')
.delete(deleteFile)


module.exports = orderRoutes