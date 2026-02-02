const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  date: {
    type: Date,
    default: Date.now
  },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = mongoose.model('Income', incomeSchema);