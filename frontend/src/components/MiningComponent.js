import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const MiningComponent = ({ onBlockMined, stats }) => {
  const [isMining, setIsMining] = useState(false);
  const [miningResult, setMiningResult] = useState(null);
  const [difficulty, setDifficulty] = useState(4);
  const [miningTime, setMiningTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');

  // Timer for mining duration
  useEffect(() => {
    let interval;
    if (isMining) {
      interval = setInterval(() => {
        setMiningTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setMiningTime(0);
    }
    return () => clearInterval(interval);
  }, [isMining]);

  // Estimate mining time based on difficulty
  useEffect(() => {
    const estimates = {
      1: '~1-2 seconds',
      2: '~2-5 seconds',
      3: '~5-15 seconds',
      4: '~15-45 seconds',
      5: '~1-5 minutes',
      6: '~5-30 minutes'
    };
    setEstimatedTime(estimates[difficulty] || 'Unknown');
  }, [difficulty]);

  const handleMine = async () => {
    if (stats?.pending_transactions === 0) {
      setMiningResult({
        success: false,
        message: 'No pending transactions to mine. Add some transactions first.'
      });
      return;
    }

    setIsMining(true);
    setMiningResult(null);
    setMiningTime(0);
    
    const startTime = Date.now();
    
    try {
      const result = await apiCall('/mine', { method: 'POST' });
      const endTime = Date.now();
      const actualTime = ((endTime - startTime) / 1000).toFixed(2);
      
      if (result.success) {
        setMiningResult({
          ...result,
          miningDuration: actualTime
        });
        onBlockMined();
      } else {
        setMiningResult({
          success: false,
          message: 'Mining failed. Please try again.'
        });
      }
    } catch (error) {
      setMiningResult({
        success: false,
        message: 'Mining failed. Please check if the backend is running.'
      });
      console.error('Mining error:', error);
    } finally {
      setIsMining(false);
    }
  };

  const handleDifficultyChange = async (newDifficulty) => {
    try {
      const result = await apiCall('/difficulty', {
        method: 'POST',
        body: JSON.stringify({ difficulty: newDifficulty }),
      });
      
      if (result.success) {
        setDifficulty(newDifficulty);
      }
    } catch (error) {
      console.error('Failed to update difficulty:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level) => {
    const colors = {
      1: 'text-green-600',
      2: 'text-green-500',
      3: 'text-yellow-500',
      4: 'text-orange-500',
      5: 'text-red-500',
      6: 'text-red-600'
    };
    return colors[level] || 'text-gray-500';
  };

  const getDifficultyLabel = (level) => {
    const labels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Very Hard',
      6: 'Extreme'
    };
    return labels[level] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">⛏️</span>
          Mine New Block
        </h2>
        <p className="text-gray-600">
          Mine a new block using Proof of Work consensus algorithm. Higher difficulty requires more computational work.
        </p>
      </div>
      
      {/* Mining Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="text-lg font-bold text-blue-600">
            {stats?.pending_transactions || 0}
          </div>
          <div className="text-sm text-blue-700">Pending Transactions</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-md">
          <div className={`text-lg font-bold ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </div>
          <div className="text-sm text-purple-700">Mining Difficulty</div>
        </div>
      </div>

      {/* Difficulty Settings */}
      <div className="border p-4 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">⚙️ Mining Difficulty</span>
          <span className={`text-sm px-2 py-1 rounded ${getDifficultyColor(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium min-w-0 flex-shrink-0">Level:</label>
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
              disabled={isMining}
            >
              {[1, 2, 3, 4, 5, 6].map(d => (
                <option key={d} value={d}>
                  {d} - {getDifficultyLabel(d)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>Estimated time: <span className="font-medium">{estimatedTime}</span></div>
            <div>Leading zeros required: <span className="font-mono font-medium">{difficulty}</span></div>
          </div>
        </div>
      </div>

      {/* Mining Button */}
      <button
        onClick={handleMine}
        disabled={isMining}
        className={`w-full flex items-center justify-center ${
          isMining ? 'btn-disabled mining-animation' : 'btn-success'
        } py-3 text-lg`}
      >
        {isMining ? (
          <>
            <div className="spinner h-5 w-5 border-b-2 border-white mr-3"></div>
            <div className="flex flex-col items-center">
              <span>Mining Block...</span>
              <span className="text-sm opacity-75">
                {formatTime(miningTime)} elapsed
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="mr-2">⛏️</span>
            Mine New Block
          </>
        )}
      </button>

      {/* Mining Progress */}
      {isMining && (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-yellow-800">🔍 Proof of Work in Progress</span>
            <span className="text-sm text-yellow-600">{formatTime(miningTime)}</span>
          </div>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>⚡ Searching for nonce value...</div>
            <div>🎯 Target: Hash starting with {difficulty} zeros</div>
            <div>💻 Computing SHA-256 hashes...</div>
          </div>
          <div className="mt-3 bg-yellow-200 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      )}
      
      {/* Mining Result */}
      {miningResult && (
        <div className={`p-4 rounded-md border-l-4 fade-in ${
          miningResult.success 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="font-medium mb-2">{miningResult.message}</div>
          {miningResult.block && (
            <div className="text-sm space-y-1">
              <div>🎉 <strong>Block #{miningResult.block.index}</strong> mined successfully!</div>
              <div>⏱️ Mining time: <strong>{miningResult.miningDuration}s</strong></div>
              <div>🔢 Nonce found: <strong>{miningResult.block.nonce.toLocaleString()}</strong></div>
              <div className="hash-text">
                🔐 Block hash: <strong>{miningResult.block.hash}</strong>
              </div>
              <div>📝 Transactions included: <strong>{miningResult.block.transactions?.length || 0}</strong></div>
            </div>
          )}
        </div>
      )}

      {/* Mining Information */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-800 mb-2">ℹ️ How Mining Works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>🔹 Collects all pending transactions</li>
          <li>🔹 Creates a new block with previous hash reference</li>
          <li>🔹 Calculates Merkle root of transactions</li>
          <li>🔹 Performs Proof of Work (finds nonce for target hash)</li>
          <li>🔹 Adds successfully mined block to the blockchain</li>
        </ul>
      </div>
    </div>
  );
};

export default MiningComponent;