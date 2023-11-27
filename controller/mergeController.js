const { PDFDocument } = require('pdf-lib');
const fs = require('fs/promises');
const path = require('path');

async function mergePDFs(req, res) {
  try {
    let pdf1Path = path.resolve(__dirname, '../customer_details.pdf');
    let pdf2Path = path.resolve(__dirname, '../customer_details2.pdf');

    // if file exists, then
    await Promise.all([
      fs.access(pdf1Path),
      fs.access(pdf2Path)
    ]);

    // reading the PDF
    const pdf1Bytes = await fs.readFile(pdf1Path);
    const pdf2Bytes = await fs.readFile(pdf2Path);

    // Create PDFDocument objects
    const pdfDoc1 = await PDFDocument.load(pdf1Bytes);
    const pdfDoc2 = await PDFDocument.load(pdf2Bytes);

    // a new file containing two previous files
    const mergedPdfDoc = await PDFDocument.create();

    // Add pages from the first PDF
    const [pdf1Pages, pdf2Pages] = await Promise.all([
      mergedPdfDoc.copyPages(pdfDoc1, pdfDoc1.getPageIndices()),
      mergedPdfDoc.copyPages(pdfDoc2, pdfDoc2.getPageIndices()),
    ]);

    // Add the copied pages to the merged PDF
    pdf1Pages.forEach((page) => mergedPdfDoc.addPage(page));
    pdf2Pages.forEach((page) => mergedPdfDoc.addPage(page));

    // Save the merged PDF to a file on the server
    let outputPath = path.resolve(__dirname, '../uploads/mergeFile.pdf');
    await fs.writeFile(outputPath, await mergedPdfDoc.save());

    // response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=merged.pdf');
    res.send(await mergedPdfDoc.save());

    console.log('PDFs merged successfully and saved to:', outputPath);
  } catch (error) {
    console.error('Error merging PDFs:', error.message);
    res.status(500).send('Internal Server Error-merging file');
  }
}

module.exports = mergePDFs;
