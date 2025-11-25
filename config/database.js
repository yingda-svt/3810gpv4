const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI not set. Please provide connection string in environment variables');
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log('✅ MongoDB Atlas connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed', error);
    process.exit(1);
  }
}

module.exports = connectDB;

