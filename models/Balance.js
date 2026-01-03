const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['opening', 'adjustment'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Balance || mongoose.model('Balance', balanceSchema);
