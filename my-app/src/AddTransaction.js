import React, { useState, useEffect } from "react";
import axios from "axios";

function AddTransaction({
  fetchTransactions,
  transactionToEdit,
  setTransactionToEdit,
  categories,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (transactionToEdit) {
      setAmount(transactionToEdit.amount);
      setCategory(transactionToEdit.category._id);
      setDate(transactionToEdit.date);
      setDescription(transactionToEdit.description);
    }
  }, [transactionToEdit]);

  // Sanitization function
  const sanitizeInput = (input) => {
    // Remove leading/trailing whitespace and strip potential harmful characters
    return input.replace(/[<>]/g, "").trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sanitize input fields
    const sanitizedTransactionData = {
      amount: sanitizeInput(amount),
      category: sanitizeInput(category),
      date: sanitizeInput(date),
      description: sanitizeInput(description),
    };

    if (transactionToEdit) {
      // Editing an existing transaction
      axios
        .put(
          `http://localhost:5001/api/transactions/${transactionToEdit._id}`,
          sanitizedTransactionData
        )
        .then(() => {
          fetchTransactions();
          setTransactionToEdit(null); // Reset after editing
        })
        .catch((error) => {
          console.error("Error editing transaction:", error);
        });
    } else {
      // Adding a new transaction
      axios
        .post("http://localhost:5001/api/transactions", sanitizedTransactionData)
        .then(() => {
          fetchTransactions();
        })
        .catch((error) => {
          console.error("Error adding transaction:", error);
        });
    }

    // Clear form
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
  };

  return (
    <div>
      <h2>{transactionToEdit ? "Edit Transaction" : "Add Transaction"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {sanitizeInput(cat.name)}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {transactionToEdit ? "Update" : "Add"} Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;