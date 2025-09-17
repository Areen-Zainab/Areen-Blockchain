import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import MiningComponent from './components/MiningComponent';
import SearchComponent from './components/SearchComponent';
import BlockchainView from './components/BlockchainView';
import StatsComponent from './components/StatsComponent';
import { apiCall } from './utils/api';
import './App.css';

const BlockchainApp = () => {
  // State management
  const [blockchain, setBlockchain] = useState(null);
  const [stats, setStats] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch blockchain data
  const fetchBlockchain = async () => {
    setIsLoading(true);
    try {
      const [blockchainData, statsData, validationData] = await Promise.all([
        apiCall('/blockchain'),
        apiCall('/stats'),
        apiCall('/validate')
      ]);
      
      setBlockchain(blockchainData);
      setStats(statsData);
      setIsValid(validationData.valid);
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchBlockchain();
  }, []);

  // Tab configuration
  const tabs = [
    { id: 'transactions', label: 'Add Transaction', icon: '➕' },
    { id: 'mining', label: 'Mine Block', icon: '⛏️' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'blockchain', label: 'View Blockchain', icon: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-gradient">
            🔗 Blockchain Demo
          </h1>
          <p className="text-gray-600 text-lg">
            A complete blockchain implementation with Go backend and React frontend
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
            <span>⚡ Proof of Work Mining</span>
            <span>🌳 Merkle Tree Verification</span>
            <span>🔍 Transaction Search</span>
            <span>📊 Real-time Stats</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1 slide-in">
            <StatsComponent stats={stats} isValid={isValid} />
            
            {/* Quick Actions */}
            <div className="mt-6 card">
              <h3 className="text-lg font-bold mb-4">⚡ Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`w-full text-left p-2 rounded ${
                    activeTab === 'transactions' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
                  }`}
                >
                  ➕ Add Transaction
                </button>
                <button
                  onClick={() => setActiveTab('mining')}
                  className={`w-full text-left p-2 rounded ${
                    activeTab === 'mining' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'
                  }`}
                >
                  ⛏️ Mine Block
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`w-full text-left p-2 rounded ${
                    activeTab === 'search' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-50'
                  }`}
                >
                  🔍 Search Data
                </button>
                <button
                  onClick={fetchBlockchain}
                  className="w-full text-left p-2 rounded hover:bg-gray-50"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md mb-6 slide-in">
              <div className="flex border-b overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="fade-in">
                    {activeTab === 'transactions' && (
                      <TransactionForm onTransactionAdded={fetchBlockchain} />
                    )}
                    
                    {activeTab === 'mining' && (
                      <MiningComponent onBlockMined={fetchBlockchain} stats={stats} />
                    )}
                    
                    {activeTab === 'search' && <SearchComponent />}
                    
                    {activeTab === 'blockchain' && <BlockchainView blockchain={blockchain} />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm fade-in">
          <div className="border-t pt-6">
            <p>🔗 Blockchain Demo - Educational Implementation</p>
            <p className="mt-2">Built with Go (Backend) + React (Frontend) + Tailwind CSS</p>
            <div className="mt-4 flex justify-center space-x-6">
              <span>🏗️ Proof of Work Algorithm</span>
              <span>🌳 Merkle Tree Structure</span>
              <span>🔒 SHA-256 Hashing</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlockchainApp;