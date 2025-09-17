import React from 'react';

const StatsComponent = ({ stats, isValid }) => {
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : 0;
  };

  const getValidationStatus = () => {
    if (isValid === undefined) return { text: '⏳', color: 'text-gray-500', bg: 'bg-gray-50' };
    return isValid 
      ? { text: '✅', color: 'text-green-600', bg: 'bg-green-50' }
      : { text: '❌', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getDifficultyInfo = (difficulty) => {
    const levels = {
      1: { label: 'Very Easy', color: 'text-green-600', bg: 'bg-green-50' },
      2: { label: 'Easy', color: 'text-green-500', bg: 'bg-green-50' },
      3: { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-50' },
      4: { label: 'Hard', color: 'text-orange-500', bg: 'bg-orange-50' },
      5: { label: 'Very Hard', color: 'text-red-500', bg: 'bg-red-50' },
      6: { label: 'Extreme', color: 'text-red-600', bg: 'bg-red-50' }
    };
    return levels[difficulty] || { label: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const validationStatus = getValidationStatus();
  const difficultyInfo = getDifficultyInfo(stats?.difficulty);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Blockchain Statistics
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Total Blocks */}
          <div className="stats-card bg-blue-50 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">
              {formatNumber(stats?.total_blocks)}
            </div>
            <div className="text-sm text-blue-700 font-medium">Total Blocks</div>
            <div className="text-xs text-blue-600 mt-1">
              {stats?.total_blocks === 1 ? 'Genesis only' : 
               stats?.total_blocks > 1 ? `${stats.total_blocks - 1} mined` : 'None'}
            </div>
          </div>
          
          {/* Pending Transactions */}
          <div className="stats-card bg-yellow-50 border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600">
              {formatNumber(stats?.pending_transactions)}
            </div>
            <div className="text-sm text-yellow-700 font-medium">Pending Transactions</div>
            <div className="text-xs text-yellow-600 mt-1">
              {stats?.pending_transactions === 0 ? 'Ready to mine' : 'Waiting for mining'}
            </div>
          </div>
          
          {/* Mining Difficulty */}
          <div className={`stats-card ${difficultyInfo.bg} border border-current border-opacity-30`}>
            <div className={`text-3xl font-bold ${difficultyInfo.color}`}>
              {stats?.difficulty || 0}
            </div>
            <div className={`text-sm font-medium ${difficultyInfo.color}`}>Mining Difficulty</div>
            <div className={`text-xs mt-1 ${difficultyInfo.color}`}>
              {difficultyInfo.label}
            </div>
          </div>
          
          {/* Chain Validation */}
          <div className={`stats-card ${validationStatus.bg} border border-current border-opacity-30`}>
            <div className={`text-3xl font-bold ${validationStatus.color}`}>
              {validationStatus.text}
            </div>
            <div className={`text-sm font-medium ${validationStatus.color}`}>Chain Validity</div>
            <div className={`text-xs mt-1 ${validationStatus.color}`}>
              {isValid === undefined ? 'Checking...' : 
               isValid ? 'All blocks valid' : 'Validation failed'}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <h3 className="text-lg font-bold mb-3 flex items-center">
          <span className="mr-2">⚡</span>
          System Status
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Backend Connection</span>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              🟢 Connected
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Blockchain State</span>
            <span className={`text-sm px-2 py-1 rounded ${
              isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isValid ? '🟢 Valid' : '🔴 Invalid'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Mining Status</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              🔵 Ready
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Transaction Pool</span>
            <span className={`text-sm px-2 py-1 rounded ${
              (stats?.pending_transactions || 0) > 0 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {(stats?.pending_transactions || 0) > 0 ? '🟡 Pending' : '⚪ Empty'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="card">
        <h3 className="text-lg font-bold mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Quick Insights
        </h3>
        
        <div className="space-y-2 text-sm">
          {stats?.total_blocks === 1 && (
            <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
              <div className="font-medium text-blue-800">🚀 Getting Started</div>
              <div className="text-blue-600">You have the genesis block! Add transactions and mine your first block.</div>
            </div>
          )}
          
          {(stats?.pending_transactions || 0) > 0 && (
            <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
              <div className="font-medium text-yellow-800">⏳ Pending Transactions</div>
              <div className="text-yellow-600">
                {stats.pending_transactions} transaction{stats.pending_transactions !== 1 ? 's' : ''} ready to be mined.
              </div>
            </div>
          )}
          
          {(stats?.total_blocks || 0) > 5 && (
            <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-400">
              <div className="font-medium text-green-800">🎉 Growing Chain</div>
              <div className="text-green-600">
                Your blockchain is growing! You now have {stats.total_blocks} blocks.
              </div>
            </div>
          )}
          
          {stats?.difficulty > 4 && (
            <div className="bg-red-50 p-3 rounded-md border-l-4 border-red-400">
              <div className="font-medium text-red-800">⚠️ High Difficulty</div>
              <div className="text-red-600">
                Mining difficulty is set to {stats.difficulty}. This will take longer to mine blocks.
              </div>
            </div>
          )}
          
          {!isValid && isValid !== undefined && (
            <div className="bg-red-50 p-3 rounded-md border-l-4 border-red-400">
              <div className="font-medium text-red-800">🚨 Chain Invalid</div>
              <div className="text-red-600">
                Blockchain validation failed. There may be tampering or corruption.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <h3 className="text-lg font-bold mb-3 flex items-center">
          <span className="mr-2">📈</span>
          Metrics
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-lg font-bold text-gray-700">
              {stats?.total_blocks ? (
                ((stats.total_blocks - 1) / Math.max(1, stats.total_blocks) * 100).toFixed(0)
              ) : 0}%
            </div>
            <div className="text-xs text-gray-600">Mined Blocks</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-lg font-bold text-gray-700">
              {Math.pow(16, stats?.difficulty || 1).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Hash Target</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsComponent;