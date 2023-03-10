const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense','root','Shubh@099',{
    dialect: 'mysql',
    host:'localhost'
})

module.exports = sequelize;