import React, { useState } from 'react';
import { apiCall } from '../utils/api';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const result = await apiCall(`/search?q=${encodeURIComponent(query)}`);
      setSearchResults(result.results || []);
      
      // Add to search history (keep last 5 searches)
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 5);
        return newHistory;
      });
      
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    // Automatically search when clicking history
    setTimeout(() => {
      const event = { preventDefault: () => {} };
      handleSearch(event);
    }, 100);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    );
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const sampleSearches = [
    "Alice",
    "coins",
    "Genesis",
    "transfer",
    "mining"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          Search Blockchain
        </h2>
        <p className="text-gray-600">
          Search for transaction data across all blocks in the blockchain.
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for transaction data..."
              className="input-field flex-1"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className={`px-6 py-3 rounded-md font-medium ${
                isSearching || !query.trim() 
                  ? 'btn-disabled' 
                  : 'btn-primary'
              }`}
            >
              {isSearching ? (
                <div className="spinner h-4 w-4 border-b-2 border-white"></div>
              ) : (
                '🔍'
              )}
            </button>
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Sample Searches */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">💡 Sample Searches:</h3>
        <div className="flex flex-wrap gap-2">
          {sampleSearches.map((sample, index) => (
            <button
              key={index}
              onClick={() => setQuery(sample)}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors"
              disabled={isSearching}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">📚 Recent Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((historyItem, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(historyItem)}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                disabled={isSearching}
              >
                🕒 {historyItem}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results */}
      {hasSearched && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Search Results for "{query}"
            </h3>
            <span className="text-sm text-gray-500">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Block #{result.block_index}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(result.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Transaction:</div>
                    <div className="text-gray-800 bg-gray-50 p-2 rounded">
                      {highlightText(result.transaction, query)}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div className="hash-text">
                      Block Hash: {result.block_hash}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !isSearching ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-gray-500 mb-2">No results found</div>
              <div className="text-sm text-gray-400">
                Try searching for different keywords or check your spelling
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-8 fade-in">
          <div className="spinner h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div className="text-gray-500">Searching blockchain...</div>
        </div>
      )}

      {/* Search Information */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ Search Features:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>🔹 Case-insensitive search across all transaction data</li>
          <li>🔹 Results show block index, timestamp, and matching transactions</li>
          <li>🔹 Search terms are highlighted in yellow</li>
          <li>🔹 Recent searches are saved for quick access</li>
          <li>🔹 Real-time search across the entire blockchain</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;