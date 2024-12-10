import React from "react";
import axios from "axios";

function TransactionTable({ transactions, setTransactionToEdit, fetchTransactions }) {
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5001/api/transactions/${id}`)
      .then(() => {
        fetchTransactions();
      })
      .catch((error) => {
        console.error("Error deleting transaction:", error);
      });
  };

  return (
    <div>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.amount}</td>
              <td>{transaction.category.name}</td>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>
                <button onClick={() => setTransactionToEdit(transaction)}>Edit</button>
                <button onClick={() => handleDelete(transaction._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;