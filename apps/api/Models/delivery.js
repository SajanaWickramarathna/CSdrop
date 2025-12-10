const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  // Removed required: true from delivery_id as it's auto-incremented
  delivery_id: { type: Number, unique: true },
  order_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  address: { type: String, required: true },
  delivery_status: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  estimated_delivery: { type: Date },
  actual_delivery: { type: Date },
  created_at: { type: Date, default: Date.now },
});

// Define internal counter schema/model (within the same file)
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});
const Counter = mongoose.model('DeliveryCounter', counterSchema);

// Pre-save hook to auto-increment delivery_id
deliverySchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'delivery_id' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    this.delivery_id = counter.sequence_value;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Delivery', deliverySchema);