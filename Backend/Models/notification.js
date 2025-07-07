const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Notification Schema
const notificationSchema = new Schema({
  user_id: { type: Number, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('notification', notificationSchema);