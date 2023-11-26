const { Model } = require("sequelize");
const CustomerModel = require("../models/customerModel");
const PaymentModel = require("../models/paymentModel");
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');

const customerDetails = async (req, res) => {
  try {
    const { customerNumber } = req.params;

    const customerPayments = await CustomerModel.findOne({
      where: { customerNumber },
      raw: true,
      include: [{ model: PaymentModel, attributes: ['paymentDate', 'amount'] }],
    });

    if (customerPayments) {
      const paymentDates = customerPayments.Payments ? customerPayments.Payments.map(payment => payment.paymentDate).join(',') : '';
      const paymentAmounts = customerPayments.Payments ? customerPayments.Payments.map(payment => payment.amount).join(',') : '';

      const csvWriter = createObjectCsvWriter({
        path: 'customer_details.csv',
        header: [
          { id: 'customerNumber', title: 'Customer Number' },
          { id: 'customerName', title: 'Customer Name' },
          { id: 'contactLastName', title: 'Contact Last Name' },
          { id: 'contactFirstName', title: 'Contact First Name' },
          { id: 'phone', title: 'Phone' },
          { id: 'addressLine1', title: 'Address Line 1' },
          { id: 'addressLine2', title: 'Address Line 2' },
          { id: 'city', title: 'City' },
          { id: 'state', title: 'State' },
          { id: 'postalCode', title: 'Postal Code' },
          { id: 'country', title: 'Country' },
          { id: 'salesRepEmployeeNumber', title: 'Sales Rep Employee Number' },
          { id: 'creditLimit', title: 'Credit Limit' },
          { id: 'paymentDate', title: 'Payment Date' },
          { id: 'amount', title: 'Amount' },
        ],
      });

      const csvData = [
        {
          customerNumber: customerPayments.customerNumber,
          customerName: customerPayments.customerName,
          contactLastName: customerPayments.contactLastName,
          contactFirstName: customerPayments.contactFirstName,
          phone: customerPayments.phone,
          addressLine1: customerPayments.addressLine1,
          addressLine2: customerPayments.addressLine2,
          city: customerPayments.city,
          state: customerPayments.state,
          postalCode: customerPayments.postalCode,
          country: customerPayments.country,
          salesRepEmployeeNumber: customerPayments.salesRepEmployeeNumber,
          creditLimit: customerPayments.creditLimit,
          paymentDate: paymentDates,
          amount: paymentAmounts,
        },
      ];

      await csvWriter.writeRecords(csvData);
      const fileStream = fs.createReadStream('customer_details.csv');

      res.setHeader('Content-Disposition', 'attachment; filename=customer_details.csv');
      res.setHeader('Content-Type', 'text/csv');

      fileStream.pipe(res);
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error - customerController" });
  }
};

module.exports = customerDetails;
