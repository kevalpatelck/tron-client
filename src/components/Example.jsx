import { useState } from "react";
import { motion } from "framer-motion";

const WalletPopup = ({ selectedAccount, setSelectedAccount }) => {
  if (!selectedAccount) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute right-0 top-10 bg-white p-4 rounded-lg shadow-xl w-64"
      >
        <h2 className="text-sm font-semibold text-gray-800 mb-2 text-center">
          🔑 Private Key
        </h2>

        {/* Private Key Display */}
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
          <span className="font-mono text-xs truncate">
            {selectedAccount.showPrivateKey
              ? selectedAccount.privateKey
              : "•".repeat(selectedAccount.privateKey.length)}
          </span>
          <button
            onClick={() =>
              setSelectedAccount((prev) => ({
                ...prev,
                showPrivateKey: !prev.showPrivateKey,
              }))
            }
            className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
          >
            {selectedAccount.showPrivateKey ? "Hide" : "Show"}
          </button>
        </div>

        {/* Copy Button */}
        <button
          onClick={() => navigator.clipboard.writeText(selectedAccount.privateKey)}
          className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition-all duration-200 text-sm"
        >
          📋 Copy
        </button>

        {/* Close Button */}
        <button
          onClick={() => setSelectedAccount(null)}
          className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded-md transition-all duration-200 text-sm"
        >
          ✖ Close
        </button>
      </motion.div>
    </div>
  );
};

export default function WalletComponent() {
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div className="relative p-5">
      <div className="flex items-center space-x-2">
        <span className="text-gray-700 text-sm">Wallet ID: 12345</span>
        {/* Eye Icon Button */}
        <button
          onClick={() =>
            setSelectedAccount({ privateKey: "abc123xyz789", showPrivateKey: false })
          }
          className="text-blue-600 hover:text-blue-800"
        >
          👁️
          👁️
        </button>
      </div>

      {/* Popup near the eye button */}
      {selectedAccount && (
        <WalletPopup selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
      )}
    </div>
  );
}
