const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Refund', 'Purchase', 'Withdrawal', 'Deposit'], // Add more types as needed
  },
  amount: {
    type: Number,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports = TransactionModel;
