const Sequelize = require("sequelize");
const orderModel = require("../models/orderModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs").promises;
const csvtojson = require("csvtojson");
const json2csv = require("json2csv").Parser;
const PDFDocument = require('pdfkit');
const Bull = require("bull");

// bull queue
const fileQueue = new Bull('fileQueue');
async function getOrderData(req, res) {
  // try{
  //   const {startDate, endDate} = req.query;
  //   const result = await bullServices.addToQueue(startDate, endDate);
  //   res.json(result);
  // } catch(error){
  //   res.status(500).json({message: "internal server error"});
  // }

  try {
    const { startDate, endDate } = req.query;

    const data = await orderModel.findAll({
      where: {
        orderDate: {
          [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

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
  }
    
   catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteFile = async (req, res) => {
  try {
    const { uuid } = req.params;
    const uploadsFolderPath = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadsFolderPath, `${uuid}.csv`);

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
      const csvFileContent = await fs.readFile(filePath, 'utf-8');
      const jsonArray = await csvtojson().fromString(csvFileContent);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${uuid}.pdf`);
      // pdfDoc.pipe(res);
      const fields = Object.keys(jsonArray[0]);
      const csvData = jsonArray.map(row => fields.map(field => row[field]).join(',')).join('\n');
      pdfDoc.text(csvData);
      pdfDoc.end();
      
      await fs.unlink(filePath);
      // console.log("File downloaded and deleted!");

      res.status(200).json({ message: "File downloaded and deleted!" });
    } else {
      res.status(404).json({
        message: "File not found",
      });
    }
  } catch (error) {
    // console.error("Error downloading and deleting file:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// adding bull process...
fileQueue.process(async job => {
  const { uuid } = job.data;
  await deleteFile({ params: { uuid } }, { status: () => {}, json: () => {} });
});


module.exports = {
  getOrderData,
  deleteFile
};
