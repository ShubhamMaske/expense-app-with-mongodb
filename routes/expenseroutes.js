const express = require('express');
const expenseController = require('../controllers/expenses');

const router = express.Router();

router.get('/getExpenses',expenseController.getExpenses);
router.post('/addExpense',expenseController.addExpense);
router.post('/deleteExpense/:id',expenseController.deleteExpense);






module.exports = router;