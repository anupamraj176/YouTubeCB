// 📁 server.js — Start Express app ONLY after DB connects successfully
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Execute DB Connection before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});