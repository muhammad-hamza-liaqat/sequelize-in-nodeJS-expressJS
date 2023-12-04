const fs = require("fs/promises");
const path = require("path");
const multer = require("multer");
const csvtojson = require("csvtojson");
const PDFDocument = require("pdfkit");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function mergeCSVsToPDF(req, res) {
  try {
    // console.log("Uploaded Files:", req.files);

    // File check
    if (!req.files || !req.files.csv1 || !req.files.csv2) {
      return res.status(400).send("Please upload both CSV files.");
    }

    // CSV to JSON conversion
    const csvToJsonOptions = {
      headers: [
        "orderNumber",
        "orderDate",
        "requiredDate",
        "shippedDate",
        "status",
        "comments",
        "customerNumber",
      ],
    };

    const json1 = await csvtojson(csvToJsonOptions).fromString(
      req.files.csv1[0].buffer.toString()
    );
    const json2 = await csvtojson(csvToJsonOptions).fromString(
      req.files.csv2[0].buffer.toString()
    );

    // console.log("JSON1:", json1);
    // console.log("JSON2:", json2);

    if (!json1 || !json2) {
      return res.status(500).send("Error converting CSV to JSON.");
    }

    // Create PDF content
    const pdfContent = await createPDFFromJSON(json1, json2);

    // Save the PDF
    let outputPath = path.resolve(__dirname, "../uploads/mergeFile.pdf");
    await fs.writeFile(outputPath, pdfContent);

    // Response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=merged.pdf");
    res.send(pdfContent);

    // Display the path of the file where it is saved
    console.log(
      "CSVs merged to PDF successfully and saved to this path in the server:",
      outputPath
    );
  } catch (error) {
    console.error("Error merging CSVs to PDF:", error.message);
    res.status(500).send("Internal Server Error - merging files");
  }
}

// Helper function to create a PDF content from JSON data
// chatgpt help
// format of the pdf here.
async function createPDFFromJSON(json1, json2) {
  const doc = new PDFDocument();

  // Add content to the PDF
  doc.fontSize(18).text("Merged PDF Report", { align: 'center' });

  // Add a space after the title
  doc.moveDown();
  // aading the logo
  const logoPath= path.resolve(__dirname, "../public/images/a4.jpg");
  doc.moveTo(0, 0);
  doc.image(logoPath, { width: 100, x: 50, y:50 });

  // doc.image(logoPath, { width: 100, align: "left", valign: "top" });
  doc.moveDown();


  // Add a table for JSON1
  addTableToPDF(doc, "<------------------------------------------------->", json1);


  // Add a space between tables
  doc.moveDown();

  // Add a table for JSON2
  addTableToPDF(doc, "<------------------------------------------------->", json2);


  // Generate the PDF buffer
  return new Promise((resolve) => {
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.end();
  });
}

function addTableToPDF(doc, title, jsonData) {
  // Set table headers
  const headers = Object.keys(jsonData[0]);

  // Set column widths
  const columnWidths = headers.map(() => 150); // Adjust the width based on your needs

  // Add table title
  doc.fontSize(16).text(title, { align: 'center' });
  doc.moveDown();

  // Draw table headers
  doc.fontSize(12).font('Helvetica-Bold').text(headers.join(" "), { align: 'center' });
  
  // Draw table rows
  jsonData.forEach((entry) => {
    const row = headers.map((header) => entry[header]);
    doc.fontSize(12).font('Helvetica').text(row.join(" "), { align: 'center' });
  });

  // Add space after the table
  doc.moveDown();
}


// Configure Multer to handle CSV file uploads
const csvUpload = upload.fields([
  { name: "csv1", maxCount: 1 },
  { name: "csv2", maxCount: 1 },
]);

module.exports = { mergeCSVsToPDF, csvUpload };