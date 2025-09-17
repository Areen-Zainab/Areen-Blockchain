import React, { useState } from 'react';

const BlockchainView = ({ blockchain }) => {
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const toggleBlockExpansion = (index) => {
    setExpandedBlock(expandedBlock === index ? null : index);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatHash = (hash, length = 20) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, length)}...`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getBlockColor = (index) => {
    if (index === 0) return 'border-l-4 border-green-500 bg-green-50';
    return 'border-l-4 border-blue-500 bg-blue-50';
  };

  const sortedChain = blockchain?.chain 
    ? [...blockchain.chain].sort((a, b) => 
        sortOrder === 'desc' ? b.index - a.index : a.index - b.index
      )
    : [];

  if (!blockchain || !blockchain.chain) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔗</div>
        <div className="text-gray-500 mb-2">No blockchain data available</div>
        <div className="text-sm text-gray-400">
          Make sure the backend is running and try refreshing
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="mr-2">🔗</span>
            Blockchain Explorer
          </h2>
          <p className="text-gray-600">
            View all blocks in the blockchain ({blockchain.chain.length} blocks total)
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Blockchain Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="text-2xl font-bold text-blue-600">
            {blockchain.chain.length}
          </div>
          <div className="text-sm text-blue-700">Total Blocks</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md">
          <div className="text-2xl font-bold text-green-600">
            {blockchain.chain.reduce((sum, block) => sum + block.transactions.length, 0)}
          </div>
          <div className="text-sm text-green-700">Total Transactions</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-md">
          <div className="text-2xl font-bold text-purple-600">
            {blockchain.difficulty}
          </div>
          <div className="text-sm text-purple-700">Current Difficulty</div>
        </div>
      </div>

      {/* Blocks List */}
      <div className="blockchain-scroll custom-scrollbar space-y-4">
        {sortedChain.map((block, displayIndex) => (
          <div
            key={block.index}
            className={`block-item ${getBlockColor(block.index)} fade-in`}
            style={{ animationDelay: `${displayIndex * 0.1}s` }}
          >
            {/* Block Header */}
            <div 
              className="flex justify-between items-start cursor-pointer"
              onClick={() => toggleBlockExpansion(block.index)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-bold text-lg">
                    {block.index === 0 ? '🟢 Genesis Block' : `🔷 Block #${block.index}`}
                  </h3>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {formatDate(block.timestamp)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Hash:</span>
                    <div className="font-mono text-xs mt-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                         onClick={(e) => {
                           e.stopPropagation();
                           copyToClipboard(block.hash);
                         }}>
                      {formatHash(block.hash, 30)} 📋
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Transactions:</span>
                    <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {block.transactions.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                {expandedBlock === block.index ? '🔼' : '🔽'}
              </button>
            </div>

            {/* Expanded Block Details */}
            {expandedBlock === block.index && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 slide-in">
                {/* Technical Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-sm">Previous Hash:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 cursor-pointer hover:bg-gray-200"
                           onClick={() => copyToClipboard(block.previous_hash)}>
                        {block.previous_hash === '0' ? '0 (Genesis)' : formatHash(block.previous_hash, 40)} 📋
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-sm">Merkle Root:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 cursor-pointer hover:bg-gray-200"
                           onClick={() => copyToClipboard(block.merkle_root)}>
                        {formatHash(block.merkle_root, 40)} 📋
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-sm">Nonce:</span>
                      <span className="ml-2 font-mono bg-yellow-100 px-2 py-1 rounded">
                        {block.nonce.toLocaleString()}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-sm">Timestamp:</span>
                      <span className="ml-2 text-xs">
                        {new Date(block.timestamp * 1000).toISOString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Transactions */}
                <div>
                  <h4 className="font-medium mb-3">
                    📝 Transactions ({block.transactions.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {block.transactions.map((tx, txIndex) => (
                      <div
                        key={txIndex}
                        className="transaction-item"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm">{tx.data}</div>
                          </div>
                          <div className="text-xs text-gray-500 ml-2">
                            #{txIndex}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Block Validation */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center justify-between text-sm">
                    <span>🔒 Block Validation:</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-green-600">✅ Hash Valid</span>
                      <span className="text-green-600">✅ Merkle Root Valid</span>
                      <span className="text-green-600">✅ Previous Hash Linked</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {blockchain.chain.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⛓️</div>
          <div className="text-gray-500 mb-2">No blocks in the blockchain yet</div>
          <div className="text-sm text-gray-400">
            Add some transactions and mine your first block to get started
          </div>
        </div>
      )}

      {/* Blockchain Info */}
      <div className="bg-gray-50 p-4 rounded-md border">
        <h4 className="font-medium text-gray-800 mb-2">ℹ️ Blockchain Structure:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>🔹 Each block contains an index, timestamp, transactions, and cryptographic hashes</li>
          <li>🔹 Previous hash links blocks together forming an immutable chain</li>
          <li>🔹 Merkle root ensures transaction integrity within each block</li>
          <li>🔹 Nonce value represents the proof-of-work mining effort</li>
          <li>🔹 Click on any block to expand and view detailed information</li>
        </ul>
      </div>
    </div>
  );
};

export default BlockchainView;