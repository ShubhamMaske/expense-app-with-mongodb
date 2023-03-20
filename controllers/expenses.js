const { Console } = require('console');
const Expense = require('../models/expense');
const User = require('../models/users');

exports.getExpenses = async(req, res, next) => {
    const data = await Expense.findAll({where : {userId: req.user.id}});
    res.status(200).json({allExpense: data});
}

exports.addExpense = async(req, res, next) => {

    try{
        console.log(req.body);
        const amount = req.body.exAmt;
        const description = req.body.Des;
        const category = req.body.cat;

        const data = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        })
        const totalExpense = +req.user.totalExpense + +amount;
        User.update({
                totalExpense: totalExpense
            },
            {
            where:{id:req.user.id}
            })
        
        console.log("after creating-->"+JSON.stringify(data));
        res.status(201).json({newExpense: data});
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
}

exports.deleteExpense = async(req, res, next) => {
    const expenseId = req.params.id;
    await Expense.destroy({where:{id:expenseId}});
    res.sendStatus(200);

}