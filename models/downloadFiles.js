const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Download = sequelize.define('downloadfile',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    url : Sequelize.STRING,
    userId : Sequelize.INTEGER
});

module.exports = Download;