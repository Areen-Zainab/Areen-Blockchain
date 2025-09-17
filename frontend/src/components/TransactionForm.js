import React, { useState } from 'react';
import { apiCall } from '../utils/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [transactionData, setTransactionData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionData.trim()) {
      setMessage('Transaction data cannot be empty');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await apiCall('/transaction', {
        method: 'POST',
        body: JSON.stringify({ data: transactionData }),
      });
      
      if (result.success) {
        setMessage(`✅ Transaction added! Pending transactions: ${result.pending_transactions}`);
        setMessageType('success');
        setTransactionData('');
        onTransactionAdded();
      } else {
        setMessage('❌ Failed to add transaction');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ Failed to add transaction. Please check if the backend is running.');
      setMessageType('error');
      console.error('Transaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  // Sample transaction examples
  const sampleTransactions = [
    "Alice sends 10 coins to Bob",
    "Bob sends 5 coins to Charlie",
    "Smart contract execution: Transfer ownership",
    "Mining reward: 50 coins to miner",
    "Exchange trade: BTC for ETH"
  ];

  const handleSampleClick = (sample) => {
    setTransactionData(sample);
    clearMessage();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">➕</span>
          Add New Transaction
        </h2>
        <p className="text-gray-600 mb-4">
          Add transaction data to the pending pool. Transactions will be included in the next mined block.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Data
          </label>
          <textarea
            value={transactionData}
            onChange={(e) => {
              setTransactionData(e.target.value);
              clearMessage();
            }}
            placeholder="Enter transaction data (e.g., 'Alice sends 10 coins to Bob')..."
            className="input-field"
            rows="4"
            disabled={isLoading}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {transactionData.length}/500 characters
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !transactionData.trim()}
          className={`w-full flex items-center justify-center ${
            isLoading || !transactionData.trim() 
              ? 'btn-disabled' 
              : 'btn-primary'
          }`}
        >
          {isLoading ? (
            <>
              <div className="spinner h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Transaction...
            </>
          ) : (
            <>
              <span className="mr-2">➕</span>
              Add Transaction
            </>
          )}
        </button>
      </form>
      
      {/* Sample Transactions */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-3">📝 Sample Transactions</h3>
        <p className="text-sm text-gray-600 mb-3">
          Click on any sample to use it as your transaction:
        </p>
        <div className="grid gap-2">
          {sampleTransactions.map((sample, index) => (
            <button
              key={index}
              onClick={() => handleSampleClick(sample)}
              className="text-left p-2 text-sm bg-gray-50 hover:bg-blue-50 rounded border transition-colors"
              disabled={isLoading}
            >
              <span className="text-blue-600 mr-2">💡</span>
              {sample}
            </button>
          ))}
        </div>
      </div>
      
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md border-l-4 ${
          messageType === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        } fade-in`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-sm">{message}</div>
              {messageType === 'success' && (
                <div className="text-xs mt-1 opacity-75">
                  Your transaction is now in the pending pool waiting to be mined.
                </div>
              )}
            </div>
            <button
              onClick={clearMessage}
              className="ml-3 text-sm opacity-50 hover:opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ How it works:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Enter your transaction data (any text describing the transaction)</li>
          <li>2. Click "Add Transaction" to add it to the pending pool</li>
          <li>3. Go to the "Mine Block" tab to mine a new block with your transactions</li>
          <li>4. Your transaction will be permanently recorded in the blockchain</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionForm;