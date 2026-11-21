const express = require('express');
const router = express.Router();
const { login, getMe, getAllUsers } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, getAllUsers);

module.exports = router;
