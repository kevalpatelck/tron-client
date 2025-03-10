import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WalletDataDisplay = () => {
  const [formData, setFormData] = useState({
    UID: "",
    userName: "",
  });
  const [subAccountDetails, setSubAccountDetails] = useState([]);
  const [mainwalletAddress, setmainWalletAddress] = useState("");
  const [mainBalance, setmainBalance] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const openForm = () => {
    setIsFormOpen(true);
  };

  const handleConnectTron = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      const walletAddress = window.tronWeb.defaultAddress.base58;
      setmainWalletAddress(walletAddress);

      try {
        if (walletAddress && window.tronWeb) {
          const balanceInSun = await window.tronWeb.trx.getBalance(walletAddress);
          const balanceInTrx = window.tronWeb.fromSun(balanceInSun);
          setmainBalance(balanceInTrx);
        }

        toast.success("Tron Wallet Connected Successfully", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored",
        });

        const response = await fetch("http://localhost:4444/api/tron/get-details");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data.subAccountDetails)) {
          setSubAccountDetails(data.data.subAccountDetails);
          if (data.data.subAccountDetails.length > 0) {
            const subAccount = data.data.subAccountDetails[0];
            setFormData({
              UID: subAccount.UID,
              userName: subAccount.userName,
            });
          }
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

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4444/api/tron/sub-account", formData);
      toast.success("Sub Account Created Successfully", {
        position: "top-right",
        autoClose: 1500,
        theme: "colored",
      });
    } catch (error) {
      alert("Error in posting data");
    }
    handleConnectTron();
    closeForm();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setmainWalletAddress(null);
    setmainBalance(null);
    setError("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Top Bar */}
      <div className="bg-gray-800 dark:bg-gray-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Wallet Dashboard</h1>
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={openForm}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Create Sub Account
            </button>
          )}
          <button
            onClick={handleConnectTron}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Connect Wallet
          </button>

          {/* Theme Toggle Button */}

        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md m-3">{error}</div>
      )}

      {/* Wallet Details */}
      <div className="flex flex-col space-y-3 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg m-3">
        <div className="text-sm">
          <strong>MainWallet Address:</strong> {mainwalletAddress || "Please connect Tron wallet first"}
        </div>
        <div className="text-sm">
          <strong>MainWallet Balance:</strong> {mainBalance || "Please connect Tron wallet first"}
        </div>
      </div>

      {/* Sub Account Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md m-3">
        <table className="w-full">
          <thead className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white">
            <tr>
              <th className="py-2 px-4">Id</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Wallet Address</th>
              <th className="py-2 px-4">Balance</th>
            </tr>
          </thead>
          <tbody>
            {subAccountDetails.map((account) => (
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-600" key={account.id}>
                <td className="py-2 px-4">{account.UID}</td>
                <td className="py-2 px-4">{account.userName}</td>
                <td className="py-2 px-4">{account.address}</td>
                <td className="py-2 px-4">{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sub Account Form */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Create Sub Account</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="w-full p-2 mb-3 border rounded dark:bg-gray-600"
                type="text"
                name="UID"
                placeholder="Enter UID"
                onChange={handleChange}
              />
              <input
                className="w-full p-2 mb-3 border rounded dark:bg-gray-600"
                type="text"
                name="userName"
                placeholder="Enter Name"
                onChange={handleChange}
              />
              <button className="bg-blue-500 text-white py-2 px-4 rounded">Add</button>
              <button onClick={closeForm} className="ml-2 text-red-500">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDataDisplay;
