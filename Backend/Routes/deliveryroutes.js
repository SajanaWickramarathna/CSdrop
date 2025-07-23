// routes/deliveryRoutes.js

const express = require('express');
const router = express.Router();
const deliveryController = require('../Controllers/delivery');

// Create a new delivery
router.post('/', deliveryController.createDelivery);

// Get all deliveries
router.get('/all', deliveryController.getAllDeliveries);

// Get delivery by ID
router.get('/:id', deliveryController.getDeliveryById);

// Update delivery status
router.put('/:id/status', deliveryController.updateDeliveryStatus);

// Assign a delivery person
router.put('/:id/assign', deliveryController.assignDeliveryPerson);

module.exports = router;
