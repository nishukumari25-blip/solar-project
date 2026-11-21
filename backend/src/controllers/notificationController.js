const Notification = require('../models/Notification');

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/mark-read
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ unread: true }, { unread: false });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAllRead };
