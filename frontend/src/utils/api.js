// API utility functions for blockchain application
import { API_BASE_URL, DEFAULT_HEADERS } from './constant';

/**
 * Generic API call function
 * @param {string} endpoint - API endpoint (e.g., '/blockchain')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} - Response JSON data
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🌐 API Call: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Response:`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ API Error for ${url}:`, error);
    throw new APIError(error.message, endpoint, error);
  }
};

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, endpoint, originalError) {
    super(message);
    this.name = 'APIError';
    this.endpoint = endpoint;
    this.originalError = originalError;
  }
}

/**
 * Get complete blockchain data
 * @returns {Promise<object>} - Blockchain data
 */
export const getBlockchain = () => {
  return apiCall('/blockchain');
};

/**
 * Add a new transaction
 * @param {string} data - Transaction data
 * @returns {Promise<object>} - Success response
 */
export const addTransaction = (data) => {
  return apiCall('/transaction', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
};

/**
 * Mine a new block
 * @returns {Promise<object>} - Mining result
 */
export const mineBlock = () => {
  return apiCall('/mine', {
    method: 'POST',
  });
};

/**
 * Search for data in the blockchain
 * @param {string} query - Search query
 * @returns {Promise<object>} - Search results
 */
export const searchData = (query) => {
  return apiCall(`/search?q=${encodeURIComponent(query)}`);
};

/**
 * Validate the blockchain
 * @returns {Promise<object>} - Validation result
 */
export const validateChain = () => {
  return apiCall('/validate');
};

/**
 * Get blockchain statistics
 * @returns {Promise<object>} - Statistics data
 */
export const getStats = () => {
  return apiCall('/stats');
};

/**
 * Set mining difficulty
 * @param {number} difficulty - Difficulty level (1-6)
 * @returns {Promise<object>} - Success response
 */
export const setDifficulty = (difficulty) => {
  return apiCall('/difficulty', {
    method: 'POST',
    body: JSON.stringify({ difficulty }),
  });
};

/**
 * Fetch all blockchain data at once
 * @returns {Promise<object>} - Combined blockchain data
 */
export const fetchAllData = async () => {
  try {
    const [blockchain, stats, validation] = await Promise.all([
      getBlockchain(),
      getStats(),
      validateChain(),
    ]);
    
    return {
      blockchain,
      stats,
      isValid: validation.valid,
    };
  } catch (error) {
    console.error('Failed to fetch all data:', error);
    throw error;
  }
};

/**
 * Check if the backend is accessible
 * @returns {Promise<boolean>} - Backend status
 */
export const checkBackendHealth = async () => {
  try {
    await getStats();
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

/**
 * Retry API call with exponential backoff
 * @param {Function} apiFunction - API function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - API result or error
 */
export const retryApiCall = async (apiFunction, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`🔄 Retry attempt ${attempt}/${maxRetries} in ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Utility function to handle common API errors
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error instanceof APIError) {
    if (error.message.includes('fetch')) {
      return 'Unable to connect to the blockchain server. Please ensure the backend is running on port 8080.';
    }
    if (error.message.includes('400')) {
      return 'Invalid request. Please check your input and try again.';
    }
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
  }
  
  return error.message || 'An unexpected error occurred.';
};