
const Expense = require('../models/expense');
const User = require('../models/users');
const sequelize = require('../utils/database');
const { resolve } = require('path');
const { rejects } = require('assert');
const UserServices = require('../services/userservices');
const S3services = require('../services/S3services');
const SaveUrlInDatabase = require('../services/downloadservices');
const { json } = require('body-parser');


exports.getExpenses = async(req, res,next) => {
    try{
        const page = +req.params.page || 1;
        const pagerow = +req.params.pagerow;
       
        const totalExpenses = await Expense.find({userId: req.user._id}).count();
        console.log("Total Expenses -> ", totalExpenses);
        

        const allExpenses = await User.findById(req.user._id).populate({
            path: 'Expenses',
            options: {
                limit: pagerow,
                skip: (page - 1) * pagerow
            }
        })
        console.log("allExpenses -> ",allExpenses);
        res.status(200).json({
            expenses : allExpenses,
            currentPage: page,
            hasNextPage: pagerow * page < totalExpenses,
            nextPage: page + 1,
            hasPreviousPage: page-1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses / pagerow)
        })
    }
    catch(err){
        console.log("controller err == ",err);
    }

}

exports.getDownloadhistory = async(req, res) => {
    try{
        const data = await SaveUrlInDatabase.getUrlFromDatabase(req);
        res.status(200).json({AllHistory:data});
    }
    catch(err){
        console.log(err);
    }
}

exports.addExpense = async(req, res, next) => {
    try{
        console.log(req.body);
        const amount = req.body.exAmt;
        const description = req.body.Des;
        const category = req.body.cat;
        const expense = new Expense({
            amount: amount,
            description: description,
            category: category,
            userId: req.user._id
        })
        const data = await expense.save();

        const updatedExpense = +req.user.totalExpense + +amount;
        const userdata = await User.findById(req.user._id);
        userdata.totalExpense = updatedExpense;
        userdata.Expenses.push(data._id);
        await userdata.save();
         
        res.status(201).json({newExpense: data});
    }
    catch(err){
        res.status(500).json({error: err})
    }
}

exports.deleteExpense = async(req, res, next) => {
    try{
        const expenseId = req.params.id;
        const result = await Expense.findByIdAndRemove(expenseId);
        console.log("Expense Delete Result=> ",result);

        const updatedExpense = +req.user.totalExpense - +req.body.amount
        const userdata = await User.findById(req.user._id);
        userdata.totalExpense = updatedExpense;
        await userdata.save();

        res.sendStatus(200);
    }
    catch(err){
        res.status(500).json({error: err})
    }

}



exports.downloadExpense = async(req, res)=> {
    try{
    const expenses = await UserServices.getExpenses(req);

    const strigifiedExpenses = JSON.stringify(expenses);

    const userid = req.user.id;
    const fileName = `expense${userid}/${new Date()}.txt`;
    const fileUrl = await S3services.uploadToS3(strigifiedExpenses,fileName);
    const saveUrl = SaveUrlInDatabase.saveIndatabase(req,fileUrl);
    res.status(200).json({fileUrl, success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '', success:false,err:err})
    }
}