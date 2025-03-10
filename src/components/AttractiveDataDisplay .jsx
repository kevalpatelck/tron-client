import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@headlessui/react";



const WalletDataDisplay = () => {
  const [formData, setFormData] = useState({
    UID: "",
    userName: ""
  });
  
  const [isHistoryOpen, setisHistoryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [subAccountDetails, setSubAccountDetails] = useState([]);
  const [mainwalletAddress, setmainWalletAddress] = useState('');
  const [mainBalance, setmainBalance] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {
    setIsFormOpen(true);
  };
  const cancelForm=()=>{
    setIsOpen(false)
    setisHistoryOpen(false)
  }

  const handleConnectTron = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      // Connect to the Tron wallet
      const walletAddress = window.tronWeb.defaultAddress.base58;
      setmainWalletAddress(walletAddress);

      try {
        // Fetch wallet balance in TRX
        if (walletAddress && window.tronWeb) {
          const balanceInSun = await window.tronWeb.trx.getBalance(walletAddress);
          const balanceInTrx = window.tronWeb.fromSun(balanceInSun);
          setmainBalance(balanceInTrx);
          console.log("Balance in Sun:", balanceInSun);
          console.log("Balance in TRX:", balanceInTrx);

          
        }

        toast.success("Tron Wallet Connected Successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
      });


        const response = await fetch(`http://localhost:4444/api/tron/get-sub?address=${walletAddress}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate if subAccountDetails exists and is not empty
        if (data.data && Array.isArray(data.data.SubAccounts) && data.data.SubAccounts.length > 0) {
          const subAccount = data.data.SubAccounts[0]; // Get the first sub-account
          console.log(subAccount.UID, "subAccount.UID");
          // window.location.reload()
          // Set subAccount details in the state
          setSubAccountDetails(data.data.SubAccounts);
          // Pre-fill the form with the fetched UID
          setFormData({
            UID: subAccount.UID, // Set UID from the fetched data
            userName: subAccount.userName // Set userName from the fetched data
          });
        } else {
          console.error("No subAccountDetails found in the API response.");
          setSubAccountDetails([])

          setTimeout(() => { 
            toast.error("No subAccounts found", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
          });
          },1000)
         
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message); // Set error message to be displayed
      }
    } else {
      alert("TronLink is not installed or not ready.");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    // isHistoryOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4444/api/tron/create-sub", formData);
      console.log("Response", response.data);
      // alert("Data submitted successfully");
      toast.success("Sub Account Created Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });
    } catch (error) {
      console.error("error in posting data:", error);
      alert("error in posting data");
    }
    handleConnectTron();
    closeForm();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setmainWalletAddress(null);
    setmainBalance(null);
    setError('');
  };


  const transactions = [
    { id: 1, amount: "$100", date: "2025-03-07", status: "Completed" },
    { id: 2, amount: "$250", date: "2025-03-06", status: "Pending" },
    { id: 3, amount: "$75", date: "2025-03-05", status: "Completed" },
  ];

  return (
    //main page content
    <div className="flex flex-col h-screen">
      {/* Top Bar with Login/Logout */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Wallet Dashboard</h1>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={openForm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Sub Account
            </button>
          )}
        </div>
        <button
          onClick={handleConnectTron}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-25"
        >
          Connect tron wallet
        </button>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* Wallet Address and Balance */}
      <div className="flex items-center justify-start space-x-4 bg-gray-200 p-4 rounded-lg">
        <div className="flex items-start space-x-2 bg-gray-300 p-2 rounded-lg">
          <label className="font-semibold text-gray-700">MainWallet Address:</label>
          <p className="text-blue-600 font-mono truncate">
            {mainwalletAddress ? mainwalletAddress : "Please connect Tron wallet first"}
          </p>
        </div>

        <div className="flex items-end space-x-2 bg-gray-300 p-2 rounded-lg">
          <label className="font-semibold text-gray-700">MainWallet Balance:</label>
          <p className="text-blue-600 font-mono truncate">
            {mainBalance ? mainBalance : "Please connect Tron wallet first"}
          </p>
        </div>
        <button
  onClick={() => setisHistoryOpen(true)}
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
</button>

      </div>


      {isHistoryOpen && (
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
               onClick={()=> cancelForm()}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sub Account Table */}
      <div className="overflow-x-auto max-h-150  ">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Id</th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Wallet Address</th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Balance</th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Transfer To Main</th>
              
            </tr>
          </thead>
          <tbody>
            {subAccountDetails.map((account) => (
              <tr className="hover:bg-gray-50" key={account.id}>
                <td className="py-4 px-6 border-b border-gray-200">{account.UID}</td>
                <td className="py-4 px-6 border-b border-gray-200">{account.userName}</td>
                <td className="py-4 px-6 border-b border-gray-200">{account.address}</td>
                <td className="py-4 px-6 border-b border-gray-200">{account.balance}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                <td className=" border-gray-300 p-2 text-center">
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

      {isOpen && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg w-80 border border-gray-300">
          <h2 className="text-lg font-bold mb-4">Enter Amount</h2>
          <input
            type="text"
            placeholder="Enter Amount"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
      <div className="flex space-x-4 w-full">
  <button
    onClick={() => cancelForm()}
    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
  >
    Transfer to Main
  </button>

  <button
    onClick={()=> cancelForm()}
    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
  >
    Cancel
  </button>
</div>
 
        </div>
      )}


      {/* Form to Create Sub Account */}
      {isFormOpen && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-96 bg-white rounded-lg shadow-xl p-8 z-50">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Sub Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="UID"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                UID:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="UID"  // Match the field name with the state
                // value={formData.UID} // Pre-fill with fetched value or allow editing
                onChange={handleChange}
                placeholder="Enter your Uid"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="userName"
                // value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your Name"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Sub Account
              </button>
              <button
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WalletDataDisplay;
