const express = require('express');

const router = express.Router();
const expenseController = require('../controllers/expense');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');

// Rotte per il controller expense
router.post('/', isAuth, rbac('expenses', 'create'), expenseController.createExpense);

router.get('/:userId', isAuth, rbac('expenses', 'read'), expenseController.getExpenses);

router.put('/:id', isAuth, rbac('expenses', 'update'), expenseController.updateExpense);

router.delete('/:id', isAuth, rbac('expenses', 'delete'), expenseController.deleteExpense);

module.exports = router;
