const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  contact_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String, // data type
    required: true, // validate
  },
  gmail: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },

  reply: {
    type: String,
    default: "", // Default empty
  },
});

module.exports = mongoose.model(
  "contactUs", //Filename
  userSchema //Function Name
);
