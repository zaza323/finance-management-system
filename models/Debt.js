const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  creditor: { // اسم الدائن (لمن تدين بالمال)
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  totalAmount: { // المبلغ الإجمالي للدين
    type: Number,
    required: true,
    min: 0.01
  },
  paidAmount: { // المبلغ الذي تم سداده
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

module.exports = mongoose.model('Debt', debtSchema);