const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('classical', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', //which database you're using such as sql postgress
})

sequelize.authenticate().then(() => {
    console.log('connection established');
 }).catch((error) => {
    console.error('unable to connect to the DB');
 });


module.exports = sequelize