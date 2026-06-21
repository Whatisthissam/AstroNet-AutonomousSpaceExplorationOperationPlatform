const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      retries++;
      logger.error(`❌ MongoDB connection attempt ${retries}/${maxRetries} failed: ${err.message}`);
      if (retries < maxRetries) {
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        logger.error('MongoDB connection failed after max retries. Exiting...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
