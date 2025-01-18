import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component

// Find the root element in the HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
