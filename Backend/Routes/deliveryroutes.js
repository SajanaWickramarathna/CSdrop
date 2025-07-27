const express = require('express');
const router = express.Router();
const deliveryController = require('../Controllers/delivery');

// Create a new delivery
router.post('/', deliveryController.createDelivery);

// Get all deliveries
router.get('/all', deliveryController.getAllDeliveries);

// Get delivery by ID
router.get('/delivery/:id', deliveryController.getDeliveryById);

// Get delivery by Order ID - NEW ROUTE
router.get('/by-order/:orderId', deliveryController.getDeliveryByOrderId); // New route for tracking by orderId

// Update delivery status
router.put('/:id/status', deliveryController.updateDeliveryStatus);



module.exports = router;
