const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Counter Schema to keep track of `ticket_id`
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});
const Counter =
  mongoose.models.counter || mongoose.model("counter", counterSchema);

const ContactSchema = new Schema({
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

// Pre-save middleware to auto-increment `product_id`
ContactSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "contact_id" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.contact_id = counter.value;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(
  "contactUs", //Filename
  ContactSchema //Function Name
);
