const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  ticketId: {
    type: Number,
    required: true,
  },
  sender_id: {
    type: String,
    required: true, // user_id or admin_id
  },
  sender_role: {
    type: String,
    enum: ['user', 'admin'],
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

module.exports = mongoose.model("Chat", chatSchema);
