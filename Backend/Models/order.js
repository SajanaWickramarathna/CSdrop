const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: { type: Number, unique: true },
    user_id: { type: Number, required: true },
    items: [
        {
            product_id: { type: Number, required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    total_price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shipping_address: { type: String, required: true },
    payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    payment_method: { type: String, enum: ['COD', 'Payment Slip'], default: 'COD' }, // New Field
    payment_slip: { type: String }, // New Field
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Counter Schema for Auto-Incrementing `order_id`
const counterSchema = new Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
});

const Counter = mongoose.models.counter || mongoose.model("counter", counterSchema);

// Pre-save middleware to auto-increment `order_id`
orderSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const counter = await Counter.findOneAndUpdate(
            { name: "order_id" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        this.order_id = counter.value;
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save hook to update `updated_at`
orderSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('order', orderSchema);