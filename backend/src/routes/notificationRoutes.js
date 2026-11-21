const express = require('express');
const router = express.Router();
const { getNotifications, markAllRead } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getNotifications);
router.put('/mark-read', authenticate, markAllRead);

module.exports = router;
