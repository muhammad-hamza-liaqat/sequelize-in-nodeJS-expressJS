const Sequelize = require("sequelize");
const orderModel = require("../models/orderModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { v4: uuidv4 } = require("uuid");
const path = require('path');


module.exports = async function getOrderData(req, res) {
  try {
    const { startDate, endDate } = req.query;

    // Fetch data from the database
    const data = await orderModel.findAll({
      where: {
        orderDate: {
          [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    // Generate a unique ID for the CSV file
    const fileId = uuidv4();
    // const csvFilePath = `../uploads/${fileId}.csv`;
    const csvFilePath = path.join(__dirname, '../uploads', `${fileId}.csv`);


    // Extract header from the first instance in the data array
    const header = Object.keys(data.length > 0 ? data[0].dataValues : {});

    // Write data to CSV file
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: header,
    });

    await csvWriter.writeRecords(data);

    res.json({
      fileId: fileId,
      message: "Data saved to CSV",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
