import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Development helpers
if (process.env.NODE_ENV === 'development') {
  console.log('Areen Blockchain App started in development mode');
  console.log('Backend should be running on http://localhost:8080');
  console.log('Frontend running on http://localhost:3000');
}