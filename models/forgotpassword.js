const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

//id, name , password, phone number, role

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    userId: Sequelize.INTEGER,
    active: Sequelize.BOOLEAN
})

module.exports = Forgotpassword;