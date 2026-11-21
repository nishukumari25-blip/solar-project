const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User session invalid or deactivated.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: err.message,
    });
  }
};

// Check if user has required role (Owner / Admin always passes)
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userRoles = req.user.roles || [];
    const isOwner = userRoles.includes('Owner / Admin');

    if (isOwner) {
      return next(); // Owner / Admin has super-admin access across all modules
    }

    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Action requires one of [${allowedRoles.join(', ')}]. Your assigned roles: [${userRoles.join(', ')}].`,
      });
    }

    next();
  };
};

module.exports = { authenticate, requireRole };
