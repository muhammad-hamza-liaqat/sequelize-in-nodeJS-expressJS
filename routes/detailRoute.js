const express = require('express');
const app = express();
const detailRoutes = express.Router();
const customerDetail = require("../controller/customerController")

detailRoutes.route('/customer/:customerNumber')
.get((req,res)=>{
    res.end("customer end point!")
})
.post(customerDetail)

module.exports = detailRoutes;