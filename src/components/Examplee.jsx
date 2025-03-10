import React, { useState, useEffect } from "react";

const SubAccountTable = () => {
  const [subAccountDetails, setSubAccountDetails] = useState([]);
  const [mainBalance, setMainBalance] = useState(null);
  const mainwalletAddress = "TBRo4SycPuurP872iV6rdttuYeFa2DUNyz"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("YOUR_API_ENDPOINT"); 
        const data = await response.json();
        setSubAccountDetails(data.subAccountDetails);
        
        if (mainwalletAddress && window.tronWeb) {
          const balanceInSun = await window.tronWeb.trx.getBalance(mainwalletAddress);
          const balanceInTrx = window.tronWeb.fromSun(balanceInSun);
          setMainBalance(balanceInTrx);
          console.log("Balance in Sun:", balanceInSun);
          console.log("Balance in TRX:", balanceInTrx);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [mainwalletAddress]);

  return (
    <div>
      <h2>Sub Account Details</h2>
      <h3>Main Wallet Balance: {mainBalance ? `${mainBalance} TRX` : "Loading..."}</h3>
      
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Main Account Wallet Address</th>
            <th>Address</th>
            <th>Private Key</th>
            <th>Balance</th>
            <th>User Name</th>
            <th>User ID</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {subAccountDetails.map((account) => (
            <tr key={account._id}>
              <td>{account._id}</td>
              <td>{account.mainAccountWalletAddress}</td>
              <td>{account.address}</td>
              <td>{account.privateKey}</td>
              <td>{account.balance}</td>
              <td>{account.userName}</td>
              <td>{account.UID}</td>
              <td>{new Date(account.createdAt).toLocaleString()}</td>
              <td>{new Date(account.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubAccountTable;
