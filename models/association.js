
const Customer = require("./customerModel");
const Payment = require("./paymentModel");
const productLine = require("./productLineModel");
const product = require("./productModel");
const customer = require("./employeeModel");
const employee = require("./employeeModel");
const office = require("./officeModel");
const order = require("./orderModel");
const orderDetail = require("./orderDetails");

// product and productLine
productLine.hasMany(product, { foreignKey: 'productLine', targetKey: 'productLine' });
product.belongsTo(productLine, { foreignKey: 'productLine', targetKey: 'productLine' });

// product and order Details
product.hasMany(orderDetail, { foreignKey: 'productCode', targetKey: 'productCode' });
orderDetail.belongsTo(product, { foreignKey: 'productCode', targetKey: 'productCode' });

// order and order details
order.hasMany(orderDetail, { foreignKey: 'orderNumber', targetKey: 'orderNumber' });
orderDetail.belongsTo(order, { foreignKey: 'orderNumber', targetKey: 'orderNumber' });

// customer and employee
employee.hasMany(customer, { foreignKey: 'salesRepEmployeeNumber', targetKey: 'employeeNumber' });
customer.belongsTo(employee, { foreignKey: 'salesRepEmployeeNumber', targetKey: 'employeeNumber' });

// employee and office 
office.hasMany(employee, { foreignKey: 'officeCode', targetKey: 'officeCode' });
employee.belongsTo(office, { foreignKey: 'officeCode', targetKey: 'officeCode' });

// customer and payment
Payment.belongsTo(Customer, { foreignKey: 'customerNumber', targetKey: 'customerNumber' });
Customer.hasMany(Payment, { foreignKey: 'customerNumber' });

// order and customer
Customer.hasMany(order, { foreignKey: 'customerNumber', targetKey: 'customerNumber' });
order.belongsTo(Customer, { foreignKey: 'customerNumber', targetKey: 'customerNumber' });




