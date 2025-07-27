const Delivery = require('../Models/delivery'); // Ensure this path is correct
const Notification = require('../Models/notification');
const User = require("../Models/user");
const nodemailer = require("nodemailer");

// Email sender setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sajanaanupama123@gmail.com",
    pass: "melc veit raso vsqm",
  },
});

const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: "sajanaanupama123@gmail.com",
    to,
    subject,
    text,
    html,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("❌ Email error:", error);
    else console.log("📧 Email sent:", info.response);
  });
};

// Create new delivery
exports.createDelivery = async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body);
    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ created_at: -1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get delivery by ID (delivery_id)
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ delivery_id: req.params.id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get delivery by Order ID
exports.getDeliveryByOrderId = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ order_id: req.params.orderId }); // Changed to order_id
    if (!delivery) return res.status(404).json({ message: 'Delivery not found for this Order ID' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update delivery status
// ✅ Update delivery status with notification + email
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { delivery_id: req.params.id },
      { delivery_status: req.body.status },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Find user to notify
    const user = await User.findOne({ user_id: delivery.user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found for delivery" });
    }

    // 🔔 Create notification
    await Notification.create({
      user_id: user.user_id,
      message: `Your delivery (Order ID: ${delivery.order_id}) status has been updated to "${delivery.delivery_status}".`,
    });

    // 📧 Send email
    sendEmail(
      user.email,
      "🚚 Delivery Status Update - CS Drop",
      `Hi ${user.firstName || "Customer"},\n\nYour delivery for Order ID ${delivery.order_id} has been updated to: ${delivery.delivery_status}.`,
      `<h3>Hi ${user.firstName || "Customer"},</h3>
      <p>Your delivery for <strong>Order ID: ${delivery.order_id}</strong> is now marked as <strong>${delivery.delivery_status}</strong>.</p>
      <p>Thank you for shopping with CS Drop!</p>`
    );

    res.status(200).json({
      message: "Delivery status updated and user notified",
      delivery,
    });
  } catch (err) {
    console.error("❌ updateDeliveryStatus Error:", err);
    res.status(500).json({ error: err.message });
  }
};