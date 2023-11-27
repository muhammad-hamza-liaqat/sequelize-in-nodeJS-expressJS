
const Customer = require("./customerModel");
const Payment = require("./paymentModel");

Payment.belongsTo(Customer, { foreignKey: 'customerNumber', targetKey: 'customerNumber' });
Customer.hasMany(Payment, { foreignKey: 'customerNumber' });



