const mongoose = require('mongoose');
const Category = require('./Category');

const MONGO_URI = 'mongodb://127.0.0.1:27017/finance-tracker';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Categories to be added
    const categories = [
      { name: 'Salary', type: 'Income' },
      { name: 'Food', type: 'Expense' },
      { name: 'Rent', type: 'Expense' },
      { name: 'Gas', type: 'Expense' },
      { name: 'Entertainment', type: 'Expense' },
      { name: 'Other Expense', type: 'Expense' },
    ];

    // Insert categories into the database
    Category.insertMany(categories)
      .then(() => {
        console.log("Categories added successfully!");
        mongoose.disconnect();  // Disconnect after seeding is done
      })
      .catch((err) => {
        console.error("Error inserting categories:", err);
        mongoose.disconnect();
      });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
