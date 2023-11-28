const { Model } = require("sequelize");
// adding the more model
const CustomerModel = require("../models/customerModel");
const EmployeeModel = require("../models/employeeModel");
const OfficeModel = require("../models/officeModel");
const OrderModel = require("../models/orderModel");
const OrderDetailsModel = require("../models/orderDetails");
const ProductModel = require("../models/productModel");
const ProductLineModel = require("../models/productLineModel");
const PaymentModel = require("../models/paymentModel");
// additional paramaters

const PDFDocument = require("pdfkit");
const fs = require("fs");

const customerDetails = async (req, res) => {
  try {
    const { customerNumber } = req.params;

    const customerPayments = await CustomerModel.findOne({
      where: { customerNumber },
      include: [
        {
          model: PaymentModel,
          attributes: ["paymentDate", "amount"],
        },
        {
          model: OrderModel,
          attributes: ["orderDate", "shippedDate", "status"],
          include: [
            {
              model: OrderDetailsModel,
              attributes: ["quantityOrdered"],
              include: [
                {
                  model: ProductModel,
                  attributes: ["productName"],
                },
              ],
            },
          ],
        },
      ],
    });
    console.log(customerPayments);

    if (customerPayments) {
      const pdfDoc = new PDFDocument();

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=customer_details.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");

      pdfDoc.pipe(res);

      // Add content to the PDF
      pdfDoc.text(`Customer Number: ${customerPayments.customerNumber}`);
      pdfDoc.text(`Customer Name: ${customerPayments.customerName}`);
      pdfDoc.text(
        `Sales Rep Employee Number: ${customerPayments.salesRepEmployeeNumber}`
      );
      pdfDoc.text(`Credit Limit: ${customerPayments.creditLimit}`);
      pdfDoc.text(`order status: ${OrderModel.status}`);

      for (let i = 0; i < customerPayments.orders.length; i++) {
        const order = customerPayments.orders[i];
        pdfDoc.text(
          `Order Date: ${order.orderDate}, Shipped Date: ${order.shippedDate}, Status: ${order.status}`
        );
        if (order) {
          pdfDoc.text("Order Details:");
          order.orderdetails.forEach((orderDetail) => {
            pdfDoc.text(`- Quantity Ordered: ${orderDetail.quantityOrdered}`);
            pdfDoc.text(`- Product Name: ${orderDetail.product.productName}`);
          });
        } else {
          pdfDoc.text(`No order details found for this order ID`);
        }
      }

      console.log(customerPayments.orders);

      // Finalize the PDF and end the response
      pdfDoc.end();
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Internal Server Error - customerController" });
  }
};

module.exports = customerDetails;
