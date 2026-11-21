const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    targetPath: { type: String, default: '/' },
    unread: { type: Boolean, default: true },
    timestamp: { type: String, default: 'Just now' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
