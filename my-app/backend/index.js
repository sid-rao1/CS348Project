const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./Transaction_Routes'); // Import the transaction routes

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/finance-tracker';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the transaction routes
app.use('/api/transactions', transactionRoutes);  // Routes for transaction operations

// Start Server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
