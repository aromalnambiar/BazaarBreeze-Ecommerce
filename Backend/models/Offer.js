const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  discountType: {
    type: String,
    enum: ['Percentage', 'FixedAmount'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: true,
  },
  offerType: {
    type: String,
    required: true,
    enum: ['Product', 'Category', 'Referral'],
  },
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
});

const OfferModel = mongoose.model('Offer', OfferSchema);

module.exports = OfferModel;
