const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId per riferire un utente nel database
    ref: 'User', // Riferimento al modello User
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('expenses', expenseSchema);

module.exports = Expense;
