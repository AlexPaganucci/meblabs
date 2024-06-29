const Expense = require('../models/expenseModel');
const { BadRequest, NotFound } = require('../helpers/response');

// Funzione per creare una nuova spesa
exports.createExpense = async (req, res, next) => {
  try {
    const { userId, title, amount, description, date } = req.body;

    const newExpense = new Expense({
      userId,
      title,
      amount,
      description,
      date
    });

    await newExpense.save();

    return res.json(newExpense);
  } catch (err) {
    console.error(err.message);
    return next(BadRequest(err.message));
  }
};

// Funzione per prendere tutte le spese di un determinato utente
module.exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId });

    if (!expenses || expenses.length === 0) {
      return next(NotFound('Nessuna spesa trovata'));
    }
    return res.json(expenses);
  } catch (err) {
    return next(err);
  }
};

// Funzione per aggiornare una spesa
exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, description, date } = req.body;

    let expense = await Expense.findById(id);

    if (!expense) {
      return next(NotFound('Spesa non trovata'));
    }

    expense.amount = amount;
    expense.description = description;
    expense.date = date;

    expense = await expense.save();

    return res.json(expense);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

// Funzione per eliminare una spesa
exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return next(NotFound('Spesa non trovata'));
    }

    await expense.deleteOne();

    return res.json({ message: 'Spesa eliminata con successo' });
  } catch (err) {
    console.error(err.message);
    return next(BadRequest(err.message));
  }
};
