// customerModel.js
const { DataTypes } = require('sequelize');
const sequelize = require("../database/connection");
const Payment = require('./paymentModel');
const Employee = require("./employeeModel")

const Customer = sequelize.define('Customer', {
  customerNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contactLastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contactFirstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  addressLine1: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  addressLine2: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  salesRepEmployeeNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  creditLimit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: "customers",
  timestamps: false,
});
Customer.belongsTo(Employee, {
  foreignKey: 'salesRepEmployeeNumber', // Assuming this is your foreign key
  as: 'SalesRep', // You can use this alias in your include options
});

module.exports = Customer;
