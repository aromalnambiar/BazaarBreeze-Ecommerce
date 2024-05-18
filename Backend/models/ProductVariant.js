const mongoose = require("mongoose");

const ProductVariant = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  stock: { type: Number },
  regularPrice: { type: Number },
  color: { type: String },
  variantName: { type: String },
  salePrice: { type: Number, required: true },
  regularPrice: { type: Number, required: true },
  images: { type: Array, default: [] },
  publicIds: { type: Array, default: [] },
  specification: { type: Array },
});

const productVariantModel = mongoose.model("ProductVariant", ProductVariant);

module.exports = productVariantModel;
