const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection'); 

// Define the Product model
const Product = sequelize.define('product', {
  productCode: {
    type: DataTypes.STRING(15),
    allowNull: false,
    primaryKey: true,
    collate: 'latin1_swedish_ci',
  },
  productName: {
    type: DataTypes.STRING(70),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  productLine: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'latin1_swedish_ci',
    indexes: [{ unique: false, fields: ['productLine'] }],
  },
  productScale: {
    type: DataTypes.STRING(10),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  productVendor: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  quantityInStock: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  buyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  MSRP: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

module.exports = Product;
