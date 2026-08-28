// 📁 config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      // Allow up to 50 concurrent socket connections per Node instance
      maxPoolSize: 50,
      // Fail fast if MongoDB server selection takes longer than 5 seconds
      serverSelectionTimeoutMS: 5000,
      // Close idle sockets after 45 seconds of inactivity
      socketTimeoutMS: 45000,
      // Keep trying to send operations for 10 seconds if disconnected
      connectTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Event Listeners for Connection State Lifecycle
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB connection lost. Reconnecting...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB connection re-established.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime connection error:', err);
    });

  } catch (error) {
    console.error(`❌ Initial MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code so process managers (PM2 / Docker / K8s) restart it
    process.exit(1);
  }
};

// Graceful Shutdown Cleanup Function
const closeDB = async () => {
  await mongoose.connection.close();
  console.log('🔒 MongoDB connection closed via app termination.');
  process.exit(0);
};

// Listen for process termination signals
process.on('SIGINT', closeDB);  // Ctrl + C in terminal
process.on('SIGTERM', closeDB); // Termination signal from Docker / K8s / Heroku

module.exports = connectDB;