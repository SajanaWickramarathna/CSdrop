const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/order');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Create a new order (with payment slip upload)
router.post('/create', uploadMiddleware.single('payment_slip'), orderController.createOrder);

// Get orders for a specific user
router.get('/user/:user_id', orderController.getUserOrders);

// Get all orders 
router.get('/all', orderController.getAllOrders);

// Update order status 
router.put('/update/:order_id', orderController.updateOrderStatus);

// Cancel an order
router.put('/cancel/:order_id', orderController.cancelOrder);

// Get aggregated analytics data (Admin)
router.get('/analytics', orderController.getAnalytics);

// Get order details by order ID
router.get('/:order_id', orderController.getOrderById);

// Get user order summary
router.get('/user/summary/:user_id', orderController.getUserOrderSummary);  // New route for order summary


module.exports = router;
