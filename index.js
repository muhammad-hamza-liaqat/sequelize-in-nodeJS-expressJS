const express = require("express");
const app = express();
const connection = require("./database/connection")
const ordersR = require("./routes/orderRoute")


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/orders',ordersR)


app.listen(3000, ()=>{
    console.log("server running")
})

// http://localhost:3000/orders/getdata?startDate=2003-01-01&endDate=2003-03-31 => api end point