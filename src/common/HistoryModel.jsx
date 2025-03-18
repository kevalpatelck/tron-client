import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HistoryModel = ({ show, onClose, walletAddress }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedText, setExpandedText] = useState(null);

  useEffect(() => {
    if (show && walletAddress) {
      fetchTransactionHistory();
    }
  }, [show, walletAddress]);

  // const fetchTransactionHistory = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const response = await fetch(
  //       `http://localhost:4444/api/tron/transactions?address=${walletAddress}`
  //     );
  //     const data = await response.json();

  //     if (data.success && data.data.message.success) {
  //       const apiTransactions = data.data.message.transactions.map((txn) => ({
  //         txID: txn.txID,
  //         amount: txn.raw_data.contract[0].parameter.value.amount / 1e6 + " TRX",
  //         owner_address: txn.raw_data.contract[0].parameter.value.owner_address,
  //         to_address: txn.raw_data.contract[0].parameter.value.to_address,
  //       }));
  //       setTransactions(apiTransactions);
  //     } else {
  //       setError("Failed to fetch transactions.");
  //     }
  //   } catch (error) {
  //     setError("Error fetching transaction history.");
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTransactionHistory = async () => {
    if (!walletAddress) {
        setError("Wallet address is missing.");
        return;
    }

    setLoading(true);
    setError("");

    try {
        console.log("Fetching transactions for:", walletAddress);
        
        const response = await fetch(
            `http://localhost:4444/api/tron/transactions?address=${walletAddress}`
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging log

        if (data?.success && data?.data?.message?.success) {
            const apiTransactions = data.data.message.transactions?.map((txn) => ({
                txID: txn.txID || "N/A",
                amount: txn.raw_data?.contract?.[0]?.parameter?.value?.amount
                    ? txn.raw_data.contract[0].parameter.value.amount / 1e6 + " TRX"
                    : "N/A",
                owner_address: txn.raw_data?.contract?.[0]?.parameter?.value?.owner_address || "N/A",
                to_address: txn.raw_data?.contract?.[0]?.parameter?.value?.to_address || "N/A",
            })) || [];

            setTransactions(apiTransactions);
        } else {
            setError("Failed to fetch transactions. Invalid response format.");
        }
    } catch (error) {
        setError("Error fetching transaction history.");
        console.error("Fetch Error:", error);
    } finally {
        setLoading(false);
    }
};


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-xl w-[600px] border border-gray-300 z-50 ${show ? "block" : "hidden"}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Transaction History</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : transactions.length > 0 ? (
        <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">TxID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">From</th>
                <th className="p-3">To</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.txID} className="border-b border-gray-300 hover:bg-gray-100">
                  <td
                    className="p-3 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setExpandedText(txn.txID)}
                  >
                    {txn.txID.substring(0, 10)}...
                  </td>
                  <td className="p-3">{txn.amount}</td>
                  <td
                    className="p-3 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setExpandedText(txn.owner_address)}
                  >
                    {txn.owner_address.substring(0, 10)}...
                  </td>
                  <td
                    className="p-3 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setExpandedText(txn.to_address)}
                  >
                    {txn.to_address.substring(0, 10)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No Transactions Found</p>
      )}

      <div className="flex justify-center mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTransactions([]);
            onClose();
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform"
        >
          Close
        </motion.button>
      </div>

      {expandedText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setExpandedText(null)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
            <p className="text-lg font-medium text-gray-800 break-all">{expandedText}</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setExpandedText(null)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HistoryModel;