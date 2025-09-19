// Application constants for blockchain demo

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Mining Configuration
export const MINING_DIFFICULTY = {
  MIN: 1,
  MAX: 6,
  DEFAULT: 4,
  LABELS: {
    1: 'Very Easy',
    2: 'Easy', 
    3: 'Medium',
    4: 'Hard',
    5: 'Very Hard',
    6: 'Extreme'
  },
  COLORS: {
    1: 'green',
    2: 'green',
    3: 'yellow',
    4: 'orange', 
    5: 'red',
    6: 'red'
  },
  ESTIMATES: {
    1: '~1-2 seconds',
    2: '~2-5 seconds', 
    3: '~5-15 seconds',
    4: '~15-45 seconds',
    5: '~1-5 minutes',
    6: '~5-30 minutes'
  }
};

// UI Constants
export const TABS = {
  TRANSACTIONS: 'transactions',
  MINING: 'mining',
  SEARCH: 'search', 
  BLOCKCHAIN: 'blockchain'
};

export const TAB_CONFIG = [
  { id: TABS.TRANSACTIONS, label: 'Add Transaction', icon: '➕' },
  { id: TABS.MINING, label: 'Mine Block', icon: '⛏️' },
  { id: TABS.SEARCH, label: 'Search', icon: '🔍' },
  { id: TABS.BLOCKCHAIN, label: 'View Blockchain', icon: '🔗' }
];

// Message Types
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'blockchain_search_history',
  USER_PREFERENCES: 'blockchain_user_preferences',
  LAST_DIFFICULTY: 'blockchain_last_difficulty'
};

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FADE_IN: 300,
  SLIDE_IN: 300,
  PULSE: 2000,
  LOADING_SKELETON: 1500
};

// Blockchain Constants
export const BLOCKCHAIN = {
  GENESIS_BLOCK_INDEX: 0,
  GENESIS_BLOCK_DATA: 'Genesis Block',
  GENESIS_PREVIOUS_HASH: '0',
  MAX_HASH_DISPLAY_LENGTH: 20,
  MAX_TRANSACTION_LENGTH: 500,
  DEFAULT_BLOCKS_PER_PAGE: 10
};

// Sample Data
export const SAMPLE_TRANSACTIONS = [
  "Alice sends 10 coins to Bob",
  "Bob sends 5 coins to Charlie", 
  "Smart contract execution: Transfer ownership",
  "Mining reward: 50 coins to miner",
  "Exchange trade: BTC for ETH",
  "Payment for coffee: 0.001 BTC",
  "Salary payment: 1000 USDC",
  "NFT purchase: Crypto Punk #1234",
  "Staking reward: 5% APY on 100 tokens",
  "Cross-chain bridge: ETH to Polygon"
];

export const SAMPLE_SEARCHES = [
  "Alice",
  "coins", 
  "Genesis",
  "transfer",
  "mining",
  "payment",
  "reward",
  "smart contract"
];

// Error Messages
export const ERROR_MESSAGES = {
  BACKEND_UNREACHABLE: 'Unable to connect to blockchain server. Please ensure the backend is running.',
  INVALID_TRANSACTION: 'Transaction data cannot be empty.',
  MINING_FAILED: 'Mining failed. Please try again.',
  SEARCH_FAILED: 'Search failed. Please try again.',
  VALIDATION_FAILED: 'Blockchain validation failed.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_ADDED: 'Transaction added successfully!',
  BLOCK_MINED: 'Block mined successfully!',
  DIFFICULTY_UPDATED: 'Mining difficulty updated!',
  DATA_REFRESHED: 'Data refreshed successfully!'
};

// Color Themes
export const COLORS = {
  PRIMARY: 'blue',
  SUCCESS: 'green', 
  WARNING: 'yellow',
  DANGER: 'red',
  INFO: 'blue',
  SECONDARY: 'gray'
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px', 
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px'
};

// Performance Monitoring
export const PERFORMANCE = {
  API_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  DEBOUNCE_DELAY: 300 // 300ms for search
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: process.env.REACT_APP_DARK_MODE === 'true',
  ADVANCED_STATS: process.env.REACT_APP_ADVANCED_STATS === 'true',
  EXPORT_BLOCKCHAIN: process.env.REACT_APP_EXPORT === 'true',
  REAL_TIME_UPDATES: process.env.REACT_APP_WEBSOCKETS === 'true'
};

// Application Metadata
export const APP_INFO = {
  NAME: 'Areen Blockchain',
  VERSION: '1.0.0',
  DESCRIPTION: 'A complete blockchain implementation with Go backend and React frontend',
  AUTHOR: 'Areen Blockchain Team',
  REPOSITORY: 'https://github.com/Areen-Zainab/Areen-Blockchain',
  DOCUMENTATION: 'https://blockchain-demo.com/docs'
};

// Development Helpers
export const DEV = {
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
  MOCK_API: process.env.REACT_APP_MOCK_API === 'true',
  DEBUG_MODE: process.env.REACT_APP_DEBUG === 'true'
};

// Export grouped constants for convenience
export const UI = {
  TABS,
  TAB_CONFIG,
  MESSAGE_TYPES,
  COLORS,
  ANIMATIONS
};

export const API = {
  BASE_URL: API_BASE_URL,
  HEADERS: DEFAULT_HEADERS,
  TIMEOUT: PERFORMANCE.API_TIMEOUT,
  RETRY_ATTEMPTS: PERFORMANCE.RETRY_ATTEMPTS
};

export const MESSAGES = {
  ERROR: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES
};