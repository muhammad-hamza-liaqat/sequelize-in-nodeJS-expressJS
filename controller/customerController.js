const { Model } = require("sequelize");
// adding the more model 
const CustomerModel = require("../models/customerModel");
const EmployeeModel = require("../models/employeeModel");
const OfficeModel = require("../models/officeModel");
const OrderModel = require("../models/orderModel");
const OrderDetailModel = require("../models/orderDetails");
const ProductModel = require("../models/productModel");
const ProductLineModel = require("../models/productLineModel");
const PaymentModel = require("../models/paymentModel");

const PDFDocument = require('pdfkit');
const fs = require('fs');

const customerDetails = async (req, res) => {
  try {
    const { customerNumber } = req.params;

    const customerPayments = await CustomerModel.findOne({
      where: { customerNumber },
      include: [{ model: PaymentModel, attributes: ['paymentDate', 'amount'] }],
    });

    if (customerPayments) {
      const pdfDoc = new PDFDocument();

      // Set response headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename=customer_details.pdf');
      res.setHeader('Content-Type', 'application/pdf');

      // Pipe the PDF content directly to the response
      pdfDoc.pipe(res);

      // Add content to the PDF
      pdfDoc.text(`Customer Number: ${customerPayments.customerNumber}`);
      pdfDoc.text(`Customer Name: ${customerPayments.customerName}`);
      pdfDoc.text(`Sales Rep Employee Number: ${customerPayments.salesRepEmployeeNumber}`);
      pdfDoc.text(`Credit Limit: ${customerPayments.creditLimit}`);

      if (customerPayments.Payments && customerPayments.Payments.length > 0) {
        pdfDoc.text('Payments:');
        customerPayments.Payments.forEach(payment => {
          pdfDoc.text(`- Payment Date: ${payment.paymentDate}, Amount: ${payment.amount}`);
        });
      } else {
        pdfDoc.text('No payments found.');
      }

      // Finalize the PDF and end the response
      pdfDoc.end();
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error - customerController" });
  }
};

module.exports = customerDetails;
