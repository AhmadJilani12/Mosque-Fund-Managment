const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    default: null, // null for anonymous donations
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
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
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'wallet', 'monthly'],
    default: 'cash',
  },
  isMonthly: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-populate month and year if not provided
donationSchema.pre('save', function () {
  if (!this.month || !this.year) {
    const date = new Date(this.date);
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }
});
module.exports = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
