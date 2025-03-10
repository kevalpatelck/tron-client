import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const WalletDataDisplay = () => {
  const [formData, setFormData] = useState({ UID: "", userName: "" });
  const [subAccountDetails, setSubAccountDetails] = useState([]);
  const [mainwalletAddress, setMainWalletAddress] = useState('');
  const [mainBalance, setMainBalance] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleConnectTron = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      const walletAddress = window.tronWeb.defaultAddress.base58;
      setMainWalletAddress(walletAddress);

      try {
        if (walletAddress && window.tronWeb) {
          const balanceInSun = await window.tronWeb.trx.getBalance(walletAddress);
          const balanceInTrx = window.tronWeb.fromSun(balanceInSun);
          setMainBalance(balanceInTrx);
        }

        toast.success("Tron Wallet Connected Successfully");

        const response = await fetch("http://localhost:4444/api/tron/get-details");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.data?.subAccountDetails?.length > 0) {
          const subAccount = data.data.subAccountDetails[0];
          setSubAccountDetails(data.data.subAccountDetails);
          setFormData({ UID: subAccount.UID, userName: subAccount.userName });
        } else {
          setError("No sub-account details available.");
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      alert("TronLink is not installed or not ready.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4444/api/tron/sub-account", formData);
      toast.success("Sub Account Created Successfully");
    } catch (error) {
      alert("Error in posting data");
    }
    handleConnectTron();
    setIsFormOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMainWalletAddress(null);
    setMainBalance(null);
    setError('');
  };

  return (
    <div className={`h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center py-3">
        <h1 className="text-xl font-bold">Wallet Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => setIsFormOpen(true)} 
              className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
            >
              Create Sub Account
            </button>
          )}
          <button 
            onClick={handleConnectTron} 
            className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-md"
          >
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-500 text-white p-2 rounded-md mt-2">{error}</div>}

      {/* Wallet Address & Balance */}
      <div className="p-4 rounded-lg shadow-md bg-gray-200 mt-4">
        <p><strong>Main Wallet:</strong> {mainwalletAddress || "Please connect Tron wallet"}</p>
        <p><strong>Balance:</strong> {mainBalance || "Please connect Tron wallet"}</p>
      </div>

      {/* Sub Account Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Wallet Address</th>
              <th className="py-2 px-4">Balance</th>
            </tr>
          </thead>
          <tbody>
            {subAccountDetails.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{account.UID}</td>
                <td className="py-2 px-4">{account.userName}</td>
                <td className="py-2 px-4">{account.address}</td>
                <td className="py-2 px-4">{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create Sub Account</h2>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold mb-1">UID:</label>
              <input 
                type="text" 
                name="UID"
                onChange={(e) => setFormData({ ...formData, UID: e.target.value })} 
                className="w-full p-2 border rounded-md mb-3 dark:bg-gray-700"
                placeholder="Enter UID"
              />
              <label className="block text-sm font-semibold mb-1">Name:</label>
              <input 
                type="text" 
                name="userName"
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })} 
                className="w-full p-2 border rounded-md mb-3 dark:bg-gray-700"
                placeholder="Enter Name"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-md">
                  Add Sub Account
                </button>
                <button onClick={() => setIsFormOpen(false)} className="bg-gray-500 text-white px-3 py-1 rounded-md">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDataDisplay;
