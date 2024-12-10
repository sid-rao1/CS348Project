const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Food', 'Expense'], required: true }
});

// Add unique index for the combination of `name` and `type`
CategorySchema.index({ name: 1, type: 1 }, { unique: true });

// Add text index for `name` to allow text search
CategorySchema.index({ name: "text" });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;