const Sequelize = require("sequelize");
const orderModel = require("../models/orderModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs").promises;
// const { addJob } = require("../services/enqueueJobs")
const csvtojson = require("csvtojson");
const json2csv = require("json2csv").Parser;

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
    const uploadsFolderPath = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadsFolderPath, `${uuid}.csv`);

    // console.log("Checking file path:", filePath);

    let fileExists;
    try {
      await fs.stat(filePath);
      fileExists = true;
    } catch (error) {
      if (error.code === "ENOENT") {
        fileExists = false;
      } else {
        throw error;
      }
    }

    if (fileExists) {
      const csvFileContent = await fs.readFile(filePath, "utf-8");
      const jsonArray = await csvtojson().fromString(csvFileContent);

      const fields = Object.keys(jsonArray[0]);
      const json2csvParser = new json2csv({ fields });
      const csvData = json2csvParser.parse(jsonArray);

      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename=${uuid}.pdf`);

      // res.send(csvData);
      res.send(
        `<a href="data:application/octet-stream;base64,${Buffer.from(
          csvData
        ).toString("base64")}" download="${uuid}.pdf">Download File</a>`
      );

      await fs.unlink(filePath);
      console.log("file downloaded and deleted!")      
    } else {
      res.status(404).json({
        message: "File not found",
      });
    }
  } catch (error) {
    console.error("Error downloading and deleting file:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getOrderData,
  deleteFile,
};
