const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
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
  paymentDate: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = mongoose.model('Subscription', subscriptionSchema);