const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge_ayush', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Failed] ${error.message}`);
    // In production we exit; in dev we log warning so server can still serve mock data if DB isn't running locally yet
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
