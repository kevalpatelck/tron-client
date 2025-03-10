import { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function TransactionHistoryPopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Sample transaction history
  const transactions = [
    { id: 1, amount: "$100", date: "2025-03-07", status: "Completed" },
    { id: 2, amount: "$250", date: "2025-03-06", status: "Pending" },
    { id: 3, amount: "$75", date: "2025-03-05", status: "Completed" },
  ];

  return (
    <div className="p-4 relative">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 text-center">
              <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Transparent Popup */}
      {isOpen && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg w-96 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Transaction History</h2>

          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-400 text-gray-700">
                  <th className="p-2">Amount</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-300 hover:bg-gray-100">
                    <td className="p-2">{txn.amount}</td>
                    <td className="p-2">{txn.date}</td>
                    <td className={`p-2 font-semibold ${txn.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                      {txn.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => alert("Transferred to Main Account!")}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              Transfer to Main
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
