const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Counter Schema to keep track of `product_id`
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});
const Counter = mongoose.models.counter || mongoose.model("counter", counterSchema);

// Product Schema
const productSchema = new Schema({
  product_id: { type: Number, unique: true },
  product_name: { type: String, required: true },
  product_description: { type: String, required: true },
  product_status: { type: String, enum: ['active', 'inactive', 'draft'], default: "active" },
  product_price: { type: Number, required: true },

  // ✅ REPLACED: from single image to array of images
  images: {
    type: [String],
    required: true, // if at least 1 image is mandatory
    validate: [arrayLimit, '{PATH} exceeds the limit of 4']
  },

  category_id: { type: Number, required: true },
  brand_id: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

// ✅ Custom validator to limit max 4 images
function arrayLimit(val) {
  return val.length <= 4;
}

// ✅ Pre-save middleware to auto-increment `product_id`
productSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "product_id" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.product_id = counter.value;
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
