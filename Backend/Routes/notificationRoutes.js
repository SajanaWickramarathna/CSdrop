const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notification');
const Notification = require('../Models/notification');

// Get notifications for a specific user
router.get('/user/:user_id', notificationController.getNotificationsForUser);

// Delete a specific notification
router.delete('/:id', notificationController.deleteNotification);

// Clear all notifications for a specific user
router.delete('/user/:user_id', notificationController.clearNotificationsForUser);

module.exports = router;