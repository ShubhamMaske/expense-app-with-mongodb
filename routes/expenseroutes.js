const express = require('express');
const expenseController = require('../controllers/expenses');
const userAuth = require('../middleware/Authorization');

const router = express.Router();

router.get('/getExpenses',userAuth.authenticate,expenseController.getExpenses);
router.post('/addExpense',userAuth.authenticate,expenseController.addExpense);
router.post('/deleteExpense/:id',expenseController.deleteExpense);






module.exports = router;