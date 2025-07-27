const Delivery = require('../Models/delivery'); // Ensure this path is correct

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
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { delivery_id: req.params.id },
      { delivery_status: req.body.status },
      { new: true }
    );
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};