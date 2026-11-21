const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error]: ${err.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB Disconnected]');
  } catch (err) {
    console.error(`[MongoDB Disconnect Error]: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
