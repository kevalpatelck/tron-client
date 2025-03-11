import { useState } from "react";

export default function SubAccountTable({ subAccountDetails }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const togglePopup = (account) => {
    setSelectedAccount(account);
    setShowPrivateKey(false); // Reset private key visibility
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedAccount?.privateKey);
    alert("Private Key Copied!");
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">UID</th>
              <th className="px-4 py-2 border">User Name</th>
              <th className="px-4 py-2 border">Wallet Address</th>
              <th className="px-4 py-2 border">Balance</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {subAccountDetails.map((account) => (
              <tr key={account._id} className="border">
                <td className="px-4 py-2 border">{account.UID}</td>
                <td className="px-4 py-2 border">{account.userName}</td>
                <td className="px-4 py-2 border">{account.address}</td>
                <td className="px-4 py-2 border">{account.balance}</td>
                <td className="px-4 py-2 border text-center">
                  {/* Eye Icon Button */}
                  <button onClick={() => togglePopup(account)} className="relative group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-eye-fill text-gray-600 hover:text-blue-600 transition"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                    </svg>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-32 bg-black text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Box */}
      {selectedAccount && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Private Key</h2>

            {/* Hidden Private Key */}
            <div className="flex items-center justify-between bg-gray-200 p-3 rounded-lg">
              <span className="font-mono">
                {showPrivateKey
                  ? selectedAccount.privateKey
                  : "•".repeat(selectedAccount.privateKey.length)}
              </span>
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                {showPrivateKey ? "Hide" : "Show"}
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Copy Private Key
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedAccount(null)}
              className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
k