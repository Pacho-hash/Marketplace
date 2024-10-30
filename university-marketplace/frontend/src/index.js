import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';  // Ensure CSS is linked, if needed

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Ensure the "root" div exists in index.html
);