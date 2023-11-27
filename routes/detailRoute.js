const express = require('express');
const app = express();
const detailRoutes = express.Router();
const customerDetail = require("../controller/customerController")

detailRoutes.route('/customer/:customerNumber')
.get(customerDetail);

module.exports = detailRoutes;