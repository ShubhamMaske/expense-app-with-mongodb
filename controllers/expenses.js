const { Console } = require('console');
const Expense = require('../models/expense');
const User = require('../models/users');
const sequelize = require('../utils/database');
const { resolve } = require('path');
const { rejects } = require('assert');
const UserServices = require('../services/userservices');
const S3services = require('../services/S3services');
const SaveUrlInDatabase = require('../services/downloadservices');
const { json } = require('body-parser');

// exports.getExpenses = async(req, res, next) => {
//     const data = await Expense.findAll({where : {userId: req.user.id}});
//     res.status(200).json({allExpense: data});
// }

exports.getExpenses = async(req, res,next) => {
    try{
        const page = +req.params.page || 1;
        const pagerow = +req.params.pagerow
        console.log("***************",pagerow);
        const totalexpense = await Expense.count();

        const allExpenses = await Expense.findAll({
            offset: (page - 1) * pagerow,
            limit: pagerow
        });
        //console.log(`page no ${page} --`,allExpenses);
        res.status(200).json({
            expenses : allExpenses,
            currentPage: page,
            hasNextPage: pagerow * page < totalexpense,
            nextPage: page + 1,
            hasPreviousPage: page-1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalexpense / pagerow)
        })
    }
    catch(err){
        console.log("controller err == ",err);
    }

}

exports.getDownloadhistory = async(req, res) => {
    const data = await SaveUrlInDatabase.getUrlFromDatabase(req);
    console.log(JSON.stringify(data));
    res.status(200).json({AllHistory:data});
}

exports.addExpense = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
        console.log(req.body);
        const amount = req.body.exAmt;
        const description = req.body.Des;
        const category = req.body.cat;

        const data = await Expense.create({amount,description,category,userId: req.user.id},{transaction: t});
        const totalExpense = +req.user.totalExpense + +amount;
        await User.update({
                totalExpense: totalExpense
            },
            {
            where:{id:req.user.id},
            transaction:t
            })
        
        await t.commit();
        res.status(201).json({newExpense: data});
    }
    catch(err){
        await t.rollback();
        res.status(500).json({error: err})
    }
}

exports.deleteExpense = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const expenseId = req.params.id;
        await Expense.destroy({where:{id:expenseId, userId:req.user.id},transaction:t});
        const updatedExpense = +req.user.totalExpense - +req.body.amount
        await User.update({
            totalExpense: updatedExpense
        },
        {
            where:{id:req.user.id},
            transaction:t
        })
        await t.commit();
        res.sendStatus(200);
    }
    catch(err){
        await t.rollback();
        res.status(500).json({error: err})
    }

}



exports.downloadExpense = async(req, res)=> {
    try{
    const expenses = await UserServices.getExpenses(req);
    // console.log("Expenses --<>",expenses);
    const strigifiedExpenses = JSON.stringify(expenses);

    const userid = req.user.id;
    const fileName = `expense${userid}/${new Date()}.txt`;
    const fileUrl = await S3services.uploadToS3(strigifiedExpenses,fileName);
    const saveUrl = SaveUrlInDatabase.saveIndatabase(req,fileUrl);
    console.log("file url --- ",fileUrl);
    res.status(200).json({fileUrl, success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '', success:false,err:err})
    }
}