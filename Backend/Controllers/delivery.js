// controllers/deliveryController.js

const Delivery = require('../Models/delivery');

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

// Get delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ delivery_id: req.params.id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
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

// Assign delivery person
exports.assignDeliveryPerson = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { delivery_id: req.params.id },
      {
        assigned_to: req.body.assigned_to,
        delivery_status: 'assigned',
      },
      { new: true }
    );
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
