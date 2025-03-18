import React, { useState, useEffect, useRef } from 'react';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import HistoryModel from '../common/HistoryModel';
import TransactionHistoryModal from '../common/TransactionHistoryModal';
import { MoveDownLeft, MoveUpRight } from 'lucide-react';
import SliderImage from '../slider/Sliderimage';
import PopupModal from '../slider/PopupModal';
import moment from 'moment';
import { Info, X } from 'lucide-react';
import { b, main } from 'framer-motion/client';

const WalletDataDisplay = () => {
  // State declarations
  const [formData, setFormData] = useState({
    UID: "",
    userName: ""
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isHistoryOpen, setisHistoryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [subAccountDetails, setSubAccountDetails] = useState([]);
  const [mainwalletAddress, setmainWalletAddress] = useState('');
  const [mainBalance, setmainBalance] = useState('');
  const [mainUsdtBalance, setmainUsdtBalance] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [show, setShow] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [slideisOpen, setSlideIsOpen] = useState(false);
  const [dropdownOpen, setdropdownOpen] = useState("");
  const [loading, setLoading] = useState(false);
  // const [isrefreshbalance, SetIsRefreshBalanace] = useState(false);
  const [refreshingBalances, setRefreshingBalances] = useState({});
  const [subAccountTransactions, setSubAccountTransactions] = useState({});
  const [expandedText, setExpandedText] = useState(null);
  const [isBalance, setisBalance] = useState("");
  const [isvalidaBalance, setisvalidaBalance] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const rowRefs = useRef({});

  const getSubAccounts = async (wallet) => {
    const response = await fetch(`http://localhost:4444/api/tron/get-sub-id?address=${wallet}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data &&
      Array.isArray(data.data.SubAccounts) &&
      data.data.SubAccounts.length > 0
      ? data.data.SubAccounts
      : [];
  };

  // On component mount, load wallet address from sessionStorage (if exists)
  useEffect(() => {
    fetchwalletAddress();
  }, []);

  const fetchwalletAddress = async () => {
    setLoading(true);
    try {
      const storedWallet = sessionStorage.getItem("mainWalletAddress");
      if (storedWallet && window.tronWeb && window.tronWeb.ready) {
        setmainWalletAddress(storedWallet);
        setIsLoggedIn(true);

        // Get wallet balance in TRX
        try {
          const balanceInSun = await window.tronWeb.trx.getBalance(storedWallet);
          setmainBalance(window.tronWeb.fromSun(balanceInSun));
          console.log("main wallet balance stored",mainBalance);
          
          console.log("main wallet adress stored",storedWallet);
          

       
          
        } catch (balanceErr) {
          console.error("Error fetching balance for stored wallet:", balanceErr);
        }
      }
      const subAccounts = await getSubAccounts(storedWallet);
      if (subAccounts.length > 0) {
        setSubAccountDetails(subAccounts);
      }
    } catch (error) {
      console.error("Error fetching sub accounts:", error);
    } finally {
      setLoading(false);
    }
  }

  // Highlight newly created sub account (scroll into view)
  useEffect(() => {
    if (highlightId && rowRefs.current[highlightId]) {
      rowRefs.current[highlightId].scrollIntoView({ behavior: "smooth", block: "start" });
      const timer = setTimeout(() => setHighlightId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  // UI Handlers
  const openForm = () => setIsFormOpen(true);
  const cancelForm = () => setIsOpen(false);


  const togglePopup = (account) => {
    setSelectedAccount(account);
    setShowPrivateKey(false);
    console.log("Selected Account:", account.address);
    
  };
  const copyToClipboard = () => {
    alert("Private Key copied");
    navigator.clipboard.writeText(selectedAccount?.privateKey);
    // setSlideIsOpen(true);
    setModalOpen(true);
  };
  const closeModal = () => setIsOpen(false);


  // Connect Tron wallet and fetch sub accounts and balance
  const handleConnectTron = async (skipWalletToast = false) => {
    if (window.tronWeb && window.tronWeb.ready) {
      const walletAddress = window.tronWeb.defaultAddress.base58;
      setmainWalletAddress(walletAddress);
      sessionStorage.setItem("mainWalletAddress", walletAddress);
      try {
        const balanceInSun = await window.tronWeb.trx.getBalance(walletAddress);
        setmainBalance(window.tronWeb.fromSun(balanceInSun));        
        console.log("main wallet balance",mainBalance);
      

        if (skipWalletToast) {
          toast.success("Tron Wallet Connected Successfully", {
            position: "top-right",
            autoClose: 1500,
            theme: "colored"
          });
        }

        const subAccounts = await getSubAccounts(walletAddress);
        if (subAccounts.length > 0) {
          setSubAccountDetails(subAccounts);
          // Pre-fill form with the first sub account details
          setFormData({ UID: subAccounts[0].UID, userName: subAccounts[0].userName });
        } else {
          console.error("No subAccountDetails found.");
          setSubAccountDetails([]);
          setTimeout(() => {
            toast.error("No subAccounts found", {
              position: "top-right",
              autoClose: 1500,
              theme: "colored"
            });
          }, 1000);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      }
    } else {
      alert("TronLink is not installed or not ready.");
    }
  };
 
  // Refresh the balance for a specific sub account (by UID)
  const refreshBalance = async (uid) => {
    setRefreshingBalances(prev => ({ ...prev, [uid]: true }));
    try {
      // Optionally refresh full sub account details
      const subAccounts = await getSubAccounts(mainwalletAddress);
      if (subAccounts.length > 0) {
        setSubAccountDetails(subAccounts);
      }
      const account = subAccountDetails.find(acc => acc.UID === uid);
      if (!account) {
        toast.error("Account not found", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored"
        });
        return;
      }
      if (account.address && window.tronWeb && window.tronWeb.ready) {
        const balanceInSun = await window.tronWeb.trx.getBalance(account.address);
        const balanceInTrx = window.tronWeb.fromSun(balanceInSun);
        setSubAccountDetails(prev =>
          prev.map(acc => (acc.UID === uid ? { ...acc, Balance: balanceInTrx } : acc))
        );
        toast.success(`Balance refreshed for account ${uid}`, {
          position: "top-right",
          autoClose: 1500,
          theme: "colored"
        });
      } else {
        toast.error("TronWeb not available or account address is missing.", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored"
        });
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
      toast.error("Failed to refresh balance", {
        position: "top-right",
        autoClose: 1500,
        theme: "colored"
      });
    } finally {
      setRefreshingBalances(prev => ({ ...prev, [uid]: false }));
    }
  };

  // Submit form for creating a new sub account
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4444/api/tron/create-sub", formData);
      setHighlightId(response?.data?.data?.subAccount?.UID);
      if (response?.data?.success) {
        toast.success("Account Created Successfully", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored"
        });
      } else {
        toast.error("Account Already exists", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored"
        });
      }
      removeHighlight();
    } catch (error) {
      console.error("Error in posting data:", error);
      alert("Error in posting data");
    }
    handleConnectTron();
    closeForm();
  };

  const closeForm = () => setIsFormOpen(false);

  // Logout handler: clears wallet data and sessionStorage
  const handleLogout = () => {
    setIsLoggedIn(false);
    setmainWalletAddress('');
    setmainBalance('');
    setError('');
    sessionStorage.removeItem("mainWalletAddress");
  };

  const removeHighlight = () => setTimeout(() => setHighlightId(null), 2000);
  const btnClose = () => setShow(false);

  const fetchTransactionHistory = async (wallet) => {
    setError("");
    try {
      const response = await fetch(
        `http://localhost:4444/api/tron/transactions?address=${wallet}`
      );
      const data = await response.json();

      if (data.success && data.data.message.success) {
        const apiTransactions = data.data.message.transactions.map((txn) => ({
          TXNtype: txn.TXNtype,
          txID: txn.txID,
          ownerAd: txn.raw_data.contract[0].parameter.value.owner_address,
          toAd: txn.raw_data.contract[0].parameter.value.to_address,
          amount: txn.raw_data.contract[0].parameter.value.amount / 1e6 + " TRX",
          time: txn.raw_data.timestamp
        }));

        setSubAccountTransactions(apiTransactions);
      } else {
        setError("Failed to fetch transactions.");
      }
    } catch (error) {
      setError("Error fetching transaction history.");
      console.error("Error:", error);
    }
  };

  const setDropdownOpen = (wallet) => {
    fetchTransactionHistory(wallet)
    setdropdownOpen(true)
  }

  const setDropdownClose = () => {
    setdropdownOpen(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const btnAdd = (Balance) => { 
    setisBalance(Balance)
    setIsOpen(true);
    console.log("Balance:", Balance);
    
  }



  const transferAmount = async () => {

    
    console.log("1",inputValue);
    console.log("2",isBalance);
    console.log("3",inputValue <= isBalance);

    if (Number(inputValue) > Number(isBalance)) {
      alert("Insufficient Balance");
      setisvalidaBalance("Insufficient Balance");
      return;
    }
    

    try {
            
      const response = await fetch("http://localhost:4444/api/tron/send-usdt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: inputValue }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Transfer successful!");
      } else {
        alert(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the server.");
    }

  }

  return (
    //main page content
    <div className={`relative flex flex-col h-screen`}>
      {/* Top Bar with Login/Logout */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Wallet Dashboard</h1>
        <div>
    
            <button
              onClick={openForm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ms-3"
            >
              Create Sub Account
            </button>
          
        </div>
        <button
          onClick={handleConnectTron}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-25"
        >
          Connect tron wallet
        </button>
      </div>

      {/* Error Message */}
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
            {mainwalletAddress ? mainwalletAddress : "Please connect Tron wallet"}
          </p>
        </div>

        <div className="flex items-end space-x-2 bg-gray-300 p-2 rounded-lg">
          <label className="font-semibold text-gray-700">MainWallet Balance:</label>
          <p className="text-blue-600 font-mono truncate">
            {mainBalance ? mainBalance : "Please connect Tron wallet"}
          </p>
        </div>
        <div className="flex items-end space-x-2 bg-gray-300 p-2 rounded-lg">
          <label className="font-semibold text-gray-700">Usdt Balance:</label>
          <p className="text-blue-600 font-mono truncate">
            {mainUsdtBalance ? mainUsdtBalance : "Please connect Tron wallet"}
          </p>
        </div>
        <button
          onClick={() => setShow(true)}
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

      {loading ? (
        <div className="flex justify-center items-center h-40">
          {/* Simple spinner using an SVG icon with Tailwind classes */}
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          {/* Sub Account Table */}
          <div className="overflow-x-auto max-h-150">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Id</th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Wallet Address</th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Trx-Balance</th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Usdt-Balance</th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Import</th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Transfer To Main</th>
                </tr>
              </thead>
              <tbody>
                {subAccountDetails.map((account) => (
                  <tr
                    key={account.id + 1}
                    ref={(el) => (rowRefs.current[account.UID] = el)}
                    className={`border ${highlightId === account?.UID ? "bg-yellow-200" : ""}`}
                  >
                    <td className="py-4 px-6 border-b border-gray-200">{account.UID}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{account.userName}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{account.address}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{account.TRXbalance}</td>
                    <td className="pt-7 pb-4 px-6 flex items-center justify-between">
                      <span className="font-semibold text-gray-700">{account.USDTBalance}</span>

                      <button
                        onClick={() => refreshBalance(account.UID)}
                        className={`
                          ${refreshingBalances[account.UID] ?
                            "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 "} text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110 flex items-center justify-center`}
                        disabled={refreshingBalances[account.UID]} // Only disables this button

                      >
                        {refreshingBalances[account.UID] ? (
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-arrow-clockwise"
                            viewBox="0 0 16 16"
                          >
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                          </svg>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 border-b border-gray-200">
                      <button onClick={() => togglePopup(account)} className="relative group">
                        👁️
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-32 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </div>
                      </button>
                    </td>

                    <td className="py-4 px-6 border-b border-gray-200">

                      <td className="border-gray-300 p-2 text-center gap-2">
                        <div className='flex items-center justify-center space-x-4'>
                          <button
                            onClick={() => btnAdd(account?.Balance)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-90"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setDropdownOpen(account.address)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedAccount && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-5 rounded-xl shadow-xl w-80"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              🔒 Private Key
            </h2>

            {/* Hidden Private Key */}
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <span className="font-mono text-sm truncate">
                {showPrivateKey
                  ? selectedAccount.privateKey
                  : "•".repeat(selectedAccount.privateKey.length)}
              </span>
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                {/* {showPrivateKey ? "Hide" : "Show"} */}
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              📋 Copy Private Key
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedAccount(null)}
              className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-all duration-200"
            >
              ✖ Close
            </button>
          </motion.div>
        </div>
      )}

{isOpen && (

  <div className="absolute right-48 mt-70 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg w-80 border border-gray-300">
    <h2 className="text-lg font-bold mb-4">Enter Amount</h2>
    <input
      type="text"
      placeholder="Enter Amount"
      value={inputValue}
      onChange={(e) => {
        const value = Number(e.target.value);
      
          setInputValue(value);
 
      }}
      
      className="w-full p-2 border border-gray-300 rounded-lg mb-4"
    />
    <div className="flex space-x-4 w-full">
      <button
        onClick={() => transferAmount()}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
      >
        Transfer to Main
      </button>

      <button
        onClick={() => cancelForm()}
        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
      >
        Cancel
      </button>
    </div>
  </div>
)}


      {dropdownOpen && (
        <div>
          <div className="fixed top-44 right-8 w-80">
            <div className="absolute right-0 top-full mt-2 w-72 h-64 overflow-auto bg-white shadow-lg rounded-lg p-4 backdrop-blur-sm border">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <div className='flex items-center'>
                  <Info size={20} color='blue' onClick={() => setisHistoryOpen(true)}></Info>
                  <button onClick={() => setDropdownClose()} className="text-red-500 hover:text-red-700 ps-2"><X /></button>
                </div>
              </div>
              <ul className="space-y-3">
                {subAccountTransactions &&
                  (Array.isArray(subAccountTransactions)
                    ? subAccountTransactions?.map((trans, index) => (
                      // <li key={index} className="flex justify-between items-center p-2 border-b">
                      //   <span className="text-lg text-green-500">{trans.TXNtype == "sent" ? <MoveUpRight color='red'/> : <MoveDownLeft color='green'/>}</span>
                      //   {trans.TXNtype == "sent" ? <span className='text-red-700'>-{trans.amount}</span> : <span className='text-green-700'>+{trans.amount}</span>} 
                      //   {moment(trans.time).format('DD-MM-YY')}<span className='text-gray-600 font-bold text-xs'>{moment(trans.time).format('HH:mm')} IST</span>
                      // </li>
                      <li
                        key={index}
                        className="flex justify-between items-center p-1 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {trans.TXNtype === "sent" ? (
                              <MoveUpRight color="red" />
                            ) : (
                              <MoveDownLeft color="green" />
                            )}
                          </div>
                          <div className="text-lg font-medium">
                            {trans.TXNtype === "sent" ? (
                              <span className="text-red-700">-{trans.amount}</span>
                            ) : (
                              <span className="text-green-700">+{trans.amount}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col text-right">
                          <div className='flex items-center'>
                            <span className="text-gray-600 pe-1 text-sm">{moment(trans.time).format('DD')}</span>
                            <span className="text-gray-600 text-sm">{moment(trans.time).format('MMMM')}</span>,
                            <span className="text-gray-600 ps-1 text-sm">{moment(trans.time).format('YY')}</span>
                          </div>
                          <span className="text-gray-500 text-xs font-medium">
                            {moment(trans.time).format('HH:mm')} IST
                          </span>
                        </div>


                      </li>

                    ))
                    : Object.values(subAccountTransactions)?.map((trans, index) => (
                      <li key={index} className="flex justify-between items-center p-2 border-b">
                        <span className="text-lg text-green-500">{trans.TXNtype == "sent" ? <MoveUpRight color='red' /> : <MoveDownLeft color='green' />}</span>
                        {trans.TXNtype == "sent" ? <span className='text-red-700'>-{trans.amount}</span> : <span className='text-green-700'>+{trans.amount}</span>}
                      </li>
                    )))}
                {/* {subAccountTransactions && (<>
                    {subAccountTransactions.map((trans) => {

                  <li className="flex justify-between items-center p-2 border-b">
                    <span className="text-lg text-green-500">{trans.TXNtype}⬆️</span>
                    <span>Received from John</span>

                  </li>
                    })}
                  </>)} */}

              </ul>
            </div>
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

      {/* History of SubAccount */}
      {isHistoryOpen && (<>
        {/* <p>RadheKrishna</p> */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-xl w-[600px] border border-gray-300 z-50`}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Transaction History</h2>

          {subAccountTransactions.length > 0 ? (
            <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-300">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-3"></th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">TxID</th>
                    <th className="p-3">Address</th>
                    {/* <th className="p-3">To</th> */}
                  </tr>
                </thead>
                <tbody>
                  {subAccountTransactions.map((txn) => (
                    <tr key={txn.txID} className="border-b border-gray-300 hover:bg-gray-100">
                      <td
                        className="p-3 cursor-pointer text-blue-600 hover:underline"
                      >
                        {txn.TXNtype === "sent" ? (
                          <MoveUpRight color="red" />
                        ) : (
                          <MoveDownLeft color="green" />
                        )}
                      </td>
                      <td className="p-3">{txn.amount}</td>
                      <td
                        className="p-3 cursor-pointer text-blue-600 hover:underline"
                        onClick={() => setExpandedText(txn.txID)}
                      >
                        {txn.txID.substring(0, 12)}...
                      </td>
                      {txn.TXNtype === "sent" ? (
                        <td
                          className="p-3 cursor-pointer text-blue-600 hover:underline"
                          onClick={() => setExpandedText(txn.toAd)}
                        >
                          {txn?.toAd?.substring(0, 12)}...
                        </td>
                      ) : (
                        <td
                          className="p-3 cursor-pointer text-blue-600 hover:underline"
                          onClick={() => setExpandedText(txn.ownerAd)}
                        >
                          {txn?.ownerAd?.substring(0, 12)}...
                        </td>
                      )}
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
                setisHistoryOpen(false)
                // setTransactions([]);
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
      </>)}
      <PopupModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <SliderImage />
      </PopupModal>

      
      <TransactionHistoryModal
        show={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        walletAddress={selectedWallet}
      />

      <HistoryModel show={show} onClose={btnClose} walletAddress={mainwalletAddress} />
    </div>
  );
};

export default WalletDataDisplay;
