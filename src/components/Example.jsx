import { useState } from "react";

const TransactionHistory = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch("http://localhost:4444/api/tron/transactions?address=TBRo4SycPuurP872iV6rdttuYeFa2DUNyz"); // Replace with your API endpoint
      const data = await response.json();

      if (data.success && data.data.message.success) {
        const apiTransactions = data.data.message.transactions.map((txn) => ({
          txID: txn.txID,
          amount: txn.raw_data.contract[0].parameter.value.amount / 1e6 + " TRX", // Converting to TRX (assuming TRX is in Sun)
          owner_address: txn.raw_data.contract[0].parameter.value.owner_address,
          to_address: txn.raw_data.contract[0].parameter.value.to_address,
        }));

        setTransactions(apiTransactions);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  return (
    <div className="relative">
      {/* History Button */}
      <button
        onClick={() => {
          setIsHistoryOpen(true);
          fetchTransactionHistory();
        }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-9-9"
          />
        </svg>
        Transaction History
      </button>

      {/* Transaction History Modal */}
      {isHistoryOpen && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg w-96 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Transaction History</h2>

          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-400 text-gray-700">
                  <th className="p-2">TxID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <tr key={txn.txID} className="border-b border-gray-300 hover:bg-gray-100">
                      <td className="p-2 truncate max-w-xs">{txn.txID.substring(0, 10)}...</td>
                      <td className="p-2">{txn.amount}</td>
                      <td className="p-2 truncate max-w-xs">{txn.owner_address.substring(0, 10)}...</td>
                      <td className="p-2 truncate max-w-xs">{txn.to_address.substring(0, 10)}...</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No Transactions Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Close Button */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
