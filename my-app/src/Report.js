import React, { useState, useEffect } from "react";
import axios from "axios";

function Report() {
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [reportData, setReportData] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch categories for the dropdown
    axios
      .get("http://localhost:5001/api/transactions/categories")
      .then((response) => setCategories(response.data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      });
  }, []);

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setError(""); // Clear any existing errors
    axios
      .get("http://localhost:5001/api/transactions/report", {
        params: { startDate, endDate, category },
      })
      .then((response) => {
        setReportData(response.data.transactions);
        setStatistics(response.data.statistics);
      })
      .catch((err) => {
        console.error("Error generating report:", err);
        setError("Failed to generate the report. Please try again.");
      });
  };

  return (
    <div>
      <h2>Generate Report</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleGenerateReport}>Generate Report</button>

      {statistics.transactionCount ? (
        <div>
          <h3>Statistics</h3>
          <p>Total Transactions: {statistics.transactionCount}</p>
          <p>Total Amount: ${statistics.totalAmount.toFixed(2)}</p>
          <p>Average Amount: ${statistics.averageAmount.toFixed(2)}</p>
        </div>
      ) : null}

      <h3>Report</h3>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length > 0 ? (
            reportData.map((transaction) => (
              <tr key={transaction._id}>
                <td>${transaction.amount}</td>
                <td>{transaction.category?.name || "N/A"}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description || "No description"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No transactions found for the selected criteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Report;