const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  transactionId: { type: String },
  paymentMethod: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model('Payment', PaymentSchema);
module.exports = PaymentModel;
