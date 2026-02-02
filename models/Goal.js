const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0.01
  },
  savedAmount: {
    type: Number,
    required: true,
    default: 0
  },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = mongoose.model('Goal', goalSchema);