const express = require('express');

const router = express.Router();
const expenseController = require('../controllers/expense');

router.post('/', expenseController.createExpense);

router.get('/:userId', expenseController.getExpenses);

router.put('/:id', expenseController.updateExpense);

router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
