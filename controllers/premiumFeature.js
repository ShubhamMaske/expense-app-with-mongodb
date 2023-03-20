
const User = require('../models/users');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');

exports.getUserLeaderBoard = async (req, res)=> {
    try{
        const userLeaderBoardDetails = await User.findAll({
            attributes: ['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost','DESC']]
        })
       
        res.status(200).json(userLeaderBoardDetails)

    }catch(err){
        console.log(err);
    }
}