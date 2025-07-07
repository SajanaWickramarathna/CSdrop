const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Counter Schema to keep track of `brand_id`
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});
const Counter = mongoose.models.counter || mongoose.model("counter", counterSchema);

// Brand Schema
const brandSchema = new Schema({
  brand_id: { type: Number, unique: true },
  brand_name: { type: String, required: true },
  brand_description: { type: String, required: true },
  brand_image: { type: String, required: true },
  brand_status: { type: String, enum: ['active', 'inactive', 'draft'], default: "active" }, // Added 'inactive'
  category_id: { type: Number, required: true }, // Link to category
  category_name: { type: String }, // For display; fill in controller if needed
  created_at: { type: Date, default: Date.now },
});

// Pre-save middleware to auto-increment `brand_id`
brandSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "brand_id" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.brand_id = counter.value;
    next();
  } catch (error) {
    next(error);
  }
});

const Brand = mongoose.model("brand", brandSchema);
module.exports = Brand;