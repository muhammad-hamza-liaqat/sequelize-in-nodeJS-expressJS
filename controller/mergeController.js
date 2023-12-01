const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');
const csvtojson = require('csvtojson');
const PDFDocument = require('pdfkit');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function mergeCSVsToPDF(req, res) {
  try {
    console.log('Uploaded Files:', req.files);

    // File check
    if (!req.files || !req.files.csv1 || !req.files.csv2) {
      return res.status(400).send('Please upload both CSV files.');
    }

    // CSV to JSON conversion
    const csvToJsonOptions = { headers: ['column1', 'column2', 'column3'] }; // Replace with your actual column names

    const json1 = await csvtojson(csvToJsonOptions).fromString(req.files.csv1[0].buffer.toString());
    const json2 = await csvtojson(csvToJsonOptions).fromString(req.files.csv2[0].buffer.toString());

    console.log('JSON1:', json1);
    console.log('JSON2:', json2);

    if (!json1 || !json2) {
      return res.status(500).send('Error converting CSV to JSON.');
    }

    // Create PDF content
    const pdfContent = await createPDFFromJSON(json1, json2);

    // Save the PDF
    let outputPath = path.resolve(__dirname, '../uploads/mergeFile.pdf');
    await fs.writeFile(outputPath, pdfContent);

    // Response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=merged.pdf');
    res.send(pdfContent);

    // Display the path of the file where it is saved
    console.log('CSVs merged to PDF successfully and saved to this path in the server:', outputPath);
  } catch (error) {
    console.error('Error merging CSVs to PDF:', error.message);
    res.status(500).send('Internal Server Error - merging files');
  }
}

// Helper function to create a PDF content from JSON data
async function createPDFFromJSON(json1, json2) {
  const doc = new PDFDocument();

  // Add content to the PDF
  doc.fontSize(18).text('Merged PDF Report');

  json1.forEach(entry => {
    doc.moveDown().fontSize(12).text(`Entry: ${JSON.stringify(entry)}`);
  });

  json2.forEach(entry => {
    doc.moveDown().fontSize(12).text(`Entry: ${JSON.stringify(entry)}`);
  });

  // Generate the PDF buffer
  return new Promise(resolve => {
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.end();
  });
}

// Configure Multer to handle CSV file uploads
const csvUpload = upload.fields([
  { name: 'csv1', maxCount: 1 },
  { name: 'csv2', maxCount: 1 },
]);

module.exports = { mergeCSVsToPDF, csvUpload };
