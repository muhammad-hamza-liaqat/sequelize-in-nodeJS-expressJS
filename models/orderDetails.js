const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection'); 

const OrderDetail = sequelize.define('OrderDetail', {
  orderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  productCode: {
    type: DataTypes.STRING(15),
    allowNull: false,
    primaryKey: true,
    collate: 'latin1_swedish_ci',
  },
  quantityOrdered: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  priceEach: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  orderLineNumber: {
    type: DataTypes.INTEGER,
  },
});

module.exports = OrderDetail;
