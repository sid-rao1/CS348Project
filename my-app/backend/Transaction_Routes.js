const express = require("express");
const Transaction = require("./Transaction"); // Direct reference to model
const Category = require("./Category"); // Direct reference to model

const router = express.Router();



// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("category").exec();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate a report based on filters (startDate, endDate, category).
 * Includes calculated statistics.
 */
router.get("/report", async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const filter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
start.setHours(0, 0, 0, 0); // Start of the day

const end = new Date(endDate);
end.setHours(23, 59, 59, 999); // End of the day

filter.date = { $gte: start, $lte: end };
    }
    if (category) {
      filter.category = category;
    }

    // Fetch filtered transactions
    const transactions = await Transaction.find(filter)
      .populate("category", "name") // Populate only the 'name' field of category
      .exec();

    // Calculate statistics
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageAmount =
      transactions.length > 0 ? totalAmount / transactions.length : 0;
    const transactionCount = transactions.length;

    const statistics = { totalAmount, averageAmount, transactionCount };

    // Return transactions and statistics
    res.status(200).json({ transactions, statistics });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report." });
  }
});

/**
 * Add a new transaction to the database.
 */
router.post("/", async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transaction = new Transaction({ amount, category, date, description });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction." });
  }
});

/**
 * Edit an existing transaction by ID.
 */
router.put("/:id", async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date || !description) {
      return res.status(400).json({ error: "All fields are required for update." });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, category, date, description },
      { new: true } // Return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Failed to update transaction." });
  }
});

/**
 * Delete a transaction by ID.
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Failed to delete transaction." });
  }
});

/**
 * Get all categories for dropdown selection.
 */
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories." });
  }
});


module.exports = router;