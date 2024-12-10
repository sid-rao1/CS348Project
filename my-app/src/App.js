import React, { useState, useEffect } from "react";
import AddTransaction from "./AddTransaction";
import TransactionTable from "./TransactionTable";
import Report from "./Report";
import axios from "axios";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const fetchTransactions = () => {
    axios
      .get("http://localhost:5001/api/transactions")
      .then((response) => setTransactions(response.data))
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:5001/api/transactions/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  return (
    <div className="App">
      <h1>Finance Tracker</h1>

      {/* Add Transaction Form */}
      <AddTransaction
        fetchTransactions={fetchTransactions}
        transactionToEdit={transactionToEdit}
        setTransactionToEdit={setTransactionToEdit}
        categories={categories}
      />

      {/* Transaction Table */}
      <TransactionTable
        transactions={transactions}
        setTransactionToEdit={setTransactionToEdit}
        fetchTransactions={fetchTransactions}
      />

      {/* Report Component */}
      <Report />
    </div>
  );
}

export default App;