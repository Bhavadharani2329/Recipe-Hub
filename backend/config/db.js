const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipehub';
    console.log(`Connecting to MongoDB at: ${connStr.replace(/:([^:@]+)@/, ':****@')}`);
    
    await mongoose.connect(connStr);
    
    console.log('MongoDB database connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
