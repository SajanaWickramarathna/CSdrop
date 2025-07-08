const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});
const Counter = mongoose.models.counter || mongoose.model("counter", counterSchema);

const chatSchema = new mongoose.Schema({
  ticket_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  Chat_id: {
    type: Number,
    unique: true,
  },
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

chatSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "Chat_id" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.Chat_id = counter.value;
    next();
  } catch (error) {
    next(error);
  }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
