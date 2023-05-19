const User = require('../models/users');

exports.getUserLeaderBoard = async (req, res)=> {
    try{
        const userLeaderBoardDetails = await User.find().sort({totalExpense: -1}).select('name totalExpense');
        console.log(userLeaderBoardDetails)
        res.status(200).json(userLeaderBoardDetails)

    }catch(err){
        console.log(err);
    }
}