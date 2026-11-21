const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'User account is deactivated.' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, roles: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      roles: req.user.roles,
    },
  });
};

// GET /api/auth/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe, getAllUsers };
