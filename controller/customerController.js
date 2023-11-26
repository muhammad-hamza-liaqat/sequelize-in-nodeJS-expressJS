const { Model } = require("sequelize");
const CustomerModel = require("../models/customerModel");
const PaymentModel = require("../models/paymentModel");

const customerDetails = async (req, res) => {
  try {
    const customerPayments = await CustomerModel.findAll({
      raw: true,
      //   include: [{ model: PaymentModel }],
      logging: console.log,
    });

    console.log("details", customerPayments);
    res.json(customerPayments); 
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Internal Server Error - customerController" });
  }
};

module.exports = customerDetails;