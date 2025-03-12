import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import HistoryModel from '../common/HistoryModel';
import TransactionHistoryModal from '../common/TransactionHistoryModal';
import { tr } from 'framer-motion/client';


const WalletDataDisplay = () => {
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
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [show, setShow] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [slideisOpen, slidesetIsOpen] = useState(false);
  const [dropdownOpen, setdropdownOpen] = useState([]);



  const setDropdownOpen = () => {
    setdropdownOpen(true)
    console.log(dropdownOpen,"this is open");
    
  }

  const[]=useState(false)

  const handleViewTransactions = (wallet) => {
    setSelectedWallet(wallet);
    setShowTransactionModal(true);
    console.log("walletADDRESS=======>", wallet);

  };


  // the 2 second top logic


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




  // Store newly created ID
  console.log("highlightId", highlightId)
  const openForm = () => {
    setIsFormOpen(true);
  };
  const cancelForm = () => {
    setIsOpen(false)
    setisHistoryOpen(false)
  }




  const togglePopup = (account) => {
    setSelectedAccount(account);
    setShowPrivateKey(false); // Reset private key visibility
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedAccount?.privateKey);

    slidesetIsOpen(true);
    // alert("Private Key Copied!");
  };
  const closeModal = () => {
    setIsOpen(false);
  };


  console.log("selectedAccount=====>", selectedAccount);

  const handleConnectTron = async (skipWalletToast = false) => {
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

        if (skipWalletToast) {
          toast.success("Tron Wallet Connected Successfully", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        }


        const response = await fetch(`http://localhost:4444/api/tron/get-sub-id?address=${walletAddress}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate if subAccountDetails exists and is not empty
        if (data.data && Array.isArray(data.data.SubAccounts) && data.data.SubAccounts.length > 0) {
          const subAccount = data.data.SubAccounts[0]; // Get the first sub-account
          console.log(subAccount, "subAccount.UID");
          console.log("subAccountDetails", data.data.SubAccounts);

          // window.location.reload()
          // Set subAccount details in the state
          setSubAccountDetails(data.data.SubAccounts);
          // console.log("accountId=====>",accountId);

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
          }, 1000)

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
      console.log("Response", (response?.data));
      // alert("Data submitted successfully");
      setHighlightId(response?.data?.data?.subAccount?.UID); // Highlight the newly created sub-account

      if (response?.data?.success) {
        toast.success("Account Created Successfully", {
          value: "Account Created Successfully",
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        removeHighlight()
      }
      else {
        toast.error("Account Alredy exist", {
          value: "Account Alredy exist",
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      removeHighlight()


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



  const removeHighlight = () => {
    setTimeout(() => {
      setHighlightId(null)
    }, 2000);
  }

  // console.log(account.privateKey);

  const btnClose = () => {
    setShow(false)
  }

  return (
    //main page content
    <div className={`relative flex flex-col h-screen`}>
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
              onClick={() => cancelForm()}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sub Account Table */}
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
                <td className="py-4 px-6 flex items-center justify-between bg-white">
                  <span className="font-semibold text-gray-700">{account.Balance}</span>

                  <button
                    onClick={() => refreshBalance(account.UID)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110 flex items-center justify-center"
                  >
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
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-90"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                      >
                        View
                      </button>
                      {/* <button
                        onClick={() => handleViewTransactions(account.address)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                      >
                        View
                      </button> */}
                    </div>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*       
{openRow ===account.id &&(
  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-40 bg-black text-white text-sm rounded-lg px-3 py-2 shadow-lg'
  >detais of<b>{account.privateKey}</b>
</div>
)} */}

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
              onClick={() => cancelForm()}
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



          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              {/* Modal background (blur effect) */}
              <div
                className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
                onClick={closeModal}
              ></div>

              {/* Modal content (Slider with close button) */}
              <div className="relative bg-white p-4 rounded-lg shadow-lg z-10">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
                <Sliderimage />
              </div>
            </div>
          )}




        </div>
      )}


{/* {
  dropdownOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-3">Transaction History</h2>
        <ul className="space-y-3">
          <li className="flex justify-between items-center p-2 border-b">
            <span>Received from John</span>
            <span className="text-lg text-green-500">⬆️</span>
          </li>
          <li className="flex justify-between items-center p-2 border-b">
            <span>Sent to Alice</span>
            <span className="text-lg text-red-500">⬇️</span>
          </li>
          <li className="flex justify-between items-center p-2 border-b">
            <span>Received from Mike</span>
            <span className="text-lg text-green-500">⬆️</span>
          </li>
          <li className="flex justify-between items-center p-2 border-b">
            <span>Sent to Sarah</span>
            <span className="text-lg text-red-500">⬇️</span>
          </li>
        </ul>
        <button className='absolute top-2 right-2 text-gray-500 hover:text-white-800'>
          close
        </button>
      </div>
    </div>
  )
} */}
{dropdownOpen && (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-lg rounded-lg p-4 backdrop-blur-sm border">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <button onClick={() => setDropdownOpen(false)} className="text-gray-500 hover:text-gray-700">✖</button>
      </div>
      <ul className="space-y-3">
        <li className="flex justify-between items-center p-2 border-b">
          <span>Received from John</span>
          <span className="text-lg text-green-500">⬆️</span>
        </li>
        <li className="flex justify-between items-center p-2 border-b">
          <span>Sent to Alice</span>
          <span className="text-lg text-red-500">⬇️</span>
        </li>
        <li className="flex justify-between items-center p-2 border-b">
          <span>Received from Mike</span>
          <span className="text-lg text-green-500">⬆️</span>
        </li>
        <li className="flex justify-between items-center p-2 border-b">
          <span>Sent to Sarah</span>
          <span className="text-lg text-red-500">⬇️</span>
        </li>
      </ul>
    </div>
  )}

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
