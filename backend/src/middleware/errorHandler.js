const errorHandler = (err, req, res, next) => {
  console.error('[Error Occurred]:', err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error (e.g. unique serial number, duplicate mobile)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate Entry Error: ${field} '${value}' already exists in the system.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Validation Failed: ${errors.join(', ')}`;
  }

  // Handle JWT Error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
