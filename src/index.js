import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './components/overrides.css'; // Add this import after other CSS imports
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);