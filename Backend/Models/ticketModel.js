const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("Ticket", ticketSchema);
