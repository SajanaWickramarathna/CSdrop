// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  delivery_id: { type: Number, required: true, unique: true },
  order_id: { type: Number, required: true },
  user_id: { type: Number, required: true},
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

module.exports = mongoose.model('Delivery', deliverySchema);
