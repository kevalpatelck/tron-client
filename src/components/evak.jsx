import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const WalletDataDisplay = () => {
  const [formData, setFormData] = useState({ UID: "", userName: "" });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [openRow, setOpenRow] = useState(null);
  const [isHistoryOpen, setisHistoryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [subAccountDetails, setSubAccountDetails] = useState([]);
  const [mainwalletAddress, setmainWalletAddress] = useState('');
  const [mainBalance, setmainBalance] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [highlightId, setHighlightId] = useState(null); // Store newly created ID

  const rowRefs = useRef({});

  useEffect(() => {
    if (highlightId && rowRefs.current[highlightId]) {
      rowRefs.current[highlightId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Remove highlight after 2 seconds
      const timer = setTimeout(() => {
        setHighlightId(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4444/api/tron/create-sub", formData);
      console.log("Response", response?.data);

      setHighlightId(response?.data?.data?.subAccount?.UID); // Highlight the newly created sub-account

      if (response?.data?.success) {
        toast.success("Account Created Successfully", { position: "top-right", autoClose: 1500, theme: "colored" });
      } else {
        toast.error("Account Already Exists", { position: "top-right", autoClose: 1500, theme: "colored" });
      }
    } catch (error) {
      console.error("Error in posting data:", error);
      alert("Error in posting data");
    }
    handleConnectTron();
    closeForm();
  };

  return (
    <div className="overflow-x-auto max-h-150">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Id</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Name</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Wallet Address</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Balance</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Import</th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">Transfer To Main</th>
          </tr>
        </thead>
        <tbody>
          {subAccountDetails.map((account) => (
            <tr
              key={account.id}
              ref={(el) => (rowRefs.current[account.UID] = el)}
              className={`border ${highlightId === account?.UID ? "bg-yellow-200" : ""}`}
            >
              <td className="py-4 px-6 border-b border-gray-200">{account.UID}</td>
              <td className="py-4 px-6 border-b border-gray-200">{account.userName}</td>
              <td className="py-4 px-6 border-b border-gray-200">{account.address}</td>
              <td className="py-4 px-6 border-b border-gray-200">{account.balance}</td>
              <td className="py-4 px-6 border-b border-gray-200">
                <button onClick={() => togglePopup(account)} className="relative group">
                  👁️
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-32 bg-black text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                  </div>
                </button>
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                <td className="border-gray-300 p-2 text-center">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Add
                  </button>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletDataDisplay;
