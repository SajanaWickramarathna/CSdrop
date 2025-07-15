const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: { type: Number, required: true }, // product_id (Number)
  userId: { type: Number, required: true }, // user_id (Number)
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
