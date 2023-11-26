// paymentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require("../database/connection");

const Payment = sequelize.define('Payment', {
  customerNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  checkNumber: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    collate: 'latin1_swedish_ci',
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: "payments",
  timestamps: false,
});

module.exports = Payment;
