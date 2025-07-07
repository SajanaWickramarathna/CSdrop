const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Counter Schema to keep track of `user_id`
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 },
});

const Counter = mongoose.models.counter || mongoose.model("counter", counterSchema);

const userSchema = new Schema({
    user_id: { type: Number, unique: true },
    firstName: {type: String,required: true},
    lastName: {type: String,required: true},
    email: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    profilePic: {type: String},
    role: {type: String,enum: ['admin', 'customer','customer_supporter'],default: 'customer'},
    address: {type: String},
    phone: {type: String},
    userStatus: {type: String,enum: ['active', 'inactive'],default: 'active'},
    token: {type: String},
    isVerified: { type: Boolean, default: false },
    createdAt: {type: Date,default: Date.now()}
});


// Pre-save middleware to auto-increment `user_id`
userSchema.pre('save', async function (next) {
  if (!this.isNew) return next(); // Only run when creating a new document

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "user_id" },
      { $inc: { value: 1 } },
      { new: true, upsert: true } // Create a new counter document if it doesn't exist
    );
    this.user_id = counter.value; // Assign the incremented value to `user_id`
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('user',userSchema);