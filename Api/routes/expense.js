const express = require('express');

const router = express.Router();
const expenseController = require('../controllers/expense');

// POST /api/expenses - Creazione di una nuova spesa
router.post('/expenses', expenseController.createExpense);

// GET /api/expenses - Ottenere tutte le spese dell'utente autenticato
router.get('/expenses', expenseController.getExpenses);

// PUT /api/expenses/:id - Modificare una spesa esistente
router.put('/expenses/:id', expenseController.updateExpense);

// DELETE /api/expenses/:id - Eliminare una spesa esistente
router.delete('/expenses/:id', expenseController.deleteExpense);

module.exports = router;
