const Expense = require('../models/expenseModel');
const { BadRequest, NotFound, Forbidden } = require('../helpers/response');
// const checkPermission = require('../middlewares/rbac');

// Middleware di autenticazione
// const { isAuth } = require('../middlewares/isAuth');

// POST /api/expenses
// isAuth, // Middleware di autenticazione
// checkPermission('expense', 'create'), // Middleware per verificare l'autorizzazione
exports.createExpense = async (req, res, next) => {
  try {
    const { userId, title, amount, description, date } = req.body;

    // Crea una nuova spesa
    const newExpense = new Expense({
      userId,
      title,
      amount,
      description,
      date
    });

    // Salva la spesa nel database
    await newExpense.save();

    // Ritorna la nuova spesa creata come risposta
    return res.json(newExpense);
  } catch (err) {
    console.error(err.message);
    return next(BadRequest(err.message)); // Invia un errore di richiesta non valida al middleware successivo
  }
};

module.exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId });

    // Se non ci sono spese trovate, ritorna un errore 404
    if (!expenses || expenses.length === 0) {
      return next(NotFound('Nessuna spesa trovata'));
    }
    return res.json(expenses);
  } catch (err) {
    return next(err); // Passa l'errore al middleware di gestione degli errori successivo
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, description, date } = req.body;
    // Cerca la spesa dal database per l'ID specificato
    let expense = await Expense.findById(id);

    // Se la spesa non è trovata, ritorna un errore 404
    if (!expense) {
      return next(NotFound('Spesa non trovata'));
    }

    // Verifica se l'utente autenticato è autorizzato a modificare questa spesa
    if (expense.userId.toString() !== req.user._id.toString()) {
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
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cerca la spesa dal database
    const expense = await Expense.findById(id);

    // Se la spesa non è trovata, ritorna un errore 404
    if (!expense) {
      return next(NotFound('Spesa non trovata'));
    }

    // Verifica se l'utente autenticato è autorizzato a eliminare questa spesa
    if (expense.userId.toString() !== req.user._id.toString()) {
      return next(Forbidden('Non sei autorizzato a eliminare questa spesa'));
    }

    // Elimina la spesa dal database
    await expense.delete();

    // Ritorna un messaggio di successo come risposta
    return res.json({ message: 'Spesa eliminata con successo' });
  } catch (err) {
    console.error(err.message);
    return next(BadRequest(err.message));
  }
};
