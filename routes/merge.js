const express = require('express');
const mergeRoute = express.Router();
const { mergeCSVsToPDF, csvUpload } = require('../controller/mergeController');  // Ensure correct import

mergeRoute.route('/mergefile')
  .get((req, res) => {
    res.end('Merge endpoint');
  })
  .post(csvUpload,mergeCSVsToPDF);

module.exports = mergeRoute;
