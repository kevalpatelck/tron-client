import React, { useEffect, useState } from 'react';

const TransactionHistoryModal = ({ show, onClose, walletAddress }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!show || !walletAddress) return;

        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:4444/api/tron/transactions?address=${walletAddress}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.data.message.success) {
                    setTransactions(data.data.message.transactions);
                } else {
                    setTransactions([]);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [show, walletAddress]);

    return (
        <div 
            className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg w-96 border border-gray-300"
            style={{ display: show ? 'block' : 'none' }}
        >
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Transaction History</h2>

            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-400 text-gray-700">
                            <th className="p-2">TxID</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">From</th>
                            <th className="p-2">To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((txn) => (
                                <tr key={txn.txID} className="border-b border-gray-300 hover:bg-gray-100">
                                    <td className="p-2 truncate w-24" title={txn.txID}>{txn.txID.slice(0, 8)}...</td>
                                    <td className="p-2">{txn.raw_data.contract[0].parameter.value.amount / 1e6} TRX</td>
                                    <td className="p-2 truncate w-24" title={txn.raw_data.contract[0].parameter.value.owner_address}>{txn.raw_data.contract[0].parameter.value.owner_address.slice(0, 8)}...</td>
                                    <td className="p-2 truncate w-24" title={txn.raw_data.contract[0].parameter.value.to_address}>{txn.raw_data.contract[0].parameter.value.to_address.slice(0, 8)}...</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-600">No transactions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => {setTransactions([]),onClose()   }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TransactionHistoryModal;