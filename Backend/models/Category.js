const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String },
  createdDate: { type: Date },
  description: { type: String },
  image: { type: String },
  updatedDate: { type: Date },
  isListed: { type: Boolean, default: true },
  publicId: { type: String, default: "" },
});

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;
