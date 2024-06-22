const Expense = require('../models/expenseModel');
const { BadRequest, NotFound, Forbidden } = require('../helpers/response');
const checkPermission = require('../middlewares/rbac');

// Middleware di autenticazione
const { isAuth } = require('../middlewares/isAuth');

// POST /api/expenses
exports.createExpense = [
  isAuth, // Middleware di autenticazione
  checkPermission('expense', 'create'), // Middleware per verificare l'autorizzazione
  async (req, res, next) => {
    try {
      const { amount, description, date } = req.body;

      // Crea una nuova spesa
      const newExpense = new Expense({
        amount,
        description,
        date
      });

      // Salva la spesa nel database
      await newExpense.save();

      // Ritorna la nuova spesa creata come risposta
      res.json(newExpense);
    } catch (err) {
      console.error(err.message);
      next(BadRequest(err.message)); // Invia un errore di richiesta non valida al middleware successivo
    }
  }
];

// GET /api/expenses
exports.getExpenses = [
  isAuth, // Middleware di autenticazione
  async (req, res, next) => {
    try {
      // Ottieni tutte le spese dell'utente corrente
      const expenses = await Expense.find({ user: req.user._id });

      // Se non ci sono spese trovate, ritorna un errore 404
      if (!expenses || expenses.length === 0) {
        return next(NotFound('Nessuna spesa trovata'));
      }

      // Ritorna le spese come risposta
      return res.json(expenses);
    } catch (err) {
      console.error(err.message);
      return next(err); // Passa l'errore al middleware di gestione degli errori successivo
    }
  }
];

exports.updateExpense = [
  isAuth,
  checkPermission('expense', 'update'), // Middleware per verificare l'autorizzazione
  async (req, res, next) => {
    const { id } = req.params;
    const { amount, description, date } = req.body;

    try {
      // Cerca la spesa dal database per l'ID specificato
      let expense = await Expense.findById(id);

      // Se la spesa non è trovata, ritorna un errore 404
      if (!expense) {
        return next(NotFound('Spesa non trovata'));
      }

      // Verifica se l'utente autenticato è autorizzato a modificare questa spesa
      if (expense.user.toString() !== req.user._id.toString()) {
        return next(Forbidden('Non sei autorizzato a modificare questa spesa'));
      }

      // Aggiorna i campi della spesa
      expense.amount = amount;
      expense.description = description;
      expense.date = date;

      // Salva la spesa aggiornata nel database
      expense = await expense.save();

      // Ritorna la spesa aggiornata come risposta
      return res.json(expense);
    } catch (err) {
      console.error(err.message);
      return next(err);
    }
  }
];

// DELETE /api/expenses/:id
exports.deleteExpense = [
  isAuth,
  checkPermission('expense', 'delete'), // Middleware per verificare l'autorizzazione
  async (req, res, next) => {
    const { id } = req.params;

    try {
      // Cerca la spesa dal database e eliminatela
      const deletedExpense = await Expense.findByIdAndDelete(id);

      // Se la spesa non è trovata, ritorna un errore 404
      if (!deletedExpense) {
        return next(NotFound('Spesa non trovata'));
      }

      // Ritorna un messaggio di successo come risposta
      return res.json({ message: 'Spesa eliminata con successo' });
    } catch (err) {
      console.error(err.message);
      return next(BadRequest(err.message));
    }
  }
];
