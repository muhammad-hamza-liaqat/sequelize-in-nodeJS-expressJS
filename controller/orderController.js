const Sequelize = require("sequelize");
const orderModel = require("../models/orderModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

async function getOrderData(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const data = await orderModel.findAll({
      where: {
        orderDate: {
          [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    // console.log("Fetched data:", data);

    const header = Object.keys(orderModel.getAttributes());

    const fileId = uuidv4();
    const csvFilePath = path.join(__dirname, "../uploads", `${fileId}.csv`);

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
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteFile = async (req, res) => {
  try {
    const { uuid } = req.params;
    const filePath = path.join(__dirname, "../uploads", `${uuid}.csv`);

    // Log the file path before checking
    console.log("Checking file path:", filePath);

    // Checking if the file exists or not
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      // Using fs.promises.unlink to make the operation asynchronous
      await fs.promises.unlink(filePath);

      res.json({
        message: "File deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "File not found",
      });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getOrderData,
  deleteFile,
};

module.exports = {
  getOrderData,
  deleteFile,
};
