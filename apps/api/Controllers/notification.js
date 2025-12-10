const Notification = require('../Models/notification');

// Get Notifications for a Specific User
exports.getNotificationsForUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const notifications = await Notification.find({ user_id: Number(user_id) }).sort({ created_at: -1 });

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found for this user.' });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error('❌ getNotificationsForUser Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete a Specific Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('❌ deleteNotification Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Clear All Notifications for a Specific User
exports.clearNotificationsForUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await Notification.deleteMany({ user_id: Number(user_id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No notifications found for this user to delete.' });
    }

    res.status(200).json({ message: 'All notifications cleared successfully.' });
  } catch (error) {
    console.error('❌ clearNotificationsForUser Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};