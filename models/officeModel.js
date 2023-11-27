const { DataTypes } = require('sequelize');
const sequelize = require("../database/connection"); 

const Employee = sequelize.define('Employee', {
  employeeNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  extension: {
    type: DataTypes.STRING(10),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
  officeCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    collate: 'latin1_swedish_ci',
    indexes: [{ unique: false, fields: ['officeCode'] }],
  },
  reportsTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Employee',
      key: 'employeeNumber',
    },
  },
  jobTitle: {
    type: DataTypes.STRING(50),
    allowNull: false,
    collate: 'latin1_swedish_ci',
  },
});

module.exports = Employee;
