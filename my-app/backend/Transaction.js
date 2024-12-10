const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },  // Amount is required
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',  // Reference to Category model
    required: true 
  },  
  date: { 
    type: Date, 
    required: true 
  },  
  description: { 
    type: String, 
    required: true 
  },
});

// Index for range queries on `date`
transactionSchema.index({ date: 1 });

// Index for filtering by `category`
transactionSchema.index({ category: 1 });

// Compound index for filtering by `date` and `category`
transactionSchema.index({ date: 1, category: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
