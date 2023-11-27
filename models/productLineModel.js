const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection'); 


const ProductLine = sequelize.define('Product', {
  productLine: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  textDescription: {
    type: DataTypes.STRING(4000),
    collate: 'latin1_swedish_ci',
  },
  htmlDescription: {
    type: DataTypes.TEXT('medium'),
    collate: 'latin1_swedish_ci',
  },
  image: {
    type: DataTypes.BLOB('medium'),
  },
});

module.exports = ProductLine;
