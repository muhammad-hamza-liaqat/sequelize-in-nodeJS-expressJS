const sequelize = require("../database/connection")
const { DataTypes } = require('sequelize');

const Orders = sequelize.define('orders', {
  orderNumber: {
    type: DataTypes.NUMBER,
    primaryKey:true,
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  requiredDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  shippedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,  
},
    customerNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
},
{
    tableName:"orders",
    timestamps:false,
});
module.exports=Orders;