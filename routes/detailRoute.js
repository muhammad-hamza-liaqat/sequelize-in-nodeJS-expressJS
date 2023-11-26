const express = require('express');
const app = express();
const detailRoutes = express.Router();
const customerDetails = require("../controller/customerController")

detailRoutes.route('/customer')
.get((req,res)=>{
    res.end("customer end point!")
})
.post(customerDetails)

module.exports = detailRoutes;