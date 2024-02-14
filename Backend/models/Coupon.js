const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: {
    type: String,
    enum: ['Percentage', 'FixedAmount'],
    required: true,
  },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  couponName: { type: String, required: true },
  description: { type: String, required: true },
  validProducts: [{ type: mongoose.Types.ObjectId}],
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  usageLimit: { type: Number, default: null }, 
});

const CouponModel = mongoose.model('Coupon', CouponSchema);
module.exports = CouponModel;
