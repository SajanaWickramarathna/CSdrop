const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Counter Schema to keep track of `ticket_id`
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});
const Counter = mongoose.models.counter || mongoose.model("counter", counterSchema);

const ticketSchema = new Schema({
  ticket_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  Categories: {
    type: String,
    default: "test",
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Open", // Default status is Open
  },
  priority: {
    type: String,
    default: "Low", // Default priority is Normal
  },
});

// Pre-save middleware to auto-increment `product_id`
ticketSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "ticket_id" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.ticket_id = counter.value;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
