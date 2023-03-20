
const User = require('../models/users');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');

exports.getUserLeaderBoard = async (req, res)=> {
    try{
        const userLeaderBoardDetails = await User.findAll({
            order: [['totalExpense','DESC']]
        })
       
        res.status(200).json(userLeaderBoardDetails)

    }catch(err){
        console.log(err);
    }
}