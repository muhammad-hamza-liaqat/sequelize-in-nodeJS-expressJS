const { DataTypes } = require('sequelize');
const sequelize = require("../database/connection");
// adding the customer model here
const Customer = require("./customerModel");

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
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: "payments",
  timestamps: false,
});

// the customer and payment has the relationship, customerNumber foreign key here.
Payment.belongsTo(Customer, {
  foreignKey: 'customerNumber',
  targetKey: 'customerNumber',
});

module.exports = Payment;
