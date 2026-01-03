const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['bills', 'salary', 'repair', 'maintenance', 'food', 'supplies', 'utilities', 'other'],
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-populate month and year if not provided
expenseSchema.pre('save', function(next) {
  if (!this.month || !this.year) {
    const date = new Date(this.date);
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }
  next();
});

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
