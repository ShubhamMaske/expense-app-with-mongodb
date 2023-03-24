const express = require('express');
const expenseController = require('../controllers/expenses');
const userAuth = require('../middleware/Authorization');

const router = express.Router();

router.get('/getExpenses/:page/:pagerow',userAuth.authenticate,expenseController.getExpenses);//
router.post('/addExpense',userAuth.authenticate,expenseController.addExpense);
router.post('/deleteExpense/:id',userAuth.authenticate,expenseController.deleteExpense);
router.get('/download',userAuth.authenticate,expenseController.downloadExpense);
router.get('/getDownloadHistory',userAuth.authenticate,expenseController.getDownloadhistory);






module.exports = router;