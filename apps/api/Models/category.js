const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Counter Schema to keep track of `category_id`
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});
const Counter = mongoose.models.counter || mongoose.model("counter", counterSchema);

// Category Schema
const categorySchema = new Schema({
  category_id: { type: Number, unique: true },
  category_name: { type: String, required: true, unique: true },
  category_description: { type: String, required: true },
  category_image: { type: String, required: true },
  category_status: { type: String, enum: ['active', 'inactive'], default: "active" },
  product_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

// Normalize name before save
categorySchema.pre("save", function(next) {
  if (this.category_name) {
    this.category_name = this.category_name.trim();
  }
  next();
});

// Pre-save middleware to auto-increment `category_id`
categorySchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "category_id" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.category_id = counter.value;
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;